const { createApp } = require("./app");
const repository = require("./personRepository");
const { ensureSchema } = require("./db");

const PORT = process.env.PORT || 8080;

async function main() {
  await ensureSchema();
  const app = createApp(repository);
  app.listen(PORT, () => {
    console.log(`person-service listening on port ${PORT}`);
  });
}

main().catch((err) => {
  console.error("Failed to start server", err);
  process.exit(1);
});
