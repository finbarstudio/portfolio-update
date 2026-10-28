import { createHash, randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/**
 * The pure half of the food shop's login: password hashing, session tokens and input
 * validation. No Next, no database, no "server-only", so the admin script and the unit tests
 * can import it. The cookie and database half lives in auth.ts.
 */

// __Host- in production: a sibling *.finbar.studio page can't plant or overwrite it. Plain in dev,
// where the cookie isn't Secure (http on lab.localhost) and the prefix would be refused.
export const SESSION_COOKIE = process.env.NODE_ENV === "production" ? "__Host-fs_session" : "fs_session";
export const SESSION_DAYS = 60;

export type Result<T> = { ok: true; value: T } | { ok: false; error: string };

function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

function fail<T>(error: string): Result<T> {
  return { ok: false, error };
}

// ---------- passwords ----------

// Stored as 'scrypt$N$r$p$salt_b64$hash_b64'. The parameters travel with the hash, so they can
// be raised later without locking anyone out.
// N=2^15, r=8, p=3 is an OWASP-equivalent tier (~32MB per hash).
const SCRYPT_N = 32768;
const SCRYPT_R = 8;
const SCRYPT_P = 3;
const KEY_LEN = 64;
const SALT_LEN = 16;

function derive(password: string, salt: Buffer, keyLen: number, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    // Node's default memory cap is 32MB; allow double what these parameters need.
    scrypt(password, salt, keyLen, { N: n, r, p, maxmem: 256 * n * r }, (err, key) => {
      if (err) reject(err);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(SALT_LEN);
  const key = await derive(password, salt, KEY_LEN, SCRYPT_N, SCRYPT_R, SCRYPT_P);
  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("base64"), key.toString("base64")].join("$");
}

/** True only for a matching password. A malformed stored hash is simply false, never a throw. */
export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  try {
    if (typeof password !== "string" || typeof stored !== "string") return false;
    const parts = stored.split("$");
    if (parts.length !== 6 || parts[0] !== "scrypt") return false;
    const n = Number(parts[1]);
    const r = Number(parts[2]);
    const p = Number(parts[3]);
    // N must be a power of two; the bounds stop a bad row from asking for gigabytes of memory.
    if (!Number.isInteger(n) || n < 1024 || n > 131072 || (n & (n - 1)) !== 0) return false;
    if (!Number.isInteger(r) || r < 1 || r > 16) return false;
    if (!Number.isInteger(p) || p < 1 || p > 4) return false;
    const salt = Buffer.from(parts[4], "base64");
    const expected = Buffer.from(parts[5], "base64");
    if (salt.length < 8 || expected.length < 16 || expected.length > 128) return false;
    const actual = await derive(password, salt, expected.length, n, r, p);
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch {
    return false;
  }
}

let dummyHash: Promise<string> | null = null;

/**
 * Spends the same time as a real check, for an email that has no account, so the answer's
 * speed doesn't reveal which emails exist. Always false.
 */
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hashPassword(randomBytes(16).toString("hex"));
  await verifyPassword(password, await dummyHash);
  return false;
}

// ---------- session tokens ----------

/** The secret that goes in the cookie: 32 random bytes. */
export function newSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** What the database keeps instead of the token. */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

// ---------- input validation ----------

const MAX_EMAIL = 254;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// control characters (C0, DEL, C1) would reach Finbar's terminal through the admin script
const CONTROL_RE = /[\u0000-\u001f\u007f-\u009f]/;

export function validateEmail(email: string): Result<string> {
  if (email.length === 0) return fail("Enter your email.");
  if (email.length > MAX_EMAIL || !EMAIL_RE.test(email) || CONTROL_RE.test(email) || email.includes("..")) return fail("That email doesn't look right.");
  return ok(email);
}

/** Trimmed, lower-case and checked: what goes in the users table. */
export function normaliseEmail(input: unknown): Result<string> {
  if (typeof input !== "string") return fail("Enter your email.");
  return validateEmail(input.trim().toLowerCase());
}

export const MIN_PASSWORD = 10;
export const MAX_PASSWORD = 200;

/** 8-200 characters, taken exactly as typed (spaces are allowed and are never trimmed). */
// The passwords people pick most (and their obvious variants once lower-cased): refused outright.
// UK NCSC / NIST advice: length and a deny-list beat composition rules ("one capital, one symbol").
const COMMON_PASSWORDS = new Set([
  "1234567890", "0123456789", "0987654321", "1111111111", "1234512345", "1qaz2wsx3edc", "qwertyuiop", "qwerty1234",
  "qwerty123456", "asdfghjkl1", "password12", "password123", "password1234", "passw0rd123", "iloveyou123", "letmein123",
  "welcome123", "football123", "liverpool1", "arsenal123", "chelsea123", "manchester1", "sunshine123", "princess123",
  "monkey1234", "dragon1234", "baseball123", "abc1234567", "abcdefghij", "aaaaaaaaaa", "trustno1234", "superman123",
  "starwars123", "whatever123", "changeme123", "foodshop123", "tesco12345", "qwertyqwerty", "zxcvbnm123", "computer123",
]);

/**
 * At least 10 characters (a passphrase of three words is ideal), at most 200, never trimmed, not one of the
 * most common passwords and not built from their email address.
 */
export function validatePassword(input: unknown, email?: string): Result<string> {
  if (typeof input !== "string" || input.length === 0) return fail("Enter a password.");
  if (input.length < MIN_PASSWORD) return fail(`Use at least ${MIN_PASSWORD} characters. Three random words works well.`);
  if (input.length > MAX_PASSWORD) return fail(`That password is too long (most ${MAX_PASSWORD} characters).`);
  const lower = input.toLowerCase();
  if (COMMON_PASSWORDS.has(lower) || /^(.)\1+$/.test(input)) return fail("That's one of the most common passwords. Pick something less guessable.");
  const local = email?.split("@")[0]?.toLowerCase();
  if (local && local.length >= 4 && lower.includes(local)) return fail("Don't use your email address in your password.");
  return ok(input);
}

export const MIN_INVITE = 10;

/** A fresh invite code: 12 random hex characters (48 bits), far too many to guess. */
export function newInviteCode(): string {
  return randomBytes(6).toString("hex");
}

/** Invite codes are case-insensitive: trimmed, lower-case, letters, numbers and dashes, 10-40 long. */
export function normaliseInvite(input: unknown): Result<string> {
  if (typeof input !== "string") return fail("Enter your invite code.");
  const code = input.trim().toLowerCase();
  if (code.length === 0) return fail("Enter your invite code.");
  if (!/^[a-z0-9-]{10,40}$/.test(code)) return fail("That invite code doesn't look right.");
  return ok(code);
}

export const MAX_NAME = 60;

/** Optional. Blank or missing is fine and stored as null. */
export function normaliseName(input: unknown): Result<string | null> {
  if (input === undefined || input === null) return ok<string | null>(null);
  if (typeof input !== "string") return fail("That name doesn't look right.");
  const name = input.replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2066-\u2069]/g, " ").replace(/\s+/g, " ").trim();
  if (name.length > MAX_NAME) return fail(`That name is too long (most ${MAX_NAME} letters).`);
  return ok<string | null>(name.length === 0 ? null : name);
}
