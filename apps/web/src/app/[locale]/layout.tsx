import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'
import { TooltipProvider } from '@/components/ui/tooltip'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/AppSidebar'
import { FormStoreProvider } from '@/providers/form-store-provider'
import { SEOProvider } from '@/components/seo/SEOProvider'
import { generatePageMetadata } from '@/lib/seo/metadata'
import '../globals.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map(locale => ({ locale }))
}

export async function generateMetadata({ params }: Props) {
  const { locale } = await params
  return generatePageMetadata({ locale, page: 'home' })
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as 'en' | 'zh')) {
    notFound()
  }

  // 获取对应语言的消息
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <SEOProvider locale={locale} page="home">
          <NextIntlClientProvider messages={messages}>
            <FormStoreProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <SidebarProvider defaultOpen={true}>
                  <div className="min-h-screen flex w-full bg-background">
                    <AppSidebar />
                    <main className="flex-1 flex flex-col overflow-auto">
                      {children}
                    </main>
                  </div>
                </SidebarProvider>
              </TooltipProvider>
            </FormStoreProvider>
          </NextIntlClientProvider>
        </SEOProvider>
      </body>
    </html>
  )
}
