# S-WINDS 
### Smart Weather-Integrated Navigation & Driving System
**MERN Stack | Progressive Web App (PWA) | Real-Time (Socket.io) | B2C & B2B Solutions**

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue.svg)
![PWA](https://img.shields.io/badge/PWA-Ready-green.svg)
![Socket.io](https://img.shields.io/badge/RealTime-Socket.io-black.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

---

##  Project Overview

[cite_start]**S-WINDS** is a Progressive Web App (PWA) designed to act as an intelligent co-pilot for drivers[cite: 6]. [cite_start]While traditional navigation tools only display traffic conditions [cite: 7] [cite_start]and standard weather applications only show static, city-level current weather[cite: 7, 14], S-WINDS bridges this gap. [cite_start]It integrates route planning with **hyper-local, time-accurate weather forecasts** mapped precisely along the journey's timeline[cite: 7].

###  Core Insight
> [cite_start]"The weather at your destination right now is useless. What matters is the weather there when **YOU** arrive." [cite: 11]

[cite_start]When a destination is entered, S-WINDS splits the route into time-based waypoints, calculates the Estimated Time of Arrival (ETA) for each specific point, and fetches the precise weather forecast for that location at that future arrival time[cite: 8].

---


##  Key Features

###  B2C (Individual Drivers)
* [cite_start]**Smart Route Planning:** Enter a destination to receive a detailed breakdown of your route with precise waypoint-level weather overlays[cite: 8, 17].
* [cite_start]**Time-Accurate Insights:** View future weather conditions (temperature, wind, rain, visibility) adjusted to your specific ETA at each segment[cite: 8, 90].
* [cite_start]**Safe Speed Advice:** Dynamic speed recommendations and calculated route risk levels based on upcoming weather hazards[cite: 9, 17, 90].
* [cite_start]**Smart Departure Suggestions:** Answers "When is the best time to leave?" by evaluating multiple departure windows to avoid hazards entirely[cite: 9, 10, 17, 90].
* [cite_start]**Contextual Roadside Recommendations:** Geolocation-targeted commercial ads and recommendations (e.g., rest stops, fuel, washrooms) triggered dynamically by current local weather conditions[cite: 81, 94].

###  B2B (Fleet Management)
* [cite_start]**Live Fleet Dashboard:** A unified dashboard providing fleet managers with a real-time map displaying all active vehicles[cite: 17, 19].
* [cite_start]**Real-Time Tracking:** Instant status updates, vehicle locations, speeds, and localized weather conditions powered by persistent WebSocket connections[cite: 17, 81, 97].
* [cite_start]**Emergency Weather Alerts:** Instantaneous event broadcasting from fleet managers to target vehicle drivers via Socket.io during critical weather anomalies[cite: 17, 98].

---

##  Technology Stack & Architecture

[cite_start]S-WINDS is built on a robust, scalable architecture using industry-standard tools and modern optimization techniques[cite: 3, 19].

| Layer | Technology | Purpose & Implementation Details |
| :--- | :--- | :--- |
| **Frontend** | [cite_start]`React.js`  | [cite_start]Fast, component-based, highly responsive interface. |
| **PWA** | [cite_start]`Service Workers` & `Manifest`  | [cite_start]Enables mobile installation, offline capabilities, and removes App Store reliance. |
| **State Management** | [cite_start]`Redux Toolkit`  | [cite_start]Centralized state tracking for trips, active weather data, and vehicle/fleet states. |
| **Forms & Validation** | [cite_start]`React Hook Form`  | [cite_start]Optimized form handling for user/vehicle registration and fleet setups. |
| **HTTP Client** | [cite_start]`Axios` + Interceptors  | [cite_start]Automated JWT authorization token attachment on outbound requests. |
| **Routing (Client)** | [cite_start]`React Router DOM`  | [cite_start]Declarative navigation featuring protected routing separating users from fleet managers. |
| **Backend** | [cite_start]`Node.js` + `Express.js`  | [cite_start]High-performance asynchronous execution for heavy API workloads. |
| **Architecture** | [cite_start]`MVC Pattern` [cite: 19, 38] | [cite_start]Strict separation of Models (schemas), Controllers (logic), and Routes[cite: 19, 134]. |
| **Database** | [cite_start]`MongoDB` + `Mongoose`  | [cite_start]Document storage for users, trip history, fleet vehicles, and geohashed caches[cite: 19, 81]. |
| **Real-Time** | [cite_start]`Socket.io`  | [cite_start]Full-duplex WebSocket channels for instant, real-time fleet synchronization[cite: 17, 19, 139]. |
| **Security/Auth** | [cite_start]`JWT` (Access & Refresh Tokens)  | [cite_start]Dual-token rotation securely handled inside `HttpOnly` Cookies[cite: 19, 135, 136]. |
| **API Validation** | [cite_start]`Joi` or `Zod`  | [cite_start]Strict runtime validation schema enforcement on incoming API payloads. |
| **File Storage** | [cite_start]`Multer`  | [cite_start]Multipart form handling for uploading vehicle and user profile media assets. |
| **Mapping Engine** | [cite_start]`OSRM` / `Mapbox`  | [cite_start]OSRM open-source routing for MVP, transitioning to rich Mapbox custom vector tiles[cite: 19, 25]. |
| **Weather Source** | [cite_start]`Tomorrow.io` / `OpenWeatherMap` [cite: 23] | [cite_start]Hyper-local road forecasts integrated alongside OpenWeatherMap fallback channels[cite: 23, 26]. |

---

##  The Core Algorithm: 5-Step Route Weather Matching

[cite_start]The system minimizes API consumption overhead and provides real-time situational precision through a custom geospatial computation loop[cite: 101]:

1. [cite_start]**Request Reception:** Receives the coordinate payload `(Origin, Destination)`, `vehicleType`, and requested `departureTime`[cite: 104].
2. [cite_start]**Polyline Acquisition:** Polls the Routing engine API (OSRM/Mapbox) to calculate the full journey polyline array and runtime durations[cite: 105].
3. [cite_start]**Temporal Waypoint Sampling:** Samples the route coordinates at time-based intervals (every ~30 minutes of driving time) rather than fixed spatial steps[cite: 106].
4. **ETA Offset Calculation:** Computes an absolute arrival time for each waypoint element:
   [cite_start]$$\text{ETA}_{\text{waypoint}} = \text{departureTime} + \text{accumulatedDriveTime}$$ [cite: 107]
5. [cite_start]**Geohash Cache Optimization:** Converts latitude and longitude into an alphanumeric string representing a 5x5 km geographic grid cell (Precision 5)[cite: 111, 115, 137]. 
   * [cite_start]**Cache Hit:** If the `geohash` paired with the rounded forecast hour exists in the database cache, it returns the stored weather instantly[cite: 108, 122]. [cite_start]**Result: 0% external API cost.** [cite: 122]
   * [cite_start]**Cache Miss:** Queries the `Tomorrow.io` API for that exact segment/time, writes the data to the cache collection utilizing a **30-minute MongoDB TTL index**, and resolves the response[cite: 81, 109, 125].

---

##  Project Directory Structure

```text
S-WINDS/
├── backend/
│   ├── src/
[cite_start]│   │   ├── config/       # Database connection & environment configuration [cite: 47, 48]
[cite_start]│   │   ├── controllers/  # Business logic (authController, routeController, etc.) [cite: 42]
[cite_start]│   │   ├── middlewares/  # Authentication checks, body validations, global errors [cite: 43, 141]
[cite_start]│   │   ├── models/       # Mongoose schemas (User, Trip, WeatherCache, Ad, FleetVehicle) [cite: 41, 81]
[cite_start]│   │   ├── routes/       # Express structural routing endpoints [cite: 42, 134]
[cite_start]│   │   ├── services/     # Third-party integrations (weatherService, mapService) [cite: 44]
[cite_start]│   │   └── utils/        # Geohashing operations, ETA calculators, helper scripts [cite: 45, 46]
[cite_start]│   ├── app.js            # Express app configuration & middleware pipeline [cite: 52, 53]
[cite_start]│   ├── server.js         # Entry point: HTTP Server & Socket.io socket initialization [cite: 54, 55]
[cite_start]│   ├── .env              # Backend local environment keys (Ignored by Git) [cite: 29, 49, 50]
│   └── .gitignore
└── frontend/
    ├── public/
    [cite_start]│   ├── manifest.json # PWA App metadata, branding assets, theme parameters [cite: 59, 62]
    │   └── sw.js         # Service Worker script managing offline assets & caching [cite: 60, 63]
    ├── src/
    │   ├── api/          # Axios configurations, interceptors, API requests [cite: 64, 65]
    │   ├── components/   # Modular structural UI elements (WeatherPin, SpeedBadge, AdCard) [cite: 66]
    │   ├── hooks/        # Custom react hooks (useGeolocation, useWeatherRoute) [cite: 70, 71]
    │   ├── pages/        # High-level screens (Home, PlanTrip, DriveMode, B2BDashboard) [cite: 67, 69]
    │   ├── store/        # Redux Toolkit global state store and individual slices [cite: 68, 69]
    │   ├── utils/        # Front-end formatters and visual color pickers [cite: 72, 73]
    │   ├── App.jsx       # Client-side React Router protected route map configuration [cite: 74, 75]
    │   └── main.jsx      # React runtime entry point & Redux state context provider [cite: 76, 77]
    ├── .env              # Frontend client environment declarations 
    └── .gitignore