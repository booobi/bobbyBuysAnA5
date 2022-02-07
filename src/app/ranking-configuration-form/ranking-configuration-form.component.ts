import { Subject, takeUntil } from 'rxjs';
import {
  ChangeDetectionStrategy,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ControlValueAccessor, FormControl, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

import { createValueStream } from '../utils';
import { RankingFormValue } from './ranking-configuration-form.types';
import { MAX_MILEAGE_POINTS, MAX_PRICE_POINTS } from '../constants';

@Component({
  selector: 'app-ranking-configuration-form',
  templateUrl: './ranking-configuration-form.component.html',
  styleUrls: ['./ranking-configuration-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: RankingConfigurationFormComponent,
      multi: true,
    },
  ],
})
export class RankingConfigurationFormComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  readonly MAX_PRICE_POINTS = MAX_PRICE_POINTS;
  readonly MAX_MILEAGE_POINTS = MAX_MILEAGE_POINTS;

  rankingForm = new FormGroup({
    idealPrice: new FormControl(0),
    sLinePoints: new FormControl(0),
    quattroPoints: new FormControl(0),
    tdiEnginePoints: new FormControl(0),
    tfsiEnginePoints: new FormControl(0),
    reverseCameraPoints: new FormControl(0),
    idealMileage: new FormControl(0),
    ledHeadlightsPoints: new FormControl(0),
    matrixHeadlightsPoints: new FormControl(0),
    standartAmbiencePoints: new FormControl(0),
    fullAmbiencePoints: new FormControl(0),
    paddleShiftersPoints: new FormControl(0),
  });

  _onTouched: Function = () => ({});

  _onChange: Function = () => ({});

  private destroy$ = new Subject<boolean>();

  constructor() {}

  ngOnInit() {
    createValueStream(this.rankingForm)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this._onChange(value));
  }

  writeValue(value: RankingFormValue) {
    this.rankingForm.patchValue(value);
  }

  registerOnChange(onChange: Function) {
    this._onChange = onChange;
  }

  registerOnTouched(onTouched: Function) {
    this._onTouched = onTouched;
  }

  ngOnDestroy() {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
