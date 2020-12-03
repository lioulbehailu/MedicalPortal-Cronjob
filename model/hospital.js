const { timeStamp } = require("console");
const mongoose = require("mongoose");
const { resolve } = require("path");

const HospitalSchema = mongoose.Schema(
  {
    HospitalName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    encryptedPassword: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    patients_API: {
      type: String,
      required: true,
    },
    doctor_API: {
      type: String,
    },
    isOnline: {
      type: Boolean,
    },
    lastChecked: {
      type: Date,
    },
    status: {
      type: String,
    },
    isFetching: {
      type: Boolean,
    },
    role: {
      type: String,
      enum: ["hospital"],
      required: true,
    },
  },
  { timeStamp: true }
);

HospitalSchema.statics.getHospitals = function () {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if (err) {
        return reject(err.message || "An error occured");
      }

      resolve(docs);
    });
  });
};

module.exports = mongoose.model("Hospital", HospitalSchema);
