import { Suspense } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WorkerProfiles from "../components/WorkerProfiles";

export default function Workers() {
    return (
        <main className="min-h-screen bg-background">
            <Navbar />
            <Suspense fallback={
                <div className="flex-1 flex items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            }>
                <WorkerProfiles />
            </Suspense>
            <Footer />
        </main>
    );
}