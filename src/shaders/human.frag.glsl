varying float vLuminance;
varying float vAlpha;
varying float vDepthFade;
varying float vInteractionGlow;
varying vec3 vNormalView;
varying vec3 vRandom;

void main() {
  // Soft circular disc using pure ALU polynomial falloff (zero sqrt/pow per fragment)
  vec2 centered = gl_PointCoord - vec2(0.5);
  float distSq = dot(centered, centered);
  if (distSq > 0.25) discard;

  float r2 = 1.0 - distSq * 4.0;
  float shape = mix(r2 * r2, r2, 0.25);

  // Silver starlight palette (#9296A6 -> #E4E6ED) with faint shadow tint (#28253C)
  vec3 shadowTint = vec3(0.32, 0.34, 0.45);
  vec3 silverMid = vec3(0.573, 0.588, 0.651);  // #9296A6
  vec3 starlight = vec3(0.894, 0.902, 0.929);  // #E4E6ED

  vec3 baseColor = mix(shadowTint, silverMid, smoothstep(0.15, 0.58, vLuminance));
  baseColor = mix(baseColor, starlight, smoothstep(0.55, 1.0, vLuminance));

  vec3 interactionTint = vec3(0.76, 0.81, 0.96);
  baseColor = mix(baseColor, interactionTint, clamp(vInteractionGlow * 0.42, 0.0, 0.42));

  float alpha = shape * vAlpha * vDepthFade;
  #ifdef NAME_PARTICLES
    baseColor = mix(vec3(0.85, 0.91, 0.95), vec3(1.0), vLuminance);
    alpha = min(1.0, alpha * 1.7);
  #endif
  if (alpha < 0.018) discard;

  gl_FragColor = vec4(baseColor, alpha);
}
