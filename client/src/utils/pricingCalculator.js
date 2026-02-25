// client/src/utils/pricingCalculator.js
// PRASA Fare Calculation Utilities

/**
 * Calculate long-distance fare
 * Formula: distance (km) × R0.45/km × class multiplier
 * 
 * @param {number} distance - Distance in kilometers
 * @param {string} trainClass - "Economy", "Business", or "Luxury"
 * @returns {number} - Fare in South African Rand
 */
export const calculateLongDistanceFare = (distance, trainClass = "Economy") => {
  const basePricePerKm = 0.45; // R0.45 per kilometer
  
  const classMultipliers = {
    "Economy": 1.0,
    "Business": 1.8,
    "Luxury": 3.5,
  };
  
  const multiplier = classMultipliers[trainClass] || 1.0;
  const fare = distance * basePricePerKm * multiplier;
  
  // Round to nearest R5
  return Math.round(fare / 5) * 5;
};

/**
 * Calculate commuter fare
 * Formula: R15 minimum + (number of stops × R10)
 * 
 * @param {number} stops - Number of stops between origin and destination
 * @returns {number} - Fare in South African Rand
 */
export const calculateCommuterFare = (stops) => {
  const minimumFare = 15;
  const farePerStop = 10;
  
  return Math.max(minimumFare, stops * farePerStop);
};

/**
 * Calculate distance between two GPS coordinates (Haversine formula)
 * 
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  
  return Math.round(distance);
};

const toRad = (degrees) => {
  return (degrees * Math.PI) / 180;
};

/**
 * Format price for display
 * 
 * @param {number} price - Price in rand
 * @returns {string} - Formatted price (e.g., "R450")
 */
export const formatPrice = (price) => {
  return `R${price.toLocaleString("en-ZA")}`;
};

/**
 * Calculate estimated travel time based on distance
 * Average speed: ~60 km/h for long-distance (includes stops)
 * 
 * @param {number} distance - Distance in kilometers
 * @returns {number} - Duration in hours
 */
export const calculateTravelTime = (distance) => {
  const averageSpeed = 60; // km/h
  return Math.round(distance / averageSpeed);
};

/**
 * Get peak/off-peak price modifier
 * Peak hours: 06:00-09:00, 16:00-19:00 (weekdays)
 * 
 * @param {string} time - Time in HH:MM format
 * @param {Date} date - Date of travel
 * @returns {number} - Price multiplier (1.0 or 1.2)
 */
export const getPeakPriceModifier = (time, date = new Date()) => {
  const dayOfWeek = date.getDay(); // 0 = Sunday, 6 = Saturday
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
  
  if (isWeekend) return 1.0; // No peak pricing on weekends
  
  const hour = parseInt(time.split(":")[0]);
  const isPeakHour = (hour >= 6 && hour < 9) || (hour >= 16 && hour < 19);
  
  return isPeakHour ? 1.2 : 1.0;
};

/**
 * Calculate advance booking discount
 * Book 7+ days ahead: 10% discount
 * Book 14+ days ahead: 15% discount
 * Book 30+ days ahead: 20% discount
 * 
 * @param {Date} bookingDate - Date of booking
 * @param {Date} travelDate - Date of travel
 * @returns {number} - Discount multiplier (0.8 to 1.0)
 */
export const getAdvanceBookingDiscount = (bookingDate, travelDate) => {
  const daysInAdvance = Math.floor((travelDate - bookingDate) / (1000 * 60 * 60 * 24));
  
  if (daysInAdvance >= 30) return 0.80; // 20% discount
  if (daysInAdvance >= 14) return 0.85; // 15% discount
  if (daysInAdvance >= 7) return 0.90; // 10% discount
  
  return 1.0; // No discount
};

/**
 * Complete fare calculation with all modifiers
 * 
 * @param {Object} params - Calculation parameters
 * @returns {Object} - Breakdown of fare calculation
 */
export const calculateCompleteFare = ({
  distance,
  trainClass = "Economy",
  time = "09:00",
  travelDate = new Date(),
  bookingDate = new Date(),
}) => {
  const baseFare = calculateLongDistanceFare(distance, trainClass);
  const peakModifier = getPeakPriceModifier(time, travelDate);
  const discountModifier = getAdvanceBookingDiscount(bookingDate, travelDate);
  
  const fareAfterPeak = Math.round(baseFare * peakModifier);
  const finalFare = Math.round(fareAfterPeak * discountModifier);
  const savings = baseFare - finalFare;
  
  return {
    baseFare,
    peakSurcharge: fareAfterPeak - baseFare,
    discount: savings,
    finalFare,
    breakdown: {
      distance,
      trainClass,
      isPeakTime: peakModifier > 1.0,
      advanceBookingDays: Math.floor((travelDate - bookingDate) / (1000 * 60 * 60 * 24)),
    },
  };
};

export default {
  calculateLongDistanceFare,
  calculateCommuterFare,
  calculateDistance,
  calculateTravelTime,
  formatPrice,
  getPeakPriceModifier,
  getAdvanceBookingDiscount,
  calculateCompleteFare,
};
