import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ManagePuzzlesPage } from './manage-puzzles.page';

const routes: Routes = [
  {
    path: '',
    component: ManagePuzzlesPage
  },
  {
    path: 'new',
    loadChildren: () => import('./manage-single-puzzle/manage-single-puzzle.module').then( m => m.ManageSinglePuzzlePageModule)
  },
  {
    path: 'scaler',
    loadChildren: () => import('./puzzle-scaler/puzzle-scaler.module').then( m => m.PuzzleScalerPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ManagePuzzlesPageRoutingModule {}
