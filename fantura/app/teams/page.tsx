"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Team() {
  const searchParams = useSearchParams();
  const team = searchParams.get("team");

  async function isTeamRegistered(team: string): boolean {
    return true;
  }

  // TODO: Check if team is registered on chain
  if (!team || !isTeamRegistered(team)) {
    return <div>Team is not registered!</div>;
  }

  return <div>{team}</div>;
}
