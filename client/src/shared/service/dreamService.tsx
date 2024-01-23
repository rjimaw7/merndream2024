import { IDream } from "@/interfaces/IDream";
import { useDreamsDao } from "../dao/dreamDao";
import { useQuery } from "@tanstack/react-query";

export const useDreamService = () => {
  const {
    fetchAllDreams: fetchAllDreamsDao,
    fetchSingleDream: fetchSingleDreamDao,
  } = useDreamsDao();

  const GetAllDreams = () => {
    return useQuery<IDream[], Error>({
      queryKey: ["dreams"],
      queryFn: () => fetchAllDreamsDao(),
    });
  };

  const GetSingleDream = (id: string) => {
    return useQuery<IDream[], Error>({
      queryKey: ["single_dream"],
      queryFn: () => fetchSingleDreamDao(id),
    });
  };

  return {
    GetAllDreams,
    GetSingleDream,
  };
};
