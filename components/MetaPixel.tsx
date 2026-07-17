"use client";

/**
 * MetaPixel — the Meta (Facebook) base pixel, site-wide.
 *
 * Gated on NEXT_PUBLIC_META_PIXEL_ID so the component ships before the pixel
 * ID exists: with the env var unset it renders nothing and does nothing. Once
 * Finbar adds the ID (Vercel env + redeploy), every page fires PageView on
 * load AND on client-side route changes (App Router navigations don't reload
 * the page, so the initial snippet alone would undercount by almost every
 * navigation).
 *
 * The /free-redesign landing page layers a Schedule conversion event on top of
 * this (see FreeRedesign) — that's the signal Meta optimises ad delivery
 * against; this base pixel is what builds the retargeting audience.
 */

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

const PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export default function MetaPixel() {
  const pathname = usePathname();
  const first = useRef(true);

  // SPA route changes: the base snippet fires the FIRST PageView itself, so
  // skip the mount run and track every navigation after it.
  useEffect(() => {
    if (!PIXEL_ID) return;
    if (first.current) { first.current = false; return; }
    window.fbq?.("track", "PageView");
  }, [pathname]);

  if (!PIXEL_ID) return null;

  return (
    <>
      <Script id="meta-pixel" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${PIXEL_ID}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
