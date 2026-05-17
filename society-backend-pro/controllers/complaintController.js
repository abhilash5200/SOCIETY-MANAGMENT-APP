import Complaint from "../models/Complaint.js";

import User from "../models/User.js";

import { io }
from "../server.js";

/* ================= RESIDENT RAISES ================= */

export const createComplaint = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user.id
      );

    const {
      title,
      description,
      priority
    } = req.body;

    const complaint =
      await Complaint.create({

        title,

        description,

        priority,

        flat: user.flat,

        raisedBy: req.user.id

      });

    // ================= REALTIME EVENT =================

    io.emit(
      "newComplaint",
      complaint
    );

    res.status(201).json(
      complaint
    );

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }
};


/* ================= ADMIN ASSIGNS STAFF ================= */

export const assignComplaint = async (
  req,
  res
) => {

  try {

    const { staffId } =
      req.body;

    const complaint =
      await Complaint.findById(
        req.params.id
      );

    complaint.assignedTo =
      staffId;

    complaint.status =
      "IN_PROGRESS";

    await complaint.save();

    // ================= REALTIME EVENT =================

    io.emit(
      "complaintAssigned",
      complaint
    );

    res.json({

      message:
        "Complaint assigned"

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }
};


/* ================= STAFF RESOLVES ================= */

export const resolveComplaint = async (
  req,
  res
) => {

  try {

    const complaint =
      await Complaint.findById(
        req.params.id
      );

    complaint.status =
      "RESOLVED";

    complaint.resolvedAt =
      new Date();

    await complaint.save();

    // ================= REALTIME EVENT =================

    io.emit(
      "complaintResolved",
      complaint
    );

    res.json({

      message:
        "Complaint resolved"

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }
};


/* ================= ADMIN CLOSES ================= */

export const closeComplaint = async (
  req,
  res
) => {

  try {

    const complaint =
      await Complaint.findById(
        req.params.id
      );

    complaint.status =
      "CLOSED";

    await complaint.save();

    io.emit(
      "complaintClosed",
      complaint
    );

    res.json({

      message:
        "Complaint closed"

    });

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }
};


/* ================= ROLE-BASED VIEW ================= */

export const getComplaints = async (
  req,
  res
) => {

  try {

    const user =
      await User.findById(
        req.user.id
      );

    let complaints;

    // ================= ADMIN =================

    if (
      req.user.role === "ADMIN"
    ) {

      complaints =
        await Complaint.find()

          .populate(
            "flat assignedTo raisedBy"
          );

    }

    // ================= RESIDENT =================

    else if (
      req.user.role === "RESIDENT"
    ) {

      complaints =
        await Complaint.find({

          flat: user.flat

        })

          .populate(
            "flat assignedTo raisedBy"
          );

    }

    // ================= STAFF =================

    else if (
      req.user.role === "STAFF"
    ) {

      complaints =
        await Complaint.find({

          assignedTo:
            req.user.id

        })

          .populate(
            "flat assignedTo raisedBy"
          );

    }

    res.json(
      complaints
    );

  } catch (err) {

    res.status(500).json({

      message: err.message

    });

  }
};