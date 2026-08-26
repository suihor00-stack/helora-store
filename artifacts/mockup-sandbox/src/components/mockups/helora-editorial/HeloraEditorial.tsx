import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  Heart,
  Menu,
  Minus,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  material: string;
  note: string;
  detail: string;
};

type BagLine = Product & { quantity: number };

const heroImage = "/__mockup/images/helora-editorial-hero.jpg";
const detailImage = "/__mockup/images/helora-editorial-detail.jpg";

const products: Product[] = [
  {
    id: "01",
    name: "The Solace Pendant",
    category: "Necklaces",
    price: 285,
    image: heroImage,
    material: "14k recycled gold · freshwater pearl",
    note: "A small, luminous anchor.",
    detail:
      "Hand-finished in our London studio, the Solace holds one quiet pearl on a fine, adjustable chain.",
  },
  {
    id: "02",
    name: "Arc Hoops",
    category: "Earrings",
    price: 210,
    image: detailImage,
    material: "14k recycled gold",
    note: "Everyday, with a little edge.",
    detail:
      "An imperfect circle with a softly hammered surface. Light enough for all-day wear, considered enough to keep.",
  },
  {
    id: "03",
    name: "Rill Signet",
    category: "Rings",
    price: 340,
    image: heroImage,
    material: "14k recycled gold · hand-textured",
    note: "A thumbprint in metal.",
    detail:
      "A low, sculpted signet with a hand-drawn line through its face. Each one carries the marks of its making.",
  },
  {
    id: "04",
    name: "Stillwater Chain",
    category: "Necklaces",
    price: 390,
    image: detailImage,
    material: "14k recycled gold · 18”",
    note: "The one you never take off.",
    detail:
      "A fine curb chain with a soft, fluid drape. Layer it or let it speak alone.",
  },
  {
    id: "05",
    name: "Morrow Studs",
    category: "Earrings",
    price: 155,
    image: heroImage,
    material: "Sterling silver · vermeil",
    note: "Small light, close to the skin.",
    detail:
      "Pebble-like studs made to sit close. Sold as a pair and polished by hand.",
  },
  {
    id: "06",
    name: "Contour Band",
    category: "Rings",
    price: 265,
    image: detailImage,
    material: "14k recycled gold",
    note: "A line that keeps returning.",
    detail:
      "A gently undulating band that catches light from every angle. Wear it alone or in a stack.",
  },
];

const categories = ["All pieces", "Necklaces", "Earrings", "Rings"];

function money(value: number) {
  return `$${value.toLocaleString("en-US")}`;
}

export function HeloraEditorial() {
  const [activeCategory, setActiveCategory] = useState("All pieces");
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]);
  const [bag, setBag] = useState<BagLine[]>([]);
  const [bagOpen, setBagOpen] = useState(false);
  const [quickProduct, setQuickProduct] = useState<Product | null>(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const visibleProducts = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return products.filter((product) => {
      const categoryMatch =
        activeCategory === "All pieces" || product.category === activeCategory;
      const searchMatch =
        !needle ||
        `${product.name} ${product.category} ${product.material}`
          .toLowerCase()
          .includes(needle);
      return categoryMatch && searchMatch;
    });
  }, [activeCategory, query]);

  const bagCount = bag.reduce((total, line) => total + line.quantity, 0);
  const bagTotal = bag.reduce(
    (total, line) => total + line.quantity * line.price,
    0,
  );

  function chooseCategory(category: string) {
    setActiveCategory(category);
    setMenuOpen(false);
    window.setTimeout(() => {
      document.getElementById("editorial-pieces")?.scrollIntoView({
        behavior: "smooth",
      });
    }, 20);
  }

  function addToBag(product: Product) {
    setBag((current) => {
      const existing = current.find((line) => line.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.id === product.id
            ? { ...line, quantity: line.quantity + 1 }
            : line,
        );
      }
      return [...current, { ...product, quantity: 1 }];
    });
    setBagOpen(true);
  }

  function updateQuantity(id: string, delta: number) {
    setBag((current) =>
      current
        .map((line) =>
          line.id === id
            ? { ...line, quantity: line.quantity + delta }
            : line,
        )
        .filter((line) => line.quantity > 0),
    );
  }

  function toggleFavorite(id: string) {
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  }

  return (
    <div className="helora-editorial">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Instrument+Serif:ital@0;1&family=Manrope:wght@400;500;600&display=swap');
        .helora-editorial {
          --ink: #2a241f;
          --ink-soft: #53635c;
          --paper: #f3eee5;
          --paper-deep: #e6dacb;
          --moss: #294a3e;
          --clay: #996447;
          --clay-pale: #c79a79;
          --line: rgba(42,36,31,.18);
          min-width: 320px;
          min-height: 100vh;
          overflow: hidden;
          color: var(--ink);
          background: var(--paper);
          font-family: 'Manrope', sans-serif;
        }
        .helora-editorial * { box-sizing: border-box; }
        .helora-editorial button, .helora-editorial input { font: inherit; }
        .helora-editorial button { cursor: pointer; }
        .helora-rail {
          position: fixed;
          z-index: 12;
          top: 0;
          bottom: 0;
          left: 0;
          width: 214px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 27px 25px 24px;
          border-right: 1px solid var(--line);
          background: rgba(243,238,229,.94);
          backdrop-filter: blur(16px);
        }
        .helora-rail-top { display: grid; gap: 53px; }
        .helora-brand {
          display: inline-flex;
          align-items: baseline;
          gap: 9px;
          width: fit-content;
          color: var(--ink);
          border: 0;
          background: transparent;
          font: 39px/1 'Instrument Serif', Georgia, serif;
          letter-spacing: -.06em;
        }
        .helora-brand small {
          color: var(--clay);
          font: 9px 'DM Mono', monospace;
          letter-spacing: .08em;
        }
        .helora-rail-label, .helora-eyebrow, .helora-index, .helora-material,
        .helora-button, .helora-rail button:not(.helora-brand), .helora-bag-count {
          font-family: 'DM Mono', monospace;
          text-transform: uppercase;
          letter-spacing: .08em;
        }
        .helora-rail-label {
          margin: 0 0 17px;
          color: #708078;
          font-size: 9px;
        }
        .helora-rail-nav { display: grid; gap: 13px; }
        .helora-rail-nav button {
          position: relative;
          width: fit-content;
          padding: 0 0 4px;
          color: #708078;
          border: 0;
          background: transparent;
          font-size: 10px;
          text-align: left;
        }
        .helora-rail-nav button::after {
          position: absolute;
          right: 100%;
          bottom: 0;
          left: 0;
          height: 1px;
          background: var(--clay);
          content: '';
          transition: right .28s ease;
        }
        .helora-rail-nav button:hover, .helora-rail-nav button.is-active { color: var(--ink); }
        .helora-rail-nav button:hover::after, .helora-rail-nav button.is-active::after { right: 0; }
        .helora-rail-bottom { display: grid; gap: 20px; }
        .helora-rail-note { margin: 0; color: #718078; font: 11px/1.55 'Instrument Serif', Georgia, serif; }
        .helora-rail-note em { color: var(--clay); }
        .helora-rail-meta {
          display: flex;
          justify-content: space-between;
          color: #8a968f;
          font-size: 9px;
        }
        .helora-rail-actions { display: flex; align-items: center; gap: 12px; }
        .helora-rail-actions button {
          display: grid;
          position: relative;
          width: 31px;
          height: 31px;
          place-items: center;
          padding: 0;
          color: var(--ink);
          border: 1px solid transparent;
          background: transparent;
          transition: color .2s, transform .2s;
        }
        .helora-rail-actions button:hover { color: var(--clay); transform: translateY(-2px); }
        .helora-bag-count {
          position: absolute;
          top: -4px;
          right: -4px;
          display: grid;
          min-width: 15px;
          height: 15px;
          place-items: center;
          padding: 0 3px;
          color: var(--paper);
          border-radius: 50%;
          background: var(--clay);
          font-size: 8px;
        }
        .helora-main { margin-left: 214px; }
        .helora-topline {
          display: flex;
          min-height: 30px;
          align-items: center;
          justify-content: space-between;
          padding: 0 4.5vw;
          color: #e4d2bf;
          background: var(--ink);
          font: 9px 'DM Mono', monospace;
          letter-spacing: .1em;
          text-transform: uppercase;
        }
        .helora-topline span { color: var(--clay-pale); }
        .helora-mobile-header { display: none; }
        .helora-hero {
          display: grid;
          min-height: 665px;
          grid-template-columns: minmax(260px, .74fr) minmax(380px, 1.26fr);
          grid-template-rows: auto 1fr;
          gap: 0 6vw;
          padding: 6.1vw 6.5vw 6.5vw 7vw;
        }
        .helora-hero-copy { grid-row: 1 / span 2; align-self: center; padding-top: 2vw; }
        .helora-eyebrow {
          margin: 0 0 20px;
          color: #687970;
          font-size: 9px;
        }
        .helora-hero h1 {
          max-width: 490px;
          margin: 0 0 33px;
          font: clamp(77px, 9vw, 143px)/.75 'Instrument Serif', Georgia, serif;
          letter-spacing: -.065em;
          font-weight: 400;
        }
        .helora-hero h1 em, .helora-editorial h2 em { color: var(--clay); font-style: italic; }
        .helora-lede {
          max-width: 286px;
          margin: 0 0 28px;
          color: var(--ink-soft);
          font-size: 13px;
          line-height: 1.7;
        }
        .helora-dark-button, .helora-light-button {
          display: inline-flex;
          min-height: 46px;
          align-items: center;
          justify-content: space-between;
          gap: 27px;
          padding: 0 16px;
          border: 1px solid var(--ink);
          font: 9px 'DM Mono', monospace;
          letter-spacing: .04em;
          text-transform: uppercase;
          transition: color .23s, background .23s, transform .23s;
        }
        .helora-dark-button { color: var(--paper); background: var(--ink); }
        .helora-dark-button:hover { color: var(--ink); border-color: var(--clay); background: var(--clay); transform: translateY(-2px); }
        .helora-light-button { color: var(--paper); border-color: rgba(243,238,229,.55); background: transparent; }
        .helora-light-button:hover { color: var(--ink); background: var(--paper); transform: translateY(-2px); }
        .helora-hero-image-wrap {
          position: relative;
          min-height: 540px;
          overflow: hidden;
          background: var(--paper-deep);
        }
        .helora-hero-image-wrap img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 52% center; transition: transform 1.1s cubic-bezier(.2,.7,.2,1); }
        .helora-hero-image-wrap:hover img { transform: scale(1.035); }
        .helora-image-note {
          position: absolute;
          right: 17px;
          bottom: 15px;
          left: 17px;
          display: flex;
          justify-content: space-between;
          color: #f2e9de;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .06em;
          text-transform: uppercase;
        }
        .helora-hero-side {
          display: flex;
          min-height: 75px;
          align-items: end;
          justify-content: space-between;
          padding: 15px 0 0;
          color: #718078;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .helora-hero-side strong { color: var(--clay); font-weight: 400; }
        .helora-scroll-cue { display: inline-flex; align-items: center; gap: 8px; }
        .helora-scroll-cue svg { color: var(--clay); }
        .helora-manifesto {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 7vw;
          min-height: 385px;
          padding: 6.7vw 8.5vw;
          background: var(--paper-deep);
        }
        .helora-manifesto-kicker { padding-top: 8px; }
        .helora-index { color: var(--clay); font-size: 9px; }
        .helora-manifesto h2 {
          max-width: 700px;
          margin: -9px 0 25px;
          font: clamp(47px, 5.4vw, 80px)/.88 'Instrument Serif', Georgia, serif;
          letter-spacing: -.05em;
          font-weight: 400;
        }
        .helora-manifesto-body { max-width: 395px; margin: 0 0 22px 10%; color: #5e6e66; font-size: 13px; line-height: 1.75; }
        .helora-text-button {
          display: inline-flex;
          align-items: center;
          gap: 11px;
          margin-left: 10%;
          padding: 4px 0 6px;
          color: var(--ink);
          border: 0;
          border-bottom: 1px solid var(--ink);
          background: transparent;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .04em;
          text-transform: uppercase;
          transition: color .2s, gap .2s;
        }
        .helora-text-button:hover { gap: 16px; color: var(--clay); border-color: var(--clay); }
        .helora-pieces {
          display: grid;
          grid-template-columns: 190px 1fr;
          padding: 8.5vw 6.5vw 10vw;
        }
        .helora-pieces-aside { padding-top: 10px; }
        .helora-pieces-aside h2 {
          margin: 13px 0 20px;
          font: clamp(46px, 5.4vw, 84px)/.8 'Instrument Serif', Georgia, serif;
          letter-spacing: -.055em;
          font-weight: 400;
        }
        .helora-pieces-aside p { max-width: 120px; margin: 0; color: #718078; font: italic 15px/1.2 'Instrument Serif', Georgia, serif; }
        .helora-catalog { min-width: 0; }
        .helora-catalog-toolbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 30px;
          padding: 0 0 13px;
          border-bottom: 1px solid var(--line);
        }
        .helora-category-tabs { display: flex; flex-wrap: wrap; gap: 17px; }
        .helora-category-tabs button {
          position: relative;
          padding: 4px 0;
          color: #74847c;
          border: 0;
          background: transparent;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .helora-category-tabs button::after {
          position: absolute;
          right: 100%;
          bottom: -1px;
          left: 0;
          height: 1px;
          background: var(--ink);
          content: '';
          transition: right .25s;
        }
        .helora-category-tabs button:hover::after, .helora-category-tabs button.is-active::after { right: 0; }
        .helora-category-tabs button.is-active { color: var(--ink); }
        .helora-search-button {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 4px 0;
          color: var(--ink);
          border: 0;
          background: transparent;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .04em;
          text-transform: uppercase;
        }
        .helora-product-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 29px 18px; }
        .helora-product { min-width: 0; }
        .helora-product-visual { position: relative; aspect-ratio: .86 / 1; overflow: hidden; background: var(--paper-deep); }
        .helora-product-visual button:first-child { display: block; width: 100%; height: 100%; padding: 0; border: 0; background: transparent; overflow: hidden; }
        .helora-product-visual img { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(.82); transition: transform .6s cubic-bezier(.2,.7,.2,1), filter .3s; }
        .helora-product-visual button:first-child:hover img { filter: saturate(1); transform: scale(1.045); }
        .helora-favorite {
          position: absolute;
          top: 11px;
          right: 11px;
          display: grid;
          width: 30px;
          height: 30px;
          place-items: center;
          color: var(--ink);
          border: 0;
          border-radius: 50%;
          background: rgba(243,238,229,.86);
          transition: color .2s, transform .2s;
        }
        .helora-favorite:hover, .helora-favorite.is-favorite { color: var(--clay); transform: scale(1.08); }
        .helora-quick-label {
          position: absolute;
          top: 50%;
          left: 50%;
          color: var(--paper);
          border-bottom: 1px solid var(--paper);
          opacity: 0;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .06em;
          text-transform: uppercase;
          transform: translate(-50%, 10px);
          transition: opacity .25s, transform .25s;
          pointer-events: none;
        }
        .helora-product-visual:hover .helora-quick-label { opacity: 1; transform: translate(-50%, 0); }
        .helora-product-info { display: flex; align-items: start; justify-content: space-between; gap: 8px; padding: 14px 1px 0; }
        .helora-product-info h3 { margin: 0 0 5px; font: 20px/1 'Instrument Serif', Georgia, serif; letter-spacing: -.02em; font-weight: 400; }
        .helora-material { margin: 0; overflow: hidden; color: #72817b; font-size: 8px; text-overflow: ellipsis; white-space: nowrap; }
        .helora-price { padding-top: 2px; color: #55675f; font: 10px 'DM Mono', monospace; white-space: nowrap; }
        .helora-add {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          margin-top: 11px;
          padding: 6px 0;
          color: var(--ink);
          border: 0;
          border-bottom: 1px solid var(--line);
          background: transparent;
          font: 9px 'DM Mono', monospace;
          letter-spacing: .04em;
          text-transform: uppercase;
          transition: color .2s, gap .2s;
        }
        .helora-add:hover { gap: 15px; color: var(--clay); }
        .helora-empty { grid-column: 1 / -1; min-height: 260px; display: grid; place-items: center; border: 1px dashed var(--line); text-align: center; }
        .helora-empty h3 { margin: 0 0 6px; font: 35px 'Instrument Serif', Georgia, serif; font-weight: 400; }
        .helora-empty p { margin: 0 0 16px; color: #718078; font-size: 12px; }
        .helora-banner {
          display: grid;
          grid-template-columns: 1fr 1fr;
          min-height: 520px;
          padding: 7.8vw 8.5vw;
          color: var(--paper);
          background: var(--moss);
        }
        .helora-banner-copy { align-self: center; }
        .helora-banner h2 { margin: 0 0 27px; font: clamp(65px, 8vw, 128px)/.74 'Instrument Serif', Georgia, serif; letter-spacing: -.06em; font-weight: 400; }
        .helora-banner p:not(.helora-eyebrow) { max-width: 280px; margin: 0 0 27px; color: #c8d0c9; font-size: 13px; line-height: 1.7; }
        .helora-banner .helora-eyebrow { color: #c9baaa; }
        .helora-rings { position: relative; min-height: 360px; }
        .helora-ring {
          position: absolute;
          top: 50%;
          left: 51%;
          border: 1px solid rgba(232,224,212,.35);
          border-radius: 50%;
          transform: translate(-50%, -50%);
        }
        .helora-ring:nth-child(1) { width: min(31vw, 430px); aspect-ratio: 1; }
        .helora-ring:nth-child(2) { width: min(23vw, 315px); aspect-ratio: 1; border-color: rgba(232,224,212,.21); }
        .helora-ring:nth-child(3) { width: min(14vw, 190px); aspect-ratio: 1; border-color: rgba(199,154,121,.75); }
        .helora-ring-caption { position: absolute; right: 0; bottom: 1%; color: #d4bbae; font: italic 17px 'Instrument Serif', Georgia, serif; }
        .helora-journal {
          display: grid;
          grid-template-columns: 1fr 1.7fr;
          gap: 6vw;
          padding: 9.5vw 8.5vw 10vw;
        }
        .helora-journal-intro h2 { margin: 0 0 28px; font: clamp(58px, 7.5vw, 112px)/.74 'Instrument Serif', Georgia, serif; letter-spacing: -.06em; font-weight: 400; }
        .helora-journal-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: end; }
        .helora-journal-card { border-top: 1px solid var(--line); padding-top: 13px; }
        .helora-journal-card:first-child { margin-bottom: 6vw; }
        .helora-journal-art { position: relative; height: 250px; margin-bottom: 17px; overflow: hidden; }
        .helora-journal-art img { display: block; width: 100%; height: 100%; object-fit: cover; filter: saturate(.75); }
        .helora-journal-art span { position: absolute; top: 11px; left: 12px; color: var(--paper); font: 9px 'DM Mono', monospace; text-transform: uppercase; }
        .helora-journal-card h3 { margin: 0 0 18px; font: 30px/.9 'Instrument Serif', Georgia, serif; letter-spacing: -.03em; font-weight: 400; }
        .helora-journal-card button { display: inline-flex; align-items: center; gap: 10px; padding: 0 0 5px; color: var(--ink); border: 0; border-bottom: 1px solid var(--ink); background: transparent; font: 9px 'DM Mono', monospace; text-transform: uppercase; }
        .helora-newsletter { display: grid; grid-template-columns: .8fr 1fr .65fr; gap: 4vw; min-height: 215px; align-items: center; padding: 4.3vw 8.5vw; background: var(--clay); }
        .helora-newsletter h2 { margin: 0; font: clamp(45px, 5.4vw, 80px)/.8 'Instrument Serif', Georgia, serif; letter-spacing: -.05em; font-weight: 400; }
        .helora-newsletter .helora-eyebrow { color: #554137; margin-bottom: 13px; }
        .helora-newsletter-form { display: flex; align-items: center; border-bottom: 1px solid var(--ink); }
        .helora-newsletter-form input { width: 100%; padding: 13px 0; color: var(--ink); outline: 0; border: 0; background: transparent; font: 16px 'Instrument Serif', Georgia, serif; }
        .helora-newsletter-form input::placeholder { color: rgba(42,36,31,.55); }
        .helora-newsletter-form button { padding: 10px 0 10px 17px; color: var(--ink); border: 0; background: transparent; transition: transform .2s; }
        .helora-newsletter-form button:hover { transform: translateX(5px); }
        .helora-fineprint { max-width: 150px; margin: 0; color: #544137; font: 9px/1.55 'DM Mono', monospace; }
        .helora-footer { display: grid; grid-template-columns: 1.5fr 1fr .75fr; min-height: 245px; padding: 4.8vw 6.5vw 65px; color: var(--paper); background: var(--ink); }
        .helora-footer-mark { font: 48px/1 'Instrument Serif', Georgia, serif; letter-spacing: -.06em; }
        .helora-footer-tag { margin: 10px 0; color: #b4c1b8; font: italic 16px 'Instrument Serif', Georgia, serif; }
        .helora-footer-links { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .helora-footer-links p { margin: 0 0 16px; color: #9aaca0; font: 9px 'DM Mono', monospace; letter-spacing: .1em; text-transform: uppercase; }
        .helora-footer-links button { display: block; margin: 0 0 10px; padding: 0; color: #d7ddd3; border: 0; background: transparent; font: 10px 'DM Mono', monospace; text-align: left; }
        .helora-footer-links button:hover { color: var(--clay-pale); }
        .helora-footer-end { align-self: end; color: #8da097; font: 8px 'DM Mono', monospace; letter-spacing: .06em; text-transform: uppercase; }
        .helora-footer-end span { display: block; margin-top: 8px; }
        .helora-overlay { position: fixed; z-index: 60; inset: 0; display: grid; place-items: start center; padding-top: 10vh; background: rgba(30,51,46,.52); }
        .helora-search-panel { width: min(760px, 92vw); padding: 22px 30px 30px; background: var(--paper); box-shadow: 0 22px 65px rgba(30,51,46,.22); }
        .helora-modal-top { display: flex; align-items: start; justify-content: space-between; }
        .helora-close { display: grid; width: 33px; height: 33px; place-items: center; color: var(--ink); border: 0; background: transparent; }
        .helora-search-row { display: flex; align-items: center; gap: 13px; padding: 19px 0 11px; border-bottom: 1px solid var(--ink); }
        .helora-search-row input { flex: 1; min-width: 0; padding: 0; color: var(--ink); outline: 0; border: 0; background: transparent; font: 27px 'Instrument Serif', Georgia, serif; }
        .helora-search-row input::placeholder { color: #9aa59e; }
        .helora-search-row button { color: var(--clay); border: 0; background: transparent; font: 9px 'DM Mono', monospace; text-transform: uppercase; }
        .helora-search-suggestions { display: flex; flex-wrap: wrap; align-items: center; gap: 15px; padding-top: 18px; color: #849188; font: 9px 'DM Mono', monospace; text-transform: uppercase; }
        .helora-search-suggestions button { padding: 0; color: var(--ink); border: 0; background: transparent; font: inherit; text-decoration: underline; text-underline-offset: 4px; }
        .helora-product-modal { position: relative; display: grid; width: min(900px, 92vw); grid-template-columns: 52% 48%; background: var(--paper); box-shadow: 0 22px 65px rgba(30,51,46,.22); }
        .helora-product-modal-image { min-height: 510px; background: var(--paper-deep); }
        .helora-product-modal-image img { display: block; width: 100%; height: 100%; object-fit: cover; }
        .helora-product-modal-copy { padding: 11vw 4.5vw 4vw; }
        .helora-product-modal-copy h2 { margin: 0 0 25px; font: clamp(45px, 5vw, 72px)/.8 'Instrument Serif', Georgia, serif; letter-spacing: -.055em; font-weight: 400; }
        .helora-detail { max-width: 280px; margin: 0 0 25px; color: #5e7067; font-size: 13px; line-height: 1.7; }
        .helora-buy-row { display: flex; align-items: center; justify-content: space-between; margin-top: 45px; padding-top: 14px; border-top: 1px solid var(--line); font: 11px 'DM Mono', monospace; }
        .helora-story-modal { position: relative; width: min(820px, 92vw); max-height: 82vh; overflow-y: auto; padding: clamp(35px, 5vw, 67px) clamp(28px, 7vw, 100px); background: var(--paper); box-shadow: 0 22px 65px rgba(30,51,46,.22); }
        .helora-story-kicker { display: flex; align-items: center; justify-content: space-between; padding-bottom: 15px; border-bottom: 1px solid var(--line); }
        .helora-story-copy { max-width: 570px; margin: 47px auto 0; }
        .helora-story-copy h2 { margin: 0 0 38px; font: clamp(60px, 8vw, 106px)/.8 'Instrument Serif', Georgia, serif; letter-spacing: -.055em; font-weight: 400; }
        .helora-story-copy h2 em { color: var(--clay); }
        .helora-story-copy p { margin: 0 0 19px; color: #5c6c65; font-size: 14px; line-height: 1.8; }
        .helora-story-copy .helora-question { max-width: 500px; margin: 7px 0 29px; color: var(--ink); font: italic 26px/1.15 'Instrument Serif', Georgia, serif; }
        .helora-story-copy .helora-closing { margin-top: 36px; color: var(--ink); font: 25px/1.15 'Instrument Serif', Georgia, serif; }
        .helora-closing strong { color: var(--clay); font-weight: 400; }
        .helora-bag-layer { position: fixed; z-index: 70; inset: 0; display: flex; justify-content: flex-end; }
        .helora-bag-scrim { position: absolute; inset: 0; border: 0; background: rgba(30,51,46,.47); }
        .helora-bag-drawer { position: relative; display: flex; width: min(475px, 94vw); height: 100%; flex-direction: column; padding: 33px 31px; background: var(--paper); animation: helora-drawer-in .38s cubic-bezier(.2,.7,.2,1); }
        .helora-bag-header { display: flex; align-items: start; justify-content: space-between; padding-bottom: 21px; border-bottom: 1px solid var(--line); }
        .helora-bag-header h2 { margin: 7px 0 0; font: 42px/.9 'Instrument Serif', Georgia, serif; letter-spacing: -.04em; font-weight: 400; }
        .helora-bag-header h2 span { color: var(--clay); font: 16px 'DM Mono', monospace; }
        .helora-bag-lines { flex: 1; overflow-y: auto; padding: 22px 0; }
        .helora-bag-line { display: grid; grid-template-columns: 70px 1fr auto; gap: 15px; margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--line); }
        .helora-bag-line img { width: 70px; height: 83px; object-fit: cover; }
        .helora-bag-line h3 { margin: 0 0 5px; font: 20px 'Instrument Serif', Georgia, serif; font-weight: 400; }
        .helora-bag-line p { margin: 0 0 14px; color: #6d7d74; font: 9px 'DM Mono', monospace; }
        .helora-quantity { display: inline-flex; height: 28px; align-items: center; border: 1px solid var(--line); }
        .helora-quantity button { display: grid; width: 27px; height: 100%; place-items: center; color: var(--ink); border: 0; background: transparent; }
        .helora-quantity span { width: 24px; text-align: center; font: 9px 'DM Mono', monospace; }
        .helora-line-total { color: #55675f; font: 10px 'DM Mono', monospace; }
        .helora-empty-bag { flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; }
        .helora-empty-bag-mark { display: grid; width: 63px; height: 63px; place-items: center; margin-bottom: 19px; color: var(--clay); border: 1px solid var(--line); border-radius: 50%; }
        .helora-empty-bag h3 { margin: 0 0 8px; font: 34px 'Instrument Serif', Georgia, serif; font-weight: 400; }
        .helora-empty-bag p { margin: 0 0 21px; color: #74847b; font-size: 12px; }
        .helora-bag-summary { padding-top: 18px; border-top: 1px solid var(--line); }
        .helora-bag-summary > div { display: flex; justify-content: space-between; font: 11px 'DM Mono', monospace; }
        .helora-bag-summary p { margin: 12px 0 17px; color: #77867f; font: 9px/1.5 'DM Mono', monospace; }
        .helora-checkout { width: 100%; }
        @keyframes helora-drawer-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @media (max-width: 900px) {
          .helora-rail { display: none; }
          .helora-main { margin-left: 0; }
          .helora-mobile-header { display: flex; height: 65px; align-items: center; justify-content: space-between; padding: 0 20px; border-bottom: 1px solid var(--line); background: rgba(243,238,229,.94); }
          .helora-mobile-header .helora-brand { font-size: 34px; }
          .helora-mobile-actions { display: flex; gap: 2px; }
          .helora-mobile-menu { display: grid; width: 31px; height: 31px; place-items: center; color: var(--ink); border: 0; background: transparent; }
          .helora-mobile-nav { display: ${menuOpen ? "grid" : "none"}; position: absolute; z-index: 20; top: 95px; left: 0; right: 0; gap: 16px; padding: 20px; border-bottom: 1px solid var(--line); background: var(--paper); }
          .helora-mobile-nav button { width: fit-content; padding: 0; color: var(--ink); border: 0; background: transparent; font: 10px 'DM Mono', monospace; text-transform: uppercase; }
          .helora-topline { padding: 0 20px; }
          .helora-hero { display: flex; min-height: unset; flex-direction: column; gap: 36px; padding: 46px 20px 65px; }
          .helora-hero-copy { padding: 0 8px; }
          .helora-hero h1 { font-size: clamp(78px, 20vw, 145px); }
          .helora-hero-image-wrap { min-height: 105vw; max-height: 570px; }
          .helora-hero-side { min-height: 50px; }
          .helora-manifesto { display: block; padding: 55px 28px 62px; }
          .helora-manifesto-kicker { margin-bottom: 38px; }
          .helora-manifesto-body, .helora-text-button { margin-left: 0; }
          .helora-pieces { display: block; padding: 70px 20px; }
          .helora-pieces-aside { padding: 0 4px; margin-bottom: 36px; }
          .helora-pieces-aside h2 { margin: 12px 0 16px; font-size: 68px; }
          .helora-pieces-aside p { max-width: 180px; }
          .helora-catalog-toolbar { align-items: start; gap: 13px; }
          .helora-category-tabs { gap: 12px 16px; }
          .helora-search-button { white-space: nowrap; }
          .helora-product-grid { gap: 43px 13px; }
          .helora-product-info { display: block; }
          .helora-price { display: block; margin-top: 8px; }
          .helora-banner { display: block; min-height: 620px; padding: 72px 28px; }
          .helora-banner h2 { font-size: 95px; }
          .helora-rings { min-height: 230px; margin-top: 20px; }
          .helora-ring:nth-child(1) { width: 290px; }
          .helora-ring:nth-child(2) { width: 212px; }
          .helora-ring:nth-child(3) { width: 132px; }
          .helora-journal { display: block; padding: 72px 20px; }
          .helora-journal-intro { margin-bottom: 45px; padding: 0 4px; }
          .helora-journal-intro h2 { font-size: 82px; }
          .helora-journal-art { height: 195px; }
          .helora-journal-card h3 { font-size: 25px; }
          .helora-newsletter { display: block; padding: 55px 28px; }
          .helora-newsletter h2 { margin-bottom: 35px; }
          .helora-fineprint { margin-top: 15px; }
          .helora-footer { display: block; padding: 55px 28px 78px; }
          .helora-footer-links { margin-top: 49px; }
          .helora-footer-end { margin-top: 40px; }
          .helora-product-modal { display: block; max-height: 89vh; overflow-y: auto; }
          .helora-product-modal-image { height: 65vw; min-height: 260px; }
          .helora-product-modal-copy { padding: 35px 25px 30px; }
          .helora-buy-row { margin-top: 28px; }
        }
        @media (max-width: 520px) {
          .helora-topline span:first-child { display: none; }
          .helora-hero h1 { font-size: 23vw; }
          .helora-product-grid { grid-template-columns: 1fr 1fr; }
          .helora-product-info h3 { font-size: 18px; }
          .helora-product-info .helora-material { font-size: 7px; }
          .helora-journal-grid { gap: 18px; }
          .helora-journal-card h3 { font-size: 24px; }
          .helora-search-panel { width: 100%; padding: 20px; }
          .helora-search-row input { font-size: 22px; }
          .helora-story-modal { width: 100%; max-height: 89vh; padding: 30px 25px 42px; }
          .helora-story-copy { margin-top: 35px; }
          .helora-story-copy h2 { font-size: 66px; margin-bottom: 31px; }
          .helora-story-copy p { font-size: 13px; line-height: 1.7; }
        }
      `}</style>

      <aside className="helora-rail">
        <div className="helora-rail-top">
          <button
            className="helora-brand"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            HELORA <small>LDN</small>
          </button>
          <div>
            <p className="helora-rail-label">The collection</p>
            <nav className="helora-rail-nav" aria-label="Collection navigation">
              {categories.map((category) => (
                <button
                  key={category}
                  className={activeCategory === category ? "is-active" : ""}
                  type="button"
                  onClick={() => chooseCategory(category)}
                >
                  {category}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <div className="helora-rail-bottom">
          <p className="helora-rail-note">
            Considered objects<br />
            <em>for keeping.</em>
          </p>
          <div className="helora-rail-actions">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search the collection"
            >
              <Search size={16} strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={() => chooseCategory("All pieces")}
              aria-label="Open wishlist"
            >
              <Heart
                size={16}
                strokeWidth={1.5}
                fill={favorites.length ? "currentColor" : "none"}
              />
            </button>
            <button
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={16} strokeWidth={1.5} />
              {bagCount > 0 && (
                <span className="helora-bag-count">{bagCount}</span>
              )}
            </button>
          </div>
          <div className="helora-rail-meta">
            <span>51°30' N</span>
            <span>00°07' W</span>
          </div>
        </div>
      </aside>

      <main className="helora-main">
        <div className="helora-topline">
          <span>Complimentary shipping on orders over $150</span>
          <span>Made slowly in London</span>
        </div>
        <header className="helora-mobile-header">
          <button
            className="helora-mobile-menu"
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <button
            className="helora-brand"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            aria-label="Back to top"
          >
            HELORA
          </button>
          <div className="helora-mobile-actions">
            <button
              className="helora-mobile-menu"
              type="button"
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
            >
              <Search size={18} strokeWidth={1.5} />
            </button>
            <button
              className="helora-mobile-menu"
              type="button"
              onClick={() => setBagOpen(true)}
              aria-label="Open shopping bag"
            >
              <ShoppingBag size={18} strokeWidth={1.5} />
            </button>
          </div>
          <nav className="helora-mobile-nav" aria-label="Mobile navigation">
            {categories.map((category) => (
              <button key={category} type="button" onClick={() => chooseCategory(category)}>
                {category}
              </button>
            ))}
          </nav>
        </header>

        <section className="helora-hero">
          <div className="helora-hero-copy">
            <p className="helora-eyebrow">A small jewellery house / 01</p>
            <h1>
              Keep what
              <br />
              <em>matters.</em>
            </h1>
            <p className="helora-lede">
              Jewellery for the life you are already living. Made by hand,
              meant to gather stories.
            </p>
            <button
              className="helora-dark-button"
              type="button"
              onClick={() => chooseCategory("All pieces")}
            >
              Shop the new collection <ArrowRight size={15} />
            </button>
          </div>
          <div className="helora-hero-image-wrap">
            <img src={heroImage} alt="HELORA jewellery arranged in warm afternoon light" />
            <div className="helora-image-note">
              <span>01 / 06</span>
              <span>Objects with a pulse</span>
            </div>
          </div>
          <div className="helora-hero-side">
            <span>Est. 2018 / London</span>
            <span className="helora-scroll-cue">
              Scroll to keep <ArrowDownRight size={14} />
            </span>
          </div>
        </section>

        <section className="helora-manifesto">
          <div className="helora-manifesto-kicker">
            <p className="helora-eyebrow">Our point of view</p>
            <span className="helora-index">02</span>
          </div>
          <div>
            <h2>
              The best pieces become part of your <em>vocabulary.</em>
            </h2>
            <p className="helora-manifesto-body">
              HELORA is an independent jewellery house creating modern
              heirlooms from recycled gold, responsible stones and a deep
              respect for the hand. Nothing loud. Nothing disposable. Just
              good things, made to stay.
            </p>
            <button
              className="helora-text-button"
              type="button"
              onClick={() => setStoryOpen(true)}
            >
              Read our story <ArrowRight size={14} />
            </button>
          </div>
        </section>

        <section className="helora-pieces" id="editorial-pieces">
          <div className="helora-pieces-aside">
            <p className="helora-eyebrow">The edit / 2024</p>
            <h2>
              New
              <br />
              forms
            </h2>
            <p>Small gestures, lasting impressions.</p>
          </div>
          <div className="helora-catalog">
            <div className="helora-catalog-toolbar">
              <div className="helora-category-tabs" role="tablist">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={activeCategory === category ? "is-active" : ""}
                    type="button"
                    role="tab"
                    aria-selected={activeCategory === category}
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <button
                className="helora-search-button"
                type="button"
                onClick={() => setSearchOpen(true)}
              >
                <Search size={13} /> Search
              </button>
            </div>
            <div className="helora-product-grid">
              {visibleProducts.length > 0 ? (
                visibleProducts.map((product) => (
                  <article className="helora-product" key={product.id}>
                    <div className="helora-product-visual">
                      <button
                        type="button"
                        onClick={() => setQuickProduct(product)}
                        aria-label={`View ${product.name}`}
                      >
                        <img src={product.image} alt={product.name} />
                        <span className="helora-quick-label">Quick view</span>
                      </button>
                      <button
                        className={`helora-favorite ${favorites.includes(product.id) ? "is-favorite" : ""}`}
                        type="button"
                        onClick={() => toggleFavorite(product.id)}
                        aria-label={
                          favorites.includes(product.id)
                            ? `Remove ${product.name} from wishlist`
                            : `Add ${product.name} to wishlist`
                        }
                      >
                        <Heart
                          size={16}
                          strokeWidth={1.4}
                          fill={favorites.includes(product.id) ? "currentColor" : "none"}
                        />
                      </button>
                    </div>
                    <div className="helora-product-info">
                      <div>
                        <h3>{product.name}</h3>
                        <p className="helora-material">{product.material}</p>
                      </div>
                      <span className="helora-price">{money(product.price)}</span>
                    </div>
                    <button
                      className="helora-add"
                      type="button"
                      onClick={() => addToBag(product)}
                    >
                      Add to bag <ArrowRight size={13} />
                    </button>
                  </article>
                ))
              ) : (
                <div className="helora-empty">
                  <div>
                    <h3>Try a softer search.</h3>
                    <p>Nothing matched “{query}”.</p>
                    <button
                      className="helora-text-button"
                      type="button"
                      onClick={() => {
                        setQuery("");
                        setActiveCategory("All pieces");
                      }}
                      style={{ marginLeft: 0 }}
                    >
                      Clear search <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="helora-banner">
          <div className="helora-banner-copy">
            <p className="helora-eyebrow">Collection no. 03</p>
            <h2>
              Lines that
              <br />
              <em>linger.</em>
            </h2>
            <p>
              For the in-between moments. A study in soft edges, warm metal
              and the things we return to.
            </p>
            <button
              className="helora-light-button"
              type="button"
              onClick={() => chooseCategory("All pieces")}
            >
              Explore the collection <ArrowRight size={15} />
            </button>
          </div>
          <div className="helora-rings" aria-hidden="true">
            <span className="helora-ring" />
            <span className="helora-ring" />
            <span className="helora-ring" />
            <span className="helora-ring-caption">Form / function / feeling</span>
          </div>
        </section>

        <section className="helora-journal">
          <div className="helora-journal-intro">
            <p className="helora-eyebrow">From the journal</p>
            <h2>
              Notes on
              <br />
              <em>keeping.</em>
            </h2>
            <button
              className="helora-text-button"
              type="button"
              onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
              style={{ marginLeft: 0 }}
            >
              View all notes <ArrowRight size={14} />
            </button>
          </div>
          <div className="helora-journal-grid">
            <article className="helora-journal-card">
              <div className="helora-journal-art">
                <img src={detailImage} alt="Jewellery resting on sage linen" />
                <span>Care / 01</span>
              </div>
              <p className="helora-eyebrow">On care</p>
              <h3>
                A little polish,
                <br />
                a longer life.
              </h3>
              <button type="button" onClick={() => setSearchOpen(true)}>
                Read the note <ArrowRight size={13} />
              </button>
            </article>
            <article className="helora-journal-card">
              <div className="helora-journal-art">
                <img src={heroImage} alt="A close look at handmade gold jewellery" />
                <span>Making / 02</span>
              </div>
              <p className="helora-eyebrow">In the studio</p>
              <h3>
                Why the hand
                <br />
                still matters.
              </h3>
              <button type="button" onClick={() => setQuickProduct(products[2])}>
                Read the note <ArrowRight size={13} />
              </button>
            </article>
          </div>
        </section>

        <section className="helora-newsletter">
          <div>
            <p className="helora-eyebrow">HELORA, in your inbox</p>
            <h2>{subscribed ? "You’re on the list." : "Keep in touch."}</h2>
          </div>
          <form
            className="helora-newsletter-form"
            onSubmit={(event) => {
              event.preventDefault();
              setSubscribed(true);
            }}
          >
            <input
              name="email"
              type="email"
              required
              placeholder="Your email address"
              aria-label="Email address"
            />
            <button type="submit" aria-label="Subscribe to newsletter">
              <ArrowRight size={18} />
            </button>
          </form>
          <p className="helora-fineprint">
            Studio notes, new pieces and the occasional good idea. No noise.
          </p>
        </section>

        <footer className="helora-footer">
          <div>
            <span className="helora-footer-mark">HELORA</span>
            <p className="helora-footer-tag">Jewellery for keeping.</p>
          </div>
          <div className="helora-footer-links">
            <div>
              <p>Explore</p>
              <button type="button" onClick={() => chooseCategory("All pieces")}>Shop all pieces</button>
              <button type="button" onClick={() => chooseCategory("Rings")}>Rings</button>
              <button type="button" onClick={() => chooseCategory("Necklaces")}>Necklaces</button>
            </div>
            <div>
              <p>Visit</p>
              <button type="button" onClick={() => setSearchOpen(true)}>Contact us</button>
              <button type="button" onClick={() => setSearchOpen(true)}>Shipping & returns</button>
              <button type="button" onClick={() => setSearchOpen(true)}>Jewellery care</button>
            </div>
          </div>
          <div className="helora-footer-end">
            <span>© 2024 HELORA London</span>
            <span>Made slowly, worn often.</span>
          </div>
        </footer>
      </main>

      {searchOpen && (
        <div className="helora-overlay" role="dialog" aria-modal="true" aria-label="Search">
          <div className="helora-search-panel">
            <div className="helora-modal-top">
              <p className="helora-eyebrow">Find a piece</p>
              <button className="helora-close" type="button" onClick={() => setSearchOpen(false)} aria-label="Close search">
                <X size={19} />
              </button>
            </div>
            <div className="helora-search-row">
              <Search size={21} strokeWidth={1.3} />
              <input
                autoFocus
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search necklaces, rings, hoops..."
              />
              <button type="button" onClick={() => setSearchOpen(false)}>Done</button>
            </div>
            <div className="helora-search-suggestions">
              <span>Popular searches</span>
              {["gold", "pearl", "everyday"].map((suggestion) => (
                <button key={suggestion} type="button" onClick={() => setQuery(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {storyOpen && (
        <div className="helora-overlay" role="dialog" aria-modal="true" aria-labelledby="helora-story-title">
          <article className="helora-story-modal">
            <div className="helora-story-kicker">
              <p className="helora-eyebrow">Our story / 01</p>
              <button className="helora-close" type="button" onClick={() => setStoryOpen(false)} aria-label="Close our story">
                <X size={19} />
              </button>
            </div>
            <div className="helora-story-copy">
              <h2 id="helora-story-title">
                Wear Your <em>Aura.</em>
              </h2>
              <p>
                When I first entered the corporate world, my love for dressing
                up and jewellery earned me the nickname “butterfly.” I was
                once told to tone it down — to look more professional and less
                expressive.
              </p>
              <p>It made me wonder:</p>
              <p className="helora-question">
                Why should we become less of ourselves just to fit someone
                else&apos;s idea of who we should be?
              </p>
              <p>That thought became HELORA.</p>
              <p>
                We create jewellery not to change who you are, but to reflect
                who you already are — pieces you choose because they feel like
                you, not because they seek anyone else&apos;s approval.
              </p>
              <p>
                And I learned something along the way: when you feel free to be
                yourself, you quietly give others permission to do the same.
              </p>
              <p className="helora-closing">
                You were never meant to blend in.
                <br />
                <strong>Wear Your Aura.</strong>
              </p>
            </div>
          </article>
        </div>
      )}

      {quickProduct && (
        <div className="helora-overlay" role="dialog" aria-modal="true" aria-label={`${quickProduct.name} quick view`}>
          <article className="helora-product-modal">
            <button className="helora-close" style={{ position: "absolute", top: 12, right: 12, zIndex: 2, background: "var(--paper)" }} type="button" onClick={() => setQuickProduct(null)} aria-label="Close quick view">
              <X size={19} />
            </button>
            <div className="helora-product-modal-image">
              <img src={quickProduct.image} alt={quickProduct.name} />
            </div>
            <div className="helora-product-modal-copy">
              <p className="helora-eyebrow">{quickProduct.category} / HELORA</p>
              <h2>{quickProduct.name}</h2>
              <p className="helora-detail">{quickProduct.detail}</p>
              <p className="helora-material">{quickProduct.material}</p>
              <div className="helora-buy-row">
                <span>{money(quickProduct.price)}</span>
                <button
                  className="helora-dark-button"
                  type="button"
                  onClick={() => {
                    addToBag(quickProduct);
                    setQuickProduct(null);
                  }}
                >
                  Add to bag <ArrowRight size={15} />
                </button>
              </div>
            </div>
          </article>
        </div>
      )}

      {bagOpen && (
        <div className="helora-bag-layer" role="dialog" aria-modal="true" aria-label="Shopping bag">
          <button className="helora-bag-scrim" type="button" onClick={() => setBagOpen(false)} aria-label="Close shopping bag" />
          <aside className="helora-bag-drawer">
            <div className="helora-bag-header">
              <div>
                <p className="helora-eyebrow">Your selection</p>
                <h2>Shopping bag <span>({bagCount})</span></h2>
              </div>
              <button className="helora-close" type="button" onClick={() => setBagOpen(false)} aria-label="Close shopping bag">
                <X size={19} />
              </button>
            </div>
            {bag.length === 0 ? (
              <div className="helora-empty-bag">
                <div className="helora-empty-bag-mark"><ShoppingBag size={23} strokeWidth={1} /></div>
                <h3>Your bag is waiting.</h3>
                <p>Pieces you love will live here.</p>
                <button className="helora-text-button" type="button" onClick={() => { setBagOpen(false); chooseCategory("All pieces"); }}>
                  Browse the collection <ArrowRight size={14} />
                </button>
              </div>
            ) : (
              <>
                <div className="helora-bag-lines">
                  {bag.map((line) => (
                    <div className="helora-bag-line" key={line.id}>
                      <img src={line.image} alt="" />
                      <div>
                        <h3>{line.name}</h3>
                        <p>{money(line.price)}</p>
                        <div className="helora-quantity">
                          <button type="button" onClick={() => updateQuantity(line.id, -1)} aria-label={`Decrease ${line.name} quantity`}><Minus size={12} /></button>
                          <span>{line.quantity}</span>
                          <button type="button" onClick={() => updateQuantity(line.id, 1)} aria-label={`Increase ${line.name} quantity`}><Plus size={12} /></button>
                        </div>
                      </div>
                      <span className="helora-line-total">{money(line.price * line.quantity)}</span>
                    </div>
                  ))}
                </div>
                <div className="helora-bag-summary">
                  <div><span>Subtotal</span><strong>{money(bagTotal)}</strong></div>
                  <p>Shipping calculated at checkout. Complimentary over $150.</p>
                  <button className="helora-dark-button helora-checkout" type="button" onClick={() => setBagOpen(false)}>
                    Continue to checkout <ArrowRight size={15} />
                  </button>
                </div>
              </>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}

export default HeloraEditorial;