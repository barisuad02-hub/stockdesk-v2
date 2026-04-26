import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'STOCKDESK — DSE Market Intelligence',
  description: 'AI-powered stock research terminal for Bangladesh DSE investors',
  icons: {
    icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'><rect width='32' height='32' rx='6' fill='%2300c389'/><text x='16' y='22' text-anchor='middle' font-size='13' font-weight='800' fill='%230d1117' font-family='system-ui'>SD</text></svg>"
  }
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
