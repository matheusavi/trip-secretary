import { Setter, atom } from "jotai";
import { atomEffect } from "jotai-effect";
import { Compromise, ElementType } from "./compromise";
import { v4 as uuidv4 } from "uuid";
import {
  ElementDragPayload,
  monitorForElements,
} from "@atlaskit/pragmatic-drag-and-drop/element/adapter";
import invariant from "tiny-invariant";
import { DragLocationHistory } from "@atlaskit/pragmatic-drag-and-drop/dist/types/internal-types";

export const compromisesAtom = atom<Compromise[]>([]);

type ModifyCompromiseParameters = {
  id: string;
  update: Partial<Compromise>;
};

export const modifyCompromiseAtom = atom(
  null,
  (get, set, { id, update }: ModifyCompromiseParameters) => {
    modifyCompromise(id, update, get(compromisesAtom), set);
  },
);

type CreateCompromiseParameters = {
  location: number;
};

export const createCompromiseAtom = atom(
  null,
  (get, set, { location }: CreateCompromiseParameters) => {
    const compromises = get(compromisesAtom);
    if (isRangeAvailable(location, 1, compromises)) {
      let newCompromise = new Compromise();
      newCompromise.id = uuidv4();
      newCompromise.index = location;
      newCompromise.size = 1;
      set(compromisesAtom, [...compromises, newCompromise]);
    }
  },
);

function isRangeAvailable(
  index: number,
  size: number,
  compromises: Compromise[],
): boolean {
  const endIndex = index + size - 1;
  if (endIndex > 24) return false;

  if (index < 1) return false;

  const overlap = compromises.find(
    (x) =>
      (index < x.index && endIndex >= x.index) ||
      (index >= x.index && index < x.index + x.size - 1),
  );
  return !overlap;
}

function modifyCompromise(
  id: string,
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
  if (typeof sourceId !== "string") return;

  const compromises = get();
  const compromise = compromises.find((x) => x.id == sourceId);
  invariant(compromise);
  switch (type) {
    case ElementType.Data: {
      if (
        compromise.index == destinationLocation ||
        !isRangeAvailable(
          destinationLocation,
          compromise.size,
          compromises.filter((x) => x.id !== sourceId),
        )
      )
        return;

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
      if (
        newSize <= 0 ||
        newSize == compromise.size ||
        !isRangeAvailable(
          compromise.index,
          newSize,
          compromises.filter((x) => x.id !== sourceId),
        )
      )
        return;

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
