import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import { ThemeProvider } from "@/components/theme-provider"

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params: { locale }
}: Props) {
  // 验证传入的locale是否有效
  if (!routing.locales.includes(locale as 'en' | 'zh')) {
    notFound();
  }

  // 获取对应语言的消息
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ThemeProvider>
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
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}