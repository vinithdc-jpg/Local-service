import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Services from "./components/Services";
import WorkerProfiles from "./components/WorkerProfiles";
import Testimonials from "./components/Testimonials";
import ContactForm from "./components/ContactForm";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Services />
      {/* <WorkerProfiles /> */}
      <Testimonials />
      <ContactForm />
      <Footer />
    </main>
  );
}
