import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CarComponent } from './car/list/car.component';
import { CarUpdateDialogComponent } from './car/update/car-update-dialog.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { ColorComponent } from './color/list/color.component';
import { ColorUpdateDialogComponent } from './color/update/color-update-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    CarComponent,
    CarUpdateDialogComponent,
    ColorComponent,
    ColorUpdateDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatTableModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
