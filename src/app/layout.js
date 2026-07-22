import { Figtree, Geist, Geist_Mono, Parkinsans } from "next/font/google";
import { Provider } from "../components/ui/provider";
import { AuthProvider } from "../contexts/AuthContext";
import { LanguageProvider } from "../contexts/LanguageContext";
import GlobalLoading from "../components/GlobalLoading";
import Header from "./componets/Header";
import Footer from "./componets/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});

const parkinsans = Parkinsans({
  variable: "--font-parkinsans",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "Personalized Books for Kids | Custom Storybooks - Wonder Wraps",
  description: "Create magical personalised storybooks where your child is the hero.",
  openGraph: {
    title: "WonderWraps personalised storybooks",
    description: "Create magical personalised storybooks where your child is the hero.",
    images: [{ url: "/og.png", width: 1734, height: 907, alt: "Fairytale Books personalised storybook" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "WonderWraps personalised storybooks",
    description: "Create magical personalised storybooks where your child is the hero.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${figtree.variable} ${parkinsans.variable} antialiased`}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          margin: 0,
          padding: 0,
        }}
      >
        <Provider>
          <LanguageProvider>
            <AuthProvider>
              <GlobalLoading>
                <Header />
                <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {children}
                </main>
                <Footer/>
              </GlobalLoading>
            </AuthProvider>
          </LanguageProvider>
        </Provider>
      </body>
    </html>
  );
}
