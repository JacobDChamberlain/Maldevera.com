// Cheap one-shot check for WebGL support. Used to fall back to the plain grid
// when the 3D booth can't run (old browsers, disabled GPU, etc.).
let cached = null;

export default function hasWebGL() {
    if (cached !== null) return cached;
    try {
        const canvas = document.createElement('canvas');
        cached = !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
        );
    } catch (e) {
        cached = false;
    }
    return cached;
}
