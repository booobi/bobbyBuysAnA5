import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { RankingDescriptionComponent } from './ranking-description.component';

@NgModule({
  imports: [CommonModule, MatButtonModule],
  declarations: [RankingDescriptionComponent],
  exports: [RankingDescriptionComponent],
})
export class RankingDescriptionModule {}
