import { GAME_MODES } from "../data/modes";

export interface AnimeCoverData {
  coverUrl: string;
  color?: string | null;
}

const COVER_QUERY = `
  query ($malIds: [Int]) {
    Page(page: 1, perPage: 25) {
      media(idMal_in: $malIds, type: ANIME) {
        idMal
        coverImage {
          extraLarge
          large
          color
        }
      }
    }
  }
`;

const POKEMON_COVER_URL =
  "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png";

export async function getModeCovers(): Promise<Record<string, AnimeCoverData>> {
  const result: Record<string, AnimeCoverData> = {
    pokemon: { coverUrl: POKEMON_COVER_URL, color: "#DC2626" },
  };

  const malIds = GAME_MODES.map((m) => m.jikanId).filter(
    (id): id is number => id !== null
  );

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: COVER_QUERY,
        variables: { malIds },
      }),
      next: { revalidate: 86400 },
    });

    if (!res.ok) return result;

    const json = await res.json();
    const mediaList = json?.data?.Page?.media;
    if (!Array.isArray(mediaList)) return result;

    for (const item of mediaList) {
      const mode = GAME_MODES.find((m) => m.jikanId === item.idMal);
      const url = item?.coverImage?.extraLarge || item?.coverImage?.large;
      if (mode && url) {
        result[mode.id] = {
          coverUrl: url,
          color: item.coverImage?.color || null,
        };
      }
    }
  } catch {
    // Gracefully fall back if AniList is unreachable during build
  }

  return result;
}
