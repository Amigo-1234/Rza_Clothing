import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowDown, ArrowRight, ArrowUpRight, Crown, Menu, Minus, Moon, Plus, ShoppingBag, Sun, Trash2, X } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ClothingRailHero, { type RailGarment } from "@/components/ui/product-rail-gallery";

gsap.registerPlugin(ScrollTrigger);

type Category = "All pieces" | "Tops" | "Sets" | "Headwear";
type Product = { id: string; name: string; category: Exclude<Category, "All pieces">; image: string; note: string; label?: string };

const products: Product[] = [
  { id: "tee-black", name: "Original Graphic Tee", category: "Tops", image: "/images/rza/IMG_3336.jpeg", note: "RZA Original · Black / White", label: "Signature" },
  { id: "polo-black", name: "RZA Signature Polo", category: "Tops", image: "/images/rza/IMG_3325.jpeg", note: "Contrast collar · Black / White", label: "New piece" },
  { id: "tank-cocoa", name: "RZA Monogram Tank", category: "Tops", image: "/images/rza/IMG_3328.jpeg", note: "Cocoa · Embroidered monogram" },
  { id: "tee-crimson", name: "Luxe Graphic Tee", category: "Tops", image: "/images/rza/IMG_3334.jpeg", note: "Crimson · Statement graphic" },
  { id: "tracksuit-ash", name: "Everyday Tracksuit", category: "Sets", image: "/images/rza/IMG_3327.jpeg", note: "Ash grey · Relaxed fit", label: "Set" },
  { id: "tracksuit-green", name: "RZA Luxe Track Set", category: "Sets", image: "/images/rza/IMG_3335.jpeg", note: "Forest green & orange · Two piece", label: "Statement" },
  { id: "tracksuit-cream", name: "Classic Lounge Set", category: "Sets", image: "/images/rza/IMG_3330.jpeg", note: "Cream · Contrast collar" },
  { id: "cap-cocoa", name: "RZA Signature Cap", category: "Headwear", image: "/images/rza/IMG_3324.jpeg", note: "Cocoa · Embroidered RZA", label: "Everyday" },
  { id: "cap-lineup", name: "Everyday Caps", category: "Headwear", image: "/images/rza/IMG_3331.jpeg", note: "A few good colours · RZA mark" },
];
const railItems: RailGarment[] = [
  { id: "tee-black", name: "Original Graphic Tee", kind: "tee", color: "#111111", trim: "#c4a45e", tag: "RZA", image: "/images/rza/IMG_3336.jpeg", description: "RZA Original graphic tee in black and white.", details: ["Original graphic", "Black / White"] },
  { id: "polo-black", name: "RZA Signature Polo", kind: "shirt", color: "#151515", trim: "#ece9df", tag: "RZA", image: "/images/rza/IMG_3325.jpeg", description: "Black polo with a crisp contrast collar and RZA Luxe crest.", details: ["Contrast collar", "Signature crest"] },
  { id: "tee-crimson", name: "Luxe Graphic Tee", kind: "tee", color: "#c71724", trim: "#1d2d57", tag: "RZA", image: "/images/rza/IMG_3334.jpeg", description: "Crimson RZA Luxe graphic tee with a bold illustrated front.", details: ["Crimson", "Statement graphic"] },
];
const categories: Category[] = ["All pieces", "Tops", "Sets", "Headwear"];
const contactEmail = "amiratkawojue1122@gmail.com";

function SocialMark({ name }: { name: "facebook" | "instagram" | "tiktok" }) {
  if (name === "facebook") return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.4 21v-8.2h2.8l.4-3.2h-3.2V7.5c0-.9.3-1.5 1.6-1.5h1.7V3.1c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.3H7.2v3.2H10V21h3.4Z" fill="currentColor" /></svg>;
  if (name === "instagram") return <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" strokeWidth="1.7" /><circle cx="17.7" cy="6.7" r="1.1" fill="currentColor" /></svg>;
  return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18.6 7.4a5.7 5.7 0 0 1-3.5-1.2v8.2a5.2 5.2 0 1 1-4.5-5.1v3.1a2.2 2.2 0 1 0 1.4 2V2.8h3.1c.2 2.1 1.4 3.6 3.5 4v.6Z" fill="currentColor" /></svg>;
}

function App() {
  const siteRef = useRef<HTMLElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const menuWasOpened = useRef(false);
  const [category, setCategory] = useState<Category>("All pieces");
  const [selected, setSelected] = useState<Product | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [cart, setCart] = useState<Record<string, number>>({});
  const visibleProducts = useMemo(() => category === "All pieces" ? products : products.filter((product) => product.category === category), [category]);
  const cartItems = products.filter((product) => cart[product.id] > 0);
  const cartCount = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);

  function addToCart(product: Product) {
    setCart((current) => ({ ...current, [product.id]: (current[product.id] ?? 0) + 1 }));
    setCartOpen(true);
  }

  function changeQuantity(id: string, change: number) {
    setCart((current) => {
      const next = (current[id] ?? 0) + change;
      if (next <= 0) {
        const updated = { ...current };
        delete updated[id];
        return updated;
      }
      return { ...current, [id]: next };
    });
  }

  useEffect(() => {
    const site = siteRef.current;
    if (!site || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const context = gsap.context(() => {
      gsap.from(".rza-hero-copy > *", { y: 22, autoAlpha: 0, duration: 0.8, stagger: 0.09, ease: "power3.out", delay: 0.12 });
      gsap.from(".rza-hero-visual > img", { scale: 1.07, duration: 1.25, ease: "power2.out", delay: 0.08 });
      gsap.utils.toArray<HTMLElement>(".rza-reveal").forEach((element) => {
        gsap.from(element, {
          y: 28,
          autoAlpha: 0,
          duration: 0.75,
          ease: "power2.out",
          scrollTrigger: { trigger: element, start: "top 88%", once: true },
        });
      });
      gsap.from(".rza-product", {
        y: 24,
        autoAlpha: 0,
        duration: 0.65,
        stagger: 0.08,
        ease: "power2.out",
        scrollTrigger: { trigger: ".rza-products", start: "top 85%", once: true },
      });
      gsap.to(".rza-hero-visual > img", {
        yPercent: 5,
        ease: "none",
        scrollTrigger: { trigger: ".rza-hero", start: "top top", end: "bottom top", scrub: 0.6 },
      });
    }, site);
    return () => context.revert();
  }, []);

  useEffect(() => {
    const overlay = mobileMenuRef.current;
    if (!overlay) return;
    const layers = overlay.querySelectorAll<HTMLElement>(".rza-kinetic-layer");
    const links = overlay.querySelectorAll<HTMLElement>(".rza-kinetic-link");
    const content = overlay.querySelector<HTMLElement>(".rza-kinetic-content");
    const timeline = gsap.timeline();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      gsap.set(overlay, { display: menuOpen ? "block" : "none", autoAlpha: menuOpen ? 1 : 0 });
      menuWasOpened.current = menuOpen;
      timeline.kill();
      return;
    }
    if (!menuOpen && !menuWasOpened.current) {
      gsap.set(overlay, { display: "none", autoAlpha: 0 });
      timeline.kill();
      return;
    }
    if (menuOpen) {
      menuWasOpened.current = true;
      gsap.set(overlay, { display: "block", autoAlpha: 1 });
      timeline
        .fromTo(overlay.querySelector(".rza-kinetic-scrim"), { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.28 })
        .fromTo(layers, { xPercent: 105 }, { xPercent: 0, duration: 0.62, stagger: 0.09, ease: "power4.out" }, "<")
        .fromTo(content, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 0.4 }, "<+=0.24")
        .fromTo(links, { yPercent: 130, rotate: 5 }, { yPercent: 0, rotate: 0, duration: 0.56, stagger: 0.07, ease: "power3.out" }, "<+=0.08");
    } else {
      gsap.set(overlay, { display: "block", autoAlpha: 1 });
      timeline
        .to(links, { yPercent: -30, autoAlpha: 0, duration: 0.2, stagger: 0.025, ease: "power2.in" })
        .to(layers, { xPercent: 105, duration: 0.38, stagger: 0.055, ease: "power3.in" }, "<")
        .to(overlay.querySelector(".rza-kinetic-scrim"), { autoAlpha: 0, duration: 0.2 }, "<+=0.12")
        .set(overlay, { display: "none", autoAlpha: 0 })
        .call(() => { menuWasOpened.current = false; });
    }
    return () => { timeline.kill(); };
  }, [menuOpen]);

  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <main ref={siteRef} data-theme={lightMode ? "light" : "dark"}>
      <div className="rza-announcement"><Crown size={13} strokeWidth={1.5} /><span>Based in Ikorodu, Lagos</span><i /> <span>Delivered worldwide</span><a href={`mailto:${contactEmail}`}>Get in touch <ArrowUpRight size={12} /></a></div>
      <header className="rza-header">
        <a className="rza-brand" href="#top" aria-label="RZA Clothing home"><img src="/images/rza/logo-monogram.jpg" alt="RZA monogram" /><span>RZA<small>CLOTHING</small></span></a>
        <nav className="rza-nav" aria-label="Main navigation">
          <a href="#collection" onClick={() => setMenuOpen(false)}>The collection</a>
          <a href="#story" onClick={() => setMenuOpen(false)}>Our story</a>
          <a href="#contact" onClick={() => setMenuOpen(false)}>Contact</a>
        </nav>
        <a className="rza-header-cta" href="#collection">Shop the pieces <ArrowRight size={15} /></a>
        <button className="rza-cart-trigger" type="button" onClick={() => setCartOpen(true)} aria-label={`Open shopping bag, ${cartCount} items`}><ShoppingBag size={17} /><span>Bag</span><b>{cartCount}</b></button>
        <button className="rza-theme-toggle" type="button" onClick={() => setLightMode((current) => !current)} aria-label={lightMode ? "Switch to dark mode" : "Switch to light mode"} title={lightMode ? "Switch to dark mode" : "Switch to light mode"}>{lightMode ? <Moon size={17} /> : <Sun size={17} />}</button>
        <button className="rza-menu-toggle" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="rza-mobile-menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
      </header>

      <div id="rza-mobile-menu" className="rza-kinetic-menu" ref={mobileMenuRef} aria-hidden={!menuOpen}>
        <button className="rza-kinetic-scrim" aria-label="Close navigation menu" onClick={() => setMenuOpen(false)} />
        <div className="rza-kinetic-panels" aria-hidden="true"><span className="rza-kinetic-layer" /><span className="rza-kinetic-layer" /><span className="rza-kinetic-layer" /></div>
        <div className="rza-kinetic-content">
          <div className="rza-kinetic-top"><span>RZA / CLOTHING</span><div><span>IKORODU · LAGOS</span><button className="rza-kinetic-close" onClick={() => setMenuOpen(false)} aria-label="Close navigation"><X size={15} /></button></div></div>
          <nav className="rza-kinetic-links" aria-label="Mobile navigation">
            <a className="rza-kinetic-link" href="#collection" onClick={() => setMenuOpen(false)}><span>The collection</span><small>01</small><ArrowUpRight size={20} /></a>
            <a className="rza-kinetic-link" href="#story" onClick={() => setMenuOpen(false)}><span>Our story</span><small>02</small><ArrowUpRight size={20} /></a>
            <a className="rza-kinetic-link" href="#contact" onClick={() => setMenuOpen(false)}><span>Contact</span><small>03</small><ArrowUpRight size={20} /></a>
          </nav>
          <div className="rza-kinetic-bottom"><span>Dress the life you want.</span><a href="https://wa.me/2348137956355" target="_blank" rel="noreferrer">Chat with RZA <ArrowUpRight size={14} /></a></div>
          <div className="rza-kinetic-watermark" aria-hidden="true">RZA</div>
        </div>
      </div>

      <section className="rza-hero" id="top">
        <div className="rza-hero-copy">
          <p className="rza-overline"><span /> Ikorodu, Lagos · Made to stand out</p>
          <h1>Dress the life<br />you <em>want.</em></h1>
          <p className="rza-hero-text">Clothing with presence. Made for the ones who know their own way and wear it well.</p>
          <a className="rza-button rza-button-gold" href="#collection">Explore the collection <ArrowRight size={16} /></a>
          <div className="rza-hero-foot"><span>01 / THE RZA EDIT</span><a href="#collection">Discover the pieces <ArrowDown size={14} /></a></div>
        </div>
        <div className="rza-hero-visual">
          <img src="/images/rza/IMG_3335.jpeg" alt="RZA green and orange tracksuit set" />
          <div className="rza-hero-stamp"><Crown size={18} /><span>RZA<br />ORIGINAL</span></div>
          <p className="rza-hero-caption">A Lagos state of mind.</p>
        </div>
        <div className="rza-hero-watermark" aria-hidden="true">RZA</div>
      </section>

      <section className="rza-marquee" aria-label="Brand message"><span>RZA CLOTHING</span><b>✳</b><span>DRESS THE LIFE YOU WANT</span><b>✳</b><span>ROOTED IN LAGOS</span><b>✳</b><span>RZA CLOTHING</span></section>

      <section className="rza-hanger-section" aria-labelledby="rail-heading">
        <div className="rza-section-top rza-reveal"><div><p className="rza-overline"><span /> A closer look</p><h2 id="rail-heading">Meet the <em>pieces.</em></h2></div><p>Slide along the rail, turn a piece around, and explore the RZA edit up close.</p></div>
        <ClothingRailHero
          items={railItems}
          hanger="none"
          eyebrow=""
          heading=""
          caption="Move along the rail. Select a piece to see the details."
          autoplay
          interval={3200}
          className="rza-rail"
          action={<a className="rza-button rza-button-gold" href="#collection">Shop the collection <ArrowRight size={15} /></a>}
        />
      </section>

      <section className="rza-collection" id="collection">
        <div className="rza-section-top"><div><p className="rza-overline"><span /> The collection</p><h2>Wear your <em>own story.</em></h2></div><p>Everyday staples and standout pieces. Find the one that feels like you.</p></div>
        <div className="rza-filters" role="group" aria-label="Filter products">
          {categories.map((item) => <button key={item} className={category === item ? "is-active" : ""} onClick={() => setCategory(item)} aria-pressed={category === item}>{item}<span>{item === "All pieces" ? products.length : products.filter((product) => product.category === item).length}</span></button>)}
          <span className="rza-piece-count">{visibleProducts.length} pieces</span>
        </div>
        <div className="rza-products">
          {visibleProducts.map((product, index) => <article className="rza-product" key={product.id} style={{ animationDelay: `${index * 45}ms` }}>
            <button className="rza-product-image" onClick={() => setSelected(product)} aria-label={`View ${product.name}`}>
              <img src={product.image} alt={product.name} loading="lazy" />
              {product.label && <span className="rza-product-label">{product.label}</span>}
              <span className="rza-view-piece">View piece <ArrowUpRight size={14} /></span>
            </button>
            <div className="rza-product-info"><div><h3>{product.name}</h3><p>{product.note}</p></div><button onClick={() => addToCart(product)} aria-label={`Add ${product.name} to bag`}><ShoppingBag size={16} /></button></div>
          </article>)}
        </div>
        <div className="rza-collection-foot"><span>Made for your everyday. Styled your way.</span><a href={`mailto:${contactEmail}?subject=${encodeURIComponent("RZA Clothing collection enquiry")}`}>Ask about a piece <ArrowRight size={14} /></a></div>
      </section>

      <section className="rza-story rza-reveal" id="story">
        <div className="rza-story-image"><img src="/images/rza/IMG_3337.jpeg" alt="RZA graphic tees, front and back" loading="lazy" /><div className="rza-story-tag">RZA ORIGINALS<br /><span>01 — 04</span></div></div>
        <div className="rza-story-copy"><p className="rza-overline"><span /> From Ikorodu, with intention</p><h2>Rooted here.<br /><em>Worn everywhere.</em></h2><p>RZA Clothing is a Nigerian label for people who dress with confidence. From graphic tees and everyday sets to the finishing touch, each piece carries its own point of view.</p><p>Based in Ikorodu, Lagos. Wherever you are, we’ll get it to you.</p><a className="rza-button rza-button-outline" href={`mailto:${contactEmail}`}>Talk to RZA <ArrowUpRight size={15} /></a><span className="rza-story-ornament" aria-hidden="true">R</span></div>
      </section>

      <section className="rza-contact rza-reveal" id="contact">
        <div className="rza-contact-copy"><p className="rza-overline"><span /> Good style starts with a conversation</p><h2>Let’s find your <em>RZA.</em></h2><p>Need help choosing a piece, finding your fit, or arranging delivery? Talk to us directly and we’ll help you make it yours.</p><div className="rza-contact-actions"><a className="rza-button rza-button-gold" href="https://wa.me/2348137956355?text=Hello%20RZA%20Clothing%2C%20I%E2%80%99d%20like%20to%20ask%20about%20a%20piece." target="_blank" rel="noreferrer">Chat on WhatsApp <ArrowUpRight size={16} /></a><a className="rza-contact-email" href={`mailto:${contactEmail}?subject=${encodeURIComponent("Hello RZA Clothing")}`}>Or send us an email <ArrowRight size={14} /></a></div></div>
        <div className="rza-contact-card"><span className="rza-contact-card-index">RZA / CUSTOMER CARE</span><div className="rza-contact-card-main"><Crown size={22} strokeWidth={1.3} /><strong>Here for the details.</strong><p>Pieces, sizing, delivery and everything in between.</p></div><div className="rza-contact-card-meta"><span>BASED IN</span><strong>Ikorodu, Lagos · Nigeria</strong><span>DELIVERY</span><strong>Worldwide</strong><span>AVAILABILITY</span><strong>Open 24 hours</strong></div></div>
      </section>

      <footer className="rza-footer">
        <div className="rza-footer-brand"><a className="rza-brand" href="#top"><img src="/images/rza/logo-monogram.jpg" alt="" /><span>RZA<small>CLOTHING</small></span></a><p>Dress the life you want.</p><span>Based in Ikorodu, Lagos. Delivered worldwide.</span></div>
        <div className="rza-footer-column"><span className="rza-footer-label">EXPLORE</span><a href="#collection">The collection</a><a href="#story">Our story</a><a href="#contact">Contact</a></div>
        <div className="rza-footer-column"><span className="rza-footer-label">SAY HELLO</span><a href={`mailto:${contactEmail}`}>{contactEmail}</a><span>Ikorodu, Lagos · Nigeria</span><span>Open 24 hours</span></div>
        <div className="rza-footer-social"><span className="rza-footer-label">FOLLOW RZA <small>Links coming soon</small></span><div className="rza-social-list"><span aria-label="Facebook profile link coming soon" title="Facebook · link coming soon"><SocialMark name="facebook" /></span><span aria-label="Instagram profile link coming soon" title="Instagram · link coming soon"><SocialMark name="instagram" /></span><span aria-label="TikTok profile link coming soon" title="TikTok · link coming soon"><SocialMark name="tiktok" /></span></div></div>
        <div className="rza-footer-bottom"><span>© 2026 RZA Clothing</span><span>Lagos, Nigeria</span><a href="#top">Back to top ↑</a></div>
      </footer>

      <a className="rza-whatsapp" href="https://wa.me/2348137956355?text=Hello%20RZA%20Clothing%2C%20I%E2%80%99d%20like%20to%20make%20an%20enquiry." target="_blank" rel="noreferrer" aria-label="Chat with RZA Clothing on WhatsApp" title="Chat with RZA on WhatsApp">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.5 3.5A11.8 11.8 0 0 0 12.1 0C5.6 0 .3 5.3.3 11.8c0 2.1.6 4.1 1.6 5.9L.2 24l6.5-1.7a11.8 11.8 0 0 0 5.4 1.3h.1c6.5 0 11.8-5.3 11.8-11.8 0-3.1-1.2-6-3.5-8.3ZM12.1 21.6h-.1c-1.7 0-3.4-.5-4.8-1.3l-.3-.2-3.9 1 1-3.8-.2-.4a9.7 9.7 0 0 1-1.5-5.2c0-5.4 4.4-9.8 9.8-9.8 2.6 0 5.1 1 6.9 2.9a9.7 9.7 0 0 1 2.9 6.9c0 5.5-4.4 9.9-9.8 9.9Zm5.4-7.4c-.3-.1-1.6-.8-1.9-.9-.3-.1-.5-.1-.7.2-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.4.1-.6l.4-.5.3-.5c.1-.2 0-.4 0-.5l-.9-2.1c-.2-.5-.5-.4-.7-.4h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.1 3c.1.2 2 3.1 4.8 4.3.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.6-.1 1.6-.7 1.8-1.3.2-.6.2-1.1.2-1.3-.1-.3-.3-.4-.6-.6Z" fill="currentColor"/></svg>
      </a>

      {cartOpen && <div className="rza-cart-backdrop" onClick={() => setCartOpen(false)}>
        <aside className="rza-cart-drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" onClick={(event) => event.stopPropagation()}>
          <div className="rza-cart-head"><div><p className="rza-overline"><span /> YOUR SELECTION</p><h2 id="cart-title">Your bag <em>({cartCount})</em></h2></div><button onClick={() => setCartOpen(false)} aria-label="Close shopping bag"><X size={20} /></button></div>
          {cartItems.length === 0 ? <div className="rza-cart-empty"><ShoppingBag size={27} /><p>Your bag is waiting for something good.</p><button className="rza-button rza-button-gold" onClick={() => setCartOpen(false)}>Explore the collection <ArrowRight size={15} /></button></div> : <>
            <div className="rza-cart-items">{cartItems.map((product) => <article className="rza-cart-item" key={product.id}><img src={product.image} alt="" /><div className="rza-cart-item-info"><h3>{product.name}</h3><p>{product.note}</p><div className="rza-quantity"><button onClick={() => changeQuantity(product.id, -1)} aria-label={`Remove one ${product.name}`}><Minus size={13} /></button><span>{cart[product.id]}</span><button onClick={() => changeQuantity(product.id, 1)} aria-label={`Add one ${product.name}`}><Plus size={13} /></button></div></div><button className="rza-remove-item" onClick={() => changeQuantity(product.id, -cart[product.id])} aria-label={`Remove ${product.name} from bag`}><Trash2 size={15} /></button></article>)}</div>
            <div className="rza-cart-bottom"><p>We’ll confirm pricing, sizing and delivery with you directly.</p><a className="rza-button rza-button-gold" href={`mailto:${contactEmail}?subject=${encodeURIComponent("RZA Clothing order enquiry")}&body=${encodeURIComponent(cartItems.map((product) => `${product.name} × ${cart[product.id]}`).join("\n"))}`}>Enquire to order <ArrowRight size={15} /></a><button className="rza-continue-shopping" onClick={() => setCartOpen(false)}>Continue browsing</button></div>
          </>}
        </aside>
      </div>}

      {selected && <div className="rza-modal-backdrop" role="presentation" onClick={() => setSelected(null)}><section className="rza-modal" role="dialog" aria-modal="true" aria-labelledby="piece-title" onClick={(event) => event.stopPropagation()}><button className="rza-modal-close" onClick={() => setSelected(null)} aria-label="Close piece details"><X size={19} /></button><div className="rza-modal-image"><img src={selected.image} alt={selected.name} /></div><div className="rza-modal-copy"><p className="rza-overline"><span /> {selected.category}</p><h2 id="piece-title">{selected.name}</h2><p>{selected.note}</p><p>Made to make your own. Contact RZA for availability, sizing, and delivery.</p><button className="rza-button rza-button-gold" onClick={() => { addToCart(selected); setSelected(null); }}>Add to bag <ShoppingBag size={15} /></button></div></section></div>}
    </main>
  );
}

export default App;
