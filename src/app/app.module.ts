import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3FailuresTreeComponent } from './d3-failures-tree/d3-failures-tree.component';
import { D3FailuresGraphComponent } from './d3-failures-graph/d3-failures-graph.component';
import { TreeCollapseComponent } from './tree-collapse/tree-collapse.component';
import { AngularD3Component } from './angular-d3/angular-d3.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    D3FailuresTreeComponent,
    D3FailuresGraphComponent,
    TreeCollapseComponent,
    AngularD3Component
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
