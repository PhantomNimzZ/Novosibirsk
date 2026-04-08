// server/controllers/searchController.js
import prisma from "../lib/prisma.js";

/**
 * Search for trains
 * GET /api/search?from=X&to=Y&date=YYYY-MM-DD&time=HH:MM
 */
export const searchTrains = async (req, res) => {
  try {
    const { from, to, date, time } = req.query;

    if (!from || !to) {
      return res.status(400).json({
        error: "Missing required parameters: 'from' and 'to'",
      });
    }

    const filters = { from: from.trim(), to: to.trim() };
    if (date) filters.date = date.trim().split("T")[0];
    if (time) filters.time = time.trim();

    const trains = await prisma.train.findMany({
      where: filters,
      orderBy: [{ time: "asc" }],
    });

    res.json({
      results: trains.length,
      filters: { from, to, date: date || "any", time: time || "any" },
      trains,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({ error: "Failed to search trains" });
  }
};

/**
 * Get available routes
 * GET /api/search/routes
 */
export const getAvailableRoutes = async (req, res) => {
  try {
    const routes = await prisma.train.findMany({
      distinct: ["from", "to"],
      select: { from: true, to: true, distance: true, duration: true },
      orderBy: [{ from: "asc" }, { to: "asc" }],
    });
    res.json({ routes, count: routes.length });
  } catch (error) {
    console.error("Get routes error:", error);
    res.status(500).json({ error: "Failed to fetch routes" });
  }
};

/**
 * Get available dates for a route
 * GET /api/search/dates?from=X&to=Y
 */
export const getAvailableDates = async (req, res) => {
  try {
    const { from, to } = req.query;
    if (!from || !to) {
      return res.status(400).json({ error: "Missing 'from' and 'to'" });
    }

    const trains = await prisma.train.findMany({
      where: { from: from.trim(), to: to.trim() },
      distinct: ["date"],
      select: { date: true },
      orderBy: { date: "asc" },
    });

    res.json({ from, to, dates: trains.map((t) => t.date), count: trains.length });
  } catch (error) {
    console.error("Get dates error:", error);
    res.status(500).json({ error: "Failed to fetch dates" });
  }
};

/**
 * Get available times for a route and date
 * GET /api/search/times?from=X&to=Y&date=YYYY-MM-DD
 */
export const getAvailableTimes = async (req, res) => {
  try {
    const { from, to, date } = req.query;
    if (!from || !to || !date) {
      return res.status(400).json({ error: "Missing 'from', 'to', and 'date'" });
    }

    const trains = await prisma.train.findMany({
      where: { from: from.trim(), to: to.trim(), date: date.trim().split("T")[0] },
      select: { time: true, class: true, seats: true, price: true },
      orderBy: { time: "asc" },
    });

    res.json({ from, to, date, trains, count: trains.length });
  } catch (error) {
    console.error("Get times error:", error);
    res.status(500).json({ error: "Failed to fetch times" });
  }
};

export default { searchTrains, getAvailableRoutes, getAvailableDates, getAvailableTimes };
