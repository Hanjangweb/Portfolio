import Analytics from "../models/Analytics.js";

export const trackPageView = async (req, res, next) => {
  try {
    // Get visitor ID from cookies or generate new one
    let visitorId = req.cookies?.visitorId || req.headers["x-visitor-id"];
    
    if (!visitorId) {
      visitorId = `visitor_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }

    // Skip API routes and static files
    if (req.path.startsWith('/api') || req.path.includes('.')) {
      return next();
    }

    // Log page view
    await Analytics.create({
      visitorId,
      page: req.path,
      referrer: req.headers.referer || "direct",
      userAgent: req.headers["user-agent"],
    });

    // Store visitor ID in response header
    res.set("X-Visitor-ID", visitorId);
    next();
  } catch (error) {
    // Don't fail the request if analytics fails
    next();
  }
};
