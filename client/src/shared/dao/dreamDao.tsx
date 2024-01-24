import { useAxios } from "@/shared/hooks/useAxios";
import { IDream } from "@/shared/interfaces/IDream";

export const useDreamsDao = () => {
  const { GET } = useAxios();

  const fetchAllDreams = async () => {
    const response = await GET<IDream[]>({
      url: "/api/dreams",
    });

    return response.data;
  };

  const fetchSingleDream = async (id: string) => {
    const response = await GET<IDream[]>({
      url: `/api/dreams/${id}`,
    });

    return response.data;
  };

  return {
    fetchAllDreams,
    fetchSingleDream,
  };
};
