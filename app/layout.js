import { Outfit } from "next/font/google";
import "./globals.css";
import { ToastProvider } from "./components/ui/Toast";
import { AuthProvider } from "./context/AuthContext";

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata = {
  title: "Service Booking | Professional Services",
  description: "Book your appointment easily online.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${outfit.variable} antialiased`}>
        <AuthProvider>
          <ToastProvider>{children}</ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
