'use client'
import { createContext, Dispatch, SetStateAction, useContext, useState } from "react";

type SelectionContextProps = {
  children: React.ReactNode;
}

type SelectionContextType = {
  selectedItems: number[];
  setSelectedItems: Dispatch<SetStateAction<number[]>>;
}

export const SelectionContext = createContext<SelectionContextType>({} as SelectionContextType);

const SelectionContextProvider = ({ children }: SelectionContextProps) => {
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  return (
    <SelectionContext.Provider value={{ selectedItems, setSelectedItems }}>
      {children}
    </SelectionContext.Provider>
  );
}

export const useSelectionContext = () => useContext(SelectionContext);

export default SelectionContextProvider;