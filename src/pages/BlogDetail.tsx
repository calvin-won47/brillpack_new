import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { fetchBlogBySlug, type BlogDetail as BlogDetailData } from '@/lib/strapi'

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>()
  const [post, setPost] = useState<BlogDetailData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    if (slug) {
      fetchBlogBySlug(slug)
        .then((data) => {
          if (mounted) setPost(data)
        })
        .catch((e: unknown) => {
          const msg = e instanceof Error ? e.message : 'Error loading blog'
          if (mounted) setError(msg)
        })
        .finally(() => {
          if (mounted) setLoading(false)
        })
    } else {
      setLoading(false)
      setPost(null)
    }
    return () => {
      mounted = false
    }
  }, [slug])

  const formatDate = (value: string | null) => {
    if (!value) return ''
    const iso = String(value)
    const datePart = iso.includes('T') ? iso.split('T')[0] : iso.slice(0, 10)
    return datePart
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>
  if (!post) return <p className="p-4">Not found</p>

  return (
    <article className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{post.title}</h1>
      <small className="text-gray-500">{formatDate(post.createdAt)}</small>
      <div className="mt-6 prose max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.contentMarkdown}</ReactMarkdown>
      </div>
    </article>
  )
}