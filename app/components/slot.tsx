"use client";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useAtomValue, useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { createCompromiseAtom, dateAtom } from "./compromise/compromiseAtom";

type SlotProps = {
  location: number;
};

export default function Slot({ location }: SlotProps) {
  const ref = useRef(null);
  const date = useAtomValue(dateAtom);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
    });
  }, [location, date]);

  const createCompromise = useSetAtom(createCompromiseAtom);
  function handleCreateCompromise(event: React.MouseEvent<HTMLElement>) {
    createCompromise({ location: location, date: date.toString() });
  }

  return (
    <div
      ref={ref}
      className="z-10"
      style={{ gridRow: location, gridColumn: 2 }}
      data-testid={"slot-" + location}
      onClick={handleCreateCompromise}
      aria-label={"Slot " + location}
    />
  );
}
