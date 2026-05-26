import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, TimerReset, Wand2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';
import { generatePrompt } from '../api/groq.api.js';
import { generateWithWorker } from '../api/worker.api.js';

const typingDots = ['.', '..', '...'];

export default function Generator() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [formData, setFormData] = useState({ topic: '', style: 'engaging', targetAudience: 'general', duration: '15', tone: 'cinematic' });
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [dotIndex, setDotIndex] = useState(0);

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!isLoading) {
      return undefined;
    }
    const interval = setInterval(() => setDotIndex((value) => (value + 1) % typingDots.length), 450);
    return () => clearInterval(interval);
  }, [isLoading]);

  const outputText = useMemo(() => {
    if (!result) return '';
    if (typeof result.adCopy === 'string' && result.adCopy.trim()) return result.adCopy;
    if (Array.isArray(result.output)) return result.output.map((item) => (typeof item === 'string' ? item : JSON.stringify(item))).join('\n');
    if (typeof result.output === 'string') return result.output;
    if (result.status) return `${result.status}${result.error ? `: ${result.error}` : ''}`;
    return JSON.stringify(result, null, 2);
  }, [result]);

  const sceneCards = useMemo(() => {
    if (!outputText) return [];
    return outputText.split('.').filter(Boolean).slice(0, 4);
  }, [outputText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);

    if (!formData.topic.trim()) {
      setError('Topic is required');
      return;
    }

    setIsLoading(true);
    try {
      const data = await generatePrompt(formData.topic, formData.style, formData.targetAudience);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWorkerSubmit = async () => {
    setError('');
    setResult(null);

    if (!formData.topic.trim()) {
      setError('Topic is required');
      return;
    }

    setIsLoading(true);
    try {
      const data = await generateWithWorker(formData);
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="screen-shell" style={styles.shell}>
      <motion.header className="glass-card" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={styles.header}>
        <div>
          <p style={styles.kicker}>AI interaction focus</p>
          <h1 style={styles.title}>Generating viral hooks...</h1>
        </div>
        <button className="neutral-button" onClick={() => navigate('/dashboard')} style={styles.backBtn}>
          ← Back to Dashboard
        </button>
      </motion.header>

      <section style={styles.grid}>
        <motion.form initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55 }} onSubmit={handleSubmit} className="glass-card" style={styles.form}>
          <div style={styles.sectionHeader}>
            <p style={styles.kicker}>Prompt panel</p>
            <h2 style={styles.sectionTitle}>Tell the model what to create.</h2>
          </div>

          <label style={styles.field}>
            <span>Product / Topic</span>
            <input className="field-input" type="text" placeholder="e.g. premium coffee shop, fitness app, AI tool" value={formData.topic} onChange={(e) => setFormData({ ...formData, topic: e.target.value })} />
          </label>

          <div style={styles.twoCol}>
            <label style={styles.field}>
              <span>Style</span>
              <select className="field-input" value={formData.style} onChange={(e) => setFormData({ ...formData, style: e.target.value })}>
                <option value="engaging">Engaging & Fun</option>
                <option value="professional">Professional</option>
                <option value="casual">Casual & Friendly</option>
                <option value="luxurious">Luxurious & Premium</option>
                <option value="urgent">Urgent & Action-Oriented</option>
              </select>
            </label>

            <label style={styles.field}>
              <span>Duration</span>
              <select className="field-input" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}>
                <option value="15">15 sec</option>
                <option value="30">30 sec</option>
                <option value="45">45 sec</option>
              </select>
            </label>
          </div>

          <label style={styles.field}>
            <span>Target audience</span>
            <input className="field-input" type="text" placeholder="e.g. creators, founders, families" value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} />
          </label>

          <label style={styles.field}>
            <span>Tone</span>
            <select className="field-input" value={formData.tone} onChange={(e) => setFormData({ ...formData, tone: e.target.value })}>
              <option value="cinematic">Cinematic</option>
              <option value="bold">Bold</option>
              <option value="playful">Playful</option>
              <option value="minimal">Minimal</option>
            </select>
          </label>

          <button type="submit" disabled={isLoading} className="primary-button" style={styles.generateBtn}>
            {isLoading ? `Generating viral hooks${typingDots[dotIndex]}` : 'Generate Ad Copy'} <Wand2 size={18} />
          </button>

          <button type="button" disabled={isLoading} onClick={handleWorkerSubmit} className="neutral-button" style={{ ...styles.generateBtn, marginTop: '8px' }}>
            {isLoading ? `Processing${typingDots[dotIndex]}` : 'Generate via Worker'}
          </button>

          {error && <div style={styles.error}>{error}</div>}
        </motion.form>

        <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.08 }} className="glass-card" style={styles.preview}>
          <div style={styles.sectionHeader}>
            <p style={styles.kicker}>Preview panel</p>
            <h2 style={styles.sectionTitle}>Live generated output</h2>
          </div>

          {!result ? (
            <div style={styles.emptyPreview}>
              <Sparkles size={22} />
              <p>Enter a topic and let the model draft hooks, scenes, and captions.</p>
            </div>
          ) : (
            <>
              <div style={styles.adCopyBox}>
                <div style={styles.adCopyLabel}>Generated output</div>
                <p style={styles.adCopy}>{outputText}</p>
              </div>

              <div style={styles.sceneGrid}>
                {sceneCards.map((scene, index) => (
                  <motion.div key={scene} whileHover={{ y: -4 }} className="glass-card" style={styles.sceneCard}>
                    <span style={styles.sceneIndex}>Scene {index + 1}</span>
                    <p style={styles.sceneText}>{scene.trim()}.</p>
                  </motion.div>
                ))}
              </div>

              <div style={styles.promptInfo}>
                <div style={styles.promptInfoHeader}>
                  <TimerReset size={16} />
                  Prompt or status
                </div>
                <p style={styles.promptText}>{result.prompt || result.status || 'Worker response received'}</p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(outputText || JSON.stringify(result, null, 2));
                  alert('Copied to clipboard!');
                }}
                className="neutral-button"
                style={styles.copyBtn}
              >
                Copy to Clipboard <ArrowRight size={16} />
              </button>
            </>
          )}
        </motion.div>
      </section>
    </main>
  );
}

const styles = {
  shell: { display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' },
  header: { display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)', alignItems: 'center', padding: 'var(--container-padding)', flexWrap: 'wrap' },
  kicker: { margin: 0, color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.18em', fontSize: '0.72rem' },
  title: { margin: '0.5rem 0 0', fontSize: 'clamp(1.8rem, 3vw, 3rem)', letterSpacing: '-0.04em' },
  backBtn: { height: '3rem', padding: '0 var(--space-2)' },
  grid: { display: 'grid', gridTemplateColumns: 'minmax(20rem, 0.92fr) minmax(0, 1.08fr)', gap: 'var(--space-3)' },
  form: { padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
  preview: { padding: 'var(--space-3)', display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' },
  sectionHeader: { marginBottom: '0.35rem' },
  sectionTitle: { margin: '0.5rem 0 0', fontSize: '1.6rem' },
  field: { display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', color: 'var(--text-secondary)' },
  twoCol: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-2)' },
  generateBtn: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', width: '100%', marginTop: 'var(--space-1)' },
  error: { padding: 'calc(var(--space-2) - 2px)', borderRadius: '0.9rem', background: 'rgba(239,68,68,0.12)', color: '#fecaca', border: '1px solid rgba(239,68,68,0.22)' },
  emptyPreview: { minHeight: '26rem', display: 'grid', placeItems: 'center', textAlign: 'center', color: 'var(--text-secondary)', borderRadius: '18px', border: '1px dashed rgba(255,255,255,0.08)' },
  adCopyBox: { padding: 'var(--space-2)', borderRadius: '18px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' },
  adCopyLabel: { color: '#93c5fd', fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.16em', marginBottom: '0.6rem' },
  adCopy: { margin: 0, fontSize: '1.1rem', lineHeight: 1.8, color: '#e5e7eb' },
  sceneGrid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 'var(--space-2)' },
  sceneCard: { padding: 'var(--space-2)' },
  sceneIndex: { color: '#93c5fd', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.16em' },
  sceneText: { margin: '0.6rem 0 0', lineHeight: 1.7 },
  promptInfo: { padding: 'var(--space-2)', borderRadius: '18px', background: 'rgba(0,212,255,0.08)', border: '1px solid rgba(0,212,255,0.16)' },
  promptInfoHeader: { display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#b2f5ff', marginBottom: '0.5rem' },
  promptText: { margin: 0, color: '#c7d2fe', whiteSpace: 'pre-wrap', lineHeight: 1.7 },
  copyBtn: { width: '100%', height: '3.25rem', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem' },
};