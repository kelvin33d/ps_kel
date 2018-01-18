import * as http from 'http';

const codes = http.STATUS_CODES;

function mapCodes(){
  const o1 = {};
  const o2 = {};
  function assign(){
    return Object.assign(o1, o2);
  }
  for(const name in codes){
    o1[parseFloat(name)] = codes[name];
    o2[String.prototype.replace.call(String.prototype.toUpperCase.call(codes[name]),' ','_')] = parseFloat(name);
  }
  return assign();
}
export default mapCodes();
