"use client";

import { Provider } from "jotai";
import { ReactNode } from "react";

type ProviderParams = {
  children: ReactNode;
};

export const Providers = ({ children }: ProviderParams) => {
  return <Provider>{children}</Provider>;
};
