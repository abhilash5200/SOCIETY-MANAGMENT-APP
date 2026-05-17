import Poll from "../models/Poll.js";
import Vote from "../models/Vote.js";

/* ================= CREATE POLL ================= */

export const createPoll = async (req, res) => {
  try {
    const { question, options, expiresAt } = req.body;

    const poll = await Poll.create({
      question,
      options: options.map(text => ({ text })),
      expiresAt,
      createdBy: req.user.id
    });

    res.status(201).json(poll);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= VOTE ================= */

export const votePoll = async (req, res) => {
  try {
    const { optionIndex } = req.body;

    const poll = await Poll.findById(req.params.id);

    if (new Date() > poll.expiresAt)
      return res.status(400).json({ message: "Poll expired" });

    const alreadyVoted = await Vote.findOne({
      poll: poll._id,
      user: req.user.id
    });

    if (alreadyVoted)
      return res.status(400).json({ message: "Already voted" });

    poll.options[optionIndex].votes += 1;

    await poll.save();

    await Vote.create({
      poll: poll._id,
      user: req.user.id,
      optionIndex
    });

    res.json({ message: "Vote recorded" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* ================= GET POLLS ================= */

export const getPolls = async (req, res) => {
  try {
    const polls = await Poll.find().sort({ createdAt: -1 });

    res.json(polls);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};