import type { Metadata } from "next";
import { Noto_Sans_Thai, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const notoTh = Noto_Sans_Thai({
  variable: "--font-noto-thai",
  subsets: ["thai", "latin"],
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AniGuess | เกมทายตัวละครอนิเมะและโปเกมอน",
  description:
    "ท้าทายความจำแฟนพันธุ์แท้อนิเมะ ทายชื่อตัวละครจากเงาและภาพเบลอ 14 เรื่องดัง ทั้ง Pokémon, One Piece, Naruto และอีกมากมาย",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="th"
      suppressHydrationWarning
      className={`${notoTh.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('aniguess-theme');if(t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches)){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FFFDF7] dark:bg-[#12100E] text-[#181411] dark:text-[#F5EFE6] font-sans selection:bg-[#EA580C] selection:text-white transition-colors duration-200">
        {children}
      </body>
    </html>
  );
}
