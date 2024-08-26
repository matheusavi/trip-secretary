"use client";

import { dropTargetForElements } from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import { useEffect, useRef, useState } from "react";
import invariant from "tiny-invariant";
import { slotHeight } from "@/app/constants/constants";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { useMediaQuery } from "@/components/hooks/useMediaQuery";

import CompromiseForm from "./compromise/compromiseForm";

type SlotProps = {
  location: number;
};

export default function Slot({ location }: SlotProps) {
  const ref = useRef(null);

  const isDesktop = useMediaQuery("(min-width: 768px)");

  useEffect(() => {
    const el = ref.current;
    invariant(el);

    return dropTargetForElements({
      element: el,
      getData: () => ({ location }),
    });
  }, [location, isDesktop]);

  const [open, setOpen] = useState(false);

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div
            ref={ref}
            className="z-10 border-gray-100 border-b"
            style={{
              gridRow: location,
              gridColumn: 2,
              height: `${slotHeight}rem`,
            }}
            data-testid={"slot-" + location}
            aria-label={"Slot " + location}
          />
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a plan</DialogTitle>
          </DialogHeader>
          <CompromiseForm
            className="px-4"
            location={location}
            setOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <div
          ref={ref}
          className="z-10 border-gray-100 border-b"
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
          <DrawerTitle>Create a plan</DrawerTitle>
        </DrawerHeader>
        <CompromiseForm
          className="px-4"
          location={location}
          setOpen={setOpen}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
