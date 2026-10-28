import { describe, expect, test } from "bun:test";
import {
  hashPassword,
  hashToken,
  newSessionToken,
  normaliseEmail,
  newInviteCode,
  normaliseInvite,
  normaliseName,
  validatePassword,
  verifyAgainstDummy,
  verifyPassword,
} from "./auth-core";

describe("passwords", () => {
  test("a password verifies against its own hash", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(stored.startsWith("scrypt$32768$8$3$")).toBe(true);
    expect(await verifyPassword("correct horse battery", stored)).toBe(true);
  });

  test("a wrong password does not verify", async () => {
    const stored = await hashPassword("correct horse battery");
    expect(await verifyPassword("correct horse batterz", stored)).toBe(false);
    expect(await verifyPassword("", stored)).toBe(false);
  });

  test("two hashes of the same password differ, and both verify", async () => {
    const a = await hashPassword("same password");
    const b = await hashPassword("same password");
    expect(a === b).toBe(false);
    expect(await verifyPassword("same password", a)).toBe(true);
    expect(await verifyPassword("same password", b)).toBe(true);
  });

  test("a malformed stored hash is false and never throws", async () => {
    const real = await hashPassword("abc12345");
    const parts = real.split("$");
    const bad = [
      "",
      "garbage",
      "scrypt",
      "scrypt$16384$8$1$onlyfive",
      "bcrypt$16384$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "scrypt$abc$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "scrypt$16385$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", // N not a power of two
      "scrypt$1073741824$8$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA", // would eat gigabytes
      "scrypt$16384$0$1$AAAAAAAAAAAAAAAAAAAAAA==$AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA",
      "scrypt$16384$8$1$$",
      `${parts.slice(0, 5).join("$")}$`, // hash missing
      `${parts.slice(0, 5).join("$")}$AAAA`, // hash too short
      `${real}$extra`,
    ];
    for (const stored of bad) expect(await verifyPassword("abc12345", stored)).toBe(false);
  });

  test("the dummy check is always false", async () => {
    expect(await verifyAgainstDummy("anything at all")).toBe(false);
  });
});

describe("session tokens", () => {
  test("tokens are long, url-safe and different each time", () => {
    const a = newSessionToken();
    const b = newSessionToken();
    expect(a.length).toBeGreaterThanOrEqual(43); // 32 bytes in base64url
    expect(/^[A-Za-z0-9_-]+$/.test(a)).toBe(true);
    expect(a === b).toBe(false);
  });

  test("the token hash is stable sha256 hex and not the token", () => {
    const t = "some-token";
    expect(hashToken(t)).toBe(hashToken(t));
    expect(/^[0-9a-f]{64}$/.test(hashToken(t))).toBe(true);
    expect(hashToken(t) === hashToken("other-token")).toBe(false);
    // sha256("abc"), a published test vector
    expect(hashToken("abc")).toBe("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
  });
});

describe("email", () => {
  test("is trimmed and lower-cased", () => {
    expect(normaliseEmail("  Finbar@Example.COM ")).toEqual({ ok: true, value: "finbar@example.com" });
  });

  test("rejects things that are not emails", () => {
    for (const bad of ["", "   ", "nope", "a@b", "a b@c.com", "@c.com", "a@.com", "a@@c.com", "a..b@c.com", 42, null, undefined, {}]) {
      expect(normaliseEmail(bad).ok).toBe(false);
    }
  });

  test("rejects an address over 254 characters", () => {
    expect(normaliseEmail(`${"a".repeat(250)}@b.co`).ok).toBe(false);
    expect(normaliseEmail(`${"a".repeat(64)}@b.co`).ok).toBe(true);
  });
});

describe("password rules", () => {
  test("10 to 200 characters", () => {
    expect(validatePassword("fishcakes").ok).toBe(false);
    expect(validatePassword("fishcakes!").ok).toBe(true);
    expect(validatePassword("x".repeat(199) + "y").ok).toBe(true);
    expect(validatePassword("x".repeat(200) + "y").ok).toBe(false);
  });

  test("must be a non-empty string, and is never trimmed", () => {
    expect(validatePassword("").ok).toBe(false);
    expect(validatePassword(undefined).ok).toBe(false);
    expect(validatePassword(1234567890).ok).toBe(false);
    expect(validatePassword("  spaces here  ")).toEqual({ ok: true, value: "  spaces here  " });
  });

  test("common passwords and one repeated character are refused, whatever the case", () => {
    expect(validatePassword("Password123").ok).toBe(false);
    expect(validatePassword("1234567890").ok).toBe(false);
    expect(validatePassword("zzzzzzzzzzzz").ok).toBe(false);
    expect(validatePassword("orange kettle bicycle").ok).toBe(true);
  });

  test("can't contain the email's name part", () => {
    expect(validatePassword("samjones2026", "samjones@example.com").ok).toBe(false);
    expect(validatePassword("orange kettle bicycle", "samjones@example.com").ok).toBe(true);
    // very short name parts are too likely to clash by chance
    expect(validatePassword("joeblogs-is-fine", "jo@example.com").ok).toBe(true);
  });
});

describe("invite codes", () => {
  test("are trimmed and lower-cased", () => {
    expect(normaliseInvite("  Beta-Friends ")).toEqual({ ok: true, value: "beta-friends" });
  });

  test("10 to 40 letters, numbers and dashes (short codes could be guessed)", () => {
    expect(normaliseInvite("abc").ok).toBe(false);
    expect(normaliseInvite("a".repeat(9)).ok).toBe(false);
    expect(normaliseInvite("a".repeat(10)).ok).toBe(true);
    expect(normaliseInvite("a".repeat(40)).ok).toBe(true);
    expect(normaliseInvite("a".repeat(41)).ok).toBe(false);
    for (const bad of ["has space", "under_score", "dot.dot", "emoji-\u{1F600}", "", "   ", 7, null, undefined]) {
      expect(normaliseInvite(bad).ok).toBe(false);
    }
  });
});

describe("new invite codes", () => {
  test("are 12 random hex characters and pass validation", () => {
    const a = newInviteCode(), b = newInviteCode();
    expect(a).toMatch(/^[0-9a-f]{12}$/);
    expect(a === b).toBe(false);
    expect(normaliseInvite(a).ok).toBe(true);
  });
});

describe("emails with control characters", () => {
  test("are refused", () => {
    expect(normaliseEmail("x\u001b]0;pwned\u0007@a.co").ok).toBe(false);
    expect(normaliseEmail("x\u009b@a.co").ok).toBe(false);
  });
});

describe("name", () => {
  test("is optional, trimmed and capped at 60", () => {
    expect(normaliseName(undefined)).toEqual({ ok: true, value: null });
    expect(normaliseName("   ")).toEqual({ ok: true, value: null });
    expect(normaliseName("  Ada   Lovelace ")).toEqual({ ok: true, value: "Ada Lovelace" });
    expect(normaliseName("x".repeat(60)).ok).toBe(true);
    expect(normaliseName("x".repeat(61)).ok).toBe(false);
    expect(normaliseName(5).ok).toBe(false);
  });
});
