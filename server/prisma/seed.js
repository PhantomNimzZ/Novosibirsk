// server/prisma/seed.js
import { PrismaClient } from "@prisma/client";
import {
  realRoutes,
  realTrains,
  basePricePerKm,
  scheduleTemplates,
} from "./realPRASAData.js";

const prisma = new PrismaClient();

// Generate YYYY-MM-DD for today + N days
const getDateStr = (daysFromNow) => {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
};

const DAYS_TO_SEED = 60;

async function main() {
  console.log("🚆 Seeding database with real PRASA data...");
  console.log(`📅 Generating trains for ${DAYS_TO_SEED} days (today + ${DAYS_TO_SEED - 1} days)`);

  // Clear bookings first (Restrict means we can't delete trains with bookings)
  await prisma.booking.deleteMany();
  await prisma.train.deleteMany();
  console.log("✅ Cleared existing data");

  const trainRecords = [];

  for (let day = 0; day < DAYS_TO_SEED; day++) {
    const dateStr = getDateStr(day);

    for (const route of realRoutes) {
      const directions = [
        { from: route.departure, to: route.destination },
        { from: route.destination, to: route.departure },
      ];

      for (const direction of directions) {
        for (const trainTemplate of realTrains) {
          if (trainTemplate.routeRestriction) {
            const valid = trainTemplate.routeRestriction.some(
              (s) => s === direction.from || s === direction.to
            );
            if (!valid) continue;
          }

          for (const schedule of scheduleTemplates) {
            const finalFare = Math.round(route.distance * basePricePerKm * trainTemplate.priceMultiplier);

            const isReverse = direction.from === route.destination;
            const intermediateStops = isReverse
              ? [...route.intermediateStops].reverse().map((stop) => ({
                  ...stop,
                  km: route.distance - stop.km,
                  hours: Math.round((route.duration - stop.hours) * 10) / 10,
                }))
              : route.intermediateStops;

            const train = await prisma.train.create({
              data: {
                trainName: trainTemplate.name,
                trainNumber: `${trainTemplate.trainNumber}-${route.id}${isReverse ? "R" : ""}`,
                from: direction.from,
                to: direction.to,
                time: schedule.time,
                date: dateStr,
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
  }

  console.log(`✅ Created ${trainRecords.length} train schedules (${DAYS_TO_SEED} days × both directions)`);

  // Sample bookings — use today's date
  const todayStr = getDateStr(0);
  const sampleBookings = [
    {
      passengerName: "Thabo Mbeki",
      email: "thabo@example.com",
      idNumber: "7201015800082",
      trainNumber: trainRecords[0].trainNumber,
      departure: trainRecords[0].from,
      destination: trainRecords[0].to,
      date: todayStr,
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
      date: todayStr,
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
      date: todayStr,
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
  console.log("\n📊 Database seeding complete!");
  console.log("─────────────────────────────────────");
  console.log(`Routes: ${realRoutes.length} long-distance routes (× 2 directions)`);
  console.log(`Trains: ${trainRecords.length} scheduled services`);
  console.log(`Dates: ${getDateStr(0)} → ${getDateStr(DAYS_TO_SEED - 1)} (${DAYS_TO_SEED} days)`);
  console.log("─────────────────────────────────────");
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
