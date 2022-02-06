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
  price: number;
  sLine: boolean;
  quattro: boolean;
  engineType: A5_ENGINE,
  engineHorsePower: number;
  reverseCamera: boolean;
  km: number;
  headligts: A5_HEADLIGHTS;
  ambientLighting: A5_AMBIENT_LIGHTING;
  paddleShifters: boolean;
}

export type ScoredA5 = A5 & { score: number };