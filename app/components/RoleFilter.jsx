"use client";

import { Grid, Wrench, Zap, Scissors, Paintbrush, Hammer, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

const roles = [
    { name: 'All', value: 'all', icon: Grid, color: 'bg-slate-500/10 text-slate-600' },
    { name: 'Plumber', value: 'Plumber', icon: Wrench, color: 'bg-blue-500/10 text-blue-600' },
    { name: 'Electrician', value: 'Electrician', icon: Zap, color: 'bg-yellow-500/10 text-yellow-600' },
    { name: 'Barber', value: 'Barber', icon: Scissors, color: 'bg-purple-500/10 text-purple-600' },
    { name: 'Painter', value: 'Painter', icon: Paintbrush, color: 'bg-green-500/10 text-green-600' },
    { name: 'Carpenter', value: 'Carpenter', icon: Hammer, color: 'bg-orange-500/10 text-orange-600' },
    { name: 'Consultant', value: 'Consultant', icon: Briefcase, color: 'bg-indigo-500/10 text-indigo-600' },
];

export default function RoleFilter({ selectedRole, onRoleChange }) {
    return (
        <div className="mb-12">
            <h3 className="text-lg font-semibold mb-4 text-center md:text-left">Filter by Role</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {roles.map((role, index) => {
                    const Icon = role.icon;
                    const isSelected = selectedRole === role.value;

                    return (
                        <motion.button
                            key={role.value}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            onClick={() => onRoleChange(role.value)}
                            className={`
                                relative p-4 rounded-xl border-2 transition-all duration-300
                                flex flex-col items-center gap-2 group
                                ${isSelected
                                    ? 'border-primary bg-primary/5 shadow-lg scale-105'
                                    : 'border-border hover:border-primary/50 hover:shadow-md hover:scale-102'
                                }
                            `}
                        >
                            {/* Active Indicator */}
                            {isSelected && (
                                <motion.div
                                    layoutId="activeRole"
                                    className="absolute inset-0 bg-primary/5 rounded-xl border-2 border-primary"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}

                            {/* Icon */}
                            <div className={`
                                relative z-10 w-10 h-10 rounded-lg flex items-center justify-center
                                ${isSelected ? 'bg-primary/20' : role.color}
                                group-hover:scale-110 transition-transform
                            `}>
                                <Icon className={`w-5 h-5 ${isSelected ? 'text-primary' : ''}`} />
                            </div>

                            {/* Label */}
                            <span className={`
                                relative z-10 text-xs font-medium transition-colors
                                ${isSelected ? 'text-primary font-semibold' : 'text-foreground'}
                            `}>
                                {role.name}
                            </span>

                            {/* Hover Effect */}
                            <div className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/5 transition-colors" />
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
