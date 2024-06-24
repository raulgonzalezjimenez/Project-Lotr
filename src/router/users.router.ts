import { Router as createRouter } from 'express';
import createDebug from 'debug';

import { type AuthInterceptor } from '../middleware/auth.interceptor';
import { type UsersController } from '../controller/user.controller';

const debug = createDebug('GONJI:users:router');

export class UsersRouter {
  router = createRouter();

  constructor(
    readonly controller: UsersController,
    readonly authInterceptor: AuthInterceptor
  ) {
    debug('Instantiated users router');

    this.router.post(
      '/register',

      controller.create.bind(controller)
    );
    this.router.post('/login', controller.login.bind(controller));

    this.router.get('/', controller.getAll.bind(controller));
    this.router.get('/:id', controller.getById.bind(controller));

    this.router.patch(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      controller.update.bind(controller)
    );
    this.router.delete(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      controller.delete.bind(controller)
    );
  }
}
