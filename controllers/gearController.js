const Gear = require("../models/gear");

const async = require('async');

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
exports.gear_create_get = (req, res) => {
  res.send("NOT IMPLEMENTED: gear create GET");
};

// Handle gear create on POST.
exports.gear_create_post = (req, res) => {
  res.send("NOT IMPLEMENTED: gear create POST");
};

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
