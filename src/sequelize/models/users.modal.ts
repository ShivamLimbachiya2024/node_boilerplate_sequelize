import {
  BeforeCreate,
  Column,
  CreatedAt,
  DeletedAt,
  Index,
  Model,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { DataTypes } from 'sequelize';
import * as argon2 from 'argon2';
import IUser from '../interface/users.interface';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export default class User extends Model<IUser> {
  @Column({
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  })
  declare id: number;

  @Column({
    type: DataTypes.STRING(30),
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataTypes.STRING(30),
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true,
    set(value: string) {
      this.setDataValue('email', value.toLowerCase());
    },
  })
  @Index
  declare email: string;

  @Column({
    type: DataTypes.STRING(10),
    allowNull: false,
  })
  declare phone: string;

  @Column({
    type: DataTypes.STRING,
    allowNull: false,
  })
  declare password: string;

  @CreatedAt
  declare created_at: Date;

  @UpdatedAt
  declare updated_at: Date;

  @DeletedAt
  declare deleted_at: Date;

  @BeforeCreate
  static async hashPassword(user: User) {
    const { password } = user;
    try {
      const hashPassword = await argon2.hash(password);
      user.password = hashPassword;
    } catch (error) {
      console.log(error);
    }
  }
}
