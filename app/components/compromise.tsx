"use client";

import { Checkbox, Input } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";

export type Compromise = {
  id: number;
  index: number;
  plan: string;
  costs: number;
  resolved: boolean;
};

export default function CompromiseContainer(compromise: Compromise) {
  const ref = useRef(null);
  const [dragging, setDragging] = useState<boolean>(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      getInitialData: () => ({ id: compromise.id }),
    });
  }, [compromise]);

  return (
    <div
      className="bg-blue-400 p-1 space-x-1 flex flex-row"
      style={dragging ? { opacity: 0.4 } : {}}
      ref={ref}
    >
      <Input
        placeholder="Day plan"
        className="grow-[12] w-1"
        value={compromise.plan}
      />
      <Input
        placeholder="Costs"
        className="shrink grow-[1] w-1"
        value={compromise.costs}
      />
      <Checkbox
        checked={compromise.resolved}
        className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500"
      >
        <svg
          className="stroke-white opacity-0 group-data-[checked]:opacity-100"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M3 8L6 11L11 3.5"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Checkbox>
    </div>
  );
}
