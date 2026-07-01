import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Footer from "../components/Footer";
import Badge from "../components/ui/Badge";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-8 pb-4 text-center">
        <Badge variant="accent" className="mb-3">Browse</Badge>
      </div>
      <Services />
      <Footer />
    </main>
  );
}
