export type CartItem = {
  id: number;
  name: string;
  slug: string;
  price: number;
  quantity: number;
  imageUrl?: string;
};

export type ThemeSettings = {
  storeName: string;
  logoUrl: string | null;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroTitle: string;
  heroSubtitle: string;
  whatsappNumber: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
};
