# YatriGhar Frontend - Demo Version

This is a frontend-only demo version of the YatriGhar hotel booking application. All backend API calls have been removed and replaced with static dummy data for demonstration purposes.

## Features

- **Hotel room browsing and filtering** - 8 rooms across 4 hotels in different cities
- **Room details and booking simulation** (demo mode)
- **User bookings display** using dummy data (3 sample bookings)
- **Hotel owner dashboard** with static data (bookings, revenue stats)
- **Room management interface** (demo mode) - Add/List rooms functionality
- **Search and filtering** - By city, room type, price range
- **Responsive design** with Tailwind CSS
- **Exclusive offers** display (3 sample offers)
- **Customer testimonials** (3 sample reviews)

## Technologies Used

- React 19
- Vite
- React Router DOM
- Tailwind CSS
- Clerk for authentication
- React Hot Toast for notifications
- React Icons

## Demo Data

The application includes comprehensive dummy data:

- **8 Hotel Rooms** across 4 different hotels
- **4 Cities**: Kathmandu, Pokhara, Bhaktapur, Lalitpur
- **Room Types**: Single, Double, Deluxe, Family
- **3 User Bookings** with different payment statuses
- **Dashboard Statistics**: Total bookings and revenue
- **3 Exclusive Offers** with pricing and expiry dates
- **3 Customer Testimonials** with ratings

## How to Access Owner Dashboard

1. **Option 1**: Click the blue "Demo Dashboard" button in the navigation bar
2. **Option 2**: Navigate directly to `/owner` in the URL
3. **Option 3**: The dashboard automatically activates when visiting `/owner` routes

## Demo Mode Features

- All booking operations show "(Demo Mode)" in success messages
- Room availability is randomly simulated (70% chance of availability)
- Hotel registration is simulated without backend calls
- All data changes are temporary and not persisted
- Search functionality works with the included dummy cities

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Available Routes

- `/` - Home page with featured destinations and offers
- `/rooms` - All rooms with filtering and search
- `/rooms/:id` - Individual room details and booking
- `/my-bookings` - User's booking history (dummy data)
- `/owner` - Hotel owner dashboard
- `/owner/add-room` - Add new room (demo mode)
- `/owner/list-room` - Manage existing rooms

## Note

This is a demo version with no backend connectivity. All data is static and changes are not persisted. The application is designed to showcase the frontend functionality and user interface.
