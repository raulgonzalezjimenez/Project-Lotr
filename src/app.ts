import express, { type Express } from 'express';
import morgan from 'morgan';
import cors from 'cors';
import createDebug from 'debug';
import { type PrismaClient } from '@prisma/client';
import { AuthInterceptor } from './middleware/auth.interceptor.js';
import { UsersSqlRepo } from './repositories/users.sql.repo.js';
import { UsersController } from './controller/user.controller.js';
import { UsersRouter } from './router/users.router.js';
import { ErrorsMiddleware } from './middleware/errors.middleware.js';
import { CharacterSqlRepo } from './repositories/characters.sql.repo.js';
import { CharacterController } from './controller/characters.controller.js';
import { CharacterRouter } from './router/characters.router.js';
import { FilesInterceptor } from './middleware/files.interceptor.js';

const debug = createDebug('GONJI:app');
export const createApp = () => {
  debug('Creating app');
  return express();
};

export const startApp = (app: Express, prisma: PrismaClient) => {
  debug('Starting app');
  app.use(express.json());
  app.use(morgan('dev'));
  app.use(cors());

  const authInterceptor = new AuthInterceptor();
  const filesInterceptor = new FilesInterceptor();

  const userRepo = new UsersSqlRepo(prisma);
  const userController = new UsersController(userRepo);
  const userRouter = new UsersRouter(userController, authInterceptor);
  app.use('/users', userRouter.router);

  const characterRepo = new CharacterSqlRepo(prisma);
  const characterController = new CharacterController(characterRepo);
  const characterRouter = new CharacterRouter(
    characterController,
    authInterceptor,
    characterRepo,
    filesInterceptor
  );
  app.use('/character', characterRouter.router);

  const errorsMiddleware = new ErrorsMiddleware();
  app.use(errorsMiddleware.handle.bind(errorsMiddleware));
};
