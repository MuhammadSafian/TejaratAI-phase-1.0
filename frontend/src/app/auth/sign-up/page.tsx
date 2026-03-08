"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Chrome } from "lucide-react";

export default function SignUpPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-heading font-bold text-text-primary">Create Account</h1>
                <p className="text-text-secondary text-sm">Join TijaratAI and start scaling your business</p>
            </div>

            <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">First Name</label>
                        <Input />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-secondary">Last Name</label>
                        <Input />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Email</label>
                    <Input
                        type="email"
                        placeholder="m@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Password</label>
                    <Input
                        type="password"
                    />
                </div>

                <Button className="w-full h-12 rounded-xl font-heading font-black uppercase text-[11px] tracking-widest shadow-primary-glow" asChild>
                    <Link href="/onboarding">Create Account</Link>
                </Button>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase tracking-wider font-mono">
                        <span className="bg-bg-base px-2 text-text-muted">Or continue with</span>
                    </div>
                </div>

                <Button variant="outline" size="lg" className="w-full flex items-center gap-2 font-medium">
                    <Chrome className="w-4 h-4" /> Google
                </Button>
            </div>

            <p className="text-sm text-center text-text-muted">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary font-medium hover:underline">Sign in</Link>
            </p>
        </div>
    );
}
