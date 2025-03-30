import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { useState } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex flex-col relative bg-gradient-to-br from-gray-50 to-gray-100">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-150px] left-[-150px] w-[300px] h-[300px] rounded-full bg-primary/30 filter blur-[80px]"></div>
          <div className="absolute bottom-[-150px] right-[-150px] w-[300px] h-[300px] rounded-full bg-secondary/30 filter blur-[80px]"></div>
          <div className="absolute top-[30%] right-[10%] w-[200px] h-[200px] rounded-full bg-accent/20 filter blur-[80px]"></div>
        </div>
        
        <Header />
        <main className="flex-grow relative z-10">
          <Router />
        </main>
        <Footer />
        <Toaster />
      </div>
    </QueryClientProvider>
  );
}

export default App;
