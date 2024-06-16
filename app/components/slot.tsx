"use client";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { ReactNode } from "react";
import { ElementType } from "./compromise";

type SlotProps = {
  location: number;
};

export default function Slot({ location }: SlotProps) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggegOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      onDragEnter: (location) => {
        //    if (location.source.data.type === ElementType.Resizer) return;

        setIsDraggegOver(true);
      },
      onDragLeave: () => setIsDraggegOver(false),
      onDrop: () => setIsDraggegOver(false),
      getData: () => ({ location }),
    });
  }, [location]);

  return (
    <div
      ref={ref}
      className="bg-slate-600"
      style={isDraggedOver ? { backgroundColor: "blue" } : {}}
    />
  );
}
