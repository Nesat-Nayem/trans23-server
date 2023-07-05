const Francies = require("../models/franciesModel");

const postFrancies = async (req, res) => {
  try {
    const pcFrancies = new Francies(req.body);
    const result = await pcFrancies.save();
    res.status(200).json({
      status: "Success",
      message: "cusomer Data Insert successfully",
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFrancies = async (req, res) => {
  try {
    if (req.query.name || req.query.city || req.query.state) {
      console.log("query true");

      const gFrancies = await Francies.find({
        $and: [
          {
            $or: [
              {
                name: req.query.name,
              },
              {
                city: req.query.city,
              },
              {
                state: req.query.state,
              },
            ],
          },
        ],
      });

      res.json(gFrancies);
    } else {
      console.log("false query");

      const eFrancies = await Francies.find({});
      res.json(eFrancies);
    }
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: "couldn't get customer data",
      error: error.message,
    });
  }
};

module.exports = {
  postFrancies,
  getFrancies,
};
