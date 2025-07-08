import { Request, Response } from 'express';
import generalResponse from '../../../helper';
import { AUTH_RESPONSE } from '../enum';
import { JWT_SECRET } from '../../../config';
import jwt from 'jsonwebtoken';
import User from '../../../sequelize/models/users.modal';
import * as argon2 from 'argon2';
import { removeKeys } from '../../../utils';
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'password'],
      where: {
        email: email,
      },
    });
    if (!user) {
      return generalResponse({
        message: AUTH_RESPONSE.USER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    const isPasswordMatch = await argon2.verify(user.password, password);

    if (isPasswordMatch) {
      const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
      res.cookie('token', token);
      return generalResponse({
        data: user,
        response: res,
        message: AUTH_RESPONSE.LOGIN_SUCCESS,
        response_type: 'success',
        statusCode: 200,
      });
    }
    return generalResponse({
      response: res,
      message: AUTH_RESPONSE.INVALID_PASSWORD,
      response_type: 'failure',
      statusCode: 401,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: AUTH_RESPONSE.LOGIN_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const isLoggedInUser = async (req: Request, res: Response) => {
  try {
    const id = req.user;
    const user = await User.findOne({
      attributes: ['id', 'firstName', 'lastName', 'email', 'phone'],
      where: {
        id: id,
      },
    });
    if (!user) {
      return generalResponse({
        message: AUTH_RESPONSE.USER_NOT_FOUND,
        response: res,
        statusCode: 404,
        response_type: 'failure',
      });
    }
    return generalResponse({
      data: user,
      response: res,
      message: AUTH_RESPONSE.LOGIN_SUCCESS,
      response_type: 'success',
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: AUTH_RESPONSE.LOGIN_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, password } = req.body;
    const userExist = await User.findOne({
      where: {
        email: email,
      },
    });
    if (userExist) {
      return generalResponse({
        message: AUTH_RESPONSE.ALREADY_REGISTERED,
        response: res,
        statusCode: 400,
        response_type: 'failure',
      });
    }
    const user = await User.create({
      firstName,
      lastName,
      email,
      phone,
      password,
    });
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    res.cookie('token', token);
    return generalResponse({
      data: user,
      response: res,
      message: AUTH_RESPONSE.REGISTRATION_SUCCESS,
      response_type: 'success',
      statusCode: 200,
    });
  } catch (error) {
    console.log(error);
    return generalResponse({
      message: AUTH_RESPONSE.LOGIN_FAILURE,
      response: res,
      statusCode: 500,
      response_type: 'failure',
    });
  }
};
