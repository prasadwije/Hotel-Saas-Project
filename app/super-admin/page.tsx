"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    Hotel,
    Settings as SettingsIcon,
    LogOut,
    Plus,
    Pencil,
    Trash2,
    ArrowUp,
    ArrowDown,
    Search,
    ExternalLink,
    Save,
    ArrowLeft,
    Monitor,
    Smartphone,
    CalendarRange,
} from "lucide-react";

import type {
    HotelData,
    LayoutConfig,
    LayoutPreference,
    SectionKey,
    Variant,
    HeroTransition,
    HeroImageInput,
    NavLink,
    SubPageKey,
    PagesConfig,
    SiteNavigation,
} from "@/components/template/blocks/shared";
import { normalizeHeroImage, DEFAULT_HERO_DARKNESS, SUB_PAGE_KEYS, getDefaultNavigation, newNavLinkId } from "@/components/template/blocks/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
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
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Slider } from "@/components/ui/slider";
import { HotelTemplate } from "@/components/template/HotelTemplate";
import { PreviewFrame } from "./preview-frame";

// ---------- Types ----------
type ClientStatus = "active" | "inactive";
type Client = { id: string; subdomain: string; status: ClientStatus; data: HotelData; is_admin_enabled?: boolean; package_id?: string; is_booking_engine_enabled?: boolean; };

const SECTION_KEYS: SectionKey[] = [
    "hero",
    "trustBadges",
    "about",
    "rooms",
    "amenities",
    "menu",
    "videoHighlight",
    "gallery",
    "experiences",
    "testimonials",
    "faq",
    "location",
    "contact",
];

const ALL_LAYOUT_KEYS: (keyof LayoutConfig)[] = [
    "hero",
    "header",
    "about",
    "rooms",
    "amenities",
    "menu",
    "videoHighlight",
    "gallery",
    "experiences",
    "testimonials",
    "faq",
    "location",
    "contact",
    "trustBadges",
    "footer",
    "stickyBar",
];

const SECTION_LABEL: Record<string, string> = {
    hero: "Hero",
    header: "Header",
    about: "About",
    rooms: "Rooms",
    amenities: "Amenities",
    menu: "Menu",
    videoHighlight: "Video Highlight",
    gallery: "Gallery",
    testimonials: "Testimonials",
    faq: "FAQ",
    location: "Location",
    experiences: "Experiences",
    contact: "Contact form",
    trustBadges: "Trust badges",
    footer: "Footer",
    stickyBar: "Sticky Bar",
};

// ---------- Dummy data ----------
function emptyHotel(name = "New Hotel"): HotelData {
    return {
        businessName: name,
        primaryColor: "#0f766e",
        heroTitle: "A new chapter awaits",
        heroSubtitle: "Edit this subtitle from the Content tab.",
        heroImages: [
            "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1920&q=80",
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=80",
        ],
        heroTransition: "fade",
        aboutText:
            "Tell your guests the story behind your property. This placeholder text appears until you customise the About section.",
        menuItems: [
            {
                name: "Signature Dish",
                price: "$24",
                description: "A short description of this dish.",
                image:
                    "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
            },
        ],
        galleryImages: [
            "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1200&q=80",
            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
        ],
        address: "Add your address",
        mapEmbedUrl:
            "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.123!2d-73.9857!3d40.7484!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDDCsDQ0JzU0LjMiTiA3M8KwNTknMDguNSJX!5e0!3m2!1sen!2sus!4v1700000000000",
        phone: "+1 555 0000",
        whatsapp: "15550000",
        socialLinks: {},
        rooms: [
            {
                name: "Garden Suite",
                price: "$280 / night",
                description: "A serene suite overlooking the garden.",
                image:
                    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=1200&q=80",
                features: ["King bed", "Garden view", "Free Wi-Fi"],
                gallery: [
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1551776235-dde6d4829808?auto=format&fit=crop&w=1200&q=80",
                    "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
                ],
                amenities: ["Free Wi-Fi", "King Bed", "Garden View", "Air Conditioning", "Bathtub", "TV"],
            },
        ],
        amenities: ["Free Wi-Fi", "Pool", "Breakfast", "Spa", "Parking", "Concierge"],
        testimonials: [
            { author: "Anna R.", text: "An unforgettable stay. Every detail was perfect.", rating: 5 },
        ],
        faqs: [
            { question: "What time is check-in?", answer: "Check-in starts at 3:00 PM." },
            { question: "Is breakfast included?", answer: "Yes, a continental breakfast is included." },
        ],
        videoUrl: "",
        enableContactForm: false,
        contactEmail: "",
        experiences: [],
        trustBadges: [],
        mobileLayouts: { rooms: "carousel", menu: "stack", testimonials: "carousel" },
        layoutConfig: Object.fromEntries(ALL_LAYOUT_KEYS.map((k) => [k, "v1"])) as LayoutConfig,
        sectionOrder: [...SECTION_KEYS],
    };
}

const SEED_CLIENTS: Client[] = [
    {
        id: "c1",
        subdomain: "lumina.agency.com",
        status: "active",
        data: {
            ...emptyHotel("Lumina Retreat"),
            primaryColor: "#b45309",
            heroTitle: "Where light meets the shore",
            heroSubtitle: "A coastal sanctuary inspired by Mediterranean afternoons.",
            heroImages: [
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
                "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80",
            ],
            aboutText:
                "Lumina Retreat is a twelve-suite seaside hideaway where every detail is touched by daylight.",
            phone: "+1 555 0142",
            whatsapp: "15550142",
            address: "21 Harbor Walk, Santa Monica, CA",
            specialOffer: "Stay 3, pay 2 — Spring escape.",
        },
    },
    {
        id: "c2",
        subdomain: "oceanview.agency.com",
        status: "active",
        data: {
            ...emptyHotel("Ocean View Inn"),
            primaryColor: "#0369a1",
            heroTitle: "Endless horizons, intimate evenings",
            phone: "+1 555 0199",
            whatsapp: "15550199",
            address: "8 Cliffside Road, Big Sur, CA",
        },
    },
    {
        id: "c3",
        subdomain: "verdant.agency.com",
        status: "inactive",
        data: {
            ...emptyHotel("Verdant Lodge"),
            primaryColor: "#15803d",
        },
    },
];

// ---------- Page ----------
export default function AdminPage() {
    const [clients, setClients] = useState<Client[]>([]);
    const [packages, setPackages] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState<"clients" | "settings">("clients");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    
    // modal state
    const [showNewModal, setShowNewModal] = useState(false);
    const [newHotelName, setNewHotelName] = useState("");
    const [newSubdomain, setNewSubdomain] = useState("");
    const [newPackageId, setNewPackageId] = useState("");

    useEffect(() => {
        const fetchClients = async () => {
            const supabase = createClient();
            
            // Auth Guard
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                window.location.href = '/login';
                return;
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (!profile || profile.role !== 'super_admin') {
                window.location.href = '/login';
                return;
            }

            const { data: pkgs } = await supabase.from('hotel_packages').select('*');
            if (pkgs) setPackages(pkgs);

            // Fetch Hotels
            const { data, error } = await supabase.from('hotels').select('*');
            if (data) {
                setClients(data.map((h: any) => ({
                    id: h.id,
                    subdomain: h.subdomain || "",
                    status: h.status || "active",
                    is_admin_enabled: h.is_admin_enabled,
                    package_id: h.package_id,
                    is_booking_engine_enabled: h.is_booking_engine_enabled,
                })));
            }
            setLoading(false);
        };
        fetchClients();
    }, []);

    const editingClient = useMemo(
        () => clients.find((c) => c.id === editingId) ?? null,
        [clients, editingId],
    );

    const upsertClient = async (updated: Client) => {
        const supabase = createClient();
        
        // Optimistic UI update
        setClients((prev) => {
            const idx = prev.findIndex((c) => c.id === updated.id);
            if (idx === -1) return [...prev, updated];
            const copy = [...prev];
            copy[idx] = updated;
            return copy;
        });

        if (updated.id.startsWith('c')) {
            // Handled by create new
            return;
        } else {
            await supabase.from('hotels').update({
                business_name: updated.data.businessName,
                subdomain: updated.subdomain,
                site_config: updated.data,
                is_admin_enabled: updated.is_admin_enabled,
                package_id: updated.package_id,
            }).eq('id', updated.id);
        }
    };

    const deleteClient = async (id: string) => {
        const supabase = createClient();
        setClients((prev) => prev.filter((c) => c.id !== id));
        if (!id.startsWith('c')) {
            await supabase.from('hotels').delete().eq('id', id);
        }
    };

    const handleCreateNew = async () => {
        const supabase = createClient();
        const config = emptyHotel(newHotelName);
        const { data, error } = await supabase.from('hotels').insert({
            business_name: newHotelName,
            subdomain: newSubdomain,
            package_id: newPackageId || null,
            site_config: config,
            is_admin_enabled: false,
            status: 'active'
        }).select().single();

        if (data) {
            const newClient: Client = {
                id: data.id,
                subdomain: data.subdomain,
                status: 'active',
                data: config,
                is_admin_enabled: false,
                package_id: data.package_id,
                is_booking_engine_enabled: false,
            };
            setClients([...clients, newClient]);
            setEditingId(data.id);
            setShowNewModal(false);
            setNewHotelName("");
            setNewSubdomain("");
            setNewPackageId("");
        }
    };

    const handleToggleBooking = async (id: string, currentStatus: boolean) => {
        const action = currentStatus ? "OFF" : "ON";
        if (!confirm(`Are you sure you want to turn ${action} the Booking Engine for this hotel? This will reorganize rooms between the site config and the hotel_rooms table.`)) {
            return;
        }
        const supabase = createClient();
        const { error } = await supabase.rpc('toggle_booking_engine', { p_hotel_id: id, p_enable: !currentStatus });
        if (error) {
            alert("Failed to toggle booking engine: " + error.message);
        } else {
            setClients(prev => prev.map(c => c.id === id ? { ...c, is_booking_engine_enabled: !currentStatus } : c));
        }
    };

    if (loading) return <div className="p-8 flex justify-center">Loading clients...</div>;

    const filtered = clients.filter(
        (c) =>
            c.data.businessName.toLowerCase().includes(search.toLowerCase()) ||
            c.subdomain.toLowerCase().includes(search.toLowerCase()),
    );

    return (
        <div className="flex min-h-screen w-full bg-neutral-50 text-neutral-900">
            {editingClient ? (
                <EditorWorkspace
                    key={editingClient.id}
                    client={editingClient}
                    packages={packages}
                    onSave={(c) => {
                        upsertClient(c);
                        setEditingId(null);
                    }}
                    onClose={() => setEditingId(null)}
                    onDelete={() => {
                        deleteClient(editingClient.id);
                        setEditingId(null);
                    }}
                />
            ) : (
                <>
                    {/* Sidebar */}
                    <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
                        <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-5">
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white">
                                <Hotel className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold leading-tight">Super Admin</p>
                                <p className="text-[11px] text-neutral-500">God Mode</p>
                            </div>
                        </div>
                        <nav className="flex flex-1 flex-col gap-1 p-3">
                            <SidebarItem
                                icon={<Hotel className="h-4 w-4" />}
                                label="Hotels / Clients"
                                active={activeNav === "clients"}
                                onClick={() => {
                                    setActiveNav("clients");
                                    setEditingId(null);
                                }}
                            />
                            <SidebarItem
                                icon={<SettingsIcon className="h-4 w-4" />}
                                label="Settings"
                                active={activeNav === "settings"}
                                onClick={() => {
                                    setActiveNav("settings");
                                    setEditingId(null);
                                }}
                            />
                        </nav>
                        <div className="border-t border-neutral-200 p-3">
                            <SidebarItem icon={<LogOut className="h-4 w-4" />} label="Logout" onClick={async () => { await createClient().auth.signOut(); window.location.href = '/login'; }} />
                        </div>
                    </aside>

                    {/* Main */}
                    <main className="flex-1">
                        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur">
                            <div>
                                <h1 className="text-base font-semibold tracking-tight">
                                    {activeNav === "settings" ? "Settings" : "Clients"}
                                </h1>
                                <p className="text-xs text-neutral-500">
                                    {activeNav === "settings"
                                        ? "Workspace preferences."
                                        : `${clients.length} total clients`}
                                </p>
                            </div>
                            {activeNav === "clients" && (
                                <Button onClick={() => setShowNewModal(true)} className="gap-2">
                                    <Plus className="h-4 w-4" /> Add new client
                                </Button>
                            )}
                        </header>

                        <div className="p-6">
                            {activeNav === "settings" ? (
                                <SettingsPanel />
                            ) : (
                                    clients={filtered}
                                    search={search}
                                    onSearch={setSearch}
                                    onEdit={setEditingId}
                                    onDelete={deleteClient}
                                    onToggleBooking={handleToggleBooking}
                                />
                            )}
                        </div>
                    </main>

                    {/* Modal */}
                    {showNewModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                            <div className="w-[400px] bg-white rounded-xl shadow-xl p-6">
                                <h2 className="text-lg font-semibold mb-4">Add New Hotel</h2>
                                <div className="space-y-4">
                                    <div>
                                        <Label>Business Name</Label>
                                        <Input value={newHotelName} onChange={e => setNewHotelName(e.target.value)} placeholder="E.g. Sunset Resort" />
                                    </div>
                                    <div>
                                        <Label>Subdomain</Label>
                                        <Input value={newSubdomain} onChange={e => setNewSubdomain(e.target.value)} placeholder="sunset" />
                                    </div>
                                    <div>
                                        <Label>Package</Label>
                                        <Select value={newPackageId} onValueChange={setNewPackageId}>
                                            <SelectTrigger><SelectValue placeholder="Select a package" /></SelectTrigger>
                                            <SelectContent>
                                                {packages.map(p => <SelectItem key={p.id} value={p.id}>{p.name} - ${p.price}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="mt-6 flex justify-end gap-2">
                                    <Button variant="ghost" onClick={() => setShowNewModal(false)}>Cancel</Button>
                                    <Button onClick={handleCreateNew} disabled={!newHotelName || !newSubdomain}>Create</Button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void; }) { return ( <button onClick={onClick} className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"}`}> {icon} <span>{label}</span> </button> ); }

// ---------- Clients table ----------
function ClientsTable({
    clients,
    search,
    onSearch,
    onEdit,
    onDelete,
    onToggleBooking,
}: {
    clients: Client[];
    search: string;
    onSearch: (v: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
    onToggleBooking: (id: string, currentStatus: boolean) => void;
}) {
    return (
        <Card className="border-neutral-200 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                <div>
                    <CardTitle className="text-base">All clients</CardTitle>
                    <CardDescription>Each client maps to a published hotel website.</CardDescription>
                </div>
                <div className="relative w-72">
                    <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                    <Input
                        placeholder="Search clients or subdomains"
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        className="pl-8"
                    />
                </div>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Business name</TableHead>
                            <TableHead>Subdomain</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} className="py-10 text-center text-sm text-neutral-500">
                                    No clients match your search.
                                </TableCell>
                            </TableRow>
                        )}
                        {clients.map((c) => (
                            <TableRow key={c.id}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div
                                            className="h-8 w-8 rounded-md"
                                            style={{ background: c.data.primaryColor }}
                                        />
                                        <div>
                                            <p className="font-medium">{c.data.businessName}</p>
                                            <p className="text-xs text-neutral-500">{c.data.heroTitle}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <a
                                        className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900"
                                        href={`https://${c.subdomain}.${process.env.NEXT_PUBLIC_SAAS_DOMAIN || "hotelsaas.com"}`}
                                        target="_blank"
                                        rel="noreferrer"
                                    >
                                        {c.subdomain}.{process.env.NEXT_PUBLIC_SAAS_DOMAIN || "hotelsaas.com"}
                                        <ExternalLink className="h-3 w-3" />
                                    </a>
                                </TableCell>
                                <TableCell>
                                    <Badge
                                        variant={c.status === "active" ? "default" : "secondary"}
                                        className={
                                            c.status === "active"
                                                ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                                : "bg-neutral-200 text-neutral-700 hover:bg-neutral-200"
                                        }
                                    >
                                        {c.status === "active" ? "Active" : "Inactive"}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2 items-center">
                                        <div className="flex items-center gap-2 mr-2 border-r pr-4 border-neutral-200">
                                            <span className="text-[10px] text-neutral-500 font-medium uppercase tracking-wider text-left leading-tight">Booking<br/>Engine</span>
                                            <Switch 
                                                checked={!!c.is_booking_engine_enabled}
                                                onCheckedChange={() => onToggleBooking(c.id, !!c.is_booking_engine_enabled)}
                                            />
                                        </div>
                                        <Button size="sm" variant="outline" onClick={() => onEdit(c.id)} className="gap-1">
                                            <Pencil className="h-3.5 w-3.5" /> Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => onDelete(c.id)}
                                            className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}

function SettingsPanel() {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Workspace settings</CardTitle>
                <CardDescription>Agency-wide preferences (coming soon).</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-neutral-600">
                This section will hold agency branding, default templates, and team access.
            </CardContent>
        </Card>
    );
}

// ---------- Split-screen editor workspace ----------
function EditorWorkspace({ client, packages, onSave, onClose, onDelete }: { client: Client; packages: any[]; onSave: (c: Client) => void; onClose: () => void; onDelete: () => void; }) {
    const [draft, setDraft] = useState<Client>(client);
    const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

    // Reset draft if a different client opens
    useEffect(() => {
        setDraft(client);
    }, [client.id]);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            {/* LEFT — editor */}
            <section className="flex h-full w-[35%] min-w-[380px] flex-col border-r border-neutral-200 bg-white">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white/90 px-5 backdrop-blur">
                    <div className="flex items-center gap-2 min-w-0">
                        <Button variant="ghost" size="sm" onClick={onClose} className="gap-1">
                            <ArrowLeft className="h-4 w-4" /> Back
                        </Button>
                        <div className="min-w-0">
                            <p className="truncate text-sm font-semibold">{draft.data.businessName}</p>
                            <p className="truncate text-[11px] text-neutral-500">{draft.subdomain}</p>
                        </div>
                    </div>
                    <Button onClick={() => onSave(draft)} className="gap-2">
                        <Save className="h-4 w-4" /> Save changes
                    </Button>
                </header>
                <div className="flex-1 overflow-y-auto p-5">
                    <ClientEditor client={draft} packages={packages} onChange={setDraft} onDelete={onDelete} />
                </div>
            </section>

            {/* RIGHT — live preview */}
            <section className="flex h-full flex-1 flex-col overflow-hidden bg-neutral-100">
                <div className="flex h-14 shrink-0 items-center justify-center border-b border-neutral-200 bg-white/70 px-4 backdrop-blur">
                    <ToggleGroup
                        type="single"
                        value={device}
                        onValueChange={(v) => v && setDevice(v as "desktop" | "mobile")}
                        className="rounded-full border border-neutral-200 bg-white p-1 shadow-sm"
                    >
                        <ToggleGroupItem
                            value="desktop"
                            className="gap-2 rounded-full px-4 data-[state=on]:bg-neutral-900 data-[state=on]:text-white"
                        >
                            <Monitor className="h-4 w-4" /> Desktop
                        </ToggleGroupItem>
                        <ToggleGroupItem
                            value="mobile"
                            className="gap-2 rounded-full px-4 data-[state=on]:bg-neutral-900 data-[state=on]:text-white"
                        >
                            <Smartphone className="h-4 w-4" /> Mobile
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
                {/* Preview area — `transform-gpu` + `isolate` create a containing
            block so the template's fixed header is trapped inside this panel
            rather than overlapping the admin top bar above. */}
                {device === "desktop" ? (
                    <div className="relative isolate flex-1 overflow-y-auto bg-white transform-gpu">
                        <HotelTemplate data={draft.data} />
                    </div>
                ) : (
                    <div className="flex flex-1 items-start justify-center overflow-y-auto bg-neutral-100 px-6 py-10">
                        <div className="relative isolate h-[800px] w-[390px] overflow-hidden rounded-[2.5rem] border-[10px] border-neutral-900 bg-white shadow-2xl transform-gpu">
                            <PreviewFrame
                                title="Mobile preview"
                                className="block h-full w-full border-0 bg-white"
                            >
                                <HotelTemplate data={draft.data} />
                            </PreviewFrame>
                        </div>
                    </div>
                )}
            </section>
        </div>
    );
}

// ---------- Client editor ----------
function ClientEditor({ client, packages, onChange, onDelete }: { client: Client; packages: any[]; onChange: (c: Client) => void; onDelete: () => void; }) {
    const update = (patch: Partial<Client>) => onChange({ ...client, ...patch });
    const updateData = (patch: Partial<HotelData>) =>
        onChange({ ...client, data: { ...client.data, ...patch } });

    return (
        <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="theme">Theme & Layout</TabsTrigger>
                <TabsTrigger value="pages">Pages & Menu</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media</TabsTrigger>
                <TabsTrigger value="seo">SEO & Social</TabsTrigger>
                <TabsTrigger value="advanced">Developer</TabsTrigger>
            </TabsList>

            {/* TAB 1 */}
            <TabsContent value="general" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">General information</CardTitle>
                        <CardDescription>Core details shown across the site.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <Field label="Business name">
                            <Input
                                value={client.data.businessName}
                                onChange={(e) => updateData({ businessName: e.target.value })}
                            />
                        </Field>
                        <Field label="Subdomain">
                            <Input
                                value={client.subdomain}
                                onChange={(e) => update({ subdomain: e.target.value })}
                            />
                        </Field>
                        <Field label="Phone">
                            <Input
                                value={client.data.phone}
                                onChange={(e) => updateData({ phone: e.target.value })}
                            />
                        </Field>
                        <Field label="WhatsApp">
                            <Input
                                value={client.data.whatsapp}
                                onChange={(e) => updateData({ whatsapp: e.target.value })}
                            />
                        </Field>
                        <Field label="Address" className="md:col-span-2">
                            <Textarea
                                rows={2}
                                value={client.data.address}
                                onChange={(e) => updateData({ address: e.target.value })}
                            />
                        </Field>
                        <Field label="Primary color">
                            <div className="flex items-center gap-3">
                                <input
                                    type="color"
                                    value={client.data.primaryColor}
                                    onChange={(e) => updateData({ primaryColor: e.target.value })}
                                    className="h-10 w-14 cursor-pointer rounded-md border border-neutral-200 bg-white"
                                />
                                <Input
                                    value={client.data.primaryColor}
                                    onChange={(e) => updateData({ primaryColor: e.target.value })}
                                    className="flex-1"
                                />
                            </div>
                        </Field>
                        <Field label="Admin Dashboard Access"><div className="flex h-10 items-center gap-3"><Switch checked={!!client.is_admin_enabled} onCheckedChange={(v) => update({ is_admin_enabled: v })} /><span className="text-sm text-neutral-600">{client.is_admin_enabled ? "Enabled" : "Disabled"}</span></div></Field><Field label="Subscription Package"><Select value={client.package_id || ""} onValueChange={(v) => update({ package_id: v })}><SelectTrigger><SelectValue placeholder="Select a package" /></SelectTrigger><SelectContent>{packages.map(p => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent></Select></Field><Field label="Status">
                            <Select
                                value={client.status}
                                onValueChange={(v: ClientStatus) => update({ status: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Special offer banner" className="md:col-span-2">
                            <Input
                                placeholder="e.g. Stay 3 nights, get 1 free"
                                value={client.data.specialOffer ?? ""}
                                onChange={(e) => updateData({ specialOffer: e.target.value })}
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Direct inquiry form</CardTitle>
                        <CardDescription>Enable a contact form section on the site.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <Field label="Enable contact form">
                            <div className="flex h-10 items-center gap-3">
                                <Switch
                                    checked={!!client.data.enableContactForm}
                                    onCheckedChange={(v) => updateData({ enableContactForm: v })}
                                />
                                <span className="text-sm text-neutral-600">
                                    {client.data.enableContactForm ? "Visible on the site" : "Hidden"}
                                </span>
                            </div>
                        </Field>
                        <Field label="Contact email">
                            <Input
                                placeholder="hello@yourhotel.com"
                                value={client.data.contactEmail ?? ""}
                                onChange={(e) => updateData({ contactEmail: e.target.value })}
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card className="border-red-200">
                    <CardHeader>
                        <CardTitle className="text-base text-red-700">Danger zone</CardTitle>
                        <CardDescription>Permanently remove this client.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button variant="destructive" onClick={onDelete} className="gap-2">
                            <Trash2 className="h-4 w-4" /> Delete client
                        </Button>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* TAB 2 */}
            <TabsContent value="theme" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Section variations</CardTitle>
                        <CardDescription>Pick the visual style for every block.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {ALL_LAYOUT_KEYS.map((k) => {
                            const structuralKeys = ["hero", "about", "rooms", "amenities"] as const;
                            const thematicKeys = ["gallery", "menu", "testimonials", "location"] as const;
                            const isStructural = (structuralKeys as readonly string[]).includes(k as string);
                            const isThematic = (thematicKeys as readonly string[]).includes(k as string);
                            const isHeader = k === "header";
                            const variations: Array<{ value: string; label: string }> = isHeader
                                ? [
                                    { value: "v1", label: "V1 — Classic transparent" },
                                    { value: "v2", label: "V2 — Apple Glass Island" },
                                    { value: "v3", label: "V3 — Split centered serif" },
                                    { value: "v4", label: "V4 — Minimal underline" },
                                ]
                                : isStructural
                                    ? [
                                        { value: "v1", label: "V1 — Classic" },
                                        { value: "v2", label: "V2 — Editorial" },
                                        { value: "v3", label: "V3 — Split & Overlapping" },
                                        { value: "v4", label: "V4 — Bento / Grid" },
                                        { value: "v5", label: "V5 — Centered & Spacious" },
                                        { value: "v6", label: "V6 — Floating Cards & Slider" },
                                        { value: "v7", label: "V7 — Apple Product Page" },
                                        { value: "v8", label: "V8 — Apple Bento & Glass" },
                                        { value: "v9", label: "V9 — Cinematic Elegant Minimal" },
                                        { value: "v10", label: "V10 — Floating Layered Editorial" },
                                    ]
                                    : isThematic
                                        ? [
                                            { value: "v1", label: "V1 — Classic" },
                                            { value: "v2", label: "V2 — Editorial" },
                                            { value: "v3", label: "V3 — Ultra-Luxury Dark" },
                                            { value: "v4", label: "V4 — Editorial Magazine" },
                                            { value: "v5", label: "V5 — Trendy Bento Box" },
                                            { value: "v6", label: "V6 — Ultra-Minimalist" },
                                            { value: "v7", label: "V7 — Apple Product Page" },
                                            { value: "v8", label: "V8 — Apple Bento & Glass" },
                                            { value: "v9", label: "V9 — Cinematic Elegant Minimal" },
                                            { value: "v10", label: "V10 — Floating Layered Editorial" },
                                        ]
                                        : [
                                            { value: "v1", label: "Variation 1" },
                                            { value: "v2", label: "Variation 2" },
                                        ];
                            return (
                                <Field key={k} label={SECTION_LABEL[k]}>
                                    <Select
                                        value={(client.data.layoutConfig?.[k] ?? "v1") as string}
                                        onValueChange={(v: string) =>
                                            updateData({
                                                layoutConfig: { ...(client.data.layoutConfig ?? {}), [k]: v as Variant },
                                            })
                                        }
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {variations.map((opt) => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </Field>
                            );
                        })}
                        <Field label="Hero transition effect">
                            <Select
                                value={client.data.heroTransition ?? "fade"}
                                onValueChange={(v: HeroTransition) => updateData({ heroTransition: v })}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="fade">Fade (cross-fade)</SelectItem>
                                    <SelectItem value="slide">Slide (horizontal)</SelectItem>
                                </SelectContent>
                            </Select>
                        </Field>
                        <Field label="Sticky header">
                            <div className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2">
                                <span className="text-sm text-neutral-700">
                                    {client.data.layoutConfig?.headerSticky === false
                                        ? "Header scrolls away with the page"
                                        : "Header stays pinned to the top while scrolling"}
                                </span>
                                <Switch
                                    checked={client.data.layoutConfig?.headerSticky !== false}
                                    onCheckedChange={(checked: boolean) =>
                                        updateData({
                                            layoutConfig: {
                                                ...(client.data.layoutConfig ?? {}),
                                                headerSticky: checked,
                                            },
                                        })
                                    }
                                />
                            </div>
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Mobile UX</CardTitle>
                        <CardDescription>
                            Choose how Rooms, Menu, and Testimonials behave on small screens.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-3">
                        {(["rooms", "menu", "testimonials"] as const).map((k) => (
                            <div key={k} className="space-y-2">
                                <Label className="text-sm capitalize">{k}</Label>
                                <RadioGroup
                                    value={client.data.mobileLayouts?.[k] ?? "stack"}
                                    onValueChange={(v: LayoutPreference) =>
                                        updateData({
                                            mobileLayouts: { ...(client.data.mobileLayouts ?? {}), [k]: v },
                                        })
                                    }
                                    className="flex gap-3"
                                >
                                    <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-neutral-200 p-3 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:text-white">
                                        <RadioGroupItem value="stack" />
                                        <span className="text-sm">Stack</span>
                                    </label>
                                    <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-md border border-neutral-200 p-3 has-[:checked]:border-neutral-900 has-[:checked]:bg-neutral-900 has-[:checked]:text-white">
                                        <RadioGroupItem value="carousel" />
                                        <span className="text-sm">Carousel</span>
                                    </label>
                                </RadioGroup>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <SectionOrderEditor
                    order={client.data.sectionOrder ?? [...SECTION_KEYS]}
                    onChange={(o) => updateData({ sectionOrder: o })}
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Section backgrounds</CardTitle>
                        <CardDescription>
                            Override any section with a solid color, CSS gradient, or image URL. Leave blank to use the default.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-5 sm:grid-cols-2">
                        {SECTION_KEYS.filter((k) => k !== "hero").map((k) => {
                            const value = client.data.sectionBackgrounds?.[k] ?? "";
                            const setBg = (v: string) => {
                                const next = { ...(client.data.sectionBackgrounds ?? {}) };
                                if (v) next[k] = v;
                                else delete next[k];
                                updateData({ sectionBackgrounds: next });
                            };
                            return (
                                <SectionBackgroundEditor
                                    key={k}
                                    label={SECTION_LABEL[k] ?? k}
                                    value={value}
                                    onChange={setBg}
                                />
                            );
                        })}
                    </CardContent>
                </Card>
            </TabsContent>

            {/* TAB: Pages & Menu */}
            <TabsContent value="pages" className="mt-6 space-y-6">
                <PagesAndMenuTab data={client.data} updateData={updateData} />
            </TabsContent>

            {/* TAB 3 */}
            <TabsContent value="content" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Hero & About copy</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <Field label="Hero title">
                            <Input
                                value={client.data.heroTitle}
                                onChange={(e) => updateData({ heroTitle: e.target.value })}
                            />
                        </Field>
                        <Field label="Hero subtitle">
                            <Textarea
                                rows={2}
                                value={client.data.heroSubtitle ?? ""}
                                onChange={(e) => updateData({ heroSubtitle: e.target.value })}
                            />
                        </Field>
                        <Field label="About text">
                            <Textarea
                                rows={5}
                                value={client.data.aboutText}
                                onChange={(e) => updateData({ aboutText: e.target.value })}
                            />
                        </Field>
                        <Field label="About — short summary (used on home when /about page is enabled)">
                            <Textarea
                                rows={2}
                                value={client.data.aboutShortSummary ?? ""}
                                onChange={(e) => updateData({ aboutShortSummary: e.target.value })}
                                placeholder="Optional. If empty, About text is auto-truncated."
                            />
                        </Field>
                        {client.data.siteLayout === "multi-page" && (
                            <Field label="About — full story (rendered on the dedicated /about page)">
                                <Textarea
                                    rows={6}
                                    value={client.data.aboutFullStory ?? ""}
                                    onChange={(e) => updateData({ aboutFullStory: e.target.value })}
                                    placeholder="Long-form copy shown only on the dedicated About page."
                                />
                            </Field>
                        )}
                        {client.data.siteLayout === "multi-page" && (
                            <Field label="Contact — detailed info (rendered on the dedicated contact area)">
                                <Textarea
                                    rows={4}
                                    value={client.data.contactDetailedInfo ?? ""}
                                    onChange={(e) => updateData({ contactDetailedInfo: e.target.value })}
                                    placeholder="Optional rich contact details — hours, directions, departments…"
                                />
                            </Field>
                        )}
                    </CardContent>
                </Card>

                <ListEditor
                    title="Menu items"
                    description="Add dishes shown in the Menu block."
                    items={client.data.menuItems ?? []}
                    onChange={(items) => updateData({ menuItems: items })}
                    empty={{ name: "", price: "", description: "", image: "" }}
                    render={(item, set) => (
                        <div className="grid gap-3 md:grid-cols-2">
                            <Input placeholder="Name" value={item.name} onChange={(e) => set({ name: e.target.value })} />
                            <Input placeholder="Price" value={item.price} onChange={(e) => set({ price: e.target.value })} />
                            <Input className="md:col-span-2" placeholder="Image URL" value={item.image ?? ""} onChange={(e) => set({ image: e.target.value })} />
                            <Textarea className="md:col-span-2" rows={2} placeholder="Description" value={item.description ?? ""} onChange={(e) => set({ description: e.target.value })} />
                        </div>
                    )}
                />

                <ListEditor
                    title="Rooms"
                    description="Showcase available rooms or suites."
                    items={client.data.rooms ?? []}
                    onChange={(items) => updateData({ rooms: items })}
                    empty={{ name: "", price: "", description: "", image: "", features: [], gallery: [], amenities: [] }}
                    render={(item, set) => (
                        <div className="grid gap-3 md:grid-cols-2">
                            <Input placeholder="Name" value={item.name} onChange={(e) => set({ name: e.target.value })} />
                            <Input placeholder="Price" value={item.price} onChange={(e) => set({ price: e.target.value })} />
                            <Input className="md:col-span-2" placeholder="Image URL" value={item.image} onChange={(e) => set({ image: e.target.value })} />
                            <Textarea className="md:col-span-2" rows={2} placeholder="Description" value={item.description} onChange={(e) => set({ description: e.target.value })} />
                            <Input
                                className="md:col-span-2"
                                placeholder="Features (comma separated)"
                                value={item.features.join(", ")}
                                onChange={(e) =>
                                    set({ features: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                                }
                            />
                            <Textarea
                                className="md:col-span-2"
                                rows={3}
                                placeholder="Gallery image URLs (one per line) — shown in the Room Details modal"
                                value={(item.gallery ?? []).join("\n")}
                                onChange={(e) =>
                                    set({ gallery: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })
                                }
                            />
                            <Input
                                className="md:col-span-2"
                                placeholder="In-room amenities (comma separated) — e.g. Free Wi-Fi, King Bed, Ocean View"
                                value={(item.amenities ?? []).join(", ")}
                                onChange={(e) =>
                                    set({ amenities: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) })
                                }
                            />
                        </div>
                    )}
                />

                <ListEditor
                    title="Testimonials"
                    description="Guest reviews to build trust."
                    items={client.data.testimonials ?? []}
                    onChange={(items) => updateData({ testimonials: items })}
                    empty={{ author: "", text: "", rating: 5 }}
                    render={(item, set) => (
                        <div className="grid gap-3 md:grid-cols-3">
                            <Input className="md:col-span-2" placeholder="Author" value={item.author} onChange={(e) => set({ author: e.target.value })} />
                            <Input
                                type="number"
                                min={1}
                                max={5}
                                placeholder="Rating"
                                value={item.rating}
                                onChange={(e) => set({ rating: Number(e.target.value) || 0 })}
                            />
                            <Textarea className="md:col-span-3" rows={2} placeholder="Quote" value={item.text} onChange={(e) => set({ text: e.target.value })} />
                        </div>
                    )}
                />

                <ListEditor
                    title="FAQs"
                    description="Answers to common booking questions."
                    items={client.data.faqs ?? []}
                    onChange={(items) => updateData({ faqs: items })}
                    empty={{ question: "", answer: "" }}
                    render={(item, set) => (
                        <div className="grid gap-3">
                            <Input placeholder="Question" value={item.question} onChange={(e) => set({ question: e.target.value })} />
                            <Textarea rows={3} placeholder="Answer" value={item.answer} onChange={(e) => set({ answer: e.target.value })} />
                        </div>
                    )}
                />

                <StringListEditor
                    title="Amenities"
                    description="Simple labels — icons are picked automatically."
                    items={client.data.amenities ?? []}
                    onChange={(items) => updateData({ amenities: items })}
                    placeholder="e.g. Free Wi-Fi"
                />

                <ListEditor
                    title="Experiences & attractions"
                    description="Nearby places guests will love."
                    items={client.data.experiences ?? []}
                    onChange={(items) => updateData({ experiences: items })}
                    empty={{ title: "", distance: "", description: "", image: "" }}
                    render={(item, set) => (
                        <div className="grid gap-3 md:grid-cols-2">
                            <Input placeholder="Title" value={item.title} onChange={(e) => set({ title: e.target.value })} />
                            <Input placeholder="Distance (e.g. 2 km)" value={item.distance} onChange={(e) => set({ distance: e.target.value })} />
                            <Input className="md:col-span-2" placeholder="Image URL" value={item.image} onChange={(e) => set({ image: e.target.value })} />
                            <Textarea className="md:col-span-2" rows={2} placeholder="Description" value={item.description} onChange={(e) => set({ description: e.target.value })} />
                        </div>
                    )}
                />
            </TabsContent>

            {/* TAB 4 */}
            <TabsContent value="media" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Media URLs</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <Field label="Video URL (embed)">
                            <Input value={client.data.videoUrl ?? ""} onChange={(e) => updateData({ videoUrl: e.target.value })} />
                        </Field>
                        <Field label="Map embed URL">
                            <Input value={client.data.mapEmbedUrl ?? ""} onChange={(e) => updateData({ mapEmbedUrl: e.target.value })} />
                        </Field>
                    </CardContent>
                </Card>

                <HeroImagesEditor
                    items={client.data.heroImages ?? []}
                    onChange={(items) => updateData({ heroImages: items })}
                />

                <StringListEditor
                    title="Gallery images"
                    description="Each entry is a public image URL."
                    items={client.data.galleryImages ?? []}
                    onChange={(items) => updateData({ galleryImages: items })}
                    placeholder="https://…"
                />

                <StringListEditor
                    title="Trust badges / awards"
                    description="Logos shown in the trust strip (PNG/SVG URLs work best)."
                    items={client.data.trustBadges ?? []}
                    onChange={(items) => updateData({ trustBadges: items })}
                    placeholder="https://…/award.svg"
                />

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Social links</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <Field label="Facebook">
                            <Input
                                value={client.data.socialLinks?.facebook ?? ""}
                                onChange={(e) =>
                                    updateData({
                                        socialLinks: { ...(client.data.socialLinks ?? {}), facebook: e.target.value },
                                    })
                                }
                            />
                        </Field>
                        <Field label="Instagram">
                            <Input
                                value={client.data.socialLinks?.instagram ?? ""}
                                onChange={(e) =>
                                    updateData({
                                        socialLinks: { ...(client.data.socialLinks ?? {}), instagram: e.target.value },
                                    })
                                }
                            />
                        </Field>
                    </CardContent>
                </Card>
            </TabsContent>

            {/* TAB 5 — SEO & SOCIAL */}
            <TabsContent value="seo" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Search engine metadata</CardTitle>
                        <CardDescription>
                            Controls the browser tab title, search snippets, and link previews on social platforms.
                            Reflected live in the preview; full SSR rendering ships with the Next.js migration.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:grid-cols-2">
                        <Field label="Meta title">
                            <Input
                                maxLength={70}
                                value={client.data.seo?.metaTitle ?? ""}
                                onChange={(e) =>
                                    updateData({ seo: { ...client.data.seo, metaTitle: e.target.value } })
                                }
                                placeholder={client.data.businessName}
                            />
                            <p className="mt-1 text-[11px] text-neutral-500">
                                {(client.data.seo?.metaTitle ?? "").length}/60 recommended
                            </p>
                        </Field>
                        <Field label="Keywords">
                            <Input
                                value={client.data.seo?.keywords ?? ""}
                                onChange={(e) =>
                                    updateData({ seo: { ...client.data.seo, keywords: e.target.value } })
                                }
                                placeholder="boutique hotel, spa, fine dining"
                            />
                        </Field>
                        <Field label="Meta description" className="md:col-span-2">
                            <Textarea
                                rows={3}
                                maxLength={200}
                                value={client.data.seo?.metaDescription ?? ""}
                                onChange={(e) =>
                                    updateData({ seo: { ...client.data.seo, metaDescription: e.target.value } })
                                }
                                placeholder="A short, compelling summary that appears under the title in Google results."
                            />
                            <p className="mt-1 text-[11px] text-neutral-500">
                                {(client.data.seo?.metaDescription ?? "").length}/160 recommended
                            </p>
                        </Field>
                        <Field label="Favicon URL">
                            <Input
                                value={client.data.seo?.favicon ?? ""}
                                onChange={(e) =>
                                    updateData({ seo: { ...client.data.seo, favicon: e.target.value } })
                                }
                                placeholder="https://.../favicon.ico"
                            />
                        </Field>
                        <Field label="Social share image (OG image)">
                            <Input
                                value={client.data.seo?.ogImage ?? ""}
                                onChange={(e) =>
                                    updateData({ seo: { ...client.data.seo, ogImage: e.target.value } })
                                }
                                placeholder="https://.../share.jpg (1200×630)"
                            />
                        </Field>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Google search preview</CardTitle>
                        <CardDescription>Real-time preview of how this page may appear in search results.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <GoogleSearchPreview
                            title={client.data.seo?.metaTitle || client.data.businessName}
                            description={
                                client.data.seo?.metaDescription ||
                                client.data.aboutText?.slice(0, 160) ||
                                "Add a meta description to control this snippet."
                            }
                            subdomain={client.subdomain}
                            favicon={client.data.seo?.favicon}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            {/* TAB 6 — DEVELOPER / ADVANCED CODE */}
            <TabsContent value="advanced" className="mt-6 space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Global Custom CSS</CardTitle>
                        <CardDescription>
                            Inject CSS that applies to the entire site. Use the cheat sheet below to target
                            elements without fighting Tailwind utility classes.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Textarea
                            spellCheck={false}
                            rows={14}
                            value={client.data.customCSS ?? ""}
                            onChange={(e) => updateData({ customCSS: e.target.value })}
                            placeholder={`/* Example */\n.hotel-title { letter-spacing: 0.02em; }\n#section-hero { filter: saturate(1.05); }`}
                            className="font-mono text-xs leading-relaxed bg-neutral-950 text-emerald-200 placeholder:text-emerald-200/30 border-neutral-800 focus-visible:ring-emerald-500/40"
                        />
                        <Accordion type="single" collapsible className="rounded-md border border-neutral-200 bg-white">
                            <AccordionItem value="cheat" className="border-0">
                                <AccordionTrigger className="px-4 text-sm font-medium hover:no-underline">
                                    View CSS Target Classes (Cheat Sheet)
                                </AccordionTrigger>
                                <AccordionContent className="px-4 pb-4">
                                    <div className="grid gap-4 md:grid-cols-2">
                                        <CheatSection title="Section wrappers (IDs)">
                                            <CheatRow code="#section-hero" label="Hero block wrapper" />
                                            <CheatRow code="#section-about" label="About block wrapper" />
                                            <CheatRow code="#section-rooms" label="Rooms block wrapper" />
                                            <CheatRow code="#section-amenities" label="Amenities wrapper" />
                                            <CheatRow code="#section-menu" label="Menu wrapper" />
                                            <CheatRow code="#section-gallery" label="Gallery wrapper" />
                                            <CheatRow code="#section-testimonials" label="Testimonials wrapper" />
                                            <CheatRow code="#section-location" label="Location wrapper" />
                                            <CheatRow code=".hotel-section" label="All section wrappers" />
                                        </CheatSection>
                                        <CheatSection title="Content hooks (classes)">
                                            <CheatRow code=".hotel-title" label="All headings (h1, h2, h3)" />
                                            <CheatRow code=".hotel-text" label="Subtitles & eyebrow text" />
                                            <CheatRow code=".hotel-btn-primary" label="Primary brand-color buttons" />
                                            <CheatRow code=".hotel-btn-secondary" label="Secondary buttons" />
                                            <CheatRow code=".hotel-card" label="Room / attraction cards" />
                                            <CheatRow code=".hotel-nav-link" label="Header navigation links" />
                                        </CheatSection>
                                    </div>
                                    <p className="mt-4 text-xs text-neutral-500">
                                        These classes are purely for targeting — they ship with no styles, so anything
                                        you write here cleanly overrides the defaults.
                                    </p>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Custom &lt;head&gt; Scripts</CardTitle>
                        <CardDescription>
                            Paste tracking pixels, analytics snippets, or verification meta tags. Injected into
                            the document &lt;head&gt; at runtime.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Textarea
                            spellCheck={false}
                            rows={14}
                            value={client.data.customHeadCode ?? ""}
                            onChange={(e) => updateData({ customHeadCode: e.target.value })}
                            placeholder={`<!-- Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXX');\n</script>`}
                            className="font-mono text-xs leading-relaxed bg-neutral-950 text-sky-200 placeholder:text-sky-200/30 border-neutral-800 focus-visible:ring-sky-500/40"
                        />
                        <p className="mt-3 text-xs text-neutral-500">
                            Tip: only include trusted code. Scripts run with the same privileges as the site.
                        </p>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    );
}

function CheatSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div>
            <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-neutral-500">{title}</p>
            <ul className="space-y-1.5">{children}</ul>
        </div>
    );
}

function CheatRow({ code, label }: { code: string; label: string }) {
    return (
        <li className="flex items-center justify-between gap-3 text-xs">
            <code className="rounded bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] text-neutral-900">{code}</code>
            <span className="text-neutral-600 text-right">{label}</span>
        </li>
    );
}

// ---------- Reusable editor pieces ----------
function Field({
    label,
    children,
    className = "",
}: {
    label: string;
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div className={`space-y-1.5 ${className}`}>
            <Label className="text-xs font-medium uppercase tracking-wider text-neutral-500">
                {label}
            </Label>
            {children}
        </div>
    );
}

type BgMode = "none" | "color" | "gradient" | "image";

function GoogleSearchPreview({
    title,
    description,
    subdomain,
    favicon,
}: {
    title: string;
    description: string;
    subdomain: string;
    favicon?: string;
}) {
    const host = `${subdomain || "your-site"}.lovable.app`;
    const displayTitle = (title || "Untitled").slice(0, 60);
    const displayDesc = description.length > 160 ? description.slice(0, 157) + "…" : description;
    return (
        <div className="rounded-lg border border-neutral-200 bg-white p-5 font-sans max-w-2xl">
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center overflow-hidden rounded-full border border-neutral-200 bg-white">
                    {favicon ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={favicon} alt="" className="h-full w-full object-cover" />
                    ) : (
                        <span className="text-[10px] font-semibold text-neutral-400">{host[0]?.toUpperCase()}</span>
                    )}
                </div>
                <div className="leading-tight">
                    <div className="text-[13px] text-neutral-900">{host.split(".")[0]}</div>
                    <div className="text-[12px] text-neutral-500">https://{host}</div>
                </div>
            </div>
            <h3 className="mt-2 text-[20px] leading-7 text-[#1a0dab] hover:underline cursor-pointer">
                {displayTitle}
            </h3>
            <p className="mt-1 text-[14px] leading-snug text-neutral-700">{displayDesc}</p>
        </div>
    );
}

function detectBgMode(v: string): BgMode {
    if (!v) return "none";
    if (/^(https?:|\/|data:)/i.test(v)) return "image";
    if (/gradient\s*\(/i.test(v)) return "gradient";
    return "color";
}

const GRADIENT_PRESETS = [
    { label: "Sunset", value: "linear-gradient(135deg, #fbc2eb 0%, #a6c1ee 100%)" },
    { label: "Ocean", value: "linear-gradient(135deg, #2af598 0%, #009efd 100%)" },
    { label: "Warm sand", value: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)" },
    { label: "Midnight", value: "linear-gradient(135deg, #0f2027 0%, #2c5364 100%)" },
    { label: "Soft mint", value: "linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)" },
];

function SectionBackgroundEditor({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
}) {
    const mode = detectBgMode(value);
    const previewStyle =
        mode === "image"
            ? { background: `url("${value}") center / cover no-repeat` }
            : value
                ? { background: value }
                : { background: "repeating-conic-gradient(#f3f4f6 0% 25%, #ffffff 0% 50%) 50% / 12px 12px" };

    return (
        <div className="space-y-2 rounded-lg border border-neutral-200 p-3">
            <div className="flex items-center justify-between gap-2">
                <Label className="text-xs font-medium uppercase tracking-wider text-neutral-500">{label}</Label>
                <div className="flex items-center gap-1">
                    {(["none", "color", "gradient", "image"] as BgMode[]).map((m) => (
                        <button
                            key={m}
                            type="button"
                            onClick={() => {
                                if (m === "none") onChange("");
                                else if (m === "color" && mode !== "color") onChange("#ffffff");
                                else if (m === "gradient" && mode !== "gradient") onChange(GRADIENT_PRESETS[0].value);
                                else if (m === "image" && mode !== "image") onChange("");
                            }}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider transition ${mode === m
                                ? "bg-neutral-900 text-white"
                                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                                }`}
                        >
                            {m}
                        </button>
                    ))}
                </div>
            </div>

            <div className="h-12 w-full overflow-hidden rounded-md border border-neutral-200" style={previewStyle as React.CSSProperties} />

            {mode === "color" && (
                <div className="flex items-center gap-2">
                    <input
                        type="color"
                        value={/^#([0-9a-f]{3}){1,2}$/i.test(value) ? value : "#ffffff"}
                        onChange={(e) => onChange(e.target.value)}
                        className="h-9 w-12 cursor-pointer rounded border border-neutral-200 bg-white p-1"
                        aria-label={`${label} color`}
                    />
                    <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder="#ffffff or any CSS color" className="font-mono text-xs" />
                </div>
            )}

            {mode === "gradient" && (
                <div className="space-y-2">
                    <div className="flex flex-wrap gap-1.5">
                        {GRADIENT_PRESETS.map((p) => (
                            <button
                                key={p.label}
                                type="button"
                                onClick={() => onChange(p.value)}
                                title={p.label}
                                className={`h-7 w-12 rounded border ${value === p.value ? "border-neutral-900 ring-2 ring-neutral-900/20" : "border-neutral-200"}`}
                                style={{ background: p.value }}
                            />
                        ))}
                    </div>
                    <Textarea
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder="linear-gradient(135deg, #f0f, #0ff)"
                        rows={2}
                        className="font-mono text-xs"
                    />
                </div>
            )}

            {mode === "image" && (
                <Input
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder="https://… or /path/image.jpg"
                    className="font-mono text-xs"
                />
            )}

            {mode === "none" && (
                <p className="text-[11px] text-neutral-500">Using the section's default background.</p>
            )}
        </div>
    );
}

function SectionOrderEditor({
    order,
    onChange,
}: {
    order: SectionKey[];
    onChange: (o: SectionKey[]) => void;
}) {
    const move = (idx: number, dir: -1 | 1) => {
        const next = [...order];
        const t = idx + dir;
        if (t < 0 || t >= next.length) return;
        [next[idx], next[t]] = [next[t], next[idx]];
        onChange(next);
    };
    const toggle = (key: SectionKey, included: boolean) => {
        if (included) onChange(order.filter((k) => k !== key));
        else onChange([...order, key]);
    };
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">Section order</CardTitle>
                <CardDescription>Reorder or hide sections from the page.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
                {order.map((key, idx) => (
                    <div
                        key={key}
                        className="flex items-center justify-between rounded-md border border-neutral-200 bg-white px-3 py-2"
                    >
                        <div className="flex items-center gap-3">
                            <span className="w-6 text-center text-xs text-neutral-400">{idx + 1}</span>
                            <span className="text-sm font-medium">{SECTION_LABEL[key]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <Button size="icon" variant="ghost" onClick={() => move(idx, -1)}>
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button size="icon" variant="ghost" onClick={() => move(idx, 1)}>
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Switch checked onCheckedChange={() => toggle(key, true)} />
                        </div>
                    </div>
                ))}
                {SECTION_KEYS.filter((k) => !order.includes(k)).length > 0 && (
                    <>
                        <Separator className="my-3" />
                        <p className="text-xs uppercase tracking-wider text-neutral-500">Hidden sections</p>
                        {SECTION_KEYS.filter((k) => !order.includes(k)).map((key) => (
                            <div
                                key={key}
                                className="flex items-center justify-between rounded-md border border-dashed border-neutral-200 px-3 py-2"
                            >
                                <span className="text-sm text-neutral-500">{SECTION_LABEL[key]}</span>
                                <Switch checked={false} onCheckedChange={() => toggle(key, false)} />
                            </div>
                        ))}
                    </>
                )}
            </CardContent>
        </Card>
    );
}

function ListEditor<T>({
    title,
    description,
    items,
    onChange,
    empty,
    render,
}: {
    title: string;
    description?: string;
    items: T[];
    onChange: (items: T[]) => void;
    empty: T;
    render: (item: T, set: (patch: Partial<T>) => void) => React.ReactNode;
}) {
    const setAt = (idx: number, patch: Partial<T>) => {
        const next = [...items];
        next[idx] = { ...next[idx], ...patch };
        onChange(next);
    };
    const move = (idx: number, dir: -1 | 1) => {
        const t = idx + dir;
        if (t < 0 || t >= items.length) return;
        const next = [...items];
        [next[idx], next[t]] = [next[t], next[idx]];
        onChange(next);
    };
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                <Button size="sm" variant="outline" onClick={() => onChange([...items, { ...empty }])} className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {items.length === 0 && (
                    <p className="rounded-md border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500">
                        No items yet.
                    </p>
                )}
                {items.map((item, idx) => (
                    <div
                        key={idx}
                        className="relative rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider text-neutral-600">
                                Item #{idx + 1}
                            </span>
                            <div className="flex items-center gap-1">
                                <Button size="icon" variant="ghost" onClick={() => move(idx, -1)} aria-label="Move up">
                                    <ArrowUp className="h-4 w-4" />
                                </Button>
                                <Button size="icon" variant="ghost" onClick={() => move(idx, 1)} aria-label="Move down">
                                    <ArrowDown className="h-4 w-4" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    onClick={() => onChange(items.filter((_, i) => i !== idx))}
                                    className="text-red-600 hover:bg-red-50 hover:text-red-700"
                                    aria-label="Remove item"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {render(item, (patch) => setAt(idx, patch))}
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function StringListEditor({
    title,
    description,
    items,
    onChange,
    placeholder,
}: {
    title: string;
    description?: string;
    items: string[];
    onChange: (items: string[]) => void;
    placeholder?: string;
}) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-base">{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </div>
                <Button size="sm" variant="outline" onClick={() => onChange([...items, ""])} className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                </Button>
            </CardHeader>
            <CardContent className="space-y-2">
                {items.length === 0 && (
                    <p className="rounded-md border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500">
                        No items yet.
                    </p>
                )}
                {items.map((val, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                        <Input
                            placeholder={placeholder}
                            value={val}
                            onChange={(e) => {
                                const next = [...items];
                                next[idx] = e.target.value;
                                onChange(next);
                            }}
                        />
                        <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => onChange(items.filter((_, i) => i !== idx))}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

function HeroImagesEditor({
    items,
    onChange,
}: {
    items: HeroImageInput[];
    onChange: (items: HeroImageInput[]) => void;
}) {
    const normalized = items.map(normalizeHeroImage);

    const update = (idx: number, patch: Partial<{ url: string; darkness: number }>) => {
        const next = normalized.map((it, i) => (i === idx ? { ...it, ...patch } : it));
        onChange(next);
    };

    const remove = (idx: number) => onChange(normalized.filter((_, i) => i !== idx));
    const add = () =>
        onChange([...normalized, { url: "", darkness: DEFAULT_HERO_DARKNESS }]);

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                    <CardTitle className="text-base">Hero images</CardTitle>
                    <CardDescription>
                        Add 1 image for a static hero, or 2+ for the slider. Adjust darkness per image so text stays legible.
                    </CardDescription>
                </div>
                <Button size="sm" variant="outline" onClick={add} className="gap-1">
                    <Plus className="h-4 w-4" /> Add
                </Button>
            </CardHeader>
            <CardContent className="space-y-4">
                {normalized.length === 0 && (
                    <p className="rounded-md border border-dashed border-neutral-200 p-4 text-center text-sm text-neutral-500">
                        No hero images yet.
                    </p>
                )}
                {normalized.map((item, idx) => (
                    <div
                        key={idx}
                        className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
                    >
                        <div className="flex items-center justify-between gap-3">
                            <Badge variant="secondary" className="font-mono text-[10px]">
                                Image #{idx + 1}
                            </Badge>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={() => remove(idx)}
                                className="h-8 w-8 text-red-600 hover:bg-red-50 hover:text-red-700"
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>

                        <div className="mt-3 grid gap-4 md:grid-cols-[160px_1fr]">
                            <div
                                className="relative h-28 w-full overflow-hidden rounded-md border border-neutral-200 bg-neutral-100"
                            >
                                {item.url ? (
                                    <>
                                        <img
                                            src={item.url}
                                            alt={`Hero preview ${idx + 1}`}
                                            className="h-full w-full object-cover"
                                        />
                                        <div
                                            className="pointer-events-none absolute inset-0 bg-black"
                                            style={{ opacity: item.darkness / 100 }}
                                        />
                                    </>
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center text-[11px] text-neutral-400">
                                        No URL
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <Label className="text-xs text-neutral-600">Image URL</Label>
                                    <Input
                                        placeholder="https://…"
                                        value={item.url}
                                        onChange={(e) => update(idx, { url: e.target.value })}
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center justify-between">
                                        <Label className="text-xs text-neutral-600">
                                            Darkness overlay
                                        </Label>
                                        <span className="font-mono text-xs text-neutral-500">
                                            {item.darkness}%
                                        </span>
                                    </div>
                                    <Slider
                                        value={[item.darkness]}
                                        min={0}
                                        max={100}
                                        step={1}
                                        onValueChange={([v]) => update(idx, { darkness: v })}
                                        className="mt-2"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </CardContent>
        </Card>
    );
}

// ---------- Pages & Menu Tab ----------
const SECTION_OPTIONS_FOR_EXTRAS: SectionKey[] = [
    "hero",
    "about",
    "rooms",
    "amenities",
    "menu",
    "videoHighlight",
    "gallery",
    "experiences",
    "testimonials",
    "faq",
    "location",
    "contact",
    "trustBadges",
];

function PagesAndMenuTab({
    data,
    updateData,
}: {
    data: HotelData;
    updateData: (patch: Partial<HotelData>) => void;
}) {
    const layout = data.siteLayout ?? "single-page";
    const isMulti = layout === "multi-page";
    const nav: SiteNavigation =
        data.navigation ?? getDefaultNavigation(data);
    const pagesConfig: PagesConfig = data.pagesConfig ?? {};

    const setNav = (patch: Partial<SiteNavigation>) =>
        updateData({ navigation: { ...nav, ...patch } });

    const setPage = (key: SubPageKey, patch: Partial<{ enabled: boolean; extraSections: SectionKey[] }>) => {
        const current = pagesConfig[key] ?? { enabled: false, extraSections: [] };
        updateData({
            pagesConfig: {
                ...pagesConfig,
                [key]: { ...current, ...patch },
            },
        });
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="text-base">Website layout mode</CardTitle>
                    <CardDescription>
                        Single-Page is one long scrolling page. Multi-Page activates dedicated routes
                        (e.g. <code className="rounded bg-neutral-100 px-1 py-0.5 text-xs">/about</code>) for the sections you turn on below.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <RadioGroup
                        value={layout}
                        onValueChange={(v) => updateData({ siteLayout: v as "single-page" | "multi-page" })}
                        className="grid gap-3 md:grid-cols-2"
                    >
                        <label
                            htmlFor="layout-single"
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${layout === "single-page" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"
                                }`}
                        >
                            <RadioGroupItem id="layout-single" value="single-page" className="mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Single-Page</p>
                                <p className="text-xs text-neutral-500">Everything on one scrolling page. Nav links jump to sections.</p>
                            </div>
                        </label>
                        <label
                            htmlFor="layout-multi"
                            className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 transition ${layout === "multi-page" ? "border-neutral-900 bg-neutral-50" : "border-neutral-200 hover:border-neutral-300"
                                }`}
                        >
                            <RadioGroupItem id="layout-multi" value="multi-page" className="mt-0.5" />
                            <div>
                                <p className="text-sm font-medium">Multi-Page</p>
                                <p className="text-xs text-neutral-500">Each enabled section gets its own route. Home shows a preview + Read More.</p>
                            </div>
                        </label>
                    </RadioGroup>
                </CardContent>
            </Card>

            <NavBuilderCard
                title="Header navigation"
                description="Links shown in the top header. Choose Hash for in-page anchors, Path for routed pages."
                links={nav.headerLinks}
                onChange={(headerLinks) => setNav({ headerLinks })}
            />

            <NavBuilderCard
                title="Footer navigation"
                description="Links shown in the footer. Mirror the header or curate a separate set."
                links={nav.footerLinks}
                onChange={(footerLinks) => setNav({ footerLinks })}
            />

            {isMulti && (
                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Page configurator</CardTitle>
                        <CardDescription>
                            Enable a dedicated route for any section, and optionally render additional sections inside that page.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {SUB_PAGE_KEYS.map((key) => {
                            const cfg = pagesConfig[key] ?? { enabled: false, extraSections: [] };
                            const extras = cfg.extraSections ?? [];
                            return (
                                <div key={key} className="rounded-xl border border-neutral-200 p-4">
                                    <div className="flex items-center justify-between gap-4">
                                        <div>
                                            <p className="text-sm font-medium capitalize">{key}</p>
                                            <p className="text-xs text-neutral-500">
                                                Route: <code className="rounded bg-neutral-100 px-1 py-0.5">/{key}</code>
                                            </p>
                                        </div>
                                        <Switch
                                            checked={cfg.enabled}
                                            onCheckedChange={(v) => setPage(key, { enabled: v })}
                                        />
                                    </div>
                                    {cfg.enabled && (
                                        <div className="mt-4">
                                            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-neutral-500">
                                                Extra sections to render on this page
                                            </p>
                                            <div className="flex flex-wrap gap-2">
                                                {SECTION_OPTIONS_FOR_EXTRAS.filter((s) => s !== (key as unknown as SectionKey)).map((s) => {
                                                    const active = extras.includes(s);
                                                    return (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() =>
                                                                setPage(key, {
                                                                    extraSections: active
                                                                        ? extras.filter((x) => x !== s)
                                                                        : [...extras, s],
                                                                })
                                                            }
                                                            className={`rounded-full border px-3 py-1 text-xs capitalize transition ${active
                                                                ? "border-neutral-900 bg-neutral-900 text-white"
                                                                : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-400"
                                                                }`}
                                                        >
                                                            {SECTION_LABEL[s] ?? s}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </CardContent>
                </Card>
            )}
        </>
    );
}

function NavBuilderCard({
    title,
    description,
    links,
    onChange,
}: {
    title: string;
    description: string;
    links: NavLink[];
    onChange: (links: NavLink[]) => void;
}) {
    const update = (i: number, patch: Partial<NavLink>) => {
        const next = links.slice();
        next[i] = { ...next[i], ...patch };
        onChange(next);
    };
    const remove = (i: number) => onChange(links.filter((_, idx) => idx !== i));
    const move = (i: number, dir: -1 | 1) => {
        const j = i + dir;
        if (j < 0 || j >= links.length) return;
        const next = links.slice();
        [next[i], next[j]] = [next[j], next[i]];
        onChange(next);
    };
    const add = () =>
        onChange([
            ...links,
            { id: newNavLinkId(), label: "New link", href: "#section", type: "hash" },
        ]);

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
                {links.length === 0 && (
                    <p className="text-xs text-neutral-500">No links yet — add your first one below.</p>
                )}
                {links.map((link, i) => (
                    <div
                        key={link.id}
                        className="grid gap-2 rounded-lg border border-neutral-200 p-3 md:grid-cols-[1fr_1.5fr_120px_auto]"
                    >
                        <Input
                            placeholder="Label"
                            value={link.label}
                            onChange={(e) => update(i, { label: e.target.value })}
                        />
                        <Input
                            placeholder={link.type === "hash" ? "#section-id" : "/path"}
                            value={link.href}
                            onChange={(e) => update(i, { href: e.target.value })}
                        />
                        <Select
                            value={link.type}
                            onValueChange={(v) => update(i, { type: v as "hash" | "path" })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="hash">Hash (#)</SelectItem>
                                <SelectItem value="path">Path (/)</SelectItem>
                            </SelectContent>
                        </Select>
                        <div className="flex items-center gap-1">
                            <Button variant="ghost" size="icon" onClick={() => move(i, -1)} disabled={i === 0}>
                                <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => move(i, 1)}
                                disabled={i === links.length - 1}
                            >
                                <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" onClick={() => remove(i)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                <Button variant="outline" size="sm" onClick={add} className="gap-2">
                    <Plus className="h-4 w-4" /> Add link
                </Button>
            </CardContent>
        </Card>
    );
}
