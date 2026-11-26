attribute vec3 aNormal;
attribute vec3 aRandom;
attribute float aDispersionWeight;
attribute vec3 aMorphTarget;
attribute float aParticleId;

uniform float uTime;
uniform vec3 uRayOrigin;
uniform vec3 uRayDir;
uniform float uInteractionStrength;
uniform float uDeconstructProgress;
uniform float uTransitionProgress;
uniform float uWarpSpeed;
uniform float uQuality;
uniform float uPixelRatio;
uniform float uReducedMotion;
uniform float uCosmicReveal;
uniform vec4 uPointerTrail[10];

varying float vLuminance;
varying float vAlpha;
varying float vDepthFade;
varying float vInteractionGlow;
varying vec3 vNormalView;
varying vec3 vRandom;

// Note: noise.glsl (snoise, snoiseVec3) is prepended at ShaderMaterial assembly time.

void main() {
  vec3 pos = position;
  vec3 nrm = normalize(aNormal);

  float motionFactor = 1.0 - clamp(uReducedMotion, 0.0, 1.0);

  // Compute ONE 3D simplex noise sample per vertex (3x faster than snoiseVec3) + harmonic curl
  float n1 = snoise(pos * 1.45 + vec3(0.0, -uTime * 0.08, uTime * 0.05));
  vec3 sharedFlow = normalize(vec3(
    n1,
    sin(n1 * 3.14159 + pos.y * 2.1 + uTime * 0.06),
    cos(n1 * 3.14159 - pos.z * 2.1 + uTime * 0.05)
  ) + 1e-4);

  // Fast analytical harmonic swirl (zero extra simplex noise cost)
  vec3 fastSwirl = vec3(
    sin(pos.y * 4.2 + uTime * 0.55 + aRandom.x * 6.28318),
    cos(pos.z * 4.2 - uTime * 0.45 + aRandom.y * 6.28318),
    sin(pos.x * 4.2 + uTime * 0.50 + aRandom.z * 6.28318)
  ) * 0.26;

  // 1. Subtle organic ambient drift (stronger at head, shoulders, and outer body edges)
  float driftMask = smoothstep(0.15, 0.95, aDispersionWeight);
  float pulse = 0.5 + 0.5 * sin(uTime * 0.55 + aRandom.x * 6.28318);
  float edgeRise = pow(pulse, 2.4) * driftMask;

  vec3 ambientOffset =
    sharedFlow * (0.008 + 0.028 * driftMask) * (0.45 + 0.55 * aRandom.y) +
    nrm * (0.004 + 0.018 * edgeRise) +
    vec3(0.006, 0.022, 0.0) * edgeRise * aRandom.z;

  float idlePresence = (1.0 - smoothstep(0.0, 0.65, uTransitionProgress));
  pos += ambientOffset * motionFactor * idlePresence;

  // 2. Ray-based localized cursor repulsion in world space (zero noise calls inside loop!)
  vec3 worldPos = (modelMatrix * vec4(pos, 1.0)).xyz;
  vec3 worldNrm = normalize(mat3(modelMatrix) * nrm);
  vec3 totalRepulsion = vec3(0.0);
  float interactionHeat = 0.0;

  if (motionFactor > 0.01 && uTransitionProgress < 0.5) {
    if (uInteractionStrength > 0.001) {
      vec3 rayDirNorm = normalize(uRayDir);
      vec3 toP = worldPos - uRayOrigin;
      float proj = dot(toP, rayDirNorm);
      vec3 closestOnRay = uRayOrigin + rayDirNorm * proj;
      vec3 perp = worldPos - closestOnRay;
      float dist = length(perp);
      float radius = 0.21;
      if (dist < radius) {
        float sigma = 0.072;
        float gauss = exp(-(dist * dist) / (2.0 * sigma * sigma));
        float edgeWindow = smoothstep(radius, radius * 0.45, dist);
        float falloff = gauss * edgeWindow;
        vec3 dir = dist > 0.0001 ? normalize(perp) : worldNrm;
        totalRepulsion += (dir + fastSwirl + worldNrm * 0.16) * falloff * uInteractionStrength * 0.095;
        interactionHeat = max(interactionHeat, falloff * uInteractionStrength);
      }
    }

    for (int i = 0; i < 10; i++) {
      vec4 tap = uPointerTrail[i];
      if (tap.w > 0.002) {
        vec3 tDir = normalize(tap.xyz);
        vec3 toP = worldPos - uRayOrigin;
        float proj = dot(toP, tDir);
        vec3 closestOnRay = uRayOrigin + tDir * proj;
        vec3 perp = worldPos - closestOnRay;
        float d = length(perp);
        float r = 0.18;
        if (d < r) {
          float sigma = 0.062;
          float gauss = exp(-(d * d) / (2.0 * sigma * sigma));
          float edgeWindow = smoothstep(r, r * 0.45, d);
          float w = gauss * edgeWindow * tap.w;
          vec3 dir = d > 0.0001 ? normalize(perp) : worldNrm;
          totalRepulsion += normalize(dir + fastSwirl * 1.15) * w * 0.068;
          interactionHeat = max(interactionHeat, w);
        }
      }
    }
  }

  vec3 displacedWorld = worldPos + totalRepulsion * (1.0 - uTransitionProgress);

  // 3. Deconstruction (0.6 - 2.5 s): Edges and silhouette dissolve inward first into drifting dust
  if (uDeconstructProgress > 0.0001) {
    float edgeOrder = (1.0 - aDispersionWeight) * 0.45 + aRandom.x * 0.14;
    float localDissolve = clamp((uDeconstructProgress - edgeOrder) / max(0.001, 1.0 - edgeOrder), 0.0, 1.0);
    float smoothDissolve = localDissolve * localDissolve * (3.0 - 2.0 * localDissolve);

    vec3 dustVector = normalize(
      worldNrm * 0.45 +
      sharedFlow * 0.85 +
      fastSwirl * 0.45 +
      vec3((aRandom.y - 0.5) * 0.6, 0.32 + aRandom.z * 0.35, -0.4)
    );
    float driftDistance = smoothDissolve * (0.65 + 1.45 * aDispersionWeight + 0.55 * aRandom.y);
    displacedWorld += dustVector * driftDistance * (1.0 - uTransitionProgress * 0.55);
  }

  // 4. Continuity Morph (2.5 - 3.5 s+): Same identity particles interpolate smoothly into shared starfield tunnel
  if (uTransitionProgress > 0.0001) {
    float morphDelay = aRandom.z * 0.22;
    float localMorph = clamp((uTransitionProgress - morphDelay) / max(0.001, 1.0 - morphDelay), 0.0, 1.0);
    float easedMorph = localMorph * localMorph * (3.0 - 2.0 * localMorph);

    vec3 warpTarget = aMorphTarget;
    float zSpan = 38.0;
    float travelOffset = uWarpSpeed * 26.0;
    warpTarget.z = mod(warpTarget.z + travelOffset + zSpan, zSpan) - zSpan + 2.5;

    displacedWorld = mix(displacedWorld, warpTarget, easedMorph);
  }

  vec4 mvPosition = viewMatrix * vec4(displacedWorld, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  // Anatomical view-space lighting in idle, transitioning cleanly into starlight luminance during warp
  vec3 viewNormal = normalize(normalMatrix * nrm);
  vec3 viewDir = normalize(-mvPosition.xyz);
  vec3 keyLightDir = normalize(vec3(-0.45, 0.65, 0.60));
  vec3 rimLightDir = normalize(vec3(0.65, 0.35, -0.55));

  float keyDiff = max(0.0, dot(viewNormal, keyLightDir));
  float fresnelRim = pow(1.0 - max(0.0, dot(viewNormal, viewDir)), 2.2);
  float fillDiff = max(0.0, dot(viewNormal, rimLightDir)) * 0.35;

  float bodyLuminance = clamp(0.24 + keyDiff * 0.52 + fresnelRim * 0.42 + fillDiff + aRandom.y * 0.14, 0.14, 1.0);
  float starLuminance = clamp(0.48 + aRandom.y * 0.52, 0.38, 1.0);

  vLuminance = mix(bodyLuminance, starLuminance, uTransitionProgress);

  float idleAlpha = clamp(0.35 + keyDiff * 0.30 + fresnelRim * 0.28 + aRandom.z * 0.18, 0.22, 0.90);
  float starCull = step(0.62, aRandom.x);
  float warpAlpha = mix(idleAlpha, idleAlpha * (0.25 + 0.75 * starCull), smoothstep(0.15, 0.95, uTransitionProgress));

  vAlpha = warpAlpha * smoothstep(0.0, 1.0, uCosmicReveal);
  vDepthFade = smoothstep(-38.0, -1.2, mvPosition.z) * smoothstep(1.2, -0.2, mvPosition.z);
  vInteractionGlow = interactionHeat;
  vNormalView = viewNormal;
  vRandom = aRandom;

  // Tighter anatomical point-size clamp reduces overlapping transparent fragment overdraw by >2x
  float baseSize = mix(1.45, 2.80, pow(aRandom.x, 1.6)) * mix(0.90, 1.08, uQuality);
  baseSize *= (1.0 + interactionHeat * 0.28);
  baseSize *= mix(1.0, 0.80, uTransitionProgress);
  float distScale = 2.65 / max(0.6, -mvPosition.z);
  gl_PointSize = clamp(baseSize * distScale * uPixelRatio, 1.0, 4.3);
  #ifdef NAME_PARTICLES
    gl_PointSize *= 1.25;
  #endif
}
