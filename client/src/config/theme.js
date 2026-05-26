// Modern theme configuration
export const theme = {
  colors: {
    // Editorial palette
    primary: '#111111',
    bg: '#f5f5f3',
    bgSoft: '#ececea',
    surface: '#ffffff',
    surfaceMuted: '#f1f1ef',
    text: '#0a0a0a',
    textMuted: '#7b7b7b',
    border: '#dededb',
    accent: '#d6d6d2',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    h1: { fontSize: '56px', fontWeight: 900, letterSpacing: '-2px' },
    h2: { fontSize: '42px', fontWeight: 800, letterSpacing: '-1px' },
    h3: { fontSize: '32px', fontWeight: 700 },
    h4: { fontSize: '24px', fontWeight: 700 },
    body: { fontSize: '15px', fontWeight: 500 },
    small: { fontSize: '13px', fontWeight: 500 },
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '18px',
    full: '999px',
  },
  
  shadows: {
    sm: '0 4px 20px rgba(0,0,0,0.04)',
    md: '0 8px 28px rgba(0,0,0,0.06)',
    lg: '0 12px 36px rgba(0,0,0,0.08)',
  },
  
  gradients: {
    lightBg: 'linear-gradient(180deg, #f5f5f3, #f1f1ef)',
    subtle: 'linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.01))',
  },
};

export const baseStyles = {
  container: {
    width: '100vw',
    minHeight: '100vh',
    background: theme.colors.bg,
    fontFamily: theme.typography.fontFamily,
    overflow: 'hidden',
  },
  
  sidebar: {
    width: '280px',
    background: theme.colors.surface,
    color: theme.colors.text,
    padding: theme.spacing.xxl,
    flexDirection: 'column',
    display: 'flex',
    borderRight: `1px solid ${theme.colors.border}`,
  },
  
  header: {
    background: theme.colors.surface,
    padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
    borderBottom: `1px solid ${theme.colors.border}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  
  card: {
    background: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.xxl,
    boxShadow: theme.shadows.sm,
    border: `1px solid ${theme.colors.border}`,
  },
  
  input: {
    width: '100%',
    border: 'none',
    outline: 'none',
    background: theme.colors.surfaceMuted,
    padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
    borderRadius: theme.borderRadius.full,
    fontSize: '15px',
    fontWeight: 500,
    color: theme.colors.text,
    transition: 'all 0.3s ease',
  },
  
  buttonPrimary: {
    width: '100%',
    border: 'none',
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xl,
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    background: theme.colors.primary,
    color: theme.colors.surface,
    transition: 'all 0.18s ease',
    boxShadow: theme.shadows.md,
  },
  
  buttonSecondary: {
    width: '100%',
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.full,
    padding: theme.spacing.xl,
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    background: theme.colors.surfaceMuted,
    color: theme.colors.text,
    transition: 'all 0.18s ease',
  },
  
  error: {
    padding: `${theme.spacing.lg} ${theme.spacing.xxl}`,
    backgroundColor: '#fff6f6',
    color: '#7a1f1f',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
    fontSize: '14px',
    fontWeight: 500,
    border: `1px solid ${theme.colors.border}`,
  },
};

export const pageTheme = {
  shell: {
    position: 'relative',
    minHeight: '100vh',
    padding: '24px',
    color: 'var(--text)',
    background: 'linear-gradient(180deg, #f5f5f3 0%, #f1f1ef 100%)',
    overflow: 'hidden',
  },
  glow: {
    position: 'fixed',
    inset: 0,
    pointerEvents: 'none',
    backgroundImage: 'none',
    opacity: 0,
  },
  content: {
    position: 'relative',
    zIndex: 1,
  },
  headerCard: {
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.08)',
    background: 'rgba(255,255,255,0.04)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.4)',
  },
  kicker: {
    margin: 0,
    color: '#93c5fd',
    textTransform: 'uppercase',
    letterSpacing: '0.18em',
    fontSize: '0.72rem',
  },
  title: {
    margin: '8px 0 0',
    fontSize: 'clamp(1.8rem, 3vw, 3rem)',
    letterSpacing: '-0.04em',
  },
  cardPadding: {
    padding: '20px',
  },
};

// Backwards-compatible default theme export used across pages/components
const THEME = {
  slate: theme.colors.accent,
  lightGray: theme.colors.bgSoft,
  darkSlate: theme.colors.text,
  warmBeige: theme.colors.bg,
  sand: theme.colors.surfaceMuted,
  offWhite: theme.colors.surface,
  dark: theme.colors.primary,
  accent: theme.colors.accent,
};

export default THEME;
