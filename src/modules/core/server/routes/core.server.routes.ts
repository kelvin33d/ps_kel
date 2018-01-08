import core from '../controllers/core.server.controller';

export = (app) => {
  app.route('/server-error').get(core.renderServerError);

  app.route('/:url(api|modules|lib)/*').get(core.renderNotFound);

  app.route('/*').get(core.renderIndex);
}