import Navbar from "../components/Navbar";
import Services from "../components/Services";
import Footer from "../components/Footer";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-10">
                <Services />
            </div>
            <Footer />
        </main>
    );
}
