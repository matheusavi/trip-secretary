"use client";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { createCompromiseAtom } from "./compromise/compromiseAtom";

type SlotProps = {
  location: number;
};

export default function Slot({ location }: SlotProps) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
    });
  }, [location]);

  const createCompromise = useSetAtom(createCompromiseAtom);
  function handleCreateCompromise(event: React.MouseEvent<HTMLElement>) {
    createCompromise({ location: location });
  }

  return (
    <div
      ref={ref}
      className="z-10"
      style={{ gridRow: location, gridColumn: 2 }}
      data-testid={"slot-" + location}
      onClick={handleCreateCompromise}
    />
  );
}
