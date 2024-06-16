"use client";

import { Checkbox, Input } from "@headlessui/react";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export enum ElementType {
  Data,
  Resizer,
}

export class Compromise {
  id: number = 0;
  index: number = 0;
  plan: string = "";
  costs: number = 0;
  resolved: boolean = false;
  size: number = 0;
}

export default function CompromiseContainer(compromise: Compromise) {
  const ref = useRef(null);
  const dividerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const [dragging, setDragging] = useState<boolean>(false);

  function getHeight(location: DragLocationHistory) {
    return location.current.input.clientY - location.initial.input.clientY;
  }

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      onDragStart: () => setDragging(true),
      onDrop: () => setDragging(false),
      getInitialData: () => ({ id: compromise.id, type: ElementType.Data }),
    });
  }, [compromise]);

  useEffect(() => {
    const divider = dividerRef.current;
    invariant(divider);

    return draggable({
      element: divider,
      getInitialData: () => ({ id: compromise.id, type: ElementType.Resizer }),
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });

        preventUnhandled.start();
      },
      onDragStart() { },
      onDrop: ({ location }) => {
        contentRef.current?.style.setProperty(
          "height",
          `${getHeight(location)}px`,
        );
      },
      onDrag({ location }) { },
    });
  }, [compromise]);

  return (
    <div
      ref={contentRef}
      style={{ gridRow: `span ${compromise.size} / span ${compromise.size}` }}
    >
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
      <div
        ref={dividerRef}
        className="border-b-2 h-5 w-full relative flex-grow-0 bg-red-600 border-red-600 cursor-row-resize"
      ></div>
    </div>
  );
}
