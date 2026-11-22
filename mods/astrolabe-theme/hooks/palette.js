import { makeColors } from './make-colors.js'

// Astrolabe's own palette: astrolabe brass and instrument glow on a night
// sky, and the same brass inked on vellum by day.
export const NIGHT = {
  sky: '#080a14',
  brass: '#d8ac5d',
  brassBright: '#f0c879',
  glow: '#6fd6da',
  star: '#fff1d6',
  ink: '#e9e2cd',
}

export const DAY = {
  vellum: '#eceef3',
  brass: '#8a6216',
  glow: '#0b6f7c',
  ink: '#1a1e31',
}

export const { theme: COLORS, problems: PROBLEMS } = makeColors({
  label: 'Astrolabe',
  id: 'astrolabe',
  roles: {
    accent: '#d8ac5d', // brass
    danger: '#e57a8a', // rose
    success: '#7fcf8d', // verdigris green
    warning: '#f09a5b', // ember orange
    pro: '#9b8cf0', // twilight violet
  },
  light: {
    gray: {
      anchors: {
        'surface-0': '#eceef3',
        'surface-1': '#f5f6f9',
        'surface-2': '#fbfbfd',
        'surface-3': '#fbfbfd',
        'text-primary': '#1a1e31',
        'text-secondary': '#454b64',
        'text-muted': '#5c627c',
      },
    },
    git: {
      added: '#3a7647',
      removed: '#ab432b',
      modified: '#8a6216',
      merged: '#5d4fb0',
    },
  },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#080a14',
        'surface-1': '#0d1020',
        'surface-2': '#141829',
        'surface-3': '#191e31',
        'text-primary': '#ece5d0',
        'text-secondary': '#bfbccb',
        'text-muted': '#9294ad',
      },
    },
    git: {
      added: '#79c48a',
      removed: '#e57a5f',
      modified: '#d8ac5d',
      merged: '#9b8cf0',
    },
  },
})
