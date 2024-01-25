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
import { useEffect } from "react";

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

  // ALL HOOKS
  const dispatch = useDispatch();
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
  const { CreateDream } = CreateDreamMutation();
  const { UpdateDream } = UpdateDreamMutation();
  const { DeleteDream } = DeleteDreamMutation();

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
            queryClient.invalidateQueries({ queryKey: ["dreams"] });
            queryClient.invalidateQueries({ queryKey: ["single_dream"] });
            // CLOSE MODAL
            dispatch(toggleCardOpen(false));
          },
          onError: (err) => {
            console.log(err);
          },
        }
      );
    } else {
      // IF CREATE MODE
      CreateDream.mutate(modifiedValues, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["dreams"] });
          // CLOSE MODAL
          dispatch(toggleCardOpen(false));
        },
        onError: (err: any) => {
          console.log("Create Error", err?.response?.data?.[0]?.msg);
        },
      });
    }
  };

  const onDeleteDream = (id: string) => {
    DeleteDream.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["dreams"] });
        // CLOSE MODAL
        dispatch(setSelectedCardId(""));
        dispatch(toggleCardOpen(false));
      },
      onError: (err) => {
        console.log(err);
      },
    });
  };

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
        if (!open) {
          form.reset();
          if (singleDreamDataMemo) {
            queryClient.removeQueries({ queryKey: ["single_dream"] });
            dispatch(setSelectedCardId(""));
          }
        }

        dispatch(toggleCardOpen(open));
      }}
    >
      <Button
        variant={theme === "dark" ? "default" : "destructive"}
        onClick={() => dispatch(toggleCardOpen(true))}
      >
        Get Started
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {singleDreamDataMemo ? singleDreamDataMemo.title : "Add a Dream"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            id="date"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
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
            <DialogFooter className="sm:justify-start">
              {singleDreamDataMemo ? (
                <>
                  <Button type="submit" variant="default">
                    Update
                  </Button>
                  <Button
                    type="submit"
                    variant="destructive"
                    onClick={() => onDeleteDream(singleDreamDataMemo._id)}
                  >
                    Delete
                  </Button>
                </>
              ) : (
                <Button type="submit" variant="default">
                  {CreateDream.isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  Submit
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default DreamForm;
