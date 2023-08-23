import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { CarComponent } from './car/list/car.component';
import { ColorComponent } from './color/list/color.component';

const routes: Routes = [
  {path: '', component: AppComponent},
  {path: 'cars', component: CarComponent},
  {path: 'colors', component: ColorComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
