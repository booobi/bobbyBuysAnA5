import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { InformationViewComponent } from './information-view.component';

@NgModule({
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  declarations: [InformationViewComponent],
  exports: [InformationViewComponent],
})
export class InformationViewModule {}
