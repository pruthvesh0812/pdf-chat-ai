"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";

import NavBar from "./components/NavBar";

import Loading from "./loading";
import { Suspense } from "react";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <RecoilRoot>
        <body className="text-slate-100 ">
          <NavBar />
          <Suspense fallback={<Loading />} />
          {children}
        </body>
      </RecoilRoot>
    </html>
  );
}
