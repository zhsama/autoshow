export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',     // 新功能
        'fix',      // 修复bug
        'docs',     // 文档更新
        'style',    // 代码格式化
        'refactor', // 重构
        'perf',     // 性能优化
        'test',     // 添加测试
        'chore',    // 构建过程或辅助工具的变动
        'build',    // 构建系统或外部依赖项的更改
        'ci',       // CI配置文件和脚本的更改
        'revert'    // 回滚commit
      ]
    ],
    'subject-min-length': [2, 'always', 5],
    'subject-max-length': [2, 'always', 100],
    'header-max-length': [2, 'always', 120]
  }
};