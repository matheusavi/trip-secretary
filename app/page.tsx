"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import CompromiseContainer, { Compromise } from "./components/compromise";
import Slot from "./components/slot";
import Day from "./components/day";
import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

export default function Home() {
  const days = Array.from(Array(25).keys()).slice(1);
  const [compromises, setCompromises] = useState<Compromise[]>([
    { id: 256, index: 2, plan: "My plan", costs: 20, resolved: false },
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationLocation = destination.data.location;
        if (typeof destinationLocation !== "number") return;

        const sourceId = source.data.id;

        const compromise = compromises.find((x) => x.id == sourceId);
        invariant(compromise);
        const otherCompromises = compromises.filter((x) => x.id != sourceId);

        setCompromises([
          {
            id: compromise.id,
            costs: compromise.costs,
            index: destinationLocation,
            plan: compromise.plan,
            resolved: compromise.resolved,
          },
          ...otherCompromises,
        ]);
      },
    });
  }, [compromises]);

  return (
    <main className="flex flex-row w-full justify-center">
      <div className="container bg-slate-600">
        <div className="flex flex-row flex-nowrap justify-between">
          <h1 className="flex-grow">Trip to Monza - 01/06/2024</h1>
          <div className="h-8 flex flex-row justify-between grow-0">
            <ArrowLeftCircleIcon />
            <ArrowRightCircleIcon />
          </div>
        </div>
        <div className="bg-white w-full h-full text-black grid grid-cols-[0.01fr_auto] gap-1">
          {days.map((item, index) => {
            const compromise = compromises.find((x) => x.index == item);
            return (
              <>
                <Day key={index} day={item} />
                <Slot key={index + 100} location={item}>
                  {compromise ? <CompromiseContainer {...compromise} /> : ""}
                </Slot>
              </>
            );
          })}
        </div>
      </div>
    </main>
  );
}
