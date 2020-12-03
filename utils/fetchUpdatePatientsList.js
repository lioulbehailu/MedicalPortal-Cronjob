const axios = require("axios");
const csvStringify = require("csv-stringify");
const fs = require("fs");

const { updateHospitalAvailability } = require("../model/utils");

const ApplicationAPISettings = require("../model/ApplicationSettings");
const Patients = require("../model/patients");
const Hospital = require("../model/hospital");

const fetchCall = (url, callback, error = (err) => console.log(err)) => {
  /**
   * Prepare the Tokens to fetch from the api
   */
  try {
    //  parallel()

    const authToken =
      "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6IjVmYWQ4ZWQ1MDgwYzA4NTNiMTY2NDBjNCJ9LCJpYXQiOjE2MDY4MjAzMDIsImV4cCI6MTYwNzQyNTEwMn0.F-PmYtI2P0o10fk6m7lpS8GhM5X6aDwNbONWRm1KCHo";

    axios
      .get(`${url}`, { headers: { Authorization: authToken } })
      .then((res) => {
        callback(res);
      })
      .catch((err) => error(err));
  } catch (err) {
    return error(err);
  }
};

const fetch = (url) => {
  return new Promise((resolve, reject) => {
    fetchCall(url, (results) => {
      resolve(results);
    }),
      (error) => {
        reject(error);
      };
  });
};

const fetchUpdatePatientsList = async () => {
  const appSetting = await ApplicationAPISettings.find({});

  return new Promise(async (resolve, reject) => {
    try {
      const hospitalDocuments = await Hospital.getHospitals();
      const errors = [];
      const resolved = [];

      if (Array.isArray(hospitalDocuments)) {
        for (const hospital of hospitalDocuments) {
          try {
            updateHospitalAvailability(
              { isFetching: true },
              { _id: hospital._id },
              "Hospital"
            );

            updateHospitalAvailability(
              { isFetching: true },
              { _id: appSetting[0]._id },
              "ApplicationAPISettings"
            );

            const patients_data = await fetch(hospital.patients_API);
            const doctor_data = await fetch(hospital.doctor_API);

            /**
             * Getting the Data from the hospital included API
             */

            updateHospitalAvailability(
              { isFetching: false },
              { _id: hospital._id },
              "Hospital"
            );

            updateHospitalAvailability(
              { isFetching: false },
              { _id: appSetting[0]._id },
              "ApplicationAPISettings"
            );

            // console.log("This is Hospital Data");
            // console.log(patients_data.data);
            // console.log(doctor_data.data);

            /**
             * Write the Fetched Data to a File
             */
            // fs.writeFile(
            //   `../MedicPortal DataProcessing/FetchedData/${hospital.HospitalName}.csv`,
            //   JSON.stringify(patients_data.data),
            //   (err) => {
            //     console.log(err);
            //   }
            // );

            csvStringify(
              patients_data.data.patients,
              { header: true },
              (err, output) => {
                fs.writeFile(
                  `../MedicPortal DataProcessing/FetchedData/${hospital.HospitalName}.csv`,
                  output,
                  (err) => {
                    console.log(err);
                  }
                );
              }
            );

            resolved.push({ patientList: patients_data.data });
          } catch (error) {
            errors.push({ _id: hospital._d, result });
          }
        }
      }
      // console.log("=======", resolved);
      resolve(resolved);
    } catch (err) {
      reject(err.message || "AN Error Occured");
    }
  });
};

module.exports = { fetchUpdatePatientsList };
