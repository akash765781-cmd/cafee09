import { useEffect, useState } from "react";
import { business, weekdays } from "@/lib/business";

function getBathindaNow() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Kolkata",
    weekday: "long",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    weekday: get("weekday"),
    minutes: Number(get("hour")) * 60 + Number(get("minute")),
  };
}

export function HoursCard() {
  const [now, setNow] = useState<{ weekday: string; minutes: number } | null>(null);

  useEffect(() => {
    setNow(getBathindaNow());
    const id = setInterval(() => setNow(getBathindaNow()), 60_000);
    return () => clearInterval(id);
  }, []);

  const open = now ? now.minutes >= 600 && now.minutes < 1380 : null;

  return (
    <div className="border border-border bg-card p-7 md:p-9">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h3 className="font-display text-xl font-bold uppercase tracking-tight">Opening hours</h3>
        {open !== null && (
          <span
            className={`inline-flex items-center gap-2 border px-3 py-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.16em] ${
              open ? "border-primary text-primary" : "border-border text-muted-foreground"
            }`}
          >
            <span className={`size-1.5 rounded-full ${open ? "bg-primary" : "bg-muted-foreground"}`} />
            {open ? "Open now" : "Closed now"}
          </span>
        )}
      </div>

      <dl className="mt-6 divide-y divide-border">
        {weekdays.map((day) => {
          const isToday = now?.weekday === day;
          return (
            <div
              key={day}
              className={`flex items-center justify-between py-3 text-sm ${
                isToday ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              <dt className={isToday ? "font-semibold" : ""}>{day}</dt>
              <dd className={isToday ? "font-semibold" : ""}>{business.hoursFull}</dd>
            </div>
          );
        })}
      </dl>

      <p className="mt-5 text-xs text-muted-foreground">Times shown for Bathinda (IST).</p>
    </div>
  );
}
