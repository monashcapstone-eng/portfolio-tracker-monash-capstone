import {
  assert,
  BASE_URL,
  fetchText,
  info,
  isDirectRun,
  runChecks,
} from "./shared.mjs";

export async function runPublicSmoke() {
  info(`Running public smoke checks against ${BASE_URL}`);

  await runChecks("Public pages", [
    {
      name: "Landing page loads",
      run: async () => {
        const { response, body } = await fetchText("/");
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(body.includes("One polished workspace"), "Landing hero text missing");
      },
    },
    {
      name: "Features page loads",
      run: async () => {
        const { response, body } = await fetchText("/features");
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(body.includes("Built for portfolio operations"), "Features headline missing");
      },
    },
    {
      name: "Pricing page loads",
      run: async () => {
        const { response, body } = await fetchText("/pricing");
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(body.includes("Start free"), "Pricing content missing");
      },
    },
    {
      name: "Login page loads",
      run: async () => {
        const { response, body } = await fetchText("/login");
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(body.includes("Sign in"), "Login heading missing");
      },
    },
    {
      name: "Signup page loads",
      run: async () => {
        const { response, body } = await fetchText("/signup");
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(body.includes("Create your account"), "Signup heading missing");
      },
    },
  ]);
}

if (isDirectRun(import.meta.url)) {
  runPublicSmoke().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
