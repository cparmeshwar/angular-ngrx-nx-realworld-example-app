import { createReducer, on } from '@ngrx/store';
import { UserState, initialUserState } from './user.state';
import * as UserActions from './user.actions';

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.loadUsers, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(UserActions.loadUsersFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(UserActions.loadUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.loadUserSuccess, (state, { user }) => ({ ...state, selectedUser: user, loading: false })),
  on(UserActions.loadUserFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(UserActions.addUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.addUserSuccess, (state, { user }) => ({
    ...state,
    users: [...state.users, user],
    loading: false,
  })),
  on(UserActions.addUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UserActions.updateUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.updateUserSuccess, (state, { user }) => ({
    ...state,
    users: state.users.map((u) => (u.id === user.id ? user : u)),
    selectedUser: user,
    loading: false,
  })),
  on(UserActions.updateUserFailure, (state, { error }) => ({ ...state, error, loading: false })),

  on(UserActions.deleteUser, (state) => ({ ...state, loading: true, error: null })),
  on(UserActions.deleteUserSuccess, (state, { id }) => ({
    ...state,
    users: state.users.filter((u) => u.id !== id),
    selectedUser: state.selectedUser?.id === id ? null : state.selectedUser,
    loading: false,
  })),
  on(UserActions.deleteUserFailure, (state, { error }) => ({ ...state, error, loading: false })),
  on(UserActions.selectUser, (state, { user }) => ({ ...state, selectedUser: user })),
);
