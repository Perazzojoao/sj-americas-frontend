import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ReactQueryProvider from "@/components/Providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import { ThemeProvider } from "@/providers/theme-provider";
import SelectionContextProvider from "@/context/selection-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Eventos",
  description: "Gerencie seus eventos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ReactQueryProvider>
            <Toaster />
            <Header />
            <SelectionContextProvider>
              <div className="px-3 sm:px-4 lg:px-5 lg:w-4/5 xl:w-4/6 mx-auto mb-8">
                {children}
              </div>
            </SelectionContextProvider>
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
