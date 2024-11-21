// is the main file for rendering stuff on the webpage. We import header and footer here --@Qamar

import Footer from '@/components/shared/footer'
import Header from '@/components/shared/header'
import React from 'react'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <main className="flex-1 wrapper">{children}</main>
      <Footer />
    </div>
  )
}
