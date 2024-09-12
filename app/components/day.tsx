"use client";

import Slot from "./slot";
import Hour from "./hour";
import Date from "./date";
import CompromiseContainer from "./compromise/compromiseContainer";
import { useAtom, WritableAtom } from "jotai";
import {
  compromiseEffect,
  compromisesAtom,
  dateAtom,
  userIsLoggedInAtom,
} from "./compromise/compromiseAtom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useHydrateAtoms } from "jotai/utils";
import { CalendarDate } from "@internationalized/date";
import Header from "../header";

export type DayParameters = {
  userData: any;
  compromisesFromServer: any;
  date: any;
};

export default function Day({
  userData,
  compromisesFromServer,
  date,
}: DayParameters) {
  const [animationParent] = useAutoAnimate();

  let atomsToHidrate = new Map<
    WritableAtom<unknown, never[], unknown>,
    unknown
  >([[userIsLoggedInAtom, !!userData]]);

  if (compromisesFromServer != null && compromisesFromServer.length > 0)
    atomsToHidrate.set(compromisesAtom, compromisesFromServer!);

  if (date != null && typeof date === "string") {
    const [year, month, day] = date.split("-");
    if (!!year && !!month && !!day)
      atomsToHidrate.set(dateAtom, new CalendarDate(+year, +month, +day));
  }

  useHydrateAtoms(atomsToHidrate);

  const hours = Array.from(Array(25).keys()).slice(1);

  const [compromises] = useAtom(compromisesAtom);
  useAtom(compromiseEffect);

  return (
    <>
      <Header userData={userData} />
      <main className="flex flex-row w-full justify-center">
        <div className="h-full max-w-screen-xl w-full">
          <div className="flex flex-row flex-nowrap justify-end">
            <Date />
          </div>
          <div
            ref={animationParent}
            className="w-full h-full text-gray-300 grid grid-row-[max_heigth_20px] grid-cols-[0.01fr_auto]"
          >
            {hours.map((_, i) => (
              <Hour key={i} hour={hours[i]} />
            ))}
            {hours.map((_, i) => (
              <Slot key={"slot" + i} location={hours[i]} />
            ))}
            {compromises.map((value) => (
              <CompromiseContainer
                key={"compromise" + value.id}
                id={value.id}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
