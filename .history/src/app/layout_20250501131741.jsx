"use client";

import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { AuthProvider } from "@/components/auth/auth-provider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  // Hide header on dashboard routes
  const showHeader = !pathname?.startsWith("/dashboard");

  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <AuthProvider>
          {showHeader && (
            <header className="border-b sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container mx-auto flex items-center justify-between h-16 px-4">
                <Link href="/" className="font-bold text-xl">
                  SideBuilds
                </Link>

                <nav className="hidden md:flex items-center gap-6">
                  <Link
                    href="/#features"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="/marketplace"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Marketplace
                  </Link>
                  <Link
                    href="/pricing"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                </nav>

                <div className="flex items-center gap-4">
                  <Link
                    href="/auth/login"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Login
                  </Link>
                  <Button asChild size="sm">
                    <Link href="/auth/register">Sign Up</Link>
                  </Button>
                </div>
              </div>
            </header>
          )}

          <main className="flex-1">{children}</main>

          {showHeader && (
            <footer className="border-t py-8 bg-muted/20">
              <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  <div>
                    <h3 className="font-bold mb-4">SideBuilds</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Track, manage, and sell your side projects in one place.
                    </p>
                    <div className="flex gap-4">
                      <a
                        href="https://twitter.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                        </svg>
                      </a>
                      <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          />
                        </svg>
                      </a>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Product</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/#features"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Features
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/pricing"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Pricing
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/marketplace"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Marketplace
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Resources</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/blog"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Blog
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/docs"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Documentation
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/support"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Support
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-4">Company</h4>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <Link
                          href="/about"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          About
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/privacy"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Privacy
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/terms"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          Terms
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
                  <p>
                    &copy; {new Date().getFullYear()} SideBuilds.com. All rights
                    reserved.
                  </p>
                </div>
              </div>
            </footer>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
