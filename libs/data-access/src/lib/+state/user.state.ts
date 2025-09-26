import { User } from '@user-mgmt/core';

export interface UserState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
}

export const initialUserState: UserState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
};
