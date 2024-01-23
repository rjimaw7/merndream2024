import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dreams from "./components/Dreams";
import { ThemeProvider } from "./components/theme-provider";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <div className="container border border-black">
          <Dreams />
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
