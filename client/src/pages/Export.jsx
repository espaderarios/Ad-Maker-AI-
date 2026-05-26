import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, CircleDashed, Download, MonitorPlay, Play, RefreshCcw } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { useProjectStore } from '../store/project.store.js';
import { useRender } from '../hooks/useRender.js';

export default function ExportPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = useAuthStore((state) => state.token);
  const { projects, currentProject, fetchProjects } = useProjectStore();
  const { startRender, isRendering, renderJob, error, progress, downloadUrl, refreshRenderStatus } = useRender();
  const [selectedProjectId, setSelectedProjectId] = useState(searchParams.get('id') || currentProject?.id || '');
  const [duration, setDuration] = useState(15);
  const [format, setFormat] = useState('mp4');
  const [resolution, setResolution] = useState('1080x1920');
  const [platform, setPlatform] = useState('tiktok');
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (projects.length === 0) {
      fetchProjects().catch(() => null);
    }
  }, [token, navigate, fetchProjects, projects.length]);

  const selectedProject = useMemo(
    () => projects.find((project) => project.id === selectedProjectId) || currentProject || null,
    [projects, selectedProjectId, currentProject]
  );

  const handleRender = async () => {
    setMessage('');

    if (!selectedProjectId) {
      setMessage('Select a project first.');
      return;
    }

    try {
      const response = await startRender(selectedProjectId, { duration, format, templateId: platform, resolution });
      setMessage(response.message || 'Render started.');
    } catch (renderError) {
      setMessage(renderError.message);
    }
  };

  const statusLabel = renderJob ? renderJob.status : 'idle';

  return (
    <main className="screen-shell" style={styles.shell}>
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55 }}
        className="glass-card"
        style={styles.card}
      >
        <div style={styles.headerRow}>
          <div>
            <p style={styles.kicker}>Minimal render flow</p>
            <h1 style={styles.title}>Export Video</h1>
          </div>
          <button className="neutral-button" onClick={() => navigate('/dashboard')} style={styles.backBtn}>← Back</button>
        </div>

        <div style={styles.previewWrap}>
          <div style={styles.videoPreview} className="glass-card">
            <div style={styles.previewBadge}><MonitorPlay size={14} /> Video preview</div>
            <div style={styles.previewPoster}>
              <div style={styles.playCircle}><Play size={24} /></div>
              <div>
                <h2 style={styles.previewTitle}>{selectedProject?.title || 'Select a project to preview'}</h2>
                <p style={styles.previewText}>{selectedProject?.description || 'A centered render card keeps export focused and distraction-free.'}</p>
              </div>
            </div>
          </div>

          <div className="glass-card" style={styles.settingsCard}>
            <div style={styles.settingsGrid}>
              <label style={styles.field}>
                <span>Project</span>
                <select className="field-input" value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)}>
                  <option value="">Select a project</option>
                  {projects.map((project) => (
                    <option key={project.id} value={project.id}>{project.title}</option>
                  ))}
                </select>
              </label>
              <label style={styles.field}>
                <span>Platform</span>
                <select className="field-input" value={platform} onChange={(e) => setPlatform(e.target.value)}>
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="youtube">YouTube Shorts</option>
                </select>
              </label>
              <label style={styles.field}>
                <span>Duration</span>
                <input className="field-input" type="number" min="1" max="60" value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              </label>
              <label style={styles.field}>
                <span>Resolution</span>
                <select className="field-input" value={resolution} onChange={(e) => setResolution(e.target.value)}>
                  <option value="1080x1920">1080 x 1920</option>
                  <option value="1920x1080">1920 x 1080</option>
                </select>
              </label>
              <label style={styles.field}>
                <span>Format</span>
                <select className="field-input" value={format} onChange={(e) => setFormat(e.target.value)}>
                  <option value="mp4">MP4</option>
                </select>
              </label>
            </div>

            <div style={styles.actions}>
              <button onClick={handleRender} disabled={isRendering || !selectedProjectId} className="primary-button" style={styles.primaryBtn}>
                {isRendering ? 'Rendering...' : 'Render Video'}
              </button>
              <button onClick={() => refreshRenderStatus().catch(() => null)} disabled={!renderJob?.id} className="neutral-button" style={styles.secondaryBtn}>
                <RefreshCcw size={16} /> Refresh Status
              </button>
            </div>
          </div>
        </div>

        <div style={styles.progressPanel} className="glass-card">
          <div style={styles.statusHeader}>
            <div>
              <p style={styles.kicker}>Render progress</p>
              <h2 style={styles.sectionTitle}>Status: {statusLabel}</h2>
            </div>
            <div style={styles.statusIcon}>
              {renderJob?.status === 'completed' ? <CheckCircle2 size={18} /> : <CircleDashed size={18} />}
            </div>
          </div>

          <div style={styles.progressTrack}>
            <div style={{ ...styles.progressFill, width: `${progress}%` }} />
          </div>

          <div style={styles.statusGrid}>
            <div style={styles.statusRow}><span>Project</span><strong>{selectedProject?.title || 'None selected'}</strong></div>
            <div style={styles.statusRow}><span>Platform</span><strong>{platform}</strong></div>
            <div style={styles.statusRow}><span>Resolution</span><strong>{resolution}</strong></div>
            <div style={styles.statusRow}><span>Format</span><strong>{format}</strong></div>
          </div>

          {message && <div style={styles.message}>{message}</div>}
          {error && <div style={styles.error}>{error}</div>}

          {renderJob?.outputUrl && (
            <a href={downloadUrl} target="_blank" rel="noreferrer" style={styles.downloadLink}>
              <Download size={16} /> Open rendered video
            </a>
          )}
        </div>
      </motion.section>
    </main>
  );
}

const styles = {
  shell: { display: 'grid', placeItems: 'center' },
  card: { width: 'min(62rem, 100%)', padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', flexWrap: 'wrap' },
  kicker: { margin: 0, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem' },
  title: { margin: '8px 0 0', fontSize: 'clamp(1.8rem, 3vw, 3rem)', letterSpacing: '-0.04em' },
  backBtn: { height: '3rem', padding: '0 1rem' },
  previewWrap: { display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 'var(--space-3)' },
  videoPreview: { padding: 'var(--space-2)', minHeight: '20rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' },
  previewBadge: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.4rem 0.6rem', borderRadius: '999px', background: 'var(--surface-muted)', color: 'var(--text-secondary)', width: 'fit-content' },
  previewPoster: { display: 'flex', alignItems: 'end', gap: 'var(--space-2)', minHeight: '12.5rem', background: 'var(--surface)', borderRadius: '1.375rem', padding: 'var(--space-2)' },
  playCircle: { width: '3.375rem', height: '3.375rem', borderRadius: '999px', display: 'grid', placeItems: 'center', background: 'var(--primary)' },
  previewTitle: { margin: 0, fontSize: '1.6rem' },
  previewText: { margin: '0.5rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.7 },
  settingsCard: { padding: 'var(--space-2)' },
  settingsGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-2)' },
  field: { display: 'flex', flexDirection: 'column', gap: '8px', color: 'var(--text-secondary)' },
  actions: { display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)', flexWrap: 'wrap' },
  primaryBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 1rem' },
  secondaryBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0 1rem', height: '3.25rem' },
  progressPanel: { padding: 'var(--space-2)' },
  statusHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' },
  sectionTitle: { margin: '8px 0 0', fontSize: '1.6rem' },
  statusIcon: { width: '2.6rem', height: '2.6rem', borderRadius: '14px', display: 'grid', placeItems: 'center', background: 'var(--surface-muted)' },
  progressTrack: { marginTop: 'var(--space-2)', height: '0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'var(--accent)', borderRadius: '999px' },
  statusGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-2)' },
  statusRow: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', color: 'var(--text-secondary)' },
  message: { marginTop: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: '14px', background: 'rgba(34,197,94,0.06)', color: 'var(--text)', border: '1px solid rgba(34,197,94,0.1)' },
  error: { marginTop: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: '14px', background: 'rgba(239,68,68,0.06)', color: 'var(--text)', border: '1px solid rgba(239,68,68,0.08)' },
  downloadLink: { display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginTop: 'var(--space-2)', color: 'var(--text-secondary)' },
};
