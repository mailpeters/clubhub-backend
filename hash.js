const bcrypt = require('bcrypt');

async function hashPassword() {
  const hashed = await bcrypt.hash('test123', 10);
  console.log('Hashed password:', hashed);
}
hashPassword();
