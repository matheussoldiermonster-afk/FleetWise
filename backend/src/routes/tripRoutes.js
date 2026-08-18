const express = require("express");

const router = express.Router();

const tripController = require("../controllers/tripController");
const { validate, schemas } = require("../middlewares/security");

router.get("/", tripController.index);

router.post("/", validate(schemas.trip), tripController.create);

router.put("/:id", validate(schemas.trip), tripController.update);

router.delete("/:id", tripController.remove);

module.exports = router;