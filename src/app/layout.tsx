import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

// const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Echoes of Me - An Interactive AI Voice Journey",
  description:
    "Discover how to make AI sound like you in this interactive story game.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#374151",
              color: "#fff",
            },
            success: {
              style: {
                background: "#059669",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
