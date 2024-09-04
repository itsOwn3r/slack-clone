import type { Metadata } from "next";
import "./globals.css";
import Modals from "@/components/modals";
import { Toaster } from "sonner";
import JotaiProvider from "@/components/jotai-provider";

export const metadata: Metadata = {
  title: "Slack",
  description: "Its just a slack clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <JotaiProvider>
          <Toaster />
          <Modals />
          {children}
        </JotaiProvider>
      </body>
    </html>
  );
}
