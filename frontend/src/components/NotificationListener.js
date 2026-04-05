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

    const triggerNotification = (title, body, url) => {
      if (Notification.permission === "granted") {
        const notification = new Notification(title, {
          body: body,
          icon: '/favicon.ico', 
        });
        notification.onclick = () => {
          window.open(url || "/", "_blank");
        };
      }
    };

    const fetchLatestAndShow = async () => {
      try {
        console.log("Fetching latest news from notifications table...");
        const { data, error } = await supabase
          .from('notifications')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(1);

        console.log("Fetch result - Data:", data, "Error:", error);

        if (error) {
          console.error("Supabase error:", error);
        } else if (data && data.length > 0) {
          const latestInfo = data[0];
          const lastShown = localStorage.getItem('last_notification_id');
          
          if (lastShown !== String(latestInfo.id)) {
            console.log("Triggering explicit news notification bubble...");
            triggerNotification("⚡ Breaking News (Samachar Gujrati)", latestInfo.title, `/${latestInfo.slug}`);
            localStorage.setItem('last_notification_id', String(latestInfo.id));
          } else {
            console.log("Latest news already shown. Skipping duplicate popup.");
          }
        } 
      } catch (err) {
        console.error("Error fetching latest notification:", err);
      }
    };

    // If permission is already granted, attempt to show the latest news immediately
    if (Notification.permission === "granted") {
      fetchLatestAndShow();
    }

    // Ask for permission ONLY upon user interaction (browsers block auto-requests)
    const askPermission = () => {
      if (Notification.permission === "default") {
        Notification.requestPermission().then((p) => {
          console.log("Notification permission requested:", p);
          // When they click 'Allow', instantly show the latest news item as proof!
          if (p === "granted") {
             triggerNotification("🔔 Permission Granted!", "You will now receive live news alerts.", "/");
             setTimeout(fetchLatestAndShow, 2000); 
          }
        });
      }
    };
    window.addEventListener('click', askPermission, { once: true });

    console.log("Initializing Supabase Realtime for news notifications...");

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
          console.log("🔔 [REALTIME] New News Payload:", payload);
          const newDoc = payload.new;
          triggerNotification("⚡ Breaking News (Samachar Gujrati)", newDoc.title, `/${newDoc.slug}`);
          // Save it in local storage so page refresh doesn't trigger it again
          localStorage.setItem('last_notification_id', String(newDoc.id));
        }
      )
      .subscribe((status) => {
        console.log("✅ Supabase Realtime Subscription Status:", status);
      });

    return () => {
      window.removeEventListener('click', askPermission);
      supabase.removeChannel(channel);
    };
  }, []);

  return null; 
}
