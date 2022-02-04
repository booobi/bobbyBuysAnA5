import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, map, Observable, of, shareReplay, Subject, takeUntil, tap } from 'rxjs';
import { A5FeaturePointsGetterMap, buildFeaturePointsGetterMap } from './audi-feature-ranking';
import {
  A5,
  A5_AMBIENT_LIGHTING,
  A5_ENGINE,
  A5_HEADLIGHTS,
  ScoredA5,
} from './audi.types';

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
    shiftPaddles: false,
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
    shiftPaddles: false,
  },
]
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent implements AfterViewInit, OnDestroy {
  readonly A5FeaturePointsGetterMap = A5FeaturePointsGetterMap;

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
    'shiftPaddles',
  ];

  @ViewChild(MatSort) sort!: MatSort;

  destroy$ = new Subject<boolean>();

  someField = new FormControl();

  dataSource = new MatTableDataSource<ScoredA5>([]);

  cars$: Observable<A5[]> = of(mockCars);

  featurePoinsGetterMap$ = this.someField.valueChanges.pipe(
    map(buildFeaturePointsGetterMap),
    shareReplay({refCount: true, bufferSize: 1}),
    tap(console.log)
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

  private calculateCarScore(car: A5, featurePointsGetterMap: any) {
    return Object.entries(car).reduce(
      (points, [a5FeatureKey, a5FeatureValue]) =>
        points +
        featurePointsGetterMap[a5FeatureKey as keyof A5](a5FeatureValue),
      0
    );
  }
}
