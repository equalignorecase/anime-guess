import { isValidGameMode, type GameMode } from "../data/modes";
import PlayClient from "./PlayClient";

interface PlayPageProps {
  searchParams: Promise<{ mode?: string }>;
}

export default async function PlayPage({ searchParams }: PlayPageProps) {
  const params = await searchParams;
  const initialMode: GameMode = isValidGameMode(params.mode)
    ? params.mode
    : "pokemon";

  return <PlayClient initialMode={initialMode} />;
}
