import {
  combineLatest,
  map,
  Observable,
  of,
  shareReplay,
  Subject,
  takeUntil,
} from 'rxjs';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';

import { buildFeaturePointsGetterMap } from './audi-feature-ranking';
import {
  A5,
  A5_AMBIENT_LIGHTING,
  A5_ENGINE,
  A5_HEADLIGHTS,
  ScoredA5,
} from './audi.types';
import { createValueStream } from './utils';
import { RankingFormValue } from './ranking-configuration-form';
import { MAX_MILEAGE_POINTS, MAX_PRICE_POINTS } from './constants';

const mockCars: A5[] = [
  {
    price: 123,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    mileage: 100000,
    quattro: true,
    sLine: true,
    paddleShifters: false,
  },
  {
    price: 456,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: false,
    mileage: 100000,
    quattro: true,
    sLine: true,
    paddleShifters: true,
  },
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
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
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

  dataSource = new MatTableDataSource<ScoredA5>([]);

  configuartionFormControl = new FormControl(BOBBYS_A5_FORM_VALUE);

  cars$: Observable<A5[]> = of(mockCars);

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

  scoredCars$: Observable<ScoredA5[]> = combineLatest([
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
  }

  onReset() {
    this.configuartionFormControl.setValue(BOBBYS_A5_FORM_VALUE);
  }

  private calculateCarScore(car: A5, featurePointsGetterMap: any) {
    return Object.entries(car).reduce(
      (points, [a5FeatureKey]) =>
        points + featurePointsGetterMap[a5FeatureKey as keyof A5](car),
      0
    );
  }
}
