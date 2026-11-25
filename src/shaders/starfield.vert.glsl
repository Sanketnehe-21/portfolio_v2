attribute vec3 aRandom;
attribute float aLayer;

uniform float uTime;
uniform float uWarpSpeed;
uniform float uWarpTrail;
uniform float uCosmicReveal;
uniform float uPixelRatio;
uniform float uQuality;
uniform float uReducedMotion;

varying float vAlpha;
varying float vLuminance;
varying float vTrail;
varying float vLayer;
varying vec2 vScreenDir;

void main() {
  vec3 pos = position;

  // Continuous forward travel along +Z during STARFIELD warp phases
  float speedFactor = (0.35 + 0.65 * aLayer) * (0.65 + 0.7 * aRandom.x);
  float zSpan = 48.0;
  float travel = uWarpSpeed * 38.0 * speedFactor;

  // Wrap smoothly within [-44, +4] ahead of camera
  float zWrapped = mod(pos.z + travel + 44.0, zSpan) - 44.0;
  pos.z = zWrapped;

  // Gentle parallax drift during idle
  float motion = 1.0 - clamp(uReducedMotion, 0.0, 1.0);
  pos.x += sin(uTime * 0.08 + aRandom.y * 6.28318) * 0.05 * aLayer * motion;
  pos.y += cos(uTime * 0.06 + aRandom.z * 6.28318) * 0.04 * aLayer * motion;

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Screen-space radial vector from vanishing center for perspective-correct warp trails
  vec2 ndc = gl_Position.w > 0.001 ? gl_Position.xy / gl_Position.w : vec2(0.0);
  vec2 dir = length(ndc) > 0.001 ? normalize(ndc) : vec2(0.0, 1.0);
  vScreenDir = vec2(dir.x, -dir.y); // gl_PointCoord Y runs top-to-bottom

  // Restrained twinkling
  float twinkle = 0.72 + 0.28 * sin(uTime * (0.4 + aRandom.x * 1.1) + aRandom.y * 6.28318);
  float depthBrightness = smoothstep(-44.0, -3.0, pos.z);
  float nearFade = smoothstep(2.0, -1.5, pos.z);

  vLuminance = clamp(0.30 + 0.55 * depthBrightness + 0.25 * aRandom.z, 0.20, 1.0);
  vAlpha = clamp((0.16 + 0.62 * depthBrightness) * twinkle * nearFade * uCosmicReveal, 0.0, 0.92);
  vTrail = clamp(uWarpTrail * speedFactor, 0.0, 1.0);
  vLayer = aLayer;

  float baseSize = mix(1.4, 3.6, pow(aRandom.x, 1.8)) * (0.7 + 0.5 * aLayer) * mix(0.85, 1.1, uQuality);
  float trailBoost = 1.0 + vTrail * 5.8;
  float distScale = 3.2 / max(0.75, -mvPosition.z);
  gl_PointSize = clamp(baseSize * trailBoost * distScale * uPixelRatio, 1.0, 28.0);
}
