import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('users');
export const selectUsers = createSelector(selectUserState, (state) => state.users);
export const selectSelectedUser = createSelector(selectUserState, (state) => state.selectedUser);
export const selectLoading = createSelector(selectUserState, (state) => state.loading);
export const selectError = createSelector(selectUserState, (state) => state.error);
export const selectUserById = (id: number) =>
  createSelector(selectUsers, (users) => users.find((user) => user.id === id));
