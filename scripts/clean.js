const fs = require("fs/promises");

async function main() {
  del("node_modules");
  del("database.db");
  del("backend/out");
  del("backend/node_modules");
}

main();

async function del(p) {
  console.log(`Deleting ${p}`);
  try {
    await fs.rmdir(p, { recursive: true });
  } catch (err) {
    console.error(`Could not delete ${p}, ${err}`);
  }
}
