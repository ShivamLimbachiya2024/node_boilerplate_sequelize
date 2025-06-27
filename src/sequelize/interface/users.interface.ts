export default interface IUser {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;

  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date;
}
