import antfu from '@antfu/eslint-config'

export default antfu(
  {
    // 基础配置：TypeScript 支持，Node.js 环境
    typescript: true,
    // 排除 apps/web 目录，让其使用专门的 Next.js 配置
    ignores: [
      'apps/web/**/*',
      'node_modules',
      'dist',
      '*.config.*',
      '.next',
      'build',
      'coverage'
    ]
  },
  {
    // 针对 packages 目录的 TypeScript + Node.js 规则
    files: ['packages/**/*.{js,ts,jsx,tsx}'],
    rules: {
      // Node.js 包的通用规则
      'no-console': 'warn', // 允许 console，但给出警告
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_|^error$|^err$',
        varsIgnorePattern: '^_|^error$|^err$' 
      }],
      // 放宽一些严格规则，适合库开发
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/ban-ts-comment': 'warn',
      // 允许 require 语句（Node.js 环境）
      '@typescript-eslint/no-var-requires': 'off',
      // 允许 Node.js 全局变量 (适合 Node.js 包开发)
      'node/prefer-global/process': 'off',
      'node/prefer-global/buffer': 'off',
      // 放宽一些 perfectionist 规则
      'perfectionist/sort-imports': 'warn',
      // 允许传统的 isNaN (某些场景下更合适)
      'unicorn/prefer-number-properties': 'warn'
    }
  },
  {
    // 针对测试文件的特殊规则
    files: ['**/*.test.{js,ts}', '**/*.spec.{js,ts}'],
    rules: {
      // 测试文件允许更宽松的规则
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  }
)