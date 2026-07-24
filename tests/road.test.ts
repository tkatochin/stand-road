import assert from 'node:assert/strict';
import test from 'node:test';
import {
  advanceRoad,
  createRoadProgress,
  ENCOUNTER_INTERVAL,
  ROAD_STEP_DISTANCE,
} from '../src/game/road.ts';

test('進む操作で距離が増える', () => {
  const initial = createRoadProgress();
  const result = advanceRoad(initial);

  assert.equal(result.progress.distance, ROAD_STEP_DISTANCE);
  assert.equal(initial.distance, 0);
});

test('一定距離で遭遇し、カード枚数が増える', () => {
  let progress = createRoadProgress();

  for (let distance = ROAD_STEP_DISTANCE; distance <= ENCOUNTER_INTERVAL; distance += ROAD_STEP_DISTANCE) {
    progress = advanceRoad(progress).progress;
  }

  assert.equal(progress.distance, ENCOUNTER_INTERVAL);
  assert.equal(progress.acquiredCards, 1);
  assert.equal(progress.nextEncounterDistance, ENCOUNTER_INTERVAL * 2);
});

test('ステージ境界を越えるとステージが進む', () => {
  let progress = createRoadProgress();

  for (let count = 0; count < 5; count += 1) {
    progress = advanceRoad(progress).progress;
  }

  assert.equal(progress.distance, 50);
  assert.equal(progress.stage, 2);
});

test('ゴール距離を越えず、完了後は進行しない', () => {
  let progress = createRoadProgress(25);
  progress = advanceRoad(progress).progress;
  progress = advanceRoad(progress).progress;
  const goalResult = advanceRoad(progress);
  const afterGoal = advanceRoad(goalResult.progress);

  assert.equal(goalResult.progress.distance, 25);
  assert.equal(goalResult.reachedGoal, true);
  assert.equal(goalResult.progress.completed, true);
  assert.equal(afterGoal.progress.distance, 25);
  assert.equal(afterGoal.reachedGoal, false);
});
