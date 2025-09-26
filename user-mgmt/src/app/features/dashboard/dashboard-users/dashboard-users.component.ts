import { Component, OnInit, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { User, CreateUser, UpdateUser } from '@user-mgmt/core';
import * as UserActions from '@user-mgmt/data-access';
import * as UserSelectors from '@user-mgmt/data-access';
import { Store } from '@ngrx/store';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dashboard-users',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
  ],
  templateUrl: './dashboard-users.component.html',
  styleUrls: ['./dashboard-users.component.scss'],
})
export class DashboardUsersComponent implements OnInit, AfterViewInit {
  users$: Observable<User[]>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  userForm: FormGroup | null = null;
  editingUser: User | null = null;
  displayedColumns: string[] = ['id', 'name', 'email', 'role', 'actions'];
  dataSource = new MatTableDataSource<User>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private store = inject(Store);
  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);

  constructor() {
    this.users$ = this.store.select(UserSelectors.selectUsers);
    this.loading$ = this.store.select(UserSelectors.selectLoading);
    this.error$ = this.store.select(UserSelectors.selectError);
  }

  ngOnInit() {
    this.store.dispatch(UserActions.loadUsers());
    this.users$.subscribe((users) => {
      this.dataSource.data = users || [];
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    const sanitizedValue = filterValue.replace(/[<>]/g, '').trim();
    this.dataSource.filter = sanitizedValue.toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  showAddForm() {
    this.editingUser = null;
    this.userForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      role: ['User', Validators.required],
    });
  }

  editUser(user: User) {
    this.editingUser = user;
    this.userForm = this.fb.group({
      name: [user.name, Validators.required],
      email: [user.email, [Validators.required, Validators.email]],
      role: [user.role, Validators.required],
    });
  }

  hideForm() {
    this.userForm = null;
    this.editingUser = null;
  }

  onSubmit() {
    if (this.userForm?.valid) {
      const rawData = this.userForm.value;
      const userData = {
        name: this.sanitizeInput(rawData.name),
        email: rawData.email.toLowerCase().trim(),
        role: rawData.role,
      };

      this.users$
        .subscribe((users) => {
          const existingUser = users?.find((user) => user.email === userData.email);
          if (this.editingUser) {
            if (existingUser && existingUser.id !== this.editingUser.id) {
              this.snackBar.open('A user with this email already exists!', 'Close', {
                duration: 3000,
              });
              return;
            }
            this.store.dispatch(
              UserActions.updateUser({
                user: { ...userData, id: this.editingUser.id },
              }),
            );
            this.snackBar.open('User updated successfully!', 'Close', {
              duration: 3000,
            });
          } else {
            if (existingUser) {
              this.snackBar.open('A user with this email already exists!', 'Close', {
                duration: 3000,
              });
              return;
            }
            this.store.dispatch(UserActions.addUser({ user: userData }));
            this.snackBar.open('User added successfully!', 'Close', {
              duration: 3000,
            });
          }
          this.hideForm();
        })
        .unsubscribe();
    }
  }

  private sanitizeInput(input: string): string {
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/[<>]/g, '')
      .trim();
  }

  deleteUser(id: number) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.store.dispatch(UserActions.deleteUser({ id }));
    }
  }
}
