import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';

import { AppComponent } from './app.component';
import { RankingConfigurationFormModule } from './ranking-configuration-form';
import { RankingDescriptionModule } from './ranking-description';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSortModule,
    RankingConfigurationFormModule,
    RankingDescriptionModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
