import { combineLatest, filter, map, Observable, of, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
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
import { createValueStream } from './utils/forms.utils';
import { RankingFormValue } from './ranking-configuration-form';

const mockCars: A5[] = [
  {
    price: 123,
    ambientLighting: A5_AMBIENT_LIGHTING.STANDART,
    engineHorsePower: 190,
    engineType: A5_ENGINE.TDI,
    headligts: A5_HEADLIGHTS.LED,
    reverseCamera: true,
    km: 100000,
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
    km: 100000,
    quattro: true,
    sLine: true,
    paddleShifters: false,
  },
]

const BOBBYS_A5_FORM_VALUE: RankingFormValue = {
  idealPrice: 32000,
  sLinePoints: 3,
  quattroPoints: 4,
  idealKm: 60000,
  fullAmbiencePoints: 2,
  standartAmbiencePoints: 1,
  ledHeadlightsPoints: 2,
  matrixHeadlightsPoints: 3,
  paddleShiftersPoints: 1,
  reverseCameraPoints: 1,
  tdiEnginePoints: 3,
  tfsiEnginePoints: 1,
}
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
    'km',
    'headlights',
    'ambientLighting',
    'paddleShifters',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  destroy$ = new Subject<boolean>();

  someField = new FormControl(1);

  dataSource = new MatTableDataSource<ScoredA5>([]);

  cars$: Observable<A5[]> = of(mockCars);

  configuartionFormControl = new FormControl();

  featurePoinsGetterMap$ = createValueStream<RankingFormValue>(this.configuartionFormControl).pipe(
    filter(v => !!v),
    map(buildFeaturePointsGetterMap),
    shareReplay({refCount: true, bufferSize: 1}),
    tap(console.log),
  );

  scoredCars$: Observable<ScoredA5[]> = combineLatest([
    this.cars$,
    this.featurePoinsGetterMap$,
  ]).pipe(
    map(([cars, getterMap]) =>
      cars.map((car) => ({ ...car, score: this.calculateCarScore(car, getterMap) }))
    )
  );

  ngOnInit() {
    this.configuartionFormControl.setValue(BOBBYS_A5_FORM_VALUE);
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
        points +
        featurePointsGetterMap[a5FeatureKey as keyof A5](car),
      0
    );
  }
}
