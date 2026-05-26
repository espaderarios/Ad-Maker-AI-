import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Film, LayoutGrid, LibraryBig, LogOut, Sparkles, TrendingUp, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { useProjectStore } from '../store/project.store.js';

const sidebarItems = [
  { label: 'Home', icon: LayoutGrid },
  { label: 'Projects', icon: Film },
  { label: 'Templates', icon: LibraryBig },
  { label: 'AI Generator', icon: Wand2 },
  { label: 'Analytics', icon: BarChart3 },
  { label: 'Settings', icon: Sparkles },
];

const templates = ['TikTok', 'Cinematic', 'SaaS', 'Product'];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, logout, token } = useAuthStore();
  const { projects, fetchProjects, createProject, deleteProject, isLoading, setCurrentProject } = useProjectStore();
  const [showNewForm, setShowNewForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchProjects().catch((err) => setError(err.message));
  }, [token, navigate, fetchProjects]);

  const metrics = useMemo(() => {
    const exportsCount = projects.length * 2 + 3;
    return [
      { label: 'Total exports', value: exportsCount },
      { label: 'Render minutes', value: `${Math.max(projects.length * 3, 12)}m` },
      { label: 'AI credits', value: `${Math.max(80 - projects.length * 3, 22)}` },
      { label: 'Trending templates', value: '4 active' },
    ];
  }, [projects.length]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Project title is required');
      return;
    }

    try {
      await createProject(formData.title, formData.description);
      setFormData({ title: '', description: '' });
      setShowNewForm(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(id);
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <main className="screen-shell" style={styles.shell}>
      <aside className="glass-card" style={styles.sidebar}>
        <div style={styles.sidebarBrand}>
          <div style={styles.sidebarMark}><Sparkles size={16} /></div>
          <div>
            <div style={styles.sidebarTitle}>AI Video Ad Maker</div>
            <div style={styles.sidebarSub}>creator command center</div>
          </div>
        </div>

        <nav style={styles.sidebarNav}>
          {sidebarItems.map(({ label, icon: Icon }, index) => (
            <button key={label} style={{ ...styles.navItem, ...(index === 1 ? styles.navItemActive : {}) }}>
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <button onClick={logout} className="neutral-button" style={styles.logoutBtn}>
          <LogOut size={16} /> Logout
        </button>
      </aside>

      <section style={styles.workspace}>
        <header className="glass-card" style={styles.topbar}>
          <div>
            <p style={styles.kicker}>Creator workspace</p>
            <h1 style={styles.title}>Welcome, {user?.name || user?.email}</h1>
          </div>
          <button className="primary-button" onClick={() => navigate('/generator')} style={styles.topAction}>
            <Wand2 size={16} /> AI Generator
          </button>
        </header>

        <div style={styles.metricGrid}>
          {metrics.map((metric) => (
            <motion.div key={metric.label} whileHover={{ y: -4 }} className="glass-card" style={styles.metricCard}>
              <div style={styles.metricLabel}>{metric.label}</div>
              <div style={styles.metricValue}>{metric.value}</div>
            </motion.div>
          ))}
        </div>

        <div style={styles.workspaceGrid}>
          <div style={styles.leftColumn}>
            <div className="glass-card" style={styles.panel}>
              <div style={styles.panelHeader}>
                <div>
                  <p style={styles.kicker}>Projects</p>
                  <h2 style={styles.panelTitle}>Your creative pipeline</h2>
                </div>
                <button className="primary-button" onClick={() => setShowNewForm(true)} style={styles.newBtn}>+ New Project</button>
              </div>

              {error && <div style={styles.error}>{error}</div>}

              {showNewForm && (
                <div style={styles.inlineForm} onClick={(e) => e.stopPropagation()}>
                  <form onSubmit={handleCreateProject} style={styles.inlineFormInner}>
                    <input
                      className="field-input"
                      style={styles.inlineInput}
                      type="text"
                      placeholder="New project title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <div style={styles.inlineActions}>
                      <button type="submit" disabled={isLoading} className="primary-button" style={styles.inlineCreate}>Create</button>
                      <button type="button" onClick={() => { setShowNewForm(false); setFormData({ title: '', description: '' }); }} className="neutral-button" style={styles.inlineCancel}>Cancel</button>
                    </div>
                  </form>
                </div>
              )}

              {isLoading ? (
                <p style={styles.subtleText}>Loading projects...</p>
              ) : projects.length === 0 ? (
                <div style={styles.emptyState}>
                  <Film size={22} />
                  <p>No projects yet. Create one to start building ads.</p>
                </div>
              ) : (
                <div style={styles.projectGrid}>
                  {projects.map((project, index) => (
                    <motion.article key={project.id} whileHover={{ y: -6 }} className="glass-card" style={styles.projectCard}>
                      <div style={{ ...styles.thumbnail, background: `linear-gradient(135deg, rgba(124,58,237,0.8), rgba(0,212,255,0.45)), url('https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=900&q=80') center/cover` }}>
                        <span style={styles.platformTag}>{templates[index % templates.length]}</span>
                      </div>
                      <h3 style={styles.projectTitle}>{project.title}</h3>
                      {project.description && <p style={styles.projectText}>{project.description}</p>}
                      <div style={styles.progressWrap}>
                        <div style={styles.progressLabel}><span>Render progress</span><span>{project.status}</span></div>
                        <div style={styles.progressTrack}><div style={{ ...styles.progressFill, width: `${40 + ((index + 1) % 5) * 12}%` }} /></div>
                      </div>
                      <div style={styles.cardMeta}>
                        <span>{new Date(project.createdAt).toLocaleDateString()}</span>
                        <span>{(index + 1) * 12} sec</span>
                      </div>
                      <div style={styles.cardActions}>
                        <button onClick={() => { setCurrentProject(project); navigate(`/editor?id=${project.id}`); }} className="neutral-button" style={styles.cardBtn}>Edit</button>
                        <button onClick={() => { setCurrentProject(project); navigate(`/export?id=${project.id}`); }} className="primary-button" style={styles.cardBtn}>Export</button>
                        <button onClick={() => handleDelete(project.id)} className="neutral-button" style={styles.cardBtn}>Delete</button>
                      </div>
                    </motion.article>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={styles.rightColumn}>
            <div className="glass-card" style={styles.panel}>
              <p style={styles.kicker}>Trending</p>
              <h2 style={styles.panelTitle}>Templates and analytics</h2>
              <div style={styles.templateList}>
                {templates.map((template, index) => (
                  <div key={template} style={styles.templateRow}>
                    <span>{template}</span>
                    <strong>{92 - index * 4}%</strong>
                  </div>
                ))}
              </div>
              <div style={styles.trendCard}>
                <TrendingUp size={18} />
                <div>
                  <div style={styles.metricValueSmall}>+24%</div>
                  <p style={styles.subtleText}>Higher render completion this week</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

const styles = {
  shell: { display: 'grid', gridTemplateColumns: 'minmax(220px, 280px) 1fr', gap: 'var(--space-3)', alignItems: 'start' },
  sidebar: { position: 'sticky', top: '1.25rem', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', minHeight: 'calc(100vh - 2.5rem)' },
  sidebarBrand: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
  sidebarMark: { width: '2.5rem', height: '2.5rem', borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #7c3aed, #00d4ff)' },
  sidebarTitle: { fontWeight: 700 },
  sidebarSub: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  sidebarNav: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', flex: 1 },
  navItem: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)', padding: 'calc(var(--space-2) - 2px) var(--space-2)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'var(--text)', textAlign: 'left' },
  navItemActive: { background: 'rgba(124,58,237,0.16)', borderColor: 'rgba(124,58,237,0.3)', boxShadow: '0 0 28px rgba(124,58,237,0.14)' },
  logoutBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)', height: '3.25rem' },
  workspace: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  topbar: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'center', padding: 'var(--container-padding)' },
  kicker: { margin: 0, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem' },
  title: { margin: '0.5rem 0 0', fontSize: 'clamp(1.8rem, 3vw, 3rem)', letterSpacing: '-0.04em' },
  topAction: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-2)', padding: '0 calc(var(--space-2))' },
  metricGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, mcdinmax(0, 1fr))', gap: 'var(--space-2)' },
  metricCard: { padding: 'var(--space-2)', minHeight: '8.75rem' },
  metricLabel: { color: 'var(--text-secondary)', fontSize: '0.9rem' },
  metricValue: { marginTop: '0.6rem', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', fontWeight: 700 },
  metricValueSmall: { fontSize: '1.35rem', fontWeight: 700 },
  workspaceGrid: { display: 'grid', gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 0.8fr)', gap: 'var(--space-3)' },
  panel: { padding: 'var(--space-3)' },
  panelHeader: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'center', marginBottom: 'var(--space-2)', flexWrap: 'wrap' },
  panelTitle: { margin: '0.5rem 0 0', fontSize: '1.7rem' },
  newBtn: { padding: '0 calc(var(--space-2))' },
  error: { margin: '0.5rem 0 1rem', padding: 'calc(var(--space-2) - 2px)', borderRadius: '0.9rem', background: 'rgba(239,68,68,0.12)', color: '#fecaca', border: '1px solid rgba(239,68,68,0.22)' },
  formBox: { marginBottom: 'var(--space-3)', padding: 'var(--space-2)', borderRadius: '20px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' },
  form: { display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
  textarea: { minHeight: '5.25rem', resize: 'vertical' },
  formButtons: { display: 'flex', gap: 'var(--space-1)', flexWrap: 'wrap' },
  formBtn: { flex: '1 1 8.75rem' },
  modalOverlay: { position: 'fixed', inset: 0, display: 'grid', placeItems: 'center', background: 'rgba(0,0,0,0.35)', zIndex: 40 },
  modal: { width: 'min(560px, 92%)', padding: 'var(--space-2)', borderRadius: '12px', background: 'var(--surface)', boxShadow: '0 8px 30px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.04)' },
  minimalForm: { display: 'grid', gap: 'var(--space-2)' },
  minimalInput: { padding: '0.7rem calc(var(--space-2))', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent' },
  minimalTextarea: { padding: '0.7rem calc(var(--space-2))', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', minHeight: '5rem', resize: 'vertical' },
  minimalActions: { display: 'flex', gap: 'var(--space-1)', justifyContent: 'flex-end' },
  minimalCreate: { padding: '0.6rem calc(var(--space-2))' },
  minimalCancel: { padding: '0.6rem calc(var(--space-2))', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' },
  subtleText: { color: 'var(--text-secondary)' },
  inlineForm: { marginBottom: 'var(--space-3)', padding: 'var(--space-2)', borderRadius: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' },
  inlineFormInner: { display: 'flex', gap: 'var(--space-1)', alignItems: 'center' },
  inlineInput: { flex: '1 1 auto', padding: '0.6rem calc(var(--space-2))', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)', background: 'transparent' },
  inlineActions: { display: 'flex', gap: 'var(--space-1)' },
  inlineCreate: { padding: '0.5rem calc(var(--space-2))' },
  inlineCancel: { padding: '0.5rem calc(var(--space-2))', background: 'transparent', border: '1px solid rgba(255,255,255,0.06)' },
  emptyState: { minHeight: '15rem', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)', borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.1)' },
  projectGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(18rem, 1fr))', gap: 'var(--space-2)' },
  projectCard: { padding: 'var(--space-2)' },
  thumbnail: { height: '9.375rem', borderRadius: '18px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'start', justifyContent: 'end', padding: 'var(--space-2)' },
  platformTag: { padding: '0.5rem 0.6rem', borderRadius: '999px', background: 'rgba(2,6,23,0.62)', border: '1px solid rgba(255,255,255,0.08)', fontSize: '0.82rem' },
  projectTitle: { margin: '0.9rem 0 0.5rem' },
  projectText: { margin: 0, color: 'var(--text-secondary)', lineHeight: 1.7 },
  progressWrap: { marginTop: '0.9rem' },
  progressLabel: { display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '0.5rem' },
  progressTrack: { height: '0.625rem', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #7c3aed, #00d4ff)' },
  cardMeta: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', marginTop: '0.9rem', color: 'var(--text-secondary)', fontSize: '0.85rem' },
  cardActions: { display: 'flex', gap: 'var(--space-1)', marginTop: '0.9rem', flexWrap: 'wrap' },
  cardBtn: { flex: '1 1 5.25rem', height: '2.75rem' },
  rightColumn: { position: 'sticky', top: '1.25rem', alignSelf: 'start' },
  templateList: { display: 'grid', gap: 'var(--space-1)', marginTop: 'var(--space-3)' },
  templateRow: { display: 'flex', justifyContent: 'space-between', padding: '0.6rem calc(var(--space-2))', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' },
  trendCard: { display: 'flex', gap: 'var(--space-2)', alignItems: 'center', marginTop: 'var(--space-3)', padding: 'var(--space-2)', borderRadius: '18px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' },
};
