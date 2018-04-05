import * as path from 'path';
import * as Sequelize from 'sequelize';
import orm from '../../../../config/lib/sequelize';
const {or, and, gt, lt} = Sequelize.Op;

function get(req,res){
   orm.countrylanguage.findAll({limit:3, attributes:{exclude:['id','createdAt','updatedAt','deletedAt']}}).then((c_lang) => {
     res.status(200).send(c_lang);
   });
}

function create(req,res){}

function save(req,res) {};

function update(req,res) {};

function destroy(req,res) {};

export default {
  get,
  save,
  update,
  destroy
}