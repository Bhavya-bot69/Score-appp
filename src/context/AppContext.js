import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
import { supabase } from "../supabaseClient"; // Adjust path as needed

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [judges, setJudges] = useState([]);
  const [categories, setCategories] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from localStorage (keeping your existing data structure)
  const loadData = useCallback(() => {
    setEvents(
      JSON.parse(localStorage.getItem("events")) || [
        { id: 1, name: "Event 1", description: "First event" },
      ]
    );
    setTeams(
      JSON.parse(localStorage.getItem("teams")) || [
        { id: 1, name: "Team A", description: "Team Alpha" },
        { id: 2, name: "Team B", description: "Team Beta" },
      ]
    );
    setJudges(
      JSON.parse(localStorage.getItem("judges")) || [
        { id: 1, name: "Judge 1", description: "First judge" },
      ]
    );
    setCategories(
      JSON.parse(localStorage.getItem("categories")) || [
        { id: 1, name: "Idea", weight: 1 },
        { id: 2, name: "Presentation", weight: 1 },
        { id: 3, name: "Execution", weight: 1 },
      ]
    );
    setEvaluations(JSON.parse(localStorage.getItem("evaluations")) || []);
  }, []);

  // Save data to localStorage (keeping your existing functionality)
  const saveData = useCallback(() => {
    localStorage.setItem("events", JSON.stringify(events));
    localStorage.setItem("teams", JSON.stringify(teams));
    localStorage.setItem("judges", JSON.stringify(judges));
    localStorage.setItem("categories", JSON.stringify(categories));
    localStorage.setItem("evaluations", JSON.stringify(evaluations));
  }, [events, teams, judges, categories, evaluations]);

  // Supabase Auth: Sign Up
  const signUp = async (email, password, name) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Supabase Auth: Sign In
  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Login function (updated for Supabase)
  const login = (userData) => {
    setUser({
      role: "admin",
      username: userData.user_metadata?.name || userData.email,
      email: userData.email,
      id: userData.id,
    });
  };

  // Logout (updated for Supabase)
  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      setUser(null);
      // Clear any local storage if needed
      localStorage.removeItem("currentUser");
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser({
          role: "admin",
          username: session.user.user_metadata?.name || session.user.email,
          email: session.user.email,
          id: session.user.id,
        });
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUser({
          role: "admin",
          username: session.user.user_metadata?.name || session.user.email,
          email: session.user.email,
          id: session.user.id,
        });
      } else {
        setUser(null);
      }
    });

    loadData();

    return () => subscription.unsubscribe();
  }, [loadData]);

  // Save data when state changes
  useEffect(() => {
    saveData();
  }, [saveData]);

  return (
    <AppContext.Provider
      value={{
        user,
        events,
        teams,
        judges,
        categories,
        evaluations,
        loading,
        login,
        logout,
        signUp,
        signIn,
        setEvents,
        setTeams,
        setJudges,
        setCategories,
        setEvaluations,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);