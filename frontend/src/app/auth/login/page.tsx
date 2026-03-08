"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { Chrome } from "lucide-react";

export default function LoginPage() {
    return (
        <div className="space-y-8">
            <div className="space-y-2">
                <h1 className="text-3xl font-heading font-bold text-text-primary">Sign In</h1>
                <p className="text-text-secondary text-sm">Enter your email to access your neural command center</p>
            </div>

            <div className="space-y-4">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-text-secondary">Email</label>
                    <Input
                        type="email"
                        placeholder="m@example.com"
                    />
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-text-secondary">Password</label>
                        <Link href="#" className="text-xs text-primary hover:underline">Forgot password?</Link>
                    </div>
                    <Input
                        type="password"
                    />
                </div>

                <Button className="w-full" size="lg" asChild>
                    <Link href="/dashboard">Sign In to Command Center</Link>
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
                Don't have an account?{" "}
                <Link href="/auth/sign-up" className="text-primary font-medium hover:underline">Sign up</Link>
            </p>
        </div>
    );
}
