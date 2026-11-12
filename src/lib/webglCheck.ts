export function checkWebGLAndDevice(): { ok: boolean; reason?: string } {
  if (typeof window === 'undefined') return { ok: true };

  // Allow bypass for e2e testing or dev
  if (window.location.search.includes('e2e=1')) {
    return { ok: true };
  }

  // 1. Check WebGL support
  try {
    const canvas = document.createElement('canvas');
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      (canvas.getContext('experimental-webgl') as any);

    if (!gl) {
      return { ok: false, reason: 'WebGL is not supported or disabled on your browser.' };
    }

    // 2. Check for software renderers
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
      if (
        /swiftshader|llvmpipe|software rasterizer|microsoft basic render/i.test(
          renderer
        )
      ) {
        return {
          ok: false,
          reason: 'Hardware GPU acceleration unavailable (detected software renderer).',
        };
      }
    }
  } catch {
    return { ok: false, reason: 'Unable to initialize WebGL context.' };
  }

  // 3. Check low memory devices (under 2GB RAM)
  const nav = navigator as any;
  if (nav.deviceMemory && nav.deviceMemory < 2) {
    return {
      ok: false,
      reason: 'Device memory is limited for interactive 3D graphics.',
    };
  }

  return { ok: true };
}
