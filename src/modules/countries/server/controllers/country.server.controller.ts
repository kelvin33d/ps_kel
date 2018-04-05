import * as path from 'path';
import * as Sequelize from 'sequelize';
import orm from '../../../../config/lib/sequelize';
const {or, and, gt, lt} = Sequelize.Op;

function getAllCountries(req,res){
  orm.countries.findAll({limit:(parseFloat(req.query.limit)) || 5, offset:(parseFloat(req.query.page)) || 1, attributes:{exclude:['id','createdAt','updatedAt','deletedAt']}}).then((countries) => {
    res.status(200).send(countries);
  }).catch((err) => {
    res.status(500).send(err);
  });
}

function get(){}

function  save(){}

function update() {}

function destroy(){}

export default {
  getAllCountries,
  get,
  save,
  update,
  destroy  
}
