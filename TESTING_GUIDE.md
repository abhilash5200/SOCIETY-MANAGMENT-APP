# Facility Booking Module - Setup & Testing Guide

## Current Status ✅

**Backend**: Running on http://localhost:5000
**Frontend**: Running on http://localhost:5174

## Quick Start - Step by Step Testing

### Step 1: Access the Application
1. Open browser and go to **http://localhost:5174**
2. You should see the landing page

### Step 2: Register/Login as Admin
1. Click **Register** or **Login**
2. Create an admin account or login with existing credentials
3. Set role to **ADMIN**

### Step 3: Create Facilities (Admin)
1. Once logged in as admin, go to **Admin Dashboard**
2. Click **Manage Facilities** or navigate to `/admin/facilities`
3. Click **+ Add New Facility**
4. Fill in the form:
   - **Facility Name**: Community Hall
   - **Location**: Block A Ground Floor
   - **Capacity**: 200
   - **Description**: For events and functions
5. Click **Create Facility**
6. Create more facilities:
   - Gym (Capacity: 50)
   - Swimming Pool (Capacity: 30)
   - Tennis Court (Capacity: 10)

### Step 4: Verify Facilities Display in Admin
1. In the facilities list, you should see all created facilities
2. Each facility shows: Name, Location, Capacity, Status (Active/Inactive)
3. You can Edit or toggle Enable/Disable

### Step 5: Login as Resident
1. Logout from admin account
2. Register new account with **RESIDENT** role
3. Or use existing resident account

### Step 6: View Available Facilities (Resident)
1. After login as resident, navigate to `/resident/facilities`
2. You should see all **active** facilities created in step 3
3. Each facility shows:
   - Facility name
   - Capacity
   - Location
   - Description
   - "Book Now" button

### Step 7: Book a Facility
1. Click **Book Now** on any facility
2. You'll see facility details page
3. Select a **Date** (today or future date, up to 90 days)
4. Select an available **Time Slot** (9 AM - 9 PM)
5. Review the time slot availability (shows booked/capacity)
6. Click **Confirm Booking**
7. You should see success message

### Step 8: View My Bookings
1. Navigate to `/resident/my-bookings`
2. Click on **Upcoming** tab to see your bookings
3. You can cancel bookings from this page
4. Switch tabs to see Past and Cancelled bookings

### Step 9: Test Booking Validations

#### Test Case 1: Prevent Past Date Booking
1. Try to select a date before today
2. Date picker should prevent selection (min date = today)

#### Test Case 2: Prevent Duplicate Time Slot
1. Book same facility at same time with 2 different residents
2. Second booking should fail with message: "Facility already booked for this slot"

#### Test Case 3: Prevent Same Resident Double Booking
1. As resident, try to book same facility twice on same date
2. Should fail with message: "You have already booked this facility for this date"

#### Test Case 4: Prevent Inactive Facility Booking
1. As admin, disable a facility
2. As resident, try to book that facility
3. Should not appear in available list or show "unavailable" message

### Step 10: Admin Booking Management
1. Logout from resident
2. Login as admin
3. Navigate to `/admin/bookings`
4. You should see:
   - Statistics dashboard (Total, Confirmed, Cancelled, Completed, Today's bookings)
   - Booking table with all resident bookings
   - Columns: Facility, Resident, Flat, Date, Time Slot, Status, Actions
5. You can cancel any booking using the Cancel button
6. Filter bookings by status using tabs

## API Endpoints Reference

### Facility Management
```
POST   /api/facilities              - Create facility
GET    /api/facilities              - Get active facilities
GET    /api/facilities/admin/all    - Get all facilities (admin)
GET    /api/facilities/:id          - Get single facility
PATCH  /api/facilities/:id          - Update facility
PATCH  /api/facilities/:id/toggle-status - Enable/Disable facility
```

### Booking Management
```
POST   /api/facilities/book/create  - Create booking
PATCH  /api/facilities/booking/:id/cancel - Cancel booking
GET    /api/facilities/bookings/list       - Get bookings
GET    /api/facilities/bookings/upcoming   - Get upcoming bookings
GET    /api/facilities/bookings/past       - Get past bookings
GET    /api/facilities/bookings/cancelled  - Get cancelled bookings
GET    /api/facilities/availability/check  - Check availability
GET    /api/facilities/admin/stats/bookings - Get statistics
```

## Troubleshooting

### Issue: Facilities not showing in resident page
**Solution**: 
- Make sure at least one facility is created by admin
- Facility must be **Active** (not disabled)
- Check browser console for errors (F12)
- Verify backend is running on http://localhost:5000

### Issue: Booking fails with error
**Solution**:
- Check if facility is active
- Check if date is not in past
- Check if time slot is not already booked
- Check browser console for detailed error message

### Issue: Unauthorized/Invalid Token
**Solution**:
- Login again
- Clear browser cache and session storage
- Check if token is still valid

### Issue: Backend not running
**Solution**:
```bash
# Kill existing process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Start backend
cd c:\SOCIETY-MANAGMENT-APP-PRO\society-backend-pro
npm run dev
```

### Issue: Frontend port 5173 in use
**Solution**: Frontend automatically tries port 5174 (or next available)

## Important Notes

1. **API Base URL**: Updated to `http://localhost:5000/api`
2. **Route Ordering**: Fixed to ensure specific routes are matched before generic ones
3. **Response Format**: Frontend handles both wrapped and direct array responses
4. **Time Slots**: 11 slots per day from 9 AM to 9 PM (12-1 PM lunch break)
5. **Booking Rules**: All 6 rules are enforced at both frontend and backend

## Files Modified
- Backend: `server.js`, `routes/facilityRoutes.js`, `controllers/facilityController.js`, `models/Booking.js`
- Frontend: `src/api/axios.js`, all facility-related components

## Next Steps (After Verification)
1. Verify all features work as expected
2. Test edge cases and validation rules
3. Check browser console for any errors
4. Deploy to production (update API base URL)

---

**Current Environment**:
- Backend: http://localhost:5000
- Frontend: http://localhost:5174
- Database: MongoDB (local or cloud)
- Date: May 29, 2026
