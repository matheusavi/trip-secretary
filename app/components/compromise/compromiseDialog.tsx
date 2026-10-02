"use client";

import { Dispatch, SetStateAction } from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/components/hooks/useMediaQuery";
import CompromiseForm from "./compromiseForm";
import { Compromise } from "./compromise";

export type CompromiseDialogMode = "view" | "edit";

type CompromiseDialogProps = {
  compromise: Compromise;
  mode: CompromiseDialogMode;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

/**
 * Shows an existing compromise in the same form used to create it
 * (Dialog on desktop, Drawer on mobile, like slot.tsx).
 * "edit" lets the user change and save it, "view" is read-only.
 */
export default function CompromiseDialog({
  compromise,
  mode,
  open,
  setOpen,
}: CompromiseDialogProps) {
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const readOnly = mode === "view";
  const title = readOnly ? "View plan" : "Edit plan";

  const form = (
    <CompromiseForm
      className="px-4"
      location={compromise.index}
      setOpen={setOpen}
      compromise={compromise}
      readOnly={readOnly}
    />
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="sm:max-w-[425px]"
          aria-describedby={undefined}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          {form}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerContent aria-describedby={undefined}>
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        {form}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">{readOnly ? "Close" : "Cancel"}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
