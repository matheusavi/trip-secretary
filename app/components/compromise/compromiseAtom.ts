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
import { today, getLocalTimeZone } from "@internationalized/date";
import { CalendarDate } from "@internationalized/date";
import { CompromiseDbFactory } from "@/lib/dbFactory";

export const userIsLoggedInAtom = atom<boolean>(false);

export const loadCompromiseFromDateAtom = atom(null, (get, set) => {
  const date = get(dateAtom);
  const userIsLoggedIn = get(userIsLoggedInAtom);
  CompromiseDbFactory.getCompromiseDb(userIsLoggedIn)
    .getCompromisesForTheDate(date.toString())
    .then((res) => {
      set(
        compromisesAtom,
        res.map((x: any) => Compromise.fromPlainObject(x)),
      );
    });
});

export const compromisesAtom = atom<Compromise[]>([]);

type ModifyCompromiseParameters = {
  id: string;
  update: Partial<Compromise>;
};

export const dateAtom = atom<CalendarDate>(today(getLocalTimeZone()));

export const deleteCompromiseAtom = atom(
  null,
  (get, set, { id }: { id: string }) => {
    const compromises = get(compromisesAtom).filter((x) => x.id !== id);
    set(compromisesAtom, compromises);
    CompromiseDbFactory.getCompromiseDb(
      get(userIsLoggedInAtom),
    ).deleteCompromise(id);
  },
);

export const modifyCompromiseAtom = atom(
  null,
  (get, set, { id, update }: ModifyCompromiseParameters) => {
    modifyCompromise(
      id,
      update,
      get(compromisesAtom),
      set,
      get(userIsLoggedInAtom),
    );
  },
);

type CreateCompromiseParameters = {
  location: number;
  date: string;
  plan: string;
  costs: number;
};

export const createCompromiseAtom = atom(
  null,
  (get, set, { location, date, plan, costs }: CreateCompromiseParameters) => {
    const compromises = get(compromisesAtom);
    if (isRangeAvailable(location, 1, compromises)) {
      let newCompromise = new Compromise();
      newCompromise.id = uuidv4();
      newCompromise.index = location;
      newCompromise.size = 1;
      newCompromise.date = date;
      newCompromise.plan = plan;
      newCompromise.costs = costs;
      set(compromisesAtom, [...compromises, newCompromise]);
      debouncedUpsertCompromise(
        newCompromise.id,
        newCompromise.toPlainObject(),
        get(userIsLoggedInAtom),
      );
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
      (index >= x.index && index < x.index + x.size - 1) ||
      x.index == index,
  );
  return !overlap;
}

const debounceTimers: Record<string, NodeJS.Timeout | undefined> = {};

function debounceById<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (id: string, ...args: Parameters<T>) => void {
  return function (id: string, ...args: Parameters<T>): void {
    if (debounceTimers[id]) {
      clearTimeout(debounceTimers[id]);
    }

    debounceTimers[id] = setTimeout(() => {
      func(...args);
      delete debounceTimers[id];
    }, wait);
  };
}

const debouncedUpsertCompromise = debounceById(
  async (compromise, userIsLoggedIn) => {
    await CompromiseDbFactory.getCompromiseDb(userIsLoggedIn).upsertCompromise(
      compromise,
    );
  },
  1000,
);

function modifyCompromise(
  id: string,
  updatedCompromise: Partial<Compromise>,
  compromises: Compromise[],
  set: Setter,
  userIsLoggedIn: boolean,
) {
  const updatedCompromises = compromises.map((compromise) =>
    compromise.id === id ? { ...compromise, ...updatedCompromise } : compromise,
  );
  const compromiseToUpdate = updatedCompromises.find((x) => x.id == id);
  debouncedUpsertCompromise(id, compromiseToUpdate, userIsLoggedIn);
  set(compromisesAtom, updatedCompromises as Compromise[]);
}

function updateAtom(
  source: ElementDragPayload,
  location: DragLocationHistory,
  get: () => Compromise[],
  set: Setter,
  userIsLoggedIn: boolean,
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
        userIsLoggedIn,
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

      modifyCompromise(
        sourceId,
        { size: newSize },
        compromises,
        set,
        userIsLoggedIn,
      );
      break;
    }
  }
}

export const compromiseEffect = atomEffect((get, set) => {
  return monitorForElements({
    onDrag({ source, location }) {
      updateAtom(
        source,
        location,
        () => get(compromisesAtom),
        set,
        get(userIsLoggedInAtom),
      );
    },
    onDrop({ source, location }) {
      updateAtom(
        source,
        location,
        () => get(compromisesAtom),
        set,
        get(userIsLoggedInAtom),
      );
    },
  });
});
