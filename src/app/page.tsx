import { headers } from "next/headers";
import { TeaserPage } from "@/components/marketing/TeaserPage";
import { LandingPage } from "@/components/marketing/LandingPage";

export default async function Page() {
  const hostHeader = (await headers()).get("host")?.toLowerCase() ?? "";
  const hostname = hostHeader.split(":")[0];

  const isLocal = hostname === "localhost" || hostname === "127.0.0.1";
  const isBeta = hostname === "beta.konductor.ai";

  if (isLocal || isBeta) {
    return <LandingPage />;
  }

  // Default to teaser for apex or unknown hosts (safe fallback).
  return <TeaserPage />;
}
