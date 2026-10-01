import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const categories = [
  {
    name: "Running",
    slug: "running",
    description: "Modelos ligeros para entrenamiento y largas distancias.",
  },
  {
    name: "Casual",
    slug: "casual",
    description: "Diseños lifestyle para uso diario con estilo urbano.",
  },
  {
    name: "Basketball",
    slug: "basketball",
    description: "Soporte y tracción para alto rendimiento en la cancha.",
  },
  {
    name: "Skate",
    slug: "skate",
    description: "Resistencia y control para sesiones de calle y parque.",
  },
];

async function main() {
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  await prisma.storeSettings.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      storeName: "Tienda X",
      primaryColor: "#A3E635",
      secondaryColor: "#38BDF8",
      accentColor: "#F97316",
      whatsappNumber: "573001112233",
      instagramUrl: "https://instagram.com/tiendax",
      heroTitle: "Tenis con identidad propia",
      heroSubtitle:
        "Descubre pares exclusivos para correr, moverte y destacar en la calle.",
    },
  });

  await prisma.category.createMany({ data: categories });
  const cats = await prisma.category.findMany();
  const getCat = (slug: string) => cats.find((c) => c.slug === slug)!;

  const products = [
    {
      name: "AeroPulse 9",
      slug: "aeropulse-9",
      price: "649900",
      description:
        "Tenis de running con espuma reactiva y upper transpirable para ritmos rápidos.",
      features: [
        "Drop de 8 mm",
        "Malla técnica ultra ligera",
        "Suela con agarre en asfalto húmedo",
      ],
      categoryId: getCat("running").id,
      images: ["/uploads/demo/aeropulse-1.svg", "/uploads/demo/aeropulse-2.svg", "/uploads/demo/aeropulse-3.svg"],
    },
    {
      name: "Streetform LX",
      slug: "streetform-lx",
      price: "529900",
      description:
        "Silueta low-top con amortiguación suave y acabados premium para uso diario.",
      features: [
        "Plantilla memory foam",
        "Cuero sintético resistente",
        "Colorway edición urbana",
      ],
      categoryId: getCat("casual").id,
      images: ["/uploads/demo/streetform-1.svg", "/uploads/demo/streetform-2.svg"],
    },
    {
      name: "Court Voltage Pro",
      slug: "court-voltage-pro",
      price: "719900",
      description:
        "Máxima estabilidad lateral para cambios de dirección agresivos en básquet.",
      features: [
        "Placa estabilizadora media",
        "Suela con patrón multidireccional",
        "Refuerzo de talón moldeado",
      ],
      categoryId: getCat("basketball").id,
      images: ["/uploads/demo/voltage-1.svg", "/uploads/demo/voltage-2.svg", "/uploads/demo/voltage-3.svg"],
    },
    {
      name: "Grind Axis",
      slug: "grind-axis",
      price: "489900",
      description:
        "Construcción robusta para skate con excelente board feel y durabilidad.",
      features: [
        "Goma vulcanizada",
        "Puntera reforzada doble capa",
        "Lengüeta acolchada",
      ],
      categoryId: getCat("skate").id,
      images: ["/uploads/demo/grind-1.svg", "/uploads/demo/grind-2.svg"],
    },
  ];

  for (const item of products) {
    const product = await prisma.product.create({
      data: {
        name: item.name,
        slug: item.slug,
        price: item.price,
        description: item.description,
        features: item.features,
        categoryId: item.categoryId,
      },
    });

    await prisma.productImage.createMany({
      data: item.images.map((url, index) => ({
        url,
        order: index,
        productId: product.id,
      })),
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
