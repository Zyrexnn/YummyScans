const MANGADEX_API = 'https://api.mangadex.org'

export async function fetchPopularManga(limit = 5) {
  try {
    const res = await fetch(
      `${MANGADEX_API}/manga?order[followedCount]=desc&limit=${limit}&includes[]=cover_art&contentRating=safe`,
      { signal: AbortSignal.timeout(10000) }
    )

    if (!res.ok) throw new Error(`API error: ${res.status}`)

    const data = await res.json()

    return data.data.map((manga: any) => {
      const cover = manga.relationships.find((r: any) => r.type === 'cover_art')
      const fileName = cover?.attributes?.fileName

      return {
        id: manga.id,
        title: manga.attributes.title.en || manga.attributes.title.ja || Object.values(manga.attributes.title)[0],
        slug: manga.id,
        coverUrl: fileName
          ? `https://uploads.mangadex.org/covers/${manga.id}/${fileName}.256.jpg`
          : null,
        status: manga.attributes.status,
        genres: manga.attributes.tags
          .filter((t: any) => t.attributes.group === 'genre')
          .slice(0, 3)
          .map((t: any) => ({ id: t.id, name: t.attributes.name.en, slug: t.id })),
      }
    })
  } catch (error) {
    console.warn('MangaDex fetch failed, using mock data:', error)
    return getMockManga()
  }
}

// Mock data with placeholder images (MangaDex API not accessible from localhost)
function getMockManga() {
  const placeholder = (title: string, color: string) =>
    `https://placehold.co/256x360/${color}/ffffff?text=${encodeURIComponent(title)}&font=roboto`

  return [
    {
      id: 'mock-1',
      title: 'One Piece',
      slug: 'mock-1',
      coverUrl: placeholder('One+Piece', '1a1a2e'),
      status: 'ongoing',
      genres: [
        { id: '1', name: 'Action', slug: 'action' },
        { id: '2', name: 'Adventure', slug: 'adventure' }
      ]
    },
    {
      id: 'mock-2',
      title: 'Solo Leveling',
      slug: 'mock-2',
      coverUrl: placeholder('Solo+Leveling', '2d1b4e'),
      status: 'completed',
      genres: [
        { id: '1', name: 'Action', slug: 'action' },
        { id: '3', name: 'Fantasy', slug: 'fantasy' }
      ]
    },
    {
      id: 'mock-3',
      title: 'Jujutsu Kaisen',
      slug: 'mock-3',
      coverUrl: placeholder('Jujutsu+Kaisen', '4a1942'),
      status: 'ongoing',
      genres: [
        { id: '1', name: 'Action', slug: 'action' },
        { id: '4', name: 'Supernatural', slug: 'supernatural' }
      ]
    },
    {
      id: 'mock-4',
      title: 'Chainsaw Man',
      slug: 'mock-4',
      coverUrl: placeholder('Chainsaw+Man', '3d1c02'),
      status: 'ongoing',
      genres: [
        { id: '1', name: 'Action', slug: 'action' },
        { id: '5', name: 'Horror', slug: 'horror' }
      ]
    },
    {
      id: 'mock-5',
      title: 'Spy x Family',
      slug: 'mock-5',
      coverUrl: placeholder('Spy+xFamily', '1b4332'),
      status: 'ongoing',
      genres: [
        { id: '6', name: 'Comedy', slug: 'comedy' },
        { id: '7', name: 'Drama', slug: 'drama' }
      ]
    },
  ]
}
