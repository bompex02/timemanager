import rateLimit from 'express-rate-limit';

// Generally rate limiter for all requests
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // max 200 requests per IP
  message: { 
    error: 'Zu viele Anfragen von dieser IP',
    retryAfter: '15 Minuten'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false, // count all requests
  handler: (req, res) => {
    const resetTime = req.rateLimit?.resetTime 
      ? Math.round((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
      : 900; // fallback: 15 minutes

    res.status(429).json({
      error: 'Rate limit überschritten',
      message: 'Zu viele Anfragen von dieser IP, bitte später erneut versuchen',
      retryAfter: resetTime
    });
  }
});

// Strict rate limiter for authentication routes
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // max 5 failed requests per IP
  message: {
    error: 'Zu viele Login-Versuche',
    retryAfter: '15 Minuten'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed requests
  handler: (req, res) => {
    const resetTime = req.rateLimit?.resetTime 
      ? Math.round((req.rateLimit.resetTime.getTime() - Date.now()) / 1000)
      : 900;

    res.status(429).json({
      error: 'Zu viele Login-Versuche',
      message: 'Ihr Account wurde temporär gesperrt. Bitte versuchen Sie es später erneut.',
      retryAfter: resetTime
    });
  },
});