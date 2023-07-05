const Addonsmodel  = require("../models/addOnsModel")


// addon create and get 

const addonsHandler = async (req, res) => {
    try {
      if (req.method === 'POST') {
        const addOns = new Addonsmodel(req.body)
        const result = await addOns.save()
        res.status(200).json({
          success: true,
          message: 'add on added successfully',
        })
      } else if (req.method === 'GET') {
        const type = req.query.type;
        console.log("type ckeck",type)
        const filter = {};
        if (type) {
          filter.type = type;
        }
        const addOns = await Addonsmodel.find(filter);
        res.status(200).json({
          success: true,
          message: 'all add on get success',
          data: addOns,
        });
  
      } else {
        res.status(405).json({ error: 'Method Not Allowed' })
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
  

module.exports = {
    addonsHandler
}