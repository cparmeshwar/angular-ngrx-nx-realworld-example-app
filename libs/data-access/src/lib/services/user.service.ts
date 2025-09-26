import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { HttpClientService } from '@user-mgmt/core';
import { User, CreateUser, UpdateUser } from '@user-mgmt/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private http = inject(HttpClientService);

  private apiUrl = 'http://localhost:3001';

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users`);
  }

  getUser(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/${id}`);
  }

  createUser(user: CreateUser): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}/users`).pipe(
      map((users) => {
        const maxId = users.length > 0 ? Math.max(...users.map((u) => u.id)) : 0;
        const nextId = maxId + 1;
        const newUser = { ...user, id: nextId };
        return newUser;
      }),
      mergeMap((newUser) => this.http.post<User, User>(`${this.apiUrl}/users`, newUser)),
    );
  }

  updateUser(user: UpdateUser): Observable<User> {
    return this.http.put<User, UpdateUser>(`${this.apiUrl}/users/${user.id}`, user);
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/users/${id}`);
  }
}
