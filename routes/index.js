var express = require("express")
var router = express.Router()
var axios = require("axios")
var util = require("util")
const key = process.env.KEY

// /* GET home page. */
router.get("/", function(req, res) {
  res.render("index", { title: "Express" })
})

router.get("/api/currentLocation/:lat/:lng", function(req, res) {
  let lat = req.params.lat
  let lng = req.params.lng
  axios
    .get(
      "https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=" +
        lat +
        "," +
        lng +
        "&radius=300&types=restaurant&key=" +
        key
    )
    .then(response => {
      res.send(response.data)
    })
    .catch(error => console.log(error))
})

router.get("/api/geocode/:address", function(req, res) {
  let address = req.params.address
  console.log(address)
  axios
    .get(
      "https://maps.googleapis.com/maps/api/geocode/json?address=" +
        address +
        "&key=" +
        key
    )
    .then(response => res.send(response.data))
    .catch(error => console.log(error))
})

router.get("/api/reverseGeocode/:lat/:lng", function(req, res) {
  let lat = req.params.lat
  let lng = req.params.lng

  axios
    .get(
      "https://maps.googleapis.com/maps/api/geocode/json?latlng=" +
        lat +
        "," +
        lng +
        "&key=" +
        key
    )
    .then(function(response) {
      res.send(response.data)
    })
    .catch(error => console.log(error))
})

router.get("/api/autocomplete/:input", function(req, res) {
  let input = req.params.input

  axios
    .get(
      "https://maps.googleapis.com/maps/api/place/autocomplete/json?input=" +
        input +
        "&key=" +
        key
    )
    .then(response => res.send(response.data))
    .catch(error => console.log(error))
})

module.exports = router
