import { NextResponse } from "next/server";

function getStatusDetail(error, predicate) {
  return error?.statusDetails?.find(predicate);
}

function getErrorReason(error) {
  return (
    error?.reason ||
    getStatusDetail(error, (detail) => typeof detail?.reason === "string")?.reason ||
    null
  );
}

function getErrorMetadata(error) {
  return (
    error?.errorInfoMetadata ||
    getStatusDetail(error, (detail) => detail?.metadata)?.metadata ||
    {}
  );
}

function getErrorMessage(error, fallback) {
  return error?.details || error?.message || fallback;
}

export function handleServerError(scope, error, fallback = "Server error") {
  const reason = getErrorReason(error);
  const metadata = getErrorMetadata(error);
  const message = getErrorMessage(error, fallback);

  if (
    reason === "SERVICE_DISABLED" &&
    metadata?.service === "firestore.googleapis.com"
  ) {
    console.error(`${scope}: ${message}`);
    return NextResponse.json(
      {
        error:
          "Cloud Firestore is not enabled for this project yet. Enable Firestore Database and the Cloud Firestore API, then retry.",
        code: "FIRESTORE_SERVICE_DISABLED",
        activationUrl: metadata?.activationUrl || null,
      },
      { status: 503 }
    );
  }

  console.error(`${scope}: ${message}`);

  return NextResponse.json(
    {
      error: fallback,
      details: process.env.NODE_ENV === "development" ? message : undefined,
    },
    { status: 500 }
  );
}
