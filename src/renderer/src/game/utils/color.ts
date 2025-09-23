export interface RGB {
  r: number;
  g: number;
  b: number;
  a?: number;
}

/**
 * 문자열 색상 파서
 * - #RGB, #RRGGBB, #RRGGBBAA
 * - rgb(), rgba()
 */
export function parseColor(input: string): RGB {
  input = input.trim();

  // HEX (#RGB / #RRGGBB / #RRGGBBAA)
  if (input.startsWith('#')) {
    let hex = input.slice(1);
    if (hex.length === 3) {
      hex = hex
        .split('')
        .map((c) => c + c)
        .join('');
    }
    if (hex.length === 8) {
      const num = parseInt(hex, 16);
      return {
        r: (num >> 24) & 255,
        g: (num >> 16) & 255,
        b: (num >> 8) & 255,
        a: (num & 255) / 255
      };
    }
    const num = parseInt(hex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255
    };
  }

  // rgb()/rgba()
  const rgbRegex =
    /^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)$/i;
  const match = input.match(rgbRegex);
  if (match) {
    return {
      r: Math.min(255, Math.max(0, parseInt(match[1], 10))),
      g: Math.min(255, Math.max(0, parseInt(match[2], 10))),
      b: Math.min(255, Math.max(0, parseInt(match[3], 10))),
      a:
        match[4] !== undefined
          ? Math.min(1, Math.max(0, parseFloat(match[4])))
          : undefined
    };
  }

  throw new Error(`Invalid color format: ${input}`);
}

/**
 * RGB → HEX (#RRGGBB)
 */
export function rgbToHex({ r, g, b }: RGB): string {
  return (
    '#' +
    [r, g, b]
      .map((x) => {
        const hex = x.toString(16).padStart(2, '0');
        return hex;
      })
      .join('')
      .toUpperCase()
  );
}

/**
 * RGB → 0xRRGGBB (Phaser, PixiJS 등에서 자주 사용)
 */
export function rgbToNumber({ r, g, b }: RGB): number {
  return (r << 16) | (g << 8) | b;
}

/**
 * 문자열 색상 → HEX
 */
export function toHex(input: string): string {
  return rgbToHex(parseColor(input));
}

/**
 * 문자열 색상 → 0xRRGGBB
 */
export function toNumber(input: string): number {
  return rgbToNumber(parseColor(input));
}
