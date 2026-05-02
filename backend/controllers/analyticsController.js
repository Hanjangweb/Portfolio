import Analytics from "../models/Analytics.js";
import Project from "../models/Project.js";
import { asyncHandler } from "../middleware/errorHandler.js";

// Get analytics stats
export const getAnalyticsStats = asyncHandler(async (req, res) => {
  const totalVisits = await Analytics.countDocuments();
  const uniqueVisitorsSet = await Analytics.distinct("ip");
  const uniqueVisitors = uniqueVisitorsSet.length;

  // Get weekly visits
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyVisits = await Analytics.aggregate([
    { $match: { timestamp: { $gte: weekAgo } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
        visits: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  // Get real project categories stats
  const projectCategories = await Project.aggregate([
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  // Get top pages (excluding API calls)
  const topPages = await Analytics.aggregate([
    { $match: { page: { $not: /^\/api/ } } },
    { $group: { _id: "$page", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 }
  ]);

  res.json({
    success: true,
    data: {
      totalVisits,
      uniqueVisitors,
      weeklyVisits: weeklyVisits.map(item => ({ day: item._id, visits: item.visits })),
      categoryStats: projectCategories.map(item => ({ category: item._id, count: item.count })),
      topPages: topPages.map(item => ({ page: item._id, count: item.count }))
    }
  });
});

// Get visitor timeline
export const getVisitorTimeline = asyncHandler(async (req, res) => {
  const { startDate, endDate, interval = "day" } = req.query;

  const query = {};
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const formatKey = {
    day: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
    month: { $dateToString: { format: "%Y-%m", date: "$timestamp" } },
  };

  const timeline = await Analytics.aggregate([
    { $match: query },
    {
      $group: {
        _id: formatKey[interval] || formatKey.day,
        visits: { $sum: 1 }
      }
    },
    { $sort: { "_id": 1 } }
  ]);

  res.json({
    success: true,
    data: timeline.map(item => ({ date: item._id, visits: item.visits }))
  });
});

// Track page view
export const trackPageView = asyncHandler(async (req, res, next) => {
  const pageView = req.path;
  const userAgent = req.get('User-Agent');
  const ip = req.ip || req.connection.remoteAddress;

  // Skip API routes and static files
  if (pageView.startsWith('/api') || pageView.includes('.')) {
    return next();
  }

  try {
    await Analytics.create({
      pageView,
      userAgent,
      ip,
      referrer: req.get('Referrer'),
    });
  } catch (error) {
    console.error('Analytics tracking error:', error);
  }

  next();
});

// Get top referrers
export const getTopReferrers = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const query = {};
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const referrers = await Analytics.aggregate([
    { $match: query },
    { $group: { _id: "$referrer", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 10 },
  ]);

  res.json({
    success: true,
    data: referrers,
  });
});

// Get top pages
export const getTopPages = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const query = {};
  if (startDate || endDate) {
    query.timestamp = {};
    if (startDate) query.timestamp.$gte = new Date(startDate);
    if (endDate) query.timestamp.$lte = new Date(endDate);
  }

  const pages = await Analytics.aggregate([
    { $match: query },
    { $group: { _id: "$page", views: { $sum: 1 } } },
    { $sort: { views: -1 } },
  ]);

  res.json({
    success: true,
    data: pages,
  });
});
