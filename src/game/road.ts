export type RoadProgress = {
  distance: number;
  stage: number;
  goalDistance: number;
  acquiredCards: number;
  nextEncounterDistance: number;
  completed: boolean;
};

export type RoadStepResult = {
  progress: RoadProgress;
  encountered: boolean;
  reachedGoal: boolean;
};

export const ROAD_STEP_DISTANCE = 10;
export const ENCOUNTER_INTERVAL = 30;
export const DEFAULT_GOAL_DISTANCE = 150;
export const STAGE_LENGTH = 50;

export function createRoadProgress(
  goalDistance = DEFAULT_GOAL_DISTANCE,
): RoadProgress {
  return {
    distance: 0,
    stage: 1,
    goalDistance,
    acquiredCards: 0,
    nextEncounterDistance: ENCOUNTER_INTERVAL,
    completed: false,
  };
}

export function advanceRoad(
  current: RoadProgress,
  stepDistance = ROAD_STEP_DISTANCE,
): RoadStepResult {
  if (current.completed) {
    return {
      progress: current,
      encountered: false,
      reachedGoal: false,
    };
  }

  const distance = Math.min(
    current.distance + Math.max(0, stepDistance),
    current.goalDistance,
  );
  const encountered =
    distance >= current.nextEncounterDistance &&
    current.nextEncounterDistance < current.goalDistance;
  const reachedGoal =
    current.distance < current.goalDistance && distance >= current.goalDistance;

  return {
    progress: {
      ...current,
      distance,
      stage: Math.min(
        Math.floor(distance / STAGE_LENGTH) + 1,
        Math.ceil(current.goalDistance / STAGE_LENGTH),
      ),
      acquiredCards: current.acquiredCards + (encountered ? 1 : 0),
      nextEncounterDistance: encountered
        ? current.nextEncounterDistance + ENCOUNTER_INTERVAL
        : current.nextEncounterDistance,
      completed: reachedGoal,
    },
    encountered,
    reachedGoal,
  };
}
