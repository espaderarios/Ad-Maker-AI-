import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, AudioLines, Film, Play, Settings2, SlidersHorizontal, Layers3, Captions, SquareMousePointer, Scissors, Upload, LoaderCircle, Copy } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { useProjectStore } from '../store/project.store.js';
import { uploadToCloudinary } from '../api/cloudinary.api.js';

const timelineColors = [
  { label: 'Video', color: '#7c3aed' },
  { label: 'Audio', color: '#38bdf8' },
  { label: 'Subtitles', color: '#22c55e' },
  { label: 'Effects', color: '#f59e0b' },
];

export default function Editor() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { token } = useAuthStore();
  const { projects, currentProject, fetchProjects, setCurrentProject } = useProjectStore();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  const [uploadedAssets, setUploadedAssets] = useState([]);
  const projectId = searchParams.get('id');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    if (projects.length === 0) {
      fetchProjects().catch(() => null);
    }

    setIsLoading(false);
  }, [token, navigate, fetchProjects, projects.length]);

  useEffect(() => {
    const project = projects.find((item) => item.id === projectId);
    if (project) {
      setCurrentProject(project);
    }
  }, [projectId, projects, setCurrentProject]);

  const activeProject = useMemo(() => projects.find((item) => item.id === projectId) || currentProject, [projects, projectId, currentProject]);

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Choose a file first');
      return;
    }

    setUploadError('');
    setUploadSuccess('');
    setIsUploading(true);

    try {
      const result = await uploadToCloudinary(selectedFile);
      setUploadedAssets((current) => [
        {
          id: result.asset_id || result.public_id,
          name: result.original_filename || selectedFile.name,
          url: result.secure_url,
          type: result.resource_type,
        },
        ...current,
      ]);
      setUploadSuccess('Uploaded to Cloudinary');
      setSelectedFile(null);
    } catch (error) {
      setUploadError(error.message);
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <main style={styles.loading}>Loading editor...</main>;

  return (
    <main className="screen-shell" style={styles.shell}>
      <header className="glass-card" style={styles.toolbar}>
        <div style={styles.toolbarLeft}>
          <button className="neutral-button" onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            <ArrowLeft size={16} /> Back
          </button>
          <div>
            <p style={styles.kicker}>Professional timeline interface</p>
            <h1 style={styles.title}>{activeProject?.title || 'Project Editor'}</h1>
          </div>
        </div>
        <div style={styles.toolbarActions}>
          <button className="neutral-button" style={styles.toolbarBtn}><Settings2 size={16} /> Preferences</button>
          <button className="primary-button" style={styles.toolbarBtn}><Play size={16} /> Preview</button>
        </div>
      </header>

      <section style={styles.workspace}>
        <aside className="glass-card" style={styles.assetsPanel}>
          <p style={styles.panelKicker}>Assets</p>
          <div style={styles.uploadBox}>
            <div style={styles.uploadTopRow}>
              <div>
                <strong>Cloudinary upload</strong>
                <p style={styles.uploadHint}>Pick an image or video and send it to your asset library.</p>
              </div>
              <Upload size={16} />
            </div>

            <input
              type="file"
              accept="image/*,video/*"
              onChange={(event) => {
                setSelectedFile(event.target.files?.[0] || null);
                setUploadError('');
                setUploadSuccess('');
              }}
              style={styles.fileInput}
            />

            {selectedFile && <div style={styles.fileName}>{selectedFile.name}</div>}

            <button type="button" className="primary-button" onClick={handleUpload} disabled={isUploading} style={styles.uploadBtn}>
              {isUploading ? <><LoaderCircle size={16} /> Uploading...</> : 'Upload asset'}
            </button>

            {uploadError && <div style={styles.uploadError}>{uploadError}</div>}
            {uploadSuccess && <div style={styles.uploadSuccess}>{uploadSuccess}</div>}
          </div>

          <div style={styles.assetList}>
            {['B-roll', 'Music', 'Voiceover', 'Captions'].map((item, index) => (
              <div key={item} style={styles.assetItem}>
                <div style={styles.assetIcon}><Layers3 size={16} /></div>
                <div>
                  <strong>{item}</strong>
                  <p>{index === 0 ? 'Video clips' : index === 1 ? 'Background track' : index === 2 ? 'AI narration' : 'Subtitle tracks'}</p>
                </div>
              </div>
            ))}
          </div>

          {uploadedAssets.length > 0 && (
            <div style={styles.uploadedList}>
              <p style={styles.uploadedTitle}>Recent uploads</p>
              {uploadedAssets.map((asset) => (
                <div key={asset.id} style={styles.uploadedItem}>
                  <div>
                    <strong>{asset.name}</strong>
                    <p style={styles.uploadedMeta}>{asset.type}</p>
                  </div>
                  <button
                    type="button"
                    className="neutral-button"
                    style={styles.copyBtn}
                    onClick={() => navigator.clipboard.writeText(asset.url)}
                    title="Copy URL"
                  >
                    <Copy size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </aside>

        <div style={styles.centerPanel}>
          <motion.div className="glass-card" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={styles.previewWindow}>
            <div style={styles.previewHeader}>
              <span style={styles.livePill}>Live preview</span>
              <div style={styles.previewControls}>
                <button className="neutral-button" style={styles.iconBtn}><SquareMousePointer size={16} /></button>
                <button className="neutral-button" style={styles.iconBtn}><Scissors size={16} /></button>
                <button className="neutral-button" style={styles.iconBtn}><SlidersHorizontal size={16} /></button>
              </div>
            </div>
            <div style={styles.videoFrame}>
              <div style={styles.posterGlow} />
              <div style={styles.posterOverlay}>
                <div style={styles.posterBadge}>Subtitles locked • 15s cut</div>
                <h2 style={styles.posterTitle}>Cinematic launch preview</h2>
                <p style={styles.posterText}>Rounded frame, soft glow accents, and a crisp CTA block for the final export.</p>
              </div>
            </div>
          </motion.div>

          <div className="glass-card" style={styles.timelinePanel}>
            <div style={styles.timelineHeader}>
              <div>
                <p style={styles.panelKicker}>Timeline</p>
                <h2 style={styles.sectionTitle}>Draggable scene sequence</h2>
              </div>
              <div style={styles.zoomGroup}>
                <button className="neutral-button" style={styles.zoomBtn}>-</button>
                <button className="neutral-button" style={styles.zoomBtn}>100%</button>
                <button className="neutral-button" style={styles.zoomBtn}>+</button>
              </div>
            </div>

            <div style={styles.timelineTracks}>
              {timelineColors.map((track, index) => (
                <div key={track.label} style={styles.trackRow}>
                  <div style={styles.trackLabel}>
                    {index === 0 && <Film size={14} />}
                    {index === 1 && <AudioLines size={14} />}
                    {index === 2 && <Captions size={14} />}
                    {index === 3 && <Settings2 size={14} />}
                    {track.label}
                  </div>
                  <div style={styles.trackLane}>
                    <div style={{ ...styles.trackClip, background: track.color, width: `${72 - index * 8}%` }} />
                    <div style={{ ...styles.trackClip, background: `${track.color}88`, width: `${40 + index * 10}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="glass-card" style={styles.propertiesPanel}>
          <p style={styles.panelKicker}>Properties</p>
          <div style={styles.propertiesGrid}>
            <div style={styles.propertyCard}>
              <strong>Duration</strong>
              <span>15 sec</span>
            </div>
            <div style={styles.propertyCard}>
              <strong>Aspect</strong>
              <span>9:16</span>
            </div>
            <div style={styles.propertyCard}>
              <strong>Voice</strong>
              <span>Warm cinematic</span>
            </div>
            <div style={styles.propertyCard}>
              <strong>Status</strong>
              <span>Ready to export</span>
            </div>
          </div>

          <div style={styles.noteCard}>
            <p style={styles.panelKicker}>Current project</p>
            <h3 style={styles.noteTitle}>{activeProject?.title || 'No project loaded'}</h3>
            <p style={styles.noteText}>{activeProject?.description || 'Select a project from the dashboard to load editable scenes and assets.'}</p>
          </div>
        </aside>
      </section>
    </main>
  );
}

const styles = {
  shell: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  loading: { minHeight: '100vh', display: 'grid', placeItems: 'center', color: 'var(--text-secondary)' },
  toolbar: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'center', padding: 'var(--container-padding)', flexWrap: 'wrap' },
  toolbarLeft: { display: 'flex', alignItems: 'center', gap: 'var(--space-2)' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', height: '2.75rem', padding: '0 var(--space-2)' },
  kicker: { margin: 0, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem' },
  title: { margin: '0.5rem 0 0', fontSize: 'clamp(1.8rem, 3vw, 3rem)', letterSpacing: '-0.04em' },
  toolbarActions: { display: 'flex', gap: 'var(--space-2)', flexWrap: 'wrap' },
  toolbarBtn: { display: 'inline-flex', alignItems: 'center', gap: 'var(--space-1)', height: '2.75rem', padding: '0 var(--space-2)' },
  workspace: { display: 'grid', gridTemplateColumns: 'minmax(18rem, 1fr) minmax(0, 2fr) minmax(18rem, 1fr)', gap: 'var(--space-3)', alignItems: 'start' },
  assetsPanel: { padding: 'var(--space-3)', position: 'sticky', top: '1.25rem' },
  panelKicker: { margin: 0, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem' },
  uploadBox: { marginTop: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' },
  uploadTopRow: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'start' },
  uploadHint: { margin: '0.35rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.5, fontSize: '0.9rem' },
  fileInput: { width: '100%', marginTop: 'var(--space-2)', color: 'var(--text-secondary)' },
  fileName: { marginTop: 'var(--space-2)', padding: '0.6rem calc(var(--space-2))', borderRadius: '12px', background: 'rgba(255,255,255,0.04)', fontSize: '0.9rem' },
  uploadBtn: { width: '100%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-1)', marginTop: 'var(--space-2)' },
  uploadError: { marginTop: 'var(--space-2)', color: '#fecaca', fontSize: '0.9rem' },
  uploadSuccess: { marginTop: 'var(--space-2)', color: '#bbf7d0', fontSize: '0.9rem' },
  assetList: { display: 'grid', gap: 'var(--space-2)', marginTop: 'var(--space-2)' },
  assetItem: { display: 'flex', gap: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' },
  assetIcon: { width: '2.25rem', height: '2.25rem', borderRadius: '12px', display: 'grid', placeItems: 'center', background: 'rgba(124,58,237,0.14)', flexShrink: 0 },
  uploadedList: { marginTop: 'var(--space-2)', display: 'grid', gap: 'var(--space-1)' },
  uploadedTitle: { margin: 0, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.14em', fontSize: '0.72rem' },
  uploadedItem: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', padding: '0.6rem calc(var(--space-2))', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' },
  uploadedMeta: { margin: '0.35rem 0 0', color: 'var(--text-secondary)', fontSize: '0.85rem' },
  copyBtn: { width: '2.5rem', height: '2.5rem', padding: 0 },
  centerPanel: { display: 'grid', gap: 'var(--space-3)' },
  previewWindow: { padding: 'var(--space-2)' },
  previewHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-2)', flexWrap: 'wrap' },
  livePill: { padding: '0.5rem calc(var(--space-2))', borderRadius: '999px', background: 'rgba(0,212,255,0.12)', color: '#b2f5ff', fontSize: '0.84rem' },
  previewControls: { display: 'flex', gap: 'var(--space-1)' },
  iconBtn: { width: '2.6rem', height: '2.6rem', padding: 0 },
  videoFrame: { position: 'relative', minHeight: '26rem', borderRadius: '1.625rem', overflow: 'hidden', background: 'radial-gradient(circle at top, rgba(124,58,237,0.35), rgba(2,6,23,0.9) 58%)' },
  posterGlow: { position: 'absolute', inset: '14% 18%', borderRadius: '999px', background: 'radial-gradient(circle, rgba(0,212,255,0.32), transparent 68%)', filter: 'blur(28px)' },
  posterOverlay: { position: 'absolute', inset: 'auto 1.6rem 1.6rem 1.6rem' },
  posterBadge: { display: 'inline-flex', padding: '0.5rem calc(var(--space-2))', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', marginBottom: '0.9rem' },
  posterTitle: { margin: 0, fontSize: 'clamp(2rem, 4vw, 3.6rem)', letterSpacing: '-0.05em' },
  posterText: { maxWidth: '55ch', color: 'var(--text-secondary)', lineHeight: 1.8 },
  timelinePanel: { padding: 'var(--space-2)' },
  timelineHeader: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-2)' },
  sectionTitle: { margin: '0.5rem 0 0', fontSize: '1.6rem' },
  zoomGroup: { display: 'flex', gap: 'var(--space-1)' },
  zoomBtn: { height: '2.5rem', minWidth: '3rem' },
  timelineTracks: { display: 'grid', gap: 'var(--space-2)' },
  trackRow: { display: 'grid', gridTemplateColumns: '8rem 1fr', gap: 'var(--space-2)', alignItems: 'center' },
  trackLabel: { display: 'flex', alignItems: 'center', gap: 'var(--space-1)', color: 'var(--text-secondary)' },
  trackLane: { display: 'flex', gap: 'var(--space-2)', alignItems: 'center', minHeight: '2.125rem', padding: 'var(--space-1)', borderRadius: '16px', background: 'rgba(255,255,255,0.04)' },
  trackClip: { height: '1.125rem', borderRadius: '999px', boxShadow: '0 0 22px rgba(255,255,255,0.08)' },
  propertiesPanel: { padding: 'var(--space-3)', position: 'sticky', top: '1.25rem' },
  propertiesGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-2)', marginTop: 'var(--space-2)' },
  propertyCard: { padding: 'var(--space-2)', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.4rem' },
  noteCard: { marginTop: 'var(--space-2)', padding: 'var(--space-2)', borderRadius: '18px', background: 'rgba(124,58,237,0.12)', border: '1px solid rgba(124,58,237,0.2)' },
  noteTitle: { margin: '0.5rem 0 0' },
  noteText: { margin: '0.5rem 0 0', color: 'var(--text-secondary)', lineHeight: 1.7 },
};
