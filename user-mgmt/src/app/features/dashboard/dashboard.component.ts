import { Component, OnInit, OnDestroy, HostListener, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  sidenavOpened = true;
  sidenavMode: 'over' | 'side' = 'side';
  isMobile = false;
  isCollapsed = false;
  private touchStartX = 0;
  private touchEndX = 0;

  private breakpointObserver = inject(BreakpointObserver);
  private breakpointSub?: Subscription;
  private router = inject(Router);

  ngOnInit() {
    // Setup responsive sidebar
    this.breakpointSub = this.breakpointObserver
      .observe([Breakpoints.Handset, Breakpoints.TabletPortrait, Breakpoints.TabletLandscape, Breakpoints.Web])
      .subscribe(() => {
        const isHandset = this.breakpointObserver.isMatched(Breakpoints.Handset);
        const isTabletPortrait = this.breakpointObserver.isMatched(Breakpoints.TabletPortrait);

        this.isMobile = isHandset || isTabletPortrait;
        this.sidenavMode = this.isMobile ? 'over' : 'side';

        // On mobile, sidebar should be closed by default
        if (this.isMobile) {
          this.sidenavOpened = false;
          this.isCollapsed = false; // Don't collapse on mobile
        } else {
          // On desktop, sidebar should be open by default
          this.sidenavOpened = true;
        }
      });
  }

  ngOnDestroy() {
    this.breakpointSub?.unsubscribe();
  }

  @HostListener('touchstart', ['$event'])
  onTouchStart(event: TouchEvent) {
    if (!this.isMobile) return;
    this.touchStartX = event.touches[0].clientX;
  }

  @HostListener('touchend', ['$event'])
  onTouchEnd(event: TouchEvent) {
    if (!this.isMobile) return;
    this.touchEndX = event.changedTouches[0].clientX;
    this.handleSwipe();
  }

  private handleSwipe() {
    const swipeThreshold = 50; // minimum distance for swipe
    const swipeDistance = this.touchEndX - this.touchStartX;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance > 0 && !this.sidenavOpened) {
        // Swipe right - open sidebar
        this.sidenavOpened = true;
      } else if (swipeDistance < 0 && this.sidenavOpened) {
        // Swipe left - close sidebar
        this.sidenavOpened = false;
      }
    }
  }

  toggleSidenav() {
    if (this.isMobile) {
      this.sidenavOpened = !this.sidenavOpened;
    } else {
      this.isCollapsed = !this.isCollapsed;
    }
  }

  logout() {
    // Clear authentication state
    localStorage.removeItem('isAuthenticated');
    // Navigate to login and replace current URL
    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
