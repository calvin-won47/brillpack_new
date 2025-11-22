import { createContext, useContext, ReactNode } from 'react'

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

type NavCopy = {
  home?: string
  about?: string
  services?: string
  products?: string
  contact?: string
  blog?: string
  quickQuote?: string
}

type AboutCopy = {
  badge?: string
  heading?: string
  paragraph?: string
  features?: string[]
}

type ServicesCard = { title?: string; description?: string }
type ServicesCopy = {
  badge?: string
  heading?: string
  subheading?: string
  cards?: ServicesCard[]
}

type ProductTypeCopy = { name?: string; description?: string }
type ProductsCopy = {
  badge?: string
  heading?: string
  subheading?: string
  types?: ProductTypeCopy[]
  ctaText?: string
}

type ContactCopy = {
  badge?: string
  heading?: string
  description?: string
  emailLabel?: string
  email?: string
  phoneLabel?: string
  phone?: string
  addressLabel?: string
  address?: string[]
  placeholders?: { name?: string; email?: string; phone?: string; message?: string }
  submitText?: string
  toastTitle?: string
  toastDescription?: string
}

type FooterCopy = {
  brand?: string
  tagline?: string
  quickLinksLabel?: string
  quickLinks?: { id?: string; label?: string }[]
  servicesLabel?: string
  services?: string[]
  contactLabel?: string
  contact?: string[]
  copyright?: string
}

type ExtraConfig = {
  nav?: NavCopy
  about?: AboutCopy
  services?: ServicesCopy
  products?: ProductsCopy
  contact?: ContactCopy
  footer?: FooterCopy
}

export type AppConfig = { basic?: BasicConfig; apiEndpoints?: ApiEndpoints; extra?: ExtraConfig }

declare global {
  interface Window {
    APP_CONFIG?: AppConfig
  }
}

const ConfigContext = createContext<AppConfig | null>(null)

export const ConfigProvider = ({ children }: { children: ReactNode }) => {
  const config = window.APP_CONFIG
  return <ConfigContext.Provider value={config || {}}>{children}</ConfigContext.Provider>
}

export const useConfig = () => {
  const ctx = useContext(ConfigContext)
  if (ctx === null) throw new Error('useConfig must be used within ConfigProvider')
  return ctx
}