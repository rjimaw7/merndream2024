import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Dreams from "./components/Dreams";

const App = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="card">
        <Dreams />
      </div>
    </QueryClientProvider>
  );
};

export default App;
