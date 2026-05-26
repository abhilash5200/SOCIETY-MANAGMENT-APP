import Bill from "../models/Bill.js";
import User from "../models/User.js";

/* ================= CREATE BILL ================= */

export const createBill = async (req, res) => {
  try {

    const {
      flatId,
      amount,
      reason,
      dueDate
    } = req.body;

    if (
      !flatId ||
      !amount ||
      !reason ||
      !dueDate
    ) {
      return res.status(400).json({
        message:
          "flatId, amount, reason and dueDate are required"
      });
    }

    const bill = await Bill.create({
      flat: flatId,
      amount,
      reason,
      dueDate,
      generatedBy: req.user.id,
      paid: false
    });

    res.status(201).json(bill);

  } catch (err) {

    console.error(
      "Create bill error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= PAY BILL ================= */

export const payBill = async (req, res) => {
  try {

    const { paymentMethod } =
      req.body;

    const bill =
      await Bill.findById(
        req.params.id
      );

    if (!bill) {

      return res.status(404).json({
        message: "Bill not found"
      });

    }

    bill.paid = true;

    bill.paymentMethod =
      paymentMethod;

    bill.paymentDate =
      new Date();

    await bill.save();

    res.json({
      message:
        "Bill paid successfully"
    });

  } catch (err) {

    console.error(
      "Pay bill error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }
};


/* ================= GET BILLS ================= */

export const getBills = async (req, res) => {

  try {

    const user =
      await User.findById(
        req.user.id
      ).populate("flat");

    let bills = [];

    // ================= ADMIN =================

    if (
      req.user.role === "ADMIN"
    ) {

      bills = await Bill.find()

        .populate(
          "flat",
          "block flatNumber"
        )

        .populate(
          "generatedBy",
          "name"
        )

        .sort({
          createdAt: -1
        });

    }

    // ================= RESIDENT =================

    else if (
      req.user.role === "RESIDENT"
    ) {

      bills = await Bill.find({
        flat: user.flat
      })

        .populate(
          "flat",
          "block flatNumber"
        )

        .populate(
          "generatedBy",
          "name"
        )

        .sort({
          createdAt: -1
        });

    }

    res.json(bills);

  } catch (err) {

    console.error(
      "Get bills error:",
      err
    );

    res.status(500).json({
      message: err.message
    });

  }
};