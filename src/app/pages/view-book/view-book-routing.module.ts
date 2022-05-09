import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ViewBookPage } from './view-book.page';

const routes: Routes = [
  {
    path: '',
    component: ViewBookPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ViewBookPageRoutingModule {}
