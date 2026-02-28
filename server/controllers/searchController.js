// server/controllers/searchController.js
import prisma from "../lib/prisma.js";

/**
 * Search for trains based on route, date, and time
 * GET /api/search?from=X&to=Y&date=Z&time=T
 */
export const searchTrains = async (req, res) => {
  try {
    const { from, to, date, time } = req.query;

    // Validation
    if (!from || !to) {
      return res.status(400).json({ 
        error: "Missing required parameters: 'from' and 'to' are required" 
      });
    }

    // Build query filters
    const filters = {
      from: from.trim(),
      to: to.trim(),
    };

    // Add time filter if provided (required for search)
    if (time) {
      filters.time = time;
    }

    // NOTE: Date filtering is disabled for now since seed data only has one date
    // We'll add proper date filtering when we expand the schedule
    // if (date) {
    //   filters.date = date;
    // }

    console.log("🔍 Searching trains with filters:", filters);

    // Query database
    const trains = await prisma.train.findMany({
      where: filters,
      orderBy: [
        { date: "asc" },
        { time: "asc" },
      ],
    });

    console.log(`✅ Found ${trains.length} trains matching criteria`);

    // Return results
    res.json({
      results: trains.length,
      filters: {
        from,
        to,
        date: date || "any",
        time: time || "any",
      },
      trains,
    });

  } catch (error) {
    console.error("❌ Search error:", error);
    res.status(500).json({ 
      error: "Failed to search trains",
      message: error.message 
    });
  }
};

/**
 * Get available routes (unique from/to combinations)
 * GET /api/search/routes
 */
export const getAvailableRoutes = async (req, res) => {
  try {
    // Get all unique route combinations
    const routes = await prisma.train.findMany({
      distinct: ["from", "to"],
      select: {
        from: true,
        to: true,
        distance: true,
        duration: true,
      },
      orderBy: [
        { from: "asc" },
        { to: "asc" },
      ],
    });

    console.log(`✅ Found ${routes.length} available routes`);

    res.json({
      routes,
      count: routes.length,
    });

  } catch (error) {
    console.error("❌ Get routes error:", error);
    res.status(500).json({ 
      error: "Failed to fetch routes",
      message: error.message 
    });
  }
};

/**
 * Get available dates for a specific route
 * GET /api/search/dates?from=X&to=Y
 */
export const getAvailableDates = async (req, res) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      return res.status(400).json({ 
        error: "Missing required parameters: 'from' and 'to'" 
      });
    }

    // Get all unique dates for this route
    const trains = await prisma.train.findMany({
      where: {
        from: from.trim(),
        to: to.trim(),
      },
      distinct: ["date"],
      select: {
        date: true,
      },
      orderBy: {
        date: "asc",
      },
    });

    const dates = trains.map(t => t.date);

    console.log(`✅ Found ${dates.length} available dates for ${from} → ${to}`);

    res.json({
      from,
      to,
      dates,
      count: dates.length,
    });

  } catch (error) {
    console.error("❌ Get dates error:", error);
    res.status(500).json({ 
      error: "Failed to fetch dates",
      message: error.message 
    });
  }
};

/**
 * Get available times for a specific route and date
 * GET /api/search/times?from=X&to=Y&date=Z
 */
export const getAvailableTimes = async (req, res) => {
  try {
    const { from, to, date } = req.query;

    if (!from || !to || !date) {
      return res.status(400).json({ 
        error: "Missing required parameters: 'from', 'to', and 'date'" 
      });
    }

    // Get all unique times for this route and date
    const trains = await prisma.train.findMany({
      where: {
        from: from.trim(),
        to: to.trim(),
        date: date,
      },
      select: {
        time: true,
        class: true,
        seats: true,
        price: true,
      },
      orderBy: {
        time: "asc",
      },
    });

    console.log(`✅ Found ${trains.length} trains for ${from} → ${to} on ${date}`);

    res.json({
      from,
      to,
      date,
      trains,
      count: trains.length,
    });

  } catch (error) {
    console.error("❌ Get times error:", error);
    res.status(500).json({ 
      error: "Failed to fetch times",
      message: error.message 
    });
  }
};

export default {
  searchTrains,
  getAvailableRoutes,
  getAvailableDates,
  getAvailableTimes,
};
