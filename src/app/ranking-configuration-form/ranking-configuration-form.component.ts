import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-ranking-configuration-form',
  templateUrl: './ranking-configuration-form.component.html',
  styleUrls: ['./ranking-configuration-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingConfigurationFormComponent implements OnInit {

  rankingForm = new FormGroup({
    idealPriceControl: new FormControl(),
    sLinePointsControl: new FormControl(),
    quattroPointsControl: new FormControl(),
    tdiEnginePointsControl: new FormControl(),
    tfsiEnginePointsControl:  new FormControl(),
    reverseCameraPointsControl: new FormControl(),
    idealKmControl: new FormControl(),
    ledHeadlightsPointsControl: new FormControl(),
    matrixHeadlightsPointsControl: new FormControl(),

  });

  constructor() { }

  ngOnInit() {
  }

}
