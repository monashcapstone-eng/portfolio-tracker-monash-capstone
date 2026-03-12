import { pathToFileURL } from "url";

export const BASE_URL = (process.env.QA_BASE_URL || "http://localhost:3000").replace(/\/$/, "");
const REQUEST_TIMEOUT_MS = Number(process.env.QA_TIMEOUT_MS || 15000);

function colour(code, message) {
  return `\u001b[${code}m${message}\u001b[0m`;
}

export function info(message) {
  console.log(colour("36", message));
}

export function pass(message) {
  console.log(colour("32", `PASS ${message}`));
}

export function fail(message) {
  console.error(colour("31", `FAIL ${message}`));
}

export function warn(message) {
  console.warn(colour("33", `WARN ${message}`));
}

export function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function buildUrl(pathname) {
  return new URL(pathname, `${BASE_URL}/`).toString();
}

export async function fetchWithTimeout(pathname, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    return await fetch(buildUrl(pathname), {
      redirect: "manual",
      ...options,
      signal: controller.signal,
    });
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${REQUEST_TIMEOUT_MS}ms for ${pathname}`);
    }
    throw new Error(
      `Unable to reach ${buildUrl(pathname)}. Start the app or set QA_BASE_URL to a live deployment.`
    );
  } finally {
    clearTimeout(timeout);
  }
}

export async function fetchText(pathname, options = {}) {
  const response = await fetchWithTimeout(pathname, options);
  const body = await response.text();
  return { response, body };
}

export async function fetchJson(pathname, options = {}) {
  const response = await fetchWithTimeout(pathname, options);
  const bodyText = await response.text();

  let body = null;
  try {
    body = bodyText ? JSON.parse(bodyText) : null;
  } catch {
    throw new Error(`Expected JSON from ${pathname}, received: ${bodyText.slice(0, 200)}`);
  }

  return { response, body };
}

export async function runChecks(title, checks) {
  info(`\n${title}`);
  let failures = 0;

  for (const check of checks) {
    try {
      await check.run();
      pass(check.name);
    } catch (error) {
      failures += 1;
      fail(`${check.name}: ${error.message}`);
    }
  }

  if (failures > 0) {
    throw new Error(`${failures} check(s) failed in "${title}"`);
  }
}

export async function signInTestUser() {
  const apiKey = process.env.NEXT_PUBLIC_FIREBASE_API_KEY;
  const email = process.env.QA_TEST_EMAIL;
  const password = process.env.QA_TEST_PASSWORD;

  if (!apiKey || !email || !password) {
    return null;
  }

  const response = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        returnSecureToken: true,
      }),
    }
  );

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(
      `Unable to sign in QA test user ${email}: ${payload.error?.message || "unknown error"}`
    );
  }

  return payload;
}

export function isDirectRun(metaUrl) {
  return Boolean(process.argv[1]) && metaUrl === pathToFileURL(process.argv[1]).href;
}
