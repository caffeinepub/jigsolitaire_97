import { ThemeProvider } from "next-themes";
import { Loader2 } from "lucide-react";
import { Toaster } from "sonner";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import { useActor } from "./hooks/useActor";
import { LandingPage } from "./components/LandingPage";
import { AuthenticatedApp } from "./components/AuthenticatedApp";

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { isFetching, actor } = useActor();

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      {isInitializing ? (
        <div className="min-h-dvh flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !identity ? (
        <LandingPage />
      ) : !actor || isFetching ? (
        <div className="min-h-dvh flex items-center justify-center bg-background">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <AuthenticatedApp />
      )}
      <Toaster position="bottom-right" />
    </ThemeProvider>
  );
}
