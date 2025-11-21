export function getDeviceFingerprint(): string {
  const stored = localStorage.getItem('device_fingerprint');
  if (stored) return stored;

  const fingerprint = generateFingerprint();
  localStorage.setItem('device_fingerprint', fingerprint);
  return fingerprint;
}

function generateFingerprint(): string {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  let canvasFingerprint = '';
  if (ctx) {
    ctx.textBaseline = 'top';
    ctx.font = '14px Arial';
    ctx.fillText('Device Fingerprint', 2, 2);
    canvasFingerprint = canvas.toDataURL();
  }

  const components = [
    navigator.userAgent,
    navigator.language,
    screen.colorDepth,
    screen.width,
    screen.height,
    new Date().getTimezoneOffset(),
    !!window.sessionStorage,
    !!window.localStorage,
    canvasFingerprint,
  ];

  const fingerprint = components.join('|');
  return hashString(fingerprint);
}

function hashString(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(36);
}
