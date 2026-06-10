import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Seeding db");

  // --- USERS first (no dependencies on other tables) ---
  const hashedPassword = await bcrypt.hash("password123", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@medfind.com" },
    update: {}, // If the user exists, do nothing
    create: {
      email: "admin@medfind.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  // const adminUser = await prisma.user.create({
  //   data: {
  //     name: "Admin User",
  //     email: "admin@medfind.com",
  //     password: hashedPassword,
  //     role: "ADMIN",
  //   },
  // });

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
  const paracetamol = await prisma.medicine.create({
    data: {
      name: "Panadol",
      genericName: "Paracetamol",
      category: "Painkiller",
      unit: "tablet",
      description: "Used to treat pain and fever",
    },
  });

  const amoxicillin = await prisma.medicine.create({
    data: {
      name: "Amoxil",
      genericName: "Amoxicillin",
      category: "Antibiotic",
      unit: "capsule",
      description: "Broad-spectrum antibiotic",
    },
  });

  const metformin = await prisma.medicine.create({
    data: {
      name: "Glucophage",
      genericName: "Metformin",
      category: "Antidiabetic",
      unit: "tablet",
      description: "Used to treat type 2 diabetes",
    },
  });

  //create pharmacy
  // Create pharmacies (real-ish Kathmandu locations)
  const pharmacy1 = await prisma.pharmacy.create({
    data: {
      name: "New Road Pharmacy",
      email: "newroad@gmail.com",
      address: "New Road, Kathmandu",
      lat: 27.7041,
      lng: 85.3145,
      phone: "01-4221234",
      isOpen: true,
    },
  });

  const pharmacy2 = await prisma.pharmacy.create({
    data: {
      name: "Baneshwor Medical",
      email: "baneshwor@gmail.com",
      address: "Baneshwor, Kathmandu",
      lat: 27.6936,
      lng: 85.3414,
      phone: "01-4781234",
      isOpen: true,
    },
  });

  const pharmacy3 = await prisma.pharmacy.create({
    data: {
      name: "Thamel Pharmacy",
      email: "thamel@gmail.com",
      address: "Thamel, Kathmandu",
      lat: 27.7154,
      lng: 85.3123,
      phone: "01-4700234",
      isOpen: false,
    },
  });

  // Create inventory
  await prisma.inventory.createMany({
    data: [
      {
        pharmacyId: pharmacy1.id,
        medicineId: paracetamol.id,
        quantity: 150,
        price: 12,
      },
      {
        pharmacyId: pharmacy1.id,
        medicineId: amoxicillin.id,
        quantity: 50,
        price: 85,
      },
      {
        pharmacyId: pharmacy2.id,
        medicineId: paracetamol.id,
        quantity: 200,
        price: 10,
      },
      {
        pharmacyId: pharmacy2.id,
        medicineId: metformin.id,
        quantity: 80,
        price: 45,
      },
      {
        pharmacyId: pharmacy3.id,
        medicineId: amoxicillin.id,
        quantity: 30,
        price: 90,
      },
      {
        pharmacyId: pharmacy3.id,
        medicineId: metformin.id,
        quantity: 60,
        price: 42,
      },
    ],
  });

  await prisma.pharmacyOwner.create({
    data: {
      userId: ownerUser.id,
      pharmacyId: pharmacy2.id,
    },
  });
  console.log("Linked Ram Kumar to Baneshwor Medical");

  console.log("Done! Created 3 medicines, 3 pharmacies, 6 inventory records.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
