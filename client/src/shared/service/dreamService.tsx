import { IDream, IDreamCreate } from "@/shared/interfaces/IDream";
import { useDreamsDao } from "../dao/dreamDao";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useDreamService = () => {
  const {
    fetchAllDreams: fetchAllDreamsDao,
    fetchSingleDream: fetchSingleDreamDao,
    createDream: createDreamDao,
    // deleteDream: deleteDreamDao,
    // updateDream: updateDreamDao,
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

  const CreateDream = useMutation({
    mutationFn: (values: IDreamCreate) => createDreamDao(values),
  });
  const CreateDreamMutation = () => {
    return {
      CreateDream,
    };
  };

  return {
    GetAllDreams,
    GetSingleDream,
    CreateDreamMutation,
  };
};
