import axios from "axios";
import { ApiRequestBody } from "../interfaces/IGpt";

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const ENDPOINT = "https://api.openai.com/v1/chat/completions";

export const useGptDao = () => {
  const sendMessage = async (payload: ApiRequestBody) => {
    const response = await axios.post(ENDPOINT, payload, {
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  return {
    sendMessage,
  };
};
