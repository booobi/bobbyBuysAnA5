import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatBadgeModule } from '@angular/material/badge';

import { RankingConfigurationFormModule } from './ranking-configuration-form';
import { RankingDescriptionModule } from './ranking-description';
import { AnalyzeViewComponent } from './analyze-view.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    MatBadgeModule,
    RankingConfigurationFormModule,
    RankingDescriptionModule,
  ],
  declarations: [AnalyzeViewComponent],
  exports: [AnalyzeViewComponent],
})
export class AnalyzeViewModule {}
