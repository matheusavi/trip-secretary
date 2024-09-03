"use client";

import Slot from "./slot";
import Hour from "./hour";
import Date from "./date";
import CompromiseContainer from "./compromise/compromiseContainer";
import { useAtom } from "jotai";
import {
  compromiseEffect,
  compromisesAtom,
  userIsLoggedInAtom,
} from "./compromise/compromiseAtom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useHydrateAtoms } from "jotai/utils";

export default function Day({ userLoggedIn }: { userLoggedIn: boolean }) {
  const [animationParent] = useAutoAnimate();

  useHydrateAtoms([[userIsLoggedInAtom, userLoggedIn]]);

  const hours = Array.from(Array(25).keys()).slice(1);

  const [compromises] = useAtom(compromisesAtom);
  useAtom(compromiseEffect);

  return (
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
            <CompromiseContainer key={"compromise" + value.id} id={value.id} />
          ))}
        </div>
      </div>
    </main>
  );
}
