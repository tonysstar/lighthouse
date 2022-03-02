import {UserFlow as UserFlow_} from '../lighthouse-core/fraggle-rock/user-flow';

declare module UserFlow {
  export interface FlowArtifacts {
    gatherSteps: GatherStep[];
    name?: string;
  }

  export interface GatherStep {
    artifacts: LH.Artifacts;
    name: string;
    config?: LH.Config.Json;
    configContext?: LH.Config.FRContext;
  }

  /**
   * The LH runner options are not JSON serializable, so they will not be available if we are auditing user flow artifacts from disk.
   * If we are not auditing artifacts from disk, `ActiveGatherStep` contains a `runnerOptions` property for us to access the options directly.
   */
  export interface ActiveGatherStep extends GatherStep {
    runnerOptions: LH.Gatherer.FRGatherResult['runnerOptions'];
  }
}

type UserFlow = typeof UserFlow_;

export default UserFlow;
