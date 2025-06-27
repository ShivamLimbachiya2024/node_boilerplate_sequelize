import { Router } from 'express';
import { isLoggedInUser, loginUser, registerUser } from '../controller';
import passport, { validationMiddleware } from '../../../middleware';
import { userLoginSchema, userValidationSchema } from '../validation-schema';

const authRouter: Router = Router();

const AUTH = '/auth';
authRouter.post(`${AUTH}/login`, validationMiddleware(userLoginSchema), loginUser);
authRouter.post(
  `${AUTH}/user-logged-in`,
  passport.authenticate('jwt', { session: false }),
  isLoggedInUser
);
authRouter.post(`${AUTH}/register`, validationMiddleware(userValidationSchema), registerUser);
export default authRouter;
