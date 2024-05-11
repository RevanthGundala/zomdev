import React, { useState, useEffect } from "react";
import { createClient } from "../supabase/client";
import { User } from "@supabase/supabase-js";
import { getProfile } from "@/app/actions/auth/getProfile";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    getProfile()
      .then((res) => {
        const { data, error } = res;
        if (error) {
          setError(error);
          return;
        }
        setData(data);
        setIsAuthenticated(true);
      })
      .catch((e) => console.log("Error fetching user: ", e));
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, isAuthenticated };
}
