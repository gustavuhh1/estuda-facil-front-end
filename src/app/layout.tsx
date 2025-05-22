import { Poppins } from "next/font/google";
import "./global.css"
import GlobalStyle from "@/styles/GlobalStyle";
import StyledComponentsRegistry from "@/lib/registry"; // se você estiver usando SSR
import type { Metadata,  } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Providers } from "./providers";

const poppins = Poppins({
  subsets: ["latin"],
  display: "swap",
  weight: ["100", "200","300", "400", "500", "600", "700", "800", "900"]
});

export const metadata: Metadata = {
  title: "Estuda Fácil",
  description: "Login e painel de administração da plataforma Estuda Fácil",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={poppins.className}>
      <body>
        <StyledComponentsRegistry>
          <GlobalStyle />
          <Providers>{children}</Providers>
          <Toaster closeButton richColors />
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
