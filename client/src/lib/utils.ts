import { type ClassValue, clsx } from "clsx";
import { format, set } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getCurrentTimeStamp = (dateString: Date) => {
  const selectedDate = new Date(dateString);
  const currentTimestamp = new Date();

  // Set the time part of the selected date to the current timestamp's time
  const updatedDate = set(selectedDate, {
    hours: currentTimestamp.getHours(),
    minutes: currentTimestamp.getMinutes(),
    seconds: currentTimestamp.getSeconds(),
  });

  return format(updatedDate, "MM-dd-yyyy HH:mm:ss");
};
