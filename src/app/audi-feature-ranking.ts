import { A5, A5_AMBIENT_LIGHTING, A5_ENGINE, A5_HEADLIGHTS } from "./audi.types";

const AWESOME_PRICE_BREAKPOINT = 32000
const VERY_GOOD_PRICE_BREAKPOINT = 33000;


export const buildFeaturePointsGetterMap = (val: number) => {
  return {
    ...A5FeaturePointsGetterMap,
    price: (value: A5['price']) => (val === 1 ? (value === 123 ? 3 : 1) : (value === 456 ? 4 : 1)),
  };
}

export const A5FeaturePointsGetterMap: Record<keyof A5, Function> = {
  ambientLighting: (value: A5['ambientLighting']) =>
    value === A5_AMBIENT_LIGHTING.FULL
      ? 3
      : value === A5_AMBIENT_LIGHTING.STANDART
      ? 2
      : 1,
  price: (value: A5['price']) => {
    if (value <= AWESOME_PRICE_BREAKPOINT) {
      return 3;
    }
    if (value <= VERY_GOOD_PRICE_BREAKPOINT) {
      return 2;
    }
    return 1;
  },
  engineType: (value: A5['engineType']) => (value === A5_ENGINE.TDI ? 4 : 2),
  engineHorsePower: (value: A5['engineHorsePower']) =>
    value >= 190 && value <= 230 ? 3 : 1,
  headligts: (value: A5['headligts']) => value === A5_HEADLIGHTS.MATRIX ? 2 : 1,
  km: (value: A5['km']) => value <= 65000 ? 3 : value < 80000 ? 2 : 1,
  quattro: (value: A5['quattro']) => value ? 3 : 0,
  reverseCamera: (value: A5['reverseCamera']) => value ? 1 : -1,
  sLine: (value: A5['sLine']) => value ? 3 : 0,
  shiftPaddles: (value: A5['shiftPaddles']) => value ? 1 : 0,
};