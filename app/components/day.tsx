"use client";

import Slot from "./slot";
import Hour from "./hour";
import Date from "./date";
import CompromiseContainer from "./compromise/compromiseContainer";
import { useAtom } from "jotai";
import { compromiseEffect, compromisesAtom } from "./compromise/compromiseAtom";
import { useAutoAnimate } from "@formkit/auto-animate/react";

export default function Day() {
  const [animationParent] = useAutoAnimate();
  const hours = Array.from(Array(25).keys()).slice(1);

  const [compromises] = useAtom(compromisesAtom);
  useAtom(compromiseEffect);

  return (
    <main className="flex flex-row w-full justify-center">
      <div className="container bg-slate-600">
        <div className="flex flex-row flex-nowrap justify-between">
          <h1 className="flex-grow" data-testid="title">
            Trip to Monza
          </h1>
          <Date />
        </div>
        <div
          ref={animationParent}
          className="bg-black w-full h-full text-black grid grid-cols-[0.01fr_auto] gap-1"
        >
          {hours.map((_, i) => (
            <Hour key={i} day={hours[i]} />
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
