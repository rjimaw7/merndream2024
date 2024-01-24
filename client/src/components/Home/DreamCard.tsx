import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { IDream } from "@/shared/interfaces/IDream";

interface Props {
  dream: IDream;
}

const DreamCard = ({ dream }: Props) => {
  const shouldTruncate = dream.dream.length >= 100;

  return (
    <Card className="w-[350px] cursor-pointer hover:scale-105 transform transition-transform">
      <CardHeader>
        <CardTitle className="text-center">{dream.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className={cn(shouldTruncate && "truncate")}>{dream.dream}</p>
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
