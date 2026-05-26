import { useEffect } from 'react';
import { hover, motion } from 'framer-motion';
import { ArrowRight, Sparkles, Wand2, Clapperboard, PlayCircle, Stars, Play, Video, Film, Layers3, ChartColumn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import tiktokGif from '../assets/gifs/tiktokviral.gif';
import cinematicGif from '../assets/gifs/cinematiclaunch.gif';
import productGif from '../assets/gifs/ProductShowcase.gif';
import saasGif from '../assets/gifs/SaasExplainer.gif';
import previewFrameGif from '../assets/gifs/PreviewFrame.gif';
import THEME from '../config/theme.js';
import { THEMES } from '../config/themes.js';

// Select active theme key here (stone, ash, latte, olive, dusk, clay)
const ACTIVE_THEME = THEMES.latte;

const features = [
  { icon: Wand2, title: 'AI ad generation', text: 'Generate hooks, scenes, and scripts with a creator-first workflow.' },
  { icon: Layers3, title: 'Template systems', text: 'Switch between cinematic, product, SaaS, and short-form formats.' },
  { icon: ChartColumn, title: 'Export visibility', text: 'Track renders, progress, and outputs from one clean command center.' },
  { icon: Video, title: 'Subtitle-driven playback', text: 'Build ads around motion, captions, and timing instead of static frames.' },
];

const brands = ['Canva', 'Linear', 'Framer', 'CapCut', 'Notion'];

// Theme palette (user-provided)
const templates = [
  { name: 'TikTok Viral', tag: 'Short-form', accent: ACTIVE_THEME.accent },
  { name: 'Cinematic Launch', tag: 'Premium', accent: ACTIVE_THEME.deep },
  { name: 'SaaS Explainer', tag: 'B2B', accent: ACTIVE_THEME.sand },
  { name: 'Product Showcase', tag: 'DTC', accent: ACTIVE_THEME.warm },
];

const gifMap = {
  'TikTok Viral': tiktokGif,
  'Cinematic Launch': cinematicGif,
  'Product Showcase': productGif,
  'SaaS Explainer': saasGif,
};

const pricing = [
  { name: 'Free', price: '₱0', text: 'Get started with the basics.', accent: ACTIVE_THEME.light },
  { name: 'Creator', price: '₱129', text: 'For teams making ads every week.', accent: ACTIVE_THEME.accent },
  { name: 'Studio', price: '₱399', text: 'Advanced export, collaboration, and volume.', accent: ACTIVE_THEME.deep },
];

export default function Home() {
  const navigate = useNavigate();
  const { token } = useAuthStore();

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  return (
    <main className="screen-shell" style={styles.shell}>
      <div style={styles.noise} />
      <motion.nav
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={styles.nav}
      >
        <div style={styles.brandMark}>
          <div style={styles.brandDot} />
          <div>
            <div style={styles.brandLabel}>AI Video Ad Maker</div>
            <div style={styles.brandSub}>cinematic creative studio</div>
          </div>
        </div>
        <div style={styles.navActions}>
          <button className="neutral-button" onClick={() => navigate('/login')} style={styles.navBtn}>Log in</button>
          <button className="primary-button" onClick={() => navigate('/dashboard')} style={styles.navBtnPrimary}>Open Studio</button>
        </div>
      </motion.nav>

      <section style={styles.heroGrid}>
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          style={styles.heroCopy}
        >
          <div style={styles.badge}>
            <Sparkles size={14} /> AI creative studio for modern creators
          </div>
          <h1 style={styles.heroTitle}>Create Viral Ads With AI</h1>
          <p style={styles.heroText}>
            Build cinematic short-form ads, premium product launches, and SaaS explainers with one
            premium workspace. Generate concepts, edit scenes, and export finished videos without
            leaving the studio.
          </p>
          <div style={styles.heroActions}>
            <button className="primary-button" onClick={() => navigate('/dashboard')} style={styles.ctaButton}>
              <PlayCircle size={18} /> Launch Studio
            </button>
            <button className="neutral-button" onClick={() => navigate('/generator')} style={styles.secondaryButton}>
              <Wand2 size={18} /> Try AI Generator
            </button>
          </div>
          <div style={styles.metricsRow}>
            <div style={styles.metricCard}>
              <strong>120K+</strong>
              <span>renders created</span>
            </div>
            <div style={styles.metricCard}>
              <strong>4.9/5</strong>
              <span>creator rating</span>
            </div>
            <div style={styles.metricCard}>
              <strong>3x</strong>
              <span>faster iteration</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.75, delay: 0.15 }}
          style={styles.heroPreviewWrap}
        >
          <div style={styles.previewGlow} className="pulse-glow" />
          <div className="glass-card floaty" style={styles.previewCard}>
            <div style={styles.previewTopbar}>
              <span style={styles.windowDot} />
              <span style={styles.windowDot} />
              <span style={styles.windowDot} />
            </div>
            <div style={styles.previewFrame}>
              <img src={previewFrameGif} alt="Preview frame animation" loading="eager" style={styles.previewArtwork} />
            </div>
          </div>
        </motion.div>
      </section>

      <section style={styles.brandStrip}>
        {brands.map((brand) => (
          <span key={brand} style={styles.brandPill}>{brand}</span>
        ))}
      </section>

      <section style={styles.sectionBlock}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Features</p>
          <h2 style={styles.sectionTitle}>Everything feels like a premium creative workspace.</h2>
        </div>
        <div style={styles.featureGrid}>
          {features.map(({ icon: Icon, title, text }) => (
            <motion.article key={title} whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }} className="glass-card" style={styles.featureCard}>
              <div style={styles.featureIcon}><Icon size={18} /></div>
              <h3 style={styles.featureTitle}>{title}</h3>
              <p style={styles.featureText}>{text}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section style={styles.sectionBlock}>
        <div style={styles.sectionHeaderInline}>
          <div>
            <p style={styles.sectionKicker}>Templates</p>
            <h2 style={styles.sectionTitle}>Netflix-style showcase for your ad formats.</h2>
          </div>
          <button className="neutral-button" onClick={() => navigate('/generator')} style={styles.linkButton}>
            Browse ideas <ArrowRight size={16} />
          </button>
        </div>
        <div style={styles.templateRail}>
          {templates.map((item) => (
            <motion.div key={item.name} whileHover={{ scale: 1.02 }} className="glass-card" style={{ ...styles.templateCard, boxShadow: `0 18px 50px ${item.accent}20` }}>
              <div style={{ ...styles.templateGlow, background: `linear-gradient(135deg, ${item.accent}, transparent)` }} />

              <div style={{height: '220px', background: THEME.darkSlate, display: 'block', overflow: 'hidden'}}>
                <img src={gifMap[item.name]} alt={`${item.name} preview`} style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}} />
              </div>

              <div style={styles.templateTag}>{item.tag}</div>
              <h3 style={styles.templateName}>{item.name}</h3>
              <div style={styles.templateFooter}>
                <span>15 - 45 sec</span>
                <span>4K export</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section style={styles.sectionBlock}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionKicker}>Pricing</p>
          <h2 style={styles.sectionTitle}>Simple plans for creators and small teams.</h2>
        </div>
        <div style={styles.priceGrid}>
          {pricing.map((plan) => (
            <motion.div
              key={plan.name}
              className="glass-card"
              style={styles.priceCard(plan.accent)}
              whileHover={{ y: -8, scale: 1.02, boxShadow: `0 24px 60px ${plan.accent}33` }}
              transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            >
              <div style={styles.priceName}>{plan.name}</div>
              <div style={styles.priceValue}>{plan.price}</div>
              <p style={styles.priceText}>{plan.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        <div style={styles.footerBrand}>
          <div style={styles.brandMarkMini}><Clapperboard size={16} /></div>
          <span>AI Video Ad Maker</span>
        </div>
        <span style={styles.footerText}>Cinematic tools for modern creators.</span>
      </footer>
    </main>
  );
}

const styles = {
  shell: {
    position: 'relative',
    paddingTop: 'var(--space-2)',
    paddingBottom: 'calc(var(--space-4) * 2)',
  },
  noise: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: `radial-gradient(circle at 20% 20%, rgba(141,155,164,0.18), transparent 18%), radial-gradient(circle at 80% 0%, rgba(196,201,205,0.14), transparent 24%)`,
    opacity: 0.7,
  },
  nav: {
    maxWidth: '1280px',
    margin: '0 auto',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--space-2)',
    padding: 'var(--space-2) calc(var(--container-padding))',
    position: 'relative',
    zIndex: 2,
  },
  brandMark: { display: 'flex', alignItems: 'center', gap: '12px' },
  brandDot: { width: '14px', height: '14px', borderRadius: '999px', background: `linear-gradient(135deg, ${THEME.slate}, ${THEME.lightGray})`, boxShadow: `0 0 24px rgba(196,201,205,0.55)` },
  brandLabel: { fontWeight: 700, letterSpacing: '-0.02em' },
  brandSub: { fontSize: '0.82rem', color: THEME.darkSlate },
  navActions: { display: 'flex', gap: '10px', flexWrap: 'wrap' },
  navBtn: { padding: '0 18px', height: '44px' },
  navBtnPrimary: { padding: '0 18px', height: '44px' },
  heroGrid: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: 'calc(var(--space-4) * 2) calc(var(--container-padding)) calc(var(--space-3))',
    display: 'grid',
    gridTemplateColumns: '1.05fr 0.95fr',
    gap: 'var(--space-4)',
    alignItems: 'center',
  },
  heroCopy: { position: 'relative', zIndex: 2 },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '0.45rem 0.75rem',
    borderRadius: '999px',
    background: `rgba(${66},${73},${83},0.12)`,
    border: `1px solid rgba(${196},${201},${205},0.28)`,
    color: THEME.darkSlate,
    fontSize: '0.9rem',
    marginBottom: 'var(--space-2)',
  },
  heroTitle: { margin: 0, fontSize: 'clamp(3.2rem, 7vw, 6.4rem)', lineHeight: 0.94, letterSpacing: '-0.06em', maxWidth: '11ch' },
  heroText: { maxWidth: '62ch', color: THEME.darkSlate, fontSize: '1.08rem', lineHeight: 1.8, marginTop: 'var(--space-3)' },
  heroActions: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap', marginTop: 'var(--space-3)' },
  ctaButton: { height: '3.25rem', padding: '0 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' },
  secondaryButton: { height: '3.25rem', padding: '0 1.25rem', display: 'inline-flex', alignItems: 'center', gap: '0.6rem' },
  metricsRow: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-3)', maxWidth: '35rem' },
  metricCard: { padding: 'var(--space-2)', borderRadius: '20px', background: `rgba(244,245,240,0.04)`, border: `1px solid rgba(244,245,240,0.06)` },
  heroPreviewWrap: { position: 'relative', minHeight: '36rem', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  previewGlow: { position: 'absolute', inset: '12% 18%', background: `radial-gradient(circle, rgba(141,155,164,0.35) 0%, rgba(230,223,215,0.22) 42%, transparent 70%)`, filter: 'blur(32px)', borderRadius: '999px' },
  previewCard: { position: 'relative', width: '100%', maxWidth: '35rem', padding: 'var(--space-2)' },
  previewTopbar: { display: 'flex', gap: '0.5rem', paddingBottom: 'var(--space-2)' },
  windowDot: { width: '0.625rem', height: '0.625rem', borderRadius: '999px', background: `rgba(244,245,240,0.22)` },
  previewFrame: { padding: '0.5rem', borderRadius: '20px', background: `linear-gradient(180deg, rgba(8,12,20,0.98), rgba(14,20,32,0.98))`, border: `1px solid rgba(244,245,240,0.06)`, overflow: 'hidden' },
  previewArtwork: {
    display: 'block',
    width: '100%',
    height: '100%',
    minHeight: '26rem',
    borderRadius: '16px',
  },
  brandStrip: { maxWidth: '1280px', margin: '0 auto', padding: '0.5rem calc(var(--container-padding)) calc(var(--space-4) * 1.5)', display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap', justifyContent: 'center' },
  brandPill: { padding: '10px 16px', borderRadius: '999px', background: `rgba(244,245,240,0.04)`, color: ACTIVE_THEME.dark, border: `1px solid rgba(244,245,240,0.06)` },
  sectionBlock: { maxWidth: '1280px', margin: '0 auto', padding: 'var(--space-3) calc(var(--container-padding)) 0' },
  sectionHeader: { marginBottom: '18px' },
  sectionHeaderInline: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-3)', alignItems: 'end', marginBottom: 'var(--space-3)', flexWrap: 'wrap' },
  sectionKicker: { margin: 0, color: THEME.darkSlate, textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.74rem' },
  sectionTitle: { margin: '8px 0 0', fontSize: 'clamp(1.5rem, 3vw, 2.6rem)', lineHeight: 1.05 },
  featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 'var(--space-3)' },
  featureCard: { padding: 'var(--space-2)' },
  featureIcon: { width: '2.75rem', height: '2.75rem', borderRadius: '14px', display: 'grid', placeItems: 'center', background: `rgba(141,155,164,0.10)`, color: ACTIVE_THEME.dark, marginBottom: 'var(--space-2)' },
  featureTitle: { margin: 0, fontSize: '1.08rem' },
  featureText: { color: THEME.darkSlate, lineHeight: 1.7, marginBottom: 0 },
  linkButton: { height: '44px', display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '0 16px' },
  templateRail: { display: 'grid', gridTemplateColumns: 'repeat(4, minmax(15rem, 1fr))', gap: 'var(--space-3)', overflowX: 'auto', paddingBottom: '0.375rem' },
  templateCard: { position: 'relative', minHeight: '13.75rem', padding: 'var(--space-2)', overflow: 'hidden' },
  templateGlow: { position: 'absolute', inset: 0, opacity: 0.32 },
  templateTag: { position: 'relative', display: 'inline-flex', marginBottom: '3.75rem', padding: '0.45rem 0.6rem', borderRadius: '999px', background: `rgba(244,245,240,0.08)`, fontSize: '0.84rem' },
  templateName: { position: 'relative', margin: 0, fontSize: '1.45rem', maxWidth: '8ch', lineHeight: 1.1 },
  templateFooter: { position: 'relative', display: 'flex', justifyContent: 'space-between', color: ACTIVE_THEME.dark, marginTop: '3.5rem', fontSize: '0.9rem' },
  priceGrid: { display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-3)' },
  priceCard: (accent) => ({ padding: 'var(--space-3)', background: accent, color: accent === THEME.darkSlate ? THEME.offWhite : THEME.darkSlate, borderRadius: '12px' }),
  priceName: { color: 'inherit', textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.75rem' },
  priceValue: { marginTop: '0.75rem', fontSize: '2.4rem', fontWeight: 700, color: 'inherit' },
  priceText: { color: 'inherit', lineHeight: 1.7 },
  footer: { maxWidth: '1280px', margin: '36px auto 0', padding: '22px 20px 0', display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', borderTop: `1px solid rgba(244,245,240,0.08)`, flexWrap: 'wrap' },
  footerBrand: { display: 'flex', alignItems: 'center', gap: '10px' },
  brandMarkMini: { width: '28px', height: '28px', display: 'grid', placeItems: 'center', borderRadius: '10px', background: `linear-gradient(135deg, ${THEME.slate}, ${THEME.lightGray})` },
  footerText: { color: THEME.darkSlate },
};
