// server/prisma/seed.js
import { PrismaClient } from "@prisma/client";
import {
  realRoutes,
  realTrains,
  basePricePerKm,
  scheduleTemplates,
} from "./realPRASAData.js";

const prisma = new PrismaClient();

async function main() {
  console.log("🚆 Seeding database with real PRASA data...");

  // Clear existing data
  await prisma.booking.deleteMany();
  await prisma.train.deleteMany();
  console.log("✅ Cleared existing data");

  // Seed trains with real data — BOTH DIRECTIONS for each route
  const trainRecords = [];

  for (const route of realRoutes) {
    // Create trains for both forward and reverse directions
    const directions = [
      { from: route.departure, to: route.destination },
      { from: route.destination, to: route.departure },
    ];

    for (const direction of directions) {
      for (const trainTemplate of realTrains) {
        // Check if Blue Train is restricted to specific routes
        if (trainTemplate.routeRestriction) {
          const validRoute = trainTemplate.routeRestriction.some(
            (station) =>
              station === direction.from || station === direction.to
          );
          if (!validRoute) continue;
        }

        // Create trains for each schedule time
        for (const schedule of scheduleTemplates) {
          const baseFare = Math.round(route.distance * basePricePerKm);
          const finalFare = Math.round(baseFare * trainTemplate.priceMultiplier);

          // Reverse intermediate stops for return direction
          const isReverse = direction.from === route.destination;
          const intermediateStops = isReverse
            ? [...route.intermediateStops].reverse().map(stop => ({
                ...stop,
                km: route.distance - stop.km,
                hours: route.duration - stop.hours,
              }))
            : route.intermediateStops;

          const train = await prisma.train.create({
            data: {
              train: trainTemplate.name,
              trainNumber: `${trainTemplate.trainNumber}-${route.id}${isReverse ? 'R' : ''}`,
              from: direction.from,
              to: direction.to,
              time: schedule.time,
              date: new Date().toISOString(),
              price: finalFare,
              seats: trainTemplate.totalSeats,
              class: trainTemplate.class,
              amenities: trainTemplate.amenities.join(", "),
              distance: route.distance,
              duration: route.duration,
              intermediateStops: JSON.stringify(intermediateStops),
            },
          });

          trainRecords.push(train);
        }
      }
    }
  }

  console.log(`✅ Created ${trainRecords.length} train schedules (both directions)`);

  // Create some sample bookings (for testing)
  const sampleBookings = [
    {
      passengerName: "Thabo Mbeki",
      email: "thabo@example.com",
      idNumber: "7201015800082",
      trainNumber: trainRecords[0].trainNumber,
      departure: trainRecords[0].from,
      destination: trainRecords[0].to,
      date: new Date().toISOString(),
      time: trainRecords[0].time,
      seat: "1A",
      price: trainRecords[0].price,
      paymentStatus: "Paid",
      status: "Active",
      trainId: trainRecords[0].id,
    },
    {
      passengerName: "Nomsa Dlamini",
      email: "nomsa@example.com",
      idNumber: "8505120700089",
      trainNumber: trainRecords[1].trainNumber,
      departure: trainRecords[1].from,
      destination: trainRecords[1].to,
      date: new Date().toISOString(),
      time: trainRecords[1].time,
      seat: "2B",
      price: trainRecords[1].price,
      paymentStatus: "Paid",
      status: "Active",
      trainId: trainRecords[1].id,
    },
    {
      passengerName: "Sipho Nkosi",
      email: "sipho@example.com",
      idNumber: "9208153200087",
      trainNumber: trainRecords[2].trainNumber,
      departure: trainRecords[2].from,
      destination: trainRecords[2].to,
      date: new Date().toISOString(),
      time: trainRecords[2].time,
      seat: "3C",
      price: trainRecords[2].price,
      paymentStatus: "Pending",
      status: "Active",
      trainId: trainRecords[2].id,
    },
  ];

  for (const booking of sampleBookings) {
    await prisma.booking.create({ data: booking });
  }

  console.log(`✅ Created ${sampleBookings.length} sample bookings`);

  // Display summary
  console.log("\n📊 Database seeding complete!");
  console.log("─────────────────────────────────────");
  console.log(`Routes: ${realRoutes.length} long-distance routes (× 2 directions)`);
  console.log(`Trains: ${trainRecords.length} scheduled services`);
  console.log(`Train types: ${realTrains.length} (Economy, Business, Luxury)`);
  console.log(`Bookings: ${sampleBookings.length} sample bookings`);
  console.log("─────────────────────────────────────");

  console.log("\n💰 Sample Fares:");
  console.log(`Cape Town → Johannesburg (1,532 km):`);
  console.log(`  • Economy: R${Math.round(1532 * basePricePerKm * 1.0)}`);
  console.log(`  • Business: R${Math.round(1532 * basePricePerKm * 1.8)}`);
  console.log(`  • Luxury: R${Math.round(1532 * basePricePerKm * 3.5)}`);
  console.log(`\nJohannesburg → Durban (690 km):`);
  console.log(`  • Economy: R${Math.round(690 * basePricePerKm * 1.0)}`);
  console.log(`  • Business: R${Math.round(690 * basePricePerKm * 1.8)}`);
  console.log("\n🚆 Ready to start booking!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
