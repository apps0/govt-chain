export class User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  addressLines: string;
  licenseNo: string;
  type: UserType;
  status: string;
}

export type UserType = "user" | "contractor" | "admin";

export class UserMap {
  id?: number;
  uid?: string;
  userType: UserType;
}
