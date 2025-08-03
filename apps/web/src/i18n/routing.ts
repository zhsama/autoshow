import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  // 支持的语言列表
  locales: ['en', 'zh'],

  // 默认语言
  defaultLocale: 'en',

  // 路径前缀配置
  localePrefix: {
    mode: 'as-needed',
    // 默认语言不显示前缀，中文显示 /zh
    prefixes: {
      'zh': '/zh'
    }
  }
});