import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'

// Article slug to file mapping
const ARTICLE_MAP = {
  'what-is-aviatrix': '01-what-is-aviatrix.html',
  'aviatrix-rtp': '02-aviatrix-rtp.html',
  'aviatrix-statistics': '03-aviatrix-statistics.html',
  'how-to-play-aviatrix': '04-how-to-play-aviatrix.html',
  'aviatrix-strategies': '05-aviatrix-strategies.html',
  'aviatrix-vs-aviator': '06-aviatrix-vs-aviator.html',
  'aviatrix-nft-system': '07-aviatrix-nft-system.html',
  'aviatrix-tips': '08-aviatrix-tips.html',
  'history-of-aviatrix': '09-history-of-aviatrix.html',
  'aviatrix-responsible-gambling': '10-aviatrix-responsible-gambling.html',
  'aviatrix-demo': '11-aviatrix-demo.html',
  'aviatrix-casinos': '12-aviatrix-casinos.html',
  'aviatrix-predictor-scam': '13-aviatrix-predictor-scam.html'
}

export default function ArticlePage() {
  const { slug } = useParams()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchArticle = async () => {
      setLoading(true)
      setError(null)

      const cleanSlug = slug?.replace(/\/$/, '')
      const filename = ARTICLE_MAP[cleanSlug]

      if (!filename) {
        setError('Article not found')
        setLoading(false)
        return
      }

      try {
        const res = await fetch(`/articles/${filename}`)
        if (!res.ok) throw new Error('Failed to load article')
        const html = await res.text()
        setContent(html)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [slug])

  if (loading) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-slate-700 rounded w-3/4"></div>
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-xl text-center py-12">
          <h1 className="text-2xl font-bold text-red-400 mb-4">Article Not Found</h1>
          <p className="text-slate-400">The requested article could not be found.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <article
        className="prose prose-invert prose-slate max-w-none"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </main>
  )
}
