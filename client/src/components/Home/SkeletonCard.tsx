import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const SkeletonCard = () => {
  return (
    <Card
      className="w-[316px] md:w-[350px] p-8 cursor-pointer hover:scale-105 transform transition-transform
  shadow-xl shadow-red-700/15 dark:shadow-lg dark:shadow-red-500/40
  "
    >
      <CardHeader>
        <CardTitle className="text-center overflow-hidden text-red-600 font-bold dark:text-white flex justify-center">
          <Skeleton className="h-5 w-[75px] bg-gray-300 flex justify-center items-center border" />
        </CardTitle>
      </CardHeader>
      <CardContent className="flex gap-4 flex-col">
        <Skeleton className="h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-300" />
        <Skeleton className="h-4 w-full bg-gray-300" />
      </CardContent>
    </Card>
  );
};

export default SkeletonCard;
