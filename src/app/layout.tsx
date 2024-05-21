"use client"

import { Inter } from "next/font/google";
import "./globals.css";
import { RecoilRoot } from "recoil";
import { jwtVerify } from "jose";
import NavBar from "./components/NavBar";
import { initUser } from "../utils/initUser";
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <RecoilRoot>
        <body className={inter.className}>
          <NavBar />
          {children}
        </body>
      </RecoilRoot>
    </html>
  );
}
