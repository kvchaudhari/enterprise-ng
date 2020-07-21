import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { SohoApplicationMenuComponent } from 'ids-enterprise-ng';

@Component({
  selector: 'app-application-menu-dynamic-demo',
  templateUrl: 'application-menu-dynamic.demo.html'
})

export class ApplicationMenuDynamicDemoComponent implements OnInit, AfterViewInit {
  @ViewChild(SohoApplicationMenuComponent, { static: true }) applicationMenu: SohoApplicationMenuComponent;

  public triggers: Array<string> = [];
  public menu: Array<any> = [];

  constructor() {}

  ngOnInit() {
    this.menu = [
      {
        name: 'Child One'
      },
      {
        name: 'Child Two',
        expanded: true,
        menu: [{name: 'Sub Child One'}]
      }
    ];
  }

  ngAfterViewInit() {
    setTimeout(() => this.triggers = ['#application-dynamic-menu-trigger']);
  }
}
