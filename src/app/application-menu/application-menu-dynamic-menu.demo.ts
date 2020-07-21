import { Component, Input, OnInit } from '@angular/core';

@Component({
 selector: 'app-application-menu-dynamic-menu',
 templateUrl: 'application-menu-dynamic-menu.demo.html'
})

export class ApplicationMenuDynamicMenuDemoComponent implements OnInit {
  @Input() menuSpec: Array<any>;

  constructor() { }

  ngOnInit() { }
}
