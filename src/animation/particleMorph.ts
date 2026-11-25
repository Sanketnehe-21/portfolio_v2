/**
 * Shared deterministic deep-space starfield target generator.
 * Both HumanParticles and NameParticles morph into these shared tunnel coordinates
 * so identity particles flow seamlessly into the interstellar starfield.
 */
export function computeStarfieldMorphTarget(
  rand: () => number,
  spreadX = 11.5,
  spreadY = 7.5
): [number, number, number] {
  const theta = rand() * Math.PI * 2
  const radius = 0.8 + Math.pow(rand(), 0.65) * Math.max(spreadX, spreadY)
  const x = Math.cos(theta) * radius
  const y = Math.sin(theta) * radius * (spreadY / spreadX)
  const z = -2.0 - rand() * 38.0
  return [x, y, z]
}
