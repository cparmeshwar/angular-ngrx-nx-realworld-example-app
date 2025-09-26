import { userReducer } from './user.reducer';
import { initialUserState } from './user.state';
import * as UserActions from './user.actions';
import { User } from '@user-mgmt/core';

describe('UserReducer', () => {
  const mockUser: User = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'Admin',
  };

  it('should return the initial state', () => {
    const action = { type: 'Unknown' };
    const state = userReducer(initialUserState, action);

    expect(state).toBe(initialUserState);
  });

  it('should set loading to true on loadUsers', () => {
    const action = UserActions.loadUsers();
    const state = userReducer(initialUserState, action);

    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('should update users and set loading to false on loadUsersSuccess', () => {
    const users: User[] = [mockUser];
    const action = UserActions.loadUsersSuccess({ users });
    const state = userReducer({ ...initialUserState, loading: true }, action);

    expect(state.users).toEqual(users);
    expect(state.loading).toBe(false);
  });

  it('should set error and loading to false on loadUsersFailure', () => {
    const error = 'Load failed';
    const action = UserActions.loadUsersFailure({ error });
    const state = userReducer({ ...initialUserState, loading: true }, action);

    expect(state.error).toBe(error);
    expect(state.loading).toBe(false);
  });

  it('should add user to list on addUserSuccess', () => {
    const action = UserActions.addUserSuccess({ user: mockUser });
    const state = userReducer(initialUserState, action);

    expect(state.users).toEqual([mockUser]);
    expect(state.loading).toBe(false);
  });

  it('should update user in list on updateUserSuccess', () => {
    const updatedUser = { ...mockUser, name: 'Updated Name' };
    const initialState = { ...initialUserState, users: [mockUser] };
    const action = UserActions.updateUserSuccess({ user: updatedUser });
    const state = userReducer(initialState, action);

    expect(state.users).toEqual([updatedUser]);
    expect(state.selectedUser).toEqual(updatedUser);
  });

  it('should remove user from list on deleteUserSuccess', () => {
    const initialState = { ...initialUserState, users: [mockUser] };
    const action = UserActions.deleteUserSuccess({ id: 1 });
    const state = userReducer(initialState, action);

    expect(state.users).toEqual([]);
    expect(state.selectedUser).toBeNull();
  });

  it('should set selectedUser on selectUser', () => {
    const action = UserActions.selectUser({ user: mockUser });
    const state = userReducer(initialUserState, action);

    expect(state.selectedUser).toEqual(mockUser);
  });
});
