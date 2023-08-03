const CourierPrice = require("../models/courierPriceModel")
const { distance } = require("../util/distancefinder")
const { getCoordinatesFromPincode } = require("../util/geocode")


const courierPriceHandler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const CourierPricing = new CourierPrice(req.body)
      const result = await CourierPricing.save()
      res.status(200).json({
        success: true,
        message: 'CourierPricing added successfully',
      })
    } else if (req.method === 'GET') {

      const toPincode = req.query.to;
      const fromPincode = req.query.from;

      const pinocdedata = await getCoordinatesFromPincode(toPincode)
      const pinocdedatafrom = await getCoordinatesFromPincode(fromPincode)

      const lat1 = pinocdedatafrom.lat;
      const lon1 = pinocdedatafrom.lng;
      const lat2 = pinocdedata.lat;
      const lon2 = pinocdedata.lng;

      const calculatedDistance = await distance(lat1, lon1, lat2, lon2);

      console.log("distance is", calculatedDistance)



      const inventory = await CourierPrice.find({});
      res.status(200).json({
        success: true,
        message: 'get success',
        data: {
          "distance_km": calculatedDistance,
          "price_list": inventory
        },
      });

    } else if (req.method === "PATCH") {
      const id = req.params.id;
      const updateData = req.body;
      const result = await CourierPrice.findByIdAndUpdate(id, updateData);
      res.status(200).json({
        success: true,
        message: "update success"
      })
    }


    else if (req.method === 'DELETE') {
      const id = req.params.id;
      if (!id) {
        const result = await CourierPrice.deleteMany({});
        return res.status(200).json({
          success: true,
          message: 'deleted successfully',
          // data: result,
        });
      }
      const result = await CourierPrice.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: 'not found' });
      }
      res.status(200).json({
        success: true,
        message: 'deleted successfully',
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
  courierPriceHandler
}