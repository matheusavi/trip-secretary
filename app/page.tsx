"use client";

import {
  ArrowLeftCircleIcon,
  ArrowRightCircleIcon,
} from "@heroicons/react/24/solid";
import CompromiseContainer, {
  Compromise,
  ElementType,
} from "./components/compromise";
import Slot from "./components/slot";
import Day from "./components/day";
import { useEffect, useState } from "react";
import { monitorForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";

export default function Home() {
  const days = Array.from(Array(25).keys()).slice(1);
  const [compromises, setCompromises] = useState<Compromise[]>([
    {
      id: 256,
      index: 2,
      plan: "My plan",
      costs: 20,
      resolved: false,
      size: 2,
    },
  ]);

  useEffect(() => {
    return monitorForElements({
      onDrop({ source, location }) {
        const destination = location.current.dropTargets[0];
        if (!destination) return;

        const destinationLocation = destination.data.location;

        if (typeof destinationLocation !== "number") return;

        const type = source.data.type;
        const sourceId = source.data.id;
        const compromise = compromises.find((x) => x.id == sourceId);
        invariant(compromise);
        const otherCompromises = compromises.filter((x) => x.id != sourceId);

        switch (type) {
          case ElementType.Data: {
            setCompromises([
              {
                id: compromise.id,
                costs: compromise.costs,
                index: destinationLocation,
                plan: compromise.plan,
                resolved: compromise.resolved,
                size: compromise.size,
              },
              ...otherCompromises,
            ]);
            break;
          }
          case ElementType.Resizer: {
            let newSize = destinationLocation + 1 - compromise.index;
            if (newSize <= 0) return;
            setCompromises([
              {
                id: compromise.id,
                costs: compromise.costs,
                index: compromise.index,
                plan: compromise.plan,
                resolved: compromise.resolved,
                size: newSize,
              },
              ...otherCompromises,
            ]);
            break;
          }
        }
      },
    });
  }, [compromises]);

  function renderDays() {
    const elements = [];
    let remaining = 0;
    for (var i = 0; i < days.length; i++) {
      elements.push(<Day key={i} day={days[i]} />);
      if (remaining > 0) remaining--;
      else {
        const compromise = compromises.find((x) => x.index == days[i]);
        if (compromise) {
          elements.push(<CompromiseContainer {...compromise} />);
          remaining = compromise.size - 1;
        } else {
          elements.push(<Slot key={"slot" + i} location={days[i]} />);
        }
      }
    }
    return elements;
  }

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
          {renderDays()}
        </div>
      </div>
    </main>
  );
}
