import { createNavigation } from 'next-intl/navigation';
import { routing } from './routing';

// 基于路由配置创建导航API的轻量级包装器
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);