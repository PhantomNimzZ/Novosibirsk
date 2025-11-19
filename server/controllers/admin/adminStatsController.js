import prisma from "../../lib/prisma.js";
import { startOfDay } from "date-fns";

// =========================
// OVERVIEW STATS (KPI CARDS)
// =========================
export const getOverviewStats = async (req, res) => {
  try {
    // -------- TOTAL BOOKINGS --------
    const totalBookings = await prisma.booking.count();

    // -------- REVENUE (ALL TIME) --------
    const totalRevenueAgg = await prisma.booking.aggregate({
      _sum: { price: true },
    });
    const totalRevenue = totalRevenueAgg._sum.price || 0;

    // -------- BOOKINGS TODAY --------
    const today = startOfDay(new Date());
    const bookingsToday = await prisma.booking.count({
      where: {
        createdAt: { gte: today },
      },
    });

    // -------- REVENUE TODAY --------
    const revenueTodayAgg = await prisma.booking.aggregate({
      where: { createdAt: { gte: today } },
      _sum: { price: true },
    });
    const revenueToday = revenueTodayAgg._sum.price || 0;

    // -------- MOST POPULAR ROUTE --------
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

    // -------- SEND RESPONSE --------
    res.json({
      totalBookings,
      bookingsToday,
      mostPopularRoute,
      totalRevenue,
      revenueToday,
    });

  } catch (error) {
    console.log("Overview stats error:", error);
    res.status(500).json({ message: "Failed to load overview stats" });
  }
};


// =========================
// BOOKINGS BY DATE
// =========================
export const getBookingsByDate = async (req, res) => {
  try {
    const stats = await prisma.booking.groupBy({
      by: ["createdAt"],
      _count: { createdAt: true },
      orderBy: {
        createdAt: "asc",
      },
    });

    const formatted = stats.map((s) => ({
      date: s.createdAt.toISOString().split("T")[0],
      count: s._count.createdAt,
    }));

    res.json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load date stats" });
  }
};


// =========================
// BOOKINGS BY ROUTE
// =========================
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

    const formatted = Object.entries(map).map(([route, count]) => ({
      route,
      count,
    }));

    res.json(formatted);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to load route stats" });
  }
};


// =========================
// REVENUE ENDPOINT (Optional)
// =========================
export const getRevenueStats = async (req, res) => {
  try {
    const totalRevenueAgg = await prisma.booking.aggregate({
      _sum: { price: true },
    });

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
    console.log(error);
    res.status(500).json({ message: "Failed to load revenue stats" });
  }
};
