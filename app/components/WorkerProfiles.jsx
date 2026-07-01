"use client";

import { MapPin, MessageCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import Button from "./ui/Button";
import Card, { CardContent, CardTitle } from "./ui/Card";
import Badge from "./ui/Badge";
import Avatar from "./ui/Avatar";
import EmptyState from "./ui/EmptyState";
import { SkeletonWorkerGrid } from "./ui/Skeleton";
import { useEffect, useState } from "react";
import axios from "axios";
import RoleFilter from "./RoleFilter";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Users } from "lucide-react";

export default function WorkerProfiles() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRole, setSelectedRole] = useState("all");

  useEffect(() => {
    const roleFromUrl = searchParams.get("role") || "all";
    setSelectedRole(roleFromUrl);
  }, [searchParams]);

  useEffect(() => {
    fetchWorkers(selectedRole);
  }, [selectedRole]);

  const fetchWorkers = async (role) => {
    setLoading(true);
    setError(null);
    try {
      const url =
        role === "all" ? "/api/createpro" : `/api/createpro?role=${encodeURIComponent(role)}`;
      const res = await axios.get(url);
      setWorkers(res.data.workers);
    } catch (err) {
      setError("Failed to load workers");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = (role) => {
    const url = role === "all" ? "/workers" : `/workers?role=${role}`;
    router.push(url, { scroll: false });
  };

  return (
    <section id="workers" className="section-padding gradient-mesh">
      <div className="container mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <Badge variant="accent" className="mb-4">Professionals</Badge>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-3 tracking-tight">
            Meet Our <span className="gradient-text">Local Experts</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Connect with top-rated professionals in your area.
          </p>
        </motion.div>

        <RoleFilter selectedRole={selectedRole} onRoleChange={handleRoleChange} />

        {loading && <SkeletonWorkerGrid count={4} />}

        {error && !loading && (
          <EmptyState
            icon={Users}
            title="Something went wrong"
            description={error}
            action={
              <Button variant="outline" onClick={() => fetchWorkers(selectedRole)}>
                Try Again
              </Button>
            }
          />
        )}

        {!loading && !error && workers.length === 0 && (
          <EmptyState
            icon={Users}
            title="No Workers Found"
            description={
              selectedRole !== "all"
                ? `No ${selectedRole}s available at the moment.`
                : "No workers available at the moment. Check back soon!"
            }
            action={
              selectedRole !== "all" ? (
                <Button variant="outline" onClick={() => handleRoleChange("all")}>
                  View All Workers
                </Button>
              ) : null
            }
          />
        )}

        <div
          className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transition-opacity duration-300 ${
            loading ? "opacity-0 h-0 overflow-hidden" : "opacity-100"
          }`}
        >
          {!loading &&
            !error &&
            workers.map((worker, i) => (
              <motion.div
                key={worker._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card hover className="overflow-hidden group">
                  <div className="h-28 bg-gradient-to-br from-accent/20 to-purple-500/10 relative">
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                      <Avatar
                        src={worker.image}
                        name={worker.displayName}
                        size="xl"
                        online
                      />
                    </div>
                  </div>

                  <CardContent className="pt-14 pb-6 text-center px-5">
                    <CardTitle className="text-base mb-0.5">{worker.displayName}</CardTitle>
                    <p className="text-accent font-medium text-sm mb-3">{worker.role}</p>

                    <div className="flex items-center justify-center gap-1.5 text-xs text-muted-foreground mb-3">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{worker.location}</span>
                    </div>

                    <div className="flex items-center justify-center gap-1 text-sm font-bold text-foreground mb-4">
                      <DollarSign className="w-4 h-4 text-accent" />
                      {worker.hourlyRate}/hr
                    </div>

                    <p className="text-xs text-muted-foreground line-clamp-2 mb-5 leading-relaxed">
                      {worker.aboutService}
                    </p>

                    <div className="space-y-2">
                      <Button className="w-full" size="sm">
                        Book Now
                      </Button>
                      <Link href={`/chatbox?workerId=${worker._id}`}>
                        <Button variant="outline" className="w-full" size="sm">
                          <MessageCircle className="w-4 h-4" />
                          Message
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
}
