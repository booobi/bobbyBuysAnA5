import {
  A5,
  A5_AMBIENT_LIGHTING,
  A5_ENGINE,
  A5_HEADLIGHTS,
} from './audi.types';
import { MAX_PRICE_POINTS } from '../constants';
import { RankingFormValue } from './ranking-configuration-form';

const DEVIATION_PERCENTAGE = 5;

const calculateDeviationPoints = (carAmount: number, idealAmount: number) => {
  const chosenDeviationDecimal = DEVIATION_PERCENTAGE / 100;
  // if >= 0 - the car costs less
  // if < 0 - the car costs more
  const carPriceDeviationDecimal = 1 - carAmount / idealAmount;
  const carPriceDeviationFromIdeal =
    Math.abs(carPriceDeviationDecimal / chosenDeviationDecimal);

  if (carPriceDeviationDecimal > 0 || carPriceDeviationFromIdeal <= 1) {
    return 10;
  }

  // subscract 1 point for each deviation
  const pointsAwarded = 10 - Math.floor(carPriceDeviationFromIdeal);

  return pointsAwarded >= 0 ? pointsAwarded : 0; 
}

export const buildFeaturePointsGetterMap = (
  rankingFormValue: RankingFormValue
): Record<keyof A5, Function> => {
  return {
    price: (car: A5) => calculateDeviationPoints(car.price, rankingFormValue.idealPrice),
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
    mileage: (car: A5) => calculateDeviationPoints(car.mileage, rankingFormValue.idealMileage),
    quattro: (car: A5) => (car.quattro ? rankingFormValue.quattroPoints : 0),
    reverseCamera: (car: A5) =>
      car.reverseCamera ? rankingFormValue.reverseCameraPoints : 0,
    sLine: (car: A5) =>
      car.sLine ? rankingFormValue.sLinePoints : 0,
    paddleShifters: (car: A5) =>
      car.paddleShifters ? rankingFormValue.paddleShiftersPoints : 0,
  };
};
