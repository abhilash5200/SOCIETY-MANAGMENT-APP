import Flat from "../models/Flat.js";
import User from "../models/User.js";
import Visitor from "../models/Visitor.js";
import Delivery from "../models/Delivery.js";
import Bill from "../models/Bill.js";
import Complaint from "../models/Complaint.js";

/* ================= ADMIN DASHBOARD ================= */

export const getDashboardStats = async (req, res) => {
  try {
    /* Flats */

    const totalFlats = await Flat.countDocuments();
    const occupiedFlats = await Flat.countDocuments({ isOccupied: true });

    /* Users */

    const residents = await User.countDocuments({ role: "RESIDENT" });
    const staff = await User.countDocuments({ role: "STAFF" });

    /* Visitors Today */

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const visitorsToday = await Visitor.countDocuments({
      createdAt: { $gte: today }
    });

    /* Deliveries Today */

    const deliveriesToday = await Delivery.countDocuments({
      createdAt: { $gte: today }
    });

    /* Bills */

    const totalBills = await Bill.countDocuments();
    const paidBills = await Bill.countDocuments({ paid: true });
    const unpaidBills = await Bill.countDocuments({ paid: false });

    /* Complaints */

    const openComplaints = await Complaint.countDocuments({
      status: { $in: ["OPEN", "IN_PROGRESS"] }
    });

    const resolvedComplaints = await Complaint.countDocuments({
      status: "RESOLVED"
    });

    res.json({
      flats: {
        total: totalFlats,
        occupied: occupiedFlats,
        vacant: totalFlats - occupiedFlats
      },

      users: {
        residents,
        staff
      },

      activity: {
        visitorsToday,
        deliveriesToday
      },

      billing: {
        totalBills,
        paidBills,
        unpaidBills
      },

      complaints: {
        openComplaints,
        resolvedComplaints
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};