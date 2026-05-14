"use client";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PMSDashboard } from "@/components/admin/PMSDashboard";
import { Button } from "@/components/ui/button";

export default function BookingsManagementPage() {
    return (
        <div className="min-h-screen bg-neutral-50">
            <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-[1400px] items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                        <Button asChild variant="ghost" size="sm" className="gap-2">
                            <Link href="/admin">
                                <ArrowLeft className="h-4 w-4" /> Back to Admin
                            </Link>
                        </Button>
                        <div className="hidden h-6 w-px bg-neutral-200 sm:block" />
                        <div className="hidden sm:block">
                            <p className="text-sm font-semibold tracking-tight">Bookings Management</p>
                            <p className="text-xs text-neutral-500">Property management system</p>
                        </div>
                    </div>
                </div>
            </header>
            <div className="mx-auto max-w-[1400px] p-6">
                <PMSDashboard />
            </div>
        </div>
    );
}