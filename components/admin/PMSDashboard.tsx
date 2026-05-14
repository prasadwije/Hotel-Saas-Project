"use client";
import { useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Percent,
  LogIn,
  LogOut,
  Search,
  Plus,
  Trash2,
  StickyNote,
  Ban,
  CreditCard,
  Wallet,
  Building2,
  ChevronLeft,
  ChevronRight,
  Pencil,
  RefreshCw,
  AlertTriangle,
} from "lucide-react";
import { format, addDays, differenceInCalendarDays, startOfDay, isWithinInterval } from "date-fns";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

// ============================================================
// Types
// ============================================================
type BookingStatus = "pending" | "confirmed" | "checked-in" | "cancelled";
type ActivityKind = "create" | "status" | "payment" | "checkin" | "cancel" | "note";
type ActivityEntry = { at: string; kind: ActivityKind; text: string };
type Booking = {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  roomTypeId: string;
  unitId: string; // physical room unit
  checkIn: string; // ISO date
  checkOut: string;
  guests: number;
  total: number;
  status: BookingStatus;
  paid: boolean;
  source: "Direct" | "Booking.com" | "Airbnb" | "Walk-in";
  notes: string[];
  activity?: ActivityEntry[];
};

type RoomType = {
  id: string;
  name: string;
  quantity: number;
  baseRate: number;
  weekendRate: number;
  units: string[]; // physical unit names
};

type RateRule = {
  id: string;
  label: string;
  from: string;
  to: string;
  mode: "percent" | "override";
  value: number;
};

type FeeRule = {
  id: string;
  label: string;
  mode: "fixed" | "percent";
  value: number;
  enabled: boolean;
};

type RoomBlock = {
  id: string;
  unitId: string;
  from: string;
  to: string;
  reason: string;
};

// ============================================================
// Mock Seed Data
// ============================================================
const today = startOfDay(new Date());
const iso = (d: Date) => d.toISOString().slice(0, 10);

const SEED_ROOM_TYPES: RoomType[] = [
  {
    id: "rt1",
    name: "Sea View Suite",
    quantity: 4,
    baseRate: 280,
    weekendRate: 340,
    units: ["Sea View 101", "Sea View 102", "Sea View 103", "Sea View 104"],
  },
  {
    id: "rt2",
    name: "Garden Room",
    quantity: 3,
    baseRate: 180,
    weekendRate: 220,
    units: ["Garden 201", "Garden 202", "Garden 203"],
  },
  {
    id: "rt3",
    name: "Deluxe Penthouse",
    quantity: 2,
    baseRate: 620,
    weekendRate: 750,
    units: ["Penthouse A", "Penthouse B"],
  },
];

const SEED_BOOKINGS: Booking[] = [
  {
    id: "BK-1042",
    guestName: "Anna Rossi",
    guestEmail: "anna@example.com",
    guestPhone: "+1 555 2210",
    roomTypeId: "rt1",
    unitId: "Sea View 101",
    checkIn: iso(today),
    checkOut: iso(addDays(today, 3)),
    guests: 2,
    total: 980,
    status: "checked-in",
    paid: true,
    source: "Direct",
    notes: ["Late check-in requested (after 9pm)."],
  },
  {
    id: "BK-1043",
    guestName: "Marcus Lee",
    guestEmail: "marcus@example.com",
    guestPhone: "+44 7700 900123",
    roomTypeId: "rt2",
    unitId: "Garden 202",
    checkIn: iso(today),
    checkOut: iso(addDays(today, 2)),
    guests: 1,
    total: 360,
    status: "confirmed",
    paid: true,
    source: "Booking.com",
    notes: [],
  },
  {
    id: "BK-1044",
    guestName: "Sophie Bernard",
    guestEmail: "sophie@example.com",
    guestPhone: "+33 6 12 34 56 78",
    roomTypeId: "rt3",
    unitId: "Penthouse A",
    checkIn: iso(addDays(today, 1)),
    checkOut: iso(addDays(today, 5)),
    guests: 2,
    total: 2480,
    status: "confirmed",
    paid: false,
    source: "Direct",
    notes: ["Anniversary — arrange champagne in room."],
  },
  {
    id: "BK-1045",
    guestName: "Hiro Tanaka",
    guestEmail: "hiro@example.com",
    guestPhone: "+81 90 1234 5678",
    roomTypeId: "rt1",
    unitId: "Sea View 103",
    checkIn: iso(addDays(today, 4)),
    checkOut: iso(addDays(today, 7)),
    guests: 2,
    total: 840,
    status: "pending",
    paid: false,
    source: "Airbnb",
    notes: [],
  },
  {
    id: "BK-1046",
    guestName: "Elena García",
    guestEmail: "elena@example.com",
    guestPhone: "+34 600 123 456",
    roomTypeId: "rt2",
    unitId: "Garden 201",
    checkIn: iso(addDays(today, -2)),
    checkOut: iso(today),
    guests: 3,
    total: 540,
    status: "checked-in",
    paid: true,
    source: "Direct",
    notes: [],
  },
  {
    id: "BK-1047",
    guestName: "Daniel Cohen",
    guestEmail: "daniel@example.com",
    guestPhone: "+972 50 123 4567",
    roomTypeId: "rt3",
    unitId: "Penthouse B",
    checkIn: iso(addDays(today, 6)),
    checkOut: iso(addDays(today, 9)),
    guests: 2,
    total: 1860,
    status: "pending",
    paid: false,
    source: "Direct",
    notes: [],
  },
  {
    id: "BK-1048",
    guestName: "Priya Patel",
    guestEmail: "priya@example.com",
    guestPhone: "+91 98765 43210",
    roomTypeId: "rt1",
    unitId: "Sea View 102",
    checkIn: iso(addDays(today, 2)),
    checkOut: iso(addDays(today, 4)),
    guests: 2,
    total: 560,
    status: "cancelled",
    paid: false,
    source: "Booking.com",
    notes: ["Guest cancelled — refund issued."],
  },
];

const SEED_RATE_RULES: RateRule[] = [
  { id: "rr1", label: "High Season — Holidays", from: iso(addDays(today, 30)), to: iso(addDays(today, 45)), mode: "percent", value: 25 },
  { id: "rr2", label: "New Year Peak", from: iso(addDays(today, 60)), to: iso(addDays(today, 70)), mode: "override", value: 480 },
];

const SEED_FEES: FeeRule[] = [
  { id: "f1", label: "City Tax", mode: "percent", value: 10, enabled: true },
  { id: "f2", label: "Cleaning Fee", mode: "fixed", value: 20, enabled: true },
  { id: "f3", label: "Resort Fee", mode: "fixed", value: 15, enabled: false },
];

// ============================================================
// Helpers
// ============================================================
const STATUS_STYLES: Record<BookingStatus, string> = {
  pending: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  confirmed: "bg-blue-100 text-blue-800 hover:bg-blue-100",
  "checked-in": "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  cancelled: "bg-rose-100 text-rose-700 hover:bg-rose-100",
};

const STATUS_PILL: Record<BookingStatus, string> = {
  pending: "bg-amber-400",
  confirmed: "bg-blue-500",
  "checked-in": "bg-emerald-500",
  cancelled: "bg-rose-400",
};

function uid(prefix = "id") {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

// Compute a booking total from room base/weekend rates + matching rate rules.
function computeBookingTotal(
  b: Pick<Booking, "checkIn" | "checkOut">,
  rt: RoomType | undefined,
  rules: RateRule[],
) {
  if (!rt) return 0;
  const ci = new Date(b.checkIn);
  const co = new Date(b.checkOut);
  const nights = Math.max(0, differenceInCalendarDays(co, ci));
  let total = 0;
  for (let i = 0; i < nights; i++) {
    const day = addDays(ci, i);
    const isWknd = day.getDay() === 0 || day.getDay() === 6;
    let nightly = isWknd ? rt.weekendRate : rt.baseRate;
    for (const r of rules) {
      const f = new Date(r.from);
      const t = new Date(r.to);
      if (day >= f && day <= t) {
        nightly = r.mode === "override" ? r.value : Math.round(nightly * (1 + r.value / 100));
      }
    }
    total += nightly;
  }
  return total;
}

// Detect whether two date ranges overlap (treating bookings as [ci, co) and blocks as [from, to]).
function rangesOverlap(aStart: Date, aEndInclusive: Date, bStart: Date, bEndInclusive: Date) {
  return aStart <= bEndInclusive && bStart <= aEndInclusive;
}

// Append an activity entry (timestamped) to a booking.
function appendActivity(b: Booking, kind: ActivityKind, text: string): Booking {
  const entry: ActivityEntry = { at: new Date().toISOString(), kind, text };
  return { ...b, activity: [...(b.activity ?? []), entry] };
}

// Per-night breakdown: weekday/weekend rate + which rate rules applied.
type NightBreakdown = {
  date: Date;
  isWeekend: boolean;
  baseNightly: number;
  finalNightly: number;
  appliedRules: RateRule[];
};
function nightlyBreakdown(
  b: Pick<Booking, "checkIn" | "checkOut">,
  rt: RoomType | undefined,
  rules: RateRule[],
): NightBreakdown[] {
  if (!rt) return [];
  const ci = new Date(b.checkIn);
  const co = new Date(b.checkOut);
  const nights = Math.max(0, differenceInCalendarDays(co, ci));
  const out: NightBreakdown[] = [];
  for (let i = 0; i < nights; i++) {
    const day = addDays(ci, i);
    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
    const baseNightly = isWeekend ? rt.weekendRate : rt.baseRate;
    let finalNightly = baseNightly;
    const appliedRules: RateRule[] = [];
    for (const r of rules) {
      const f = new Date(r.from);
      const t = new Date(r.to);
      if (day >= f && day <= t) {
        appliedRules.push(r);
        finalNightly =
          r.mode === "override" ? r.value : Math.round(finalNightly * (1 + r.value / 100));
      }
    }
    out.push({ date: day, isWeekend, baseNightly, finalNightly, appliedRules });
  }
  return out;
}

// ============================================================
// Main PMS
// ============================================================
export function PMSDashboard() {
  const [roomTypes, setRoomTypes] = useState<RoomType[]>(SEED_ROOM_TYPES);
  const [bookings, setBookings] = useState<Booking[]>(SEED_BOOKINGS);
  const [blocks, setBlocks] = useState<RoomBlock[]>([]);
  const [rateRules, setRateRules] = useState<RateRule[]>(SEED_RATE_RULES);
  const [fees, setFees] = useState<FeeRule[]>(SEED_FEES);
  const [policies, setPolicies] = useState({
    cancellation:
      "Free cancellation up to 48 hours before arrival. After that, the first night is non-refundable.",
    house:
      "Check-in from 3pm. Check-out by 11am. No smoking inside the property. Quiet hours 10pm–8am.",
  });
  const [payments, setPayments] = useState({ stripe: true, bank: true, hotel: false });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Property Management</h1>
        <p className="text-sm text-neutral-500">
          Run reservations, inventory, pricing and policies from one cockpit.
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="w-full">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 sm:w-auto">
          <TabsTrigger value="dashboard">Dashboard & CRM</TabsTrigger>
          <TabsTrigger value="calendar">Master Calendar</TabsTrigger>
          <TabsTrigger value="rates">Rates & Inventory</TabsTrigger>
          <TabsTrigger value="settings">Settings & Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <DashboardTab
            bookings={bookings}
            roomTypes={roomTypes}
            rateRules={rateRules}
            onUpdateBooking={(b) =>
              setBookings((prev) => prev.map((x) => (x.id === b.id ? b : x)))
            }
          />
        </TabsContent>

        <TabsContent value="calendar" className="mt-6">
          <CalendarTab
            bookings={bookings}
            roomTypes={roomTypes}
            blocks={blocks}
            rateRules={rateRules}
            onAddBlock={(b) => setBlocks((prev) => [...prev, b])}
            onRemoveBlock={(id) => setBlocks((prev) => prev.filter((b) => b.id !== id))}
            onAddBooking={(b) => setBookings((prev) => [b, ...prev])}
          />
        </TabsContent>

        <TabsContent value="rates" className="mt-6">
          <RatesTab
            roomTypes={roomTypes}
            setRoomTypes={setRoomTypes}
            rateRules={rateRules}
            setRateRules={setRateRules}
            bookings={bookings}
            setBookings={setBookings}
          />
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <SettingsTab
            fees={fees}
            setFees={setFees}
            policies={policies}
            setPolicies={setPolicies}
            payments={payments}
            setPayments={setPayments}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

// ============================================================
// 1. Dashboard & CRM
// ============================================================
function DashboardTab({
  bookings,
  roomTypes,
  rateRules,
  onUpdateBooking,
}: {
  bookings: Booking[];
  roomTypes: RoomType[];
  rateRules: RateRule[];
  onUpdateBooking: (b: Booking) => void;
}) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "all">("all");
  const [roomTypeFilter, setRoomTypeFilter] = useState<string>("all");
  const [unitFilter, setUnitFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [selected, setSelected] = useState<Booking | null>(null);

  const todayStr = iso(today);
  const totalUnits = roomTypes.reduce((sum, r) => sum + r.quantity, 0);

  const checkInsToday = bookings.filter((b) => b.checkIn === todayStr && b.status !== "cancelled").length;
  const checkOutsToday = bookings.filter((b) => b.checkOut === todayStr && b.status !== "cancelled").length;
  const occupiedToday = bookings.filter(
    (b) =>
      b.status !== "cancelled" &&
      isWithinInterval(today, { start: new Date(b.checkIn), end: addDays(new Date(b.checkOut), -1) }),
  ).length;
  const occupancy = totalUnits ? Math.round((occupiedToday / totalUnits) * 100) : 0;
  const monthlyRevenue = bookings
    .filter((b) => b.status !== "cancelled" && new Date(b.checkIn).getMonth() === today.getMonth())
    .reduce((sum, b) => sum + b.total, 0);

  // Reset unit filter when room type changes.
  useEffect(() => {
    setUnitFilter("all");
  }, [roomTypeFilter]);

  const unitOptions = useMemo(() => {
    if (roomTypeFilter === "all") return roomTypes.flatMap((rt) => rt.units);
    return roomTypes.find((rt) => rt.id === roomTypeFilter)?.units ?? [];
  }, [roomTypes, roomTypeFilter]);

  const filtered = bookings.filter((b) => {
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      b.guestName.toLowerCase().includes(q) ||
      b.id.toLowerCase().includes(q) ||
      b.guestEmail.toLowerCase().includes(q);
    const matchStatus = statusFilter === "all" || b.status === statusFilter;
    const matchType = roomTypeFilter === "all" || b.roomTypeId === roomTypeFilter;
    const matchUnit = unitFilter === "all" || b.unitId === unitFilter;
    let matchDate = true;
    if (dateRange.from && dateRange.to) {
      const ci = new Date(b.checkIn);
      const co = addDays(new Date(b.checkOut), -1);
      matchDate = rangesOverlap(
        startOfDay(dateRange.from),
        startOfDay(dateRange.to),
        ci,
        co,
      );
    }
    return matchSearch && matchStatus && matchType && matchUnit && matchDate;
  });

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setRoomTypeFilter("all");
    setUnitFilter("all");
    setDateRange({});
  };
  const hasFilters =
    !!search ||
    statusFilter !== "all" ||
    roomTypeFilter !== "all" ||
    unitFilter !== "all" ||
    !!(dateRange.from && dateRange.to);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={<LogIn className="h-4 w-4" />}
          label="Check-ins today"
          value={checkInsToday.toString()}
          accent="text-emerald-600"
        />
        <StatCard
          icon={<LogOut className="h-4 w-4" />}
          label="Check-outs today"
          value={checkOutsToday.toString()}
          accent="text-blue-600"
        />
        <StatCard
          icon={<Percent className="h-4 w-4" />}
          label="Occupancy"
          value={`${occupancy}%`}
          sub={`${occupiedToday}/${totalUnits} units`}
          accent="text-violet-600"
        />
        <StatCard
          icon={<CircleDollarSign className="h-4 w-4" />}
          label="Monthly revenue"
          value={`$${monthlyRevenue.toLocaleString()}`}
          accent="text-amber-600"
        />
      </div>

      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="space-y-4">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-base">Reservations</CardTitle>
              <CardDescription>
                {filtered.length} of {bookings.length} bookings
              </CardDescription>
            </div>
            {hasFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="self-start sm:self-auto">
                Clear filters
              </Button>
            )}
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
              <Input
                placeholder="Search guest, ID, email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="checked-in">Checked-In</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={roomTypeFilter} onValueChange={setRoomTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Room type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All room types</SelectItem>
                {roomTypes.map((rt) => (
                  <SelectItem key={rt.id} value={rt.id}>
                    {rt.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={unitFilter} onValueChange={setUnitFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All units</SelectItem>
                {unitOptions.map((u) => (
                  <SelectItem key={u} value={u}>
                    {u}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {dateRange.from && dateRange.to
                    ? `${format(dateRange.from, "MMM d")} → ${format(dateRange.to, "MMM d")}`
                    : "Filter by date range"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange as any}
                  onSelect={(r: any) => setDateRange(r ?? {})}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
            {dateRange.from && dateRange.to && (
              <Button variant="ghost" size="sm" onClick={() => setDateRange({})}>
                Clear dates
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Guest</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Room</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((b) => {
                const rt = roomTypes.find((r) => r.id === b.roomTypeId);
                return (
                  <TableRow
                    key={b.id}
                    onClick={() => setSelected(b)}
                    className="cursor-pointer"
                  >
                    <TableCell className="font-mono text-xs">{b.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{b.guestName}</p>
                        <p className="text-xs text-neutral-500">{b.guestEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{format(new Date(b.checkIn), "MMM d")} → {format(new Date(b.checkOut), "MMM d")}</div>
                      <div className="text-xs text-neutral-500">
                        {differenceInCalendarDays(new Date(b.checkOut), new Date(b.checkIn))} nights · {b.guests} guests
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div>{rt?.name ?? "—"}</div>
                      <div className="text-xs text-neutral-500">{b.unitId}</div>
                    </TableCell>
                    <TableCell className="font-medium">${b.total.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={cn("capitalize", STATUS_STYLES[b.status])}>
                        {b.status.replace("-", " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-10 text-center text-sm text-neutral-500">
                    No bookings match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <BookingDetailsSheet
        booking={selected}
        roomTypes={roomTypes}
        rateRules={rateRules}
        onClose={() => setSelected(null)}
        onUpdate={(b) => {
          onUpdateBooking(b);
          setSelected(b);
        }}
      />
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <p className="text-xs uppercase tracking-wider text-neutral-500">{label}</p>
          <span className={cn("rounded-md bg-neutral-100 p-1.5", accent)}>{icon}</span>
        </div>
        <p className="mt-3 text-2xl font-semibold tracking-tight">{value}</p>
        {sub && <p className="text-xs text-neutral-500 mt-1">{sub}</p>}
      </CardContent>
    </Card>
  );
}

function BookingDetailsSheet({
  booking,
  roomTypes,
  rateRules,
  onClose,
  onUpdate,
}: {
  booking: Booking | null;
  roomTypes: RoomType[];
  rateRules: RateRule[];
  onClose: () => void;
  onUpdate: (b: Booking) => void;
}) {
  const [note, setNote] = useState("");
  if (!booking) return null;
  const rt = roomTypes.find((r) => r.id === booking.roomTypeId);
  const nights = differenceInCalendarDays(new Date(booking.checkOut), new Date(booking.checkIn));
  const breakdown = nightlyBreakdown(booking, rt, rateRules);
  const computedSubtotal = breakdown.reduce((s, n) => s + n.finalNightly, 0);
  const activity = booking.activity ?? [];

  // Apply an action and append a matching activity entry.
  const applyAction = (patch: Partial<Booking>, kind: ActivityKind, text: string) => {
    onUpdate(appendActivity({ ...booking, ...patch }, kind, text));
  };

  return (
    <Sheet open={!!booking} onOpenChange={(o) => !o && onClose()}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle>{booking.guestName}</SheetTitle>
            <Badge className={cn("capitalize", STATUS_STYLES[booking.status])}>
              {booking.status.replace("-", " ")}
            </Badge>
          </div>
          <SheetDescription className="font-mono text-xs">{booking.id} · via {booking.source}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <section>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Guest</h4>
            <div className="rounded-lg border border-neutral-200 p-3 text-sm space-y-1">
              <p>{booking.guestEmail}</p>
              <p className="text-neutral-600">{booking.guestPhone}</p>
            </div>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Stay</h4>
            <div className="rounded-lg border border-neutral-200 p-3 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-neutral-500">Room type</span>
                <span className="font-medium">{rt?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Unit</span>
                <span className="font-medium">{booking.unitId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Check-in</span>
                <span className="font-medium">{format(new Date(booking.checkIn), "EEE, MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Check-out</span>
                <span className="font-medium">{format(new Date(booking.checkOut), "EEE, MMM d, yyyy")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500">Guests</span>
                <span className="font-medium">{booking.guests}</span>
              </div>
            </div>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Price breakdown</h4>
            <div className="rounded-lg border border-neutral-200 p-3 text-sm space-y-2">
              {breakdown.length === 0 ? (
                <p className="text-xs text-neutral-500">No nights to break down.</p>
              ) : (
                <ul className="space-y-1.5">
                  {breakdown.map((n, i) => (
                    <li key={i} className="flex items-start justify-between gap-3 text-xs">
                      <div className="min-w-0">
                        <p className="font-medium text-neutral-700">
                          {format(n.date, "EEE, MMM d")}{" "}
                          <span
                            className={cn(
                              "ml-1 rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wider",
                              n.isWeekend
                                ? "bg-amber-100 text-amber-800"
                                : "bg-neutral-100 text-neutral-600",
                            )}
                          >
                            {n.isWeekend ? "Weekend" : "Weekday"}
                          </span>
                        </p>
                        {n.appliedRules.length > 0 && (
                          <p className="text-[11px] text-violet-700">
                            +{" "}
                            {n.appliedRules
                              .map((r) =>
                                `${r.label} (${r.mode === "percent" ? `+${r.value}%` : `$${r.value}`})`,
                              )
                              .join(", ")}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 text-right">
                        {n.finalNightly !== n.baseNightly && (
                          <span className="mr-1 text-[11px] text-neutral-400 line-through">
                            ${n.baseNightly}
                          </span>
                        )}
                        <span className="font-medium tabular-nums">${n.finalNightly}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <Separator />
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Recalculated subtotal ({nights} nights)</span>
                <span className="tabular-nums">${computedSubtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span>Booking total</span>
                <span>${booking.total.toLocaleString()}</span>
              </div>
              {computedSubtotal !== booking.total && computedSubtotal > 0 && (
                <p className="text-[11px] text-amber-700">
                  Stored total differs from current rate calculation. Use “Recalculate totals” in Rates &
                  Inventory to sync.
                </p>
              )}
              <div className="flex justify-between text-xs text-neutral-500">
                <span>Payment</span>
                <span>{booking.paid ? "Paid" : "Unpaid"}</span>
              </div>
            </div>
          </section>

          {booking.notes.length > 0 && (
            <section>
              <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Internal notes</h4>
              <ul className="space-y-2">
                {booking.notes.map((n, i) => (
                  <li key={i} className="rounded-md bg-amber-50 border border-amber-200 p-2 text-xs text-amber-900 flex gap-2">
                    <StickyNote className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span>{n}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          <section>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Add note</h4>
            <div className="flex gap-2">
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Internal note for staff…"
                className="min-h-[60px]"
              />
              <Button
                size="sm"
                onClick={() => {
                  if (!note.trim()) return;
                  const trimmed = note.trim();
                  onUpdate(
                    appendActivity(
                      { ...booking, notes: [...booking.notes, trimmed] },
                      "note",
                      `Note added: "${trimmed}"`,
                    ),
                  );
                  setNote("");
                }}
              >
                Add
              </Button>
            </div>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Activity log</h4>
            {activity.length === 0 ? (
              <p className="rounded-lg border border-dashed border-neutral-200 p-3 text-xs text-neutral-500">
                No activity yet — actions on this booking will appear here.
              </p>
            ) : (
              <ol className="space-y-2">
                {[...activity].reverse().map((a, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-lg border border-neutral-200 bg-white p-2.5 text-xs"
                  >
                    <ActivityIcon kind={a.kind} />
                    <div className="min-w-0 flex-1">
                      <p className="text-neutral-700">{a.text}</p>
                      <p className="text-[11px] text-neutral-400">
                        {format(new Date(a.at), "MMM d, yyyy 'at' h:mm a")}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </section>

          <Separator />

          <section className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              disabled={booking.status === "confirmed" || booking.status === "checked-in"}
              onClick={() => applyAction({ status: "confirmed" }, "status", "Booking confirmed")}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" /> Confirm
            </Button>
            <Button
              variant="outline"
              disabled={booking.paid}
              onClick={() =>
                applyAction({ paid: true }, "payment", `Marked as paid ($${booking.total.toLocaleString()})`)
              }
            >
              <Wallet className="h-4 w-4 mr-1" /> Mark paid
            </Button>
            <Button
              variant="outline"
              disabled={booking.status === "checked-in"}
              onClick={() => applyAction({ status: "checked-in" }, "checkin", "Guest checked in")}
            >
              <LogIn className="h-4 w-4 mr-1" /> Check-in
            </Button>
            <Button
              variant="outline"
              className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
              disabled={booking.status === "cancelled"}
              onClick={() => applyAction({ status: "cancelled" }, "cancel", "Booking cancelled")}
            >
              <Ban className="h-4 w-4 mr-1" /> Cancel
            </Button>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function ActivityIcon({ kind }: { kind: ActivityKind }) {
  const map: Record<ActivityKind, { icon: React.ReactNode; bg: string }> = {
    create: { icon: <Plus className="h-3.5 w-3.5" />, bg: "bg-neutral-100 text-neutral-600" },
    status: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, bg: "bg-blue-100 text-blue-700" },
    payment: { icon: <Wallet className="h-3.5 w-3.5" />, bg: "bg-emerald-100 text-emerald-700" },
    checkin: { icon: <LogIn className="h-3.5 w-3.5" />, bg: "bg-violet-100 text-violet-700" },
    cancel: { icon: <Ban className="h-3.5 w-3.5" />, bg: "bg-rose-100 text-rose-700" },
    note: { icon: <StickyNote className="h-3.5 w-3.5" />, bg: "bg-amber-100 text-amber-800" },
  };
  const m = map[kind];
  return (
    <span className={cn("mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full", m.bg)}>
      {m.icon}
    </span>
  );
}

// ============================================================
// 2. Master Calendar (Tape Chart)
// ============================================================
function CalendarTab({
  bookings,
  roomTypes,
  blocks,
  rateRules,
  onAddBlock,
  onRemoveBlock,
  onAddBooking,
}: {
  bookings: Booking[];
  roomTypes: RoomType[];
  blocks: RoomBlock[];
  rateRules: RateRule[];
  onAddBlock: (b: RoomBlock) => void;
  onRemoveBlock: (id: string) => void;
  onAddBooking: (b: Booking) => void;
}) {
  const [anchor, setAnchor] = useState<Date>(today);
  const DAYS = 30;
  const dates = useMemo(() => Array.from({ length: DAYS }, (_, i) => addDays(anchor, i)), [anchor]);

  const COL = 44; // px per day
  const LABEL = 200;

  // Click-to-start / click-to-end selection on the tape chart.
  const [selection, setSelection] = useState<{
    unit: string;
    typeId: string;
    anchorIdx: number;
    hoverIdx: number;
  } | null>(null);
  const [pending, setPending] = useState<{
    unit: string;
    typeId: string;
    fromIdx: number;
    toIdx: number;
  } | null>(null);

  // Esc cancels in-progress selection.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelection(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleCellClick = (unit: string, typeId: string, idx: number) => {
    if (!selection || selection.unit !== unit) {
      setSelection({ unit, typeId, anchorIdx: idx, hoverIdx: idx });
      return;
    }
    const fromIdx = Math.min(selection.anchorIdx, idx);
    const toIdx = Math.max(selection.anchorIdx, idx);
    setSelection(null);
    setPending({ unit, typeId, fromIdx, toIdx });
  };
  const handleCellHover = (unit: string, idx: number) => {
    setSelection((s) => (s && s.unit === unit ? { ...s, hoverIdx: idx } : s));
  };

  return (
    <Card className="border-neutral-200 shadow-sm">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base">Tape chart — 30 day view</CardTitle>
          <CardDescription>
            {format(anchor, "MMM d, yyyy")} → {format(addDays(anchor, DAYS - 1), "MMM d, yyyy")}
            <span className="ml-2 text-neutral-400">
              · Click a date cell, then a second cell to create a booking or block.
            </span>
          </CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={() => setAnchor(addDays(anchor, -7))}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={() => setAnchor(today)}>Today</Button>
          <Button variant="outline" size="icon" onClick={() => setAnchor(addDays(anchor, 7))}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <BlockDatesDialog
            roomTypes={roomTypes}
            bookings={bookings}
            blocks={blocks}
            onAdd={onAddBlock}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <div className="min-w-fit">
            {/* Header dates */}
            <div className="flex border-b border-neutral-200 bg-neutral-50 sticky top-0">
              <div style={{ width: LABEL }} className="shrink-0 border-r border-neutral-200 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Room
              </div>
              {dates.map((d, i) => {
                const isToday = iso(d) === iso(today);
                const isWknd = d.getDay() === 0 || d.getDay() === 6;
                return (
                  <div
                    key={i}
                    style={{ width: COL }}
                    className={cn(
                      "shrink-0 border-r border-neutral-100 py-1 text-center",
                      isWknd && "bg-amber-50/40",
                      isToday && "bg-blue-50",
                    )}
                  >
                    <div className="text-[10px] uppercase text-neutral-500">{format(d, "EEE")}</div>
                    <div className={cn("text-sm font-medium", isToday && "text-blue-600")}>{format(d, "d")}</div>
                  </div>
                );
              })}
            </div>

            {/* Rows */}
            {roomTypes.map((rt) => (
              <div key={rt.id}>
                <div className="flex items-center bg-neutral-50/60 border-b border-neutral-200">
                  <div style={{ width: LABEL }} className="px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-neutral-600 border-r border-neutral-200">
                    {rt.name}
                  </div>
                  <div className="flex-1 text-[11px] text-neutral-400 px-3">{rt.quantity} units</div>
                </div>
                {rt.units.map((unit) => (
                  <UnitRow
                    key={unit}
                    unit={unit}
                    dates={dates}
                    bookings={bookings.filter((b) => b.unitId === unit && b.status !== "cancelled")}
                    blocks={blocks.filter((b) => b.unitId === unit)}
                    col={COL}
                    label={LABEL}
                    onRemoveBlock={onRemoveBlock}
                    selection={selection && selection.unit === unit ? selection : null}
                    onCellClick={(idx) => handleCellClick(unit, rt.id, idx)}
                    onCellHover={(idx) => handleCellHover(unit, idx)}
                  />
                ))}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CreateOnSelectionDialog
        pending={pending}
        dates={dates}
        roomTypes={roomTypes}
        bookings={bookings}
        blocks={blocks}
        rateRules={rateRules}
        onClose={() => setPending(null)}
        onCreateBooking={(b) => {
          onAddBooking(b);
          setPending(null);
        }}
        onCreateBlock={(b) => {
          onAddBlock(b);
          setPending(null);
        }}
      />
    </Card>
  );
}

function UnitRow({
  unit,
  dates,
  bookings,
  blocks,
  col,
  label,
  onRemoveBlock,
  selection,
  onCellClick,
  onCellHover,
}: {
  unit: string;
  dates: Date[];
  bookings: Booking[];
  blocks: RoomBlock[];
  col: number;
  label: number;
  onRemoveBlock: (id: string) => void;
  selection: { anchorIdx: number; hoverIdx: number } | null;
  onCellClick: (idx: number) => void;
  onCellHover: (idx: number) => void;
}) {
  const start = dates[0];
  const end = dates[dates.length - 1];
  const selFrom = selection ? Math.min(selection.anchorIdx, selection.hoverIdx) : -1;
  const selTo = selection ? Math.max(selection.anchorIdx, selection.hoverIdx) : -1;

  return (
    <div className="flex border-b border-neutral-100 relative h-12">
      <div style={{ width: label }} className="shrink-0 border-r border-neutral-200 px-3 py-2 text-sm">
        {unit}
      </div>
      <div className="relative flex" style={{ height: 48 }}>
        {dates.map((d, i) => {
          const isWknd = d.getDay() === 0 || d.getDay() === 6;
          const inSel = !!selection && i >= selFrom && i <= selTo;
          return (
            <button
              type="button"
              key={i}
              style={{ width: col }}
              className={cn(
                "shrink-0 border-r border-neutral-100 transition-colors hover:bg-blue-50/60 focus:outline-none",
                isWknd && "bg-amber-50/30",
                inSel && "bg-blue-100/70 ring-1 ring-inset ring-blue-300",
              )}
              onClick={() => onCellClick(i)}
              onMouseEnter={() => onCellHover(i)}
              aria-label={`Select ${format(d, "MMM d")}`}
            />
          );
        })}
        {bookings.map((b) => {
          const ci = new Date(b.checkIn);
          const co = new Date(b.checkOut);
          if (co <= start || ci >= addDays(end, 1)) return null;
          const offset = Math.max(0, differenceInCalendarDays(ci, start));
          const span = Math.min(
            differenceInCalendarDays(co, ci),
            differenceInCalendarDays(addDays(end, 1), addDays(start, offset)),
          );
          if (span <= 0) return null;
          return (
            <div
              key={b.id}
              className={cn(
                "absolute top-1.5 bottom-1.5 rounded-md text-white text-xs font-medium px-2 py-1 shadow-sm overflow-hidden flex items-center gap-1.5 cursor-pointer transition hover:brightness-110",
                STATUS_PILL[b.status],
              )}
              style={{ left: offset * col + 2, width: span * col - 4 }}
              title={`${b.guestName} · ${b.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="truncate">{b.guestName}</span>
            </div>
          );
        })}
        {blocks.map((blk) => {
          const ci = new Date(blk.from);
          const co = new Date(blk.to);
          if (co <= start || ci >= addDays(end, 1)) return null;
          const offset = Math.max(0, differenceInCalendarDays(ci, start));
          const span = Math.min(
            differenceInCalendarDays(co, ci) + 1,
            differenceInCalendarDays(addDays(end, 1), addDays(start, offset)),
          );
          if (span <= 0) return null;
          return (
            <div
              key={blk.id}
              onClick={() => onRemoveBlock(blk.id)}
              className="absolute top-1.5 bottom-1.5 rounded-md bg-neutral-700 text-white text-xs font-medium px-2 py-1 shadow-sm overflow-hidden flex items-center gap-1.5 cursor-pointer hover:bg-neutral-800"
              style={{
                left: offset * col + 2,
                width: span * col - 4,
                backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.12) 0 6px, transparent 6px 12px)",
              }}
              title={`Blocked: ${blk.reason} (click to remove)`}
            >
              <Ban className="h-3 w-3" />
              <span className="truncate">{blk.reason}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BlockDatesDialog({
  roomTypes,
  bookings,
  blocks,
  onAdd,
}: {
  roomTypes: RoomType[];
  bookings: Booking[];
  blocks: RoomBlock[];
  onAdd: (b: RoomBlock) => void;
}) {
  const [open, setOpen] = useState(false);
  const [unit, setUnit] = useState<string>(roomTypes[0]?.units[0] ?? "");
  const [reason, setReason] = useState("Maintenance");
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});

  const conflict = useMemo(() => {
    if (!unit || !range.from || !range.to) return null;
    const f = startOfDay(range.from);
    const t = startOfDay(range.to);
    const bConflict = bookings.find(
      (b) =>
        b.unitId === unit &&
        b.status !== "cancelled" &&
        rangesOverlap(f, t, new Date(b.checkIn), addDays(new Date(b.checkOut), -1)),
    );
    if (bConflict) {
      return `Overlaps booking ${bConflict.id} (${bConflict.guestName}, ${format(new Date(bConflict.checkIn), "MMM d")} → ${format(new Date(bConflict.checkOut), "MMM d")}).`;
    }
    const blkConflict = blocks.find(
      (b) => b.unitId === unit && rangesOverlap(f, t, new Date(b.from), new Date(b.to)),
    );
    if (blkConflict) {
      return `Overlaps existing block (${blkConflict.reason}).`;
    }
    return null;
  }, [unit, range, bookings, blocks]);

  const submit = () => {
    if (!unit || !range.from || !range.to || conflict) return;
    onAdd({
      id: uid("blk"),
      unitId: unit,
      from: iso(range.from),
      to: iso(range.to),
      reason: reason || "Blocked",
    });
    setOpen(false);
    setRange({});
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-1"><Ban className="h-4 w-4" /> Block dates</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Block dates</DialogTitle>
          <DialogDescription>Make a unit unavailable for maintenance or walk-ins.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {roomTypes.flatMap((rt) =>
                  rt.units.map((u) => (
                    <SelectItem key={u} value={u}>{rt.name} — {u}</SelectItem>
                  )),
                )}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Reason</Label>
            <Input value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div>
            <Label>Date range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {range.from && range.to
                    ? `${format(range.from, "MMM d")} → ${format(range.to, "MMM d")}`
                    : "Pick dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={range as any}
                  onSelect={(r: any) => setRange(r ?? {})}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          {conflict && (
            <div className="flex gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{conflict}</span>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!range.from || !range.to || !!conflict}>
            Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Inline create-on-selection dialog (booking or block) launched after the
// user click-selects a date range directly on the tape chart.
function CreateOnSelectionDialog({
  pending,
  dates,
  roomTypes,
  bookings,
  blocks,
  rateRules,
  onClose,
  onCreateBooking,
  onCreateBlock,
}: {
  pending: { unit: string; typeId: string; fromIdx: number; toIdx: number } | null;
  dates: Date[];
  roomTypes: RoomType[];
  bookings: Booking[];
  blocks: RoomBlock[];
  rateRules: RateRule[];
  onClose: () => void;
  onCreateBooking: (b: Booking) => void;
  onCreateBlock: (b: RoomBlock) => void;
}) {
  const [tab, setTab] = useState<"booking" | "block">("booking");
  const [guestName, setGuestName] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guests, setGuests] = useState(2);
  const [source, setSource] = useState<Booking["source"]>("Direct");
  const [reason, setReason] = useState("Maintenance");

  useEffect(() => {
    if (pending) {
      setTab("booking");
      setGuestName("");
      setGuestEmail("");
      setGuestPhone("");
      setGuests(2);
      setSource("Direct");
      setReason("Maintenance");
    }
  }, [pending]);

  if (!pending) return null;

  const checkInDate = dates[pending.fromIdx];
  // Treat the second click as the inclusive last NIGHT, so checkout is the day after.
  const checkOutDate = addDays(dates[pending.toIdx], 1);
  const nights = differenceInCalendarDays(checkOutDate, checkInDate);
  const rt = roomTypes.find((r) => r.id === pending.typeId);
  const total = computeBookingTotal(
    { checkIn: iso(checkInDate), checkOut: iso(checkOutDate) },
    rt,
    rateRules,
  );

  const conflictBooking = bookings.find(
    (b) =>
      b.unitId === pending.unit &&
      b.status !== "cancelled" &&
      rangesOverlap(
        checkInDate,
        addDays(checkOutDate, -1),
        new Date(b.checkIn),
        addDays(new Date(b.checkOut), -1),
      ),
  );
  const conflictBlock = blocks.find(
    (b) =>
      b.unitId === pending.unit &&
      rangesOverlap(checkInDate, addDays(checkOutDate, -1), new Date(b.from), new Date(b.to)),
  );
  const conflict = conflictBooking
    ? `Overlaps booking ${conflictBooking.id} (${conflictBooking.guestName}).`
    : conflictBlock
      ? `Overlaps existing block (${conflictBlock.reason}).`
      : null;

  const submitBooking = () => {
    if (!guestName.trim() || conflict || !rt) return;
    onCreateBooking({
      id: `BK-${Math.floor(1000 + Math.random() * 9000)}`,
      guestName: guestName.trim(),
      guestEmail: guestEmail.trim() || "guest@example.com",
      guestPhone: guestPhone.trim(),
      roomTypeId: rt.id,
      unitId: pending.unit,
      checkIn: iso(checkInDate),
      checkOut: iso(checkOutDate),
      guests,
      total,
      status: "pending",
      paid: false,
      source,
      notes: ["Created from calendar selection."],
      activity: [
        { at: new Date().toISOString(), kind: "create", text: "Booking created from calendar selection." },
      ],
    });
  };

  const submitBlock = () => {
    if (conflict) return;
    onCreateBlock({
      id: uid("blk"),
      unitId: pending.unit,
      from: iso(checkInDate),
      to: iso(addDays(checkOutDate, -1)),
      reason: reason || "Blocked",
    });
  };

  return (
    <Dialog open={!!pending} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Create on calendar selection</DialogTitle>
          <DialogDescription>
            {rt?.name} · <span className="font-medium">{pending.unit}</span> ·{" "}
            {format(checkInDate, "MMM d")} → {format(checkOutDate, "MMM d")} ({nights}{" "}
            {nights === 1 ? "night" : "nights"})
          </DialogDescription>
        </DialogHeader>

        {conflict && (
          <div className="flex gap-2 rounded-md border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
            <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{conflict}</span>
          </div>
        )}

        <Tabs value={tab} onValueChange={(v) => setTab(v as "booking" | "block")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="booking">New booking</TabsTrigger>
            <TabsTrigger value="block">Maintenance block</TabsTrigger>
          </TabsList>

          <TabsContent value="booking" className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label>Guest name</Label>
                <Input
                  value={guestName}
                  onChange={(e) => setGuestName(e.target.value)}
                  placeholder="Jane Doe"
                />
              </div>
              <div>
                <Label>Email</Label>
                <Input
                  type="email"
                  value={guestEmail}
                  onChange={(e) => setGuestEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>Phone</Label>
                <Input value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)} />
              </div>
              <div>
                <Label>Guests</Label>
                <Input
                  type="number"
                  min={1}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value) || 1)}
                />
              </div>
              <div>
                <Label>Source</Label>
                <Select value={source} onValueChange={(v) => setSource(v as Booking["source"])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Direct">Direct</SelectItem>
                    <SelectItem value="Booking.com">Booking.com</SelectItem>
                    <SelectItem value="Airbnb">Airbnb</SelectItem>
                    <SelectItem value="Walk-in">Walk-in</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm flex items-center justify-between">
              <span className="text-neutral-500">Total ({nights} {nights === 1 ? "night" : "nights"})</span>
              <span className="font-semibold">${total.toLocaleString()}</span>
            </div>
          </TabsContent>

          <TabsContent value="block" className="mt-4 space-y-3">
            <div>
              <Label>Reason</Label>
              <Input value={reason} onChange={(e) => setReason(e.target.value)} />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          {tab === "booking" ? (
            <Button onClick={submitBooking} disabled={!guestName.trim() || !!conflict || nights < 1}>
              Create booking
            </Button>
          ) : (
            <Button onClick={submitBlock} disabled={!!conflict || nights < 1}>
              Create block
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// 3. Rates & Inventory
// ============================================================
function RatesTab({
  roomTypes,
  setRoomTypes,
  rateRules,
  setRateRules,
  bookings,
  setBookings,
}: {
  roomTypes: RoomType[];
  setRoomTypes: React.Dispatch<React.SetStateAction<RoomType[]>>;
  rateRules: RateRule[];
  setRateRules: React.Dispatch<React.SetStateAction<RateRule[]>>;
  bookings: Booking[];
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>;
}) {
  const updateType = (id: string, patch: Partial<RoomType>) => {
    setRoomTypes((prev) => prev.map((rt) => (rt.id === id ? { ...rt, ...patch } : rt)));
  };
  const [editing, setEditing] = useState<RoomType | null>(null);
  const [creating, setCreating] = useState(false);

  const recalcAll = () => {
    setBookings((prev) =>
      prev.map((b) => {
        if (b.status === "cancelled") return b;
        const rt = roomTypes.find((r) => r.id === b.roomTypeId);
        const total = computeBookingTotal(b, rt, rateRules);
        return total > 0 ? { ...b, total } : b;
      }),
    );
  };

  const removeRoomType = (id: string) => {
    if (bookings.some((b) => b.roomTypeId === id && b.status !== "cancelled")) {
      window.alert("Cannot delete: this room type has active bookings.");
      return;
    }
    setRoomTypes((prev) => prev.filter((rt) => rt.id !== id));
  };

  return (
    <div className="space-y-6">
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" /> Inventory & base rates
            </CardTitle>
            <CardDescription>
              Define inventory and weekday/weekend pricing per room type.
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" className="gap-1" onClick={recalcAll}>
              <RefreshCw className="h-4 w-4" /> Recalculate totals
            </Button>
            <Button size="sm" className="gap-1" onClick={() => setCreating(true)}>
              <Plus className="h-4 w-4" /> Add room type
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room type</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Weekday rate</TableHead>
                <TableHead>Weekend rate</TableHead>
                <TableHead className="w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {roomTypes.map((rt) => (
                <TableRow key={rt.id}>
                  <TableCell>
                    <div className="font-medium">{rt.name}</div>
                    <div className="text-xs text-neutral-500">{rt.units.join(" · ")}</div>
                  </TableCell>
                  <TableCell className="w-28">
                    <Input
                      type="number"
                      min={1}
                      value={rt.quantity}
                      onChange={(e) => updateType(rt.id, { quantity: Number(e.target.value) || 0 })}
                    />
                  </TableCell>
                  <TableCell className="w-32">
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-xs text-neutral-500">$</span>
                      <Input
                        type="number"
                        className="pl-6"
                        value={rt.baseRate}
                        onChange={(e) => updateType(rt.id, { baseRate: Number(e.target.value) || 0 })}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="w-32">
                    <div className="relative">
                      <span className="absolute left-2 top-2 text-xs text-neutral-500">$</span>
                      <Input
                        type="number"
                        className="pl-6"
                        value={rt.weekendRate}
                        onChange={(e) => updateType(rt.id, { weekendRate: Number(e.target.value) || 0 })}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditing(rt)}
                        title="Edit room type"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => removeRoomType(rt.id)}
                        title="Delete room type"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-3 text-xs text-neutral-500">
            Note: room CRUD lives inside the PMS only — it does not push to the public site MVP.
          </p>
        </CardContent>
      </Card>

      <Card className="border-neutral-200 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Seasonality & dynamic pricing</CardTitle>
            <CardDescription>Override base rates for high season, peaks, or events.</CardDescription>
          </div>
          <NewRuleDialog onAdd={(r) => setRateRules((prev) => [...prev, r])} />
        </CardHeader>
        <CardContent>
          {rateRules.length === 0 ? (
            <div className="rounded-lg border border-dashed border-neutral-200 py-10 text-center text-sm text-neutral-500">
              No custom rules yet — add one to start dynamic pricing.
            </div>
          ) : (
            <div className="space-y-3">
              {rateRules.map((r) => (
                <div key={r.id} className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
                  <div>
                    <p className="font-medium text-sm">{r.label}</p>
                    <p className="text-xs text-neutral-500">
                      {format(new Date(r.from), "MMM d, yyyy")} → {format(new Date(r.to), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="font-mono">
                      {r.mode === "percent" ? `+${r.value}%` : `$${r.value} flat`}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setRateRules((prev) => prev.filter((x) => x.id !== r.id))}
                      className="text-rose-600 hover:text-rose-700 hover:bg-rose-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <RoomTypeDialog
        open={creating || !!editing}
        initial={editing}
        onClose={() => {
          setCreating(false);
          setEditing(null);
        }}
        onSave={(rt) => {
          if (editing) {
            setRoomTypes((prev) => prev.map((x) => (x.id === rt.id ? rt : x)));
          } else {
            setRoomTypes((prev) => [...prev, rt]);
          }
          setCreating(false);
          setEditing(null);
        }}
      />
    </div>
  );
}

function RoomTypeDialog({
  open,
  initial,
  onClose,
  onSave,
}: {
  open: boolean;
  initial: RoomType | null;
  onClose: () => void;
  onSave: (rt: RoomType) => void;
}) {
  const [name, setName] = useState("");
  const [baseRate, setBaseRate] = useState(180);
  const [weekendRate, setWeekendRate] = useState(220);
  const [unitsText, setUnitsText] = useState("");

  // Reset form when dialog opens with new context.
  useEffect(() => {
    if (!open) return;
    if (initial) {
      setName(initial.name);
      setBaseRate(initial.baseRate);
      setWeekendRate(initial.weekendRate);
      setUnitsText(initial.units.join(", "));
    } else {
      setName("");
      setBaseRate(180);
      setWeekendRate(220);
      setUnitsText("");
    }
  }, [open, initial]);

  const submit = () => {
    const units = unitsText
      .split(/[,\n]/)
      .map((u) => u.trim())
      .filter(Boolean);
    if (!name.trim() || units.length === 0) return;
    const id = initial?.id ?? uid("rt");
    onSave({
      id,
      name: name.trim(),
      baseRate: baseRate || 0,
      weekendRate: weekendRate || 0,
      quantity: units.length,
      units,
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{initial ? "Edit room type" : "Add room type"}</DialogTitle>
          <DialogDescription>
            Define the room name, nightly rates, and physical units.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Sea View Suite" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Weekday rate ($)</Label>
              <Input type="number" value={baseRate} onChange={(e) => setBaseRate(Number(e.target.value) || 0)} />
            </div>
            <div>
              <Label>Weekend rate ($)</Label>
              <Input
                type="number"
                value={weekendRate}
                onChange={(e) => setWeekendRate(Number(e.target.value) || 0)}
              />
            </div>
          </div>
          <div>
            <Label>Units (comma separated)</Label>
            <Textarea
              value={unitsText}
              onChange={(e) => setUnitsText(e.target.value)}
              placeholder="Sea View 101, Sea View 102, Sea View 103"
              className="min-h-[70px]"
            />
            <p className="mt-1 text-xs text-neutral-500">Quantity is derived from the number of units.</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={submit} disabled={!name.trim() || !unitsText.trim()}>
            {initial ? "Save changes" : "Create room type"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function NewRuleDialog({ onAdd }: { onAdd: (r: RateRule) => void }) {
  const [open, setOpen] = useState(false);
  const [label, setLabel] = useState("Custom rule");
  const [range, setRange] = useState<{ from?: Date; to?: Date }>({});
  const [mode, setMode] = useState<"percent" | "override">("percent");
  const [value, setValue] = useState(20);

  const submit = () => {
    if (!range.from || !range.to) return;
    onAdd({ id: uid("rr"), label, from: iso(range.from), to: iso(range.to), mode, value });
    setOpen(false);
    setLabel("Custom rule");
    setRange({});
    setValue(20);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1"><Plus className="h-4 w-4" /> New rule</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom rate rule</DialogTitle>
          <DialogDescription>Apply for a date range across all room types.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input value={label} onChange={(e) => setLabel(e.target.value)} />
          </div>
          <div>
            <Label>Date range</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start">
                  <CalendarDays className="h-4 w-4 mr-2" />
                  {range.from && range.to
                    ? `${format(range.from, "MMM d")} → ${format(range.to, "MMM d")}`
                    : "Pick dates"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="range"
                  selected={range as any}
                  onSelect={(r: any) => setRange(r ?? {})}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>Mode</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as any)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="percent">Percentage adjustment</SelectItem>
                  <SelectItem value="override">Fixed override</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Value</Label>
              <div className="relative">
                <Input type="number" value={value} onChange={(e) => setValue(Number(e.target.value) || 0)} />
                <span className="absolute right-2 top-2 text-xs text-neutral-500">
                  {mode === "percent" ? "%" : "$"}
                </span>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!range.from || !range.to}>Add rule</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================
// 4. Settings & Policies
// ============================================================
function SettingsTab({
  fees,
  setFees,
  policies,
  setPolicies,
  payments,
  setPayments,
}: {
  fees: FeeRule[];
  setFees: React.Dispatch<React.SetStateAction<FeeRule[]>>;
  policies: { cancellation: string; house: string };
  setPolicies: React.Dispatch<React.SetStateAction<{ cancellation: string; house: string }>>;
  payments: { stripe: boolean; bank: boolean; hotel: boolean };
  setPayments: React.Dispatch<React.SetStateAction<{ stripe: boolean; bank: boolean; hotel: boolean }>>;
}) {
  const addFee = () =>
    setFees((prev) => [...prev, { id: uid("fee"), label: "New fee", mode: "fixed", value: 10, enabled: true }]);

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Fees */}
      <Card className="border-neutral-200 shadow-sm lg:col-span-2">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Taxes & fees</CardTitle>
            <CardDescription>Add to every reservation total.</CardDescription>
          </div>
          <Button size="sm" onClick={addFee} className="gap-1"><Plus className="h-4 w-4" /> Add fee</Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {fees.map((fee) => (
              <div key={fee.id} className="grid grid-cols-12 items-center gap-3 rounded-lg border border-neutral-200 p-3">
                <Input
                  className="col-span-12 sm:col-span-4"
                  value={fee.label}
                  onChange={(e) =>
                    setFees((prev) => prev.map((x) => (x.id === fee.id ? { ...x, label: e.target.value } : x)))
                  }
                />
                <Select
                  value={fee.mode}
                  onValueChange={(v) =>
                    setFees((prev) => prev.map((x) => (x.id === fee.id ? { ...x, mode: v as any } : x)))
                  }
                >
                  <SelectTrigger className="col-span-6 sm:col-span-3"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Fixed amount ($)</SelectItem>
                    <SelectItem value="percent">Percentage (%)</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  className="col-span-6 sm:col-span-2"
                  type="number"
                  value={fee.value}
                  onChange={(e) =>
                    setFees((prev) => prev.map((x) => (x.id === fee.id ? { ...x, value: Number(e.target.value) || 0 } : x)))
                  }
                />
                <div className="col-span-8 sm:col-span-2 flex items-center gap-2">
                  <Switch
                    checked={fee.enabled}
                    onCheckedChange={(v) =>
                      setFees((prev) => prev.map((x) => (x.id === fee.id ? { ...x, enabled: v } : x)))
                    }
                  />
                  <span className="text-xs text-neutral-500">{fee.enabled ? "Active" : "Off"}</span>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="col-span-4 sm:col-span-1 justify-self-end text-rose-600 hover:bg-rose-50"
                  onClick={() => setFees((prev) => prev.filter((x) => x.id !== fee.id))}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Policies */}
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Policies</CardTitle>
          <CardDescription>Shown to guests during booking.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Cancellation policy</Label>
            <Textarea
              value={policies.cancellation}
              onChange={(e) => setPolicies((p) => ({ ...p, cancellation: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
          <div>
            <Label>House rules</Label>
            <Textarea
              value={policies.house}
              onChange={(e) => setPolicies((p) => ({ ...p, house: e.target.value }))}
              className="min-h-[100px]"
            />
          </div>
        </CardContent>
      </Card>

      {/* Payments */}
      <Card className="border-neutral-200 shadow-sm">
        <CardHeader>
          <CardTitle className="text-base">Payment methods</CardTitle>
          <CardDescription>Choose how guests can pay.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <PaymentToggle
            icon={<CreditCard className="h-4 w-4" />}
            label="Credit cards (Stripe)"
            sub="Accept Visa, Mastercard, Amex via Stripe."
            checked={payments.stripe}
            onChange={(v) => setPayments((p) => ({ ...p, stripe: v }))}
          />
          <PaymentToggle
            icon={<Building2 className="h-4 w-4" />}
            label="Bank transfer"
            sub="Provide IBAN/details to the guest."
            checked={payments.bank}
            onChange={(v) => setPayments((p) => ({ ...p, bank: v }))}
          />
          <PaymentToggle
            icon={<Wallet className="h-4 w-4" />}
            label="Pay at hotel"
            sub="Guest pays on arrival."
            checked={payments.hotel}
            onChange={(v) => setPayments((p) => ({ ...p, hotel: v }))}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function PaymentToggle({
  icon,
  label,
  sub,
  checked,
  onChange,
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-neutral-200 p-3">
      <div className="flex items-center gap-3">
        <div className="rounded-md bg-neutral-100 p-2">{icon}</div>
        <div>
          <p className="text-sm font-medium">{label}</p>
          <p className="text-xs text-neutral-500">{sub}</p>
        </div>
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}