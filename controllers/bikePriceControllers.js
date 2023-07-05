// const BikePrice = require("../models/courierPriceModel")
const BikePrice =require("../models/bikePriceModel")
const { distance } = require("../util/distancefinder")
const { getCoordinatesFromPincode } = require("../util/geocode")


const bikePriceHandler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const CourierPricing = new BikePrice(req.body)
      const result = await CourierPricing.save()
      res.status(200).json({
        success: true,
        message: 'bike pricing added successfully',
      })
    } else if (req.method === 'GET') {
      // console.log("query paramitter", req.query.to)
      // const toPincode = req.body.to;
      // const fromPincode = req.body.from;
      const toPincode = req.query.to;
      const fromPincode = req.query.from;

      const pinocdedata = await getCoordinatesFromPincode(toPincode)
      const pinocdedatafrom = await getCoordinatesFromPincode(fromPincode)

      // distance finder 
      // const distance = (lat1, lon1, lat2, lon2, unit = 'K') => {
      //   if (lat1 == lat2 && lon1 == lon2) {
      //     return 0;
      //   } else {
      //     const radlat1 = Math.PI * lat1 / 180;
      //     const radlat2 = Math.PI * lat2 / 180;
      //     const theta = lon1 - lon2;
      //     const radtheta = Math.PI * theta / 180;
      //     let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      //     dist = Math.acos(dist);
      //     dist = dist * 180 / Math.PI;
      //     dist = dist * 60 * 1.609344; // convert distance to kilometers

      //     return dist;
      //   }
      // };
      // distance finder 

      const lat1 = pinocdedatafrom.lat;
      const lon1 = pinocdedatafrom.lng;
      const lat2 = pinocdedata.lat;
      const lon2 = pinocdedata.lng;

      const calculatedDistance = await distance(lat1, lon1, lat2, lon2);

      console.log("distance is", calculatedDistance)



      const inventory = await BikePrice.find({});
      res.status(200).json({
        success: true,
        message: 'all bike pricing get success',
        // data: inventory,
        data: {
          "distance_km": calculatedDistance,
          "price_list": inventory
        },
      });

    } else if (req.method === "PATCH") {
      const id = req.params.id;
      const updateData = req.body;
      const result = await BikePrice.findByIdAndUpdate(id, updateData);
      res.status(200).json({
        success: true,
        message: "update success"
      })
    }


    else if (req.method === 'DELETE') {
      const id = req.params.id;
      if (!id) {
        const result = await BikePrice.deleteMany({});
        return res.status(200).json({
          success: true,
          message: 'All bike pricing deleted successfully',
          // data: result,
        });
      }
      const result = await BikePrice.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ error: 'bike not found' });
      }
      res.status(200).json({
        success: true,
        message: 'bike deleted successfully',
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
  bikePriceHandler
}