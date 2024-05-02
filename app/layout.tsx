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

/*
TestQuick: Testing Platform & AI Toolkit For Educators
Copyright (C) 2024  Jackson Youkstetter

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as
published by the Free Software Foundation, either version 3 of the
License, or (at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/