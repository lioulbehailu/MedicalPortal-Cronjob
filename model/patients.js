const mongoose = require("mongoose");

/**
 *
 * PATIENT RECORDS THAT ARE LINKED USING RECORD LINKAGE ALGORITHM
 *
 */

const PatientsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    fatherName: {
      type: String,
      required: true,
    },
    grandFatherName: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: true,
    },
    dayOfBirth: {
      type: String,
      required: true,
    },
    monthOfBirth: {
      type: String,
      required: true,
    },
    yearOfBirth: {
      type: String,
      required: true,
    },
    age: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    history: [
      {
        date: { type: String },
        test: { type: String },
        description: { type: String },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patients", PatientsSchema);
