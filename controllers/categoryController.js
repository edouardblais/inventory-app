const Category = require("../models/category");
const Gear = require("../models/gear");

const async = require("async");

exports.index = (req, res) => {
  async.parallel(
    {
      gear_count(callback) {
        Gear.countDocuments({}, callback); 
      },
      categories_count(callback) {
        Category.countDocuments({}, callback);
      },
    },
    (err, results) => {
      res.render("index", {
        title: "Climbing Shop Inventory",
        error: err,
        data: results,
      });
    }
  );
};

// Display list of all categories.
exports.categories_list = function (req, res, next) {
  Category.find({}, "name")
    .sort({ name: 1 })
    .exec(function (err, list_categories) {
      if (err) {
        return next(err);
      }
      res.render("categories_list", { title: "List of all categories", categories_list: list_categories });
    });
};
// Display detail page for a specific category.
exports.category_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: Category detail: ${req.params.name}`);
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create GET");
};

// Handle category create on POST.
exports.category_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: Category create POST");
};

// Display category delete form on GET.
exports.category_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: Category delete GET");
};

// Handle category delete on POST.
exports.category_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category delete POST");
};

// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category update POST");
};
