// Paleta de marca — única fonte da verdade
const palette = {
  pear: '#BCFF00',
  richBlack: '#061414',
  laurelLeaf: '#96998C',
  celeste: '#D2D3CE',
  ceilingWhite: '#E9EBE6',
  pear2:'#bcff00',
  blue:'#00bcff',
  pink:'#ff00bc',
} as const;

export const colors = {
  ...palette,

  // Fundos
  background: palette.ceilingWhite,
  surface: '#E9EBE6',
  backgroundAlt: palette.celeste,
  backgroundDark: palette.richBlack,
  backgroundlaurelLeaf:palette.laurelLeaf,

  // Marca
  accent: palette.pear2,
  secondary: palette.blue,
  thirdy: palette.pink,

  // Texto
  textPrimary: palette.richBlack,
  textSecondary: palette.laurelLeaf,
  textMuted: '#96998C',
  textOnDark: '#E9EBE6',
  textOnAccent: palette.richBlack,

  // Bordas / divisores
  border: palette.celeste,
  borderStrong: palette.laurelLeaf,
  borderBlack: palette.richBlack,
  borderWhite:palette.ceilingWhite,

  // Overlays
  overlay: '#061414',
  accentGlow: '#96998C',
  accentGlowStrong: 'rgba(188, 255, 0, 0.25)',

  // Estados (funcionais, fora da paleta de marca)
  danger: '#D85A30',
  disabledBg: palette.celeste,
  disabledText: palette.laurelLeaf,
} as const;