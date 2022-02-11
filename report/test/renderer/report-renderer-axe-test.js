/**
 * @license Copyright 2021 The Lighthouse Authors. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
 */
'use strict';

/* eslint-env jest */

import puppeteer from 'puppeteer';

import sampleResults from '../../../lighthouse-core/test/results/sample_v2.json';
import reportGenerator from '../../generator/report-generator.js';
import axeLib from '../../../lighthouse-core/lib/axe.js';

describe('ReportRendererAxe', () => {
  describe('with aXe', () => {
    let browser;

    beforeAll(async () => {
      browser = await puppeteer.launch();
    });

    afterAll(async () => {
      await browser.close();
    });

    it('renders without axe violations', async () => {
      const page = await browser.newPage();
      const htmlReport = reportGenerator.generateReportHtml(sampleResults);
      await page.setContent(htmlReport);

      // Superset of Lighthouse's aXe config
      const config = {
        runOnly: {
          type: 'tag',
          values: [
            'wcag2a',
            'wcag2aa',
          ],
        },
        resultTypes: ['violations', 'inapplicable'],
        rules: {
          'tabindex': {enabled: true},
          'accesskeys': {enabled: true},
          'heading-order': {enabled: true},
          'meta-viewport': {enabled: true},
          'aria-treeitem-name': {enabled: true},
        },
      };

      await page.evaluate(axeLib.source);
      // eslint-disable-next-line no-undef
      const axeResults = await page.evaluate(config => axe.run(config), config);

      // Color contrast failure only pops up if this pptr is run headfully.
      // There are currently 27 problematic nodes, primarily audit display text and explanations.
      // TODO: fix these failures, regardless.
      // {
      //   id: 'color-contrast',
      // },

      expect(axeResults.violations.find(v => v.id === 'duplicate-id')).toMatchObject({
        id: 'duplicate-id',
        nodes: [
          // We use these audits in multiple categories. Makes sense.
          {html: '<div class="lh-audit lh-audit--binary lh-audit--pass" id="viewport">'},
          {html: '<div class="lh-audit lh-audit--binary lh-audit--fail" id="image-alt">'},
          {html: '<div class="lh-audit lh-audit--binary lh-audit--pass" id="document-title">'},
        ],
      });

      const axeSummary = axeResults.violations.map((v) => {
        return {
          id: v.id,
          message: v.nodes.map((n) => n.failureSummary).join('\n'),
        };
      });
      expect(axeSummary).toMatchInlineSnapshot(`
Array [
  Object {
    "id": "color-contrast",
    "message": "Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 2.44 (foreground color: #999a9b, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 2.44 (foreground color: #999a9b, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 3.98 (foreground color: #6f7072, background color: #e3e7eb, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 3.98 (foreground color: #6f7072, background color: #e3e7eb, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.3 (foreground color: #7a7a7a, background color: #ffffff, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #707273, background color: #e7ebee, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 3.98 (foreground color: #6f7072, background color: #e3e7eb, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.03 (foreground color: #0066ff, background color: #e7ebee, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 3.84 (foreground color: #757575, background color: #e7ebee, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 3.98 (foreground color: #6f7072, background color: #e3e7eb, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.21 (foreground color: #008800, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.18 (foreground color: #0066ff, background color: #eceff2, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.4 (foreground color: #008800, background color: #f8f9fa, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.4 (foreground color: #008800, background color: #f8f9fa, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.4 (foreground color: #008800, background color: #f8f9fa, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.18 (foreground color: #0066ff, background color: #eceff2, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 2.44 (foreground color: #999a9b, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.18 (foreground color: #0066ff, background color: #eceff2, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.18 (foreground color: #0066ff, background color: #eceff2, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.17 (foreground color: #757575, background color: #f2f4f6, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.16 (foreground color: #757576, background color: #f2f4f6, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.09 (foreground color: #727375, background color: #eceff2, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.3 (foreground color: #7a7a7a, background color: #ffffff, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.3 (foreground color: #7a7a7a, background color: #ffffff, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.22 (foreground color: #777778, background color: #f8f9fa, font size: 8.1pt (10.8px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.38 (foreground color: #0066ff, background color: #f2f4f6, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.4 (foreground color: #008800, background color: #f8f9fa, font size: 10.5pt (14px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1
Fix any of the following:
  Element has insufficient color contrast of 4.37 (foreground color: #757575, background color: #f8f9fa, font size: 9.0pt (12px), font weight: normal). Expected contrast ratio of 4.5:1",
  },
  Object {
    "id": "duplicate-id",
    "message": "Fix any of the following:
  Document has multiple static elements with the same id attribute: viewport
Fix any of the following:
  Document has multiple static elements with the same id attribute: image-alt
Fix any of the following:
  Document has multiple static elements with the same id attribute: document-title",
  },
]
`);

      expect(axeResults.violations).toMatchSnapshot();
    },
    // This test takes 10s on fast hardware, but can take longer in CI.
    // https://github.com/dequelabs/axe-core/tree/b573b1c1/doc/examples/jest_react#timeout-issues
    /* timeout= */ 20_000
    );
  });
});
