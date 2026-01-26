import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WorkerProfiles from "../components/WorkerProfiles";

export default function Workers() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <WorkerProfiles />
            <Footer />
        </main>
    );
}