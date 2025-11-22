import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchBlogPosts, type BlogPostListItem } from '@/lib/strapi'

export default function BlogList() {
  const [posts, setPosts] = useState<BlogPostListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let mounted = true
    fetchBlogPosts()
      .then((data) => {
        if (mounted) setPosts(data)
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : 'Error loading posts'
        if (mounted) setError(msg)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  const formatDate = (value: string | null) => {
    if (!value) return ''
    const iso = String(value)
    const datePart = iso.includes('T') ? iso.split('T')[0] : iso.slice(0, 10)
    return datePart
  }

  if (loading) return <p className="p-4">Loading...</p>
  if (error) return <p className="p-4 text-red-600">{error}</p>

  return (
    <div className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6">Blog</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <article key={post.id} className="bg-white border rounded-lg overflow-hidden shadow-sm">
              {post.coverImageUrl && (
                <img
                  src={post.coverImageUrl}
                  alt={post.title ?? ''}
                  className="w-full h-40 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">
                  {post.slug ? (
                    <Link to={`/blog/${post.slug}`} className="text-primary hover:underline">
                      {post.title}
                    </Link>
                  ) : (
                    post.title
                  )}
                </h2>
                <small className="text-gray-500">{formatDate(post.createdAt)}</small>
                {post.excerpt && <p className="mt-3 text-gray-700">{post.excerpt}</p>}
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}