// Booth palettes, mirroring the site's two themes. Numeric values feed Three.js
// materials/lights; the string values feed canvas-texture drawing (banner).
export const BOOTH_THEMES = {
    lovecraftian: {
        bg: 0x0a0a12,
        fog: 0x0a0a12,
        wall: 0x161620,
        floor: 0x0e0e16,
        table: 0x1d1522,
        tableTop: 0x352a40,
        trim: 0x3d5a5a,
        accent: 0x5a8a8a,
        spot: 0xffd6a8,
        ambient: 0x3a3a44,
        rim: 0x4a1a4a,
        bannerText: '#c4c4b8',
        bannerAccent: '#5a8a8a',
        bannerBg: '#161620',
        display: 'serif',
    },
    alien: {
        bg: 0x020808,
        fog: 0x020808,
        wall: 0x061410,
        floor: 0x04100c,
        table: 0x0a2a1e,
        tableTop: 0x115c38,
        trim: 0x2bd612,
        accent: 0x39ff14,
        spot: 0x8bff66,
        ambient: 0x0c261a,
        rim: 0x1a5a2a,
        bannerText: '#d4ffd4',
        bannerAccent: '#39ff14',
        bannerBg: '#071410',
        display: 'mono',
    },
};

export function getBoothTheme(themeName) {
    return BOOTH_THEMES[themeName] || BOOTH_THEMES.lovecraftian;
}
