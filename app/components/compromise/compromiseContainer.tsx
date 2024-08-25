"use client";

import { Checkbox } from "@headlessui/react";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { draggable } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { preventUnhandled } from "@atlaskit/pragmatic-drag-and-drop/prevent-unhandled";
import { disableNativeDragPreview } from "@atlaskit/pragmatic-drag-and-drop/element/disable-native-drag-preview";
import { ElementType } from "./compromise";
import { useAtomValue, useSetAtom } from "jotai";
import {
  compromisesAtom,
  deleteCompromiseAtom,
  modifyCompromiseAtom,
} from "./compromiseAtom";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";
import { slotHeight } from "@/app/constants/constants";

export default function CompromiseContainer({ id }: { id: string }) {
  const ref = useRef<HTMLDivElement | null>(null);
  const dividerRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const planRef = useRef<HTMLDivElement | null>(null);
  const compromise = useAtomValue(compromisesAtom).find((x) => x.id == id);
  const updateAtom = useSetAtom(modifyCompromiseAtom);
  const deleteAtom = useSetAtom(deleteCompromiseAtom);
  invariant(compromise);
  const [dragging, setDragging] = useState(false);
  const [linesToShow, setLinesToShow] = useState("1");

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

  function handleDeletePlan(event: React.MouseEvent<HTMLElement>) {
    deleteAtom({ id: id });
  }

  useEffect(() => {
    setLinesToShow(getLinesToShow());
  }, [compromise.size]);

  function getLinesToShow(): string {
    const containerHeight = ref.current?.clientHeight;
    if (!planRef.current) return "1";

    let lineHeight = parseInt(
      window.getComputedStyle(planRef.current).getPropertyValue("line-height"),
    );
    if (typeof containerHeight !== "number" || typeof lineHeight !== "number")
      return "1";

    let clamp = Math.floor((containerHeight - lineHeight) / lineHeight);
    return clamp + "";
  }

  return (
    <div
      ref={contentRef}
      className="col-start-3 bg-white text-primary compromise-container font-sans text-sm rounded-md border mb-0.5 p-1 border-slate-200 shadow-md mr-2"
      style={{
        gridRow: `${compromise.index} / span ${compromise.size}`,
        gridColumn: 2,
        zIndex: dragging ? 5 : 20,
        height: `${slotHeight * compromise.size - 0.25}rem`,
      }}
      data-testid={"container-div-" + compromise.index}
    >
      <div
        className="flex flex-grow-0 h-full"
        style={{
          opacity: dragging ? 0.4 : 1,
        }}
        ref={ref}
        data-testid={"draggable-" + compromise.index}
      >
        <div className="flex-grow flex-shrink flex flex-col">
          <div className="overflow-clip flex-grow">
            <div
              ref={planRef}
              className="overflow-hidden"
              style={
                {
                  display: "-webkit-box",
                  "-webkit-box-orient": "vertical",
                  "-webkit-line-clamp": linesToShow,
                } as React.CSSProperties
              }
            >
              {compromise.plan}
            </div>
          </div>
          <NumericFormat
            placeholder="Costs"
            className="shrink-0"
            displayType="text"
            value={compromise.costs}
            onValueChange={handleCostsChanged}
            prefix="$"
          />
        </div>
        <div className="flex-grow-0 flex-shrink-0">
          <div onClick={handleDeletePlan} className="flex-shrink-0 m-0.5">
            <AdjustmentsHorizontalIcon className="h-5" />
          </div>
        </div>
      </div>
      <div
        ref={dividerRef}
        className="w-full cursor-row-resize bottom-4 h-4 relative"
        data-testid={"resizer-" + compromise.index}
      ></div>
    </div>
  );
}
