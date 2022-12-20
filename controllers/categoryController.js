const Category = require("../models/category");
const Gear = require("../models/gear");

const async = require("async");

const { body, validationResult } = require("express-validator");

const capitalizeFirstLetter= (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

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

// Display detail page for a specific Category.
exports.category_detail = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },

      category_gear(callback) {
        Gear.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        const err = new Error("Category not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("category_detail", {
        title: "Category Detail",
        category: results.category,
        category_gear: results.category_gear,
      });
    }
  );
};

// Display category create form on GET.
exports.category_create_get = (req, res) => {
  res.render("category_form", {title: "Create a new category"})
};

// Handle Category create on POST.
exports.category_create_post = [
  // Validate and sanitize the name field.
  body("name", "Category name required").trim().isLength({ min: 1 }).escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data and capitalize the first letter.
    const category = new Category({ name: capitalizeFirstLetter(req.body.name) });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("category_form", {
        title: "Create a new category",
        category,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Category with same name already exists.
      Category.findOne({ name: category.name }).exec((err, found_category) => {
        if (err) {
          return next(err);
        }

        if (found_category) {
          // Category exists, redirect to its detail page.
          res.redirect(found_category.url);
        } else {
          category.save((err) => {
            if (err) {
              return next(err);
            }
            // Category saved. Redirect to category detail page.
            res.redirect(category.url);
          });
        }
      });
    }
  },
];


// Display Category delete form on GET.
exports.category_delete_get = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.params.id).exec(callback);
      },
      category_gear(callback) {
        Gear.find({ category: req.params.id }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.category == null) {
        // No results.
        res.redirect("/shop/categories");
      }
      // Successful, so render.
      res.render("category_delete", {
        title: "Delete a category",
        category: results.category,
        category_gear: results.category_gear,
      });
    }
  );
};


// Handle Category delete on POST.
exports.category_delete_post = (req, res, next) => {
  async.parallel(
    {
      category(callback) {
        Category.findById(req.body.categoryid).exec(callback);
      },
      category_gear(callback) {
        Gear.find({ category: req.body.categoryid }).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success
      if (results.category_gear.length > 0) {
        // Category has gear associated to it. Render in same way as for GET route.
        res.render("category_delete", {
          title: "Delete a category",
          category: results.category,
          category_gear: results.category_gear,
        });
        return;
      }
      // Category has no gear associated. Delete object and redirect to the list of categories.
      Category.findByIdAndRemove(req.body.categoryid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to categories list
        res.redirect("/shop/categories");
      });
    }
  );
};


// Display category update form on GET.
exports.category_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: category update GET");
};

// Handle category update on POST.
exports.category_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: category update POST");
};
