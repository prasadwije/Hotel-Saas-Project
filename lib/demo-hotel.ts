import type { HotelData } from "@/components/template/HotelTemplate";

export const demoHotelData: HotelData = {
  businessName: "Maison Azure",
  primaryColor: "#0f766e",
  heroTitle: "A quiet retreat by the sea",
  heroSubtitle:
    "Boutique rooms and a seasonal kitchen on the Côte d'Azur — five minutes from the old port.",
  heroImages: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1551776235-dde6d482980b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1920&q=80",
  ],
  heroTransition: "fade",
  aboutText:
    "Maison Azure is a fourteen-room hideaway run by the Lefèvre family since 1998. Our kitchen draws from the morning catch and the kitchen garden behind the house, and our terrace catches the last of the day's sun. Come for an evening, stay for the week.",
  menuItems: [
    { name: "Truffle Risotto", price: "€24", description: "Carnaroli, aged parmesan, black winter truffle.", image: "https://images.unsplash.com/photo-1633964913295-ceb43826a07f?auto=format&fit=crop&w=900&q=80" },
    { name: "Line-caught Sea Bass", price: "€32", description: "Fennel confit, citrus beurre blanc, samphire.", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=80" },
    { name: "Provençal Lamb", price: "€36", description: "Slow-roasted shoulder, rosemary jus, ratatouille.", image: "https://images.unsplash.com/photo-1514516345957-556ca7d90a29?auto=format&fit=crop&w=900&q=80" },
    { name: "Garden Salad", price: "€14", description: "Heirloom tomatoes, burrata, basil oil.", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=900&q=80" },
    { name: "Bouillabaisse", price: "€38", description: "Saffron broth, rouille, grilled sourdough.", image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80" },
    { name: "Tarte au Citron", price: "€12", description: "Menton lemon, torched meringue, shortbread.", image: "https://images.unsplash.com/photo-1464195244916-405fa0a82545?auto=format&fit=crop&w=900&q=80" },
  ],
  galleryImages: [
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1551776235-dde6d482980b?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=900&q=80",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
  ],
  address: "12 Rue des Oliviers\n06400 Cannes, France",
  mapEmbedUrl:
    "https://www.google.com/maps?q=Cannes,France&output=embed",
  phone: "+33 1 23 45 67 89",
  whatsapp: "33123456789",
  socialLinks: {
    facebook: "https://facebook.com/maisonazure",
    instagram: "https://instagram.com/maisonazure",
  },
  specialOffer: "Weekend Getaway — 20% off stays of 2 nights or more.",
  rooms: [
    {
      name: "Garden Room",
      price: "€180",
      description: "A serene retreat overlooking the kitchen garden, with hand-finished oak floors and a private terrace.",
      image:
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=900&q=80",
      features: ["Queen Bed", "Garden View", "Free Wi-Fi", "Rain Shower"],
    },
    {
      name: "Sea View Suite",
      price: "€320",
      description: "Floor-to-ceiling windows framing the Mediterranean, paired with a deep soaking tub and lounge area.",
      image:
        "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=900&q=80",
      features: ["King Bed", "Sea View", "Bathtub", "Lounge"],
    },
    {
      name: "Maison Penthouse",
      price: "€520",
      description: "Our top-floor flagship with a wraparound terrace, fireplace, and dedicated concierge service.",
      image:
        "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=900&q=80",
      features: ["King Bed", "Terrace", "Fireplace", "Concierge"],
    },
  ],
  amenities: [
    "Free Wi-Fi",
    "Pool",
    "Spa",
    "Restaurant",
    "Free Parking",
    "Breakfast",
    "Gym",
    "Bar",
    "Air Conditioning",
    "Pet Friendly",
    "Bathtub",
    "TV",
  ],
  testimonials: [
    {
      author: "Élodie M., Paris",
      text: "The most thoughtful stay we've had on the coast. Every detail felt considered, every meal a quiet revelation.",
      rating: 5,
    },
    {
      author: "James R., London",
      text: "From the welcome on arrival to the morning espresso, Maison Azure feels like a friend's elegant country home.",
      rating: 5,
    },
    {
      author: "Sofia L., Milan",
      text: "A genuinely beautiful place, and a kitchen that respects its ingredients. We've already booked our return.",
      rating: 5,
    },
  ],
  videoUrl: "https://www.youtube.com/embed/ScMzIvxBSi4",
  enableContactForm: true,
  contactEmail: "hello@maisonazure.com",
  experiences: [
    {
      title: "Old Port of Cannes",
      distance: "5 min walk",
      description: "Stroll the historic harbour, lined with sailboats, cafés, and morning fish markets.",
      image: "https://images.unsplash.com/photo-1507666664345-c49223375e33?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Île Sainte-Marguerite",
      distance: "15 min by ferry",
      description: "Pine-shaded trails, swimming coves, and the legendary Fort Royal across the bay.",
      image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Le Suquet Old Town",
      distance: "10 min walk",
      description: "Cobbled lanes climbing to panoramic views over the Bay of Cannes and the Estérel.",
      image: "https://images.unsplash.com/photo-1499678329028-101435549a4e?auto=format&fit=crop&w=900&q=80",
    },
    {
      title: "Marché Forville",
      distance: "7 min walk",
      description: "Provence's celebrated daily market — herbs, cheeses, fresh produce, and Mediterranean catch.",
      image: "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
    },
  ],
  trustBadges: [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9c/The_New_York_Times_logo.png/640px-The_New_York_Times_logo.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/0/05/Conde_Nast_Traveler_logo.svg/640px-Conde_Nast_Traveler_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/5/53/Forbes_logo.svg/640px-Forbes_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/47/Vogue_logo.svg/640px-Vogue_logo.svg.png",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/77/Financial_Times_corporate_logo.svg/640px-Financial_Times_corporate_logo.svg.png",
  ],
  faqs: [
    {
      question: "What time is check-in and check-out?",
      answer: "Check-in is from 3:00 PM and check-out is by 11:00 AM. Early arrival and late departure can usually be arranged on request.",
    },
    {
      question: "Are pets welcome?",
      answer: "Yes — well-behaved dogs are welcome in selected rooms for a small nightly fee. Please let us know in advance so we can prepare bedding and bowls.",
    },
    {
      question: "Do you offer airport transfers?",
      answer: "We are happy to arrange a private car from Nice Côte d'Azur airport. Reach out at least 48 hours before arrival to confirm.",
    },
    {
      question: "Is breakfast included?",
      answer: "A continental breakfast served on the terrace is included with every stay. À la carte options are available from the kitchen.",
    },
    {
      question: "What is your cancellation policy?",
      answer: "Reservations may be cancelled free of charge up to 7 days before arrival. Within 7 days, the first night is non-refundable.",
    },
  ],
  mobileLayouts: {
    rooms: "carousel",
    menu: "stack",
    testimonials: "carousel",
  },
  layoutConfig: {
    hero: "v1",
    about: "v1",
    rooms: "v1",
    amenities: "v1",
    menu: "v1",
    videoHighlight: "v1",
    gallery: "v1",
    testimonials: "v1",
    faq: "v1",
    location: "v1",
    footer: "v1",
    stickyBar: "v1",
    experiences: "v1",
    contact: "v1",
    trustBadges: "v1",
  },
  sectionOrder: [
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
  ],
};

