import * as path from 'path';
import config from '../../../../config/config';

function renderIndex(req, res){
  return res.json({APISTATUS: "Ok"});
};

function renderServerError(req, res){};

function renderNotFound(req, res){};

export default {
  renderIndex, 
  renderServerError,
  renderNotFound
}
