// const Addonsmodel  = require("../models/addOnsModel")

const Inventory = require("../models/inventoryModel")

// addon create and get 

const inventoryHandler = async (req, res) => {
    try {
      if (req.method === 'POST') {
        const inventory = new Inventory(req.body)
        const result = await inventory.save()
        res.status(200).json({
          success: true,
          message: 'Inventory on added successfully',
        })
      } else if (req.method === 'GET') {
     
        const inventory = await Inventory.find({});
        res.status(200).json({
          success: true,
          message: 'all Inventory get success',
          data: inventory,
        });
  
      } else if (req.method === 'DELETE') {
        const id = req.params.id;
        if (!id) {
          const result = await Inventory.deleteMany({});
          return res.status(200).json({
            success: true,
            message: 'All inventory deleted successfully',
            // data: result,
          });
        }
        const result = await Inventory.findByIdAndDelete(id);
        if (!result) {
          return res.status(404).json({ error: 'Inventory not found' });
        }
        res.status(200).json({
          success: true,
          message: 'Inventory deleted successfully',
          // data: result,
        });
      } 
      
      else {
        res.status(405).json({ error: 'Method Not Allowed' })
      }
    } catch (error) {
      res.status(500).json({ success: false, error: error.message })
    }
  }
  

module.exports = {
    inventoryHandler
}