"use client"

import { useEffect, useState } from "react"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [dark, setDark] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem("theme")
    if (saved === "dark") {
      setDark(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  const toggleTheme = () => {
    const newTheme = dark ? "light" : "dark"
    setDark(!dark)

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
  <html lang="en">
    <body
      className={`min-h-screen transition-colors duration-300 bg-gradient-to-br from-gray-100 via-white to-gray-200 dark:from-gray-900 dark:via-black dark:to-gray-900`}
    >
      {/* pass toggle via context trick */}
      <div data-theme-toggle={toggleTheme as any}>
        {children}
      </div>
    </body>
  </html>
)
}