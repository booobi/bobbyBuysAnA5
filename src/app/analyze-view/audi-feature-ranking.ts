import {
  A5,
  A5offer,
  A5_AMBIENT_LIGHTING,
  A5_ENGINE,
  A5_HEADLIGHTS,
} from './audi.types';
import { MAX_PRICE_POINTS } from '../constants'; // TODO: use this
import { RankingFormValue } from './ranking-configuration-form';

const DEVIATION_PERCENTAGE = 5;

const calculateDeviationPoints = (carAmount: number, idealAmount: number) => {
  const chosenDeviationDecimal = DEVIATION_PERCENTAGE / 100;
  const subsequentDeviationDecimal = 1/100;
  // if >= 0 - the car costs less
  // if < 0 - the car costs more
  const carPriceDeviationDecimal = 1 - carAmount / idealAmount;
  const carPriceDeviationFromIdeal =
    Math.abs(carPriceDeviationDecimal / chosenDeviationDecimal);

  if (carPriceDeviationDecimal > 0 || carPriceDeviationFromIdeal <= 1) {
    return 10;
  }

  // car amount is more than DEVIATION_PERCENTAGE above idealPrice
  const subsequentDeviationAmount = idealAmount * subsequentDeviationDecimal;
  // calculate subsequent deviation using subsequentDeviationDecimal (usually will be less than chosenDeviationDecimal)
  const carSubsequentDevations = Math.floor((idealAmount*(1 + chosenDeviationDecimal) - idealAmount) / subsequentDeviationAmount)
  
  console.log({ carAmount, subsequentDeviationAmount, carSubsequentDevations })


  // subscract 1 point for each deviation
  const pointsAwarded = 10 - Math.floor(carPriceDeviationFromIdeal);

  return pointsAwarded >= 0 ? pointsAwarded : 0; 
}

export const buildFeaturePointsGetterMap = (
  rankingFormValue: RankingFormValue
): Record<keyof A5offer, Function> => {
  return {
    link: (car: A5offer) => 0,
    price: (car: A5offer) => calculateDeviationPoints(car.price, rankingFormValue.idealPrice),
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
    mileage: (car: A5offer) => calculateDeviationPoints(car.mileage, rankingFormValue.idealMileage),
    quattro: (car: A5offer) => (car.quattro ? rankingFormValue.quattroPoints : 0),
    reverseCamera: (car: A5offer) =>
      car.reverseCamera ? rankingFormValue.reverseCameraPoints : 0,
    sLine: (car: A5offer) =>
      car.sLine ? rankingFormValue.sLinePoints : 0,
    paddleShifters: (car: A5offer) =>
      car.paddleShifters ? rankingFormValue.paddleShiftersPoints : 0,
  };
};
