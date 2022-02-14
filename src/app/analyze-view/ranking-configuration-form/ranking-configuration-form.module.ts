import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';

import { RankingConfigurationFormComponent } from './ranking-configuration-form.component';


@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatListModule,
    MatIconModule,
  ],
  declarations: [RankingConfigurationFormComponent],
  exports: [RankingConfigurationFormComponent]
})
export class RankingConfigurationFormModule { }
