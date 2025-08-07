# E2E自动化测试 - Playwright实现

基于AutoShow项目的用户管理系统端到端测试自动化实现，使用Playwright框架。

## 1. Playwright环境配置

### 安装和初始化

**package.json 依赖添加**

```json
{
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "playwright": "^1.40.0"
  },
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:headed": "playwright test --headed",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

**playwright.config.ts**

```typescript
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/results.xml' }],
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  webServer: {
    command: 'pnpm dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})
```

## 2. 页面对象模型 (POM)

### 基础页面类

**e2e/pages/BasePage.ts**

```typescript
import { expect, Locator, Page } from '@playwright/test'

export class BasePage {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  async goto(path: string) {
    await this.page.goto(path)
  }

  async waitForLoadingToFinish() {
    await this.page.waitForLoadState('networkidle')
  }

  async takeScreenshot(name: string) {
    await this.page.screenshot({ path: `screenshots/${name}.png` })
  }

  async getTitle(): Promise<string> {
    return await this.page.title()
  }

  async isElementVisible(selector: string): Promise<boolean> {
    try {
      const element = this.page.locator(selector)
      await element.waitFor({ state: 'visible', timeout: 5000 })
      return true
    } catch {
      return false
    }
  }

  async clickAndWait(selector: string, waitForSelector?: string) {
    await this.page.click(selector)
    if (waitForSelector) {
      await this.page.waitForSelector(waitForSelector)
    }
    await this.waitForLoadingToFinish()
  }

  async fillAndWait(selector: string, value: string) {
    await this.page.fill(selector, value)
    await this.page.waitForTimeout(100) // 短暂等待确保输入完成
  }
}
```

### 登录页面

**e2e/pages/LoginPage.ts**

```typescript
import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class LoginPage extends BasePage {
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly loginButton: Locator
  readonly registerLink: Locator
  readonly forgotPasswordLink: Locator
  readonly errorMessage: Locator
  readonly successMessage: Locator

  constructor(page: Page) {
    super(page)
    this.emailInput = page.locator('[data-testid="email-input"]')
    this.passwordInput = page.locator('[data-testid="password-input"]')
    this.loginButton = page.locator('[data-testid="login-button"]')
    this.registerLink = page.locator('[data-testid="register-link"]')
    this.forgotPasswordLink = page.locator(
      '[data-testid="forgot-password-link"]'
    )
    this.errorMessage = page.locator('[data-testid="error-message"]')
    this.successMessage = page.locator('[data-testid="success-message"]')
  }

  async navigateToLogin() {
    await this.goto('/login')
    await expect(this.emailInput).toBeVisible()
  }

  async login(email: string, password: string) {
    await this.fillAndWait('[data-testid="email-input"]', email)
    await this.fillAndWait('[data-testid="password-input"]', password)
    await this.clickAndWait('[data-testid="login-button"]')
  }

  async expectLoginSuccess() {
    // 检查是否重定向到仪表板
    await expect(this.page).toHaveURL('/dashboard')
    await this.waitForLoadingToFinish()
  }

  async expectLoginError(errorText?: string) {
    await expect(this.errorMessage).toBeVisible()
    if (errorText) {
      await expect(this.errorMessage).toContainText(errorText)
    }
  }

  async goToRegister() {
    await this.registerLink.click()
    await expect(this.page).toHaveURL('/register')
  }

  async goToForgotPassword() {
    await this.forgotPasswordLink.click()
    await expect(this.page).toHaveURL('/forgot-password')
  }

  async isFormValid(): Promise<boolean> {
    const emailValue = await this.emailInput.inputValue()
    const passwordValue = await this.passwordInput.inputValue()
    return emailValue.length > 0 && passwordValue.length > 0
  }
}
```

### 注册页面

**e2e/pages/RegisterPage.ts**

```typescript
import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class RegisterPage extends BasePage {
  readonly usernameInput: Locator
  readonly emailInput: Locator
  readonly passwordInput: Locator
  readonly confirmPasswordInput: Locator
  readonly registerButton: Locator
  readonly loginLink: Locator
  readonly errorMessage: Locator
  readonly successMessage: Locator
  readonly termsCheckbox: Locator

  constructor(page: Page) {
    super(page)
    this.usernameInput = page.locator('[data-testid="username-input"]')
    this.emailInput = page.locator('[data-testid="email-input"]')
    this.passwordInput = page.locator('[data-testid="password-input"]')
    this.confirmPasswordInput = page.locator(
      '[data-testid="confirm-password-input"]'
    )
    this.registerButton = page.locator('[data-testid="register-button"]')
    this.loginLink = page.locator('[data-testid="login-link"]')
    this.errorMessage = page.locator('[data-testid="error-message"]')
    this.successMessage = page.locator('[data-testid="success-message"]')
    this.termsCheckbox = page.locator('[data-testid="terms-checkbox"]')
  }

  async navigateToRegister() {
    await this.goto('/register')
    await expect(this.usernameInput).toBeVisible()
  }

  async register(userData: {
    username: string
    email: string
    password: string
    confirmPassword?: string
    acceptTerms?: boolean
  }) {
    await this.fillAndWait('[data-testid="username-input"]', userData.username)
    await this.fillAndWait('[data-testid="email-input"]', userData.email)
    await this.fillAndWait('[data-testid="password-input"]', userData.password)
    await this.fillAndWait(
      '[data-testid="confirm-password-input"]',
      userData.confirmPassword || userData.password
    )

    if (userData.acceptTerms !== false) {
      await this.termsCheckbox.check()
    }

    await this.clickAndWait('[data-testid="register-button"]')
  }

  async expectRegistrationSuccess() {
    await expect(this.successMessage).toBeVisible()
    await expect(this.successMessage).toContainText('注册成功')
  }

  async expectRegistrationError(errorText?: string) {
    await expect(this.errorMessage).toBeVisible()
    if (errorText) {
      await expect(this.errorMessage).toContainText(errorText)
    }
  }

  async validatePasswordStrength(): Promise<string> {
    const strengthIndicator = this.page.locator(
      '[data-testid="password-strength"]'
    )
    await expect(strengthIndicator).toBeVisible()
    return (await strengthIndicator.textContent()) || ''
  }
}
```

### 仪表板页面

**e2e/pages/DashboardPage.ts**

```typescript
import { expect, Locator, Page } from '@playwright/test'
import { BasePage } from './BasePage'

export class DashboardPage extends BasePage {
  readonly userMenu: Locator
  readonly logoutButton: Locator
  readonly profileLink: Locator
  readonly settingsLink: Locator
  readonly showNotesSection: Locator
  readonly createShowNoteButton: Locator
  readonly welcomeMessage: Locator

  constructor(page: Page) {
    super(page)
    this.userMenu = page.locator('[data-testid="user-menu"]')
    this.logoutButton = page.locator('[data-testid="logout-button"]')
    this.profileLink = page.locator('[data-testid="profile-link"]')
    this.settingsLink = page.locator('[data-testid="settings-link"]')
    this.showNotesSection = page.locator('[data-testid="show-notes-section"]')
    this.createShowNoteButton = page.locator(
      '[data-testid="create-show-note-button"]'
    )
    this.welcomeMessage = page.locator('[data-testid="welcome-message"]')
  }

  async expectDashboardLoaded() {
    await expect(this.welcomeMessage).toBeVisible()
    await expect(this.showNotesSection).toBeVisible()
  }

  async logout() {
    await this.userMenu.click()
    await this.logoutButton.click()
    await expect(this.page).toHaveURL('/login')
  }

  async goToProfile() {
    await this.userMenu.click()
    await this.profileLink.click()
    await expect(this.page).toHaveURL('/profile')
  }

  async createShowNote() {
    await this.createShowNoteButton.click()
    await expect(this.page).toHaveURL(/\/show-notes\/create/)
  }

  async getShowNotesCount(): Promise<number> {
    const showNotes = this.page.locator('[data-testid="show-note-item"]')
    return await showNotes.count()
  }
}
```

## 3. 认证流程测试

**e2e/tests/auth.spec.ts**

```typescript
import { expect, test } from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'
import { RegisterPage } from '../pages/RegisterPage'

test.describe('用户认证流程', () => {
  test.beforeEach(async ({ page }) => {
    // 清理所有cookies和localStorage
    await page.context().clearCookies()
    await page.evaluate(() => localStorage.clear())
  })

  test('用户注册流程', async ({ page }) => {
    const registerPage = new RegisterPage(page)
    const loginPage = new LoginPage(page)

    await registerPage.navigateToRegister()

    // 测试有效注册
    await registerPage.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'SecurePass123!',
    })

    await registerPage.expectRegistrationSuccess()

    // 验证可以使用新账户登录
    await loginPage.navigateToLogin()
    await loginPage.login('test@example.com', 'SecurePass123!')
    await loginPage.expectLoginSuccess()
  })

  test('用户登录流程', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    await loginPage.navigateToLogin()

    // 测试有效登录
    await loginPage.login('admin@example.com', 'AdminPass123!')
    await loginPage.expectLoginSuccess()
    await dashboardPage.expectDashboardLoaded()
  })

  test('登录表单验证', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.navigateToLogin()

    // 测试空表单提交
    await loginPage.loginButton.click()
    await expect(page.locator('[data-testid="email-error"]')).toBeVisible()
    await expect(page.locator('[data-testid="password-error"]')).toBeVisible()

    // 测试无效邮箱格式
    await loginPage.login('invalid-email', 'password')
    await expect(page.locator('[data-testid="email-error"]')).toContainText(
      '邮箱格式无效'
    )

    // 测试错误凭据
    await loginPage.login('wrong@example.com', 'wrongpassword')
    await loginPage.expectLoginError('凭据无效')
  })

  test('注册表单验证', async ({ page }) => {
    const registerPage = new RegisterPage(page)

    await registerPage.navigateToRegister()

    // 测试密码不匹配
    await registerPage.register({
      username: 'testuser',
      email: 'test@example.com',
      password: 'SecurePass123!',
      confirmPassword: 'DifferentPass123!',
    })
    await registerPage.expectRegistrationError('密码不匹配')

    // 测试弱密码
    await registerPage.register({
      username: 'testuser',
      email: 'test@example.com',
      password: '123456',
    })
    await registerPage.expectRegistrationError('密码强度不足')

    // 测试用户名长度
    await registerPage.register({
      username: 'ab',
      email: 'test@example.com',
      password: 'SecurePass123!',
    })
    await registerPage.expectRegistrationError('用户名长度')
  })

  test('用户登出流程', async ({ page }) => {
    const loginPage = new LoginPage(page)
    const dashboardPage = new DashboardPage(page)

    // 先登录
    await loginPage.navigateToLogin()
    await loginPage.login('admin@example.com', 'AdminPass123!')
    await loginPage.expectLoginSuccess()

    // 登出
    await dashboardPage.logout()

    // 验证已重定向到登录页面
    await expect(page).toHaveURL('/login')

    // 验证无法直接访问受保护页面
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')
  })

  test('记住登录状态', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.navigateToLogin()
    await loginPage.login('admin@example.com', 'AdminPass123!')
    await loginPage.expectLoginSuccess()

    // 刷新页面，应该仍然保持登录状态
    await page.reload()
    await expect(page).toHaveURL('/dashboard')
  })
})
```

## 4. 权限控制测试

**e2e/tests/authorization.spec.ts**

```typescript
import { expect, test } from '@playwright/test'
import { DashboardPage } from '../pages/DashboardPage'
import { LoginPage } from '../pages/LoginPage'

test.describe('权限控制测试', () => {
  test('管理员权限访问', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.navigateToLogin()
    await loginPage.login('admin@example.com', 'AdminPass123!')
    await loginPage.expectLoginSuccess()

    // 管理员应该能访问用户管理页面
    await page.goto('/admin/users')
    await expect(page).toHaveURL('/admin/users')
    await expect(page.locator('[data-testid="users-table"]')).toBeVisible()

    // 管理员应该能看到删除用户按钮
    await expect(
      page.locator('[data-testid="delete-user-button"]').first()
    ).toBeVisible()
  })

  test('普通用户权限限制', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.navigateToLogin()
    await loginPage.login('user@example.com', 'UserPass123!')
    await loginPage.expectLoginSuccess()

    // 普通用户不应该能访问管理页面
    await page.goto('/admin/users')
    await expect(page).toHaveURL('/403') // 或者重定向到无权限页面

    // 或者显示无权限消息
    await expect(page.locator('[data-testid="access-denied"]')).toBeVisible()
  })

  test('未认证用户重定向', async ({ page }) => {
    // 直接访问受保护页面
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/login')

    await page.goto('/admin/users')
    await expect(page).toHaveURL('/login')

    await page.goto('/profile')
    await expect(page).toHaveURL('/login')
  })

  test('用户只能编辑自己的资料', async ({ page }) => {
    const loginPage = new LoginPage(page)

    await loginPage.navigateToLogin()
    await loginPage.login('user@example.com', 'UserPass123!')
    await loginPage.expectLoginSuccess()

    // 用户可以访问自己的资料页面
    await page.goto('/profile')
    await expect(page).toHaveURL('/profile')
    await expect(
      page.locator('[data-testid="edit-profile-form"]')
    ).toBeVisible()

    // 用户不应该能编辑其他用户的资料
    await page.goto('/users/admin/profile')
    await expect(page).toHaveURL('/403')
  })
})
```

## 5. UI组件测试

**e2e/tests/ui-components.spec.ts**

```typescript
import { expect, test } from '@playwright/test'

test.describe('UI组件测试', () => {
  test('响应式导航菜单', async ({ page }) => {
    await page.goto('/')

    // 桌面视图
    await page.setViewportSize({ width: 1200, height: 800 })
    await expect(page.locator('[data-testid="desktop-nav"]')).toBeVisible()
    await expect(
      page.locator('[data-testid="mobile-menu-button"]')
    ).not.toBeVisible()

    // 移动视图
    await page.setViewportSize({ width: 375, height: 667 })
    await expect(page.locator('[data-testid="desktop-nav"]')).not.toBeVisible()
    await expect(
      page.locator('[data-testid="mobile-menu-button"]')
    ).toBeVisible()

    // 测试移动菜单
    await page.click('[data-testid="mobile-menu-button"]')
    await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()
  })

  test('主题切换功能', async ({ page }) => {
    await page.goto('/')

    const themeToggle = page.locator('[data-testid="theme-toggle"]')
    await expect(themeToggle).toBeVisible()

    // 检查初始主题
    const initialTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    )

    // 切换主题
    await themeToggle.click()

    const newTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    )

    expect(newTheme).not.toBe(initialTheme)

    // 验证主题持久化
    await page.reload()
    const persistedTheme = await page.evaluate(() =>
      document.documentElement.getAttribute('data-theme')
    )
    expect(persistedTheme).toBe(newTheme)
  })

  test('表单输入验证反馈', async ({ page }) => {
    await page.goto('/register')

    const emailInput = page.locator('[data-testid="email-input"]')
    const emailError = page.locator('[data-testid="email-error"]')

    // 测试实时验证
    await emailInput.fill('invalid-email')
    await emailInput.blur()
    await expect(emailError).toBeVisible()
    await expect(emailError).toContainText('邮箱格式无效')

    // 测试修正后的验证
    await emailInput.fill('valid@example.com')
    await emailInput.blur()
    await expect(emailError).not.toBeVisible()
  })

  test('加载状态和错误处理', async ({ page }) => {
    await page.goto('/login')

    // 模拟慢网络
    await page.route('**/api/auth/login', async route => {
      await page.waitForTimeout(2000) // 2秒延迟
      await route.continue()
    })

    const loginButton = page.locator('[data-testid="login-button"]')
    const loadingSpinner = page.locator('[data-testid="loading-spinner"]')

    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password')
    await loginButton.click()

    // 验证加载状态
    await expect(loadingSpinner).toBeVisible()
    await expect(loginButton).toBeDisabled()

    // 等待加载完成
    await expect(loadingSpinner).not.toBeVisible()
    await expect(loginButton).toBeEnabled()
  })
})
```

## 6. 性能测试

**e2e/tests/performance.spec.ts**

```typescript
import { expect, test } from '@playwright/test'

test.describe('性能测试', () => {
  test('页面加载性能', async ({ page }) => {
    const startTime = Date.now()

    await page.goto('/')
    await page.waitForLoadState('networkidle')

    const loadTime = Date.now() - startTime
    console.log(`页面加载时间: ${loadTime}ms`)

    expect(loadTime).toBeLessThan(3000) // 3秒内加载完成
  })

  test('Core Web Vitals', async ({ page }) => {
    await page.goto('/')

    // 测量LCP (Largest Contentful Paint)
    const lcp = await page.evaluate(() => {
      return new Promise(resolve => {
        new PerformanceObserver(list => {
          const entries = list.getEntries()
          const lastEntry = entries[entries.length - 1]
          resolve(lastEntry.startTime)
        }).observe({ entryTypes: ['largest-contentful-paint'] })
      })
    })

    console.log(`LCP: ${lcp}ms`)
    expect(lcp).toBeLessThan(2500) // LCP应该小于2.5秒

    // 测量CLS (Cumulative Layout Shift)
    const cls = await page.evaluate(() => {
      return new Promise(resolve => {
        let clsValue = 0
        new PerformanceObserver(list => {
          for (const entry of list.getEntries()) {
            if (!(entry as any).hadRecentInput) {
              clsValue += (entry as any).value
            }
          }
          resolve(clsValue)
        }).observe({ entryTypes: ['layout-shift'] })

        setTimeout(() => resolve(clsValue), 5000)
      })
    })

    console.log(`CLS: ${cls}`)
    expect(cls).toBeLessThan(0.1) // CLS应该小于0.1
  })

  test('API响应时间', async ({ page }) => {
    await page.goto('/login')

    // 监控API请求
    const apiResponses: number[] = []

    page.on('response', response => {
      if (response.url().includes('/api/')) {
        const timing = response.timing()
        const responseTime = timing.responseEnd - timing.requestStart
        apiResponses.push(responseTime)
        console.log(`API响应时间: ${response.url()} - ${responseTime}ms`)
      }
    })

    await page.fill('[data-testid="email-input"]', 'test@example.com')
    await page.fill('[data-testid="password-input"]', 'password')
    await page.click('[data-testid="login-button"]')

    await page.waitForTimeout(2000) // 等待API调用完成

    // 验证所有API响应时间
    apiResponses.forEach(time => {
      expect(time).toBeLessThan(1000) // 1秒内响应
    })
  })
})
```

## 7. 跨浏览器测试

**e2e/tests/cross-browser.spec.ts**

```typescript
import { devices, expect, test } from '@playwright/test'

const browsers = ['chromium', 'firefox', 'webkit']

browsers.forEach(browserName => {
  test.describe(`${browserName} 兼容性测试`, () => {
    test(`基本功能在 ${browserName} 中正常工作`, async ({ page }) => {
      await page.goto('/')

      // 验证关键元素存在
      await expect(
        page.locator('[data-testid="main-navigation"]')
      ).toBeVisible()
      await expect(page.locator('[data-testid="hero-section"]')).toBeVisible()

      // 测试导航
      await page.click('[data-testid="login-link"]')
      await expect(page).toHaveURL('/login')

      // 测试表单交互
      await page.fill('[data-testid="email-input"]', 'test@example.com')
      await page.fill('[data-testid="password-input"]', 'password')

      const emailValue = await page.inputValue('[data-testid="email-input"]')
      expect(emailValue).toBe('test@example.com')
    })

    test(`CSS样式在 ${browserName} 中正确渲染`, async ({ page }) => {
      await page.goto('/')

      // 检查关键样式
      const headerBg = await page
        .locator('header')
        .evaluate(el => getComputedStyle(el).backgroundColor)
      expect(headerBg).toBeTruthy()

      // 检查响应式设计
      await page.setViewportSize({ width: 375, height: 667 })
      const mobileMenu = page.locator('[data-testid="mobile-menu-button"]')
      await expect(mobileMenu).toBeVisible()
    })
  })
})

// 移动设备测试
const mobileDevices = [
  devices['iPhone 12'],
  devices['Samsung Galaxy S21'],
  devices['iPad Pro'],
]

mobileDevices.forEach(device => {
  test.describe(`${device.userAgent} 移动端测试`, () => {
    test.use(device)

    test(`移动端功能测试 - ${device.userAgent}`, async ({ page }) => {
      await page.goto('/')

      // 测试触摸交互
      await page.tap('[data-testid="mobile-menu-button"]')
      await expect(page.locator('[data-testid="mobile-nav"]')).toBeVisible()

      // 测试表单在移动设备上的行为
      await page.goto('/login')
      await page.fill('[data-testid="email-input"]', 'test@example.com')

      // 验证虚拟键盘不遮挡输入框
      const inputBox = await page
        .locator('[data-testid="email-input"]')
        .boundingBox()
      expect(inputBox?.y).toBeGreaterThan(100) // 确保输入框可见
    })
  })
})
```

## 8. 测试数据管理

**e2e/fixtures/test-data.ts**

```typescript
export const testUsers = {
  admin: {
    email: 'admin@example.com',
    password: 'AdminPass123!',
    username: 'admin',
    role: 'admin',
  },
  user: {
    email: 'user@example.com',
    password: 'UserPass123!',
    username: 'testuser',
    role: 'user',
  },
  newUser: {
    email: 'newuser@example.com',
    password: 'NewUserPass123!',
    username: 'newuser',
    role: 'user',
  },
}

export const testShowNotes = {
  sample: {
    title: 'Test Show Note',
    content: 'This is a test show note content',
    publishDate: '2024-01-01',
  },
}

export const invalidInputs = {
  weakPasswords: ['123456', 'password', 'abc123'],
  invalidEmails: ['invalid', '@domain.com', 'user@', 'user..user@domain.com'],
  sqlInjection: ["'; DROP TABLE users; --", "' OR '1'='1"],
  xssPayloads: [
    '<script>alert("xss")</script>',
    '<img src="x" onerror="alert(1)">',
  ],
}
```

**e2e/helpers/auth-helper.ts**

```typescript
import { Page } from '@playwright/test'
import { testUsers } from '../fixtures/test-data'

export class AuthHelper {
  static async loginAsAdmin(page: Page) {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', testUsers.admin.email)
    await page.fill('[data-testid="password-input"]', testUsers.admin.password)
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  }

  static async loginAsUser(page: Page) {
    await page.goto('/login')
    await page.fill('[data-testid="email-input"]', testUsers.user.email)
    await page.fill('[data-testid="password-input"]', testUsers.user.password)
    await page.click('[data-testid="login-button"]')
    await page.waitForURL('/dashboard')
  }

  static async logout(page: Page) {
    await page.click('[data-testid="user-menu"]')
    await page.click('[data-testid="logout-button"]')
    await page.waitForURL('/login')
  }

  static async clearAuth(page: Page) {
    await page.context().clearCookies()
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
  }
}
```

## 9. 测试报告和监控

**e2e/helpers/test-reporter.ts**

```typescript
import { Reporter, TestCase, TestResult } from '@playwright/test/reporter'

class CustomReporter implements Reporter {
  private results: TestResult[] = []

  onTestEnd(test: TestCase, result: TestResult) {
    this.results.push(result)

    if (result.status === 'failed') {
      console.log(`❌ 测试失败: ${test.title}`)
      console.log(`错误: ${result.error?.message}`)
    } else if (result.status === 'passed') {
      console.log(`✅ 测试通过: ${test.title} (${result.duration}ms)`)
    }
  }

  onEnd() {
    const passed = this.results.filter(r => r.status === 'passed').length
    const failed = this.results.filter(r => r.status === 'failed').length
    const total = this.results.length

    console.log('\n📊 测试摘要:')
    console.log(`总计: ${total}`)
    console.log(`通过: ${passed}`)
    console.log(`失败: ${failed}`)
    console.log(`成功率: ${((passed / total) * 100).toFixed(2)}%`)

    // 生成详细报告
    this.generateDetailedReport()
  }

  private generateDetailedReport() {
    const report = {
      timestamp: new Date().toISOString(),
      results: this.results.map(result => ({
        title: result.test?.title,
        status: result.status,
        duration: result.duration,
        error: result.error?.message,
      })),
    }

    require('node:fs').writeFileSync(
      'test-results/e2e-report.json',
      JSON.stringify(report, null, 2)
    )
  }
}

export default CustomReporter
```

## 10. CI/CD集成

**github/workflows/e2e-tests.yml**

```yaml
name: E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  e2e-tests:
    runs-on: ubuntu-latest

    strategy:
      matrix:
        browser: [chromium, firefox, webkit]

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: pnpm

      - name: Install pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Install Playwright
        run: pnpm exec playwright install ${{ matrix.browser }}

      - name: Build application
        run: pnpm build

      - name: Run E2E tests
        run: pnpm test:e2e --project=${{ matrix.browser }}
        env:
          CI: true

      - name: Upload test results
        uses: actions/upload-artifact@v3
        if: always()
        with:
          name: e2e-results-${{ matrix.browser }}
          path: test-results/

      - name: Upload screenshots
        uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: screenshots-${{ matrix.browser }}
          path: screenshots/
```

这套E2E测试实现提供了：

1. ✅ **完整的页面对象模型** - 可维护的测试结构
2. ✅ **全面的用户流程测试** - 注册、登录、权限控制
3. ✅ **跨浏览器兼容性验证** - Chrome、Firefox、Safari
4. ✅ **移动端响应式测试** - 多设备兼容性
5. ✅ **性能监控** - Core Web Vitals测量
6. ✅ **自动化CI/CD集成** - GitHub Actions
7. ✅ **详细的测试报告** - 结果分析和错误追踪

所有测试都基于Shiro风格的用户体验设计，确保用户管理系统的质量和可靠性。
