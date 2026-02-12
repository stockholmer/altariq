/**
 * Predefined city list for location selection.
 *
 * Includes:
 * - Capitals + major cities of Muslim-majority countries
 * - All EU member state capitals
 * - All US state capitals + Washington DC
 * - Select cities from India, China, UK, Canada, Australia
 */

export interface City {
  city: string;
  country: string;
  lat: number;
  lon: number;
  timezone: string;
  region: string;
}

// ---------------------------------------------------------------------------
// Middle East & Arabian Peninsula
// ---------------------------------------------------------------------------
const MIDDLE_EAST: City[] = [
  { city: "Mecca", country: "Saudi Arabia", lat: 21.4225, lon: 39.8262, timezone: "Asia/Riyadh", region: "middle_east" },
  { city: "Medina", country: "Saudi Arabia", lat: 24.4672, lon: 39.6112, timezone: "Asia/Riyadh", region: "middle_east" },
  { city: "Riyadh", country: "Saudi Arabia", lat: 24.7136, lon: 46.6753, timezone: "Asia/Riyadh", region: "middle_east" },
  { city: "Jeddah", country: "Saudi Arabia", lat: 21.4858, lon: 39.1925, timezone: "Asia/Riyadh", region: "middle_east" },
  { city: "Abu Dhabi", country: "UAE", lat: 24.4539, lon: 54.3773, timezone: "Asia/Dubai", region: "middle_east" },
  { city: "Dubai", country: "UAE", lat: 25.2048, lon: 55.2708, timezone: "Asia/Dubai", region: "middle_east" },
  { city: "Sharjah", country: "UAE", lat: 25.3463, lon: 55.4209, timezone: "Asia/Dubai", region: "middle_east" },
  { city: "Doha", country: "Qatar", lat: 25.2854, lon: 51.5310, timezone: "Asia/Qatar", region: "middle_east" },
  { city: "Kuwait City", country: "Kuwait", lat: 29.3759, lon: 47.9774, timezone: "Asia/Kuwait", region: "middle_east" },
  { city: "Manama", country: "Bahrain", lat: 26.2235, lon: 50.5876, timezone: "Asia/Bahrain", region: "middle_east" },
  { city: "Muscat", country: "Oman", lat: 23.5880, lon: 58.3829, timezone: "Asia/Muscat", region: "middle_east" },
  { city: "Sana'a", country: "Yemen", lat: 15.3694, lon: 44.1910, timezone: "Asia/Aden", region: "middle_east" },
  { city: "Aden", country: "Yemen", lat: 12.7855, lon: 45.0187, timezone: "Asia/Aden", region: "middle_east" },
  { city: "Amman", country: "Jordan", lat: 31.9454, lon: 35.9284, timezone: "Asia/Amman", region: "middle_east" },
  { city: "Beirut", country: "Lebanon", lat: 33.8938, lon: 35.5018, timezone: "Asia/Beirut", region: "middle_east" },
  { city: "Damascus", country: "Syria", lat: 33.5138, lon: 36.2765, timezone: "Asia/Damascus", region: "middle_east" },
  { city: "Baghdad", country: "Iraq", lat: 33.3152, lon: 44.3661, timezone: "Asia/Baghdad", region: "middle_east" },
  { city: "Basra", country: "Iraq", lat: 30.5085, lon: 47.7804, timezone: "Asia/Baghdad", region: "middle_east" },
  { city: "Erbil", country: "Iraq", lat: 36.1901, lon: 44.0091, timezone: "Asia/Baghdad", region: "middle_east" },
  { city: "Jerusalem", country: "Palestine", lat: 31.7683, lon: 35.2137, timezone: "Asia/Jerusalem", region: "middle_east" },
  { city: "Gaza", country: "Palestine", lat: 31.5017, lon: 34.4668, timezone: "Asia/Gaza", region: "middle_east" },
  { city: "Ramallah", country: "Palestine", lat: 31.9038, lon: 35.2034, timezone: "Asia/Hebron", region: "middle_east" },
];

// ---------------------------------------------------------------------------
// South Asia
// ---------------------------------------------------------------------------
const SOUTH_ASIA: City[] = [
  { city: "Islamabad", country: "Pakistan", lat: 33.6844, lon: 73.0479, timezone: "Asia/Karachi", region: "south_asia" },
  { city: "Karachi", country: "Pakistan", lat: 24.8607, lon: 67.0011, timezone: "Asia/Karachi", region: "south_asia" },
  { city: "Lahore", country: "Pakistan", lat: 31.5204, lon: 74.3587, timezone: "Asia/Karachi", region: "south_asia" },
  { city: "Peshawar", country: "Pakistan", lat: 34.0151, lon: 71.5249, timezone: "Asia/Karachi", region: "south_asia" },
  { city: "Faisalabad", country: "Pakistan", lat: 31.4187, lon: 73.0791, timezone: "Asia/Karachi", region: "south_asia" },
  { city: "Rawalpindi", country: "Pakistan", lat: 33.5651, lon: 73.0169, timezone: "Asia/Karachi", region: "south_asia" },
  { city: "Multan", country: "Pakistan", lat: 30.1575, lon: 71.5249, timezone: "Asia/Karachi", region: "south_asia" },
  { city: "Dhaka", country: "Bangladesh", lat: 23.8103, lon: 90.4125, timezone: "Asia/Dhaka", region: "south_asia" },
  { city: "Chittagong", country: "Bangladesh", lat: 22.3569, lon: 91.7832, timezone: "Asia/Dhaka", region: "south_asia" },
  { city: "Sylhet", country: "Bangladesh", lat: 24.8949, lon: 91.8687, timezone: "Asia/Dhaka", region: "south_asia" },
  { city: "Kabul", country: "Afghanistan", lat: 34.5553, lon: 69.2075, timezone: "Asia/Kabul", region: "south_asia" },
  { city: "Herat", country: "Afghanistan", lat: 34.3529, lon: 62.2040, timezone: "Asia/Kabul", region: "south_asia" },
  { city: "Male", country: "Maldives", lat: 4.1755, lon: 73.5093, timezone: "Indian/Maldives", region: "south_asia" },
  // India (large Muslim population)
  { city: "New Delhi", country: "India", lat: 28.6139, lon: 77.2090, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Mumbai", country: "India", lat: 19.0760, lon: 72.8777, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Hyderabad", country: "India", lat: 17.3850, lon: 78.4867, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Lucknow", country: "India", lat: 26.8467, lon: 80.9462, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Kolkata", country: "India", lat: 22.5726, lon: 88.3639, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Chennai", country: "India", lat: 13.0827, lon: 80.2707, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Bangalore", country: "India", lat: 12.9716, lon: 77.5946, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Srinagar", country: "India", lat: 34.0837, lon: 74.7973, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Bhopal", country: "India", lat: 23.2599, lon: 77.4126, timezone: "Asia/Kolkata", region: "south_asia" },
  { city: "Colombo", country: "Sri Lanka", lat: 6.9271, lon: 79.8612, timezone: "Asia/Colombo", region: "south_asia" },
];

// ---------------------------------------------------------------------------
// Southeast Asia
// ---------------------------------------------------------------------------
const SOUTHEAST_ASIA: City[] = [
  { city: "Jakarta", country: "Indonesia", lat: -6.2088, lon: 106.8456, timezone: "Asia/Jakarta", region: "southeast_asia" },
  { city: "Surabaya", country: "Indonesia", lat: -7.2575, lon: 112.7521, timezone: "Asia/Jakarta", region: "southeast_asia" },
  { city: "Bandung", country: "Indonesia", lat: -6.9175, lon: 107.6191, timezone: "Asia/Jakarta", region: "southeast_asia" },
  { city: "Yogyakarta", country: "Indonesia", lat: -7.7956, lon: 110.3695, timezone: "Asia/Jakarta", region: "southeast_asia" },
  { city: "Medan", country: "Indonesia", lat: 3.5952, lon: 98.6722, timezone: "Asia/Jakarta", region: "southeast_asia" },
  { city: "Makassar", country: "Indonesia", lat: -5.1477, lon: 119.4327, timezone: "Asia/Makassar", region: "southeast_asia" },
  { city: "Kuala Lumpur", country: "Malaysia", lat: 3.1390, lon: 101.6869, timezone: "Asia/Kuala_Lumpur", region: "southeast_asia" },
  { city: "Penang", country: "Malaysia", lat: 5.4164, lon: 100.3327, timezone: "Asia/Kuala_Lumpur", region: "southeast_asia" },
  { city: "Johor Bahru", country: "Malaysia", lat: 1.4927, lon: 103.7414, timezone: "Asia/Kuala_Lumpur", region: "southeast_asia" },
  { city: "Bandar Seri Begawan", country: "Brunei", lat: 4.9031, lon: 114.9398, timezone: "Asia/Brunei", region: "southeast_asia" },
  { city: "Singapore", country: "Singapore", lat: 1.3521, lon: 103.8198, timezone: "Asia/Singapore", region: "southeast_asia" },
  { city: "Bangkok", country: "Thailand", lat: 13.7563, lon: 100.5018, timezone: "Asia/Bangkok", region: "southeast_asia" },
  { city: "Manila", country: "Philippines", lat: 14.5995, lon: 120.9842, timezone: "Asia/Manila", region: "southeast_asia" },
];

// ---------------------------------------------------------------------------
// Iran & Central Asia
// ---------------------------------------------------------------------------
const CENTRAL_ASIA: City[] = [
  { city: "Tehran", country: "Iran", lat: 35.6892, lon: 51.3890, timezone: "Asia/Tehran", region: "central_asia" },
  { city: "Isfahan", country: "Iran", lat: 32.6546, lon: 51.6680, timezone: "Asia/Tehran", region: "central_asia" },
  { city: "Mashhad", country: "Iran", lat: 36.2605, lon: 59.6168, timezone: "Asia/Tehran", region: "central_asia" },
  { city: "Tabriz", country: "Iran", lat: 38.0800, lon: 46.2919, timezone: "Asia/Tehran", region: "central_asia" },
  { city: "Shiraz", country: "Iran", lat: 29.5918, lon: 52.5837, timezone: "Asia/Tehran", region: "central_asia" },
  { city: "Qom", country: "Iran", lat: 34.6401, lon: 50.8764, timezone: "Asia/Tehran", region: "central_asia" },
  { city: "Tashkent", country: "Uzbekistan", lat: 41.2995, lon: 69.2401, timezone: "Asia/Tashkent", region: "central_asia" },
  { city: "Samarkand", country: "Uzbekistan", lat: 39.6542, lon: 66.9597, timezone: "Asia/Samarkand", region: "central_asia" },
  { city: "Bukhara", country: "Uzbekistan", lat: 39.7681, lon: 64.4556, timezone: "Asia/Samarkand", region: "central_asia" },
  { city: "Astana", country: "Kazakhstan", lat: 51.1694, lon: 71.4491, timezone: "Asia/Almaty", region: "central_asia" },
  { city: "Almaty", country: "Kazakhstan", lat: 43.2220, lon: 76.8512, timezone: "Asia/Almaty", region: "central_asia" },
  { city: "Dushanbe", country: "Tajikistan", lat: 38.5598, lon: 68.7740, timezone: "Asia/Dushanbe", region: "central_asia" },
  { city: "Ashgabat", country: "Turkmenistan", lat: 37.9601, lon: 58.3261, timezone: "Asia/Ashgabat", region: "central_asia" },
  { city: "Bishkek", country: "Kyrgyzstan", lat: 42.8746, lon: 74.5698, timezone: "Asia/Bishkek", region: "central_asia" },
  { city: "Baku", country: "Azerbaijan", lat: 40.4093, lon: 49.8671, timezone: "Asia/Baku", region: "central_asia" },
];

// ---------------------------------------------------------------------------
// Turkey
// ---------------------------------------------------------------------------
const TURKEY: City[] = [
  { city: "Ankara", country: "Turkey", lat: 39.9334, lon: 32.8597, timezone: "Europe/Istanbul", region: "turkey" },
  { city: "Istanbul", country: "Turkey", lat: 41.0082, lon: 28.9784, timezone: "Europe/Istanbul", region: "turkey" },
  { city: "Izmir", country: "Turkey", lat: 38.4192, lon: 27.1287, timezone: "Europe/Istanbul", region: "turkey" },
  { city: "Bursa", country: "Turkey", lat: 40.1885, lon: 29.0610, timezone: "Europe/Istanbul", region: "turkey" },
  { city: "Konya", country: "Turkey", lat: 37.8746, lon: 32.4932, timezone: "Europe/Istanbul", region: "turkey" },
];

// ---------------------------------------------------------------------------
// North Africa
// ---------------------------------------------------------------------------
const NORTH_AFRICA: City[] = [
  { city: "Cairo", country: "Egypt", lat: 30.0444, lon: 31.2357, timezone: "Africa/Cairo", region: "north_africa" },
  { city: "Alexandria", country: "Egypt", lat: 31.2001, lon: 29.9187, timezone: "Africa/Cairo", region: "north_africa" },
  { city: "Tripoli", country: "Libya", lat: 32.8872, lon: 13.1913, timezone: "Africa/Tripoli", region: "north_africa" },
  { city: "Tunis", country: "Tunisia", lat: 36.8065, lon: 10.1815, timezone: "Africa/Tunis", region: "north_africa" },
  { city: "Algiers", country: "Algeria", lat: 36.7538, lon: 3.0588, timezone: "Africa/Algiers", region: "north_africa" },
  { city: "Oran", country: "Algeria", lat: 35.6969, lon: -0.6331, timezone: "Africa/Algiers", region: "north_africa" },
  { city: "Rabat", country: "Morocco", lat: 34.0209, lon: -6.8416, timezone: "Africa/Casablanca", region: "north_africa" },
  { city: "Casablanca", country: "Morocco", lat: 33.5731, lon: -7.5898, timezone: "Africa/Casablanca", region: "north_africa" },
  { city: "Marrakech", country: "Morocco", lat: 31.6295, lon: -7.9811, timezone: "Africa/Casablanca", region: "north_africa" },
  { city: "Fez", country: "Morocco", lat: 34.0331, lon: -5.0003, timezone: "Africa/Casablanca", region: "north_africa" },
  { city: "Khartoum", country: "Sudan", lat: 15.5007, lon: 32.5599, timezone: "Africa/Khartoum", region: "north_africa" },
  { city: "Nouakchott", country: "Mauritania", lat: 18.0735, lon: -15.9582, timezone: "Africa/Nouakchott", region: "north_africa" },
];

// ---------------------------------------------------------------------------
// Sub-Saharan Africa (Muslim-majority/significant)
// ---------------------------------------------------------------------------
const SUBSAHARAN_AFRICA: City[] = [
  { city: "Mogadishu", country: "Somalia", lat: 2.0469, lon: 45.3182, timezone: "Africa/Mogadishu", region: "africa" },
  { city: "Djibouti", country: "Djibouti", lat: 11.5721, lon: 43.1456, timezone: "Africa/Djibouti", region: "africa" },
  { city: "Abuja", country: "Nigeria", lat: 9.0765, lon: 7.3986, timezone: "Africa/Lagos", region: "africa" },
  { city: "Lagos", country: "Nigeria", lat: 6.5244, lon: 3.3792, timezone: "Africa/Lagos", region: "africa" },
  { city: "Kano", country: "Nigeria", lat: 12.0022, lon: 8.5920, timezone: "Africa/Lagos", region: "africa" },
  { city: "Dakar", country: "Senegal", lat: 14.7167, lon: -17.4677, timezone: "Africa/Dakar", region: "africa" },
  { city: "Bamako", country: "Mali", lat: 12.6392, lon: -8.0029, timezone: "Africa/Bamako", region: "africa" },
  { city: "Niamey", country: "Niger", lat: 13.5127, lon: 2.1128, timezone: "Africa/Niamey", region: "africa" },
  { city: "Conakry", country: "Guinea", lat: 9.6412, lon: -13.5784, timezone: "Africa/Conakry", region: "africa" },
  { city: "Dar es Salaam", country: "Tanzania", lat: -6.7924, lon: 39.2083, timezone: "Africa/Dar_es_Salaam", region: "africa" },
  { city: "Nairobi", country: "Kenya", lat: -1.2921, lon: 36.8219, timezone: "Africa/Nairobi", region: "africa" },
  { city: "Addis Ababa", country: "Ethiopia", lat: 9.0250, lon: 38.7469, timezone: "Africa/Addis_Ababa", region: "africa" },
];

// ---------------------------------------------------------------------------
// European Union (27 capitals)
// ---------------------------------------------------------------------------
const EU_CAPITALS: City[] = [
  { city: "Vienna", country: "Austria", lat: 48.2082, lon: 16.3738, timezone: "Europe/Vienna", region: "europe" },
  { city: "Brussels", country: "Belgium", lat: 50.8503, lon: 4.3517, timezone: "Europe/Brussels", region: "europe" },
  { city: "Sofia", country: "Bulgaria", lat: 42.6977, lon: 23.3219, timezone: "Europe/Sofia", region: "europe" },
  { city: "Zagreb", country: "Croatia", lat: 45.8150, lon: 15.9819, timezone: "Europe/Zagreb", region: "europe" },
  { city: "Nicosia", country: "Cyprus", lat: 35.1856, lon: 33.3823, timezone: "Asia/Nicosia", region: "europe" },
  { city: "Prague", country: "Czech Republic", lat: 50.0755, lon: 14.4378, timezone: "Europe/Prague", region: "europe" },
  { city: "Copenhagen", country: "Denmark", lat: 55.6761, lon: 12.5683, timezone: "Europe/Copenhagen", region: "europe" },
  { city: "Tallinn", country: "Estonia", lat: 59.4370, lon: 24.7536, timezone: "Europe/Tallinn", region: "europe" },
  { city: "Helsinki", country: "Finland", lat: 60.1699, lon: 24.9384, timezone: "Europe/Helsinki", region: "europe" },
  { city: "Paris", country: "France", lat: 48.8566, lon: 2.3522, timezone: "Europe/Paris", region: "europe" },
  { city: "Berlin", country: "Germany", lat: 52.5200, lon: 13.4050, timezone: "Europe/Berlin", region: "europe" },
  { city: "Athens", country: "Greece", lat: 37.9838, lon: 23.7275, timezone: "Europe/Athens", region: "europe" },
  { city: "Budapest", country: "Hungary", lat: 47.4979, lon: 19.0402, timezone: "Europe/Budapest", region: "europe" },
  { city: "Dublin", country: "Ireland", lat: 53.3498, lon: -6.2603, timezone: "Europe/Dublin", region: "europe" },
  { city: "Rome", country: "Italy", lat: 41.9028, lon: 12.4964, timezone: "Europe/Rome", region: "europe" },
  { city: "Riga", country: "Latvia", lat: 56.9496, lon: 24.1052, timezone: "Europe/Riga", region: "europe" },
  { city: "Vilnius", country: "Lithuania", lat: 54.6872, lon: 25.2797, timezone: "Europe/Vilnius", region: "europe" },
  { city: "Luxembourg", country: "Luxembourg", lat: 49.6116, lon: 6.1319, timezone: "Europe/Luxembourg", region: "europe" },
  { city: "Valletta", country: "Malta", lat: 35.8989, lon: 14.5146, timezone: "Europe/Malta", region: "europe" },
  { city: "Amsterdam", country: "Netherlands", lat: 52.3676, lon: 4.9041, timezone: "Europe/Amsterdam", region: "europe" },
  { city: "Warsaw", country: "Poland", lat: 52.2297, lon: 21.0122, timezone: "Europe/Warsaw", region: "europe" },
  { city: "Lisbon", country: "Portugal", lat: 38.7223, lon: -9.1393, timezone: "Europe/Lisbon", region: "europe" },
  { city: "Bucharest", country: "Romania", lat: 44.4268, lon: 26.1025, timezone: "Europe/Bucharest", region: "europe" },
  { city: "Bratislava", country: "Slovakia", lat: 48.1486, lon: 17.1077, timezone: "Europe/Bratislava", region: "europe" },
  { city: "Ljubljana", country: "Slovenia", lat: 46.0569, lon: 14.5058, timezone: "Europe/Ljubljana", region: "europe" },
  { city: "Madrid", country: "Spain", lat: 40.4168, lon: -3.7038, timezone: "Europe/Madrid", region: "europe" },
  { city: "Stockholm", country: "Sweden", lat: 59.3293, lon: 18.0686, timezone: "Europe/Stockholm", region: "europe" },
];

// ---------------------------------------------------------------------------
// Other European (non-EU but significant)
// ---------------------------------------------------------------------------
const EUROPE_OTHER: City[] = [
  { city: "London", country: "United Kingdom", lat: 51.5074, lon: -0.1278, timezone: "Europe/London", region: "europe" },
  { city: "Birmingham", country: "United Kingdom", lat: 52.4862, lon: -1.8904, timezone: "Europe/London", region: "europe" },
  { city: "Manchester", country: "United Kingdom", lat: 53.4808, lon: -2.2426, timezone: "Europe/London", region: "europe" },
  { city: "Edinburgh", country: "United Kingdom", lat: 55.9533, lon: -3.1883, timezone: "Europe/London", region: "europe" },
  { city: "Oslo", country: "Norway", lat: 59.9139, lon: 10.7522, timezone: "Europe/Oslo", region: "europe" },
  { city: "Bern", country: "Switzerland", lat: 46.9480, lon: 7.4474, timezone: "Europe/Zurich", region: "europe" },
  { city: "Sarajevo", country: "Bosnia & Herzegovina", lat: 43.8563, lon: 18.4131, timezone: "Europe/Sarajevo", region: "europe" },
  { city: "Tirana", country: "Albania", lat: 41.3275, lon: 19.8187, timezone: "Europe/Tirane", region: "europe" },
  { city: "Skopje", country: "North Macedonia", lat: 41.9973, lon: 21.4280, timezone: "Europe/Skopje", region: "europe" },
  { city: "Pristina", country: "Kosovo", lat: 42.6629, lon: 21.1655, timezone: "Europe/Belgrade", region: "europe" },
  { city: "Belgrade", country: "Serbia", lat: 44.7866, lon: 20.4489, timezone: "Europe/Belgrade", region: "europe" },
  { city: "Podgorica", country: "Montenegro", lat: 42.4304, lon: 19.2594, timezone: "Europe/Podgorica", region: "europe" },
  { city: "Kyiv", country: "Ukraine", lat: 50.4501, lon: 30.5234, timezone: "Europe/Kyiv", region: "europe" },
  { city: "Moscow", country: "Russia", lat: 55.7558, lon: 37.6173, timezone: "Europe/Moscow", region: "europe" },
  { city: "Kazan", country: "Russia", lat: 55.7879, lon: 49.1233, timezone: "Europe/Moscow", region: "europe" },
  { city: "Grozny", country: "Russia", lat: 43.3180, lon: 45.6946, timezone: "Europe/Moscow", region: "europe" },
  { city: "Tbilisi", country: "Georgia", lat: 41.7151, lon: 44.8271, timezone: "Asia/Tbilisi", region: "europe" },
  { city: "Yerevan", country: "Armenia", lat: 40.1792, lon: 44.4991, timezone: "Asia/Yerevan", region: "europe" },
];

// ---------------------------------------------------------------------------
// US State Capitals + DC
// ---------------------------------------------------------------------------
const US_CAPITALS: City[] = [
  { city: "Washington, D.C.", country: "United States", lat: 38.9072, lon: -77.0369, timezone: "America/New_York", region: "north_america" },
  { city: "Montgomery", country: "United States", lat: 32.3792, lon: -86.3077, timezone: "America/Chicago", region: "north_america" },
  { city: "Juneau", country: "United States", lat: 58.3005, lon: -134.4197, timezone: "America/Anchorage", region: "north_america" },
  { city: "Phoenix", country: "United States", lat: 33.4484, lon: -112.0740, timezone: "America/Phoenix", region: "north_america" },
  { city: "Little Rock", country: "United States", lat: 34.7465, lon: -92.2896, timezone: "America/Chicago", region: "north_america" },
  { city: "Sacramento", country: "United States", lat: 38.5816, lon: -121.4944, timezone: "America/Los_Angeles", region: "north_america" },
  { city: "Denver", country: "United States", lat: 39.7392, lon: -104.9903, timezone: "America/Denver", region: "north_america" },
  { city: "Hartford", country: "United States", lat: 41.7658, lon: -72.6734, timezone: "America/New_York", region: "north_america" },
  { city: "Dover", country: "United States", lat: 39.1582, lon: -75.5244, timezone: "America/New_York", region: "north_america" },
  { city: "Tallahassee", country: "United States", lat: 30.4383, lon: -84.2807, timezone: "America/New_York", region: "north_america" },
  { city: "Atlanta", country: "United States", lat: 33.7490, lon: -84.3880, timezone: "America/New_York", region: "north_america" },
  { city: "Honolulu", country: "United States", lat: 21.3069, lon: -157.8583, timezone: "Pacific/Honolulu", region: "north_america" },
  { city: "Boise", country: "United States", lat: 43.6150, lon: -116.2023, timezone: "America/Boise", region: "north_america" },
  { city: "Springfield", country: "United States", lat: 39.7817, lon: -89.6501, timezone: "America/Chicago", region: "north_america" },
  { city: "Indianapolis", country: "United States", lat: 39.7684, lon: -86.1581, timezone: "America/Indiana/Indianapolis", region: "north_america" },
  { city: "Des Moines", country: "United States", lat: 41.5868, lon: -93.6250, timezone: "America/Chicago", region: "north_america" },
  { city: "Topeka", country: "United States", lat: 39.0473, lon: -95.6752, timezone: "America/Chicago", region: "north_america" },
  { city: "Frankfort", country: "United States", lat: 38.2009, lon: -84.8733, timezone: "America/New_York", region: "north_america" },
  { city: "Baton Rouge", country: "United States", lat: 30.4515, lon: -91.1871, timezone: "America/Chicago", region: "north_america" },
  { city: "Augusta", country: "United States", lat: 44.3106, lon: -69.7795, timezone: "America/New_York", region: "north_america" },
  { city: "Annapolis", country: "United States", lat: 38.9784, lon: -76.4922, timezone: "America/New_York", region: "north_america" },
  { city: "Boston", country: "United States", lat: 42.3601, lon: -71.0589, timezone: "America/New_York", region: "north_america" },
  { city: "Lansing", country: "United States", lat: 42.7325, lon: -84.5555, timezone: "America/Detroit", region: "north_america" },
  { city: "Saint Paul", country: "United States", lat: 44.9537, lon: -93.0900, timezone: "America/Chicago", region: "north_america" },
  { city: "Jackson", country: "United States", lat: 32.2988, lon: -90.1848, timezone: "America/Chicago", region: "north_america" },
  { city: "Jefferson City", country: "United States", lat: 38.5767, lon: -92.1735, timezone: "America/Chicago", region: "north_america" },
  { city: "Helena", country: "United States", lat: 46.5884, lon: -112.0245, timezone: "America/Denver", region: "north_america" },
  { city: "Lincoln", country: "United States", lat: 40.8136, lon: -96.7026, timezone: "America/Chicago", region: "north_america" },
  { city: "Carson City", country: "United States", lat: 39.1638, lon: -119.7674, timezone: "America/Los_Angeles", region: "north_america" },
  { city: "Concord", country: "United States", lat: 43.2081, lon: -71.5376, timezone: "America/New_York", region: "north_america" },
  { city: "Trenton", country: "United States", lat: 40.2171, lon: -74.7429, timezone: "America/New_York", region: "north_america" },
  { city: "Santa Fe", country: "United States", lat: 35.6870, lon: -105.9378, timezone: "America/Denver", region: "north_america" },
  { city: "Albany", country: "United States", lat: 42.6526, lon: -73.7562, timezone: "America/New_York", region: "north_america" },
  { city: "Raleigh", country: "United States", lat: 35.7796, lon: -78.6382, timezone: "America/New_York", region: "north_america" },
  { city: "Bismarck", country: "United States", lat: 46.8083, lon: -100.7837, timezone: "America/Chicago", region: "north_america" },
  { city: "Columbus", country: "United States", lat: 39.9612, lon: -82.9988, timezone: "America/New_York", region: "north_america" },
  { city: "Oklahoma City", country: "United States", lat: 35.4676, lon: -97.5164, timezone: "America/Chicago", region: "north_america" },
  { city: "Salem", country: "United States", lat: 44.9429, lon: -123.0351, timezone: "America/Los_Angeles", region: "north_america" },
  { city: "Harrisburg", country: "United States", lat: 40.2732, lon: -76.8867, timezone: "America/New_York", region: "north_america" },
  { city: "Providence", country: "United States", lat: 41.8240, lon: -71.4128, timezone: "America/New_York", region: "north_america" },
  { city: "Columbia", country: "United States", lat: 34.0007, lon: -81.0348, timezone: "America/New_York", region: "north_america" },
  { city: "Pierre", country: "United States", lat: 44.3683, lon: -100.3510, timezone: "America/Chicago", region: "north_america" },
  { city: "Nashville", country: "United States", lat: 36.1627, lon: -86.7816, timezone: "America/Chicago", region: "north_america" },
  { city: "Austin", country: "United States", lat: 30.2672, lon: -97.7431, timezone: "America/Chicago", region: "north_america" },
  { city: "Salt Lake City", country: "United States", lat: 40.7608, lon: -111.8910, timezone: "America/Denver", region: "north_america" },
  { city: "Montpelier", country: "United States", lat: 44.2601, lon: -72.5754, timezone: "America/New_York", region: "north_america" },
  { city: "Richmond", country: "United States", lat: 37.5407, lon: -77.4360, timezone: "America/New_York", region: "north_america" },
  { city: "Olympia", country: "United States", lat: 47.0379, lon: -122.9007, timezone: "America/Los_Angeles", region: "north_america" },
  { city: "Charleston", country: "United States", lat: 38.3498, lon: -81.6326, timezone: "America/New_York", region: "north_america" },
  { city: "Madison", country: "United States", lat: 43.0731, lon: -89.4012, timezone: "America/Chicago", region: "north_america" },
  { city: "Cheyenne", country: "United States", lat: 41.1400, lon: -104.8202, timezone: "America/Denver", region: "north_america" },
];

// ---------------------------------------------------------------------------
// Canada & Other Americas
// ---------------------------------------------------------------------------
const AMERICAS_OTHER: City[] = [
  { city: "Ottawa", country: "Canada", lat: 45.4215, lon: -75.6972, timezone: "America/Toronto", region: "north_america" },
  { city: "Toronto", country: "Canada", lat: 43.6532, lon: -79.3832, timezone: "America/Toronto", region: "north_america" },
  { city: "Vancouver", country: "Canada", lat: 49.2827, lon: -123.1207, timezone: "America/Vancouver", region: "north_america" },
  { city: "Montreal", country: "Canada", lat: 45.5017, lon: -73.5673, timezone: "America/Toronto", region: "north_america" },
  { city: "Calgary", country: "Canada", lat: 51.0447, lon: -114.0719, timezone: "America/Edmonton", region: "north_america" },
  // Major US cities (not state capitals but large Muslim communities)
  { city: "New York", country: "United States", lat: 40.7128, lon: -74.0060, timezone: "America/New_York", region: "north_america" },
  { city: "Los Angeles", country: "United States", lat: 34.0522, lon: -118.2437, timezone: "America/Los_Angeles", region: "north_america" },
  { city: "Chicago", country: "United States", lat: 41.8781, lon: -87.6298, timezone: "America/Chicago", region: "north_america" },
  { city: "Houston", country: "United States", lat: 29.7604, lon: -95.3698, timezone: "America/Chicago", region: "north_america" },
  { city: "Detroit", country: "United States", lat: 42.3314, lon: -83.0458, timezone: "America/Detroit", region: "north_america" },
  { city: "Dearborn", country: "United States", lat: 42.3223, lon: -83.1763, timezone: "America/Detroit", region: "north_america" },
  { city: "San Francisco", country: "United States", lat: 37.7749, lon: -122.4194, timezone: "America/Los_Angeles", region: "north_america" },
  { city: "Miami", country: "United States", lat: 25.7617, lon: -80.1918, timezone: "America/New_York", region: "north_america" },
  { city: "Dallas", country: "United States", lat: 32.7767, lon: -96.7970, timezone: "America/Chicago", region: "north_america" },
  { city: "Seattle", country: "United States", lat: 47.6062, lon: -122.3321, timezone: "America/Los_Angeles", region: "north_america" },
  { city: "Minneapolis", country: "United States", lat: 44.9778, lon: -93.2650, timezone: "America/Chicago", region: "north_america" },
  { city: "Philadelphia", country: "United States", lat: 39.9526, lon: -75.1652, timezone: "America/New_York", region: "north_america" },
];

// ---------------------------------------------------------------------------
// Oceania
// ---------------------------------------------------------------------------
const OCEANIA: City[] = [
  { city: "Canberra", country: "Australia", lat: -35.2809, lon: 149.1300, timezone: "Australia/Sydney", region: "oceania" },
  { city: "Sydney", country: "Australia", lat: -33.8688, lon: 151.2093, timezone: "Australia/Sydney", region: "oceania" },
  { city: "Melbourne", country: "Australia", lat: -37.8136, lon: 144.9631, timezone: "Australia/Melbourne", region: "oceania" },
  { city: "Perth", country: "Australia", lat: -31.9505, lon: 115.8605, timezone: "Australia/Perth", region: "oceania" },
  { city: "Auckland", country: "New Zealand", lat: -36.8485, lon: 174.7633, timezone: "Pacific/Auckland", region: "oceania" },
];

// ---------------------------------------------------------------------------
// East Asia
// ---------------------------------------------------------------------------
const EAST_ASIA: City[] = [
  { city: "Beijing", country: "China", lat: 39.9042, lon: 116.4074, timezone: "Asia/Shanghai", region: "east_asia" },
  { city: "Urumqi", country: "China", lat: 43.8256, lon: 87.6168, timezone: "Asia/Urumqi", region: "east_asia" },
  { city: "Tokyo", country: "Japan", lat: 35.6762, lon: 139.6503, timezone: "Asia/Tokyo", region: "east_asia" },
  { city: "Seoul", country: "South Korea", lat: 37.5665, lon: 126.9780, timezone: "Asia/Seoul", region: "east_asia" },
];

// ---------------------------------------------------------------------------
// Combined & exported
// ---------------------------------------------------------------------------
export const CITIES: City[] = [
  ...MIDDLE_EAST,
  ...SOUTH_ASIA,
  ...SOUTHEAST_ASIA,
  ...CENTRAL_ASIA,
  ...TURKEY,
  ...NORTH_AFRICA,
  ...SUBSAHARAN_AFRICA,
  ...EU_CAPITALS,
  ...EUROPE_OTHER,
  ...US_CAPITALS,
  ...AMERICAS_OTHER,
  ...OCEANIA,
  ...EAST_ASIA,
];

/**
 * Region labels for grouping in the UI.
 */
export const REGION_LABELS: Record<string, string> = {
  middle_east: "Middle East",
  south_asia: "South Asia",
  southeast_asia: "Southeast Asia",
  central_asia: "Iran & Central Asia",
  turkey: "Turkey",
  north_africa: "North Africa",
  africa: "Sub-Saharan Africa",
  europe: "Europe",
  north_america: "North America",
  oceania: "Oceania",
  east_asia: "East Asia",
};
