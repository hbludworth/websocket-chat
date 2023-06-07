export interface User {
  uuid: string;
  firstName: string;
  lastName: string;
  email: string;
  isAdmin: boolean;
  createdOn: Date;
}

export interface UpdateProfilePayload {
  firstName?: string;
  lastName?: string;
  email?: string;
  isAdmin: boolean;
}
