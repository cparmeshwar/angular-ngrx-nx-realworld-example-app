import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { UserService } from './user.service';
import { HttpClientService } from '@user-mgmt/core';
import { User, CreateUser, UpdateUser } from '@user-mgmt/core';

describe('UserService', () => {
  let service: UserService;
  let httpClientServiceMock: any;

  beforeEach(() => {
    const mockHttpClientService = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };

    TestBed.configureTestingModule({
      providers: [UserService, { provide: HttpClientService, useValue: mockHttpClientService }],
    });

    service = TestBed.inject(UserService);
    httpClientServiceMock = TestBed.inject(HttpClientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsers', () => {
    it('should return an Observable<User[]>', () => {
      const mockUsers: User[] = [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { id: 2, name: 'Jane Doe', email: 'jane@example.com', role: 'user' },
      ];

      httpClientServiceMock.get.mockReturnValue(of(mockUsers));

      service.getUsers().subscribe((users) => {
        expect(users).toEqual(mockUsers);
      });

      expect(httpClientServiceMock.get).toHaveBeenCalledWith('http://localhost:3001/users');
    });
  });

  describe('getUser', () => {
    it('should return an Observable<User>', () => {
      const mockUser: User = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' };

      httpClientServiceMock.get.mockReturnValue(of(mockUser));

      service.getUser(1).subscribe((user) => {
        expect(user).toEqual(mockUser);
      });

      expect(httpClientServiceMock.get).toHaveBeenCalledWith('http://localhost:3001/users/1');
    });
  });

  describe('createUser', () => {
    it('should return an Observable<User> and create user with next id', () => {
      const existingUsers: User[] = [{ id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' }];
      const createUserData: CreateUser = { name: 'Jane Doe', email: 'jane@example.com', role: 'user' };
      const newUser: User = { id: 2, ...createUserData };

      httpClientServiceMock.get.mockReturnValue(of(existingUsers));
      httpClientServiceMock.post.mockReturnValue(of(newUser));

      service.createUser(createUserData).subscribe((user) => {
        expect(user).toEqual(newUser);
      });

      expect(httpClientServiceMock.get).toHaveBeenCalledWith('http://localhost:3001/users');
      expect(httpClientServiceMock.post).toHaveBeenCalledWith('http://localhost:3001/users', newUser);
    });

    it('should handle empty users list', () => {
      const existingUsers: User[] = [];
      const createUserData: CreateUser = { name: 'Jane Doe', email: 'jane@example.com', role: 'user' };
      const newUser: User = { id: 1, ...createUserData };

      httpClientServiceMock.get.mockReturnValue(of(existingUsers));
      httpClientServiceMock.post.mockReturnValue(of(newUser));

      service.createUser(createUserData).subscribe((user) => {
        expect(user).toEqual(newUser);
      });

      expect(httpClientServiceMock.post).toHaveBeenCalledWith('http://localhost:3001/users', newUser);
    });
  });

  describe('updateUser', () => {
    it('should return an Observable<User>', () => {
      const updateUserData: UpdateUser = { id: 1, name: 'John Updated', email: 'john@example.com', role: 'admin' };
      const updatedUser: User = { id: 1, name: 'John Updated', email: 'john@example.com', role: 'admin' };

      httpClientServiceMock.put.mockReturnValue(of(updatedUser));

      service.updateUser(updateUserData).subscribe((user) => {
        expect(user).toEqual(updatedUser);
      });

      expect(httpClientServiceMock.put).toHaveBeenCalledWith('http://localhost:3001/users/1', updateUserData);
    });
  });

  describe('deleteUser', () => {
    it('should return an Observable<void>', () => {
      httpClientServiceMock.delete.mockReturnValue(of(void 0));

      service.deleteUser(1).subscribe((result) => {
        expect(result).toBeUndefined();
      });

      expect(httpClientServiceMock.delete).toHaveBeenCalledWith('http://localhost:3001/users/1');
    });
  });
});
