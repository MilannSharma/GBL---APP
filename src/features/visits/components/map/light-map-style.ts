/**
 * Light Google Maps style. Android's Google map follows the phone's dark mode on its own, and
 * `userInterfaceStyle` does not apply there, so every element gets an explicit light colour.
 */
export const lightMapStyle = [
  { elementType: 'geometry', stylers: [{ color: '#eef3f8' }] },
  { elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#5b6b7f' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative', elementType: 'geometry', stylers: [{ color: '#d5dee9' }] },
  // Area, locality and landmark names, kept dark enough to read on the light tiles.
  { featureType: 'administrative', elementType: 'labels.text', stylers: [{ visibility: 'on' }] },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#1e293b' }] },
  { featureType: 'administrative.neighborhood', elementType: 'labels.text.fill', stylers: [{ color: '#334155' }] },
  { featureType: 'poi', elementType: 'labels.text', stylers: [{ visibility: 'on' }] },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { featureType: 'road', elementType: 'labels.text', stylers: [{ visibility: 'on' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#475569' }] },
  { featureType: 'landscape', elementType: 'geometry', stylers: [{ color: '#eef3f8' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#e3ecf4' }] },
  { featureType: 'poi.park', elementType: 'geometry', stylers: [{ color: '#d6ecd2' }] },
  { featureType: 'poi.park', elementType: 'labels.text.fill', stylers: [{ color: '#5f8f5a' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry.stroke', stylers: [{ color: '#dfe7f0' }] },
  { featureType: 'road.highway', elementType: 'geometry', stylers: [{ color: '#fdf1c9' }] },
  { featureType: 'road.highway', elementType: 'geometry.stroke', stylers: [{ color: '#f0dca0' }] },
  { featureType: 'transit', elementType: 'geometry', stylers: [{ color: '#e3ecf4' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#bfdcf5' }] },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#5b8ab8' }] },
];
