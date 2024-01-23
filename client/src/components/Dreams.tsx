import { useMemo } from "react";
import { useDreamsApi } from "../api/dreams";
import { useTheme } from "./theme-provider";
import { Button } from "./ui/button";

const Dreams = () => {
  // ALL HOOKS
  const { getAllDreams } = useDreamsApi();
  const { setTheme } = useTheme();

  const { data: dreamsData } = getAllDreams();

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
