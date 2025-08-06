import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Deltas from "@/pages/deltas";
import Reviews from "@/pages/reviews";
import Feed from "@/pages/feed";
import Comparison from "@/pages/comparison";
import ExampleNote from "@/pages/example-note";
import About from "@/pages/about";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/deltas" component={Deltas} />
      <Route path="/reviews" component={Reviews} />
      <Route path="/feed" component={Feed} />
      <Route path="/comparison" component={Comparison} />
      <Route path="/example-note" component={ExampleNote} />
      <Route path="/about" component={About} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
