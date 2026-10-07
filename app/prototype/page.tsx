/**
 * Legacy bookmark: product prototypes live in ad-dc/appdirect-prototype-template.
 * Render the same README as `/` (no redirect) so local/preview clients that mishandle
 * Next.js RSC redirects still see the right page.
 */
export { default } from '../HomeReadmePage';
