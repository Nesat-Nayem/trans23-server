const express = require("express");

const multer = require('multer')

const {
  getOrders,
  userOrder,
  nearestPincode,
  findFrancies,
  reportOrders,
  updateOrder,
  statusAndOutstandingAmt,
  postOrders,
  cleanOrders,
  getvendorbalance,
  getSingleOrder,
  accept_order,
  getunacceptedorder,
} = require("../controllers/ordersController");

const {
  otpLogin,
  verifyOTP,
  getUser,
  resendOtp,
  getspacificUser,
  getReffrellCode,
  checkReffrellCode,
  deleteUser,
  updateUser,
} = require("../controllers/userController");
const {
  getBannerImage,
  postBannerImage,
} = require("../controllers/bannerImageControllers");
const {
  getCategories,
  addCategory,
  singleCategories,
  updateCategories,
} = require("../controllers/category");
const {
  addonsHandler
} = require("../controllers/addOnsControllers");

const { courierPriceHandler } = require("../controllers/courierPriceControllers")
const { carPriceHandler } = require("../controllers/carPriceControllers")
const { bikePriceHandler } = require("../controllers/bikePriceControllers")

const {
  inventoryHandler
} = require("../controllers/inventoryControllers")

// const { imageUploader } = require("../controllers/transactionControllers");
const uploader = require("../middlewares/uploader");
const {
  applienceHandler,
  modifyApplience
} = require("../controllers/applienceControllers");
const {
  franciesSingUp,
  franciesSingIn,
  getallFrancies,
  updateFranciesAccess,
} = require("../controllers/franciesRagistrationControllers");
const authController = require("../controllers/adminControllers");
const { checkUser, checkAdmin } = require("../middlewares/newAuth");
// const { vehicleImageUploader } = require("../controllers/vehicleImageController");

// const notificationController = require("../controllers/notificationController");
const { vendorRegister, vendorCreate, vendorVerifyOTP, vendorLogin, getVendor, deleteVendor, patchVendor } = require("../controllers/vendorRegisterController");
const { vendorServiceHandalar } = require("../controllers/vendorServiceController");
const { textmail } = require("../controllers/mailControllers");
const { VendorDetailsHandalar } = require("../controllers/vendorDetailsController");
const { vendorCompanyDetailsHandalar } = require("../controllers/vendor/companyDetailsControllers");
const { vendorEmployHandalar } = require("../controllers/vendor/employController");
const { vendorVehicleHandalar } = require("../controllers/vendor/vendorVehicleControllers");
const { singleImageUploadS3, miltipleImageUploadS3 } = require("../controllers/awsImageUploader");
const vendorDashboardHandalar = require("../controllers/vendor/vendorDashboardController");
const { vendorSelectedServiceHandalar } = require("../controllers/vendor/vendorSelectedServiceControllers");
const { paymentmanage, paymentresponse, checkStatus } = require("../controllers/payment/paymentController");
const vendorNotificationHandalar = require("../controllers/vendor/notificationVendorController");
const vendorPaymentHandalar = require("../controllers/vendor/vendorPaymentController");
const { sendPushNotifications, getNotifications } = require("../controllers/notificationController");
const { subscriptionManage, subscriptionresponse, subscriptioncheckStatus } = require("../controllers/subscription/subscriptionController");
const { paymentmanagetest } = require("../controllers/payment/paymentControllerTest");



const router = express.Router();

// const storage = multer.memoryStorage()
// const upload = multer({ storage: storage })


// Users

router.get("/users/getuser", getUser);
router.get("/users/specificuserreferralinfo/:phone", getspacificUser);
router.get("/user/referral-code/:phone", getReffrellCode);
router.post("/user/verify-code/:number", checkReffrellCode);
router.patch("/user/:number", updateUser);

router.delete("/user/remove/:userId", deleteUser);
router.post("/users/otpLogin", otpLogin);

router.post("/users/verifyOTP", verifyOTP);


router.post("/users/resendOtp", resendOtp);

// vendor register verify

router.post("/vendor/addownvendor", vendorCreate)
router.post("/vendor/register", vendorRegister)
router.post("/vendor/verify", vendorVerifyOTP)
router.post("/vendor/vendorlogin", vendorLogin)
router.get("/vendor", getVendor)
router.delete("/vendor", deleteVendor)
router.patch("/vendor", patchVendor)

// notification 

// router.post("/notification", notificationController.sendPushNotifications)
// router.get("/notification/:phone", notificationController.getNotifications)
router.post("/notification", sendPushNotifications)
router.get("/notification/:phone", getNotifications)

// order
// mobile
router.get("/orders", getOrders);
router.post("/orders", checkUser, postOrders);
router.patch("/accept-order", accept_order)
router.get("/unaccept-order", getunacceptedorder)

router.delete("/orders/clean", checkAdmin, cleanOrders);

router.get(
  "/order/:phone_no",
  checkUser,
  userOrder
);

router.get("/nearest-pincode/:pincode", nearestPincode)

router.post("/match-francies", findFrancies)
// web

router.patch(
  "/services/stausandremaning/:id",

  statusAndOutstandingAmt
);
router.patch("/order/:id", updateOrder);
router.get("/single-order/:_id", getSingleOrder)

// router.get("/report-orders", checkAdmin, reportOrders);
router.get("/report-orders", reportOrders);

// app dashboard
// slider iamge
router.get("/slider", getBannerImage);
router.post("/banner/postbannerImage", checkAdmin, postBannerImage);

// categories

// user
router.get("/categories/getcategories", getCategories);

// admin

router.post("/services/create", checkAdmin, addCategory);

router.get("/services/singleServices/:id", singleCategories);

router.patch("/updatecategorie/:id", checkAdmin, updateCategories);

// addons

router.get("/addon", addonsHandler);
router.post("/addon", checkAdmin, addonsHandler);

// inventory

router.get("/inventory", inventoryHandler);
router.post("/inventory", inventoryHandler);
router.delete("/inventory", inventoryHandler);
router.delete("/inventory/:id", inventoryHandler);


// courier pricing 

router.post("/courier-pricing", courierPriceHandler)
router.get("/courier-pricing", courierPriceHandler)
// router.delete("/courier-pricing", courierPriceHandler)
router.patch("/courier-pricing/:id", courierPriceHandler)
router.delete("/courier-pricing/:id", courierPriceHandler)


router.post("/car-pricing", carPriceHandler)
router.get("/car-pricing", carPriceHandler)
// router.delete("/car-pricing", carPriceHandler)
router.patch("/car-pricing/:id", carPriceHandler)
router.delete("/car-pricing/:id", carPriceHandler)

router.post("/bike-pricing", bikePriceHandler)
router.get("/bike-pricing", bikePriceHandler)
// router.delete("/bike-pricing", bikePriceHandler)
router.patch("/bike-pricing/:id", bikePriceHandler)
router.delete("/bike-pricing/:id", bikePriceHandler)


// inamge uploader // transection


// router.post(
//   "/imageUploader",
//   checkUser,
//   uploader.fields([{ name: 'image', maxCount: 1 }, { name: 'images', maxCount: 10 }]),
//   imageUploader
// );



const storage = multer.memoryStorage()
const upload = multer({ storage: storage })


// router.post("/s3imageUpload", upload.fields([{ name: "image1", maxCount: 1 }, { name: "image2", maxCount: 1 }]), singleImageUploadS3)

router.post("/s3imageUpload", upload.single('image'), singleImageUploadS3)


// vehicle image uploader 

router.post(
  "/vehicle_image_uploader",

  upload.fields([{ name: 'nid', maxCount: 1 }, { name: 'insurance', maxCount: 1 }, { name: 'RC', maxCount: 1 }, { name: 'front', maxCount: 1 }, { name: 'rear', maxCount: 1 }, { name: 'left', maxCount: 1 }, { name: 'right', maxCount: 1 }, { name: 'extra', maxCount: 5 }]),
  miltipleImageUploadS3

)


// router.post(
//   "/vehicle_image_uploader",
//   // checkUser,
//   uploader.fields([{ name: 'nid', maxCount: 1 }, { name: 'insurance', maxCount: 1 }, { name: 'RC', maxCount: 1 }, { name: 'front', maxCount: 1 }, { name: 'rear', maxCount: 1 }, { name: 'left', maxCount: 1 }, { name: 'right', maxCount: 1 }, { name: 'extra', maxCount: 5 }]),
//   vehicleImageUploader

// )

// appliances

router.post("/applience", checkAdmin, applienceHandler);
router.get("/applience", applienceHandler);
router.patch("/applience/:id", checkAdmin, modifyApplience);
router.delete("/applience/:id", checkAdmin, modifyApplience);

// francies

router.post("/franciesSingUp", franciesSingUp);

router.post("/francies-singin", franciesSingIn);

router.get("/allfrancies", getallFrancies);

router.patch("/updateaccess/:id", updateFranciesAccess);

// admin access

router.post("/admin/signup", authController.signup_post);
router.post("/admin/login", authController.login_post);

router.get("/admin/logout", authController.logout_get);


// vendor 

router.get("/vendor-dashboard", vendorDashboardHandalar)
router.post("/vendor-dashboard", vendorDashboardHandalar)
router.delete("/vendor-dashboard", vendorDashboardHandalar)
router.patch("/vendor-dashboard", vendorDashboardHandalar)

router.get("/vendor/service", vendorServiceHandalar)
router.post("/vendor/service", vendorServiceHandalar)
router.patch("/vendor/service", vendorServiceHandalar)
router.delete("/vendor/service", vendorServiceHandalar)

router.get("/vendor/details", VendorDetailsHandalar)
router.post("/vendor/details", VendorDetailsHandalar)
router.patch("/vendor/details", VendorDetailsHandalar)
router.delete("/vendor/details", VendorDetailsHandalar)


router.get("/vendor/company", vendorCompanyDetailsHandalar)
router.post("/vendor/company", vendorCompanyDetailsHandalar)
router.patch("/vendor/company", vendorCompanyDetailsHandalar)
router.delete("/vendor/company", vendorCompanyDetailsHandalar)



router.get("/vendor/employee", vendorEmployHandalar)
router.post("/vendor/employee", vendorEmployHandalar)
router.patch("/vendor/employee", vendorEmployHandalar)
router.delete("/vendor/employee", vendorEmployHandalar)


router.get("/vendor/vehicle", vendorVehicleHandalar)
router.post("/vendor/vehicle", vendorVehicleHandalar)
router.patch("/vendor/vehicle", vendorVehicleHandalar)
router.delete("/vendor/vehicle", vendorVehicleHandalar)


router.get("/vendor/selected-service", vendorSelectedServiceHandalar)
router.post("/vendor/selected-service", vendorSelectedServiceHandalar)


router.get("/vendor/earning", getvendorbalance)


router.post("/payment/pay", paymentmanage)
router.post("/payment/paytest", paymentmanagetest)
router.post("/payment/response", paymentresponse)

router.get("/payment/check-status", checkStatus)

// subscription

router.post('/subscription/pay', subscriptionManage)
router.post('/subscription/response',subscriptionresponse)
router.get('/subscription/check-status',subscriptioncheckStatus)


// vendor notification

router.post("/vendor-notification", vendorNotificationHandalar)
router.get("/vendor-notification", vendorNotificationHandalar)
router.delete("/vendor-notification/:id", vendorNotificationHandalar)


// vendor payment 

router.post("/vendor/create-payment", vendorPaymentHandalar)
router.get("/vendor/get-payment", vendorPaymentHandalar)
router.patch("/vendor/update-payment", vendorPaymentHandalar)
router.delete("/vendor/remove-payment", vendorPaymentHandalar)


// otp mail 

router.post("/mail-otp", textmail)
module.exports = router;
