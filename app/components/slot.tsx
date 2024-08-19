"use client";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useAtomValue } from "jotai";
import { useEffect, useRef } from "react";
import invariant from "tiny-invariant";
import { dateAtom } from "./compromise/compromiseAtom";
import { slotHeight } from "@/app/constants/constants";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import CompromiseForm from "./compromise/compromiseForm";

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

  const [open, setOpen] = React.useState(false);
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div
          ref={ref}
          className="z-10"
          style={{
            gridRow: location,
            gridColumn: 2,
            height: `${slotHeight}rem`,
          }}
          data-testid={"slot-" + location}
          aria-label={"Slot " + location}
        />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Edit profile</DrawerTitle>
          <DrawerDescription>
            Make changes to your profile here. Click save when youre done.
          </DrawerDescription>
        </DrawerHeader>
        <CompromiseForm className="px-4" />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
