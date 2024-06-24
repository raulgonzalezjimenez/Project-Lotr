import { Router as createRouter } from 'express';
import createDebug from 'debug';
import { type AuthInterceptor } from '../middleware/auth.interceptor';
import { type CharacterController } from '../controller/characters.controller';
import { type CharacterSqlRepo } from '../repositories/characters.sql.repo';
import { type FilesInterceptor } from '../middleware/files.interceptor';

const debug = createDebug('GONJI:characters:router');

export class CharacterRouter {
  router = createRouter();

  constructor(
    readonly controller: CharacterController,
    readonly authInterceptor: AuthInterceptor,
    readonly characterSqlRepo: CharacterSqlRepo,
    readonly filesInterceptor: FilesInterceptor
  ) {
    debug('Instantiated character router');

    this.router.get(
      '/',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getAll.bind(controller)
    );
    this.router.get(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getById.bind(controller)
    );
    this.router.get(
      '/search/:race',
      authInterceptor.authentication.bind(authInterceptor),
      controller.getByRace.bind(controller)
    );
    this.router.post(
      '/',
      authInterceptor.authentication.bind(authInterceptor),
      filesInterceptor.singleFile('imgUrl'),
      filesInterceptor.cloudinaryUpload.bind(filesInterceptor),

      controller.create.bind(controller)
    );
    this.router.patch(
      '/:id',

      filesInterceptor.singleFile('imgUrl'),
      filesInterceptor.cloudinaryUpload.bind(filesInterceptor),
      controller.update.bind(controller)
    );
    this.router.delete(
      '/:id',
      authInterceptor.authentication.bind(authInterceptor),
      authInterceptor
        .authorization(characterSqlRepo, 'userId')
        .bind(authInterceptor),
      controller.delete.bind(controller)
    );
  }
}
