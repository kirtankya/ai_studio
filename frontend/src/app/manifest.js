export default function manifest() {
  const iconSizes = [16, 32, 50, 72, 96, 128, 144, 150, 192, 256, 384, 512];
  
  const formattedIcons = iconSizes.map((size) => ({
    src: `/icon/${size}`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any maskable'
  }));

  return {
    name: 'Samachar Gujrati',
    short_name: 'Samachar',
    description: 'A fully automated real-time news platform delivering the latest articles across Gujarat, India, and the world.',
    start_url: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#C62828',
    icons: formattedIcons,
  }
}
