const { Router } = require("express");
const constants = require("../lib/constants");
const { authenticate, authorize } = require("../middlewares/auth");
const { 
    getCategories,
    getCategory,
    createCategory,
    deleteCategory, 
    updateCategory
} = require("../controllers/category");

const router = Router();

router.get("/", getCategories);
router.get("/:id", getCategory);
router.post("/", authenticate, authorize(constants.ADMIN), createCategory);
router.put("/:id", authenticate, authorize(constants.ADMIN), updateCategory);
router.delete("/:id", authenticate, authorize(constants.ADMIN), deleteCategory);

module.exports = router;