const mongoose = require("mongoose");

const updateHospitalAvailability = (fieldsAndValues, filter, modelsName) => {
  const model = mongoose.model(modelsName);
  return new Promise((resolve, reject) => {
    model
      .findOneAndUpdate(filter, { $set: fieldsAndValues }, { new: true })
      .exec((err, doc) => {
        if (err) {
          console.log("Update Hospital field by ID: ");
          reject({
            message: err.message || "Unknown error occured",
            status: err.status || 500,
          });

          if (doc) {
            resolve(doc);
          } else {
            reject({ message: "Resource not found", status: 404 });
          }
        }
      });
  });
};

module.exports = { updateHospitalAvailability };
