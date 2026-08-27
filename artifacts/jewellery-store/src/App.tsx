import { useEffect, useMemo, useState } from 'react';
import {
  ArrowRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from 'lucide-react';
import { type ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import heroImage from '../attached_assets/generated_images/aurelia-hero.jpg';
import necklaceImage from '../attached_assets/generated_images/aurelia-necklace.jpg';
import hoopsImage from '../attached_assets/generated_images/aurelia-hoops.jpg';
import { fetchProducts } from '@/lib/store-data';

const queryClient = new QueryClient();

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  tone: string;
  note: string;
  detail: string;
  featured?: boolean;
};

type BagLine = Product & { quantity: number };

const seedProducts: Product[] = [
  {
    id: '01',
    name: 'The Solace Pendant',
    category: 'Necklaces',
    price: 285,
    image: necklaceImage,
    tone: '14k recycled gold · freshwater pearl',
    note: 'A small, luminous anchor.',
    detail: 'Hand-finished in our London studio, the Solace holds one quiet pearl on a fine, adjustable chain.',
    featured: true,
  },
  {
    id: '02',
    name: 'Arc Hoops',
    category: 'Earrings',
    price: 210,
    image: hoopsImage,
    tone: '14k recycled gold',
    note: 'Everyday, with a little edge.',
    detail: 'An imperfect circle with a softly hammered surface. Light enough for all-day wear, considered enough to keep.',
    featured: true,
  },
  {
    id: '03',
    name: 'Rill Signet',
    category: 'Rings',
    price: 340,
    image: heroImage,
    tone: '14k recycled gold · hand-textured',
    note: 'A thumbprint in metal.',
    detail: 'A low, sculpted signet with a hand-drawn line through its face. Each one carries the marks of its making.',
    featured: true,
  },
  {
    id: '04',
    name: 'Stillwater Chain',
    category: 'Necklaces',
    price: 390,
    image: heroImage,
    tone: '14k recycled gold · 18"',
    note: 'The one you never take off.',
    detail: 'A fine curb chain with a soft, fluid drape. Layer it or let it speak alone.',
  },
  {
    id: '05',
    name: 'Morrow Studs',
    category: 'Earrings',
    price: 155,
    image: hoopsImage,
    tone: 'Sterling silver · vermeil',
    note: 'Small light, close to the skin.',
    detail: 'Pebble-like studs made to sit close. Sold as a pair and polished by hand.',
  },
  {
    id: '06',
    name: 'Contour Band',
    category: 'Rings',
    price: 265,
    image: necklaceImage,
    tone: '14k recycled gold',
    note: 'A line that keeps returning.',
    detail: 'A gently undulating band that catches light from every angle. Wear it alone or in a stack.',
  },
];

const categories = ['All pieces', 'Necklaces', 'Earrings', 'Rings'];

function money(value: number) {
   return `RM ${value.toLocaleString('en-US')}`;
}

function IconButton({
  label,
  onClick,
  children,
  testId,
  active = false,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
  testId: string;
  active?: boolean;
}) {
  return (
    <button
      aria-label={label}
      data-testid={testId}
      onClick={onClick}
      className={`icon-button ${active ? 'is-active' : ''}`}
      type="button"
    >
      {children}
    </button>
  );
}

function ProductCard({
  product,
  favorite,
  onFavorite,
  onAdd,
  onQuickView,
}: {
  product: Product;
  favorite: boolean;
  onFavorite: () => void;
  onAdd: () => void;
  onQuickView: () => void;
}) {
  return (
    <article className="product-card" data-testid={`card-product-${product.id}`}>
      <div className="product-image-wrap">
        <button
          className="product-image-button"
          type="button"
          onClick={onQuickView}
          data-testid={`button-quick-view-${product.id}`}
          aria-label={`View ${product.name}`}
        >
          <img src={product.image} alt={product.name} className="product-image" />
          <span className="quick-view-label">Quick view</span>
        </button>
        <button
          className={`favorite-button ${favorite ? 'is-favorite' : ''}`}
          type="button"
          onClick={onFavorite}
          data-testid={`button-favorite-${product.id}`}
          aria-label={favorite ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
        >
          <Heart size={17} strokeWidth={1.4} fill={favorite ? 'currentColor' : 'none'} />
        </button>
      </div>
      <div className="product-meta">
        <div>
          <h3 data-testid={`text-product-${product.id}`}>{product.name}</h3>
          <p>{product.tone}</p>
        </div>
        <span className="product-price">{money(product.price)}</span>
      </div>
      <button className="add-link" type="button" onClick={onAdd} data-testid={`button-add-product-${product.id}`}>
        Add to bag <ArrowRight size={14} />
      </button>
    </article>
  );
}

function AppStorefront() {
  const [activeCategory, setActiveCategory] = useState('All pieces');
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [bagOpen, setBagOpen] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [products, setProducts] = useState<Product[]>(seedProducts);

  useEffect(() => {
    // 從 Supabase 讀真正的商品；讀不到就沿用上面寫死的那組
    fetchProducts(heroImage).then((live) => {
      if (live.length) setProducts(live);
    });
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = activeCategory === 'All pieces' || product.category === activeCategory;
      const normalizedQuery = query.trim().toLowerCase();
      const matchesSearch =
        !normalizedQuery ||
        `${product.name} ${product.category} ${product.tone}`.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesSearch;
    });
   }, [activeCategory, query, products]);

  const bagCount = bag.reduce((sum, item) => sum + item.quantity, 0);
  const bagTotal = bag.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToBag(product: Product) {
    setBag((current) => {
      const existing = current.find((item) => item.id === product.id);
      if (existing) {
        return current.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setBagOpen(true);
  }

  function toggleFavorite(id: string) {
    setFavorites((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  function updateQuantity(id: string, delta: number) {
    setBag((current) =>
      current
        .map((item) => item.id === id ? { ...item, quantity: item.quantity + delta } : item)
        .filter((item) => item.quantity > 0),
    );
  }

  function scrollToPieces() {
    document.getElementById('pieces')?.scrollIntoView({ behavior: 'smooth' });
  }

  return (
    <div className="helora-app">
      <div className="announcement-bar">
        Complimentary shipping on orders over $150 <span>·</span> Made slowly in London
      </div>
      <header className="site-header">
        <button
          className="mobile-menu"
          type="button"
          onClick={() => setMobileNav((open) => !open)}
          aria-label="Toggle navigation"
          data-testid="button-mobile-menu"
        >
          <Menu size={20} />
        </button>
        <nav className={`main-nav ${mobileNav ? 'mobile-open' : ''}`} aria-label="Main navigation">
          <button type="button" onClick={() => { setActiveCategory('Necklaces'); scrollToPieces(); setMobileNav(false); }} data-testid="link-necklaces">Necklaces</button>
          <button type="button" onClick={() => { setActiveCategory('Earrings'); scrollToPieces(); setMobileNav(false); }} data-testid="link-earrings">Earrings</button>
          <button type="button" onClick={() => { setActiveCategory('Rings'); scrollToPieces(); setMobileNav(false); }} data-testid="link-rings">Rings</button>
          <button type="button" onClick={() => { setActiveCategory('All pieces'); scrollToPieces(); setMobileNav(false); }} data-testid="link-all-pieces">All pieces</button>
        </nav>
        <button className="wordmark" type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} data-testid="link-home">
          HELORA
        </button>
        <div className="header-actions">
          <IconButton label="Search" onClick={() => setSearchOpen(true)} testId="button-open-search"><Search size={18} strokeWidth={1.5} /></IconButton>
          <IconButton label="Open wishlist" onClick={() => { setQuery(''); scrollToPieces(); }} testId="button-open-wishlist" active={favorites.length > 0}><Heart size={18} strokeWidth={1.5} /></IconButton>
          <button className="bag-button" type="button" onClick={() => setBagOpen(true)} data-testid="button-open-bag">
            Bag <span className="bag-count">{bagCount}</span>
          </button>
        </div>
      </header>

      <main>
        <section className="hero-section">
          <div className="hero-copy reveal-up">
            <p className="eyebrow">A small jewellery house</p>
            <h1>Keep what<br /><em>matters.</em></h1>
            <p className="hero-intro">Jewellery for the life you are already living. Made by hand, meant to gather stories.</p>
            <button className="dark-button" type="button" onClick={scrollToPieces} data-testid="button-shop-new">
              Shop the new collection <ArrowRight size={16} />
            </button>
          </div>
          <div className="hero-visual reveal-in">
            <img src={heroImage} alt="HELORA gold jewellery arranged in warm afternoon light" />
            <div className="image-caption"><span>01 / 06</span><span>Objects with a pulse</span></div>
          </div>
          <div className="hero-note">EST.<br />2018<br /><span>London</span></div>
        </section>

        <section className="manifesto-section">
          <div className="section-kicker">Our point of view <span>02</span></div>
          <div className="manifesto-copy">
            <p className="large-serif">The best pieces become part of your vocabulary.</p>
            <p className="manifesto-body">HELORA is an independent jewellery house creating modern heirlooms from recycled gold, responsible stones and a deep respect for the hand. Nothing loud. Nothing disposable. Just good things, made to stay.</p>
            <button className="text-button" type="button" onClick={() => setStoryOpen(true)} data-testid="button-read-story">
              Read our story <ArrowRight size={15} />
            </button>
          </div>
          <div className="manifesto-mark"><Sparkles size={21} strokeWidth={1} /><span>Considered<br />objects</span></div>
        </section>

        <section className="pieces-section" id="pieces">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The edit / 2024</p>
              <h2>New forms</h2>
            </div>
            <p className="section-aside">Small gestures,<br />lasting impressions.</p>
          </div>
          <div className="collection-toolbar">
            <div className="category-tabs" role="tablist" aria-label="Product categories">
              {categories.map((category) => (
                <button
                  key={category}
                  role="tab"
                  type="button"
                  aria-selected={activeCategory === category}
                  className={activeCategory === category ? 'active' : ''}
                  onClick={() => setActiveCategory(category)}
                  data-testid={`tab-category-${category.toLowerCase().replaceAll(' ', '-')}`}
                >
                  {category}
                </button>
              ))}
            </div>
            <button className="filter-button" type="button" onClick={() => setSearchOpen(true)} data-testid="button-filter-pieces">
              <Search size={14} /> Search pieces
            </button>
          </div>
          {filteredProducts.length > 0 ? (
            <div className="product-grid">
              {filteredProducts.map((product, index) => (
                <div className={`grid-item grid-item-${index + 1}`} key={product.id}>
                  <ProductCard
                    product={product}
                    favorite={favorites.includes(product.id)}
                    onFavorite={() => toggleFavorite(product.id)}
                    onAdd={() => addToBag(product)}
                    onQuickView={() => setQuickProduct(product)}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-search" data-testid="status-empty-search">
              <p className="eyebrow">Nothing found</p>
              <h3>Try a softer search.</h3>
              <p>We couldn't find a piece matching “{query}”.</p>
              <button className="text-button" type="button" onClick={() => { setQuery(''); setActiveCategory('All pieces'); }} data-testid="button-clear-search">Clear search <ArrowRight size={15} /></button>
            </div>
          )}
        </section>

        <section className="collection-banner">
          <div className="banner-copy">
            <p className="eyebrow">Collection no. 03</p>
            <h2>Lines that<br /><em>linger.</em></h2>
            <p>For the in-between moments. A study in soft edges, warm metal and the things we return to.</p>
            <button className="light-button" type="button" onClick={() => { setActiveCategory('All pieces'); scrollToPieces(); }} data-testid="button-explore-collection">
              Explore the collection <ArrowRight size={16} />
            </button>
          </div>
          <div className="banner-detail">
            <span className="detail-circle"></span>
            <span className="detail-caption">Form / function / feeling</span>
          </div>
        </section>

        <section className="journal-section" id="journal">
          <div className="journal-intro">
            <p className="eyebrow">From the journal</p>
            <h2>Notes on<br /><em>keeping.</em></h2>
            <button className="text-button" type="button" onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} data-testid="button-view-journal">View all notes <ArrowRight size={15} /></button>
          </div>
          <div className="journal-grid">
            <article className="journal-card journal-card-tall">
              <div className="journal-art art-still-life"><span>care / 01</span></div>
              <p className="eyebrow">On care</p>
              <h3>A little polish,<br />a longer life.</h3>
              <button type="button" onClick={() => setSearchOpen(true)} data-testid="button-read-care">Read the note <ArrowRight size={14} /></button>
            </article>
            <article className="journal-card">
              <div className="journal-art art-workshop"><span>making / 02</span></div>
              <p className="eyebrow">In the studio</p>
              <h3>Why the hand<br />still matters.</h3>
              <button type="button" onClick={() => setQuickProduct(products[2] ?? products[0] ?? null)} data-testid="button-read-studio">Read the note <ArrowRight size={14} /></button>
            </article>
          </div>
        </section>

        <section className="newsletter-section">
          <div><p className="eyebrow">HELORA, in your inbox</p><h2>Keep in touch.</h2></div>
          <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); (event.currentTarget.elements.namedItem('email') as HTMLInputElement).value = ''; }} >
            <input name="email" type="email" placeholder="Your email address" required data-testid="input-newsletter-email" />
            <button type="submit" aria-label="Subscribe to newsletter" data-testid="button-subscribe"><ArrowRight size={18} /></button>
          </form>
          <p className="newsletter-fineprint">Studio notes, new pieces and the occasional good idea. No noise.</p>
        </section>
      </main>

      <footer className="site-footer">
        <div className="footer-brand"><span className="wordmark-small">HELORA</span><p>Jewellery for keeping.</p></div>
        <div className="footer-links"><div><p className="eyebrow">Explore</p><button type="button" onClick={scrollToPieces} data-testid="footer-shop">Shop all pieces</button><button type="button" onClick={() => setActiveCategory('Rings')} data-testid="footer-rings">Rings</button><button type="button" onClick={() => setActiveCategory('Necklaces')} data-testid="footer-necklaces">Necklaces</button></div><div><p className="eyebrow">Visit</p><button type="button" onClick={() => setSearchOpen(true)} data-testid="footer-contact">Contact us</button><button type="button" onClick={() => setSearchOpen(true)} data-testid="footer-shipping">Shipping & returns</button><button type="button" onClick={() => setSearchOpen(true)} data-testid="footer-care">Jewellery care</button></div></div>
        <div className="footer-end"><span>© 2024 HELORA London</span><span>Made slowly, worn often.</span></div>
      </footer>

      {searchOpen && (
        <div className="search-overlay" role="dialog" aria-modal="true" data-testid="dialog-search">
          <div className="search-panel">
            <div className="search-top"><span className="eyebrow">Find a piece</span><IconButton label="Close search" onClick={() => setSearchOpen(false)} testId="button-close-search"><X size={20} /></IconButton></div>
            <div className="search-input-wrap"><Search size={22} strokeWidth={1.3} /><input autoFocus type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search necklaces, rings, hoops..." data-testid="input-search-products" /><button type="button" onClick={() => setSearchOpen(false)} data-testid="button-search-done">Done</button></div>
            <div className="search-suggestions"><span>Popular searches</span><button type="button" onClick={() => setQuery('gold')} data-testid="button-search-gold">gold</button><button type="button" onClick={() => setQuery('pearl')} data-testid="button-search-pearl">pearl</button><button type="button" onClick={() => setQuery('everyday')} data-testid="button-search-everyday">everyday</button></div>
          </div>
        </div>
      )}

      {storyOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="story-title" data-testid="dialog-our-story">
          <article className="story-view">
            <button className="modal-close" type="button" onClick={() => setStoryOpen(false)} data-testid="button-close-story" aria-label="Close our story"><X size={19} /></button>
            <div className="story-kicker">
              <span className="eyebrow">Our story / 01</span>
              <span className="story-mark">✦</span>
            </div>
            <div className="story-copy">
              <h2 id="story-title">Wear Your <em>Aura.</em></h2>
              <p>When I first entered the corporate world, my love for dressing up and jewellery earned me the nickname “butterfly.” I was once told to tone it down — to look more professional and less expressive.</p>
              <p>It made me wonder:</p>
              <p className="story-question">Why should we become less of ourselves just to fit someone else's idea of who we should be?</p>
              <p>That thought became HELORA.</p>
              <p>We create jewellery not to change who you are, but to reflect who you already are — pieces you choose because they feel like you, not because they seek anyone else's approval.</p>
              <p>And I learned something along the way: when you feel free to be yourself, you quietly give others permission to do the same.</p>
              <p className="story-closing">You were never meant to blend in.<br /><strong>Wear Your Aura.</strong></p>
            </div>
          </article>
        </div>
      )}

      {quickProduct && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" data-testid="dialog-quick-view">
          <div className="quick-view">
            <button className="modal-close" type="button" onClick={() => setQuickProduct(null)} data-testid="button-close-quick-view" aria-label="Close quick view"><X size={19} /></button>
            <div className="quick-image"><img src={quickProduct.image} alt={quickProduct.name} /></div>
            <div className="quick-copy"><p className="eyebrow">{quickProduct.category} / HELORA</p><h2>{quickProduct.name}</h2><p className="quick-detail">{quickProduct.detail}</p><p className="quick-tone">{quickProduct.tone}</p><div className="quick-buy"><span>{money(quickProduct.price)}</span><button className="dark-button" type="button" onClick={() => { addToBag(quickProduct); setQuickProduct(null); }} data-testid={`button-quick-add-${quickProduct.id}`}>Add to bag <ArrowRight size={16} /></button></div></div>
          </div>
        </div>
      )}

      {bagOpen && (
        <div className="bag-layer" role="dialog" aria-modal="true" data-testid="dialog-shopping-bag">
          <button className="bag-scrim" type="button" aria-label="Close shopping bag" onClick={() => setBagOpen(false)} data-testid="button-close-bag-scrim" />
          <aside className="bag-drawer">
            <div className="bag-header"><div><p className="eyebrow">Your selection</p><h2>Shopping bag <span>({bagCount})</span></h2></div><IconButton label="Close shopping bag" onClick={() => setBagOpen(false)} testId="button-close-bag"><X size={20} /></IconButton></div>
            {bag.length === 0 ? (
              <div className="empty-bag" data-testid="status-empty-bag"><div className="empty-bag-mark"><ShoppingBag size={24} strokeWidth={1} /></div><h3>Your bag is waiting.</h3><p>Pieces you love will live here.</p><button className="text-button" type="button" onClick={() => { setBagOpen(false); scrollToPieces(); }} data-testid="button-browse-bag">Browse the collection <ArrowRight size={15} /></button></div>
            ) : (
              <><div className="bag-lines">{bag.map((item) => <div className="bag-line" key={item.id} data-testid={`row-bag-item-${item.id}`}><img src={item.image} alt="" /><div className="bag-line-copy"><h3>{item.name}</h3><p>{money(item.price)}</p><div className="quantity-control"><button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={`Decrease ${item.name} quantity`} data-testid={`button-decrease-${item.id}`}><Minus size={13} /></button><span data-testid={`text-quantity-${item.id}`}>{item.quantity}</span><button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={`Increase ${item.name} quantity`} data-testid={`button-increase-${item.id}`}><Plus size={13} /></button></div></div><span className="bag-line-total">{money(item.price * item.quantity)}</span></div>)}</div><div className="bag-summary"><div><span>Subtotal</span><strong>{money(bagTotal)}</strong></div><p>Shipping calculated at checkout. Complimentary over $150.</p><button className="dark-button checkout-button" type="button" onClick={() => setBagOpen(false)} data-testid="button-checkout">Continue to checkout <ArrowRight size={16} /></button></div></>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={AppStorefront} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
