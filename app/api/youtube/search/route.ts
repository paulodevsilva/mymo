import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");
  const apiKey = process.env.YOUTUBE_API_KEY;

  if (!query) return NextResponse.json([]);

  try {
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(
        query,
      )}&type=video&maxResults=5&key=${apiKey}`,
    );
    const data = await res.json();

    const videos =
      data.items?.map(
        (item: {
          id: { videoId: string };
          snippet: {
            title: string;
            thumbnails: { default: { url: string } };
            channelTitle: string;
          };
        }) => ({
          id: item.id.videoId,
          title: item.snippet.title,
          thumbnail: item.snippet.thumbnails.default.url,
          channel: item.snippet.channelTitle,
        }),
      ) || [];

    return NextResponse.json(videos);
  } catch (error) {
    return NextResponse.json({ error: "Erro na busca" }, { status: 500 });
  }
}
