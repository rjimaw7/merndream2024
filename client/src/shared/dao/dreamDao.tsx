import { useAxios } from "@/shared/hooks/useAxios";
import { IDream, IDreamCreate } from "@/shared/interfaces/IDream";

export const useDreamsDao = () => {
  const { GET, POST, PATCH, DELETE } = useAxios();

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

  const createDream = async (values: IDreamCreate) => {
    console.log("DAO VALUES:", values);

    const response = await POST({
      url: "/api/dreams",
      data: {
        ...values,
      },
    });

    return response.data;
  };

  const updateDream = async (values: IDreamCreate) => {
    const response = await PATCH({
      url: "/api/dreams",
      data: {
        ...values,
      },
    });

    return response.data;
  };

  const deleteDream = async (id: string) => {
    const response = await DELETE({
      url: `/api/dreams/${id}`,
    });

    return response.data;
  };

  return {
    fetchAllDreams,
    fetchSingleDream,
    createDream,
    updateDream,
    deleteDream,
  };
};
