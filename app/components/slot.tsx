"use client";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { ReactNode } from "react";

type SlotProps = {
  location: number;
  children: ReactNode;
};

export default function Slot({ location, children }: SlotProps) {
  const ref = useRef(null);
  const [isDraggedOver, setIsDraggegOver] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      onDragEnter: () => setIsDraggegOver(true),
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
    >
      {children}
    </div>
  );
}
