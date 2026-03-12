import { runApiSmoke } from "./api-smoke.mjs";
import { runPublicSmoke } from "./public-smoke.mjs";
import { info, isDirectRun } from "./shared.mjs";

export async function runQaSuite() {
  info("Starting NexaFlow QA smoke suite");
  await runPublicSmoke();
  await runApiSmoke();
}

if (isDirectRun(import.meta.url)) {
  runQaSuite().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
