/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

const {generateFlowReportHtml} = require('../../report/generator/report-generator.js');
const {snapshotGather} = require('./gather/snapshot-runner.js');
const {startTimespanGather} = require('./gather/timespan-runner.js');
const {navigationGather} = require('./gather/navigation-runner.js');
const Runner = require('../runner.js');
const {initializeConfig} = require('./config/config.js');

/** @typedef {Parameters<snapshotGather>[0]} FrOptions */
/** @typedef {Omit<FrOptions, 'page'> & {name?: string}} UserFlowOptions */
/** @typedef {Omit<FrOptions, 'page'> & {stepName?: string}} StepOptions */

class UserFlow {
  /**
   * @param {FrOptions['page']} page
   * @param {UserFlowOptions=} options
   */
  constructor(page, options) {
    /** @type {FrOptions} */
    this.options = {page, ...options};
    /** @type {string|undefined} */
    this.name = options?.name;
    /** @type {LH.UserFlow.ActiveGatherStep[]} */
    this._gatherSteps = [];
  }

  /**
   * @param {string} longUrl
   * @returns {string}
   */
  _shortenUrl(longUrl) {
    const url = new URL(longUrl);
    return `${url.hostname}${url.pathname}`;
  }

  /**
   * @param {LH.Artifacts} artifacts
   * @return {string}
   */
  _getDefaultStepName(artifacts) {
    const shortUrl = this._shortenUrl(artifacts.URL.finalUrl);
    switch (artifacts.GatherContext.gatherMode) {
      case 'navigation':
        return `Navigation report (${shortUrl})`;
      case 'timespan':
        return `Timespan report (${shortUrl})`;
      case 'snapshot':
        return `Snapshot report (${shortUrl})`;
    }
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  _getNextNavigationOptions(stepOptions) {
    const options = {...this.options, ...stepOptions};
    const configContext = {...options.configContext};
    const settingsOverrides = {...configContext.settingsOverrides};

    if (configContext.skipAboutBlank === undefined) {
      configContext.skipAboutBlank = true;
    }

    // On repeat navigations, we want to disable storage reset by default (i.e. it's not a cold load).
    const isSubsequentNavigation = this._gatherSteps
      .some(step => step.artifacts.GatherContext.gatherMode === 'navigation');
    if (isSubsequentNavigation) {
      if (settingsOverrides.disableStorageReset === undefined) {
        settingsOverrides.disableStorageReset = true;
      }
    }

    configContext.settingsOverrides = settingsOverrides;
    options.configContext = configContext;

    return options;
  }

  /**
   * @param {LH.NavigationRequestor} requestor
   * @param {StepOptions=} stepOptions
   */
  async navigate(requestor, stepOptions) {
    if (this.currentTimespan) throw new Error('Timespan already in progress');

    const options = this._getNextNavigationOptions(stepOptions);
    const gatherResult = await navigationGather(requestor, options);

    const providedName = stepOptions?.stepName;
    this._gatherSteps.push({
      ...gatherResult,
      name: providedName || this._getDefaultStepName(gatherResult.artifacts),
      config: options.config,
      configContext: options.configContext,
    });

    return gatherResult;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async startTimespan(stepOptions) {
    if (this.currentTimespan) throw new Error('Timespan already in progress');

    const options = {...this.options, ...stepOptions};
    const timespan = await startTimespanGather(options);
    this.currentTimespan = {timespan, options};
  }

  async endTimespan() {
    if (!this.currentTimespan) throw new Error('No timespan in progress');

    const {timespan, options} = this.currentTimespan;
    const gatherResult = await timespan.endTimespanGather();
    this.currentTimespan = undefined;

    const providedName = options?.stepName;
    this._gatherSteps.push({
      ...gatherResult,
      name: providedName || this._getDefaultStepName(gatherResult.artifacts),
      config: options.config,
      configContext: options.configContext,
    });

    return gatherResult;
  }

  /**
   * @param {StepOptions=} stepOptions
   */
  async snapshot(stepOptions) {
    if (this.currentTimespan) throw new Error('Timespan already in progress');

    const options = {...this.options, ...stepOptions};
    const gatherResult = await snapshotGather(options);

    const providedName = stepOptions?.stepName;
    this._gatherSteps.push({
      ...gatherResult,
      name: providedName || this._getDefaultStepName(gatherResult.artifacts),
      config: options.config,
      configContext: options.configContext,
    });

    return gatherResult;
  }

  /**
   * @returns {Promise<LH.FlowResult>}
   */
  async createFlowResult() {
    return auditGatherSteps(this._gatherSteps, this.name, this.options.config);
  }

  /**
   * @return {Promise<string>}
   */
  async generateReport() {
    const flowResult = await this.createFlowResult();
    return generateFlowReportHtml(flowResult);
  }

  /**
   * @return {LH.UserFlow.FlowArtifacts}
   */
  createArtifactsJson() {
    /** @type {LH.UserFlow.GatherStep[]} */
    const stepArtifacts = this._gatherSteps.map(step => ({
      name: step.name,
      artifacts: step.artifacts,
      config: step.config,
      configContext: step.configContext,
    }));

    return {
      gatherSteps: stepArtifacts,
      name: this.name,
    };
  }
}

/**
 * @param {Array<LH.UserFlow.GatherStep | LH.UserFlow.ActiveGatherStep>} gatherSteps
 * @param {string|undefined} name
 * @param {LH.Config.Json|undefined} flowConfig Must be the same as the config provided when the flow started.
 */
async function auditGatherSteps(gatherSteps, name, flowConfig) {
  if (!gatherSteps.length) {
    throw new Error('Need at least one step before getting the result');
  }

  /** @type {LH.FlowResult['steps']} */
  const steps = [];
  for (const gatherStep of gatherSteps) {
    const {artifacts, name, configContext} = gatherStep;

    let runnerOptions;
    if ('runnerOptions' in gatherStep) {
      // If the gather step is active, we can access the runner options directly.
      runnerOptions = gatherStep.runnerOptions;
    } else {
      // If the gather step is not active, we must recreate the runner options.
      // Step specific configs take precedence over a config for the entire flow.
      const configJson = gatherStep.config || flowConfig;
      const {gatherMode} = artifacts.GatherContext;
      const {config} = initializeConfig(configJson, {...configContext, gatherMode});
      runnerOptions = {
        config,
        computedCache: new Map(),
      };
    }

    const result = await Runner.audit(artifacts, runnerOptions);
    if (!result) throw new Error(`Step "${name}" did not return a result`);
    steps.push({lhr: result.lhr, name});
  }

  const url = new URL(gatherSteps[0].artifacts.URL.finalUrl);
  const flowName = name || `User flow (${url.hostname})`;
  return {steps, name: flowName};
}


module.exports = {
  UserFlow,
  auditGatherSteps,
};
