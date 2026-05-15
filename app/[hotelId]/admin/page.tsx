"use client";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
    Hotel,
    Settings as SettingsIcon,
    LogOut,
    Plus,
    Pencil,
    Trash2,
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
    SectionKey,
} from "@/components/template/blocks/shared";
import { DEFAULT_HERO_DARKNESS, SUB_PAGE_KEYS } from "@/components/template/blocks/shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { HotelTemplate } from "@/components/template/HotelTemplate";

type ClientStatus = "active" | "inactive";
type Client = {
    id: string;
    subdomain: string;
    status: ClientStatus;
    data: HotelData;
};

const ALL_LAYOUT_KEYS = [
    "hero", "header", "about", "rooms", "amenities", "menu",
    "videoHighlight", "gallery", "experiences", "testimonials",
    "faq", "location", "contact", "trustBadges", "footer", "stickyBar",
] as const;

const SECTION_KEYS: SectionKey[] = [
    "hero", "trustBadges", "about", "rooms", "amenities", "menu",
    "videoHighlight", "gallery", "experiences", "testimonials",
    "faq", "location", "contact",
];

function emptyHotel(name = "New Hotel"): HotelData {
    return {
        businessName: name,
        primaryColor: "#0f766e",
        heroTitle: "A new chapter awaits",
        heroSubtitle: "Edit this subtitle from the Content tab.",
        heroImages: [],
        heroTransition: "fade",
        aboutText: "Tell your guests the story behind your property.",
        menuItems: [],
        galleryImages: [],
        address: "Add your address",
        phone: "+1 555 0000",
        whatsapp: "15550000",
        socialLinks: {},
        rooms: [],
        amenities: [],
        testimonials: [],
        faqs: [],
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

export default function AdminPage() {
    const params = useParams<{ hotelId: string }>();
    const hotelId = params.hotelId;

    const [clients, setClients] = useState<Client[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeNav, setActiveNav] = useState<"clients" | "settings">("clients");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [search, setSearch] = useState("");
    const [isSuperAdmin, setIsSuperAdmin] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            const supabase = createClient();
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) { window.location.href = '/login'; return; }

            const { data: profile } = await supabase
                .from('profiles').select('role').eq('id', session.user.id).single();

            const role = profile?.role;
            const isSuper = role === 'super_admin';
            setIsSuperAdmin(isSuper);

            if (isSuper) {
                // Super admin sees all hotels
                const { data } = await supabase.from('hotels').select('*');
                if (data) setClients(data.map((h: any) => ({
                    id: h.id,
                    subdomain: h.subdomain || "",
                    status: (h.status || "active") as ClientStatus,
                    data: h.site_config || emptyHotel(),
                })));
            } else if (role === 'hotel_admin') {
                // Hotel admin only sees their own hotel
                const { data } = await supabase
                    .from('hotels').select('*').eq('id', hotelId).single();
                if (data) setClients([{
                    id: data.id,
                    subdomain: data.subdomain || "",
                    status: (data.status || "active") as ClientStatus,
                    data: data.site_config || emptyHotel(),
                }]);
                // Direct to editor for their hotel
                setEditingId(hotelId);
            } else {
                window.location.href = '/login';
                return;
            }
            setLoading(false);
        };
        fetchData();
    }, [hotelId]);

    const editingClient = useMemo(
        () => clients.find((c) => c.id === editingId) ?? null,
        [clients, editingId],
    );

    const upsertClient = async (updated: Client) => {
        const supabase = createClient();
        setClients((prev) => {
            const idx = prev.findIndex((c) => c.id === updated.id);
            if (idx === -1) return [...prev, updated];
            const copy = [...prev]; copy[idx] = updated; return copy;
        });
        const isNew = updated.id.startsWith('c');
        if (isNew) {
            const { data } = await supabase.from('hotels').insert({
                business_name: updated.data.businessName,
                subdomain: updated.subdomain,
                site_config: updated.data,
            }).select().single();
            if (data) setClients((prev) => prev.map(c => c.id === updated.id ? { ...c, id: data.id } : c));
        } else {
            await supabase.from('hotels').update({
                business_name: updated.data.businessName,
                subdomain: updated.subdomain,
                site_config: updated.data,
            }).eq('id', updated.id);
        }
    };

    const deleteClient = async (id: string) => {
        const supabase = createClient();
        setClients((prev) => prev.filter((c) => c.id !== id));
        if (!id.startsWith('c')) await supabase.from('hotels').delete().eq('id', id);
    };

    const handleAddNew = () => {
        const id = `c${Date.now()}`;
        const fresh: Client = { id, subdomain: "newclient", status: "active", data: emptyHotel("New Client") };
        upsertClient(fresh);
        setEditingId(id);
    };

    if (loading) return <div className="p-8 flex justify-center">Loading...</div>;

    const filtered = clients.filter(
        (c) =>
            c.data.businessName.toLowerCase().includes(search.toLowerCase()) ||
            c.subdomain.toLowerCase().includes(search.toLowerCase()),
    );

    if (editingClient) {
        return (
            <EditorWorkspace
                key={editingClient.id}
                client={editingClient}
                isSuperAdmin={isSuperAdmin}
                onSave={(c) => { upsertClient(c); if (isSuperAdmin) setEditingId(null); }}
                onClose={() => isSuperAdmin ? setEditingId(null) : undefined}
                onDelete={() => { deleteClient(editingClient.id); setEditingId(null); }}
            />
        );
    }

    return (
        <div className="flex min-h-screen w-full bg-neutral-50 text-neutral-900">
            <aside className="hidden w-64 shrink-0 flex-col border-r border-neutral-200 bg-white md:flex">
                <div className="flex h-16 items-center gap-2 border-b border-neutral-200 px-5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-neutral-900 text-white">
                        <Hotel className="h-4 w-4" />
                    </div>
                    <div>
                        <p className="text-sm font-semibold leading-tight">Agency OS</p>
                        <p className="text-[11px] text-neutral-500">Hotel websites</p>
                    </div>
                </div>
                <nav className="flex flex-1 flex-col gap-1 p-3">
                    <SidebarItem icon={<Hotel className="h-4 w-4" />} label="Hotels / Clients" active={activeNav === "clients"} onClick={() => setActiveNav("clients")} />
                    <Link href={`/${hotelId}/bookingsmanagement`} className="flex items-center gap-2 rounded-md px-3 py-2 text-sm text-neutral-600 transition hover:bg-neutral-100">
                        <CalendarRange className="h-4 w-4" /> Bookings (PMS)
                    </Link>
                    <SidebarItem icon={<SettingsIcon className="h-4 w-4" />} label="Settings" active={activeNav === "settings"} onClick={() => setActiveNav("settings")} />
                </nav>
                <div className="border-t border-neutral-200 p-3">
                    <SidebarItem icon={<LogOut className="h-4 w-4" />} label="Logout" onClick={async () => { await createClient().auth.signOut(); window.location.href = '/login'; }} />
                </div>
            </aside>
            <main className="flex-1">
                <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-neutral-200 bg-white/80 px-6 backdrop-blur">
                    <div>
                        <h1 className="text-base font-semibold tracking-tight">{activeNav === "settings" ? "Settings" : "Clients"}</h1>
                        <p className="text-xs text-neutral-500">{activeNav === "settings" ? "Workspace preferences." : `${clients.length} total clients`}</p>
                    </div>
                    {activeNav === "clients" && isSuperAdmin && (
                        <Button onClick={handleAddNew} className="gap-2"><Plus className="h-4 w-4" /> Add new client</Button>
                    )}
                </header>
                <div className="p-6">
                    {activeNav === "settings" ? (
                        <Card><CardHeader><CardTitle className="text-base">Workspace settings</CardTitle><CardDescription>Agency-wide preferences (coming soon).</CardDescription></CardHeader><CardContent className="text-sm text-neutral-600">This section will hold agency branding, default templates, and team access.</CardContent></Card>
                    ) : (
                        <Card className="border-neutral-200 shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between gap-4 space-y-0">
                                <div><CardTitle className="text-base">All clients</CardTitle><CardDescription>Each client maps to a published hotel website.</CardDescription></div>
                                <div className="relative w-72">
                                    <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-neutral-400" />
                                    <Input placeholder="Search clients or subdomains" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-8" />
                                </div>
                            </CardHeader>
                            <CardContent className="p-0">
                                <Table>
                                    <TableHeader><TableRow><TableHead>Business name</TableHead><TableHead>Subdomain</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                                    <TableBody>
                                        {filtered.length === 0 && <TableRow><TableCell colSpan={4} className="py-10 text-center text-sm text-neutral-500">No clients match your search.</TableCell></TableRow>}
                                        {filtered.map((c) => (
                                            <TableRow key={c.id}>
                                                <TableCell><div className="flex items-center gap-3"><div className="h-8 w-8 rounded-md" style={{ background: c.data.primaryColor }} /><div><p className="font-medium">{c.data.businessName}</p><p className="text-xs text-neutral-500">{c.data.heroTitle}</p></div></div></TableCell>
                                                <TableCell><a className="inline-flex items-center gap-1 text-sm text-neutral-700 hover:text-neutral-900" href={`https://${c.subdomain}.${process.env.NEXT_PUBLIC_SAAS_DOMAIN || 'hotelsaas.com'}`} target="_blank" rel="noreferrer">{c.subdomain}<ExternalLink className="h-3 w-3" /></a></TableCell>
                                                <TableCell><Badge variant={c.status === "active" ? "default" : "secondary"} className={c.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-neutral-200 text-neutral-700"}>{c.status === "active" ? "Active" : "Inactive"}</Badge></TableCell>
                                                <TableCell className="text-right"><div className="flex justify-end gap-2"><Button size="sm" variant="outline" onClick={() => setEditingId(c.id)} className="gap-1"><Pencil className="h-3.5 w-3.5" /> Edit</Button>{isSuperAdmin && <Button size="sm" variant="ghost" onClick={() => deleteClient(c.id)} className="gap-1 text-red-600 hover:bg-red-50 hover:text-red-700"><Trash2 className="h-3.5 w-3.5" /></Button>}</div></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </main>
        </div>
    );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode; label: string; active?: boolean; onClick: () => void }) {
    return (
        <button onClick={onClick} className={`flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition ${active ? "bg-neutral-900 text-white" : "text-neutral-700 hover:bg-neutral-100"}`}>
            {icon}<span>{label}</span>
        </button>
    );
}

function EditorWorkspace({ client, isSuperAdmin, onSave, onClose, onDelete }: { client: Client; isSuperAdmin: boolean; onSave: (c: Client) => void; onClose: () => void; onDelete: () => void }) {
    const [draft, setDraft] = useState<Client>(client);
    const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
    useEffect(() => { setDraft(client); }, [client.id]);

    return (
        <div className="flex h-screen w-full overflow-hidden">
            <section className="flex h-full w-[35%] min-w-[380px] flex-col border-r border-neutral-200 bg-white">
                <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white/90 px-5 backdrop-blur">
                    <div className="flex items-center gap-2 min-w-0">
                        {isSuperAdmin && <Button variant="ghost" size="sm" onClick={onClose} className="gap-1"><ArrowLeft className="h-4 w-4" /> Back</Button>}
                        <div className="min-w-0"><p className="truncate text-sm font-semibold">{draft.data.businessName}</p><p className="truncate text-[11px] text-neutral-500">{draft.subdomain}</p></div>
                    </div>
                    <Button onClick={() => onSave(draft)} className="gap-2"><Save className="h-4 w-4" /> Save changes</Button>
                </header>
                <div className="flex-1 overflow-y-auto p-5">
                    <p className="text-sm text-neutral-500">Use the fields below to configure this hotel's website. Changes are saved to the database on "Save changes".</p>
                    <div className="mt-4 space-y-3">
                        <label className="block"><span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Business Name</span><Input className="mt-1" value={draft.data.businessName} onChange={(e) => setDraft(d => ({ ...d, data: { ...d.data, businessName: e.target.value } }))} /></label>
                        <label className="block"><span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Subdomain</span><Input className="mt-1" value={draft.subdomain} onChange={(e) => setDraft(d => ({ ...d, subdomain: e.target.value }))} /></label>
                        <label className="block"><span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Hero Title</span><Input className="mt-1" value={draft.data.heroTitle} onChange={(e) => setDraft(d => ({ ...d, data: { ...d.data, heroTitle: e.target.value } }))} /></label>
                        <label className="block"><span className="text-xs font-medium text-neutral-500 uppercase tracking-wide">Primary Color</span><input type="color" value={draft.data.primaryColor} onChange={(e) => setDraft(d => ({ ...d, data: { ...d.data, primaryColor: e.target.value } }))} className="mt-1 h-10 w-full cursor-pointer rounded-md border border-neutral-200" /></label>
                        {isSuperAdmin && <Button variant="destructive" size="sm" onClick={onDelete} className="w-full mt-4">Delete hotel</Button>}
                    </div>
                </div>
            </section>
            <section className="flex h-full flex-1 flex-col overflow-hidden bg-neutral-100">
                <div className="flex h-14 shrink-0 items-center justify-center border-b border-neutral-200 bg-white/70 px-4 backdrop-blur">
                    <ToggleGroup type="single" value={device} onValueChange={(v) => v && setDevice(v as "desktop" | "mobile")} className="rounded-full border border-neutral-200 bg-white p-1 shadow-sm">
                        <ToggleGroupItem value="desktop" className="gap-2 rounded-full px-4 data-[state=on]:bg-neutral-900 data-[state=on]:text-white"><Monitor className="h-4 w-4" /> Desktop</ToggleGroupItem>
                        <ToggleGroupItem value="mobile" className="gap-2 rounded-full px-4 data-[state=on]:bg-neutral-900 data-[state=on]:text-white"><Smartphone className="h-4 w-4" /> Mobile</ToggleGroupItem>
                    </ToggleGroup>
                </div>
                <div className={`relative isolate flex-1 overflow-y-auto bg-white transform-gpu ${device === "mobile" ? "flex items-start justify-center py-10" : ""}`}>
                    {device === "desktop" ? (
                        <HotelTemplate data={draft.data} />
                    ) : (
                        <div className="h-[800px] w-[390px] overflow-hidden rounded-[2.5rem] border-[10px] border-neutral-900 bg-white shadow-2xl">
                            <div className="h-full w-full overflow-y-auto"><HotelTemplate data={draft.data} /></div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
