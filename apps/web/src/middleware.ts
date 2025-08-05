import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // 匹配所有路径，除了：
  // - 以 `/api`, `/_next` 或 `/_vercel` 开头的路径
  // - 包含点的路径 (如 `favicon.ico`)
  matcher: '/((?!api|_next|_vercel|.*\\..*).*)'
};