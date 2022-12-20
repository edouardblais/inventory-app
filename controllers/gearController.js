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


// Display Gear delete form on GET.
exports.gear_delete_get = (req, res, next) => {
  async.parallel(
    {
      gear(callback) {
        Gear.findById(req.params.id).populate('category').exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.gear == null) {
        // No results.
        res.redirect("/shop/gear");
      }
      // Successful, so render.
      res.render("gear_delete", {
        title: "Delete a gear item",
        gear: results.gear,
      });
    }
  );
};


// Handle Gear delete on POST.
exports.gear_delete_post = (req, res, next) => {
  async.parallel(
    {
      gear(callback) {
        Gear.findById(req.body.gearid).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      // Success. Delete object and redirect to the list of gear.
      Gear.findByIdAndRemove(req.body.gearid, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to gear list
        res.redirect("/shop/gear");
      });
    }
  );
};


// Display gear update form on GET.
exports.gear_update_get = (req, res, next) => {
  // Get gear and categories for form.
  async.parallel(
    {
      gear(callback) {
        Gear.findById(req.params.id)
          .populate("category")
          .exec(callback);
      },
      categories(callback) {
        Category.find(callback);
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
      // Success.
      // Mark our selected category as checked.
      for (const category of results.categories) {
          if (results.gear.category._id.toString() === category._id.toString()) {
            category.checked = "true";
          }
      }
      res.render("gear_form", {
        title: "Update gear",
        categories: results.categories,
        gear: results.gear,
      });
    }
  );
};


// Handle gear update on POST.
exports.gear_update_post = [
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
      _id: req.params.id, //This is required, or a new ID will be assigned!
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
            title: "Update gear",
            categories: results.categories,
            gear: results.gear,
            errors: errors.array(),
          });
        }
      );
      return;
    } 

    // Data from form is valid. Update the record.
    Gear.findByIdAndUpdate(req.params.id, gear, {}, (err, thegear) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to gear detail page.
      res.redirect(thegear.url);
    });
  },
];

