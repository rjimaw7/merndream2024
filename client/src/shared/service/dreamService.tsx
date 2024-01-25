import { IDream, IDreamCreate, IDreamUpdate } from "@/shared/interfaces/IDream";
import { useDreamsDao } from "../dao/dreamDao";
import { useMutation, useQuery, useInfiniteQuery } from "@tanstack/react-query";

export const useDreamService = () => {
  const {
    fetchAllDreams: fetchAllDreamsDao,
    fetchSingleDream: fetchSingleDreamDao,
    createDream: createDreamDao,
    deleteDream: deleteDreamDao,
    updateDream: updateDreamDao,
  } = useDreamsDao();

  // const GetAllDreams = (query?: string, page?: number, limit?: number) => {
  //   return useQuery<IDream[], Error>({
  //     queryKey: ["dreams", query, page, limit],
  //     queryFn: () => fetchAllDreamsDao(query),
  //   });
  // };

  const GetAllDreams = (query?: string, page?: number, limit?: number) => {
    return useInfiniteQuery<IDream[], Error>({
      queryKey: ["dreams", query, page, limit],
      queryFn: ({ pageParam = page }) =>
        fetchAllDreamsDao(query, pageParam as number, limit),
      initialPageParam: 1,
      getNextPageParam: (lastPage, allPages) => {
        const nextPage = lastPage?.length > 0 ? allPages?.length + 1 : null;
        return nextPage;
      },
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
