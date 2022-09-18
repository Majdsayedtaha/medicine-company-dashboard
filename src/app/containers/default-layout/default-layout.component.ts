import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

import { navItems } from './_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
})
export class DefaultLayoutComponent implements OnInit {
  public navItems = navItems;

  public perfectScrollbarConfig = {
    suppressScrollX: true,
  };

  constructor(private auth: AuthService) {}

  ngOnInit(): void {}
}
