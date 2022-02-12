export enum A5_ENGINE {
  TDI = 'TDI',
  TFSI = 'TFSI',
}

export enum A5_HEADLIGHTS {
  LED = 'LED',
  MATRIX = 'MATRIX',
}

export enum A5_AMBIENT_LIGHTING {
  NONE = 'NONE',
  STANDART = 'STANDART',
  FULL = 'FULL',
}

export interface A5 {
  sLine: boolean;
  quattro: boolean;
  engineType: A5_ENGINE,
  engineHorsePower: number;
  reverseCamera: boolean;
  mileage: number;
  headligts: A5_HEADLIGHTS;
  ambientLighting: A5_AMBIENT_LIGHTING;
  paddleShifters: boolean;
}

export type A5offer = A5 & { link: string, price: number }

export type ScoredA5offer = A5offer & { score: number };