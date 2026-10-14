import { marquee } from '@/lib/content';
import { Architecture } from '@/components/Architecture';
import { Cinema } from '@/components/Cinema';
import { Contact } from '@/components/Contact';
import { Disciplines } from '@/components/Disciplines';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { Illustration } from '@/components/Illustration';
import { Intro } from '@/components/Intro';
import { Marquee } from '@/components/Marquee';
import { Nav } from '@/components/Nav';
import { RevealObserver } from '@/components/RevealObserver';
import { WallArt } from '@/components/WallArt';

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee items={marquee} />
        <Intro />
        <Disciplines />
        <Architecture />
        <Cinema />
        <Illustration />
        <WallArt />
        <Contact />
      </main>
      <Footer />
      <RevealObserver />
    </>
  );
}
