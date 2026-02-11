const KAABA_LAT = 21.4225;
const KAABA_LON = 39.8262;

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

function toDeg(rad: number): number {
  return (rad * 180) / Math.PI;
}

/**
 * Compute Qibla bearing from given lat/lon to Kaaba.
 * Returns bearing in degrees (0-360, clockwise from north).
 */
export function computeQiblaBearing(lat: number, lon: number): number {
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dLambda = toRad(KAABA_LON - lon);

  const y = Math.sin(dLambda);
  const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(dLambda);
  let bearing = toDeg(Math.atan2(y, x));
  return ((bearing % 360) + 360) % 360;
}

/**
 * Compute great-circle distance to Kaaba in km.
 */
export function distanceToKaaba(lat: number, lon: number): number {
  const R = 6371;
  const phi1 = toRad(lat);
  const phi2 = toRad(KAABA_LAT);
  const dPhi = toRad(KAABA_LAT - lat);
  const dLambda = toRad(KAABA_LON - lon);

  const a =
    Math.sin(dPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
