import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { User } from '@user-mgmt/core';
import * as UserSelectors from '@user-mgmt/data-access';
import { Store } from '@ngrx/store';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule],
  templateUrl: './dashboard-overview.component.html',
  styleUrls: ['./dashboard-overview.component.scss'],
})
export class DashboardOverviewComponent implements OnInit {
  users$: Observable<User[]>;
  totalUsers: number = 0;
  adminUsers: number = 0;
  regularUsers: number = 0;

  private store = inject(Store);

  constructor() {
    this.users$ = this.store.select(UserSelectors.selectUsers);
  }

  ngOnInit() {
    this.users$.subscribe((users) => {
      this.totalUsers = users?.length || 0;
      this.adminUsers = users?.filter((u: User) => u.role === 'Admin').length || 0;
      this.regularUsers = users?.filter((u: User) => u.role === 'User').length || 0;
    });
  }
}
