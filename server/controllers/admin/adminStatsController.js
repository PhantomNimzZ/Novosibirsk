// server/controllers/admin/adminStatsController.js
import prisma from "../../lib/prisma.js"; // ✅ Singleton
import { startOfDay } from "date-fns";

// ─────────────────────────────────────────
// OVERVIEW STATS (KPI Cards)
// ─────────────────────────────────────────
export const getOverviewStats = async (req, res) => {
  try {
    const totalBookings = await prisma.booking.count();

    const totalRevenueAgg = await prisma.booking.aggregate({
      _sum: { price: true },
    });
    const totalRevenue = totalRevenueAgg._sum.price || 0;

    const today = startOfDay(new Date());

    const bookingsToday = await prisma.booking.count({
      where: { createdAt: { gte: today } },
    });

    const revenueTodayAgg = await prisma.booking.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { price: true },
    });
    const revenueToday = revenueTodayAgg._sum.price || 0;

    // Most popular route
    const bookings = await prisma.booking.findMany({
      select: { departure: true, destination: true },
    });

    const routeCounts = {};
    for (const b of bookings) {
      const route = `${b.departure} → ${b.destination}`;
      routeCounts[route] = (routeCounts[route] || 0) + 1;
    }

    let mostPopularRoute = "No data";
    if (Object.keys(routeCounts).length > 0) {
      mostPopularRoute = Object.entries(routeCounts).sort((a, b) => b[1] - a[1])[0][0];
    }

    res.json({ totalBookings, bookingsToday, mostPopularRoute, totalRevenue, revenueToday });
  } catch (error) {
    console.error("Overview stats error:", error);
    res.status(500).json({ message: "Failed to load overview stats" });
  }
};

// ─────────────────────────────────────────
// BOOKINGS BY DATE
// ✅ Fixed: uses raw SQL DATE() to group by day, not by exact timestamp
// ─────────────────────────────────────────
export const getBookingsByDate = async (req, res) => {
  try {
    const stats = await prisma.$queryRaw`
      SELECT DATE(createdAt) as date, COUNT(*) as count
      FROM Booking
      GROUP BY DATE(createdAt)
      ORDER BY date ASC
    `;

    // SQLite returns count as BigInt — convert to Number for JSON serialisation
    const formatted = stats.map((s) => ({
      date: s.date,
      count: Number(s.count),
    }));

    res.json(formatted);
  } catch (error) {
    console.error("Bookings by date error:", error);
    res.status(500).json({ message: "Failed to load date stats" });
  }
};

// ─────────────────────────────────────────
// BOOKINGS BY ROUTE
// ─────────────────────────────────────────
export const getBookingsByRoute = async (req, res) => {
  try {
    const bookings = await prisma.booking.findMany({
      select: { departure: true, destination: true },
    });

    const map = {};
    for (const b of bookings) {
      const route = `${b.departure} → ${b.destination}`;
      map[route] = (map[route] || 0) + 1;
    }

    const formatted = Object.entries(map).map(([route, count]) => ({ route, count }));

    res.json(formatted);
  } catch (error) {
    console.error("Bookings by route error:", error);
    res.status(500).json({ message: "Failed to load route stats" });
  }
};

// ─────────────────────────────────────────
// REVENUE STATS
// ─────────────────────────────────────────
export const getRevenueStats = async (req, res) => {
  try {
    const totalRevenueAgg = await prisma.booking.aggregate({ _sum: { price: true } });
    const today = startOfDay(new Date());
    const revenueTodayAgg = await prisma.booking.aggregate({
      _sum: { price: true },
      where: { createdAt: { gte: today } },
    });

    res.json({
      totalRevenue: totalRevenueAgg._sum.price || 0,
      revenueToday: revenueTodayAgg._sum.price || 0,
    });
  } catch (error) {
    console.error("Revenue stats error:", error);
    res.status(500).json({ message: "Failed to load revenue stats" });
  }
};
