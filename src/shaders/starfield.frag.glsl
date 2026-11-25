varying float vAlpha;
varying float vLuminance;
varying float vTrail;
varying float vLayer;
varying vec2 vScreenDir;

void main() {
  vec2 uv = gl_PointCoord - vec2(0.5);

  // Align point quad coordinates along radial vanishing direction
  vec2 dir = normalize(vScreenDir + vec2(1e-5, 0.0));
  vec2 perpDir = vec2(-dir.y, dir.x);

  float along = dot(uv, dir);
  float across = dot(uv, perpDir);

  // Stretch along radial motion vector and narrow transversely during warp
  vec2 warped = vec2(along * mix(1.0, 0.34, vTrail), across * mix(1.0, 3.4, vTrail));
  float dist = length(warped);
  if (dist > 0.5) discard;

  float falloff = pow(max(0.0, 1.0 - dist * 2.0), mix(1.9, 1.35, vTrail));

  vec3 dimSilver = vec3(0.573, 0.588, 0.651); // #9296A6
  vec3 brightStar = vec3(0.894, 0.902, 0.929); // #E4E6ED
  vec3 color = mix(dimSilver, brightStar, vLuminance);

  // Subtle cool highlight during peak warp trails without harsh neon
  color = mix(color, vec3(0.84, 0.88, 0.98), vTrail * 0.35);

  float alpha = falloff * vAlpha;
  if (alpha < 0.015) discard;

  gl_FragColor = vec4(color, alpha);
}
