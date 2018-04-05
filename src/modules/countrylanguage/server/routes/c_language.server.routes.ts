import c_lang from '../controllers/c_language.server.controller';

export = (app) => {
  app.route('/api/lang').get(c_lang.get);
  app.route('/api/lang').post(/*c_lang.validateSessionUser,*/ c_lang.save);
  app.route('/api/lang').put(/*c_lang.validateSessionUser,*/ c_lang.update);
  app.route('/api/lang').delete(/*c_lang.validateSessionUser,*/ c_lang.destroy);
}
