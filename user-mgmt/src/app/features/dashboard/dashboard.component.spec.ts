import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { of } from 'rxjs';

import { DashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let router: Router;
  let breakpointObserver: BreakpointObserver;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardComponent, RouterTestingModule, MatToolbarModule, MatButtonModule, MatIconModule],
      providers: [
        {
          provide: BreakpointObserver,
          useValue: {
            observe: jest.fn(() => of([])),
            isMatched: jest.fn(() => false),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    breakpointObserver = TestBed.inject(BreakpointObserver);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.isCollapsed).toBe(false);
    expect(component.isMobile).toBe(false);
    expect(component.sidenavOpened).toBe(true);
    expect(component.sidenavMode).toBe('side');
  });

  it('should toggle sidebar collapse on desktop', () => {
    component.isMobile = false;
    component.isCollapsed = false;

    component.toggleSidenav();
    expect(component.isCollapsed).toBe(true);

    component.toggleSidenav();
    expect(component.isCollapsed).toBe(false);
  });

  it('should toggle mobile sidebar', () => {
    component.isMobile = true;
    component.sidenavOpened = false;

    component.toggleSidenav();
    expect(component.sidenavOpened).toBe(true);

    component.toggleSidenav();
    expect(component.sidenavOpened).toBe(false);
  });

  it('should logout and navigate to login', () => {
    const navigateSpy = jest.spyOn(router, 'navigate');
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    component.logout();

    expect(removeItemSpy).toHaveBeenCalledWith('isAuthenticated');
    expect(navigateSpy).toHaveBeenCalledWith(['/login'], { replaceUrl: true });
  });

  it('should handle touch events for mobile swipe', () => {
    component.isMobile = true;

    const touchStartEvent = {
      touches: [{ clientX: 0 }],
    } as unknown as TouchEvent;
    component.onTouchStart(touchStartEvent);
    expect(component['touchStartX']).toBe(0);

    const touchEndEvent = {
      changedTouches: [{ clientX: 100 }],
    } as unknown as TouchEvent;
    component.onTouchEnd(touchEndEvent);
    expect(component.sidenavOpened).toBe(true);
  });

  it('should render sidebar and main content', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.sidebar')).toBeTruthy();
    expect(compiled.querySelector('.main-content')).toBeTruthy();
    expect(compiled.querySelector('mat-toolbar')).toBeTruthy();
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });

  it('should apply collapsed class when sidebar is collapsed', () => {
    component.isCollapsed = true;
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector('.sidebar');
    expect(sidebar.classList.contains('sidebar-collapsed')).toBeTruthy();
  });

  it('should apply mobile class when on mobile', () => {
    component.isMobile = true;
    fixture.detectChanges();

    const mainContent = fixture.nativeElement.querySelector('.main-content');
    expect(mainContent.classList.contains('mobile')).toBeTruthy();
  });

  it('should show mobile overlay when sidebar is opened on mobile', () => {
    component.isMobile = true;
    component.sidenavOpened = true;
    fixture.detectChanges();

    const overlay = fixture.nativeElement.querySelector('.sidebar-overlay');
    expect(overlay).toBeTruthy();
  });

  it('should apply mobile-open class to sidebar when opened on mobile', () => {
    component.isMobile = true;
    component.sidenavOpened = true;
    fixture.detectChanges();

    const sidebar = fixture.nativeElement.querySelector('.sidebar');
    expect(sidebar.classList.contains('mobile-open')).toBeTruthy();
  });

  it('should render navigation links', () => {
    const compiled = fixture.nativeElement;
    const sidebarItems = compiled.querySelectorAll('.sidebar-item');
    expect(sidebarItems.length).toBe(4);
  });
});
