const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const cron = require("node-cron");

const db = require("./config/database");
const { getCronJobSchedule } = require("./utils/cronJobSettings");
const { fetchUpdatePatientsList } = require("./utils/fetchUpdatePatientsList");
const { availabilityChecker } = require("./utils/availabilityChecker");

const models = path.join(__dirname, "model");
global.appRoot = path.resolve(__dirname);

// Bootstrap models
// fs.readdirSync(models)
//   .filter((file) => ~file.indexOf(""))
//   .forEach((file) => require(path.join(models, file)));

const connectToDb = () => {
  const options = {
    keepAlive: 1,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  };

  mongoose
    .connect(db.database, options)
    .then((result) => {
      console.log("Database connetion successfull");
    })
    .catch((err) => {
      console.log("Database connection failed");
      console.log(err);
    });

  return mongoose.connection;
};

let useFetchCronJob, fetchCronJob, useAvailabilityCronJob, availabilityCronJob;

const fetchUpdate = () => {
  if (useFetchCronJob) {
    console.log("....Runing Fetch cron job......");
    fetchUpdatePatientsList()
      .then((result) => {
        // console.log(result);
        console.log("Hospital Data Fetchon Done");
      })
      .catch((err) => {
        console.log(err);
        console.log("Oops, something gone wrong");
      });
  }

  // console.log("Fetched Cron started every second");
};

const availabilityUpdate = () => {
  if (useAvailabilityCronJob) {
    console.log("...Running Availability Cron Job");
    availabilityChecker()
      .then((res) => {
        console.log("Availability Cron Job Finished");
      })
      .catch((err) => {
        console.log("Subpage Cron Job Error");
        console.log(err);
      });
  }
};

const listen = async () => {
  console.log("Started cron job services");

  // getting the initial settings when the application loads
  const {
    fetchCronJobEnabled,
    fetch,
    availableCronjobEnabled,
    availability,
  } = await getCronJobSchedule();

  useFetchCronJob = fetchCronJobEnabled;
  fetchCronJob = fetch;
  useAvailabilityCronJob = availableCronjobEnabled;
  availabilityCronJob = availability;

  // starting fetching cron job
  let FetchCron = cron.schedule("* * * * * *", fetchUpdate);
  let AvailabilityCron = cron.schedule("* * * * * *", availabilityUpdate);

  // updating the cronJob timers and controllers by reading the document in every minute
  setInterval(async () => {
    try {
      const {
        fetchCronJobEnabled,
        fetch,
        availableCronjobEnabled,
        availability,
      } = await getCronJobSchedule();
      if (fetchCronJob != fetch) {
        FetchCron.destroy();

        useFetchCronJob = fetchCronJobEnabled;
        fetchCronJob = fetch;

        FetchCron = cron.schedule(fetchCronJob, fetchUpdate);
      } else {
        useFetchCronJob = fetchCronJobEnabled;
        console.log("From the cronJobSetting", useFetchCronJob);
      }
      if (availabilityCronJob != availability) {
        AvailabilityCron.destroy();

        useAvailabilityCronJob = availableCronjobEnabled;
        availabilityCronJob = availability;

        AvailabilityCron = cron.schedule(
          availabilityCronJob,
          availabilityUpdate
        );
      } else {
        useAvailabilityCronJob = availableCronjobEnabled;
        console.log("From the Availability Checker", useAvailabilityCronJob);
      }
    } catch (err) {
      console.log(err);
    }
  }, 5000);
};

const connection = connectToDb();

connection
  .on("error", console.log)
  .on("disconnected", connectToDb)
  .on("open", listen);
