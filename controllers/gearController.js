const Gear = require("../models/gear");

// Display list of all gear.
exports.gear_list = (req, res) => {
  res.send("NOT IMPLEMENTED: gear list");
};

// Display detail page for a specific gear.
exports.gear_detail = (req, res) => {
  res.send(`NOT IMPLEMENTED: gear detail: ${req.params.id}`);
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
