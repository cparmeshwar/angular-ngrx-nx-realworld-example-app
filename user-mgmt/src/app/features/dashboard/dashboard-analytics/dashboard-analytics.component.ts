import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-dashboard-analytics',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './dashboard-analytics.component.html',
  styleUrls: ['./dashboard-analytics.component.scss'],
})
export class DashboardAnalyticsComponent {}
