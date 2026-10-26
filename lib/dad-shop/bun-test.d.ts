/**
 * Minimal typing for `bun:test`, so `tsc` and `next build` can check
 * basket.test.ts without adding @types/bun as a dependency. Bun supplies the
 * real thing at runtime (`bun test lib/dad-shop`). Delete this file if
 * @types/bun is ever installed.
 */
declare module "bun:test" {
  interface Matchers {
    not: Matchers;
    toBe(expected: unknown): void;
    toEqual(expected: unknown): void;
    toContain(expected: unknown): void;
    toHaveLength(length: number): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeUndefined(): void;
    toBeNull(): void;
    toBeLessThan(n: number): void;
    toBeLessThanOrEqual(n: number): void;
    toBeGreaterThan(n: number): void;
    toBeGreaterThanOrEqual(n: number): void;
    toMatch(pattern: RegExp | string): void;
    toMatchObject(expected: Record<string, unknown>): void;
    toBeCloseTo(expected: number, digits?: number): void;
  }
  export function expect(actual: unknown): Matchers;
  export function test(name: string, fn: () => void | Promise<void>): void;
  export function describe(name: string, fn: () => void): void;
}
