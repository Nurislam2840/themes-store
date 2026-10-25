"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
const supabase = createClient();

const StoreContext = createContext();

export function StoreProvider({ children }) {
  const [themes, setThemes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      setIsLoading(true);
      const { data, error } = await supabase.from("themes").select("*").order("created_at", { ascending: false });
      if (!error) setThemes(data || []);
      setIsLoading(false);
    };

    fetchThemes();
  }, []);

  return (
    <StoreContext.Provider value={{ themes, isLoading }}>
      {children}
    </StoreContext.Provider>
  );
}

export const useStore = () => useContext(StoreContext);
