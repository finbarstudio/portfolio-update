import "server-only";
import { badRequest, failed, json, notConnected } from "./api";
import { getDb } from "./db";
import { getDoc, MAX_DOC_BYTES, parseWholeDoc, putDoc, readBodyUpTo, type WholeDocName } from "./app-docs";

/**
 * The route handlers for the three whole-document endpoints (ratings, removals, locks), which differ only by name.
 * Same semantics as the Tesco server: GET the document, POST replaces it whole. GET answers an empty document when
 * the database isn't connected (the page still opens); POST says so.
 */
export function wholeDocHandlers(name: WholeDocName): {
  GET: () => Promise<Response>;
  POST: (request: Request) => Promise<Response>;
} {
  return {
    async GET(): Promise<Response> {
      const sql = getDb();
      if (!sql) return json({});
      try {
        return json(await getDoc(sql, name));
      } catch (err) {
        return failed(err);
      }
    },
    async POST(request: Request): Promise<Response> {
      const sql = getDb();
      if (!sql) return notConnected();
      const body = await readBodyUpTo(request, MAX_DOC_BYTES);
      if (!body.ok) return badRequest(body.error, body.status);
      const doc = parseWholeDoc(name, body.body);
      if (!doc.ok) return badRequest(doc.error);
      try {
        await putDoc(sql, name, doc.value);
        return json({ ok: true });
      } catch (err) {
        return failed(err);
      }
    },
  };
}
