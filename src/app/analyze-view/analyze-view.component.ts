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

const a5Offers: A5offer[] = [
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339509534',
    price: 34490,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 74000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=340225727',
    price: 35690,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.MATRIX,
    reverseCamera: true,
    mileage: 62000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339624150',
    price: 35780,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 26000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },

  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=340111561',
    price: 32450,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 218,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 86000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=335629846',
    price: 32650,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 45000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339077385',
    price: 33900,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.MATRIX,
    reverseCamera: true,
    mileage: 77000,
    quattro: true,
    sLine: false,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339230971',
    price: 33900,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 66000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339410033',
    price: 32950,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 58000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339943004',
    price: 34970,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 38000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=337268534',
    price: 32990,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 86000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=336884577',
    price: 32950,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 85000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=338357203',
    price: 34730,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 51000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=333222827',
    price: 34650,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 57500,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=337488568',
    price: 34902,
    ambientLighting: A5_AMBIENT_LIGHTING.FULL,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.MATRIX,
    reverseCamera: true,
    mileage: 39000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=329305693',
    price: 32980,
    ambientLighting: A5_AMBIENT_LIGHTING.NONE,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 44000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339178433',
    price: 35000,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 45500,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=337613396',
    price: 33569,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 86000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=336001229',
    price: 34960,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 62000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=333272100',
    price: 34480,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
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
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=331550090',
    price: 29930,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 218,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 49000,
    quattro: true,
    sLine: false,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=340111561',
    price: 32450,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 218,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 86000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=340414331',
    price: 35860,
    ambientLighting: A5_AMBIENT_LIGHTING.FULL,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 52000,
    quattro: false,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=337508768',
    price: 29900,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 86000,
    quattro: false,
    sLine: false,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339178433',
    price: 35000,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 45000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
  {
    link: 'https://suchen.mobile.de/fahrzeuge/details.html?id=339039576',
    price: 33839,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.MATRIX,
    reverseCamera: true,
    mileage: 82000,
    quattro: true,
    sLine: true,
    paddleShifters: true,

  }
];

const BOOOBI_A5_FORM_VALUE: RankingFormValue = {
  idealPrice: 33000,
  sLinePoints: 4,
  quattroPoints: 2,
  idealMileage: 80000,
  standartAmbiencePoints: 2,
  fullAmbiencePoints: 3,
  ledHeadlightsPoints: 2,
  matrixHeadlightsPoints: 3,
  paddleShiftersPoints: 1,
  reverseCameraPoints: 3,
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

  configuartionFormControl = new FormControl(BOOOBI_A5_FORM_VALUE);

  offers$: Observable<A5offer[]> = of(a5Offers);

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

  scoredOffers$: Observable<ScoredA5offer[]> = combineLatest([
    this.offers$,
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
    this.scoredOffers$.pipe(takeUntil(this.destroy$)).subscribe(scoredOffers => {
      this.dataSource.data = scoredOffers;
      this.dataSource.sort = this.sort;
    });

    this.featurePoinsGetterMap$.subscribe(console.log);
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.sort.sort(({ id: 'score', start: 'desc'}) as MatSortable);
  }

  medalClassGetter$: Observable<(carScore: number) => string> = this.scoredOffers$.pipe(map(scoredOffers => offerScore => {
    const sortedScores = [...(new Set(scoredOffers.map(scoredOffer => scoredOffer.score)))].sort().reverse();
    return this.getScoreClass(sortedScores.indexOf(offerScore)); 
  } ))

  getScoreClass(index: number) {
    let offerMedalTypeClass;
    switch(index) {
      case 0: {
        offerMedalTypeClass = 'offer-medal--gold';
        break;
      }
      case 1: {
        offerMedalTypeClass = 'offer-medal--silver';
        break;
      }
      case 2: {
        offerMedalTypeClass = 'offer-medal--bronze';
        break;
      }
      default: return '';
    }
    return `offer-medal ${offerMedalTypeClass}`
  }

  onReset() {
    this.configuartionFormControl.setValue(BOOOBI_A5_FORM_VALUE);
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