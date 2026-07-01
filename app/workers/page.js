import { Suspense } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import WorkerProfiles from "../components/WorkerProfiles";
import { PageLoader } from "../components/ui/Skeleton";

export default function Workers() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <Suspense fallback={<PageLoader message="Loading professionals..." />}>
        <WorkerProfiles />
      </Suspense>
      <Footer />
    </main>
  );
}
