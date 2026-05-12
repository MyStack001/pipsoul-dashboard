import "./globals.css"
import ThemeClient from "./theme-client"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-900">
        <ThemeClient>
          {children}
        </ThemeClient>
      </body>
    </html>
  )
}