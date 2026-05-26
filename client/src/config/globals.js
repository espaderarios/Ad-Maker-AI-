import { theme } from './theme.js';

export const globalStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: ${theme.typography.fontFamily};
  }

  html, body, #root {
    width: 100%;
    height: 100%;
  }

  body {
    background: ${theme.colors.lightBg};
    color: ${theme.colors.textDark};
    overflow-x: hidden;
  }

  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 10px;
    height: 10px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.gray2};
    border-radius: 8px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${theme.colors.gray1};
  }

  /* Input focus */
  input:focus,
  textarea:focus {
    background: ${theme.colors.gray2};
    transform: scale(1.01);
    box-shadow: 0 0 0 4px rgba(0,0,0,0.05);
  }

  /* Button hover */
  button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.lg};
  }

  button:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  /* Links */
  a {
    color: ${theme.colors.accentBlue};
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  a:hover {
    opacity: 0.8;
  }

  /* Selection */
  ::selection {
    background: ${theme.colors.accentBlue};
    color: white;
  }
`;

export const injectGlobalStyles = () => {
  const styleTag = document.createElement('style');
  styleTag.innerHTML = globalStyles;
  document.head.appendChild(styleTag);
};
