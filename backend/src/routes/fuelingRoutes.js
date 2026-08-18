const router = require("express").Router();

const FuelingController = require("../controllers/fuelingController");
const { validate, schemas } = require("../middlewares/security");

router.post("/", validate(schemas.fueling), FuelingController.create);
router.get("/", FuelingController.index);
router.get("/:id", FuelingController.show);
router.put("/:id", validate(schemas.fueling), FuelingController.update);
router.delete("/:id", FuelingController.remove);

module.exports = router;