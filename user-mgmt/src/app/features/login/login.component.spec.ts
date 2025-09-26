import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerSpy = jest.fn().mockImplementation(() => ({
      navigate: jest.fn(),
    }));

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: Router, useValue: routerSpy() }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize login form with required validators', () => {
    expect(component.loginForm).toBeDefined();
    expect(component.loginForm.get('username')).toBeTruthy();
    expect(component.loginForm.get('password')).toBeTruthy();

    const usernameControl = component.loginForm.get('username');
    const passwordControl = component.loginForm.get('password');

    expect(usernameControl?.validator).toBeTruthy();
    expect(passwordControl?.validator).toBeTruthy();
  });

  it('should validate email format for username', () => {
    const usernameControl = component.loginForm.get('username');

    usernameControl?.setValue('invalid-email');
    expect(usernameControl?.hasError('email')).toBeTruthy();

    usernameControl?.setValue('valid@email.com');
    expect(usernameControl?.valid).toBeTruthy();
  });

  it('should validate minimum password length', () => {
    const passwordControl = component.loginForm.get('password');

    passwordControl?.setValue('12345');
    expect(passwordControl?.hasError('minlength')).toBeTruthy();

    passwordControl?.setValue('123456');
    expect(passwordControl?.valid).toBeTruthy();
  });

  it('should make login button disabled when form is invalid', () => {
    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeTruthy();
  });

  it('should enable login button when form is valid', () => {
    component.loginForm.get('username')?.setValue('test@email.com');
    component.loginForm.get('password')?.setValue('123456');
    fixture.detectChanges();

    const submitButton = fixture.nativeElement.querySelector('button[type="submit"]');
    expect(submitButton.disabled).toBeFalsy();
  });

  it('should call router.navigate with replaceUrl on successful login', () => {
    component.loginForm.get('username')?.setValue('test@email.com');
    component.loginForm.get('password')?.setValue('123456');

    component.onSubmit();

    expect(router.navigate).toHaveBeenCalledWith(['/dashboard'], { replaceUrl: true });
  });

  it('should set authentication flag in localStorage on login', () => {
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    component.loginForm.get('username')?.setValue('test@email.com');
    component.loginForm.get('password')?.setValue('123456');

    component.onSubmit();

    expect(setItemSpy).toHaveBeenCalledWith('isAuthenticated', 'true');
  });

  it('should not navigate when form is invalid', () => {
    component.loginForm.get('username')?.setValue('');
    component.loginForm.get('password')?.setValue('');

    component.onSubmit();

    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should render form elements correctly', () => {
    const compiled = fixture.nativeElement;

    expect(compiled.querySelector('mat-card')).toBeTruthy();
    expect(compiled.querySelector('mat-card-title')).toBeTruthy();
    expect(compiled.querySelectorAll('mat-form-field')).toHaveLength(2);
    expect(compiled.querySelector('button[type="submit"]')).toBeTruthy();
  });

  it('should display validation errors for invalid email', () => {
    const usernameControl = component.loginForm.get('username');
    usernameControl?.setValue('invalid-email');
    usernameControl?.markAsTouched();
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('mat-error');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent?.trim()).toContain('valid email');
  });

  it('should display validation errors for short password', () => {
    const passwordControl = component.loginForm.get('password');
    passwordControl?.setValue('123');
    passwordControl?.markAsTouched();
    fixture.detectChanges();

    const errorElements = fixture.nativeElement.querySelectorAll('mat-error');
    expect(errorElements.length).toBeGreaterThan(0);
  });
});
