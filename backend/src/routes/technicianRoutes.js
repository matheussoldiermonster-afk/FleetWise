const express = require("express");

const controller = require("../controllers/technicianController");
const { validate, schemas } = require("../middlewares/security");

const router = express.Router();

router.get("/", controller.index);

router.post("/", validate(schemas.technician), controller.create);

router.put("/:id", validate(schemas.technician), controller.update);

router.delete("/:id", controller.remove);

module.exports = router;