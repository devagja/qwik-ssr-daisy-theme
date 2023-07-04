/**
 * WHAT IS THIS FILE?
 *
 * SSR entry point, in all cases the application is render outside the browser, this
 * entry point will be the common one.
 *
 * - Server (express, cloudflare...)
 * - npm run start
 * - npm run preview
 * - npm run build
 *
 */
import { isDev } from '@builder.io/qwik/build';
import type {
  RenderOptions,
  RenderToStreamOptions,
} from '@builder.io/qwik/server';
import { renderToStream } from '@builder.io/qwik/server';
// eslint-disable-next-line import/no-unresolved
import { manifest } from '@qwik-client-manifest';

import { DEFAULT_THEME } from './conf';
import Root from './root';

export function extractBase({ serverData }: RenderOptions): string {
  if (!isDev && serverData?.locale) {
    return '/build/' + serverData.locale;
  } else {
    return '/build';
  }
}

const cookiesToObject = (cookie: string) => {
  return cookie.split('; ').reduce((prev: any, current) => {
    const [name, ...value] = current.split('=');
    prev[name] = value.join('=');
    return prev;
  }, {});
};

export default function (opts: RenderToStreamOptions) {
  const cookie = opts.serverData?.requestHeaders.cookie;

  const dataTheme = cookie
    ? cookiesToObject(cookie)['data-theme']
    : DEFAULT_THEME;

  return renderToStream(<Root />, {
    manifest,
    ...opts,
    // Determine the base URL for the client code
    base: extractBase,
    // Use container attributes to set attributes on the html tag.
    containerAttributes: {
      'data-theme': dataTheme,
      ...opts.containerAttributes,
    },
  });
}
