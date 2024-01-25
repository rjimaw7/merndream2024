import { IDream, IDreamCreate, IDreamUpdate } from "@/shared/interfaces/IDream";
import { useDreamsDao } from "../dao/dreamDao";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useDreamService = () => {
  const {
    fetchAllDreams: fetchAllDreamsDao,
    fetchSingleDream: fetchSingleDreamDao,
    createDream: createDreamDao,
    deleteDream: deleteDreamDao,
    updateDream: updateDreamDao,
  } = useDreamsDao();

  const GetAllDreams = () => {
    return useQuery<IDream[], Error>({
      queryKey: ["dreams"],
      queryFn: () => fetchAllDreamsDao(),
    });
  };

  const GetSingleDream = (id: string, cardOpen?: boolean) => {
    return useQuery<IDream, Error>({
      queryKey: ["single_dream"],
      queryFn: () => fetchSingleDreamDao(id),
      enabled: cardOpen,
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

  const UpdateDream = useMutation({
    mutationFn: (values: IDreamUpdate) => updateDreamDao(values),
  });
  const UpdateDreamMutation = () => {
    return {
      UpdateDream,
    };
  };

  const DeleteDream = useMutation({
    mutationFn: (id: string) => deleteDreamDao(id),
  });
  const DeleteDreamMutation = () => {
    return {
      DeleteDream,
    };
  };

  return {
    GetAllDreams,
    GetSingleDream,
    CreateDreamMutation,
    UpdateDreamMutation,
    DeleteDreamMutation,
  };
};
