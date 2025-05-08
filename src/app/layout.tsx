import { Roboto } from "next/font/google";
import './globals.css'
import GlobalStyle from "@/styles/GlobalStyle";
import StyledComponentsRegistry from "@/lib/registry"; // se você estiver usando SSR
import type { Metadata } from "next";

const roboto = Roboto({
  subsets: ["latin"],
  display: "swap"
})

export const metadata: Metadata = {
  title: "Estuda Fácil",
  description: "Login e painel de administração da plataforma Estuda Fácil",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={roboto.className}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          {children}
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
