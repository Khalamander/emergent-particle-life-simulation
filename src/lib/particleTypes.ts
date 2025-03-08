
export interface ParticleType {
  id: string;
  name: string;
  color: string;
  radius: number;
  mass: number;
}

export interface ColorPalette {
  id: string;
  name: string;
  colors: string[];
  description: string;
}

export const COLOR_PALETTES: ColorPalette[] = [
  {
    id: 'default',
    name: 'Classic',
    description: 'The original particle colors',
    colors: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b']
  },
  {
    id: 'neon',
    name: 'Neon',
    description: 'Bright, vibrant colors that pop',
    colors: ['#ff00ff', '#00ffff', '#ffff00', '#00ff00']
  },
  {
    id: 'pastel',
    name: 'Pastel',
    description: 'Soft, gentle colors',
    colors: ['#ffd6e0', '#ffefcf', '#d1f0e0', '#c4d7f2']
  },
  {
    id: 'earthy',
    name: 'Earthy',
    description: 'Natural, organic tones',
    colors: ['#8b4513', '#556b2f', '#cd853f', '#a0522d']
  },
  {
    id: 'monochrome',
    name: 'Monochrome',
    description: 'Shades of a single color',
    colors: ['#d4d4d8', '#a1a1aa', '#71717a', '#52525b']
  }
];

export interface TrailStyle {
  id: string;
  name: string;
  description: string;
}

export const TRAIL_STYLES: TrailStyle[] = [
  {
    id: 'line',
    name: 'Fading Line',
    description: 'Standard line that fades with time'
  },
  {
    id: 'dots',
    name: 'Dots',
    description: 'Separate dots showing past positions'
  },
  {
    id: 'comet',
    name: 'Comet',
    description: 'Thicker head with fading tail'
  }
];

export const DEFAULT_PARTICLE_TYPES: ParticleType[] = [
  {
    id: 'type1',
    name: 'Alpha',
    color: '#3b82f6', // Blue
    radius: 3,
    mass: 1
  },
  {
    id: 'type2',
    name: 'Beta',
    color: '#ef4444', // Red
    radius: 3,
    mass: 1
  },
  {
    id: 'type3',
    name: 'Gamma',
    color: '#10b981', // Green
    radius: 3,
    mass: 1
  },
  {
    id: 'type4',
    name: 'Delta',
    color: '#f59e0b', // Amber
    radius: 3,
    mass: 1
  }
];

// Helper function to apply a color palette to particle types
export function applyColorPalette(
  particleTypes: ParticleType[],
  paletteId: string
): ParticleType[] {
  const palette = COLOR_PALETTES.find(p => p.id === paletteId);
  if (!palette) return particleTypes;
  
  return particleTypes.map((type, index) => ({
    ...type,
    color: palette.colors[index % palette.colors.length]
  }));
}
