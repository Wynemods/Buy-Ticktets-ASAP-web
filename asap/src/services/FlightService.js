// src/services/flightService.js
// FIXED VERSION with proper ES6 imports and User Management

import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  query, 
  orderBy, 
  limit,
  updateDoc,
  increment,
  deleteDoc
} from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDVzx99v4W13PmDnAUrrtYnvapQnUzQYwY",
  authDomain: "aspp-bbf36.firebaseapp.com",
  projectId: "aspp-bbf36",
  storageBucket: "aspp-bbf36.firebasestorage.app",
  messagingSenderId: "429957697717",
  appId: "1:429957697717:web:985632f4beee4645ae6efc",
  measurementId: "G-5Q6DGZGDBM"
};

// Initialize Firebase with error handling
let app;
let db;

try {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  console.log("✅ Firebase initialized successfully");
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
}

// Test connection function
export const testFirebaseConnection = async () => {
  try {
    console.log("🔍 Testing Firebase connection...");
    const testDoc = doc(db, 'test', 'connection');
    await setDoc(testDoc, { 
      timestamp: new Date(),
      message: "Firebase connection test successful"
    });
    console.log("✅ Firebase connection test successful");
    return true;
  } catch (error) {
    console.error("❌ Firebase connection test failed:", error);
    return false;
  }
};

// Flight configuration service with extensive debugging
export const flightService = {
  // Test the service
  async testService() {
    console.log("🧪 Testing flightService...");
    return await testFirebaseConnection();
  },

  // USER MANAGEMENT FUNCTIONS

  // Save user booking details to Firestore
  async saveUserBooking(bookingData) {
    try {
      console.log("💾 Attempting to save user booking:", bookingData);
      
      // Generate a unique ID for the booking
      const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log("🆔 Generated booking ID:", bookingId);
      
      const userData = {
        ...bookingData,
        id: bookingId,
        createdAt: new Date(),
        updatedAt: new Date(),
        bookingStatus: 'pending'
      };

      console.log("📝 User data to save:", userData);
      
      const docRef = doc(db, 'users', bookingId);
      await setDoc(docRef, userData);
      
      console.log("✅ User booking saved successfully with ID:", bookingId);
      return bookingId;
    } catch (error) {
      console.error("❌ Error saving user booking:", error);
      console.error("Error details:", error.message);
      console.error("Error code:", error.code);
      throw new Error(`Failed to save user booking: ${error.message}`);
    }
  },

  // Get user booking by ID
  async getUserBooking(bookingId) {
    try {
      console.log("🔍 Attempting to fetch user booking with ID:", bookingId);
      
      const docRef = doc(db, 'users', bookingId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        console.log("✅ User booking retrieved successfully:", data);
        return data;
      } else {
        console.warn("⚠️ User booking not found for ID:", bookingId);
        throw new Error('User booking not found');
      }
    } catch (error) {
      console.error("❌ Error fetching user booking:", error);
      throw new Error(`Failed to fetch user booking: ${error.message}`);
    }
  },

  // Update user booking
  async updateUserBooking(bookingId, updates) {
    try {
      console.log("🔄 Updating user booking:", bookingId, updates);
      
      const docRef = doc(db, 'users', bookingId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      console.log("✅ User booking updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Error updating user booking:", error);
      throw new Error(`Failed to update user booking: ${error.message}`);
    }
  },

  // Get all user bookings
  async getAllUserBookings(limitCount = 50) {
    try {
      console.log("📋 Fetching all user bookings...");
      
      const q = query(
        collection(db, 'users'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const userBookings = [];
      
      querySnapshot.forEach((doc) => {
        userBookings.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log("✅ Retrieved user bookings:", userBookings);
      return userBookings;
    } catch (error) {
      console.error("❌ Error fetching user bookings:", error);
      throw new Error(`Failed to fetch user bookings: ${error.message}`);
    }
  },

  // Save flight configuration to Firestore
  async saveFlightConfig(flightConfig) {
    try {
      console.log("💾 Attempting to save flight configuration:", flightConfig);
      
      // Generate a unique ID for the flight configuration
      const flightId = `flight_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log("🆔 Generated flight ID:", flightId);
      
      const flightData = {
        ...flightConfig,
        id: flightId,
        createdAt: new Date(),
        updatedAt: new Date(),
        clickCount: 0,
        isActive: true
      };

      console.log("📝 Data to save:", flightData);
      
      const docRef = doc(db, 'flights', flightId);
      await setDoc(docRef, flightData);
      
      console.log("✅ Flight configuration saved successfully with ID:", flightId);
      return flightId;
    } catch (error) {
      console.error("❌ Error saving flight configuration:", error);
      console.error("Error details:", error.message);
      console.error("Error code:", error.code);
      throw new Error(`Failed to save flight configuration: ${error.message}`);
    }
  },

  // Get flight configuration by ID
  async getFlightConfig(flightId) {
    try {
      console.log("🔍 Attempting to fetch flight configuration with ID:", flightId);
      
      const docRef = doc(db, 'flights', flightId);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() };
        console.log("✅ Flight configuration retrieved successfully:", data);
        return data;
      } else {
        console.warn("⚠️ Flight configuration not found for ID:", flightId);
        throw new Error('Flight configuration not found');
      }
    } catch (error) {
      console.error("❌ Error fetching flight configuration:", error);
      throw new Error(`Failed to fetch flight configuration: ${error.message}`);
    }
  },

  // Get all flight configurations (templates)
  async getAllFlightConfigs(limitCount = 50) {
    try {
      console.log("📋 Fetching all flight configurations...");
      
      const q = query(
        collection(db, 'flights'),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      );
      
      const querySnapshot = await getDocs(q);
      const flightConfigs = [];
      
      querySnapshot.forEach((doc) => {
        flightConfigs.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      console.log("✅ Retrieved flight configurations:", flightConfigs);
      return flightConfigs;
    } catch (error) {
      console.error("❌ Error fetching flight configurations:", error);
      throw new Error(`Failed to fetch flight configurations: ${error.message}`);
    }
  },

  // Update flight configuration
  async updateFlightConfig(flightId, updates) {
    try {
      console.log("🔄 Updating flight configuration:", flightId, updates);
      
      const docRef = doc(db, 'flights', flightId);
      await updateDoc(docRef, {
        ...updates,
        updatedAt: new Date()
      });
      
      console.log("✅ Flight configuration updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Error updating flight configuration:", error);
      throw new Error(`Failed to update flight configuration: ${error.message}`);
    }
  },

  // Increment click count for analytics
  async incrementClickCount(flightId) {
    try {
      console.log("📊 Incrementing click count for:", flightId);
      
      const docRef = doc(db, 'flights', flightId);
      await updateDoc(docRef, {
        clickCount: increment(1),
        lastAccessed: new Date()
      });
      
      console.log("✅ Click count incremented successfully");
    } catch (error) {
      console.error("❌ Error incrementing click count:", error);
      // Don't throw error for analytics failures
    }
  },

  // URL encoding/decoding utilities
  encodeFlightDataToUrl(flightConfig) {
    try {
      console.log("🔗 Encoding flight data to URL:", flightConfig);
      
      // Create a simplified version of flight config for URL encoding
      const urlData = {
        airline: flightConfig.airline,
        price: flightConfig.price,
        flights: flightConfig.flights.map(flight => ({
          route: flight.route,
          date: flight.date,
          duration: flight.duration,
          stops: flight.stops,
          segments: flight.segments.map(segment => ({
            flightNumber: segment.flightNumber,
            class: segment.class || 'Economy',
            aircraft: segment.aircraft,
            departure: {
              time: segment.departure.time,
              date: segment.departure.date,
              airport: segment.departure.airport,
              terminal: segment.departure.terminal
            },
            arrival: {
              time: segment.arrival.time,
              date: segment.arrival.date,
              airport: segment.arrival.airport,
              terminal: segment.arrival.terminal
            },
            duration: segment.duration,
            meal: segment.meal || 'Meal'
          })),
          layovers: flight.layovers || []
        })),
        baggage: flightConfig.baggage,
        customization: flightConfig.customization
      };
      
      // Encode the data as base64
      const jsonString = JSON.stringify(urlData);
      const encoded = btoa(encodeURIComponent(jsonString));
      
      console.log("✅ Flight data encoded successfully");
      return encoded;
    } catch (error) {
      console.error("❌ Error encoding flight data:", error);
      throw new Error(`Failed to encode flight data: ${error.message}`);
    }
  },

  decodeFlightDataFromUrl(encodedData) {
    try {
      console.log("🔍 Decoding flight data from URL");
      
      const jsonString = decodeURIComponent(atob(encodedData));
      const decodedData = JSON.parse(jsonString);
      
      console.log("✅ Flight data decoded successfully:", decodedData);
      return decodedData;
    } catch (error) {
      console.error("❌ Error decoding flight data:", error);
      throw new Error(`Failed to decode flight data: ${error.message}`);
    }
  },

  // Parse old URL format for backward compatibility
  parseOldUrlFormat(urlParams) {
    try {
      console.log("🔄 Parsing old URL format");
      
      const config = {
        airline: {
          name: urlParams.get('airline') || 'EGYPTAIR',
          code: (urlParams.get('airline') || 'EGYPTAIR').toLowerCase().substring(0, 2),
          operatedBy: urlParams.get('airline') || 'EgyptAir'
        },
        price: {
          amount: urlParams.get('price') || '1,000.00',
          currency: urlParams.get('currency') || 'USD'
        },
        flights: [
          {
            route: urlParams.get('dep_route') || 'Unknown Route',
            date: urlParams.get('dep_date') || 'TBD',
            duration: urlParams.get('dep_duration') || '0h 0m',
            stops: urlParams.get('dep_stops') || 'Unknown',
            segments: [
              {
                flightNumber: "XX 000",
                class: "Economy",
                aircraft: "Boeing 737-800",
                departure: { time: "00:00 AM", date: "TBD", airport: "Unknown" },
                arrival: { time: "00:00 AM", date: "TBD", airport: "Unknown" },
                duration: "0:00",
                meal: "Meal",
                airlineCode: (urlParams.get('airline') || 'EGYPTAIR').toLowerCase().substring(0, 2)
              }
            ],
            layovers: []
          }
        ],
        baggage: urlParams.get('baggage') || '2pcs',
        customization: {
          agentName: urlParams.get('agent') || 'Travel Agent',
          agentEmail: 'agent@asaptickets.com',
          agentPhone: '(888) 806-4059',
          companyName: 'ASAP Tickets',
          confirmationCode: urlParams.get('confirmation') || 'UNKNOWN',
          logoUrl: ''
        }
      };

      // Add return flight if available
      if (urlParams.get('ret_route')) {
        config.flights.push({
          route: urlParams.get('ret_route'),
          date: urlParams.get('ret_date') || 'TBD',
          duration: urlParams.get('ret_duration') || '0h 0m',
          stops: urlParams.get('ret_stops') || 'Unknown',
          segments: [
            {
              flightNumber: "XX 001",
              class: "Economy",
              aircraft: "Boeing 737-800",
              departure: { time: "00:00 AM", date: "TBD", airport: "Unknown" },
              arrival: { time: "00:00 AM", date: "TBD", airport: "Unknown" },
              duration: "0:00",
              meal: "Meal",
              airlineCode: (urlParams.get('airline') || 'EGYPTAIR').toLowerCase().substring(0, 2)
            }
          ],
          layovers: []
        });
      }

      console.log("✅ Old URL format parsed successfully:", config);
      return config;
    } catch (error) {
      console.error("❌ Error parsing old URL format:", error);
      throw new Error(`Failed to parse old URL format: ${error.message}`);
    }
  },

  // PAYMENT DATA MANAGEMENT FUNCTIONS

  // Save payment details to subcollection
  async savePaymentDetails(bookingId, paymentData) {
    try {
      console.log("💳 Attempting to save payment details for booking:", bookingId);
      console.warn("⚠️ SECURITY WARNING: Storing credit card data is not recommended for production!");
      
      // Generate a unique ID for the payment record
      const paymentId = `payment_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      console.log("🆔 Generated payment ID:", paymentId);
      
      const paymentRecord = {
        ...paymentData,
        id: paymentId,
        bookingId: bookingId,
        createdAt: new Date(),
        paymentStatus: 'pending',
        // Add audit trail
        auditTrail: {
          createdAt: new Date(),
          lastModified: new Date(),
          version: 1
        }
      };

      console.log("📝 Payment data to save:", paymentRecord);
      
      // Save to subcollection: users/{bookingId}/paymentDetails/{paymentId}
      const docRef = doc(db, 'users', bookingId, 'paymentDetails', paymentId);
      await setDoc(docRef, paymentRecord);
      
      console.log("✅ Payment details saved successfully with ID:", paymentId);
      return paymentId;
    } catch (error) {
      console.error("❌ Error saving payment details:", error);
      console.error("Error details:", error.message);
      throw new Error(`Failed to save payment details: ${error.message}`);
    }
  },

  // Get payment details from subcollection
  async getPaymentDetails(bookingId, paymentId = null) {
    try {
      console.log("🔍 Fetching payment details for booking:", bookingId);
      
      if (paymentId) {
        // Get specific payment record
        const docRef = doc(db, 'users', bookingId, 'paymentDetails', paymentId);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          console.log("✅ Payment details retrieved:", data);
          return data;
        } else {
          console.warn("⚠️ Payment details not found for ID:", paymentId);
          throw new Error('Payment details not found');
        }
      } else {
        // Get all payment records for the booking
        const q = query(
          collection(db, 'users', bookingId, 'paymentDetails'),
          orderBy('createdAt', 'desc')
        );
        
        const querySnapshot = await getDocs(q);
        const paymentRecords = [];
        
        querySnapshot.forEach((doc) => {
          paymentRecords.push({
            id: doc.id,
            ...doc.data()
          });
        });
        
        console.log("✅ Retrieved payment records:", paymentRecords);
        return paymentRecords;
      }
    } catch (error) {
      console.error("❌ Error fetching payment details:", error);
      throw new Error(`Failed to fetch payment details: ${error.message}`);
    }
  },

  // Update payment status
  async updatePaymentStatus(bookingId, paymentId, status, additionalData = {}) {
    try {
      console.log("🔄 Updating payment status:", { bookingId, paymentId, status });
      
      const docRef = doc(db, 'users', bookingId, 'paymentDetails', paymentId);
      await updateDoc(docRef, {
        paymentStatus: status,
        ...additionalData,
        'auditTrail.lastModified': new Date(),
        'auditTrail.version': increment(1)
      });
      
      console.log("✅ Payment status updated successfully");
      return true;
    } catch (error) {
      console.error("❌ Error updating payment status:", error);
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  },

  // Generate URL for flight configuration
  generateFlightUrl(flightId = null, flightConfig = null, baseUrl = null) {
    try {
      console.log("🔗 Generating flight URL:", { flightId, hasConfig: !!flightConfig });
      
      const base = baseUrl || window.location.origin;
      const url = new URL('/bookings', base);
      
      if (flightId) {
        // Use template ID approach
        url.searchParams.set('template', flightId);
        console.log("✅ Generated template URL:", url.toString());
      } else if (flightConfig) {
        // Use encoded data approach
        const encodedData = this.encodeFlightDataToUrl(flightConfig);
        url.searchParams.set('data', encodedData);
        console.log("✅ Generated encoded URL:", url.toString());
      }
      
      return url.toString();
    } catch (error) {
      console.error("❌ Error generating flight URL:", error);
      throw new Error(`Failed to generate flight URL: ${error.message}`);
    }
  }
};

export default flightService;