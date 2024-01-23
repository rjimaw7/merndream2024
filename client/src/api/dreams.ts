import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../hooks/useAxios";
import { IDream } from "../interfaces/IDream";

const { GET } = useAxios();

export const useDreamsApi = () => {
  const fetchAllDreams = async () => {
    const response = await GET<IDream[]>({
      url: "/api/dreams",
    });

    return response.data;
  };

  const getAllDreams = () => {
    return useQuery<IDream[], Error>({
      queryKey: ["dreams"],
      queryFn: fetchAllDreams,
    });
  };

  const fetchSingleDream = async (id: string) => {
    const response = await GET<IDream[]>({
      url: `/api/dreams/${id}`,
    });

    return response.data;
  };

  const getSingleDream = (id: string) => {
    return useQuery<IDream[], Error>({
      queryKey: ["single_dream"],
      queryFn: () => fetchSingleDream(id),
    });
  };

  return {
    getAllDreams,
    getSingleDream,
  };
};
