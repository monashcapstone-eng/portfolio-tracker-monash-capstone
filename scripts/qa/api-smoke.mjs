import {
  assert,
  BASE_URL,
  fetchJson,
  info,
  isDirectRun,
  runChecks,
  signInTestUser,
  warn,
} from "./shared.mjs";

export async function runApiSmoke() {
  info(`Running API smoke checks against ${BASE_URL}`);

  await runChecks("Unauthenticated APIs", [
    {
      name: "Activities endpoint rejects anonymous requests",
      run: async () => {
        const { response, body } = await fetchJson("/api/activities");
        assert(response.status === 401, `Expected 401, received ${response.status}`);
        assert(body?.error === "Unauthorized", "Unexpected activities error payload");
      },
    },
    {
      name: "Brokers endpoint rejects anonymous requests",
      run: async () => {
        const { response, body } = await fetchJson("/api/brokers");
        assert(response.status === 401, `Expected 401, received ${response.status}`);
        assert(body?.error === "Unauthorized", "Unexpected brokers error payload");
      },
    },
    {
      name: "Holdings endpoint rejects anonymous requests",
      run: async () => {
        const { response, body } = await fetchJson("/api/holdings");
        assert(response.status === 401, `Expected 401, received ${response.status}`);
        assert(body?.error === "Unauthorized", "Unexpected holdings error payload");
      },
    },
    {
      name: "Settings endpoint rejects anonymous requests",
      run: async () => {
        const { response, body } = await fetchJson("/api/settings");
        assert(response.status === 401, `Expected 401, received ${response.status}`);
        assert(body?.error === "Unauthorized", "Unexpected settings error payload");
      },
    },
    {
      name: "Session endpoint rejects invalid token",
      run: async () => {
        const { response, body } = await fetchJson("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: "invalid-token" }),
        });
        assert(response.status === 401, `Expected 401, received ${response.status}`);
        assert(body?.error === "Invalid token", "Unexpected session error payload");
      },
    },
    {
      name: "Benchmark endpoint returns JSON",
      run: async () => {
        const { response, body } = await fetchJson("/api/benchmark?symbol=SPY");
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(typeof body === "object" && body !== null, "Benchmark payload missing");
      },
    },
  ]);

  const signedInUser = await signInTestUser();

  if (!signedInUser) {
    warn(
      "Skipping authenticated API checks. Set QA_TEST_EMAIL, QA_TEST_PASSWORD, and NEXT_PUBLIC_FIREBASE_API_KEY to enable them."
    );
    return;
  }

  const authHeaders = {
    Authorization: `Bearer ${signedInUser.idToken}`,
  };

  await runChecks("Authenticated APIs", [
    {
      name: "Session endpoint verifies the signed-in user",
      run: async () => {
        const { response, body } = await fetchJson("/api/auth/session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: signedInUser.idToken }),
        });
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(body?.uid === signedInUser.localId, "Session uid did not match Firebase user");
      },
    },
    {
      name: "Activities endpoint returns an array for the signed-in user",
      run: async () => {
        const { response, body } = await fetchJson("/api/activities", { headers: authHeaders });
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(Array.isArray(body), "Activities payload was not an array");
      },
    },
    {
      name: "Brokers endpoint returns an array for the signed-in user",
      run: async () => {
        const { response, body } = await fetchJson("/api/brokers", { headers: authHeaders });
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(Array.isArray(body), "Brokers payload was not an array");
      },
    },
    {
      name: "Holdings endpoint returns an array for the signed-in user",
      run: async () => {
        const { response, body } = await fetchJson("/api/holdings", { headers: authHeaders });
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(Array.isArray(body), "Holdings payload was not an array");
      },
    },
    {
      name: "Settings endpoint returns a settings object",
      run: async () => {
        const { response, body } = await fetchJson("/api/settings", { headers: authHeaders });
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(typeof body === "object" && body !== null, "Settings payload missing");
        assert("default_currency" in body, "default_currency was missing from settings payload");
      },
    },
    {
      name: "Portfolio snapshot endpoint returns an array",
      run: async () => {
        const { response, body } = await fetchJson("/api/portfolio/snapshot", {
          headers: authHeaders,
        });
        assert(response.ok, `Expected 200, received ${response.status}`);
        assert(Array.isArray(body), "Portfolio snapshot payload was not an array");
      },
    },
  ]);
}

if (isDirectRun(import.meta.url)) {
  runApiSmoke().catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  });
}
