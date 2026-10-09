/**
 * Highlight roll-off shared by the post pass and the screen shader. Values up to the knee pass through untouched; above
 * it they compress smoothly towards 1. The screen shader writes the inverse of this curve, so after the post pass the
 * screen pixels come out exactly as they are in the source file (the screen is never tone mapped), while the lit
 * device still gets a gentle highlight roll-off.
 */
export const TONE_GLSL = /* glsl */ `
const float TONE_KNEE = 0.8;

vec3 toneShoulder(vec3 x) {
  float range = 1.0 - TONE_KNEE;
  vec3 over = max(x - TONE_KNEE, 0.0);
  return min(x, vec3(TONE_KNEE)) + range * (1.0 - exp(-over / range));
}

vec3 toneShoulderInverse(vec3 y) {
  float range = 1.0 - TONE_KNEE;
  vec3 clamped = clamp(y, 0.0, 0.999);
  vec3 over = max(clamped - TONE_KNEE, 0.0);
  return min(clamped, vec3(TONE_KNEE)) - range * log(1.0 - over / range);
}
`;
