const { Router } = require("express");
const constants = require("../lib/constants");
const { authenticate, authorize } = require("../middlewares/auth");
const { 
    getSlugCategories,
    getSlugCategory,
    createSlugCategory,
} = require("../controllers/slugCategory");

const router = Router();

router.get("/", getSlugCategories);
router.get("/:slug", getSlugCategory);
router.post("/", authenticate, authorize(constants.ADMIN), createSlugCategory);

module.exports = router;