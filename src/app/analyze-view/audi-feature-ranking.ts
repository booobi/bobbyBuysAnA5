import {
  BASE_MILEAGE_DEVIATION_PERCENTAGE,
  BASE_PRICE_DEVIATION_PERCENTAGE,
  MAX_MILEAGE_POINTS,
  MAX_PRICE_POINTS,
  SUBSEQUENT_DEVIATION_PERCENTAGE,
} from '../constants';
import {
  A5offer,
  A5_AMBIENT_LIGHTING,
  A5_ENGINE,
  A5_HEADLIGHTS,
} from './audi.types';
import { RankingFormValue } from './ranking-configuration-form';

export const calculateDeviationPoints = (
  carAmount: number,
  idealAmount: number,
  featureBaseDeviationPercentage: number,
  maxFeaturePoints: number
) => {
  const chosenDeviationDecimal = featureBaseDeviationPercentage / 100;
  const subsequentDeviationDecimal = SUBSEQUENT_DEVIATION_PERCENTAGE / 100;
  // if >= 0 - the car costs less
  // if < 0 - the car costs more
  const carPriceDeviationDecimal = 1 - carAmount / idealAmount;
  const carPriceDeviationFromIdeal = Math.abs(
    carPriceDeviationDecimal / chosenDeviationDecimal
  );

  if (carPriceDeviationDecimal > 0 || carPriceDeviationFromIdeal <= 1) {
    return maxFeaturePoints;
  }

  // car amount is more than DEVIATION_PERCENTAGE above idealPrice
  const subsequentDeviationAmount = idealAmount * subsequentDeviationDecimal;
  // calculate subsequent deviation using subsequentDeviationDecimal (usually will be less than chosenDeviationDecimal)
  const carSubsequentDevations = Math.floor(
    (carAmount - idealAmount * (1 + chosenDeviationDecimal)) /
      subsequentDeviationAmount
  );

  // subscract 1 point for each deviation
  const pointsAwarded = maxFeaturePoints - Math.floor(carSubsequentDevations);

  return pointsAwarded >= 0 ? pointsAwarded : 0;
};

export const buildFeaturePointsGetterMap = (
  rankingFormValue: RankingFormValue
): Record<keyof A5offer, Function> => {
  return {
    link: (car: A5offer) => 0,
    price: (car: A5offer) =>
      calculateDeviationPoints(
        car.price,
        rankingFormValue.idealPrice,
        BASE_PRICE_DEVIATION_PERCENTAGE,
        MAX_PRICE_POINTS
      ),
    ambientLighting: (car: A5offer) =>
      car.ambientLighting === A5_AMBIENT_LIGHTING.FULL
        ? rankingFormValue.fullAmbiencePoints
        : car.ambientLighting === A5_AMBIENT_LIGHTING.STANDART
        ? rankingFormValue.standartAmbiencePoints
        : 0,
    engineType: (car: A5offer) =>
      car.engineType === A5_ENGINE.TDI
        ? rankingFormValue.tdiEnginePoints
        : rankingFormValue.tfsiEnginePoints,
    engineHorsePower: (car: A5offer) => 0,
    headligts: (car: A5offer) =>
      car.headligts === A5_HEADLIGHTS.MATRIX
        ? rankingFormValue.matrixHeadlightsPoints
        : rankingFormValue.ledHeadlightsPoints,
    mileage: (car: A5offer) =>
      calculateDeviationPoints(
        car.mileage,
        rankingFormValue.idealMileage,
        BASE_MILEAGE_DEVIATION_PERCENTAGE,
        MAX_MILEAGE_POINTS
      ),
    quattro: (car: A5offer) =>
      car.quattro ? rankingFormValue.quattroPoints : 0,
    reverseCamera: (car: A5offer) =>
      car.reverseCamera ? rankingFormValue.reverseCameraPoints : 0,
    sLine: (car: A5offer) => (car.sLine ? rankingFormValue.sLinePoints : 0),
    paddleShifters: (car: A5offer) =>
      car.paddleShifters ? rankingFormValue.paddleShiftersPoints : 0,
  };
};
