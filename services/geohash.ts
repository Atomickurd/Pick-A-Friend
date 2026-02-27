/**
 * Lightweight geohash encoder / decoder.
 * Precision 6 ≈ ±600 m, Precision 9 ≈ ±2.4 m.
 */
const BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz';

export function encodeGeohash(lat: number, lng: number, precision = 9): string {
  let minLat = -90,
    maxLat = 90;
  let minLng = -180,
    maxLng = 180;
  let hash = '';
  let bits = 0,
    bitsTotal = 0,
    charIdx = 0,
    even = true;

  while (hash.length < precision) {
    if (even) {
      const mid = (minLng + maxLng) / 2;
      if (lng > mid) {
        charIdx = (charIdx << 1) | 1;
        minLng = mid;
      } else {
        charIdx <<= 1;
        maxLng = mid;
      }
    } else {
      const mid = (minLat + maxLat) / 2;
      if (lat > mid) {
        charIdx = (charIdx << 1) | 1;
        minLat = mid;
      } else {
        charIdx <<= 1;
        maxLat = mid;
      }
    }
    even = !even;
    bits++;
    bitsTotal++;
    if (bits === 5) {
      hash += BASE32[charIdx];
      bits = 0;
      charIdx = 0;
    }
  }
  return hash;
}

export function decodeGeohash(geohash: string): {
  lat: number;
  lng: number;
  latErr: number;
  lngErr: number;
} {
  let minLat = -90,
    maxLat = 90;
  let minLng = -180,
    maxLng = 180;
  let even = true;

  for (const char of geohash) {
    const idx = BASE32.indexOf(char);
    for (let bits = 4; bits >= 0; bits--) {
      const bitN = (idx >> bits) & 1;
      if (even) {
        const mid = (minLng + maxLng) / 2;
        if (bitN === 1) minLng = mid;
        else maxLng = mid;
      } else {
        const mid = (minLat + maxLat) / 2;
        if (bitN === 1) minLat = mid;
        else maxLat = mid;
      }
      even = !even;
    }
  }
  return {
    lat: (minLat + maxLat) / 2,
    lng: (minLng + maxLng) / 2,
    latErr: (maxLat - minLat) / 2,
    lngErr: (maxLng - minLng) / 2,
  };
}

/** Return the 8 neighbouring geohashes + the center one (9 total). */
export function geohashNeighbours(geohash: string): string[] {
  // Minimal neighbour computation for Firestore range queries
  const prefix = geohash.slice(0, -1);
  const lastChar = geohash[geohash.length - 1];
  const idx = BASE32.indexOf(lastChar);
  const neighbours: string[] = [];
  for (let i = Math.max(0, idx - 4); i <= Math.min(31, idx + 4); i++) {
    neighbours.push(prefix + BASE32[i]);
  }
  return neighbours;
}
