import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/react';
import { ThemeProvider } from "@/components/providers/theme-provider"
import AuthProvider from '@/components/providers/auth-provider'
import localFont from 'next/font/local'

const inter = Inter({ subsets: ['latin'] })
const quicksliver = localFont({ src: '../public/Quicksilver.ttf', variable: '--font-quicksilver' })

export const metadata: Metadata = {
  title: 'TestQuick',
  description: 'The ultimate testing toolkit for educators- TestQuick Toolkit is designed for creating, administering, and grading exams with ease.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${quicksliver.variable} font-sans`}>
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Analytics />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}