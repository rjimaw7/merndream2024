import { useMutation } from "@tanstack/react-query";
import { useGptDao } from "../dao/gptDao";
import { ApiRequestBody } from "../interfaces/IGpt";

export const useGptService = () => {
  const { sendMessage: sendMessageDao } = useGptDao();

  const SendMessage = useMutation({
    mutationFn: (values: ApiRequestBody) => sendMessageDao(values),
  });
  const SendMessageMutation = () => {
    return {
      SendMessage,
    };
  };

  return { SendMessageMutation };
};
