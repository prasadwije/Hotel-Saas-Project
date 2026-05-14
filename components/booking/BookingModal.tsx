import { useEffect, useMemo, useRef, useState } from "react";
import { format, differenceInCalendarDays } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  Calendar as CalendarIcon,
  Users,
  Minus,
  Plus,
  BedDouble,
  ArrowRight,
  ArrowLeft,
  Check,
  Sparkles,
  AlertCircle,
  ImageOff,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";

import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

import { SERIF, type HotelData, type Room } from "@/components/template/blocks/shared";
import { useBooking } from "./BookingContext";

type Props = { data: HotelData };
type Step = 1 | 2 | 3;
type Quantities = Record<string, number>;

const STORAGE_KEY = "lovable:booking:v1";

type PersistedState = {
  fromISO?: string;
  toISO?: string;
  adults?: number;
  children?: number;
  quantities?: Quantities;
  name?: string;
  email?: string;
  phone?: string;
  requests?: string;
};

function loadPersisted(): PersistedState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as PersistedState) : {};
  } catch {
    return {};
  }
}

function savePersisted(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* ignore quota / privacy errors */
  }
}

function clearPersisted() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

function parsePrice(price?: string): { amount: number; currency: string } | null {
  if (!price) return null;
  const m = price.match(/([^\d.,\s]+)?\s*([\d.,]+)/);
  if (!m) return null;
  const currency = m[1] ?? "";
  const amount = parseFloat(m[2].replace(/[,\s]/g, ""));
  if (!isFinite(amount) || amount <= 0) return null;
  return { amount, currency };
}

/* Deterministic pseudo-availability so the same room + date range always
 * returns the same result. Replace with a real API once wired up. */
function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
function checkAvailability(roomName: string, range?: DateRange): { ok: boolean; left: number } {
  if (!range?.from || !range?.to) return { ok: true, left: 9 };
  const key = `${roomName}|${range.from.toDateString()}|${range.to.toDateString()}`;
  const h = hash(key);
  const left = h % 7; // 0..6
  return { ok: left > 0, left };
}

export function BookingModal({ data }: Props) {
  const { isOpen, roomName: defaultRoomName, closeBooking } = useBooking();
  const rooms = data.rooms ?? [];

  // Lazy-load persisted state once on mount so inputs survive close/reopen.
  const persisted = useMemo(loadPersisted, []);
  const hadPersistedAtMount = useMemo(
    () => Object.keys(persisted).length > 0,
    [persisted],
  );

  const [step, setStep] = useState<Step>(1);
  const [range, setRange] = useState<DateRange | undefined>(() => {
    const from = persisted.fromISO ? new Date(persisted.fromISO) : undefined;
    const to = persisted.toISO ? new Date(persisted.toISO) : undefined;
    if (!from && !to) return undefined;
    return { from, to };
  });
  const [adults, setAdults] = useState<number>(persisted.adults ?? 2);
  const [children, setChildren] = useState<number>(persisted.children ?? 0);
  const [quantities, setQuantities] = useState<Quantities>(persisted.quantities ?? {});

  const [name, setName] = useState(persisted.name ?? "");
  const [email, setEmail] = useState(persisted.email ?? "");
  const [phone, setPhone] = useState(persisted.phone ?? "");
  const [requests, setRequests] = useState(persisted.requests ?? "");

  // Track whether the user currently has any saved/in-progress booking data,
  // so we can show the "Clear saved booking" affordance only when relevant.
  const [hasPersisted, setHasPersisted] = useState<boolean>(hadPersistedAtMount);

  // Heading ref — moves focus when step changes (a11y).
  const headingRef = useRef<HTMLHeadingElement>(null);

  // When modal opens: reset to step 1 and (if a default room was clicked)
  // pre-select it without wiping the user's other restored selections.
  useEffect(() => {
    if (!isOpen) return;
    setStep(1);
    if (defaultRoomName && rooms.some((r) => r.name === defaultRoomName)) {
      setQuantities((prev) => (prev[defaultRoomName] ? prev : { ...prev, [defaultRoomName]: 1 }));
    }
  }, [isOpen, defaultRoomName, rooms]);

  // When the step changes (and modal is open), shift focus to the heading so
  // screen readers announce the new section and keyboard users land in context.
  useEffect(() => {
    if (!isOpen) return;
    const id = window.setTimeout(() => headingRef.current?.focus(), 60);
    return () => window.clearTimeout(id);
  }, [step, isOpen]);

  // Persist on every change (debounced via microtask is overkill — writes are tiny).
  useEffect(() => {
    const payload: PersistedState = {
      fromISO: range?.from?.toISOString(),
      toISO: range?.to?.toISOString(),
      adults,
      children,
      quantities,
      name,
      email,
      phone,
      requests,
    };
    savePersisted(payload);
    const meaningful =
      !!payload.fromISO ||
      !!payload.toISO ||
      Object.values(quantities).some((n) => (n ?? 0) > 0) ||
      !!name.trim() ||
      !!email.trim() ||
      !!phone.trim() ||
      !!requests.trim();
    setHasPersisted(meaningful);
  }, [range, adults, children, quantities, name, email, phone, requests]);

  // Re-clamp quantities when date range changes (auto-adjust)
  useEffect(() => {
    if (!range?.from || !range?.to) return;
    setQuantities((prev) => {
      const next: Quantities = {};
      let changed = false;
      for (const r of rooms) {
        const cur = prev[r.name] ?? 0;
        const { ok, left } = checkAvailability(r.name, range);
        const max = ok ? left : 0;
        const clamped = Math.min(cur, max);
        if (clamped !== cur) changed = true;
        if (clamped > 0) next[r.name] = clamped;
      }
      return changed ? next : prev;
    });
  }, [range, rooms]);

  const nights =
    range?.from && range?.to ? Math.max(0, differenceInCalendarDays(range.to, range.from)) : 0;

  const setQty = (roomName: string, n: number, max: number) =>
    setQuantities((q) => ({ ...q, [roomName]: Math.max(0, Math.min(max, n)) }));

  const totalRooms = useMemo(
    () => Object.values(quantities).reduce((s, n) => s + (n || 0), 0),
    [quantities],
  );

  const selectedLines = useMemo(() => {
    return rooms
      .map((r) => {
        const qty = quantities[r.name] ?? 0;
        if (qty <= 0) return null;
        const p = parsePrice(r.price);
        return { room: r, qty, price: p };
      })
      .filter((x): x is { room: Room; qty: number; price: ReturnType<typeof parsePrice> } => !!x);
  }, [rooms, quantities]);

  const currency =
    selectedLines.find((l) => l.price?.currency)?.price?.currency ??
    parsePrice(rooms[0]?.price)?.currency ??
    "";

  const grandTotal = useMemo(() => {
    if (nights <= 0) return 0;
    return selectedLines.reduce(
      (s, l) => s + (l.price?.amount ?? 0) * l.qty * nights,
      0,
    );
  }, [selectedLines, nights]);

  const dateLabel =
    range?.from && range?.to
      ? `${format(range.from, "MMM d")} → ${format(range.to, "MMM d, yyyy")}`
      : range?.from
        ? `${format(range.from, "MMM d, yyyy")} — select check-out`
        : "Select your dates";

  const guestLabel = `${adults} ${adults === 1 ? "Adult" : "Adults"}${children > 0 ? ` · ${children} ${children === 1 ? "Child" : "Children"}` : ""
    }`;

  const canContinue = !!range?.from && !!range?.to && nights > 0 && totalRooms > 0;
  const canSubmit = canContinue && name.trim().length > 1 && /\S+@\S+\.\S+/.test(email);

  const goToStep = (target: Step) => {
    if (target === step) return;
    if (target === 1) setStep(1);
    else if (target === 2 && canContinue) setStep(2);
    else if (target === 3 && canSubmit) setStep(3);
  };

  const handlePrimary = () => {
    if (step === 1 && canContinue) setStep(2);
    else if (step === 2 && canSubmit) {
      setStep(3);
      clearPersisted();
    }
  };

  const primaryLabel = step === 1 ? "Continue to details" : "Confirm reservation";

  const handleClearSaved = () => {
    clearPersisted();
    setRange(undefined);
    setAdults(2);
    setChildren(0);
    setQuantities({});
    setName("");
    setEmail("");
    setPhone("");
    setRequests("");
    setStep(1);
    setHasPersisted(false);
    window.setTimeout(() => headingRef.current?.focus(), 60);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(o) => !o && closeBooking()}>
      <DialogContent
        className={cn(
          "site-booking-modal max-h-[94vh] w-[96vw] max-w-4xl overflow-hidden border border-white/70 bg-white p-0 shadow-[0_40px_120px_-24px_rgba(0,0,0,0.45)]",
          "rounded-[24px] sm:rounded-[28px]",
          "data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=open]:slide-in-from-bottom-6 data-[state=open]:duration-300",
          "data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=closed]:duration-200",
        )}
      >
        {/* Header */}
        <div
          className="relative px-5 pb-5 pt-6 sm:px-8 sm:pt-7"
          style={{
            background:
              "linear-gradient(180deg, color-mix(in oklab, var(--site-primary) 12%, #ffffff) 0%, #ffffff 100%)",
          }}
        >
          <div className="flex items-center justify-between">
            <p
              className="text-[10px] font-medium uppercase tracking-[0.35em]"
              style={{ color: "var(--site-primary)" }}
            >
              Direct booking
            </p>
            {hasPersisted && step !== 3 && (
              <button
                type="button"
                onClick={handleClearSaved}
                className="group inline-flex items-center gap-1.5 rounded-full border border-neutral-200/80 bg-white/70 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-neutral-500 backdrop-blur-md transition-all duration-200 hover:-translate-y-px hover:border-neutral-400 hover:text-neutral-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-primary)]/40"
                aria-label="Clear saved booking and start over"
              >
                <RotateCcw className="h-3 w-3 transition-transform duration-300 group-hover:-rotate-45" />
                Clear
              </button>
            )}
          </div>

          <Stepper
            step={step}
            canContinue={canContinue}
            canSubmit={canSubmit}
            onNavigate={goToStep}
          />

          <DialogTitle
            ref={headingRef}
            tabIndex={-1}
            className="mt-2 text-2xl font-light tracking-tight text-neutral-900 sm:text-3xl"
            style={{ fontFamily: SERIF, outline: "none" }}
          >
            {step === 3 ? "Request received" : step === 2 ? "Confirm your stay" : "Reserve your stay"}
          </DialogTitle>
          <DialogDescription className="mt-1.5 text-sm text-neutral-500">
            {step === 3 ? (
              <>We'll be in touch shortly to confirm your reservation.</>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                Best rates guaranteed at {data.businessName}
              </span>
            )}
          </DialogDescription>
        </div>

        {step !== 3 ? (
          <div
            id={`booking-step-panel-${step}`}
            role="tabpanel"
            aria-labelledby={`booking-step-tab-${step}`}
            className="grid max-h-[calc(94vh-150px)] grid-cols-1 overflow-hidden md:grid-cols-[1.05fr_1fr]"
          >
            {/* LEFT — dates / guests / details */}
            <div className="space-y-3 overflow-y-auto px-5 pb-5 pt-4 sm:px-8 md:border-r md:border-neutral-100">
              {/* Dates */}
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={triggerCls}>
                    <div className="flex items-center gap-3">
                      <IconBubble><CalendarIcon className="h-4 w-4" /></IconBubble>
                      <div className="min-w-0">
                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
                          Check-in → Check-out
                        </p>
                        <p className="mt-0.5 truncate text-sm font-medium text-neutral-900">{dateLabel}</p>
                      </div>
                    </div>
                    {nights > 0 && (
                      <span
                        className="shrink-0 rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-white"
                        style={{ backgroundColor: "var(--site-primary)" }}
                      >
                        {nights} {nights === 1 ? "night" : "nights"}
                      </span>
                    )}
                  </button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-auto rounded-2xl border border-neutral-200 bg-white p-0 shadow-2xl" align="center" sideOffset={8}>
                  <Calendar
                    mode="range"
                    numberOfMonths={1}
                    selected={range}
                    onSelect={setRange}
                    disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              {/* Guests */}
              <Popover>
                <PopoverTrigger asChild>
                  <button type="button" className={triggerCls}>
                    <div className="flex items-center gap-3">
                      <IconBubble><Users className="h-4 w-4" /></IconBubble>
                      <div>
                        <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
                          Guests
                        </p>
                        <p className="mt-0.5 text-sm font-medium text-neutral-900">{guestLabel}</p>
                      </div>
                    </div>
                  </button>
                </PopoverTrigger>
                <PopoverContent className="z-[60] w-72 rounded-2xl border border-neutral-200 bg-white p-5 shadow-2xl" align="end" sideOffset={8}>
                  <CounterRow label="Adults" sub="Age 13+" value={adults} min={1} max={9} onChange={setAdults} />
                  <div className="my-3 h-px bg-neutral-100" />
                  <CounterRow label="Children" sub="Age 2 – 12" value={children} min={0} max={9} onChange={setChildren} />
                </PopoverContent>
              </Popover>

              {/* Step 2: details */}
              {step === 2 && (
                <div className="space-y-3 pt-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-300">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <FieldShell label="Full name">
                      <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className={inputCls} />
                    </FieldShell>
                    <FieldShell label="Email">
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" className={inputCls} />
                    </FieldShell>
                  </div>
                  <FieldShell label="Phone">
                    <Input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 555 123 4567" className={inputCls} />
                  </FieldShell>
                  <FieldShell label="Special requests">
                    <Textarea
                      value={requests}
                      onChange={(e) => setRequests(e.target.value)}
                      rows={3}
                      placeholder="Anniversary stay, late check-in, dietary needs…"
                      className={cn(inputCls, "min-h-[88px] resize-none py-3")}
                    />
                  </FieldShell>
                </div>
              )}
            </div>

            {/* RIGHT — room cart + summary */}
            <div className="flex min-h-0 flex-col bg-gradient-to-b from-neutral-50/70 via-white to-white">
              <div className="flex items-baseline justify-between px-5 pb-2 pt-4 sm:px-7">
                <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-500">
                  Choose your rooms
                </p>
                <p className="text-[11px] text-neutral-400">
                  {totalRooms} selected
                </p>
              </div>
              <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto px-5 pb-3 sm:px-7">
                {rooms.map((r) => {
                  const av = checkAvailability(r.name, range);
                  const max = av.ok ? av.left : 0;
                  return (
                    <RoomCard
                      key={r.name}
                      room={r}
                      qty={quantities[r.name] ?? 0}
                      max={max}
                      available={av.ok}
                      hasDates={!!(range?.from && range?.to)}
                      onChange={(n) => setQty(r.name, n, max)}
                    />
                  );
                })}
                {rooms.length === 0 && (
                  <p className="rounded-2xl border border-dashed border-neutral-200 px-4 py-6 text-center text-sm text-neutral-400">
                    No rooms configured.
                  </p>
                )}
              </div>

              <div className="border-t border-neutral-100 px-5 pb-5 pt-4 sm:px-7">
                <PriceSummary
                  lines={selectedLines}
                  nights={nights}
                  total={grandTotal}
                  currency={currency}
                />
                <div className="mt-3 flex items-center gap-2.5">
                  {step === 2 && (
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setStep(1)}
                      className="h-12 rounded-full px-4 text-xs uppercase tracking-[0.25em] text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900"
                    >
                      <ArrowLeft className="mr-1.5 h-4 w-4" /> Back to stay
                    </Button>
                  )}
                  <Button
                    type="button"
                    onClick={handlePrimary}
                    disabled={step === 1 ? !canContinue : !canSubmit}
                    className={cn(
                      "h-12 flex-1 rounded-full text-sm font-medium uppercase tracking-[0.2em] text-white shadow-lg",
                      "transition-all duration-300 hover:shadow-xl hover:brightness-110 active:scale-[0.99]",
                      "disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none disabled:hover:brightness-100",
                    )}
                    style={{
                      background:
                        "linear-gradient(135deg, var(--site-primary) 0%, color-mix(in oklab, var(--site-primary) 75%, #000) 100%)",
                    }}
                  >
                    {primaryLabel}
                    {step === 1 ? (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    ) : (
                      <Sparkles className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="pt-2 text-center text-[11px] text-neutral-400">
                  No payment required · Best-rate guarantee · Free cancellation
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div
            id="booking-step-panel-3"
            role="tabpanel"
            aria-labelledby="booking-step-tab-3"
            className="px-6 pb-8 pt-2 text-center sm:px-7"
          >
            <div
              className="mx-auto flex h-14 w-14 items-center justify-center rounded-full"
              style={{
                backgroundColor: "color-mix(in oklab, var(--site-primary) 14%, transparent)",
                color: "var(--site-primary)",
              }}
            >
              <Check className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-xl font-light tracking-tight text-neutral-900" style={{ fontFamily: SERIF }}>
              Thank you, {name.split(" ")[0] || "guest"}
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-neutral-500">
              {selectedLines.map((l) => `${l.qty}× ${l.room.name}`).join(" · ")}
              {range?.from && range?.to ? (
                <>
                  {" "}· {format(range.from, "MMM d")} — {format(range.to, "MMM d, yyyy")}
                </>
              ) : null}
            </p>
            {grandTotal > 0 && (
              <p className="mt-1 text-sm font-medium text-neutral-900">
                Estimated total {currency}
                {grandTotal.toLocaleString()}
              </p>
            )}
            <p className="mt-3 text-xs text-neutral-400">
              A confirmation has been sent to {email}.
            </p>
            <Button
              variant="ghost"
              onClick={closeBooking}
              className="mt-5 rounded-full text-xs uppercase tracking-[0.25em] hover:bg-neutral-100"
            >
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

const triggerCls = cn(
  "group flex w-full items-center justify-between gap-3 rounded-2xl border border-neutral-200/80 bg-white/80 px-4 py-3.5 text-left backdrop-blur-md transition-all duration-300 sm:px-5 sm:py-4",
  "hover:-translate-y-px hover:border-[color:var(--site-primary)]/40 hover:shadow-[0_10px_30px_-15px_rgba(0,0,0,0.2)]",
  "focus:outline-none focus:ring-2 focus:ring-[color:var(--site-primary)]/40",
);

const inputCls = cn(
  "h-11 rounded-xl border-neutral-200 bg-white px-4 text-sm text-neutral-900 transition-all",
  "hover:border-neutral-900/40 focus-visible:ring-2 focus-visible:ring-[color:var(--site-primary)]/40 focus-visible:ring-offset-0",
);

const STEP_LABELS: Record<Step, string> = {
  1: "Stay",
  2: "Details",
  3: "Confirmed",
};

function Stepper({
  step,
  canContinue,
  canSubmit,
  onNavigate,
}: {
  step: Step;
  canContinue: boolean;
  canSubmit: boolean;
  onNavigate: (s: Step) => void;
}) {
  const steps: Step[] = [1, 2, 3];
  // Progress: 0% at step 1, 50% at 2, 100% at 3.
  const progress = step === 1 ? 0 : step === 2 ? 50 : 100;

  const isReachable = (target: Step): boolean => {
    if (target === 1) return true;
    if (target === 2) return canContinue || step >= 2;
    return canSubmit || step >= 3;
  };

  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);

  const focusStep = (s: Step) => {
    const el = btnRefs.current[s - 1];
    el?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, current: Step) => {
    const order: Step[] = [1, 2, 3];
    const idx = order.indexOf(current);
    let next: Step | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      next = order[Math.min(order.length - 1, idx + 1)];
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      next = order[Math.max(0, idx - 1)];
    } else if (e.key === "Home") {
      next = 1;
    } else if (e.key === "End") {
      next = 3;
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (isReachable(current)) onNavigate(current);
      return;
    }
    if (next) {
      e.preventDefault();
      focusStep(next);
      if (isReachable(next)) onNavigate(next);
    }
  };

  return (
    <div className="mt-4">
      <div className="relative h-1 w-full overflow-hidden rounded-full bg-neutral-200/70">
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-[width] duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background:
              "linear-gradient(90deg, var(--site-primary) 0%, color-mix(in oklab, var(--site-primary) 60%, #000) 100%)",
          }}
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
          aria-label="Booking progress"
        />
      </div>
      <div
        className="mt-2 flex items-center justify-between"
        role="tablist"
        aria-label="Booking steps"
      >
        {steps.map((s) => {
          const isActive = step === s;
          const isDone = step > s;
          const reachable = isReachable(s);
          return (
            <button
              key={s}
              ref={(el) => {
                btnRefs.current[s - 1] = el;
              }}
              type="button"
              role="tab"
              id={`booking-step-tab-${s}`}
              aria-selected={isActive}
              aria-controls={`booking-step-panel-${s}`}
              aria-label={`Step ${s}: ${STEP_LABELS[s]}${isDone ? ", completed" : isActive ? ", current" : reachable ? "" : ", locked"}`}
              tabIndex={isActive ? 0 : -1}
              onKeyDown={(e) => onKeyDown(e, s)}
              disabled={!reachable}
              onClick={() => reachable && onNavigate(s)}
              className={cn(
                "group flex items-center gap-2 rounded-full px-2 py-1 text-[11px] font-medium uppercase tracking-[0.2em] transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--site-primary)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white",
                reachable ? "cursor-pointer hover:opacity-100" : "cursor-not-allowed opacity-50",
                isActive ? "text-neutral-900" : isDone ? "text-neutral-700" : "text-neutral-400",
              )}
            >
              <span
                className={cn(
                  "inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] transition-all duration-300",
                  isActive
                    ? "scale-110 border-transparent text-white shadow"
                    : isDone
                      ? "border-transparent text-white"
                      : "border-neutral-300 bg-white text-neutral-400",
                )}
                style={
                  isActive || isDone
                    ? { backgroundColor: "var(--site-primary)" }
                    : undefined
                }
              >
                {isDone ? <Check className="h-3 w-3" /> : s}
              </span>
              <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function IconBubble({ children }: { children: React.ReactNode }) {
  return (
    <span
      className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-105"
      style={{
        backgroundColor: "color-mix(in oklab, var(--site-primary) 12%, transparent)",
        color: "var(--site-primary)",
      }}
    >
      {children}
    </span>
  );
}

function FieldShell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function RoomImage({ room }: { room: Room }) {
  const [error, setError] = useState(false);
  if (!room.image || error) {
    return (
      <div
        className="flex h-full w-full items-center justify-center"
        style={{
          background:
            "linear-gradient(135deg, color-mix(in oklab, var(--site-primary) 14%, #f5f5f5) 0%, #ffffff 100%)",
          color: "var(--site-primary)",
        }}
      >
        {room.image ? <ImageOff className="h-5 w-5 opacity-60" /> : <BedDouble className="h-6 w-6 opacity-70" />}
      </div>
    );
  }
  return (
    <img
      src={room.image}
      alt={room.name}
      onError={() => setError(true)}
      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
      loading="lazy"
    />
  );
}

function RoomCard({
  room,
  qty,
  max,
  available,
  hasDates,
  onChange,
}: {
  room: Room;
  qty: number;
  max: number;
  available: boolean;
  hasDates: boolean;
  onChange: (n: number) => void;
}) {
  const selected = qty > 0;
  const features = (room.features ?? []).filter(Boolean);
  const featureLine =
    features.length > 0
      ? features.slice(0, 2).join(" · ") + (features.length > 2 ? ` · +${features.length - 2}` : "")
      : (room.description ?? "").slice(0, 70) + ((room.description?.length ?? 0) > 70 ? "…" : "");

  return (
    <div
      className={cn(
        "group relative flex gap-3 rounded-2xl border bg-white/60 p-3 backdrop-blur-xl transition-all duration-300",
        "hover:-translate-y-0.5",
        selected
          ? "border-[color:var(--site-primary)]/70 bg-white/90 shadow-[0_12px_32px_-14px_color-mix(in_oklab,var(--site-primary)_50%,transparent)] ring-1 ring-[color:var(--site-primary)]/20"
          : "border-neutral-200/70 hover:border-neutral-900/30 hover:bg-white/80 hover:shadow-[0_10px_28px_-16px_rgba(0,0,0,0.25)]",
        !available && hasDates && "opacity-70",
      )}
    >
      <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-neutral-100">
        <RoomImage room={room} />
        {!available && hasDates && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 backdrop-blur-[2px]">
            <span className="rounded-full bg-white/90 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-neutral-900">
              Sold out
            </span>
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p
              className="truncate text-[15px] font-medium leading-tight text-neutral-900"
              style={{ fontFamily: SERIF }}
            >
              {room.name}
            </p>
            <p className="mt-0.5 line-clamp-1 text-[11px] text-neutral-500">{featureLine}</p>
            {hasDates && (
              <p
                className={cn(
                  "mt-1 inline-flex items-center gap-1 text-[10px] font-medium",
                  !available
                    ? "text-rose-600"
                    : max <= 2
                      ? "text-amber-600"
                      : "text-emerald-600",
                )}
              >
                {!available ? (
                  <>
                    <AlertCircle className="h-3 w-3" /> Not available for these dates
                  </>
                ) : max <= 2 ? (
                  <>Only {max} left at this price</>
                ) : (
                  <>{max} available</>
                )}
              </p>
            )}
          </div>
          <p
            className="shrink-0 text-sm font-medium tabular-nums"
            style={{ color: "var(--site-primary)" }}
          >
            {room.price}
            <span className="ml-0.5 text-[10px] font-normal text-neutral-400">/night</span>
          </p>
        </div>

        <div className="mt-auto flex items-center justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={() => onChange(qty - 1)}
            disabled={qty <= 0}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-neutral-200 bg-white text-neutral-700 transition-all hover:scale-105 hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            aria-label={`Decrease ${room.name}`}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="w-5 text-center text-sm font-medium tabular-nums text-neutral-900">{qty}</span>
          <button
            type="button"
            onClick={() => onChange(qty + 1)}
            disabled={qty >= max || !available}
            className="inline-flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm transition-all hover:scale-105 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
            style={{ backgroundColor: "var(--site-primary)" }}
            aria-label={`Increase ${room.name}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceSummary({
  lines,
  nights,
  total,
  currency,
}: {
  lines: { room: Room; qty: number; price: ReturnType<typeof parsePrice> }[];
  nights: number;
  total: number;
  currency: string;
}) {
  const hasSelection = lines.length > 0;
  return (
    <div
      className="rounded-2xl border border-neutral-200/70 px-4 py-3 backdrop-blur-md"
      style={{
        background:
          "linear-gradient(180deg, color-mix(in oklab, var(--site-primary) 7%, #ffffff) 0%, #ffffff 100%)",
      }}
    >
      {hasSelection && nights > 0 ? (
        <div className="space-y-1.5">
          {lines.map((l) => (
            <div key={l.room.name} className="flex items-center justify-between text-xs text-neutral-600">
              <span className="truncate">
                {l.qty}× {l.room.name}
                <span className="text-neutral-400"> · {nights}n</span>
              </span>
              <span className="tabular-nums text-neutral-800">
                {l.price?.currency}
                {((l.price?.amount ?? 0) * l.qty * nights).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-neutral-400">
          {nights > 0 ? "Add at least one room" : "Select your dates and rooms"}
        </p>
      )}
      <div className="mt-2 flex items-baseline justify-between border-t border-neutral-100 pt-2">
        <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-400">
          Grand total
        </span>
        <span
          className="text-2xl font-light tracking-tight tabular-nums"
          style={{ fontFamily: SERIF, color: "var(--site-primary)" }}
        >
          {currency}
          {total.toLocaleString()}
        </span>
      </div>
      <p className="mt-1 text-[10px] text-neutral-400">
        Indicative price · Taxes & fees calculated at confirmation
      </p>
    </div>
  );
}

function CounterRow({
  label,
  sub,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  sub: string;
  value: number;
  min: number;
  max: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-900">{label}</p>
        <p className="text-[11px] text-neutral-500">{sub}</p>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Decrease ${label}`}
        >
          <Minus className="h-3.5 w-3.5" />
        </button>
        <span className="w-5 text-center text-sm font-medium tabular-nums">{value}</span>
        <button
          type="button"
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-neutral-200 text-neutral-700 transition hover:border-neutral-900 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-30"
          aria-label={`Increase ${label}`}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
