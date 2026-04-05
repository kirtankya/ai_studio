"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function NotificationListener() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("Notification" in window)) {
      console.log("Browser does not support notifications.");
      return;
    }

    console.log("Initializing Supabase Realtime for notifications...");
    console.log("Current Notification Permission:", Notification.permission);

    const channel = supabase
      .channel('public:notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
        },
        (payload) => {
          console.log("🔔 [REALTIME] New Notification Received Payload:", payload);
          const newDoc = payload.new;
          
          if (Notification.permission === "granted") {
            console.log("Triggering browser notification bubble...");
            const notification = new Notification("Latest News Update!", {
              body: newDoc.title,
              icon: '/favicon.ico', 
            });
            
            notification.onclick = () => {
              window.open(newDoc.slug ? `/${newDoc.slug}` : newDoc.url, "_blank");
            };
          } else {
            console.warn("Notification permission is not granted. Current state:", Notification.permission);
          }
        }
      )
      .subscribe((status) => {
        console.log("✅ Supabase Realtime Subscription Status:", status);
        if (status === "SUBSCRIBED") {
          console.log("Successfully connected and listening for new news!");
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null; 
}
