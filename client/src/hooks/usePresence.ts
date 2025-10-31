import { useEffect, useRef } from "react";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";
import type { UserStatus } from "@shared/schema";

export function usePresence() {
  const statusUpdateTimeoutRef = useRef<NodeJS.Timeout>();
  const wasInCallRef = useRef(false);

  const updateStatus = async (status: UserStatus) => {
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
          status,
          lastSeen: Date.now(),
        },
        { merge: true }
      );

      if (status === "In Call") {
        wasInCallRef.current = true;
      }
    } catch (error) {
      console.error("Error updating status:", error);
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
      } else {
        if (statusUpdateTimeoutRef.current) {
          clearTimeout(statusUpdateTimeoutRef.current);
        }
        statusUpdateTimeoutRef.current = setTimeout(async () => {
          await updateStatus("Offline");
        }, 30000);
      }
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

  return { updateStatus };
}
