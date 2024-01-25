import { useAxios } from "@/shared/hooks/useAxios";
import { IDream, IDreamCreate, IDreamUpdate } from "@/shared/interfaces/IDream";

export const useDreamsDao = () => {
  const { GET, POST, PATCH, DELETE } = useAxios();

  // const fetchAllDreams = async (query?: string) => {
  //   const response = await GET<IDream[]>({
  //     url: query ? `/api/dreams?title=${query}` : "/api/dreams",
  //   });

  //   return response.data;
  // };

  const fetchAllDreams = async (
    query?: string,
    page?: number,
    limit?: number
  ): Promise<IDream[]> => {
    let url = "/api/dreams";

    // Add query parameter if present
    if (query) {
      url += `?title=${query}`;
    }

    // Add page and limit parameters if provided
    if (page && limit) {
      url += `${query ? "&" : "?"}page=${page}&limit=${limit}`;
    }

    const response = await GET<IDream[]>({ url });
    return response.data;
  };

  const fetchSingleDream = async (id: string) => {
    const response = await GET<IDream>({
      url: `/api/dreams/${id}`,
    });

    return response.data;
  };

  const createDream = async (values: IDreamCreate) => {
    const response = await POST({
      url: "/api/dreams",
      data: {
        ...values,
      },
    });

    return response.data;
  };

  const updateDream = async (values: IDreamUpdate) => {
    const updatedValues = {
      title: values.title,
      date: values.date,
      dream: values.dream,
    };

    const response = await PATCH({
      url: `/api/dreams/${values._id}`,
      data: {
        ...updatedValues,
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
