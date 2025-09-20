const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  // Seed trains
  const trains = [
    { id: 1, name: "Blue Train", number: "BT001" },
    { id: 2, name: "Shosholoza Express", number: "SE001" }
  ];

  for (const train of trains) {
    await prisma.train.upsert({
      where: { id: train.id },
      update: {}, // do nothing if it exists
      create: train
    });
  }

  console.log("✅ Database seeded with trains");

  // Optional: seed a sample booking
  const bookings = [
    {
      passengerName: "Nihal Harichurn",
      email: "nihal@example.com",
      idNumber: "9001015009087",
      trainNumber: "Blue Train",
      departure: "Cape Town",
      destination: "Pretoria",
      date: new Date("2025-09-15T08:00:00.000Z"),
      time: "08:00",
      seat: "12A",
      price: 250,
      paymentStatus: "Pending",
      status: "Active",
      trainId: 1
    }
  ];

  for (const booking of bookings) {
    await prisma.booking.upsert({
      where: { id: 1 },
      update: {}, // skip if it exists
      create: booking
    });
  }

  console.log("✅ Database seeded with sample bookings");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
