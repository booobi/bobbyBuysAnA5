import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-ranking-description',
  templateUrl: './ranking-description.component.html',
  styleUrls: ['./ranking-description.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RankingDescriptionComponent {

  @Input() maxPoints: number;

  @Output() reset = new EventEmitter();

  constructor() { }

  onReset() {
    this.reset.emit();
  }

}
