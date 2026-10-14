import type { Metadata, Viewport } from 'next';
import { Caveat, Instrument_Serif, Manrope, Noto_Serif_Malayalam } from 'next/font/google';
import { Cursor } from '@/components/Cursor';
import { Loader } from '@/components/Loader';
import { ScrollProgress } from '@/components/ScrollProgress';
import './globals.css';

const display = Instrument_Serif({ variable: '--font-display', weight: '400', style: ['normal', 'italic'], subsets: ['latin'] });
const sans = Manrope({ variable: '--font-sans', subsets: ['latin'] });
const hand = Caveat({ variable: '--font-hand', subsets: ['latin'] });
const malayalam = Noto_Serif_Malayalam({ variable: '--font-ml', weight: ['600', '800'], subsets: ['malayalam'], preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: 'Shins Joy — Architectural Designer, Set Designer & Artist',
  description:
    'Shins Joy is an artist and architectural designer from Kerala — designing homes, building sets for Malayalam cinema (Aadu 3, Vala), drawing in blue ballpoint and painting walls.',
  openGraph: {
    title: 'Shins Joy — Artist & Architectural Designer',
    description: 'Architecture · Set design for Malayalam cinema · Illustration · Wall art',
    images: ['/media/arch-malargal-1.webp'],
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f2ede3' },
    { media: '(prefers-color-scheme: dark)', color: '#101118' },
  ],
};

// Runs before first paint: enables JS-only styles (loader, reveals) and restores the
// saved theme without a flash. <html> therefore differs from the server render.
const bootScript = `document.documentElement.classList.add('js');try{var t=localStorage.getItem('sj-theme');if(t==='light'||t==='dark')document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${hand.variable} ${malayalam.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <a className="skip" href="#intro">Skip to content</a>
        <Loader />
        <Cursor />
        <ScrollProgress />
        <div className="grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
