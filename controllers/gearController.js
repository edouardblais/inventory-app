const Gear = require("../models/gear");
const Category = require("../models/category");

const async = require('async');

const { body, validationResult } = require("express-validator");

const capitalizeFirstLetter= (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

// Display list of all gear.
exports.gear_list = function (req, res, next) {
  Gear.find({}, "name brand category price number_in_stock")
    .sort({ category: 1 })
    .populate("category")
    .exec(function (err, list_gear) {
      if (err) {
        return next(err);
      }
      res.render("gear_list", { title: "Gear List", gear_list: list_gear });
    });
};

// Display detail page for a specific piece of gear.
exports.gear_detail = (req, res, next) => {
  async.parallel(
    {
      gear(callback) {
        Gear.findById(req.params.id)
          .populate("category")
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.gear == null) {
        // No results.
        const err = new Error("Gear not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render.
      res.render("gear_detail", {
        title: results.gear.name,
        gear: results.gear,
      });
    }
  );
};

// Display gear create form on GET.
exports.gear_create_get = (req, res, next) => {
  async.parallel(
    {
      gear(callback) {
        Gear.find(callback);
      },
      categories(callback) {
        Category.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("gear_form", {
        title: "Add new gear",
        gear: results.gear,
        categories: results.categories,
      });
    }
  );
};

// Handle gear create on POST.
exports.gear_create_post = [

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("brand", "Brand must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("description", "Description must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty").escape(),
  body("number_in_stock", "Number in stock must not be empty").escape(),
  body("category.*").escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Gear object with escaped and trimmed data.
    const gear = new Gear({
      name: capitalizeFirstLetter(req.body.name),
      brand: capitalizeFirstLetter(req.body.brand),
      description: req.body.description,
      price: req.body.price,
      number_in_stock: req.body.number_in_stock,
      category: req.body.category,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all categories for form.
      async.parallel(
        {
          categories(callback) {
            Category.find(callback);
          }
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected categories as checked.
          for (const category of results.categories) {
            if (category._id === gear.category._id) {
              category.checked = "true";
            }
          }
          res.render("gear_form", {
            title: "Add new gear",
            categories: results.categories,
            errors: errors.array(),
          });
        }
      );
      return;
    } else {
      // Data from form is valid.
      // Check if Gear with same name and brand already exists.
      Gear.findOne({ name: gear.name, brand: gear.brand}).exec((err, found_gear) => {
        if (err) {
          return next(err);
        }

        if (found_gear) {
          // Gear exists, redirect to its detail page.
          res.redirect(found_gear.url);
        } else {
          // Data from form is valid and no duplicates exist. Save gear.
          gear.save((err) => {
            if (err) {
              return next(err);
            }
            // Successful: redirect to new gear record.
            res.redirect(gear.url);
          });
        }
      })
    }
  },
];


// Display gear delete form on GET.
exports.gear_delete_get = (req, res) => {
  res.send("NOT IMPLEMENTED: gear delete GET");
};

// Handle gear delete on POST.
exports.gear_delete_post = (req, res) => {
  res.send("NOT IMPLEMENTED: gear delete POST");
};

// Display gear update form on GET.
exports.gear_update_get = (req, res) => {
  res.send("NOT IMPLEMENTED: gear update GET");
};

// Handle gear update on POST.
exports.gear_update_post = (req, res) => {
  res.send("NOT IMPLEMENTED: gear update POST");
};
