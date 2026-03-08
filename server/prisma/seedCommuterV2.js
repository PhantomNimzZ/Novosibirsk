// server/prisma/seedCommuterV2.js
// Generates FULL LINE commuter trains (Approach B - Realistic Metro)

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Metro line definitions with ALL stations in order
const metroLines = {
  "cape-town": {
    cityName: "Cape Town",
    lines: [
      {
        name: "Central Line",
        stations: ["Cape Town", "Salt River", "Woodstock", "Maitland", "Goodwood", "Parow", "Bellville", "Brackenfell", "Kraaifontein"]
      },
      {
        name: "Southern Line",
        stations: ["Cape Town", "Wynberg", "Plumstead", "Retreat", "Steenberg", "Muizenberg", "St James", "Kalk Bay", "Fish Hoek", "Simon's Town"]
      },
      {
        name: "Northern Line",
        stations: ["Bellville", "Monte Vista", "Thornton", "Mutual"]
      },
      {
        name: "Cape Flats Line",
        stations: ["Cape Town", "Langa", "Heideveld", "Stock Road", "Philippi"]
      },
      {
        name: "Strand Line",
        stations: ["Bellville", "Kuilsrivier", "Eerste River", "Somerset West", "Strand"]
      },
    ]
  },
  "durban": {
    cityName: "Durban",
    lines: [
      {
        name: "South Coast Line",
        stations: ["Durban", "Berea", "Umbilo", "Rossburgh", "Jacobs", "Merewent", "Umlazi", "Reunion"]
      },
      {
        name: "North Coast Line",
        stations: ["Durban", "Verulam", "Tongaat", "Stanger"]
      },
      {
        name: "Inland Line",
        stations: ["Durban", "Pinetown", "New Germany", "Hillcrest", "Cato Ridge"]
      },
      {
        name: "North Line",
        stations: ["Durban", "KwaMashu", "Phoenix", "Verulam Junction"]
      },
    ]
  },
  "johannesburg": {
    cityName: "Johannesburg",
    lines: [
      {
        name: "Gautrain Main Line",
        stations: ["Johannesburg Park", "Rosebank", "Sandton", "Marlboro", "Midrand", "Centurion", "Pretoria", "Hatfield"]
      },
      {
        name: "East Rand Line",
        stations: ["Johannesburg Park", "Germiston", "Boksburg", "Benoni", "Springs"]
      },
      {
        name: "West Rand Line",
        stations: ["Johannesburg Park", "Roodepoort", "Krugersdorp"]
      },
      {
        name: "Soweto Line",
        stations: ["Johannesburg Park", "Soweto"]
      },
      {
        name: "Kempton Park Line",
        stations: ["Johannesburg Park", "Kempton Park"]
      },
    ]
  },
  "pretoria": {
    cityName: "Pretoria",
    lines: [
      {
        name: "Pretoria Central Line",
        stations: ["Pretoria", "Hatfield", "Centurion", "Irene", "Zwartkop"]
      },
      {
        name: "Mamelodi Line",
        stations: ["Pretoria", "Saulsville", "Mamelodi"]
      },
      {
        name: "Mabopane Line",
        stations: ["Pretoria", "Atteridgeville", "Ga-Rankuwa", "Soshanguve", "Mabopane"]
      },
      {
        name: "Hercules Line",
        stations: ["Pretoria", "Hercules"]
      },
    ]
  },
  "port-elizabeth": {
    cityName: "Port Elizabeth",
    lines: [
      {
        name: "Main Line",
        stations: ["Port Elizabeth", "Humewood", "Summerstrand", "New Brighton", "Motherwell", "Coega", "Despatch", "Uitenhage"]
      },
    ]
  },
};

// Calculate price based on number of stops
function calculatePrice(numStops) {
  if (numStops <= 3) return 15;
  if (numStops <= 6) return 25;
  return 35;
}

// Calculate distance and duration
function calculateDistance(numStops) {
  return numStops * 8; // ~8km per stop
}

function calculateDuration(numStops) {
  return Math.ceil(numStops * 5 / 60); // ~5min per stop, convert to hours
}

async function seedCommuterTrains() {
  console.log('🚇 Seeding FULL LINE commuter trains (Approach B - Realistic)...\n');
  
  // ✅ DELETE EXISTING METRO RAIL TRAINS FIRST (prevent duplicates)
  console.log('🗑️  Cleaning up existing Metro Rail trains...');
  const deleted = await prisma.train.deleteMany({
    where: {
      train: {
        contains: 'Metro Rail'
      }
    }
  });
  console.log(`   Deleted ${deleted.count} existing Metro Rail trains\n`);
  
  const times = ['06:00', '12:00', '18:00'];
  const startDate = new Date(); // ✅ Start from TODAY
  const daysToSeed = 7;
  
  let trainCount = 0;

  for (const [cityId, cityData] of Object.entries(metroLines)) {
    console.log(`📍 ${cityData.cityName}:`);
    
    for (const line of cityData.lines) {
      const numStops = line.stations.length - 1;
      const price = calculatePrice(numStops);
      const duration = calculateDuration(numStops);
      const distance = calculateDistance(numStops);
      
      const fromStation = line.stations[0];
      const toStation = line.stations[line.stations.length - 1];
      
      for (const time of times) {
        for (let day = 0; day < daysToSeed; day++) {
          const date = new Date(startDate);
          date.setDate(date.getDate() + day);
          
          const trainNumber = `${cityData.cityName.substring(0, 3).toUpperCase()}-${line.name.replace(/\s+/g, '-').toUpperCase()}-${time.replace(':', '')}-D${day + 1}`;
          
          try {
            await prisma.train.create({
              data: {
                train: `Metro Rail - ${line.name}`,
                trainNumber: trainNumber,
                from: fromStation,
                to: toStation,
                class: "Economy",
                seats: 999,
                price: price,
                date: date.toISOString(),
                time: time,
                distance: distance,
                duration: duration,
                amenities: "General Seating",
                intermediateStops: JSON.stringify(line.stations), // ✅ FULL STATION LIST
              }
            });
            
            trainCount++;
          } catch (error) {
            console.error(`Error creating train: ${trainNumber}`, error.message);
          }
        }
      }
      
      console.log(`  ✅ ${line.name}: ${times.length * daysToSeed} trains (${fromStation} ↔ ${toStation}, ${numStops} stops, R${price})`);
    }
    console.log('');
  }
  
  console.log(`✅ Successfully seeded ${trainCount} full-line commuter trains!\n`);
  console.log('📋 Each train serves ALL stations on its line.');
  console.log('🎫 Passengers can board/exit at ANY station pair.\n');
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
