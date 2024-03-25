import { Header } from "@/app/components/Header";
import { Footer } from "@/app/components/Footer";


export const metadata = {
  title: 'Phonetic Guesser',
  description: 'Created by Rhys',
}

export default function RootLayout({ children }) {
 return (
    <html lang="en">
      <body>
      <Header />
        {children}
      <Footer />
        </body>
    </html>
  )
}
