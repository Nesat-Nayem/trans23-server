const { Applience } = require("../models/applienceModel");

// appliance create and get 

const applienceHandler = async (req, res) => {
  try {
    if (req.method === "POST") {
      const applience = new Applience(req.body);
      const result = await applience.save();
      res.status(200).json({
        success: true,
        message: "applience added successfully",
      });
    } else if (req.method === "GET") {
      const category = req.query.category || "";
      const query = category ? { category } : {};
      const applience = await Applience.find(query);
      res.status(200).json({
        success: true,
        message: "applience data retrieved successfully",
        data: applience,
      });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// appliance update and delete 

const modifyApplience = async (req, res) => {
  try {
    const id = req.params.id;
    if (req.method === "PATCH") {
      const updateData = req.body;
      const result = await Applience.findByIdAndUpdate(id, updateData);
      res.status(200).json({
        success: true,
        message: "Applience updated successfully",
      });
    } else if (req.method === "DELETE") {
      const result = await Applience.findByIdAndDelete(id);
      res.status(200).json({
        success: true,
        message: "Applience deleted successfully",
      });
    } else {
      res.status(405).json({ error: "Method Not Allowed" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  applienceHandler,
  modifyApplience,
};
