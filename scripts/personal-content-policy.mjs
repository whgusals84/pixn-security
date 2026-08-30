export const PERSONAL_ONLY_ROUTES = Object.freeze([
  '/about/uses/',
  '/contact/',
  '/blog/2020/three-my-goals-for-2020/',
  '/blog/2025/owasp-seoul-meetup/',
  '/ko/blog/2025/owasp-seoul-meetup/',
  '/posts/2026/10years/',
  '/ko/posts/2026/10years/',
  '/posts/2026/i-ve-joined-the-kemal-core-team/',
  '/ko/posts/2026/i-ve-joined-the-kemal-core-team/',
  '/projects/nodecaf/privacy/',
  '/projects/nodecaf/support/',
  '/projects/textnova/privacy/',
  '/projects/textnova/support/',
]);

export const DERIVED_EMPTY_ROUTES = Object.freeze([
  '/tags/announcement/',
  '/ko/tags/announcement/',
  '/tags/kemal/',
  '/ko/tags/kemal/',
]);

export const REMOVED_DISCOVERY_ROUTES = Object.freeze([...PERSONAL_ONLY_ROUTES, ...DERIVED_EMPTY_ROUTES]);
