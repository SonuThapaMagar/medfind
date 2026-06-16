import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log("Seeding db");

  // --- USERS first (no dependencies on other tables) ---
  const hashedPassword = await bcrypt.hash("Password@123", 10);

  const adminUser = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@medfind.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  const ownerUser = await prisma.user.create({
    data: {
      name: "Ram Kumar",
      email: "ram@pharmacy.com",
      password: hashedPassword,
      role: "PHARMACY_OWNER",
    },
  });

  console.log("Created users:", adminUser.email, ownerUser.email);

  //create medicine
  const [
    paracetamol,
    amoxicillin,
    metformin,
    cetirizine,
    omeprazole,
    azithromycin,
    ibuprofen,
    atorvastatin,
    vitaminC,
    zinc,
    amlodipine,
    losartan,
    salbutamol,
    diclofenac,
    ranitidine,
    doxycycline,
    fluconazole,
    prednisolone,
    aspirin,
    folic,
  ] = await Promise.all([
    prisma.medicine.create({
      data: {
        name: "Panadol",
        genericName: "Paracetamol",
        category: "Painkiller",
        unit: "tablet",
        description: "Used to treat pain and fever",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Amoxil",
        genericName: "Amoxicillin",
        category: "Antibiotic",
        unit: "capsule",
        description: "Broad-spectrum antibiotic",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Glucophage",
        genericName: "Metformin",
        category: "Antidiabetic",
        unit: "tablet",
        description: "Used to treat type 2 diabetes",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Zyrtec",
        genericName: "Cetirizine",
        category: "Antihistamine",
        unit: "tablet",
        description: "Allergy relief",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Losec",
        genericName: "Omeprazole",
        category: "Antacid",
        unit: "capsule",
        description: "Acid reflux treatment",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Zithromax",
        genericName: "Azithromycin",
        category: "Antibiotic",
        unit: "tablet",
        description: "Bacterial infection treatment",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Brufen",
        genericName: "Ibuprofen",
        category: "Painkiller",
        unit: "tablet",
        description: "Anti-inflammatory painkiller",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Lipitor",
        genericName: "Atorvastatin",
        category: "Cholesterol",
        unit: "tablet",
        description: "Cholesterol management",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Celin",
        genericName: "Vitamin C",
        category: "Vitamin",
        unit: "tablet",
        description: "Immune system support",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Zincovit",
        genericName: "Zinc",
        category: "Vitamin",
        unit: "tablet",
        description: "Zinc supplement",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Norvasc",
        genericName: "Amlodipine",
        category: "Antihypertensive",
        unit: "tablet",
        description: "Blood pressure control",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Cozaar",
        genericName: "Losartan",
        category: "Antihypertensive",
        unit: "tablet",
        description: "Hypertension treatment",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Ventolin",
        genericName: "Salbutamol",
        category: "Respiratory",
        unit: "inhaler",
        description: "Asthma relief",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Voveran",
        genericName: "Diclofenac",
        category: "Painkiller",
        unit: "tablet",
        description: "Joint pain relief",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Zantac",
        genericName: "Ranitidine",
        category: "Antacid",
        unit: "tablet",
        description: "Stomach acid reduction",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Vibramycin",
        genericName: "Doxycycline",
        category: "Antibiotic",
        unit: "capsule",
        description: "Bacterial and parasitic infections",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Diflucan",
        genericName: "Fluconazole",
        category: "Antifungal",
        unit: "capsule",
        description: "Fungal infection treatment",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Deltacortril",
        genericName: "Prednisolone",
        category: "Steroid",
        unit: "tablet",
        description: "Inflammation and allergy",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Disprin",
        genericName: "Aspirin",
        category: "Painkiller",
        unit: "tablet",
        description: "Pain relief and blood thinner",
      },
    }),
    prisma.medicine.create({
      data: {
        name: "Folicare",
        genericName: "Folic Acid",
        category: "Vitamin",
        unit: "tablet",
        description: "Prenatal and anemia support",
      },
    }),
  ]);

  //create pharmacy
  const pharmacies = [
    {
      name: "New Road Pharmacy",
      email: "newroad@gmail.com",
      address: "New Road, Kathmandu",
      lat: 27.7041,
      lng: 85.3145,
      phone: "01-4221234",
      isOpen: true,
    },
    {
      name: "Baneshwor Medical",
      email: "baneshwor@gmail.com",
      address: "Baneshwor, Kathmandu",
      lat: 27.6936,
      lng: 85.3414,
      phone: "01-4781234",
      isOpen: true,
    },
    {
      name: "Thamel Pharmacy",
      email: "thamel@gmail.com",
      address: "Thamel, Kathmandu",
      lat: 27.7154,
      lng: 85.3123,
      phone: "01-4700234",
      isOpen: false,
    },
    {
      name: "Lazimpat Medical",
      email: "lazimpat@gmail.com",
      address: "Lazimpat, Kathmandu",
      lat: 27.7218,
      lng: 85.3192,
      phone: "01-4412345",
      isOpen: true,
    },
    {
      name: "Patan Pharmacy",
      email: "patan@gmail.com",
      address: "Lagankhel, Lalitpur",
      lat: 27.6674,
      lng: 85.3167,
      phone: "01-5523456",
      isOpen: true,
    },
    {
      name: "Chabahil Drug House",
      email: "chabahil@gmail.com",
      address: "Chabahil, Kathmandu",
      lat: 27.7189,
      lng: 85.3468,
      phone: "01-4467890",
      isOpen: true,
    },
    {
      name: "Koteshwor Medical",
      email: "koteshwor@gmail.com",
      address: "Koteshwor, Kathmandu",
      lat: 27.6862,
      lng: 85.3535,
      phone: "01-4589012",
      isOpen: false,
    },
    {
      name: "Balaju Health Store",
      email: "balaju@gmail.com",
      address: "Balaju, Kathmandu",
      lat: 27.7312,
      lng: 85.2989,
      phone: "01-4312345",
      isOpen: true,
    },
    {
      name: "Bouddha Pharmacy",
      email: "bouddha@gmail.com",
      address: "Bouddha, Kathmandu",
      lat: 27.7215,
      lng: 85.3621,
      phone: "01-4478901",
      isOpen: true,
    },
    {
      name: "Maharajgunj Medical",
      email: "maharajgunj@gmail.com",
      address: "Maharajgunj, Kathmandu",
      lat: 27.7362,
      lng: 85.3321,
      phone: "01-4423456",
      isOpen: true,
    },
    {
      name: "Jawalakhel Drug Store",
      email: "jawalakhel@gmail.com",
      address: "Jawalakhel, Lalitpur",
      lat: 27.6712,
      lng: 85.3089,
      phone: "01-5534567",
      isOpen: true,
    },
    {
      name: "Kalanki Pharmacy",
      email: "kalanki@gmail.com",
      address: "Kalanki, Kathmandu",
      lat: 27.6942,
      lng: 85.2812,
      phone: "01-4256789",
      isOpen: false,
    },
    {
      name: "Kirtipur Medical Hall",
      email: "kirtipur@gmail.com",
      address: "Kirtipur, Kathmandu",
      lat: 27.6789,
      lng: 85.2798,
      phone: "01-4334567",
      isOpen: true,
    },
    {
      name: "Kupondole Health Center",
      email: "kupondole@gmail.com",
      address: "Kupondole, Lalitpur",
      lat: 27.6834,
      lng: 85.3134,
      phone: "01-5545678",
      isOpen: true,
    },
    {
      name: "Ratnapark Pharmacy",
      email: "ratnapark@gmail.com",
      address: "Ratna Park, Kathmandu",
      lat: 27.7089,
      lng: 85.3145,
      phone: "01-4211234",
      isOpen: true,
    },
  ];
  // Create pharmacies (real-ish Kathmandu locations)
  const createPharmacies = await Promise.all(
    pharmacies.map((p) => prisma.pharmacy.create({ data: p })),
  );
  console.log("Created 15 pharmacies");

  await prisma.pharmacyOwner.create({
    data: {
      userId: ownerUser.id,
      pharmacyId: createPharmacies[1].id,
    },
  });
  console.log("Linked Ram Kumar to Baneshwor Medical");

  // Create inventory
  const allMeds = [
    paracetamol,
    amoxicillin,
    metformin,
    cetirizine,
    omeprazole,
    azithromycin,
    ibuprofen,
    atorvastatin,
    vitaminC,
    zinc,
    amlodipine,
    losartan,
    salbutamol,
    diclofenac,
    ranitidine,
    doxycycline,
    fluconazole,
    prednisolone,
    aspirin,
    folic,
  ];

  const inventoryData = [];

  for (let pi = 0; pi < createPharmacies.length; pi++) {
    // Each pharmacy stocks 6-10 random medicines
    const count = 6 + (pi % 5);
    const shuffled = [...allMeds]
      .sort(() => Math.random() - 0.5)
      .slice(0, count);

    for (const med of shuffled) {
      inventoryData.push({
        pharmacyId: createPharmacies[pi].id,
        medicineId: med.id,
        quantity: Math.floor(Math.random() * 200) + 10,
        price: Math.floor(Math.random() * 200) + 8,
      });
    }
  }

  await prisma.inventory.createMany({ data: inventoryData });

  console.log(`Created ${inventoryData.length} inventory records`);
  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
