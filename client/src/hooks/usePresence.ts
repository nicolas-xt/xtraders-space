import { useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc, onSnapshot } from "firebase/firestore";
import type { UserStatus } from "@shared/schema";
import { onAuthStateChanged } from "firebase/auth";

export function usePresence() {
  const statusUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const wasInCallRef = useRef(false);

  const updateStatus = async (status: UserStatus, customStatus?: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      const updateData: any = {
        uid: user.uid,
        name: user.displayName || "Unknown User",
        email: user.email || "",
        photoURL: user.photoURL || null,
        status,
        lastSeen: Date.now(),
      };

      if (customStatus !== undefined) {
        updateData.customStatus = customStatus;
      }

      await setDoc(userRef, updateData, { merge: true });

      if (status === "In Call") {
        wasInCallRef.current = true;
      }
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const updateCustomStatus = async (customStatus: string) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(
        userRef,
        {
          customStatus: customStatus || "",
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating custom status:", error);
    }
  };

  const initializeUserPresence = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          uid: user.uid,
          name: user.displayName || "Unknown User",
          email: user.email || "",
          photoURL: user.photoURL || null,
          status: "Online" as UserStatus,
          lastSeen: Date.now(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error initializing presence:", error);
    }
  };

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    initializeUserPresence();

    const handleBeforeUnload = async () => {
      const userRef = doc(db, "users", user.uid);
      try {
        await setDoc(
          userRef,
          {
            status: "Offline" as UserStatus,
            lastSeen: Date.now(),
          },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating status on unload:", error);
      }
    };

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        if (wasInCallRef.current) {
          await updateStatus("Online");
          wasInCallRef.current = false;
        } else {
          await updateStatus("Online");
        }
      }
      // Não marcar como offline apenas por tab inativa
      // Apenas beforeunload deve marcar como offline
    };

    const handleFocus = async () => {
      if (wasInCallRef.current) {
        await updateStatus("Online");
        wasInCallRef.current = false;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("focus", handleFocus);
      if (statusUpdateTimeoutRef.current) {
        clearTimeout(statusUpdateTimeoutRef.current);
      }
    };
  }, []);

  return { updateStatus, updateCustomStatus };
}