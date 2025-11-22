import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PublicSubmissionComponent } from './public-submission/public-submission.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';

const routes: Routes = [
  { path: '', component: PublicSubmissionComponent },
  { path: 'admin', component: AdminPanelComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
