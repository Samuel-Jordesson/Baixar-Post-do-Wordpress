import { useState } from 'react'
import './App.css'

function Icon({ name, size = 22, color = '#2563eb', style = {} }) {
  // SVGs inline para upload, filtro, busca, voltar, copiar
  const icons = {
    upload: <svg style={style} width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M12 16V4M12 4l-4 4M12 4l4 4"/><rect x="4" y="16" width="16" height="4" rx="2"/></svg>,
    filter: <svg style={style} width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M8 12h8M10 18h4"/></svg>,
    search: <svg style={style} width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>,
    back: <svg style={style} width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><path d="M15 19l-7-7 7-7"/></svg>,
    copy: <svg style={style} width={size} height={size} fill="none" stroke={color} strokeWidth="2" viewBox="0 0 24 24"><rect x="9" y="9" width="13" height="13" rx="2"/><rect x="3" y="3" width="13" height="13" rx="2"/></svg>
  }
  return icons[name] || null
}

function PostDetail({ post, onBack }) {
  const [copied, setCopied] = useState(false)
  function handleCopy() {
    navigator.clipboard.writeText(post.link)
    setCopied(true)
    setTimeout(() => setCopied(false), 1200)
  }
  function handleDownload() {
    const blob = new Blob([JSON.stringify(post, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${post.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'materia'}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
  return (
    <div className="post-card" style={{ maxWidth: 700, margin: '2rem auto', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'flex-start' }}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 16 }}>
        <button onClick={onBack} className="btn flex items-center gap-2"><Icon name="back" size={20} /> Voltar</button>
        <button onClick={handleDownload} className="btn flex items-center gap-2" style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', boxShadow: 'none' }}>
          <Icon name="upload" size={18} color="#2563eb" /> Baixar JSON
        </button>
      </div>
      {post.imagem && (
        <img
          src={post.imagem}
          alt={post.titulo}
          className="post-image"
          style={{ boxShadow: '0 8px 32px #2563eb44', border: '3px solid #2563eb' }}
        />
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: '100%' }}>
        <h2 className="post-title" style={{ fontSize: '2.3rem', flex: 1 }}>{post.titulo}</h2>
        <button className="btn" style={{ padding: '0.5rem 1rem', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6 }} onClick={handleCopy}>
          <Icon name="copy" size={18} /> {copied ? 'Copiado!' : 'Copiar link'}
        </button>
      </div>
      <p className="post-date" style={{ fontWeight: 500, fontSize: '1.1rem', color: '#1e40af' }}>
        {new Date(post.data).toLocaleDateString('pt-BR')}
      </p>
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: post.conteudo }}
      />
      <a
        href={post.link}
        target="_blank"
        rel="noopener noreferrer"
        className="post-link"
        style={{ fontWeight: 600, fontSize: '1.1rem', marginTop: 8, display: 'inline-block' }}
      >
        Ver no Portal Barcarena →
      </a>
    </div>
  )
}

export default function App() {
  const [posts, setPosts] = useState([])
  const [search, setSearch] = useState('')
  const [selectedPost, setSelectedPost] = useState(null)
  const [dateFilter, setDateFilter] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      try {
        const json = JSON.parse(evt.target.result)
        setPosts(json)
      } catch {
        alert('Arquivo inválido!')
      }
    }
    reader.readAsText(file)
  }

  // Sugestões de títulos conforme o usuário digita
  const titleSuggestions = posts
    .filter(post =>
      post.titulo.toLowerCase().includes(search.toLowerCase()) ||
      post.conteudo.toLowerCase().includes(search.toLowerCase())
    )
    .map(post => post.titulo)
    .slice(0, 8)

  // Filtro por data
  const filteredPosts = posts.filter(post => {
    const matchSearch =
      post.titulo.toLowerCase().includes(search.toLowerCase()) ||
      post.conteudo.toLowerCase().includes(search.toLowerCase())
    const matchDate = dateFilter
      ? new Date(post.data).toLocaleDateString('pt-BR') === dateFilter
      : true
    return matchSearch && matchDate
  })

  if (selectedPost) {
    return <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
  }

  // Gerar lista de datas únicas para filtro
  const uniqueDates = Array.from(new Set(posts.map(post => new Date(post.data).toLocaleDateString('pt-BR'))))

  // Responsividade: ajustar layout para mobile
  const isMobile = window.innerWidth < 700

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Visualizador de Posts Baixados</h1>
      <div
        className="input-row"
        style={{
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: isMobile ? 'stretch' : 'center',
          gap: isMobile ? 10 : 12,
          display: 'flex',
          marginBottom: 24,
          justifyContent: 'flex-start',
        }}
      >
        <label className="btn flex items-center gap-2" style={{ marginBottom: isMobile ? 10 : 0, marginRight: isMobile ? 0 : 8 }}>
          <Icon name="upload" size={20} />
          <input
            type="file"
            accept="application/json"
            onChange={handleFileUpload}
            style={{ display: 'none' }}
          />
          Adicionar arquivo
        </label>
        {posts.length > 0 && (
          <>
            <div className="relative" style={{ flex: 1, marginRight: isMobile ? 0 : 8 }}>
              <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', opacity: 0.7 }}>
                <Icon name="search" size={20} />
              </div>
              <input
                type="text"
                placeholder="Buscar por título ou conteúdo..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value)
                  setShowSuggestions(e.target.value.length > 0)
                }}
                onFocus={() => setShowSuggestions(search.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                className="px-4 py-2 border rounded w-full"
                autoComplete="off"
                style={{ boxShadow: '0 2px 8px rgba(37,99,235,0.08)', paddingLeft: 40, transition: 'box-shadow 0.3s' }}
              />
              {showSuggestions && titleSuggestions.length > 0 && (
                <ul className="suggestion-list absolute left-0 right-0 bg-white border rounded shadow z-10 mt-1 max-h-48 overflow-auto">
                  {titleSuggestions.map((title, idx) => (
                    <li
                      key={idx}
                      className="suggestion-item px-4 py-2 cursor-pointer hover:bg-blue-100"
                      onMouseDown={() => {
                        setSearch(title)
                        setShowSuggestions(false)
                      }}
                    >
                      {title}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: isMobile ? 'row' : 'column', alignItems: 'center', gap: isMobile ? 8 : 6, marginRight: isMobile ? 0 : 8 }}>
              <select
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="px-4 py-2 border rounded"
                style={{ minWidth: 140, boxShadow: '0 2px 8px rgba(37,99,235,0.08)', marginRight: isMobile ? 8 : 0 }}
              >
                <option value="">Filtrar por data</option>
                {uniqueDates.map(date => (
                  <option key={date} value={date}>{date}</option>
                ))}
              </select>
              <div style={{ fontWeight: 600, color: '#2563eb', fontSize: '1rem', marginTop: isMobile ? 0 : 8 }}>
                <Icon name="filter" size={18} style={{ marginRight: 4 }} />
                {filteredPosts.length} resultado{filteredPosts.length !== 1 ? 's' : ''}
              </div>
            </div>
          </>
        )}
      </div>
      <div className="post-list">
        {filteredPosts.length === 0 && posts.length > 0 ? (
          <p className="text-gray-500 text-center">Nenhum post encontrado.</p>
        ) : (
          filteredPosts.map(post => (
            <div
              key={post.id}
              className="post-card cursor-pointer hover:bg-blue-50"
              style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', animation: 'fadeInUp 0.6s cubic-bezier(.23,1,.32,1)' }}
            >
              <span style={{ fontWeight: 600, fontSize: '1.2rem', color: '#2563eb', flex: 1 }} onClick={() => setSelectedPost(post)}>{post.titulo}</span>
              <span style={{ color: '#1e40af', fontSize: '1rem', marginRight: 12 }}>{new Date(post.data).toLocaleDateString('pt-BR')}</span>
              <button
                className="btn flex items-center gap-2"
                style={{ background: '#fff', color: '#2563eb', border: '1px solid #2563eb', boxShadow: 'none', padding: '0.5rem 1rem', fontSize: '0.95rem' }}
                onClick={() => {
                  const blob = new Blob([JSON.stringify(post, null, 2)], { type: 'application/json' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${post.titulo.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'materia'}.json`
                  document.body.appendChild(a)
                  a.click()
                  document.body.removeChild(a)
                  URL.revokeObjectURL(url)
                }}
              >
                <Icon name="upload" size={16} color="#2563eb" /> Baixar JSON
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
