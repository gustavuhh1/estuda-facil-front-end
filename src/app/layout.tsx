import { Poppins } from "next/font/google";
import "./global.css"
import GlobalStyle from "@/styles/GlobalStyle";
import StyledComponentsRegistry from "@/lib/registry"; // se você estiver usando SSR
import type { Metadata,  } from "next";
import { Toaster } from "@/components/ui/sonner";
import { AuthProviders } from "./AuthProviders";

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
    <AuthProviders>
      <html lang="pt-BR" className={poppins.className}>
        <body>
          <StyledComponentsRegistry>
            <GlobalStyle />
            {children}
            <Toaster closeButton richColors />
          </StyledComponentsRegistry>
        </body>
      </html>
    </AuthProviders>
  );
}
