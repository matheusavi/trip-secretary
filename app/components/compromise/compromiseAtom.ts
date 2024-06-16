import { Setter, atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { Compromise, ElementType } from "./compromise";
import {
  ElementDragPayload,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export const compromisesAtom = atom<Compromise[]>([
  {
    id: 256,
    index: 2,
    plan: "My plan",
    costs: 20,
    resolved: false,
    size: 2,
  },
]);

function modifyCompromise(
  id: number,
  updatedCompromise: Partial<Compromise>,
  compromises: Compromise[],
  set: Setter,
) {
  const updatedCompromises = compromises.map((compromise) =>
    compromise.id === id ? { ...compromise, ...updatedCompromise } : compromise,
  );
  set(compromisesAtom, updatedCompromises);
}

function updateAtom(
  source: ElementDragPayload,
  location: DragLocationHistory,
  get: () => Compromise[],
  set: Setter,
) {
  const destination = location.current.dropTargets[0];
  if (!destination) return;

  const destinationLocation = destination.data.location;
  if (typeof destinationLocation !== "number") return;

  const type = source.data.type;
  const sourceId = source.data.id;
  if (typeof sourceId !== "number") return;

  const compromises = get();
  const compromise = compromises.find((x) => x.id == sourceId);
  invariant(compromise);
  switch (type) {
    case ElementType.Data: {
      if (compromise.index == destinationLocation) return;
      modifyCompromise(
        sourceId,
        { index: destinationLocation },
        compromises,
        set,
      );
      break;
    }
    case ElementType.Resizer: {
      let newSize = destinationLocation + 1 - compromise.index;
      if (newSize <= 0 || newSize == compromise.size) return;
      modifyCompromise(sourceId, { size: newSize }, compromises, set);
      break;
    }
  }
}

export const compromiseEffect = atomEffect((get, set) => {
  return monitorForElements({
    onDrag({ source, location }) {
      updateAtom(source, location, () => get(compromisesAtom), set);
    },
    onDrop({ source, location }) {
      updateAtom(source, location, () => get(compromisesAtom), set);
    },
  });
});
