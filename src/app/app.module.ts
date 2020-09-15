import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3FailuresTreeComponent } from './d3-failures-tree/d3-failures-tree.component';

@NgModule({
  declarations: [
    AppComponent,
    D3FailuresTreeComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
