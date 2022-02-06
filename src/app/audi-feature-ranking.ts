import {
  A5,
  A5_AMBIENT_LIGHTING,
  A5_ENGINE,
  A5_HEADLIGHTS,
} from './audi.types';
import { RankingFormValue } from './ranking-configuration-form';

export const buildFeaturePointsGetterMap = (
  rankingFormValue: RankingFormValue
): Record<keyof A5, Function> => {
  return {
    price: (car: A5) =>
      car.price >= 1.1 * rankingFormValue.idealPrice
        ? 4
        : car.price <= 0.9 * rankingFormValue.idealPrice
        ? 6
        : 5,
    ambientLighting: (car: A5) =>
      car.ambientLighting === A5_AMBIENT_LIGHTING.FULL
        ? rankingFormValue.fullAmbiencePoints
        : car.ambientLighting === A5_AMBIENT_LIGHTING.STANDART
        ? rankingFormValue.standartAmbiencePoints
        : 0,
    engineType: (car: A5) =>
      car.engineType === A5_ENGINE.TDI
        ? rankingFormValue.tdiEnginePoints
        : rankingFormValue.tfsiEnginePoints,
    engineHorsePower: (car: A5) => 0,
    headligts: (car: A5) =>
      car.headligts === A5_HEADLIGHTS.MATRIX
        ? rankingFormValue.matrixHeadlightsPoints
        : rankingFormValue.ledHeadlightsPoints,
    km: (car: A5) =>
      car.km >= 1.2 * rankingFormValue.idealKm
        ? 4
        : car.km <= 0.8 * rankingFormValue.idealKm
        ? 6
        : 5,
    quattro: (car: A5) => (car.quattro ? rankingFormValue.quattroPoints : 0),
    reverseCamera: (car: A5) =>
      car.reverseCamera ? rankingFormValue.reverseCameraPoints : 0,
    sLine: (car: A5) =>
      car.sLine ? rankingFormValue.sLinePoints : 0,
    paddleShifters: (car: A5) =>
      car.paddleShifters ? rankingFormValue.paddleShiftersPoints : 0,
  };
};
