export interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

export interface CreateUser {
  name: string;
  email: string;
  role: string;
}

export interface UpdateUser extends Partial<CreateUser> {
  id: number;
}
