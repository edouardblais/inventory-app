const express = require("express");
const router = express.Router();

// Require controller modules.
const gear_controller = require("../controllers/gearController");
const category_controller = require("../controllers/categoryController");

// GET shop home page.
router.get("/", category_controller.index);

// Categories

// GET request for creating a category entry. 
router.get("/category/create", category_controller.category_create_get);

// POST request for creating a category entry.
router.post("/category/create", category_controller.category_create_post);

// GET request to delete category
router.get("/category/:name/:id/delete", category_controller.category_delete_get);

// POST request to delete category.
router.post("/category/:name/:id/delete", category_controller.category_delete_post);

// GET request to update category.
router.get("/category/:name/:id/update", category_controller.category_update_get);

// POST request to update category.
router.post("/category/:name/:id/update", category_controller.category_update_post);

// GET request for one category.
router.get("/category/:name/:id", category_controller.category_detail);

// GET request for list of all categories.
router.get("/categories", category_controller.categories_list);

// Gear

// GET request for creating a gear entry. 
router.get("/gear/create", gear_controller.gear_create_get);

// POST request for creating a gear entry.
router.post("/gear/create", gear_controller.gear_create_post);

// GET request to delete gear.
router.get("/gear/:name/:id/delete", gear_controller.gear_delete_get);

// POST request to delete gear.
router.post("/gear/:name/:id/delete", gear_controller.gear_delete_post);

// GET request to update gear.
router.get("/gear/:name/:id/update", gear_controller.gear_update_get);

// POST request to update gear.
router.post("/gear/:name/:id/update", gear_controller.gear_update_post);

// GET request for one gear.
router.get("/gear/:name/:id", gear_controller.gear_detail);

// GET request for list of all gear items.
router.get("/gear", gear_controller.gear_list);

module.exports = router;