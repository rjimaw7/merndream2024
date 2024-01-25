import {
  Card,
  CardContent,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  toggleCardOpen,
  setSelectedCardId,
} from "@/redux/features/dreams/dreamSlice";
import { IDream } from "@/shared/interfaces/IDream";
// import { SquarePen, Trash } from "lucide-react";
import { useDispatch } from "react-redux";

interface Props {
  dream: IDream;
}

const DreamCard = ({ dream }: Props) => {
  const shouldTruncate = dream.dream.length >= 100;

  const dispatch = useDispatch();

  return (
    <Card
      className="w-[350px] p-8 cursor-pointer hover:scale-105 transform transition-transform
      shadow-xl shadow-red-700/20 dark:shadow-lg dark:shadow-red-500/30
      "
      onClick={() => {
        dispatch(toggleCardOpen(true));
        dispatch(setSelectedCardId(dream._id));
      }}
    >
      <CardHeader>
        <CardTitle className="text-center overflow-hidden text-red-600 font-bold">
          {dream.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn(shouldTruncate ? "truncate" : "overflow-hidden")}>
          {dream.dream}
        </p>
      </CardContent>
      {/* WILL DISPLAY ON ADMIN MODE */}
      {/* <CardFooter className="flex gap-2 justify-end items-center w-full">
        <Trash size={16} />
        <SquarePen size={16} />
      </CardFooter> */}
    </Card>
  );
};

export default DreamCard;
