import { useMemo } from "react";
import { useDreamsApi } from "../api/dreams";

const Dreams = () => {
  // ALL HOOKS
  const { getAllDreams } = useDreamsApi();

  const { data: dreamsData } = getAllDreams();

  const dreamsDataMemo = useMemo(() => dreamsData, [dreamsData]);

  console.log(dreamsDataMemo);

  return (
    <div>
      {dreamsDataMemo && dreamsDataMemo?.map((dream) => <p>{dream.title}</p>)}
    </div>
  );
};

export default Dreams;
