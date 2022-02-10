import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';

import { AnalyzeViewComponent } from './analyze-view';
import { InformationViewComponent } from './information-view';

const routes: Route[] = [
  { path: '', pathMatch: 'full', component: AnalyzeViewComponent },
  { path: 'information', component: InformationViewComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
