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
import React from "react";
import SkeletonCard from "@/components/Home/SkeletonCard";

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
    isLoading: dreamDataIsLoading,
  } = GetAllDreams(debouncedSearchQuery, 1, 10);
  const { data: singleDreamData, isFetching: singleDreamIsFetching } =
    GetSingleDream(selectedCardId, Boolean(selectedCardId));

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
    <main className="container">
      <Navbar />

      <section
        id="hero"
        className="mb-10 mt-16 text-center flex flex-col gap-8"
      >
        {/* <h1 className="text-8xl font-bold tracking-tighter text-center"> */}
        <h1 className="text-6xl md:text-8xl font-bold tracking-tighter text-center">
          Advent of <span className="text-red-600">Dreams</span>
        </h1>
        <p className="text-lg md:text-xl text-black font-semibold italic dark:text-white">
          Share your dreams, let's unlock their profound meanings together.
        </p>
        <div className="flex justify-center gap-4 items-center">
          {singleDreamIsFetching ? (
            <p>Loading...</p>
          ) : (
            <DreamForm singleDreamDataMemo={singleDreamDataMemo} />
          )}
        </div>
      </section>

      <section
        id="cards"
        className="grid grid-cols-1 gap-6 pb-10 md:grid-cols-2 lg:grid-cols-3 md:gap-8 lg:mx-20"
      >
        {dreamDataIsLoading
          ? Array.from({ length: 10 }, (_, index) => (
              <React.Fragment key={`skeleton_${index}`}>
                <SkeletonCard />
              </React.Fragment>
            ))
          : dreamDataMemo &&
            dreamDataMemo.map((dream) => (
              <DreamCard key={dream._id} dream={dream} />
            ))}

        {dreamDataMemo && dreamDataMemo.length >= 10 && <div ref={ref} />}
      </section>
    </main>
  );
};

export default Home;
