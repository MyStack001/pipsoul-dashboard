import "./globals.css";
import ThemeClient from "./theme-client";
import { AuthProvider } from "@/components/AuthProvider";
import { ProfileProvider } from "@/components/ProfileProvider";
import { Toaster } from "sonner";
import { NotificationProvider } from "@/components/NotificationProvider";
import { AccountProvider } from "@/components/AccountProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                try {
                  var theme = localStorage.getItem("theme");

                  if (theme === "dark") {
                    document.documentElement.classList.add("dark");
                  } else if (theme === "light") {
                    document.documentElement.classList.remove("dark");
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body
        className="
          min-h-screen
          bg-gradient-to-br
          from-gray-100
          via-white
          to-gray-200
          dark:from-gray-900
          dark:via-black
          dark:to-gray-900
        "
      >
        <AuthProvider>
          <AccountProvider>
            <ProfileProvider>
              <NotificationProvider>
                <ThemeClient>
                  {children}
                </ThemeClient>
              </NotificationProvider>
            </ProfileProvider>
          </AccountProvider>
        </AuthProvider>

        <Toaster
          richColors
          position="top-right"
          theme="system"
        />
      </body>
    </html>
  );
}