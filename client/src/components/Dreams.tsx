import { useMemo } from "react";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";
import { useDreamService } from "@/shared/service/dreamService";

const Dreams = () => {
  // ALL HOOKS
  const { GetAllDreams } = useDreamService();
  const { setTheme } = useTheme();

  const { data: dreamsData } = GetAllDreams();

  const dreamsDataMemo = useMemo(() => dreamsData, [dreamsData]);

  return (
    <div>
      <Button onClick={() => setTheme("light")}>Light</Button>
      <Button onClick={() => setTheme("dark")}>Dark</Button>
      {dreamsDataMemo &&
        dreamsDataMemo?.map((dream) => <p key={dream._id}>{dream.title}</p>)}
    </div>
  );
};

export default Dreams;
