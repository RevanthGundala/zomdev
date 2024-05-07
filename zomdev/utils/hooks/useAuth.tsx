import React, { useState, useEffect } from "react";
import { createClient } from "../supabase/client";
import { User } from "@supabase/supabase-js";

export function useAuth() {
  const [isLoading, setIsLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [data, setData] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    setIsLoading(true);
    supabase.auth
      .getUser()
      .then((response) => {
        if (!response.error) {
          setIsAuthenticated(true);
          setData(response.data.user);
        } else {
          setIsAuthenticated(false);
          setError(response.error.message);
        }
      })
      .catch((e) => console.log("Error fetching user: ", e));
    setIsLoading(false);
  }, []);

  return { data, error, isLoading, isAuthenticated };
}
