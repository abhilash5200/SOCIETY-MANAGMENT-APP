# Facility Booking Module - Complete Implementation Guide

## Overview
This document provides a complete guide to the Facility Booking Module implemented for the Society Management App. The module allows residents to book society facilities while preventing duplicate bookings and maintaining proper booking records.

## Project Structure

### Backend (Node.js/Express)

#### Models
- **Facility** (`models/Facility.js`)
  - name: String (required)
  - description: String
  - location: String (required)
  - capacity: Number (required)
  - isActive: Boolean (default: true)
  - isPaid: Boolean (default: false)
  - price: Number (default: 0)
  - maxSlotsPerDay: Number (default: 8)
  - timestamps: createdAt, updatedAt

- **Booking** (`models/Booking.js`)
  - facility: ObjectId (ref: Facility)
  - flat: ObjectId (ref: Flat)
  - bookedBy: ObjectId (ref: User)
  - date: Date (required)
  - timeSlot: String (required)
  - status: String (enum: ["CONFIRMED", "CANCELLED", "COMPLETED"], default: "CONFIRMED")
  - timestamps: createdAt, updatedAt
  - Indexes: facility+date+timeSlot+status, bookedBy+date

#### Controllers
**facilityController.js** provides complete functionality:

**Facility Management**
- `createFacility(req, res)` - Admin creates facility
- `getFacilities(req, res)` - Get all active facilities
- `getAllFacilities(req, res)` - Admin: Get all facilities (including inactive)
- `getFacilityById(req, res)` - Get single facility details
- `updateFacility(req, res)` - Admin: Update facility
- `toggleFacilityStatus(req, res)` - Admin: Enable/Disable facility

**Booking Management**
- `bookFacility(req, res)` - Resident: Create new booking with all validations
- `cancelBooking(req, res)` - Cancel booking (Resident own, Admin any)
- `getBookings(req, res)` - Get bookings (Admin: all, Resident: own)
- `getUpcomingBookings(req, res)` - Resident: Get upcoming bookings
- `getPastBookings(req, res)` - Resident: Get past bookings
- `getCancelledBookings(req, res)` - Resident: Get cancelled bookings
- `checkSlotAvailability(req, res)` - Check available slots for a facility on a date
- `getBookingStats(req, res)` - Admin: Get booking statistics

#### Routes (`routes/facilityRoutes.js`)

**Facility Management (Admin)**
```
POST   /facilities                    - Create facility
GET    /facilities/admin/all          - Get all facilities
GET    /facilities/:id                - Get facility by ID
PATCH  /facilities/:id                - Update facility
PATCH  /facilities/:id/toggle-status  - Enable/Disable facility
GET    /facilities/admin/stats/bookings - Get booking statistics
```

**Facility Listing (Public)**
```
GET    /facilities                    - Get all active facilities
```

**Booking Operations**
```
POST   /facilities/book/create        - Book facility (Resident)
GET    /facilities/availability/check - Check slot availability
PATCH  /facilities/booking/:id/cancel - Cancel booking
GET    /facilities/bookings/list      - Get bookings (Admin: all, Resident: own)
GET    /facilities/bookings/upcoming  - Get upcoming bookings (Resident)
GET    /facilities/bookings/past      - Get past bookings (Resident)
GET    /facilities/bookings/cancelled - Get cancelled bookings (Resident)
```

### Frontend (React)

#### Components

**1. Resident Pages**

- **ResidentFacilities.jsx** (`pages/resident/Facilities.jsx`)
  - Display all available facilities with capacity and location
  - Responsive grid layout
  - "Book Now" button for each facility
  - Loading states and error handling

- **BookingForm.jsx** (`pages/resident/BookingForm.jsx`)
  - Date and time slot selection
  - Real-time availability checking
  - Validation for past dates
  - Shows capacity information
  - Booking confirmation with success message

- **MyBookings.jsx** (`pages/resident/MyBookings.jsx`)
  - Tabs: Upcoming, Past, Cancelled
  - Display booking details (facility, date, time, flat, status)
  - Cancel booking functionality
  - Date formatting and status badges

**2. Admin Pages**

- **Facilities.jsx** (`pages/admin/Facilities.jsx`)
  - Create new facilities via modal form
  - Edit existing facilities
  - Enable/Disable facilities
  - Table view with all facility details
  - Responsive design with inline editing

- **Bookings.jsx** (`pages/admin/Bookings.jsx`)
  - Dashboard with statistics cards:
    - Total bookings
    - Confirmed bookings
    - Cancelled bookings
    - Completed bookings
    - Today's bookings
  - Booking table with filters (All, Confirmed, Cancelled, Completed)
  - Cancel any booking functionality
  - Detailed booking information

## Booking Rules & Validations

### Rule 1: No Duplicate Time Slot Bookings
- Two residents cannot book the same facility at the same date and time slot
- Automatically prevented by checking existing CONFIRMED bookings

### Rule 2: No Duplicate Resident Bookings on Same Date
- Same resident cannot book the same facility twice on the same date
- Prevented by checking bookedBy + facility + date combination

### Rule 3: Cancelled Bookings Free the Slot
- When a booking is cancelled, the slot becomes available
- Implemented via status change to CANCELLED (not hard delete)

### Rule 4: No Past Date Bookings
- Residents cannot book for dates before today
- Validated on frontend (input min date) and backend
- Checked when verifying availability

### Rule 5: Facility Must Be Active
- If facility.isActive = false, no bookings are allowed
- Checked before allowing booking

### Rule 6: Capacity Limits
- Each time slot can have maximum bookings equal to facility capacity
- Advanced feature: counts existing CONFIRMED bookings for the slot

## Time Slots
Available time slots: 9 slots per day (9 AM - 9 PM)
```
09:00-10:00
10:00-11:00
11:00-12:00
12:00-13:00
14:00-15:00
15:00-16:00
16:00-17:00
18:00-19:00
19:00-20:00
20:00-21:00
```

## API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": {...},
  "count": 5
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

## Frontend Routes

### Admin Routes
- `/admin/facilities` - Facility management
- `/admin/bookings` - View all bookings and statistics

### Resident Routes
- `/resident/facilities` - Browse available facilities
- `/resident/booking` - Book a facility (with state passing for facility details)
- `/resident/my-bookings` - View personal bookings with tabs for upcoming/past/cancelled

## Authentication & Authorization

### Admin Can:
- Create facilities
- Update facility details
- Enable/Disable facilities
- View all bookings
- Cancel any booking
- View booking statistics

### Resident Can:
- View available facilities
- Book facilities (with validations)
- View own bookings
- Cancel own bookings
- View booking history (upcoming, past, cancelled)

### Resident Cannot:
- Create or edit facilities
- View other residents' bookings
- Cancel bookings of other residents

## Usage Flow

### For Residents:
1. Navigate to `/resident/facilities`
2. Browse available facilities
3. Click "Book Now" on desired facility
4. Select date (min: today, max: 90 days from today)
5. Select available time slot
6. Confirm booking
7. View in `/resident/my-bookings`

### For Admin:
1. Navigate to `/admin/facilities` to manage facilities
2. Navigate to `/admin/bookings` to view all bookings
3. View statistics dashboard
4. Filter bookings by status
5. Cancel bookings if needed

## Database Queries

### Efficient Queries with Indexes:
- `facility + date + timeSlot + status` - Fast conflict detection
- `bookedBy + date` - Fast user booking history

### Query Examples:
```javascript
// Check slot availability
Booking.findOne({
  facility: facilityId,
  date: { $gte: startDate, $lte: endDate },
  timeSlot,
  status: { $in: ["CONFIRMED"] }
})

// Get resident's bookings
Booking.find({
  bookedBy: userId,
  date: { $gte: today }
})
  .populate("facility")
  .sort({ date: 1 })
```

## Error Handling

### Validation Errors:
- Missing required fields (facility ID, date, time slot)
- Invalid date (past dates)
- Invalid facility (not found or inactive)

### Business Logic Errors:
- "Facility already booked for this slot"
- "You have already booked this facility for this date"
- "Facility capacity reached for this slot"
- "Cannot book for past dates"
- "Facility is currently unavailable"

### Authorization Errors:
- "You can only cancel your own bookings"

## Performance Optimization

1. **Database Indexes**: Composite indexes for fast queries
2. **Pagination**: Can be added for large booking lists
3. **Caching**: Facility list can be cached (rarely changes)
4. **Date Validation**: Prevents invalid queries before database hit

## Future Enhancements

1. **Notifications**: Email/SMS on successful booking
2. **Payment Integration**: Support paid facility bookings
3. **Recurring Bookings**: Book same slot weekly/monthly
4. **Booking History Export**: Generate booking reports
5. **Cancellation Charges**: Implement policies for late cancellations
6. **Booking Duration**: Allow variable duration bookings
7. **Waiting List**: Queue system for fully booked slots
8. **User Reviews**: Rate and review facilities after booking

## Testing Checklist

### Backend API Tests:
- ✓ Create facility with valid/invalid data
- ✓ Get facilities (active and all)
- ✓ Update facility
- ✓ Toggle facility status
- ✓ Book facility (all validation rules)
- ✓ Cancel booking (authorization checks)
- ✓ Get bookings (admin vs resident)
- ✓ Check availability for various dates

### Frontend UI Tests:
- ✓ Facility listing display
- ✓ Booking form with date selection
- ✓ Time slot availability display
- ✓ My bookings tabs switching
- ✓ Cancel booking confirmation
- ✓ Admin facility management CRUD
- ✓ Admin bookings dashboard filters
- ✓ Error and success messages

## Deployment Considerations

1. Ensure backend route priority (more specific routes before general ones)
2. Database backups before production
3. Monitor booking API for performance
4. Set up logging for booking operations
5. Consider rate limiting on booking endpoint
6. Test date/time handling across timezones
