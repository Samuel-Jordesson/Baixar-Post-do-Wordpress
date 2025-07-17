'use client'

import { useEffect, useState } from 'react'

type Post = {
  id: number
  title: { rendered: string }
  excerpt: { rendered: string }
  content?: { rendered: string }
  date: string
  link: string
  featured_media: number
  _embedded?: {
    'wp:featuredmedia'?: { source_url: string }[]
  }
}

export default function HomePage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [images, setImages] = useState<Record<number, string>>({})

  const WORDPRESS_URL = 'https://portalbarcarena.com.br'

  useEffect(() => {
    async function fetchAllPosts() {
      let allPosts: Post[] = []
      let page = 1
      const perPage = 100
      let hasMore = true

      while (hasMore) {
        const res = await fetch(
          `${WORDPRESS_URL}/wp-json/wp/v2/posts?per_page=${perPage}&page=${page}&order=asc&_embed`
        )

        if (!res.ok) break

        const data: Post[] = await res.json()
        allPosts = [...allPosts, ...data]

        if (data.length < perPage) {
          hasMore = false
        } else {
          page++
        }
      }

      setPosts(allPosts)

      // Coletar imagens destacadas
      const media: Record<number, string> = {}
      for (const post of allPosts) {
        const featuredMedia = post._embedded?.['wp:featuredmedia']?.[0]?.source_url
        if (featuredMedia) {
          media[post.id] = featuredMedia
        }
      }

      setImages(media)
    }

    fetchAllPosts()
  }, [])

  // Função para baixar os posts completos como JSON
  function handleDownload() {
    const exportPosts = posts.map(post => ({
      id: post.id,
      titulo: post.title.rendered,
      data: post.date,
      conteudo: post.content?.rendered || '',
      imagem: images[post.id] || '',
      link: post.link
    }))
    const dataStr = JSON.stringify(exportPosts, null, 2)
    const blob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'posts-migracao.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function goToUploadPage() {
    window.location.href = 'http://localhost:5173/';
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Notícias do Portal Barcarena</h1>
      <div className="flex gap-4 mb-6">
        <button
          onClick={handleDownload}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          disabled={posts.length === 0}
        >
          Baixar posts completos
        </button>
        <button
          onClick={goToUploadPage}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
        >
          Ir para página de upload
        </button>
      </div>

      {posts.length === 0 ? (
        <p className="text-gray-500">Carregando posts...</p>
      ) : (
        <ul className="space-y-6">
          {posts.map(post => (
            <li key={post.id} className="border rounded-xl p-4 shadow-sm hover:shadow-md transition">
              {images[post.id] && (
                <img
                  src={images[post.id]}
                  alt="Imagem destacada"
                  className="w-full h-64 object-cover mb-4 rounded"
                />
              )}
              <h2
                className="text-xl font-semibold mb-2"
                dangerouslySetInnerHTML={{ __html: post.title.rendered }}
              />
              <p className="text-sm text-gray-500 mb-2">
                {new Date(post.date).toLocaleDateString('pt-BR')}
              </p>
              <div
                className="text-gray-700 text-sm"
                dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
              />
              <a
                href={post.link}
                target="_blank"
                className="inline-block mt-2 text-blue-600 hover:underline text-sm"
              >
                Ler matéria completa →
              </a>
            </li>
          ))}
        </ul>
      )}
    </main>
  )
}
