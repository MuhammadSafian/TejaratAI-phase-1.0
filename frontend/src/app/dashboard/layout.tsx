import { Sidebar } from "@/components/dashboard/sidebar";
import { AIChatWidget } from "@/components/dashboard/ai-chat-widget";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-transparent relative z-10">
                <header className="h-20 border-b border-border bg-background/60 backdrop-blur-xl flex items-center px-8 shrink-0 sticky top-0 z-20">
                    <div className="flex-1 font-heading font-bold text-xl text-text-primary tracking-tight">
                        Dashboard
                    </div>
                    <div className="flex items-center gap-4">
                        {/* User profile / search can go here */}
                    </div>
                </header>
                <main className="flex-1 overflow-y-auto p-8 animate-fade-slide-up">
                    {children}
                </main>
            </div>
            <AIChatWidget />
        </div>
    );
}

