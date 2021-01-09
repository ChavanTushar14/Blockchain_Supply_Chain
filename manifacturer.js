const express = require("express")
const{isAuthenticated}  = require('../controllers/auth')
const router=express.Router()
const manifacaturer = require('../controllers/manifacturer')

router.param("id",manifacaturer.getUserByData)
router.post("/callProduct/:id",manifacaturer.callComponent)
router.get("/getManifacturerCallProduct/:id",manifacaturer.getCallProductByManifactureId)
router.get('/getallcallproduct/:id',manifacaturer.geAllCallProduct)
module.exports = router

