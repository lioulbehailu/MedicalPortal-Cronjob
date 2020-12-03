const mongoose = require("mongoose");

const ApplicationAPISettingsSchema = new mongoose.Schema(
  {
    fetchCronJobEnabled: { type: Boolean },
    fetchDate: { type: String },
    fetchDay: { type: String },
    fetchHour: { type: String },
    fetchMinute: { type: String },
    fetchFrequency: { type: String, enum: ["dayly", "weekly", "monthly"] },
    isFetching: { type: Boolean },

    availableCronjobEnabled: { type: Boolean },
    availableDate: { type: String },
    availableDay: { type: String },
    availableHour: { type: String },
    availableMinute: { type: String },
    availableFrequency: { type: String, enum: ["dayly", "weekly", "monthly"] },
  },
  { timestamps: true }
);

ApplicationAPISettingsSchema.statics.getCronJobSettings = function () {
  return new Promise((resolve, reject) => {
    this.find((err, docs) => {
      if (err) {
        reject(err.message || "something gone wrong");
      }
      resolve(docs[0]);
    });
  });
};

module.exports = mongoose.model(
  "ApplicationAPISettings",
  ApplicationAPISettingsSchema
);
