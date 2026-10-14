// All copy and media for the portfolio lives here, so updating the site rarely
// means touching a component. Images are served from /public/media.

export type Img = { src: string; width: number; height: number; alt: string };

export const site = {
  name: 'Shins Joy',
  tagline: 'Artist & Architectural Designer',
  location: 'Kerala, India',
  instagram: 'https://www.instagram.com/shinsjoy/',
  threads: 'https://www.threads.net/@shinsjoy',
  // Set an address to show an "Email" button in the contact section.
  email: '',
};

export const hero = {
  arch: {
    src: '/media/arch-malargal-1.webp', width: 1440, height: 1735,
    alt: 'Terracotta-clad double-height court at Malargal, with timber windows and hanging lamps',
  },
  ink: {
    src: '/media/ink-happy-wheel.jpg', width: 1440, height: 1121,
    alt: 'Blue ballpoint drawing of children riding in a wheelbarrow',
  },
  paint: {
    src: '/media/aadu3-walter-sayip.jpg', width: 640, height: 1136,
    alt: 'Detail of an acrylic painting of a red-coated officer on horseback, made for Aadu 3',
  },
  roles: ['spaces', 'film sets', 'illustrations', 'murals'],
};

export const marquee = ['Architecture', 'Set Design', 'Illustration', 'Wall Art'];

// The about statement inks in word by word; `tone` colours a phrase.
export const statement: { text: string; em?: boolean; tone?: 'blue' | 'terra' }[] = [
  { text: 'Shins Joy is an artist and architectural designer who moves between buildings, film sets and sketchbooks — drawing in ' },
  { text: 'blue ballpoint', em: true, tone: 'blue' },
  { text: ', building in ' },
  { text: 'terracotta and timber', em: true, tone: 'terra' },
  { text: ', and painting worlds for ' },
  { text: 'Malayalam cinema.', em: true },
];

export const stats = [
  { label: 'Disciplines', value: 4 },
  { label: 'Feature films', value: 2 },
  { label: 'sq ft — Malargal', value: 3000 },
];

export const disciplines = [
  { no: '01', name: 'Architecture', desc: 'Homes rooted in South Indian tradition', href: '#architecture', img: '/media/arch-malargal-4.webp' },
  { no: '02', name: 'Set Design', desc: 'Worlds for Malayalam cinema', href: '#cinema', img: '/media/aadu3-walter-sayip.jpg' },
  { no: '03', name: 'Illustration', desc: 'Ballpoint, ink, charcoal, pastel, pixels', href: '#illustration', img: '/media/ink-blue.jpg' },
  { no: '04', name: 'Wall Art', desc: 'Large-format paintings & murals', href: '#wall-art', img: '/media/painting-full.jpg' },
];

export const malargal = {
  title: 'Malargal',
  sub: '“fragrance of tradition”',
  body: 'A modern take on South Indian architecture with flavours of Chettinad style — terracotta, teak and light, gathered around a double-height court.',
  spec: [
    { label: 'Type', value: 'Residence' },
    { label: 'Client', value: 'Vijeesh Kumar' },
    { label: 'Area', value: '3,000 sq ft' },
    { label: 'Location', value: 'Ettumanoor, Kottayam' },
    { label: 'With', value: '@touchedesign_studio', href: 'https://www.instagram.com/touchedesign_studio/' },
    { label: 'Photos', value: '@nathanphotos.in', href: 'https://www.instagram.com/nathanphotos.in/' },
  ],
  panels: [
    {
      src: '/media/arch-malargal-1.webp', width: 1440, height: 1735,
      alt: 'Double-height court at Malargal clad in terracotta tile, with timber windows, hanging lamps and brass lamps on a black floor',
      caption: 'The court — terracotta walls, carved timber windows and lamplight around a double-height void.',
    },
    {
      src: '/media/arch-malargal-4.webp', width: 1440, height: 1735,
      alt: 'Front façade of Malargal: terracotta-clad volumes, white plaster bands and timber-and-grille windows',
      caption: 'Façade — warm terracotta volumes held by crisp white bands.',
    },
    {
      src: '/media/arch-malargal-2.webp', width: 1440, height: 1734,
      alt: 'Bedroom at Malargal with a teak window seat, fluted green glass, a carved chair, a gramophone and patterned floor tiles',
      caption: 'Bedroom — a teak window seat with fluted green glass, over patterned floor tiles.',
    },
    {
      src: '/media/arch-malargal-3.webp', width: 1440, height: 1734,
      alt: 'Arched window at Malargal with perforated timber shutters letting in dappled light',
      caption: 'Arched shutters cut with quatrefoils — light becomes ornament.',
      arch: true,
    },
  ],
  fieldNotes: {
    image: {
      src: '/media/sketch-kuttichira.jpg', width: 720, height: 1280,
      alt: 'Pen sketch of the tiered roofs of the Mishkal Mosque in progress in a pocket sketchbook',
    },
    title: 'Drawing heritage,',
    titleEm: 'on site',
    body: 'Sketching the Mishkal Mosque on a heritage walk through Kuttichira, Kozhikode, with the Ranthal Design Community.',
  },
};

export const aadu3 = {
  ml: 'ആട് 3',
  title: 'Aadu 3',
  meta: '2026 · Fantasy comedy · Directed by Midhun Manuel Thomas',
  bodyBefore: 'For the third chapter of the cult franchise, Shins painted ',
  bodyEm: '“Chronicles of Walter Sayip”',
  bodyAfter: ' — an acrylic-on-canvas battle portrait created as a period piece for the film.',
  credits: ['Set design', 'Scenic painting', 'Acrylic on canvas'],
  clapper: { scene: '07', take: '03' },
  video: '/media/aadu3-walter-sayip.mp4',
  poster: '/media/aadu3-walter-sayip.jpg',
};

export const vala = {
  ml: 'വല',
  title: 'Vala',
  meta: 'Science fiction · Directed by Arun Chandu',
  body: 'Set design for Arun Chandu’s science-fiction adventure — a Malayalam take on aliens, machines and dystopia.',
  credits: ['Set design'],
  clapper: { scene: '01', take: '01' },
  badge: { src: '/media/film-vala-cover.jpg', width: 150, height: 150, alt: 'Clapperboard from the set of Vala' },
};

export type ArtCategory = 'ballpoint' | 'sketchbook' | 'figure' | 'digital';

export const artFilters: { id: 'all' | ArtCategory; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'ballpoint', label: 'Ballpoint' },
  { id: 'sketchbook', label: 'Sketchbook' },
  { id: 'figure', label: 'Figure' },
  { id: 'digital', label: 'Digital' },
];

// Order matters: the gallery flows top-to-bottom in columns, so this order keeps
// ballpoint, sketchbook and digital work at the top of each column.
export const artworks: (Img & { title: string; meta: string; cat: ArtCategory })[] = [
  { cat: 'ballpoint', title: 'blue', meta: 'Ballpoint on paper · 2020', src: '/media/ink-blue.jpg', width: 1080, height: 1080, alt: 'Blue ballpoint drawing of three children huddled on a bench' },
  { cat: 'ballpoint', title: 'Happy Wheel', meta: 'Ballpoint on paper · 2023', src: '/media/ink-happy-wheel.jpg', width: 1440, height: 1121, alt: 'Blue ballpoint drawing of a family riding in a wheelbarrow' },
  { cat: 'ballpoint', title: 'Untitled', meta: 'Ballpoint on paper · 2023', src: '/media/ink-mother.jpg', width: 1440, height: 1781, alt: 'Blue ballpoint drawing of a baby held close against its mother' },
  { cat: 'sketchbook', title: 'The Bench', meta: 'Ink in sketchbook · 2026', src: '/media/sketch-bench-1.webp', width: 1080, height: 566, alt: 'Ink sketchbook spread of five people waiting on a bench' },
  { cat: 'sketchbook', title: 'Tosh Village', meta: 'Ink & wash, on location · 2026', src: '/media/sketch-tosh.webp', width: 1440, height: 1920, alt: 'Ink-and-wash sketchbook of snowy mountains held up against the real view from a balcony in Tosh village' },
  { cat: 'figure', title: 'Figure Study III', meta: 'Charcoal on paper · 2026', src: '/media/figure-charcoal.webp', width: 1080, height: 1440, alt: 'Charcoal figure study of a seated woman with long curly hair' },
  { cat: 'sketchbook', title: 'The Bench, on location', meta: 'Ink in sketchbook · 2026', src: '/media/sketch-bench-3.webp', width: 1080, height: 565, alt: 'The Bench sketchbook held up in front of the real benches it was drawn from' },
  { cat: 'digital', title: 'Armed with a Mind', meta: 'Digital illustration · 2026', src: '/media/illus-armed-with-a-mind.webp', width: 1440, height: 1666, alt: 'Greyscale digital illustration of a helmeted delivery rider handing over a parcel of red hearts, with protest posters behind' },
  { cat: 'figure', title: 'Figure Study I', meta: 'Oil pastels on paper · 2026', src: '/media/figure-pastel-1.webp', width: 1440, height: 1768, alt: 'Oil pastel figure study in red, ochre and black' },
  { cat: 'figure', title: 'Figure Study II', meta: 'Oil pastels on paper · 2026', src: '/media/figure-pastel-3.webp', width: 1440, height: 1673, alt: 'Oil pastel figure study of a seated figure seen from behind' },
];

export const wallArt = {
  title: 'From a pencil line to a',
  titleEm: 'wall',
  body: 'Large-format paintings and murals for homes, cafés, studios and sets — sketched by hand, built up in acrylic, finished to be lived with.',
  process: [
    { step: '01', label: 'Sketch', src: '/media/painting-sketch.jpg', width: 720, height: 1280, alt: 'Pencil underdrawing on canvas' },
    { step: '02', label: 'Paint', src: '/media/painting-brush.jpg', width: 720, height: 1280, alt: 'Close-up of a fine brush painting detail onto canvas' },
    { step: '03', label: 'Finish', src: '/media/painting-easel.jpg', width: 720, height: 1280, alt: 'The finished painting standing on an easel' },
  ],
  painting: {
    src: '/media/painting-full.jpg', width: 634, height: 1010,
    alt: 'Chronicles of Walter Sayip: acrylic painting of a red-coated officer raising a sword on a rearing horse, soldiers and a cannon behind',
  },
  caption: '“Chronicles of Walter Sayip” · Acrylic on canvas · for Aadu 3',
};
