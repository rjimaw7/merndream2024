/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn, getCurrentTimeStamp } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "../ui/textarea";
import { useTheme } from "../theme-provider";
import { useDreamService } from "@/shared/service/dreamService";
import { useQueryClient } from "@tanstack/react-query";
import { IDream } from "@/shared/interfaces/IDream";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/app/store";
import {
  toggleCardOpen,
  setSelectedCardId,
} from "@/redux/features/dreams/dreamSlice";
import { useCallback, useEffect, useState } from "react";
import { useGptService } from "@/shared/service/gptService";
import {
  ApiRequestBody,
  ChatCompletion,
  IGpt,
  Message,
} from "@/shared/interfaces/IGpt";
import { Label } from "../ui/label";
import { PROMPT } from "@/shared/constants/dummyData";
import TypeWriter from "./TypeWriter";
import { useToast } from "../ui/use-toast";

const DreamSchema = z.object({
  title: z
    .string({
      required_error: "Title is required",
    })
    .min(3, {
      message: "Title must be at least 3 characters.",
    })
    .max(32, {
      message: "Title must be 32 characters or less.",
    }),
  date: z.date({
    required_error: "A date of dream is required.",
  }),
  dream: z
    .string({
      required_error: "Dream is required",
    })
    .min(10, {
      message: "Dream must be at least 10 characters.",
    }),
});

type DreamType = z.infer<typeof DreamSchema>;

interface Props {
  singleDreamDataMemo?: IDream;
}

const DreamForm = ({ singleDreamDataMemo }: Props) => {
  // ALL STATE
  const [isEdit, setIsEdit] = useState(false);
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [message, setMessage] = useState("");

  // ALL HOOKS
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { cardOpen } = useSelector((state: RootState) => state.dreams);
  const queryClient = useQueryClient();
  const { theme } = useTheme();
  const form = useForm<DreamType>({
    resolver: zodResolver(DreamSchema),
    defaultValues: {
      title: "",
      date: new Date(),
      dream: "",
    },
  });
  const { CreateDreamMutation, DeleteDreamMutation, UpdateDreamMutation } =
    useDreamService();
  const { SendMessageMutation } = useGptService();
  const { CreateDream } = CreateDreamMutation();
  const { UpdateDream } = UpdateDreamMutation();
  const { DeleteDream } = DeleteDreamMutation();
  const { SendMessage } = SendMessageMutation();

  const onSubmit = (values: DreamType) => {
    const modifiedValues = {
      ...values,
      date: getCurrentTimeStamp(values.date),
    };

    // IF EDIT MODE EXECUTE THIS
    if (singleDreamDataMemo) {
      UpdateDream.mutate(
        {
          ...modifiedValues,
          _id: singleDreamDataMemo._id,
        },
        {
          onSuccess: () => {
            toast({
              title: "Your dream has been updated!",
            });

            queryClient.invalidateQueries({ queryKey: ["dreams"] });
            queryClient.invalidateQueries({ queryKey: ["single_dream"] });
            dispatch(toggleCardOpen(false));
            form.reset();
          },
          onError: (err: any) => {
            toast({
              title: "Something went wrong.",
              description: `${err?.response?.data?.[0]?.msg}`,
            });
          },
        }
      );
    } else {
      // IF CREATE MODE
      CreateDream.mutate(modifiedValues, {
        onSuccess: () => {
          toast({
            title: "Your dream has been created!",
          });

          queryClient.invalidateQueries({ queryKey: ["dreams"] });
          dispatch(toggleCardOpen(false));
          form.reset();
        },
        onError: (err: any) => {
          console.log("Create Error", err?.response?.data?.[0]?.msg);

          toast({
            title: "Something went wrong.",
            description: `${err?.response?.data?.[0]?.msg}`,
          });
        },
      });
    }
  };

  const onDeleteDream = (id: string) => {
    DeleteDream.mutate(id, {
      onSuccess: () => {
        toast({
          title: "Your dream has been deleted!",
        });

        queryClient.invalidateQueries({ queryKey: ["dreams"] });
        // CLOSE MODAL
        dispatch(setSelectedCardId(""));
        dispatch(toggleCardOpen(false));
        form.reset();
      },
      onError: () => {
        toast({
          title: "Something went wrong.",
        });
      },
    });
  };

  const processMessageToChatGPT = useCallback(
    async (chatMessages: IGpt[]) => {
      const apiMessages: Message[] = chatMessages.map((messageObject) => {
        const role = messageObject.sender === "Chat GPT" ? "assistant" : "user";
        return { role, content: messageObject.message };
      });

      const systemMessage: Message = {
        role: "system",
        content:
          // CHANGE HERE THE WAY YOU WANT THE AI TO BEHAVE
          PROMPT,
      };

      const apiRequestBody: ApiRequestBody = {
        model: "gpt-3.5-turbo",
        messages: [systemMessage, ...apiMessages], // Include systemMessage at the beginning
      };

      SendMessage.mutateAsync(apiRequestBody, {
        onSuccess: async (data: ChatCompletion) => {
          const responseText = data.choices[0].message.content;

          setMessage(responseText);
        },
      });
    },
    [SendMessage.mutateAsync]
  );

  const handleInterPretDream = useCallback(
    async (message: string) => {
      const newMessage: IGpt = {
        message: message,
        sender: "user",
        direction: "outgoing",
      };

      await processMessageToChatGPT([newMessage]);
    },

    [processMessageToChatGPT]
  );

  useEffect(() => {
    if (singleDreamDataMemo) {
      form.setValue("title", singleDreamDataMemo.title);
      form.setValue("date", new Date(singleDreamDataMemo.date));
      form.setValue("dream", singleDreamDataMemo.dream);
    }
  }, [singleDreamDataMemo]);

  return (
    <Dialog
      open={cardOpen}
      onOpenChange={(open) => {
        if (!open && !isBotTyping) {
          form.reset();
          if (singleDreamDataMemo) {
            queryClient.removeQueries({ queryKey: ["single_dream"] });
            dispatch(setSelectedCardId(""));
            setMessage("");
            setIsEdit(false);
          }
        }

        if (!isBotTyping) {
          dispatch(toggleCardOpen(open));
        }
      }}
    >
      <Button
        variant={theme === "dark" ? "default" : "destructive"}
        onClick={() => dispatch(toggleCardOpen(true))}
      >
        Get Started
      </Button>
      {cardOpen && (
        <>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center justify-between mt-2">
                  <Label className="text-base md:text-lg font-bold">
                    {singleDreamDataMemo
                      ? singleDreamDataMemo.title
                      : "Add a Dream"}
                  </Label>
                  {singleDreamDataMemo && !isEdit && (
                    <Label className="text-xs md:text-sm text-muted-foreground">
                      {format(
                        new Date(singleDreamDataMemo.date),
                        "MMM d, yyyy, h:mm:ss a"
                      )}
                    </Label>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            {singleDreamDataMemo && (
              <>
                {isEdit ? (
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-4"
                    >
                      <div className="grid w-full items-center gap-4">
                        <FormField
                          control={form.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input
                                  id="title"
                                  placeholder="Title of your dream"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Date</FormLabel>
                              <FormControl>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        " justify-start text-left font-normal w-full",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      <CalendarIcon className="mr-2 h-4 w-4" />
                                      {field.value ? (
                                        format(field.value, "PPP")
                                      ) : (
                                        <span>When was it?</span>
                                      )}
                                    </Button>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      id="date"
                                      mode="single"
                                      selected={field.value}
                                      onSelect={field.onChange}
                                      disabled={(date) =>
                                        date > new Date() ||
                                        date < new Date("1900-01-01")
                                      }
                                      initialFocus
                                    />
                                  </PopoverContent>
                                </Popover>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="dream"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Dream</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your dream"
                                  className="resize-none"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <DialogFooter>
                        <div className="flex flex-col md:flex-row w-full gap-2">
                          <Button type="submit" variant="default">
                            {UpdateDream.isPending && (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            Update
                          </Button>
                          <Button
                            type="submit"
                            variant="outline"
                            onClick={() => setIsEdit(false)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </DialogFooter>
                    </form>
                  </Form>
                ) : (
                  <div className="">
                    {!message && (
                      <Textarea
                        readOnly
                        className="resize-none h-[300px] font-semibold text-base italic"
                        value={singleDreamDataMemo?.dream}
                      />
                    )}
                    {message && (
                      <TypeWriter
                        message={message}
                        setIsBotTyping={setIsBotTyping}
                      />
                    )}
                  </div>
                )}
                <DialogFooter>
                  <div className="flex flex-col md:flex-row w-full gap-2">
                    {singleDreamDataMemo && !isEdit && (
                      <div className="flex flex-col md:flex-row w-full gap-2">
                        <Button
                          variant="default"
                          onClick={() => {
                            if (message) {
                              setMessage("");
                            }

                            handleInterPretDream(singleDreamDataMemo?.dream);
                          }}
                          disabled={isBotTyping || SendMessage.isPending}
                        >
                          {SendMessage.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Interpret
                        </Button>
                        <Button
                          disabled={
                            isBotTyping ||
                            UpdateDream.isPending ||
                            SendMessage.isPending
                          }
                          variant="default"
                          onClick={() => {
                            setIsEdit(true);
                            setMessage("");
                          }}
                        >
                          Edit
                        </Button>
                        <Button
                          type="submit"
                          variant="destructive"
                          onClick={() => onDeleteDream(singleDreamDataMemo._id)}
                          disabled={
                            isBotTyping ||
                            DeleteDream.isPending ||
                            SendMessage.isPending
                          }
                        >
                          {DeleteDream.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          Delete
                        </Button>
                      </div>
                    )}
                  </div>
                </DialogFooter>
              </>
            )}

            {!singleDreamDataMemo && message === "" && (
              <Form {...form}>
                <form
                  className="space-y-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <div className="grid w-full items-center gap-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input
                              id="title"
                              placeholder="Title of your dream"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    " justify-start text-left font-normal w-full",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  <CalendarIcon className="mr-2 h-4 w-4" />
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>When was it?</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  id="date"
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="dream"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dream</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe your dream"
                              className="resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <DialogFooter>
                    <div className="flex flex-col md:flex-row w-full">
                      <Button type="submit" variant="default">
                        {CreateDream.isPending && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Submit
                      </Button>
                    </div>
                  </DialogFooter>
                </form>
              </Form>
            )}
          </DialogContent>
        </>
      )}
    </Dialog>
  );
};

export default DreamForm;
