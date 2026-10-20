import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowDown, ArrowRight, ArrowUpRight, AudioLines, Bird, Fish, Footprints,
  Leaf, Menu, Search, ShieldCheck, Sprout, Trees, Waves, X, PawPrint, Bug,
  Play, Pause, Image as ImageIcon
} from 'lucide-react'

const images = [
  '/1.jpg',
  '/2.jpg',
  '/3.jpg',
  '/4.jpg',
  '/5.jpg',
  '/6.jpg',
  '/7.jpg',
  '/8.jpg',
  '/9.jpg',
  '/10.jpg',
]

type Species = {
  name: string; scientific: string; category: string; habitat: string;
  diet: string; detail: string; image: string; tag: string
}

const species: Species[] = [
  { name: 'Jaguar', scientific: 'Panthera onca', category: 'Mammals', habitat: 'Forest floor · riverbanks', diet: 'Carnivore', detail: 'A powerful ambush predator and excellent swimmer. Jaguars help regulate prey populations and are a key symbol of the Amazon’s wild landscapes.', image: images[2], tag: 'Apex predator' },
  { name: 'Scarlet macaw', scientific: 'Ara macao', category: 'Birds', habitat: 'Canopy · forest edges', diet: 'Fruit, seeds, nuts', detail: 'A brilliantly colored parrot with a strong curved beak. Macaws help move seeds through the forest and often form long-term pair bonds.', image: images[1], tag: 'Canopy icon' },
  { name: 'Green anaconda', scientific: 'Eunectes murinus', category: 'Reptiles', habitat: 'Swamps · slow rivers', diet: 'Fish and vertebrates', detail: 'One of the heaviest snakes on Earth. It is an aquatic ambush hunter that uses muscular coils to restrain prey. Give wild snakes plenty of space.', image: images[6], tag: 'River specialist' },
  { name: 'Poison dart frog', scientific: 'Dendrobatidae', category: 'Amphibians', habitat: 'Humid forest floor', diet: 'Small invertebrates', detail: 'Some species use potent skin toxins as a defense, while toxicity varies widely. Their vivid colors can warn predators not to eat them.', image: images[3], tag: 'Tiny but striking' },
  { name: 'Capybara', scientific: 'Hydrochoerus hydrochaeris', category: 'Mammals', habitat: 'Wetlands · river margins', diet: 'Grasses and aquatic plants', detail: 'The world’s largest living rodent is a strong swimmer. Groups often stay near water, where they can escape from predators.', image: images[6], tag: 'Wetland neighbor' },
  { name: 'Toucan', scientific: 'Ramphastos spp.', category: 'Birds', habitat: 'Canopy · forest edges', diet: 'Fruit and small animals', detail: 'Its oversized bill helps with feeding and heat exchange. Toucans eat fruit and can help disperse seeds across the forest.', image: images[1], tag: 'Forest fruit-eater' },
  { name: 'Black caiman', scientific: 'Melanosuchus niger', category: 'Reptiles', habitat: 'Lakes · rivers · flooded forest', diet: 'Fish, birds, mammals', detail: 'A large crocodilian that hunts by ambush. Large individuals can be dangerous to people, so keep a safe distance from wildlife at the water’s edge.', image: images[6], tag: 'Aquatic predator' },
  { name: 'Giant river otter', scientific: 'Pteronura brasiliensis', category: 'Mammals', habitat: 'Rivers · oxbow lakes', diet: 'Mostly fish', detail: 'A social, vocal mammal that lives in family groups. Healthy river systems are essential to its survival.', image: images[0], tag: 'River family' },
  { name: 'Harpy eagle', scientific: 'Harpia harpyja', category: 'Birds', habitat: 'Tall forest canopy', diet: 'Arboreal mammals and birds', detail: 'A powerful forest raptor with enormous talons, adapted to hunting among branches beneath the canopy.', image: images[5], tag: 'Canopy hunter' },
  { name: 'Electric eel', scientific: 'Electrophorus spp.', category: 'Fish', habitat: 'Freshwater rivers and floodplains', diet: 'Fish and aquatic animals', detail: 'Despite its name, it is a knifefish. Electric organs generate discharges used to hunt and defend. Never touch one in the water.', image: images[6], tag: 'Electric hunter' },
  { name: 'Bullet ant', scientific: 'Paraponera clavata', category: 'Invertebrates', habitat: 'Forest floor · tree bases', diet: 'Nectar and small prey', detail: 'Known for an exceptionally painful sting. It is best admired from a distance, especially near nesting sites.', image: images[3], tag: 'Tiny defender' },
  { name: 'Sloth', scientific: 'Bradypus / Choloepus', category: 'Mammals', habitat: 'Forest canopy', diet: 'Primarily leaves', detail: 'A slow-moving tree-dweller adapted to conserve energy. Sloths spend much of their lives in the canopy and are difficult to spot among leaves.', image: images[2], tag: 'Quiet climber' },
]
const categories = ['All', 'Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Fish', 'Invertebrates']
const layers = [
  { name: 'Emergent', height: 'Above the canopy', text: 'The tallest trees rise into strong sunlight and wind. Large birds and insects travel through this open upper world.', image: images[4], species: 'Harpy eagle · Macaws' },
  { name: 'Canopy', height: 'The living roof', text: 'A connected world of leaves and branches, rich with fruit, flowers, insects, birds, and tree-dwelling mammals.', image: images[8], species: 'Sloths · Toucans · Monkeys' },
  { name: 'Understory', height: 'Filtered light', text: 'Warm, humid, and shaded. Young trees, broad leaves, climbing plants, and specialist wildlife thrive here.', image: images[2], species: 'Tree frogs · Insects' },
  { name: 'Forest floor', height: 'The recycling layer', text: 'Fallen leaves and dead wood become food for fungi, microbes, and invertebrates that return nutrients to the ecosystem.', image: images[9], species: 'Leafcutter ants · Fungi' },
]

function LocalImage({ src, alt, className = '' }: { src: string; alt: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  return failed
    ? <div className={`image-fallback ${className}`} role="img" aria-label={alt}><Trees size={32} /><span>Amazon rainforest</span></div>
    : <img className={className} src={src} alt={alt} loading="lazy" onError={() => setFailed(true)} />
}

function App() {
  const reduceMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Species | null>(null)
  const [activeLayer, setActiveLayer] = useState(1)
  const [soundOn, setSoundOn] = useState(false)
  const [currentBg, setCurrentBg] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const timer = setInterval(() => {
      setCurrentBg(prev => (prev + 1) % images.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [isAutoPlaying])

  const filtered = useMemo(() => species.filter(s =>
    (activeCategory === 'All' || s.category === activeCategory) &&
    `${s.name} ${s.scientific} ${s.habitat}`.toLowerCase().includes(search.toLowerCase())
  ), [activeCategory, search])
  const reveal = reduceMotion ? { hidden: { opacity: 1 }, visible: { opacity: 1 } } : {
    hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' as const } }
  }
  const navTo = (id: string) => {
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' })
  }

  return <div className="app-shell">
    {/* Full website background slideshow using all 10 JPGs */}
    <div className="global-bg-container" aria-hidden="true">
      {images.map((src, idx) => (
        <div
          key={idx}
          className={`global-bg-slide ${idx === currentBg ? 'active' : ''}`}
          style={{ backgroundImage: `url(${src})` }}
        />
      ))}
      <div className="global-bg-overlay" />
    </div>

    <header className="site-header">
      <button className="brand" onClick={() => navTo('home')} aria-label="Amazon home"><span className="brand-mark"><Leaf size={18} /></span><span>AMAZON<span className="brand-dot">.</span></span></button>
      <nav className={`desktop-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Main navigation">
        {[['Explore', 'explore'], ['Wildlife', 'wildlife'], ['Ecosystem', 'ecosystem'], ['Conservation', 'conservation']].map(([label, id]) =>
          <button key={id} onClick={() => navTo(id)}>{label}</button>)}
        <button className="nav-cta" onClick={() => navTo('wildlife')}>Start exploring <ArrowUpRight size={15} /></button>
      </nav>
      <div className="header-actions">
        <button className={`sound-toggle ${soundOn ? 'active' : ''}`} onClick={() => setSoundOn(v => !v)} aria-label={soundOn ? 'Turn ambient sound indicator off' : 'Turn ambient sound indicator on'} title="Ambient sound is a visual demo only"><AudioLines size={18} /><span>{soundOn ? 'SOUND ON' : 'SOUND OFF'}</span></button>
        <button className="menu-toggle" onClick={() => setMenuOpen(v => !v)} aria-label={menuOpen ? 'Close menu' : 'Open menu'}>{menuOpen ? <X /> : <Menu />}</button>
      </div>
    </header>

    <main>
      <section className="hero" id="home">
        <div className="hero-overlay" />
        <div className="hero-grain" />
        <motion.div className="hero-content" initial="hidden" animate="visible" variants={{ hidden: {}, visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.13 } } }}>
          <motion.p className="eyebrow light" variants={reveal}><span className="eyebrow-line" /> AN IMMERSIVE WILDLIFE EXPEDITION</motion.p>
          <motion.h1 variants={reveal}>ENTER<br /><em>THE WILD.</em></motion.h1>
          <motion.p className="hero-copy" variants={reveal}>One rainforest. Millions of stories.<br className="desktop-only" /> An entire world of life.</motion.p>
          <motion.div className="hero-buttons" variants={reveal}>
            <button className="button button-primary" onClick={() => navTo('explore')}>Explore the rainforest <ArrowDown size={16} /></button>
            <button className="button button-ghost" onClick={() => navTo('wildlife')}><span className="play-dot">↗</span> Discover wildlife</button>
          </motion.div>

          {/* Interactive Background Selector for all 10 JPGs */}
          <motion.div className="hero-bg-selector-bar" variants={reveal}>
            <div className="hero-bg-label">
              <ImageIcon size={14} />
              <span>WALLPAPERS (1-10)</span>
            </div>
            <div className="hero-bg-chips">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`bg-chip ${i === currentBg ? 'active' : ''}`}
                  onClick={() => {
                    setCurrentBg(i)
                    setIsAutoPlaying(false)
                  }}
                  aria-label={`Select background image ${i + 1}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              className="bg-play-toggle"
              onClick={() => setIsAutoPlaying(v => !v)}
              title={isAutoPlaying ? "Pause slideshow" : "Play auto-slideshow"}
              aria-label={isAutoPlaying ? "Pause slideshow" : "Play auto-slideshow"}
            >
              {isAutoPlaying ? <Pause size={13} /> : <Play size={13} />}
              <span>{isAutoPlaying ? 'AUTO' : 'PAUSED'}</span>
            </button>
          </motion.div>
        </motion.div>
        <div className="hero-bottom">
          <span>3° 27' S&nbsp; / &nbsp;60° 00' W</span>
          <span className="hero-bottom-center"><span className="pulse-dot" /> AMAZON BASIN, SOUTH AMERICA</span>
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
        <div className="hero-side-label">A LIVING WORLD / 0{currentBg + 1}</div>
      </section>

      <section className="intro section-pad" id="explore">
        <motion.div className="section-kicker" initial="hidden" whileInView="visible" viewport={{ once: true, amount: .3 }} variants={reveal}><span>01</span><span className="kicker-rule" /> THE WORLD'S LIVING GREEN</motion.div>
        <div className="intro-grid">
          <motion.h2 initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>More than a forest.<br /><em>A world of its own.</em></motion.h2>
          <motion.div className="intro-text" initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal}>
            <p>The Amazon is a vast, interconnected world of forests, rivers, wetlands, and extraordinary life. Every layer has a story—from the sunlit canopy to the quiet movement of the forest floor.</p>
            <button className="text-link" onClick={() => navTo('ecosystem')}>Meet the ecosystem <ArrowRight size={16} /></button>
          </motion.div>
        </div>
        <div className="stats-row">
          {[['~5.5M', 'KM² OF RAINFOREST*'], ['9', 'COUNTRIES & TERRITORY'], ['1,000s', 'OF RIVER TRIBUTARIES'], ['COUNTLESS', 'INTERCONNECTED LIVES']].map(([value, label], i) =>
            <motion.div className="stat" key={label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={reveal} transition={{ delay: i * .08 }}><strong>{value}</strong><span>{label}</span></motion.div>)}
        </div>
        <p className="fine-print">*Commonly cited approximate rainforest area; boundaries and estimates vary. The rainforest, biome, and river basin are different geographic definitions.</p>
      </section>

      <section className="visual-story" aria-label="Rainforest image gallery">
        <div className="story-heading"><span className="eyebrow"><span className="eyebrow-line" /> A CLOSER LOOK</span><p>Every frame holds<br /><em>a different world.</em></p></div>
        <div className="story-grid">
          <motion.figure className="story-card story-large" whileHover={reduceMotion ? {} : { y: -7 }}><LocalImage src={images[4]} alt="Sunlight over a rolling green rainforest canopy" /><figcaption><span>01 / THE CANOPY</span><strong>Where the light lives.</strong></figcaption></motion.figure>
          <motion.figure className="story-card story-tall" whileHover={reduceMotion ? {} : { y: -7 }}><LocalImage src={images[2]} alt="Dense tropical forest vegetation" /><figcaption><span>02 / DEEP GREEN</span><strong>Into the unknown.</strong></figcaption></motion.figure>
          <motion.figure className="story-card story-small" whileHover={reduceMotion ? {} : { y: -7 }}><LocalImage src={images[3]} alt="Close-up of layered rainforest foliage" /><figcaption><span>03 / DETAIL</span><strong>Small worlds.</strong></figcaption></motion.figure>
          <motion.figure className="story-card story-wide" whileHover={reduceMotion ? {} : { y: -7 }}><LocalImage src={images[5]} alt="Misty rainforest canopy rising into the clouds" /><figcaption><span>04 / ABOVE THE TREES</span><strong>A forest breathing.</strong></figcaption></motion.figure>
          <motion.figure className="story-card story-river" whileHover={reduceMotion ? {} : { y: -7 }}><LocalImage src={images[6]} alt="Quiet riverbank surrounded by green forest" /><figcaption><span>05 / FRESHWATER</span><strong>Life follows the river.</strong></figcaption></motion.figure>
          <motion.figure className="story-card story-wide2" whileHover={reduceMotion ? {} : { y: -7 }}><LocalImage src={images[7]} alt="Fog drifting through a forest" /><figcaption><span>06 / MIST & MEMORY</span><strong>Worlds within worlds.</strong></figcaption></motion.figure>
        </div>
      </section>

      <section className="wildlife section-pad" id="wildlife">
        <div className="section-kicker"><span>02</span><span className="kicker-rule" /> WILDLIFE FIELD GUIDE</div>
        <div className="section-heading-row">
          <div><h2>Meet the <em>wild.</em></h2><p className="section-description">From silent canopy dwellers to powerful river predators—discover the lives woven into this ecosystem.</p></div>
          <div className="species-count"><strong>{filtered.length.toString().padStart(2, '0')}</strong><span>SPECIES PROFILES</span></div>
        </div>
        <div className="wildlife-controls">
          <div className="filter-list" role="group" aria-label="Filter species by category">
            {categories.map(c => <button key={c} className={activeCategory === c ? 'filter active' : 'filter'} onClick={() => setActiveCategory(c)}>{c}</button>)}
          </div>
          <label className="search-box"><Search size={17} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Find a species..." aria-label="Search species" />{search && <button onClick={() => setSearch('')} aria-label="Clear search"><X size={15} /></button>}</label>
        </div>
        <motion.div className="animal-grid" layout>
          <AnimatePresence mode="popLayout">
            {filtered.map((animal, i) => <motion.button className="animal-card" key={animal.name} layout initial={reduceMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .97 }} transition={{ duration: .25, delay: i * .025 }} onClick={() => setSelected(animal)}>
              <div className="animal-image"><LocalImage src={animal.image} alt={`${animal.name} habitat image`} /><span className="animal-open"><ArrowUpRight size={18} /></span><span className="animal-tag">{animal.tag}</span></div>
              <div className="animal-meta"><div><h3>{animal.name}</h3><em>{animal.scientific}</em></div><ArrowUpRight size={17} /></div>
              <span className="animal-habitat">{animal.habitat}</span>
            </motion.button>)}
          </AnimatePresence>
          {filtered.length === 0 && <div className="no-results"><PawPrint size={26} /><strong>No species found</strong><span>Try a different name or category.</span></div>}
        </motion.div>
        <div className="wildlife-note"><ShieldCheck size={17} /><p>Wildlife is best observed from a respectful distance. Species behavior and conservation status can vary by location; verify current assessments before publishing.</p></div>
      </section>

      <section className="layers-section" id="ecosystem">
        <div className="layers-image"><LocalImage src={layers[activeLayer].image} alt={`${layers[activeLayer].name} layer rainforest image`} /></div>
        <div className="layers-shade" />
        <div className="layers-content">
          <div className="section-kicker light"><span>03</span><span className="kicker-rule" /> A VERTICAL WORLD</div>
          <h2>Four layers.<br /><em>Endless life.</em></h2>
          <p className="layers-intro">Move through the rainforest from its highest crowns to the living ground below.</p>
          <div className="layer-tabs" role="tablist" aria-label="Rainforest layers">
            {layers.map((layer, i) => <button role="tab" aria-selected={activeLayer === i} className={activeLayer === i ? 'layer-tab active' : 'layer-tab'} key={layer.name} onClick={() => setActiveLayer(i)}><span>0{i + 1}</span>{layer.name}<ArrowUpRight size={15} /></button>)}
          </div>
          <AnimatePresence mode="wait">
            <motion.div key={activeLayer} className="layer-detail" initial={reduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }} transition={{ duration: .25 }}>
              <span className="eyebrow">{layers[activeLayer].height}</span><p>{layers[activeLayer].text}</p><span className="layer-species"><Leaf size={14} /> {layers[activeLayer].species}</span>
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <section className="conservation section-pad" id="conservation">
        <div className="section-kicker"><span>04</span><span className="kicker-rule" /> KEEP THE WILD ALIVE</div>
        <div className="conservation-grid">
          <div className="conservation-copy"><h2>A future worth<br /><em>protecting.</em></h2><p>Deforestation, fire, drought, and habitat fragmentation place growing pressure on the Amazon. Protecting this living system means supporting science, local communities, Indigenous rights, and long-term forest stewardship.</p><button className="button button-primary" onClick={() => window.open('https://www.worldwildlife.org/places/amazon', '_blank', 'noopener,noreferrer')}>Learn about conservation <ArrowUpRight size={16} /></button></div>
          <div className="conservation-visual"><LocalImage src={images[8]} alt="Dense green rainforest canopy" /><div className="conservation-overlay"><Sprout size={22} /><span>EVERY ECOSYSTEM<br />IS CONNECTED.</span></div></div>
        </div>
        <div className="conservation-points">
          <div><Trees size={21} /><strong>Protect forests</strong><span>Keep connected habitats standing.</span></div>
          <div><Waves size={21} /><strong>Care for rivers</strong><span>Reduce pollution and protect freshwater life.</span></div>
          <div><Footprints size={21} /><strong>Respect communities</strong><span>Support locally led stewardship.</span></div>
        </div>
      </section>

      <section className="closing">
        <LocalImage src={images[9]} alt="Sunlight filtering onto the rainforest floor" className="closing-image" />
        <div className="closing-overlay" />
        <div className="closing-content"><span className="eyebrow light"><span className="eyebrow-line" /> THE EXPEDITION CONTINUES</span><h2>Stay curious.<br /><em>Leave no trace.</em></h2><button className="button button-primary" onClick={() => navTo('home')}>Back to the beginning <ArrowUpRight size={16} /></button></div>
        <span className="closing-caption">AMAZON RAINFOREST / A LIVING WORLD</span>
      </section>
    </main>

    <footer className="site-footer"><button className="brand" onClick={() => navTo('home')}><span className="brand-mark"><Leaf size={17} /></span><span>AMAZON<span className="brand-dot">.</span></span></button><span>BUILT FOR THE CURIOUS.</span><span>Educational exploration · Respect the wild</span></footer>

    <AnimatePresence>
      {selected && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => { if (e.target === e.currentTarget) setSelected(null) }}>
        <motion.div className="species-modal" role="dialog" aria-modal="true" aria-labelledby="species-title" initial={reduceMotion ? false : { opacity: 0, y: 18, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10 }} transition={{ duration: .22 }}>
          <button className="modal-close" onClick={() => setSelected(null)} aria-label="Close species details"><X size={20} /></button>
          <div className="modal-image"><LocalImage src={selected.image} alt={`${selected.name} related rainforest image`} /></div>
          <div className="modal-body"><span className="eyebrow">{selected.category} / FIELD NOTES</span><h2 id="species-title">{selected.name}</h2><em className="modal-scientific">{selected.scientific}</em><p>{selected.detail}</p><div className="modal-facts"><div><span>HABITAT</span><strong>{selected.habitat}</strong></div><div><span>DIET</span><strong>{selected.diet}</strong></div></div><p className="modal-disclaimer">Image note: the supplied local photographs illustrate rainforest environments and may not depict this exact species. Add a verified, licensed species photograph before publishing this profile.</p></div>
        </motion.div>
      </motion.div>}
    </AnimatePresence>
  </div>
}

export default App
