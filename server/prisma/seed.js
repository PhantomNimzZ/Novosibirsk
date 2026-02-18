// server/prisma/seed.js
// ✅ Fixed: ESM imports (package.json has "type": "module")
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Seed trains
  const trains = [
    { id: 1, name: "Blue Train", number: "BT001", seats: 100, price: 850 },
    { id: 2, name: "Shosholoza Meyl", number: "SM001", seats: 200, price: 350 },
    { id: 3, name: "Premier Classe", number: "PC001", seats: 80, price: 1200 },
  ];

  for (const train of trains) {
    await prisma.train.upsert({
      where: { id: train.id },
      update: {},
      create: train,
    });
  }

  console.log("✅ Database seeded with trains");

  // Seed a sample booking
  await prisma.booking.upsert({
    where: { id: 1 },
    update: {},
    create: {
      passengerName: "Nihal Harichurn",
      email: "nihal@example.com",
      idNumber: "9001015009087",
      trainNumber: "BT001",
      departure: "Cape Town",
      destination: "Pretoria",
      date: new Date("2025-09-15T08:00:00.000Z"),
      time: "08:00",
      seat: "12A",
      price: 850,
      paymentStatus: "Pending",
      status: "Active",
      trainId: 1,
    },
  });

  console.log("✅ Database seeded with sample booking");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
