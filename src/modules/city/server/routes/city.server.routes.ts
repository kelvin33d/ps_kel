import city from '../controllers/city.server.controller';

export = (app) => {
  app.route('/api/city').get(city.get);
  app.route('/api/city').post(/*city.validateSessionUser,*/ city.save);
  app.route('/api/city').put(/*city.validateSessionUser,*/ city.update);
  app.route('/api/city').delete(/*city.validateSessionUser,*/ city.destroy);
}
