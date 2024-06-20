"use client";

import { Checkbox, Textarea } from "@headlessui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { ElementType } from "./compromise";
import { useAtomValue, useSetAtom } from "jotai";
import { compromisesAtom, modifyCompromiseAtom } from "./compromiseAtom";
import { NumberFormatValues, NumericFormat } from "react-number-format";

export default function CompromiseContainer({ id }: { id: number }) {
  const ref = useRef(null);
  const dividerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const compromise = useAtomValue(compromisesAtom).find((x) => x.id == id);
  const updateAtom = useSetAtom(modifyCompromiseAtom);
  invariant(compromise);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return draggable({
      element: el,
      onGenerateDragPreview: ({ nativeSetDragImage }) => {
        disableNativeDragPreview({ nativeSetDragImage });
        preventUnhandled.start();
      },
      onDragStart() {
        setDragging(true);
      },
      onDrop: () => {
        setDragging(false);
        preventUnhandled.stop();
      },
      getInitialData: () => ({ id: compromise.id, type: ElementType.Data }),
    });
  }, [dragging, compromise.id]);

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
      onDragStart() {
        setDragging(true);
      },
      onDrop: () => {
        preventUnhandled.stop();
        setDragging(false);
      },
    });
  }, [dragging, compromise.id]);

  function handleResolvedChange(checked: boolean): void {
    updateAtom({ id: id, update: { resolved: checked } });
  }

  function handleCostsChanged(values: NumberFormatValues): void {
    updateAtom({
      id: id,
      update: { costs: values.floatValue },
    });
  }

  function handlePlanChange(event: ChangeEvent<HTMLTextAreaElement>): void {
    updateAtom({ id: id, update: { plan: event.target.value } });
  }

  return (
    <div
      ref={contentRef}
      className="col-start-3 flex flex-col"
      style={{
        gridRow: `${compromise.index} / span ${compromise.size}`,
        gridColumn: 2,
        zIndex: dragging ? 5 : 20,
      }}
      data-testid="container-div"
    >
      <div
        className="bg-blue-400 p-1 space-x-1 flex flex-grow w-full"
        style={dragging ? { opacity: 0.4 } : {}}
        ref={ref}
        data-testid="draggable"
      >
        <Textarea
          placeholder="Day plan"
          className="grow-[12] w-1"
          value={compromise.plan}
          onChange={handlePlanChange}
        />
        <NumericFormat
          placeholder="Costs"
          className="shrink grow-[1] w-1"
          value={compromise.costs}
          onValueChange={handleCostsChanged}
          prefix="$"
        />
        <Checkbox
          checked={compromise.resolved}
          className="group block size-4 rounded border bg-white data-[checked]:bg-blue-500"
          data-testid="checkbox"
          onChange={handleResolvedChange}
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
        className="h-2 w-full flex-grow-0 flex-shrink bg-red-600 cursor-row-resize"
        data-testid="resizer"
      ></div>
    </div>
  );
}
