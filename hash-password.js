const crypto = require('crypto');
const util = require('util');

const scryptAsync = util.promisify(crypto.scrypt);

async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const buf = await scryptAsync(password, salt, 64);
  return `${buf.toString('hex')}.${salt}`;
}

async function main() {
  const hashedPassword = await hashPassword('admin123');
  console.log(hashedPassword);
}

main();
