/* eslint-disable react-hooks/exhaustive-deps */

import DreamCard from "@/components/Home/DreamCard";
import Navbar from "@/components/Home/Navbar";
import { useDreamService } from "@/shared/service/dreamService";
import { useEffect, useMemo } from "react";
import DreamForm from "@/components/Home/DreamForm";
import { RootState } from "@/redux/app/store";
import { useSelector } from "react-redux";
import { useDebounce } from "@uidotdev/usehooks";
import { useInView } from "react-intersection-observer";

const Home = () => {
  // ALL HOOKS
  const { selectedCardId, searchQuery } = useSelector(
    (state: RootState) => state.dreams
  );
  const { GetAllDreams, GetSingleDream } = useDreamService();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const {
    data: dreamData,
    fetchNextPage,
    hasNextPage,
  } = GetAllDreams(debouncedSearchQuery, 1, 10);
  const { data: singleDreamData } = GetSingleDream(
    selectedCardId,
    Boolean(selectedCardId)
  );

  const dreamDataMemo = useMemo(() => {
    if (dreamData) {
      return dreamData.pages.flatMap((page) => page);
    }
    return [];
  }, [dreamData]);
  const singleDreamDataMemo = useMemo(() => singleDreamData, [singleDreamData]);

  // FOR INFINITE SCROLL
  useEffect(() => {
    if (inView) {
      if (hasNextPage) {
        fetchNextPage();
      }
    }
  }, [inView, hasNextPage]);

  return (
    <div className="mx-auto container">
      <Navbar />

      {/* HERO */}
      <div className="mb-10 mt-16 text-center flex flex-col gap-8">
        <h1 className="text-8xl font-bold tracking-tighter text-center">
          Advent of <span className="text-red-600">Dreams</span>
        </h1>
        <p className="text-xl text-black font-semibold italic dark:text-white">
          Share your dreams, let's unlock their profound meanings together.
        </p>
        <div className="flex justify-center gap-4 items-center">
          <DreamForm singleDreamDataMemo={singleDreamDataMemo} />
        </div>
      </div>

      {/* DREAM CARDS HERE */}
      <section id="cards" className="mx-20 grid grid-cols-3 gap-8 pb-10">
        {dreamDataMemo &&
          dreamDataMemo.map((dream) => (
            <DreamCard key={dream._id} dream={dream} />
          ))}

        {dreamDataMemo && dreamDataMemo.length >= 10 && <div ref={ref} />}
      </section>
    </div>
  );
};

export default Home;
