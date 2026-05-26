import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import previewFrameGif from '../assets/gifs/PreviewFrame.gif';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth.store.js';

export default function Login() {
  const navigate = useNavigate();
  const { login, signup, isLoading, error, token } = useAuthStore();
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '', name: '' });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError('');

    try {
      if (isSignup) {
        await signup(formData.email, formData.password, formData.name);
      } else {
        await login(formData.email, formData.password);
      }

      navigate('/dashboard');
    } catch (submitError) {
      setFormError(submitError.message || 'Authentication failed');
    }
  };

  return (
    <main style={styles.page}>
      <div style={styles.bgPattern} />

      <section style={styles.loginCard}>
        <div style={styles.leftPanel}>
          <nav style={styles.navbar}>
            <h1 style={styles.logo}>Build your own ad</h1>
            <span style={styles.navLogin}>{isSignup ? 'SIGN UP' : 'LOG IN'}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.08 }}
            style={styles.heroPreviewWrap}
          >
            <div style={styles.previewGlow} />
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

          <div style={styles.ring1} />
          <div style={styles.ring2} />
          <div style={styles.ring3} />
          <div style={styles.welcomeWrap}>
            <h2 style={styles.welcome1}>{isSignup ? 'Create your account!' : 'Welcome to'}</h2>
            <h2 style={styles.welcome2}>{isSignup ? 'Create your account!' : 'AI Video Ad Maker'}</h2>
          </div>
        </div>

        <section style={styles.rightPanel}>
          <div style={styles.formContainer}>
            <h1 style={styles.title}>{isSignup ? 'Sign up' : 'Log in'}</h1>

            {(formError || error) && <div style={styles.errorBox}>{formError || error}</div>}

            <form onSubmit={handleSubmit} style={styles.form}>
              {isSignup && (
                <input
                  className="input"
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  style={styles.input}
                />
              )}

              <input
                className="input"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <input
                className="input"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />

              <div style={styles.options}>
                <label style={styles.remember}>
                  <input type="checkbox" />
                  Remember Me
                </label>
                <span style={styles.forgot}>Forgot Password?</span>
              </div>

              <button type="submit" disabled={isLoading} style={styles.loginBtn}>
                {isLoading ? 'Loading...' : isSignup ? 'Sign up' : 'Log in'}
              </button>

              <div style={styles.divider}>Or</div>

              <button
                type="button"
                onClick={() => {
                  setIsSignup((current) => !current);
                  setFormError('');
                  setFormData({ email: '', password: '', name: '' });
                }}
                style={styles.signupBtn}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </button>
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}

const styles = {
  page: {
    position: 'relative',
    width: '100%',
    minHeight: '100vh',
    overflow: 'hidden',
    background: '#e9e9e9',
    fontFamily: "'Inter', sans-serif",
  },
  bgPattern: {
    position: 'absolute',
    inset: 0,
    backgroundImage: `
      linear-gradient(135deg, rgba(255,255,255,0.35) 25%, transparent 25%),
      linear-gradient(225deg, rgba(255,255,255,0.35) 25%, transparent 25%),
      linear-gradient(315deg, rgba(255,255,255,0.35) 25%, transparent 25%),
      linear-gradient(45deg, rgba(255,255,255,0.35) 25%, transparent 25%)
    `,
    backgroundSize: '120px 120px',
    opacity: 0.25,
    pointerEvents: 'none',
  },
  loginCard: {
    position: 'relative',
    zIndex: 5,
    width: '100vw',
    minHeight: '100vh',
    display: 'flex',
    overflow: 'hidden',
    background: '#ffffff',
  },
  leftPanel: {
    flex: 1.2,
    position: 'relative',
    overflow: 'hidden',
    color: '#ffffff',
    padding: 'calc(var(--space-4) * 2) calc(var(--space-4) * 2)',
    background: `radial-gradient(circle at top left, rgba(255,255,255,0.06), transparent 30%), linear-gradient(135deg, #050505, #0f0f0f)`,
  },
  navbar: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
    zIndex: 10,
  },
  logo: {
    fontSize: '2.75rem',
    fontWeight: 900,
    letterSpacing: '-0.06em',
    margin: 0,
  },
  navLogin: {
    fontSize: '0.875rem',
    fontWeight: 700,
    letterSpacing: '0.18em',
    borderBottom: '2px solid white',
    paddingBottom: '0.5rem',
  },
  welcome1: {
    fontSize: 'clamp(2rem, 4vw, 3.8rem)',
    lineHeight: 0.95,
    textAlign: 'left',
    margin: '0 0 6px 0',
  },
  welcome2: {
    fontSize: 'clamp(2rem, 4vw, 3.8rem)',
    lineHeight: 0.95,
    fontWeight: 900,
    textAlign: 'left',
    margin: 0,
  },
  welcomeWrap: {
    position: 'absolute',
    left: 'calc(var(--space-4) * 2)',
    bottom: 'calc(var(--space-4) * 2)',
    zIndex: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  rightPanel: {
    width: 'min(42%, 520px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'calc(var(--space-4) * 2)',
    background: '#181c23',
  },
  formContainer: {
    width: '100%',
    maxWidth: '28rem',
  },
  title: {
    fontSize: 'clamp(1.8rem, 4vw, 3rem)',
    fontWeight: 900,
    letterSpacing: '-0.06em',
    margin: '0 0 calc(var(--space-3))',
    color: '#fbfbfb',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--space-2)',
  },
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: '#46484b',
    padding: 'calc(var(--space-2)) calc(var(--space-3))',
    borderRadius: '999px',
    fontSize: '1rem',
    fontWeight: 500,
    transition: '0.3s ease',
    color: '#111111',
  },
  options: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: '-4px',
    marginBottom: '6px',
    fontSize: '14px',
    color: '#666666',
  },
  remember: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  forgot: {
    cursor: 'pointer',
    transition: '0.2s ease',
  },
  loginBtn: {
    width: '100%',
    border: 'none',
    borderRadius: '999px',
    padding: 'calc(var(--space-2))',
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#0c0c0c',
    color: '#fbfbfb',
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
  },
  signupBtn: {
    width: '100%',
    border: 'none',
    borderRadius: '999px',
    padding: 'calc(var(--space-2))',
    fontSize: '1.05rem',
    fontWeight: 700,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: '#46484b',
    color: '#fbfbfb',
  },
  divider: {
    position: 'relative',
    textAlign: 'center',
    color: '#888888',
    margin: '8px 0',
  },
  errorBox: {
    marginBottom: '14px',
    padding: '12px 14px',
    borderRadius: '14px',
    background: '#fff6f6',
    color: '#7a1f1f',
    border: '1px solid rgba(122,31,31,0.15)',
    fontSize: '0.92rem',
  },
  ring1: {
    position: 'absolute',
    borderRadius: '50%',
    border: '1.125rem solid rgba(207,214,223,0.9)',
    zIndex: 1,
    width: '22.5rem',
    height: '22.5rem',
    top: '8rem',
    left: '-8.75rem',
  },
  ring2: {
    position: 'absolute',
    borderRadius: '50%',
    border: '1.125rem solid rgba(207,214,223,0.9)',
    zIndex: 1,
    width: '32.5rem',
    height: '32.5rem',
    top: '1.25rem',
    right: '-13.75rem',
  },
  ring3: {
    position: 'absolute',
    borderRadius: '50%',
    border: '1.125rem solid rgba(207,214,223,0.9)',
    zIndex: 1,
    width: '22.5rem',
    height: '22.5rem',
    bottom: '-10rem',
    right: '6.875rem',
  },
  heroPreviewWrap: {
    position: 'relative',
    zIndex: 2,
    width: '100%',
    margin: '2.5rem auto 0',
    maxWidth: '28.75rem',
    display: 'flex',
    justifyContent: 'center',
  },
  previewGlow: {
    position: 'absolute',
    inset: '14% 12%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.08) 36%, transparent 70%)',
    filter: 'blur(30px)',
    borderRadius: '999px',
    pointerEvents: 'none',
  },
  previewCard: {
    position: 'relative',
    width: '100%',
    padding: 'var(--space-2)',
    borderRadius: '18px',
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    backdropFilter: 'blur(14px)',
  },
  previewTopbar: { display: 'flex', gap: '8px', marginBottom: '12px' },
  windowDot: { width: '0.625rem', height: '0.625rem', borderRadius: '999px', background: 'rgba(255,255,255,0.22)' },
  previewFrame: {
    borderRadius: '16px',
    overflow: 'hidden',
    background: '#0b0b0b',
    border: '1px solid rgba(255,255,255,0.08)',
  },
  previewArtwork: {
    display: 'block',
    width: '100%',
    maxHeight: '25rem',
    objectFit: 'cover',
  },
};
