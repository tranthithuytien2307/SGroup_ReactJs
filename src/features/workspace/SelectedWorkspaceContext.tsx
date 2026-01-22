import React, { createContext, useContext, useState } from "react";
import type { Workspace } from "../../entities/workspace/model/workspaceType";

type SelectedWorkspaceContextType = {
  selected: Workspace | null;
  setSelected: React.Dispatch<React.SetStateAction<Workspace | null>>;
};

const SelectedWorkspaceContext =
  createContext<SelectedWorkspaceContextType | null>(null);

export function SelectedWorkspaceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selected, setSelected] = useState<Workspace | null>(null);

  return (
    <SelectedWorkspaceContext.Provider value={{ selected, setSelected }}>
      {children}
    </SelectedWorkspaceContext.Provider>
  );
}

export const useSelectedWorkspace = () => {
  const ctx = useContext(SelectedWorkspaceContext);
  if (!ctx) {
    throw new Error(
      "useSelectedWorkspace must be used within SelectedWorkspaceProvider",
    );
  }
  return ctx;
};
