import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Phonetic Guesser",
  description: "Created by Rhys & Gavin",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Header />
      {children}
      <Footer />
    </html>
  );
}

const Header = () => {
  return (
    <header>
      <h1>Phonetic Guesser</h1>
    </header>
  );
};

const Footer = () => {
  return (
    <footer>
      <p>© 2024 Phonetic Guesser</p>
    </footer>
  );
};

