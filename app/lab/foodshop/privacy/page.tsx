import type { Metadata } from "next";
import Link from "next/link";
import { LOGIN_PATH, SETTINGS_PATH } from "@/lib/food-shop/paths";

export const metadata: Metadata = { title: "Privacy · Food Shop (beta)", robots: { index: false, follow: false } };

const UPDATED = "28 October 2026";

/** The privacy notice (UK GDPR). Plain words; keep it in step with what the code actually stores. */
export default function PrivacyPage() {
  return (
    <div className="fs-page fs-prose">
      <h1>Privacy</h1>
      <p className="muted">Food Shop is a small beta for friends, run by Finbar at Finbar Studio (finbar.studio). Last updated {UPDATED}.</p>

      <section className="fs-card">
        <h2>What is stored</h2>
        <ul>
          <li>
            <b>Your account:</b> email, first name if you gave one, and your password as a one-way scrambled hash (scrypt). Nobody, Finbar included, can read your
            password.
          </li>
          <li>
            <b>Your settings:</b> postcode, goal, what you watch, diet, foods you avoid, allergies, kitchen, Clubcard and budget.
          </li>
          <li>
            <b>What you do in the shop:</b> your basket, taste ratings, removed and locked items, and past shops.
          </li>
          <li>
            <b>&quot;Not available to me&quot; reports:</b> the product and your postcode area (e.g. BR7), so it&apos;s hidden for people near you. Others only ever see
            that it&apos;s hidden, never who reported it.
          </li>
          <li>
            <b>Security:</b> one login cookie (needed to keep you logged in, so there&apos;s no cookie banner), and failed login tries with the email and IP
            address, kept for a day to stop password guessing.
          </li>
        </ul>
        <p>
          No analytics, adverts or tracking cookies. Nothing is sold or shared. Your data is never sent to Tesco, and the shop never asks for card details.
        </p>
      </section>

      <section className="fs-card">
        <h2>Diet and allergies</h2>
        <p>
          Allergies and diet can count as health or belief information, which the law treats with extra care. They&apos;re optional and only used to hide products
          from you. By adding them you agree to them being stored for that. Remove them in Settings any time.
        </p>
      </section>

      <section className="fs-card">
        <h2>Why, and for how long</h2>
        <p>
          To run the account you asked for (the legal basis is providing that service to you; for allergies and diet it&apos;s your consent). Everything is kept
          while you have an account and deleted when you delete it. Accounts unused for 12 months are deleted, and if the beta ends, all accounts are.
        </p>
      </section>

      <section className="fs-card">
        <h2>Where it lives</h2>
        <p>
          The database is hosted by Neon and the site by Vercel, both in the United States (Virginia). Both are bound by data-protection agreements that cover
          transfers from the UK. Cloudflare holds the product list only, with nothing about you. Connections are encrypted (HTTPS).
        </p>
      </section>

      <section className="fs-card">
        <h2>Your rights</h2>
        <ul>
          <li>
            <b>See it:</b> download everything stored about you from <Link href={SETTINGS_PATH}>Settings</Link>.
          </li>
          <li>
            <b>Change it:</b> edit your settings any time.
          </li>
          <li>
            <b>Delete it:</b> delete your account in Settings. It&apos;s gone straight away, not kept in a bin.
          </li>
          <li>
            <b>Ask or complain:</b> email finbar@finbar.studio. You can also complain to the Information Commissioner&apos;s Office at{" "}
            <a href="https://ico.org.uk/make-a-complaint/" rel="noreferrer">
              ico.org.uk
            </a>
            .
          </li>
        </ul>
      </section>

      <section className="fs-card">
        <h2>Your password</h2>
        <p>
          Use one you don&apos;t use anywhere else; three random words works well. It needs at least 10 characters, and very common ones are refused. If you forget
          it, Finbar can set a new one for you to change.
        </p>
      </section>

      <p>
        <Link href={LOGIN_PATH}>Back</Link>
      </p>
    </div>
  );
}
