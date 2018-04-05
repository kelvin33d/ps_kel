import country from '../controllers/country.server.controller';

export = (app) => {
  app.route('/api/country').get(country.getAllCountries);
  app.route('/api/country/me').get(/*country.validateSessionUser,*/ country.get);
  app.route('/api/country').post(/*country.validateSessionUser,*/ country.save);
  app.route('/api/country').put(/*country.validateSessionUser,*/ country.update);
  app.route('/api/country').delete(/*country.validateSessionUser,*/ country.destroy);
}
