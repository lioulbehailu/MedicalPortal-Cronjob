const ApplicationAPISetting = require("../model/ApplicationSettings");

const getCronJobSchedule = async () => {
  try {
    const settings = await ApplicationAPISetting.getCronJobSettings();
    switch (settings.fetchFrequency) {
      case "dayly":
        settings.fetchDate = "*";
        settings.fetchDay = "*";
        break;
      case "weekly":
        settings.fetchDate = "*";
        break;
      case "monthly":
        settings.fetchDay = "*";
    }

    const fetch = `${settings.fetchMinute || "*"} ${
      settings.fetchHour || "*"
    } ${settings.fetchDate || "*"} * ${settings.fetchDay || "*"}`;

    switch (settings.availableFrequency) {
      case "dayly":
        settings.availableDate = "*";
        settings.availableDay = "*";
        break;
      case "weekly":
        settings.availableDate = "*";
        break;
      case "monthly":
        settings.availableDay = "*";
    }

    const availability = `${settings.availableMinute || "*"} ${
      settings.availableHour || "*"
    } ${settings.availableDate || "*"} * ${settings.availableDay || "*"}`;

    return {
      fetchCronJobEnabled: settings.fetchCronJobEnabled,
      fetch,
      availableCronjobEnabled: settings.availableCronjobEnabled,
      availability,
    };
  } catch (err) {
    return {
      error:
        err.message || "someting gone wrong on retrieving setting document",
    };
  }
};

module.exports = { getCronJobSchedule };
