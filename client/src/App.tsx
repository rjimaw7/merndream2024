import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dreams from "./components/Dreams";
import { ThemeProvider } from "./components/theme-provider";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="container border border-black">
          <Dreams />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
