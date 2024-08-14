"use client";

import { Checkbox, Textarea } from "@headlessui/react";
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
import { XCircleIcon } from "@heroicons/react/24/solid";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/16/solid";

export default function CompromiseContainer({ id }: { id: string }) {
  const ref = useRef(null);
  const dividerRef = useRef(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const compromise = useAtomValue(compromisesAtom).find((x) => x.id == id);
  const updateAtom = useSetAtom(modifyCompromiseAtom);
  const deleteAtom = useSetAtom(deleteCompromiseAtom);
  invariant(compromise);
  const [dragging, setDragging] = useState(false);
  const [linesToShow, setLinesToShow] = useState(
    getLinesToShow(compromise.size),
  );

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

  useEffect(() => {
    setLinesToShow(getLinesToShow(compromise.size));
  }, [compromise.size]);

  function getLinesToShow(size: number) {
    return (size * 2 - 1).toString();
  }

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

  return (
    <div
      ref={contentRef}
      className="col-start-3 flex flex-col compromise-container text-gray-800 font-sans text-xs"
      style={{
        gridRow: `${compromise.index} / span ${compromise.size}`,
        gridColumn: 2,
        zIndex: dragging ? 5 : 20,
        height: `${2.75 * compromise.size}rem`,
      }}
      data-testid={"container-div-" + compromise.index}
    >
      <div
        className="bg-cyan-200 pt-1 pl-1 pr-1 flex flex-grow"
        style={dragging ? { opacity: 0.4 } : {}}
        ref={ref}
        data-testid={"draggable-" + compromise.index}
      >
        <div className="flex-grow flex flex-col gap-y-0.5">
          <div className="overflow-clip flex-grow">
            <div className="">{compromise.plan + compromise.plan}</div>
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
          <Checkbox
            checked={compromise.resolved}
            className="group block h-4 aspect-square rounded border bg-white data-[checked]:bg-blue-500"
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
          <div
            onClick={handleDeletePlan}
            data-testid={"remove-" + compromise.index}
          >
            <AdjustmentsHorizontalIcon className="flex-shrink-0 h-5" />
          </div>
        </div>
      </div>
      <div
        ref={dividerRef}
        className="h-0.5 w-full flex-grow-0 flex-shrink bg-gray-100 cursor-row-resize"
        data-testid={"resizer-" + compromise.index}
      ></div>
    </div>
  );
}
