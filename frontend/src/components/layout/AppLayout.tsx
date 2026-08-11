import { ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { SearchBar } from "../ui/SearchBar";
import { motion } from "framer-motion";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex h-screen w-full bg-background overflow-hidden relative">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 h-full relative z-10">
        {/* Top Floating Search & Nav Area */}
        <header className="absolute top-0 left-0 right-0 z-20 flex justify-center p-4 pointer-events-none">
          <div className="w-full max-w-2xl pointer-events-auto">
            <SearchBar />
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto relative z-10 no-scrollbar pt-20">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </main>
      </div>
      
      {/* Background Decorators */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full bg-secondary/10 blur-[100px] pointer-events-none -z-10" />
    </div>
  );
}
