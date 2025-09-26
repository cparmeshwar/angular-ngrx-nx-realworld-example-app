import { createAction, props } from '@ngrx/store';
import { User, CreateUser, UpdateUser } from '@user-mgmt/core';

export const loadUsers = createAction('[User] Load Users');
export const loadUsersSuccess = createAction('[User] Load Users Success', props<{ users: User[] }>());
export const loadUsersFailure = createAction('[User] Load Users Failure', props<{ error: string }>());

export const loadUser = createAction('[User] Load User', props<{ id: number }>());
export const loadUserSuccess = createAction('[User] Load User Success', props<{ user: User }>());
export const loadUserFailure = createAction('[User] Load User Failure', props<{ error: string }>());

export const addUser = createAction('[User] Add User', props<{ user: CreateUser }>());
export const addUserSuccess = createAction('[User] Add User Success', props<{ user: User }>());
export const addUserFailure = createAction('[User] Add User Failure', props<{ error: string }>());

export const updateUser = createAction('[User] Update User', props<{ user: UpdateUser }>());
export const updateUserSuccess = createAction('[User] Update User Success', props<{ user: User }>());
export const updateUserFailure = createAction('[User] Update User Failure', props<{ error: string }>());

export const deleteUser = createAction('[User] Delete User', props<{ id: number }>());
export const deleteUserSuccess = createAction('[User] Delete User Success', props<{ id: number }>());
export const deleteUserFailure = createAction('[User] Delete User Failure', props<{ error: string }>());

export const selectUser = createAction('[User] Select User', props<{ user: User | null }>());
