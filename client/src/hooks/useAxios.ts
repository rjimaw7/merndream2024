import axios, {
  AxiosResponse,
  AxiosRequestHeaders,
  CancelToken,
  ResponseType,
} from "axios";

interface IAxios<P, B> {
  url: string;
  params?: P;
  body?: B;
  data?: B;
  headers?: AxiosRequestHeaders;
  responseType?: ResponseType;
  cancelToken?: CancelToken;
}

const CONFIG = {
  isDevelopment: import.meta.env.MODE === "development",
  API_URL: "http://localhost:3000/",
};

export const useAxios = () => {
  const instance = axios.create({
    baseURL: CONFIG.API_URL,
    headers: {
      "Content-Type": "application/json",
    },
  });

  instance.interceptors.request.use(
    (request) => {
      if (CONFIG.isDevelopment) {
        console.log(
          `%c ${request?.method} request for ${request.url}\n`,
          "color:white;background-color:#fa8c16;padding:5px;border-radius:5px;",
          request.data
        );
        console.log({ params: request.params });
      }
      return request;
    },
    (error) => {
      if (CONFIG.isDevelopment) console.log(error);

      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      if (CONFIG.isDevelopment) {
        console.log(
          `%c response from ${response.config.url}\n`,
          "color:white;background-color:#1890ff;padding:5px;border-radius:5px;",
          response.data
        );
      }

      return response;
    },
    (error) => {
      if (CONFIG.isDevelopment) console.log(error);
      return Promise.reject(error);
    }
  );

  const GET = async <R, P = unknown, B = unknown>(
    args: IAxios<P, B>
  ): Promise<AxiosResponse<R>> => {
    return instance({
      ...args,
      method: "GET",
    });
  };

  const POST = async <R, P = unknown, B = unknown>(
    args: IAxios<P, B>
  ): Promise<AxiosResponse<R>> => {
    return instance({
      ...args,
      method: "POST",
    });
  };

  const PUT = async <P, B>(args: IAxios<P, B>): Promise<AxiosResponse> => {
    return instance({
      ...args,
      method: "PUT",
    });
  };

  const DELETE = async <P, B>(args: IAxios<P, B>): Promise<AxiosResponse> => {
    return instance({
      ...args,
      method: "DELETE",
    });
  };

  return {
    instance,
    GET,
    POST,
    PUT,
    DELETE,
  };
};
