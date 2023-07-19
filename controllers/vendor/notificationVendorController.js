const notificationVendor = require("../../models/vendor/notificationVendorModel")



const vendorNotificationHandalar = async (req, res) => {
    try {

        if (req.method === "POST") {
            const notificationvendor = new notificationVendor(req.body);
            const result = await notificationvendor.save()
            res.json({
                success: true,
                message: "notification stored"
            })
        }
        else if (req.method === "GET") {
            const notificationvendor = await notificationVendor.find({})
            const result = notificationvendor

            res.json({
                success: true,
                message: "notification get success",
                data: result
            })
        }
        else if (req.method === "DELETE") {
            const id = req.params.id;
            console.log(id)
            const notificationvendor = await notificationVendor.findByIdAndDelete(id);
            res.json({
                success: true,
                message: "delete Success"
            })
        }

    } catch (error) {
        res.json({
            success: false,
            message: error.message
        })
    }
}

module.exports = vendorNotificationHandalar;