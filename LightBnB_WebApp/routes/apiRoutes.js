const express = require("express");
const propertyQueries = require("../db/properties");
const reservationsyQueries = require("../db/reservations");

const router = express.Router();

router.get("/properties", (req, res) => {
  // console.log(req.query);
  propertyQueries
    .getAllProperties(req.query, 5)
    .then((properties) => res.send({ properties }))
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

router.get("/reservations", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ error: "error" });
  }

  reservationsyQueries
    .getAllReservations(userId)
    .then((reservations) => res.send({ reservations }))
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

router.post("/properties", (req, res) => {
  const userId = req.session.userId;
  if (!userId) {
    return res.send({ error: "error" });
  }

  const newProperty = req.body;
  newProperty.owner_id = userId;
  propertyQueries
    .addProperty(newProperty)
    .then((property) => {
      res.send(property);
    })
    .catch((e) => {
      console.error(e);
      res.send(e);
    });
});

module.exports = router;
