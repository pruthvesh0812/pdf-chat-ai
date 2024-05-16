import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className='px-6 my-3'>
          <div className='w-full flex justify-between items-center'>
            <h1>PdfChat.ai</h1>
            <Link href="/login" className='text-slate-100 font-semibold px-3 py-1 bg-transparent border border-blue-200 rounded hover:bg-blue-200 hover:text-[#16183b] '>login</Link>
          </div>
          {children}
        </div>
      </body>
    </html>
  );
}