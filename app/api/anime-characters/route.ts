import { NextRequest, NextResponse } from "next/server";

const ANILIST_QUERY = `
  query ($malId: Int) {
    Media(idMal: $malId, type: ANIME) {
      characters(sort: FAVOURITES_DESC, perPage: 30) {
        edges {
          role
          node {
            id
            name {
              full
              native
            }
            image {
              large
            }
            favourites
          }
        }
      }
    }
  }
`;

export async function GET(request: NextRequest) {
  const malIdParam = request.nextUrl.searchParams.get("malId");
  const malId = Number(malIdParam);

  if (!malIdParam || !Number.isInteger(malId) || malId <= 0) {
    return NextResponse.json({ error: "Invalid malId" }, { status: 400 });
  }

  try {
    const res = await fetch("https://graphql.anilist.co", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: ANILIST_QUERY,
        variables: { malId },
      }),
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `AniList upstream error: ${res.status}` },
        { status: res.status }
      );
    }

    const json = await res.json();
    const edges = json?.data?.Media?.characters?.edges;

    if (!Array.isArray(edges) || edges.length === 0) {
      return NextResponse.json({ error: "No characters found" }, { status: 404 });
    }

    const characters = edges
      .filter((edge: { node?: { image?: { large?: string } } }) =>
        Boolean(edge?.node?.image?.large)
      )
      .map(
        (edge: {
          role?: string;
          node: {
            id: number;
            name: { full: string; native?: string | null };
            image: { large: string };
            favourites?: number;
          };
        }) => ({
          id: edge.node.id,
          role: edge.role === "MAIN" ? "Main" : "Supporting",
          favorites: edge.node.favourites || 0,
          name: edge.node.name.full,
          jpName: edge.node.name.native || edge.node.name.full,
          image: edge.node.image.large,
        })
      );

    return NextResponse.json({ characters });
  } catch (error) {
    console.error("AniList proxy error:", error);
    return NextResponse.json(
      { error: "Failed to fetch anime characters" },
      { status: 502 }
    );
  }
}
