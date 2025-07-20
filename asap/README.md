# ASAP Tickets Flight Booking Website

This project is a React-based flight booking website used by ASAP Tickets for managing flight configurations, bookings, and payments. The system provides a comprehensive interface for creating customized flight booking pages, managing passenger details, and processing payments securely.

---

## Overview

The website is structured as a Single Page Application (SPA) using React and React Router. It integrates with Firebase Firestore for data persistence and real-time updates. The system supports creating flight configuration templates, generating unique booking URLs, managing user bookings, and handling payment processing.

---

## Key Features

- **Flight Configuration Generator**: Allows creation and customization of flight booking templates with detailed flight segments, layovers, pricing, and branding options.
- **Booking Page**: Displays flight details and collects passenger information with validation and dynamic pricing based on passenger count.
- **Payment Page**: Handles payment processing with support for vouchers, split payments, and optional services like TravelCare, DreamPass, and Baggage Protection.
- **Firebase Integration**: Uses Firestore for storing flight configurations, user bookings, and payment details.
- **URL Encoding**: Supports generating shareable URLs with encoded flight data or template IDs for easy sharing and booking.
- **Analytics**: Tracks click counts on flight templates for usage insights.

---

## Project Structure

- `index.html`: Entry HTML file with a root div for React rendering.
- `src/main.jsx`: React app entry point, renders the main `App` component.
- `src/App.jsx`: Sets up React Router with routes for:
  - `/` - Flight Configuration Generator
  - `/bookings` - Booking Page
  - `/payment` - Payment Page
- `src/components/`: Contains React components for different pages and UI parts:
  - `FlightConfig.jsx`: Flight configuration generator component.
  - `HomePage.jsx`: Booking page component.
  - `PaymentPage.jsx`: Payment processing component.
  - Other components for UI sections like TravelCare, DreamPass, PaymentSection, modals, etc.
- `src/services/FlightService.js`: Service module handling Firebase Firestore interactions for bookings, flight configs, payments, and URL encoding/decoding.
- `src/assets/`: Contains images and icons used in the UI.
- `public/`: Public assets including favicon and SVGs.

---

## Detailed Component Descriptions

### FlightConfig.jsx

- Manages flight booking templates with detailed flight segments, layovers, pricing, and branding.
- Supports saving templates to Firestore and generating unique URLs.
- Allows duplicating and loading saved templates.
- Provides UI tabs for basic info, flight details, and customization.

### HomePage.jsx

- Loads flight configuration from URL parameters or defaults.
- Displays flight details and passenger forms with validation.
- Calculates total price dynamically based on passengers.
- Handles booking submission and saves booking data to Firestore.
- Shows urgency countdown banner to encourage booking.

### PaymentPage.jsx

- Loads booking data from Firestore using booking ID.
- Displays flight details, passenger info, and optional services.
- Manages payment form with validation and split payment support.
- Handles voucher codes and discounts.
- Saves payment info and updates booking status in Firestore.
- Includes modals for editing passenger info, baggage fees, fare rules, and flight details.
- Collects user rating and tip amount.
- Shows price summary with all charges and discounts.

### FlightService.js

- Handles all Firebase Firestore operations for:
  - Saving, fetching, updating user bookings and flight configurations.
  - Managing payment details and statuses.
  - Encoding/decoding flight data for URLs.
  - Parsing legacy URL formats.
  - Generating booking URLs.
- Provides utility functions for analytics and data management.

---

## Technology Stack

- React with React Router for SPA routing.
- Firebase Firestore for backend data storage.
- Tailwind CSS for styling.
- Lucide React icons.
- React Phone Input for phone number input.
- Vite as the build tool.

---

## Additional Information

- This system is used by ASAP Tickets for managing flight bookings and payments.
- The booking and payment pages are integrated with Firebase for real-time data management.
- The project was purchased for approximately $1350.
- This project is a major achievement for the developer Alexmods.

---

## Running the Project

1. Install dependencies using `npm install`.
2. Start the development server with `npm run dev`.
3. Access the app at `http://localhost:3000`.

---

## Contact

For questions or support, contact the travel agent as configured in the app or refer to the customization section in the flight configuration.

---

