import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { D3FailuresTreeComponent } from './d3-failures-tree/d3-failures-tree.component';
import { D3FailuresGraphComponent } from './d3-failures-graph/d3-failures-graph.component';
import { TreeCollapseComponent } from './tree-collapse/tree-collapse.component';

@NgModule({
  declarations: [
    AppComponent,
    D3FailuresTreeComponent,
    D3FailuresGraphComponent,
    TreeCollapseComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
