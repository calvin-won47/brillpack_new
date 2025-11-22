type SeoConfig = { title?: string; description?: string; keywords?: string }
type HeroConfig = { slogan?: string; description?: string }
type BasicConfig = {
  app_name?: string
  strapi_url?: string
  strapi_site_slug?: string
  gtmId?: string
  seo?: SeoConfig
  hero?: HeroConfig
}
type ApiEndpoints = { strapi_url?: string; strapi_site_slug?: string }
type ExtraConfig = Record<string, unknown>

declare global {
  interface Window {
    APP_CONFIG?: {
      basic?: BasicConfig
      apiEndpoints?: ApiEndpoints
      extra?: ExtraConfig
    }
  }
}

const DEFAULT_API_URL = 'https://2amcreations.com'
const DEFAULT_SITE_SLUG = 'xmyxyswkj'

function getApiBase(): string {
  const base = window.APP_CONFIG?.apiEndpoints?.strapi_url || window.APP_CONFIG?.basic?.strapi_url || DEFAULT_API_URL
  return String(base).replace(/\/+$/g, '')
}

function getSiteSlug(): string {
  return window.APP_CONFIG?.apiEndpoints?.strapi_site_slug || window.APP_CONFIG?.basic?.strapi_site_slug || DEFAULT_SITE_SLUG
}

export function buildUrl(path: string): string {
  const base = getApiBase()
  const p = path.startsWith('/') ? path : `/${path}`
  return `${base}${p}`
}

type StrapiMediaV5 = { url?: string } | null
type StrapiMediaV4Rel = { data?: { attributes?: { url?: string } } } | null

function normalizeImage(media: unknown): string | null {
  if (!media) return null
  if (typeof media === 'object' && media && 'url' in (media as Record<string, unknown>)) {
    const m = media as StrapiMediaV5
    return m?.url ? buildUrl(m.url) : null
  }
  if (typeof media === 'object' && media) {
    const m = media as StrapiMediaV4Rel
    const url = m?.data?.attributes?.url
    return url ? buildUrl(url) : null
  }
  return null
}

type StrapiAttributes = {
  slug?: string
  title?: string
  createdAt?: string
  publishedAt?: string
  contentMarkdown?: string
  coverImage?: StrapiMediaV5 | StrapiMediaV4Rel
  excerpt?: string
}

type StrapiV4Item = { id: number; attributes?: StrapiAttributes }
type StrapiV5Item = { id: number } & StrapiAttributes
type StrapiItem = StrapiV4Item | StrapiV5Item

function normalizeField<T extends keyof StrapiAttributes>(item: StrapiItem, key: T): StrapiAttributes[T] | null {
  const v = (item as StrapiV5Item)[key]
  const a = (item as StrapiV4Item).attributes?.[key]
  return (v ?? a ?? null) as StrapiAttributes[T] | null
}

export interface BlogPostListItem {
  id: number
  slug: string | null
  title: string | null
  createdAt: string | null
  coverImageUrl: string | null
  excerpt: string | null
}

export async function fetchBlogPosts(): Promise<BlogPostListItem[]> {
  const query = `/api/blog-posts?populate=coverImage&filters[site][slug][$eq]=${getSiteSlug()}&sort=createdAt:desc`
  const res = await fetch(buildUrl(query))
  if (!res.ok) throw new Error('Failed to fetch blog posts')
  const json = (await res.json()) as unknown
  const data = (json as { data?: unknown }).data
  const items: StrapiItem[] = Array.isArray(data) ? (data as StrapiItem[]) : []
  return items.map((item) => ({
    id: item.id,
    slug: normalizeField(item, 'slug') ?? null,
    title: normalizeField(item, 'title') ?? null,
    createdAt: normalizeField(item, 'createdAt') ?? null,
    coverImageUrl: normalizeImage(normalizeField(item, 'coverImage')),
    excerpt: normalizeField(item, 'excerpt') ?? null,
  }))
}

export interface BlogDetail {
  id: number
  slug: string | null
  title: string | null
  createdAt: string | null
  contentMarkdown: string
  coverImageUrl: string | null
}

export async function fetchBlogBySlug(slug: string): Promise<BlogDetail | null> {
  const query = `/api/blog-posts?populate=*&filters[slug][$eq]=${slug}&filters[site][slug][$eq]=${getSiteSlug()}`
  const res = await fetch(buildUrl(query))
  if (!res.ok) throw new Error('Failed to fetch blog detail')
  const json = (await res.json()) as unknown
  const data = (json as { data?: unknown }).data
  const item: StrapiItem | undefined = Array.isArray(data) ? (data[0] as StrapiItem | undefined) : undefined
  if (!item) return null
  return {
    id: item.id,
    slug: normalizeField(item, 'slug') ?? null,
    title: normalizeField(item, 'title') ?? null,
    createdAt: normalizeField(item, 'publishedAt') || normalizeField(item, 'createdAt') || null,
    contentMarkdown: normalizeField(item, 'contentMarkdown') || '',
    coverImageUrl: normalizeImage(normalizeField(item, 'coverImage')),
  }
}