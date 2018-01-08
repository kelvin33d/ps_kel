import * as crypto from 'crypto';

class GeneratePassword {
  constructor(options){
    this.options = options;
    this.lowercase = 'abcdefghijklmnopqrstuvwxyz';
    this.uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    this.numbers = '0123456789';
    this.symbols = '!@#$%^&*()+_-=}{[]|:;"/?.><,`~';
    this.similarCharacters = /[ilLI|`oO0]/g;
    this.pool = this.lowercase;
    this.password = '';
  }
  randomNumber(max){
    return crypto.randomBytes(1)[0] % max;
  }
  generate(options){
    if (!Object.prototype.hasOwnProperty.call(this.options, 'length'))
      this.options.length = 10;
    if (!Object.prototype.hasOwnProperty.call(this.options, 'numbers'))
      this.options.numbers = false;
    if (!Object.prototype.hasOwnProperty.call(this.options, 'symbols'))
      this.options.symbols = false;
    if (!Object.prototype.hasOwnProperty.call(this.options, 'uppercase'))
      this.options.uppercase = true;
    if (!Object.prototype.hasOwnProperty.call(this.options, 'excludeSimilarCharacters'))
      this.options.excludeSimilarCharacters = false;
    if (this.options.uppercase) {
      this.pool += this.uppercase;
    }
    if (this.options.numbers) {
      this.pool += this.numbers;
    }
    if (this.options.symbols) {
      this.pool += this.symbols;
    }
    if (this.options.excludeSimilarCharacters) {
      this.pool = this.pool.replace(this.similarCharacters, '');
    }
    for (let i = 0; i < options.length; i++) {
      this.password += this.pool[this.randomNumber(this.pool.length)];
    }
    return password;
  }
}
export default new GeneratePassword();