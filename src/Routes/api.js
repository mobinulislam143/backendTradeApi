const express = require('express');
const router = express.Router();
const UserController = require('../controller/UserController')
const ProductController = require('../controller/ProductController')
const AuthverifyMiddleware = require('../middleware/AuthVerifymiddleware');

const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/registration', UserController.UserRegistration)
router.get('/otpVerify/:email/:otp', UserController.UserEmailVerify)
router.post('/login', UserController.login)
router.get('/logout', AuthverifyMiddleware, UserController.logout)
router.get('/profile', AuthverifyMiddleware, UserController.ReadProfile)

router.post('/changeImage', AuthverifyMiddleware, upload.single('profileImage'), UserController.changeImage)

//product
router.post('/create-product', AuthverifyMiddleware, upload.single('image'), ProductController.CreateProduct)
router.post('/update-product/:productId', AuthverifyMiddleware, upload.single('image'), ProductController.updateProduct)

router.get('/All-product',  ProductController.AllProduct)
router.get('/ReadProductById/:productId', AuthverifyMiddleware,  ProductController.ReadProductById)
router.get('/userallProduct', AuthverifyMiddleware,  ProductController.UserAllProduct)
router.get('/deleteProductByUser/:productId', AuthverifyMiddleware,  ProductController.deleteProductByUser)
// Search Product Route
router.get('/product-by-keyword/:keyword', AuthverifyMiddleware, ProductController.ProductByKeyword)
router.post('/ProductByBrandAndCategory', AuthverifyMiddleware, ProductController.ProductByBrandAndCategory)


module.exports = router