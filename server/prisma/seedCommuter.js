// server/prisma/seedCommuter.js
// Generates commuter train schedules for all metro lines

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Metro line definitions (simplified from client/src/constants/metroLines.js)
const metroLines = {
  capetown: {
    cityName: "Cape Town",
    lines: [
      { name: "Central Line", from: "Cape Town", to: "Simon's Town", stops: 11 },
      { name: "Southern Line", from: "Cape Town", to: "Fish Hoek", stops: 9 },
      { name: "Northern Line", from: "Cape Town", to: "Bellville", stops: 8 },
      { name: "Cape Flats Line", from: "Cape Town", to: "Khayelitsha", stops: 7 },
      { name: "Strand Line", from: "Cape Town", to: "Strand", stops: 6 },
    ]
  },
  durban: {
    cityName: "Durban",
    lines: [
      { name: "South Coast Line", from: "Durban", to: "Umlazi", stops: 7 },
      { name: "North Coast Line", from: "Durban", to: "Stanger", stops: 5 },
      { name: "Inland Line", from: "Durban", to: "Pinetown", stops: 4 },
      { name: "North Line", from: "Durban", to: "Verulam", stops: 2 },
    ]
  },
  johannesburg: {
    cityName: "Johannesburg",
    lines: [
      { name: "Gautrain Main", from: "Johannesburg", to: "Pretoria", stops: 7 },
      { name: "East Rand Line", from: "Johannesburg", to: "Germiston", stops: 5 },
      { name: "West Rand Line", from: "Johannesburg", to: "Randfontein", stops: 4 },
      { name: "Soweto Line", from: "Johannesburg", to: "Orlando", stops: 3 },
      { name: "Kempton Park Line", from: "Johannesburg", to: "Kempton Park", stops: 3 },
    ]
  },
  pretoria: {
    cityName: "Pretoria",
    lines: [
      { name: "Central Line", from: "Pretoria", to: "Centurion", stops: 3 },
      { name: "Mamelodi Line", from: "Pretoria", to: "Mamelodi", stops: 3 },
      { name: "Mabopane Line", from: "Pretoria", to: "Mabopane", stops: 3 },
      { name: "Hercules Line", from: "Pretoria", to: "Hercules", stops: 3 },
    ]
  },
  portelizabeth: {
    cityName: "Port Elizabeth",
    lines: [
      { name: "Main Line", from: "Port Elizabeth", to: "Uitenhage", stops: 8 },
    ]
  }
};

// Calculate price based on number of stops
function calculatePrice(stops) {
  if (stops <= 3) return 15; // Short route
  if (stops <= 6) return 25; // Medium route
  return 35; // Long route
}

// Calculate estimated duration (rough estimate: 5 min per stop)
function calculateDuration(stops) {
  return Math.ceil(stops * 5 / 60); // Convert minutes to hours, round up
}

// Calculate estimated distance (rough estimate: 8 km per stop)
function calculateDistance(stops) {
  return stops * 8;
}

async function seedCommuterTrains() {
  console.log('🚇 Seeding commuter trains...');
  
  const times = ['06:00', '12:00', '18:00']; // Morning, Afternoon, Evening
  const startDate = new Date('2026-03-10');
  const daysToSeed = 7;
  
  let trainCount = 0;

  // Iterate through each city
  for (const [cityId, cityData] of Object.entries(metroLines)) {
    console.log(`\n📍 ${cityData.cityName}:`);
    
    // Iterate through each line in the city
    for (const line of cityData.lines) {
      const price = calculatePrice(line.stops);
      const duration = calculateDuration(line.stops);
      const distance = calculateDistance(line.stops);
      
      // Create trains for each time slot
      for (const time of times) {
        // Create trains for multiple days
        for (let day = 0; day < daysToSeed; day++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + day);
          
          const trainNumber = `${cityData.cityName.substring(0, 3).toUpperCase()}-${line.name.replace(/\s+/g, '-').toUpperCase()}-${time.replace(':', '')}`;
          
          try {
            await prisma.train.create({
              data: {
                train: `Metro Rail - ${line.name}`,
                trainNumber: `${trainNumber}-D${day + 1}`,
                from: line.from,
                to: line.to,
                class: "Economy",
                seats: 999, // General seating (unlimited)
                price: price,
                date: date.toISOString(),
                time: time,
                distance: distance,
                duration: duration,
                amenities: "General Seating",
                intermediateStops: "",
              }
            });
            
            trainCount++;
          } catch (error) {
            console.error(`Error creating train: ${trainNumber}`, error.message);
          }
        }
      }
      
      console.log(`  ✅ ${line.name}: ${times.length * daysToSeed} trains (${line.stops} stops, R${price})`);
    }
  }
  
  console.log(`\n✅ Successfully seeded ${trainCount} commuter trains!`);
}

// Run the seed
seedCommuterTrains()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
