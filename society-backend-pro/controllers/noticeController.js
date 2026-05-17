import Notice from "../models/Notice.js";

import { io }
from "../server.js";

/* ================= CREATE NOTICE ================= */

export const createNotice = async (
  req,
  res
) => {

  try {

    const {
      title,
      content,
      type,
      isImportant
    } = req.body;

    const notice =
      await Notice.create({

        title,

        content,

        type,

        isImportant,

        postedBy:
          req.user.id

      });

    // ================= POPULATE =================

    const populatedNotice =
      await Notice.findById(
        notice._id
      )

      .populate(
        "postedBy",
        "name"
      );

    // ================= REALTIME EVENT =================

    io.emit(
      "newNotice",
      populatedNotice
    );

    res.status(201).json(
      populatedNotice
    );

  } catch (err) {

    res.status(500).json({

      message:
        err.message

    });

  }
};


/* ================= GET ALL NOTICES ================= */

export const getNotices = async (
  req,
  res
) => {

  try {

    const notices =
      await Notice.find()

        .populate(
          "postedBy",
          "name"
        )

        .sort({

          createdAt: -1

        });

    res.json(
      notices
    );

  } catch (err) {

    res.status(500).json({

      message:
        err.message

    });

  }
};


/* ================= DELETE NOTICE ================= */

export const deleteNotice = async (
  req,
  res
) => {

  try {

    await Notice.findByIdAndDelete(
      req.params.id
    );

    // ================= REALTIME EVENT =================

    io.emit(
      "noticeDeleted",
      req.params.id
    );

    res.json({

      message:
        "Notice deleted"

    });

  } catch (err) {

    res.status(500).json({

      message:
        err.message

    });

  }
};