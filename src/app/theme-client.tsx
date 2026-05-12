"use client"

import { useEffect, useState } from "react"

export default function ThemeClient({ children }: { children: React.ReactNode }) {
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
    <div data-theme-toggle={toggleTheme as any}>
      {children}
    </div>
  )
}