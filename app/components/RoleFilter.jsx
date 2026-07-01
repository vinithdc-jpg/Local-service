"use client";

import { Grid, Wrench, Zap, Scissors, Paintbrush, Hammer, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/app/lib/utils";

const roles = [
  { name: "All", value: "all", icon: Grid },
  { name: "Plumber", value: "Plumber", icon: Wrench },
  { name: "Electrician", value: "Electrician", icon: Zap },
  { name: "Barber", value: "Barber", icon: Scissors },
  { name: "Painter", value: "Painter", icon: Paintbrush },
  { name: "Carpenter", value: "Carpenter", icon: Hammer },
  { name: "Consultant", value: "Consultant", icon: Briefcase },
];

export default function RoleFilter({ selectedRole, onRoleChange }) {
  return (
    <div className="mb-10">
      <p className="text-sm font-medium text-muted-foreground mb-4 text-center md:text-left">
        Filter by specialty
      </p>
      <div className="flex flex-wrap justify-center md:justify-start gap-2">
        {roles.map((role, index) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.value;

          return (
            <motion.button
              key={role.value}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: index * 0.04 }}
              onClick={() => onRoleChange(role.value)}
              className={cn(
                "relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
                "border transition-all duration-200",
                "hover:scale-[1.02] active:scale-[0.98]",
                isSelected
                  ? "gradient-bg text-white border-transparent shadow-md"
                  : "bg-card border-border text-muted-foreground hover:border-accent/40 hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {role.name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
