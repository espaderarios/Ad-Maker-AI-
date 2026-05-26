import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell, CreditCard, Layers3, LockKeyhole, Settings2, Sparkles, UserRound } from 'lucide-react';

const sections = [
  { label: 'Account', icon: UserRound, text: 'Profile, email, and password' },
  { label: 'AI Preferences', icon: Sparkles, text: 'Voice, style, creativity' },
  { label: 'Rendering', icon: Layers3, text: 'Default export and GPU acceleration' },
  { label: 'Billing', icon: CreditCard, text: 'Plan, credits, and invoices' },
];

export default function Settings() {
  const navigate = useNavigate();

  return (
    <main className="screen-shell" style={styles.shell}>
      <header className="glass-card" style={styles.header}>
        <div>
          <p style={styles.kicker}>Modern SaaS dashboard</p>
          <h1 style={styles.title}>Settings</h1>
        </div>
        <button className="neutral-button" onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
      </header>

      <section style={styles.layout}>
        <aside className="glass-card" style={styles.sidebar}>
          {sections.map(({ label, icon: Icon, text }, index) => (
            <button key={label} style={{ ...styles.sidebarItem, ...(index === 0 ? styles.sidebarItemActive : {}) }}>
              <Icon size={16} />
              <div style={styles.sidebarCopy}>
                <strong>{label}</strong>
                <span>{text}</span>
              </div>
            </button>
          ))}
        </aside>

        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="glass-card" style={styles.content}>
          <div style={styles.sectionHeader}>
            <p style={styles.kicker}>Utility panel</p>
            <h2 style={styles.sectionTitle}>Clean controls for your account and render pipeline.</h2>
          </div>

          <div style={styles.grid}>
            <div style={styles.card}>
              <div style={styles.cardHeader}><UserRound size={16} /> Account</div>
              <input className="field-input" placeholder="Display name" />
              <input className="field-input" placeholder="Email" />
              <input className="field-input" placeholder="Password" type="password" />
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}><Sparkles size={16} /> AI Preferences</div>
              <input className="field-input" placeholder="Default voice" />
              <input className="field-input" placeholder="Default style" />
              <input className="field-input" placeholder="AI creativity level" />
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}><Layers3 size={16} /> Rendering</div>
              <input className="field-input" placeholder="Default export format" />
              <input className="field-input" placeholder="Resolution" />
              <input className="field-input" placeholder="GPU acceleration" />
            </div>

            <div style={styles.card}>
              <div style={styles.cardHeader}><CreditCard size={16} /> Billing</div>
              <input className="field-input" placeholder="Plan" />
              <input className="field-input" placeholder="Credits remaining" />
              <button className="neutral-button" style={styles.cardBtn}><LockKeyhole size={16} /> Manage invoices</button>
            </div>
          </div>

          <div style={styles.footerRow}>
            <div style={styles.alertBox}><Bell size={16} /> Notifications and workflow reminders live here.</div>
            <button className="primary-button" style={styles.saveBtn}><Settings2 size={16} /> Save changes</button>
          </div>
        </motion.div>
      </section>
    </main>
  );
}

const styles = {
  shell: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', padding: 'var(--container-padding)', flexWrap: 'wrap' },
  kicker: { margin: 0, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem' },
  title: { margin: '0.5rem 0 0', fontSize: 'clamp(1.8rem, 3vw, 3rem)', letterSpacing: '-0.04em' },
  backBtn: { height: '3rem', padding: '0 1rem' },
  layout: { display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) minmax(0, 1fr)', gap: 'var(--space-3)', alignItems: 'start' },
  sidebar: { padding: 'var(--space-2)', display: 'grid', gap: 'var(--space-1)', position: 'sticky', top: '1.25rem' },
  sidebarItem: { display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: '16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)', color: 'var(--text)', textAlign: 'left' },
  sidebarItemActive: { background: 'rgba(124,58,237,0.14)', borderColor: 'rgba(124,58,237,0.22)' },
  sidebarCopy: { display: 'flex', flexDirection: 'column', gap: '0.25rem', textAlign: 'left' },
  content: { padding: 'var(--space-3)' },
  sectionHeader: { marginBottom: 'var(--space-3)' },
  sectionTitle: { margin: '0.5rem 0 0', fontSize: '1.7rem' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-2)' },
  card: { padding: 'var(--space-2)', borderRadius: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
  cardHeader: { display: 'flex', alignItems: 'center', gap: 'var(--space-1)', fontWeight: 700 },
  cardBtn: { height: '3rem', display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', justifyContent: 'center' },
  footerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)', flexWrap: 'wrap' },
  alertBox: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-secondary)' },
  saveBtn: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', padding: '0 1rem' },
};
