import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort, MatSortable } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, map, Observable, of, shareReplay, Subject, takeUntil } from 'rxjs';
import { MAX_MILEAGE_POINTS, MAX_PRICE_POINTS } from '../constants';
import { createValueStream } from '../utils';
import { buildFeaturePointsGetterMap } from './audi-feature-ranking';

import { A5, A5offer, A5_AMBIENT_LIGHTING, A5_ENGINE, A5_HEADLIGHTS, ScoredA5offer } from './audi.types';
import { RankingFormValue } from './ranking-configuration-form';
import { tableStyleConfig } from './table-stye.config';


const mockCars: A5offer[] = [
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=334091380',
    price: 32499,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 38154,
    quattro: true,
    sLine: false,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=331432532',
    price: 33650,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 58800,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=338522460',
    price: 33990,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 46000,
    quattro: false,
    sLine: false,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=338418196',
    price: 36000,
    ambientLighting: A5_AMBIENT_LIGHTING.FULL,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 52000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=334091380',
    price: 32499,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 38154,
    quattro: true,
    sLine: false,
    paddleShifters: true,
  },

  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=335629846',
    price: 35025,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 45775,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=338404650',
    price: 34990,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 54000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=330120221',
    price: 33450,
    ambientLighting: A5_AMBIENT_LIGHTING.FULL,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 41360,
    quattro: false,
    sLine: false,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=337179364',
    price: 30680,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 73400,
    quattro: false,
    sLine: false,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339217737',
    price: 35800,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 29000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=327590824',
    price: 35900,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 218,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 74990,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=338398773',
    price: 33333,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 60000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=329297487',
    price: 35860,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 37791,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=337466441',
    price: 34550,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 77750,
    quattro: false,
    sLine: true,
    paddleShifters: true,

  }
];

const BOBBYS_A5_FORM_VALUE: RankingFormValue = {
  idealPrice: 33000,
  sLinePoints: 4,
  quattroPoints: 4,
  idealMileage: 60000,
  fullAmbiencePoints: 2,
  standartAmbiencePoints: 1,
  ledHeadlightsPoints: 2,
  matrixHeadlightsPoints: 3,
  paddleShiftersPoints: 1,
  reverseCameraPoints: 1,
  tdiEnginePoints: 10,
  tfsiEnginePoints: 5,
};

@Component({
  selector: 'app-analyze-view',
  templateUrl: './analyze-view.component.html',
  styleUrls: ['./analyze-view.component.scss']
})
export class AnalyzeViewComponent implements OnInit {
  readonly tableStyleConfig = tableStyleConfig;
  readonly displayedColumns = [
    'score',
    'link',
    'price',
    'sLine',
    'quattro',
    'engine',
    'reverseCamera',
    'mileage',
    'headlights',
    'ambientLighting',
    'paddleShifters',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  dataSource = new MatTableDataSource<ScoredA5offer>([]);

  configuartionFormControl = new FormControl(BOBBYS_A5_FORM_VALUE);

  cars$: Observable<A5offer[]> = of(mockCars);

  maxPoints$ = createValueStream<RankingFormValue>(this.configuartionFormControl).pipe(
    map((configFormValue) => {
      return (
        MAX_PRICE_POINTS +
        configFormValue.sLinePoints +
        configFormValue.quattroPoints +
        // max of engines
        Math.max(
          configFormValue.tdiEnginePoints,
          configFormValue.tfsiEnginePoints
        ) +
        configFormValue.reverseCameraPoints +
        MAX_MILEAGE_POINTS +
        // max of headlights
        Math.max(
          configFormValue.ledHeadlightsPoints,
          configFormValue.matrixHeadlightsPoints
        ) +
        // max of ambient lighting
        Math.max(
          configFormValue.standartAmbiencePoints,
          configFormValue.fullAmbiencePoints
        ) +
        configFormValue.paddleShiftersPoints
      );
    })
  );

  featurePoinsGetterMap$ = createValueStream<RankingFormValue>(
    this.configuartionFormControl
  ).pipe(
    map(buildFeaturePointsGetterMap),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  scoredCars$: Observable<ScoredA5offer[]> = combineLatest([
    this.cars$,
    this.featurePoinsGetterMap$,
  ]).pipe(
    map(([cars, getterMap]) =>
      cars.map((car) => ({
        ...car,
        score: this.calculateCarScore(car, getterMap),
      }))
    )
  );

  private destroy$ = new Subject<boolean>();

  ngOnInit() {
    this.scoredCars$.pipe(takeUntil(this.destroy$)).subscribe((scoredCars) => {
      this.dataSource.data = scoredCars;
      this.dataSource.sort = this.sort;
    });
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.sort.sort(({ id: 'score', start: 'desc'}) as MatSortable);
  }

  medalClassGetter$: Observable<(carScore: number) => string> = this.scoredCars$.pipe(map(scoredCars => carScore => {
    const sortedScores = [...(new Set(scoredCars.map(scoredCar => scoredCar.score)))].sort().reverse();
    return this.getScoreClass(sortedScores.indexOf(carScore)); 
  } ))

  getScoreClass(index: number) {
    switch(index) {
      case 0: {
        return 'offer-gold-medal';
      }
      case 1: {
        return 'offer-silver-medal';
      }
      case 2: {
        return 'offer-bronze-medal';
      }
      default: return '';
    } 
  }

  onReset() {
    this.configuartionFormControl.setValue(BOBBYS_A5_FORM_VALUE);
  }

  private calculateCarScore(car: A5offer, featurePointsGetterMap: any) {
    return Object.keys(car)
      .reduce(
        (points, a5FeatureKey) =>
          points + featurePointsGetterMap[a5FeatureKey as keyof A5](car),
        0
      );
  }
}