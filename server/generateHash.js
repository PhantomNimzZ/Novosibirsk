// Run this ONCE to generate your bcrypt password hash
// Usage: node generateHash.js yourPasswordHere
// Then paste the output into your .env as ADMIN_PASSWORD_HASH

import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
  console.error("❌ Please provide a password: node generateHash.js yourPasswordHere");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 10);
console.log("\n✅ Your bcrypt hash (paste this into .env as ADMIN_PASSWORD_HASH):\n");
console.log(hash);
console.log();
