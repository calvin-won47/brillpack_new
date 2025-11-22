import fs from 'node:fs/promises'
import path from 'node:path'

async function readJson(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

async function fetchJson(url, headers = {}) {
  try {
    const res = await fetch(url, { headers })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  }
}

function getEnv(name, fallback = '') {
  const v = process.env[name]
  return v && String(v).trim() ? String(v).trim() : fallback
}

function normalizeField(item, key) {
  if (!item) return null
  if (key in item) return item[key]
  return item?.attributes?.[key] ?? null
}

function normalizeDate(item) {
  return normalizeField(item, 'updatedAt') || normalizeField(item, 'createdAt') || null
}

async function getSiteConfig(siteUrl) {
  const remoteCfg = siteUrl ? await fetchJson(new URL('/config.json', siteUrl).toString()) : null
  const localCfg = await readJson(path.resolve('public/config.json'))
  return remoteCfg || localCfg || {}
}

async function fetchAllPosts(strapiUrl, siteSlug, token) {
  const results = []
  const pageSize = 100
  let page = 1
  const headers = token ? { Authorization: `Bearer ${token}` } : {}
  while (true) {
    const u = new URL('/api/blog-posts', strapiUrl)
    u.searchParams.set('filters[site][slug][$eq]', siteSlug)
    u.searchParams.set('pagination[page]', String(page))
    u.searchParams.set('pagination[pageSize]', String(pageSize))
    u.searchParams.set('sort', 'updatedAt:desc')
    u.searchParams.set('fields', 'slug,createdAt,updatedAt')
    const json = await fetchJson(u.toString(), headers)
    const items = Array.isArray(json?.data) ? json.data : []
    for (const it of items) {
      const slug = normalizeField(it, 'slug')
      if (slug) {
        results.push({ slug, lastmod: normalizeDate(it) })
      }
    }
    const total = json?.meta?.pagination?.total ?? items.length
    const pageCount = json?.meta?.pagination?.pageCount ?? (items.length < pageSize ? page : page + 1)
    if (page >= pageCount) break
    page += 1
  }
  return results
}

function isoDate(d) {
  try {
    const s = String(d || '')
    if (!s) return new Date().toISOString().slice(0, 10)
    return s.includes('T') ? s.split('T')[0] : s.slice(0, 10)
  } catch {
    return new Date().toISOString().slice(0, 10)
  }
}

function buildSitemapXml(siteUrl, posts) {
  const urls = []
  urls.push({ loc: siteUrl, lastmod: isoDate(new Date()), changefreq: 'daily', priority: '1.0' })
  urls.push({ loc: new URL('/blog', siteUrl).toString(), lastmod: isoDate(new Date()), changefreq: 'daily', priority: '0.8' })
  for (const p of posts) {
    urls.push({ loc: new URL(`/blog/${p.slug}`, siteUrl).toString(), lastmod: isoDate(p.lastmod), changefreq: 'daily', priority: '0.7' })
  }
  const body = urls
    .map(
      (u) =>
        `<url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod><changefreq>${u.changefreq}</changefreq><priority>${u.priority}</priority></url>`,
    )
    .join('')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${body}</urlset>\n`
}

function buildRobotsTxt(siteUrl) {
  return `User-agent: *\nAllow: /\nSitemap: ${new URL('/sitemap.xml', siteUrl).toString()}\n`
}

async function main() {
  const SITE_URL = getEnv('SITE_URL')
  if (!SITE_URL) {
    console.error('Missing required env SITE_URL')
    process.exit(1)
  }
  const cfg = await getSiteConfig(SITE_URL)
  const strapiUrl = getEnv('strapi_url', cfg?.apiEndpoints?.strapi_url || cfg?.basic?.strapi_url || 'https://2amcreations.com')
  const siteSlug = getEnv('strapi_site_slug', cfg?.apiEndpoints?.strapi_site_slug || cfg?.basic?.strapi_site_slug || 'xmyxyswkj')
  const token = getEnv('STRAPI_API_TOKEN')

  const posts = await fetchAllPosts(strapiUrl, siteSlug, token)
  await fs.mkdir(path.resolve('dist'), { recursive: true })
  const sitemapXml = buildSitemapXml(SITE_URL, posts)
  const robotsTxt = buildRobotsTxt(SITE_URL)
  await fs.writeFile(path.resolve('dist/sitemap.xml'), sitemapXml, 'utf-8')
  await fs.writeFile(path.resolve('dist/robots.txt'), robotsTxt, 'utf-8')
  console.log(`Generated ${posts.length} post URLs into dist/sitemap.xml and robots.txt for ${SITE_URL}`)
}

main().catch((e) => {
  console.error('Failed to generate sitemap:', e)
  process.exit(1)
})