import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Hekumbi - Soluções de Limpeza e Higienização Profissional em Angola',
  description: 'Comprometidos com excelência e qualidade para o seu negócio. A Hekumbi oferece soluções personalizadas de limpeza e higienização para condomínios, hospitais, escritórios, shoppings, escolas, igrejas, residências, eventos e muito mais.',
  generator: 'Hekumbi',
  keywords: [
    'Hekumbi',
    'Limpeza Profissional Angola',
    'Higienização Angola',
    'Limpeza de Condomínios',
    'Limpeza de Hospitais',
    'Limpeza de Escritórios',
    'Limpeza Pós Obra',
    'Limpeza de Vidros',
    'Limpeza de Estofados',
    'Limpeza de Escolas',
    'Limpeza de Igrejas',
    'Limpeza de Shoppings',
    'Limpeza de Eventos',
    'Limpeza Residencial'
  ],
  authors: [{ name: 'Hekumbi', url: 'https://hekumbi-website.vercel.app/' }],
  creator: 'Hekumbi',
  metadataBase: new URL('https://hekumbi-website.vercel.app/'),

  openGraph: {
    title: 'Hekumbi - Soluções de Limpeza Profissional',
    description: 'Soluções completas de limpeza e higienização para empresas e residências. Condomínios, hospitais, escritórios, eventos e mais.',
    url: 'https://hekumbi-website.vercel.app/',
    siteName: 'Hekumbi',
    locale: 'pt_AO',
    type: 'website',
    images: [
      {
        url: 'https://hekumbi-website.vercel.app/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Hekumbi - Limpeza Profissional',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Hekumbi - Soluções de Limpeza e Higienização',
    description: 'Serviços de limpeza profissional em Angola. Condomínios, escolas, hospitais, escritórios e muito mais.',
    site: '@hekumbi',
    images: ['https://hekumbi-website.vercel.app/og-image.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
