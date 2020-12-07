const checker = require("link-check");

const Hospital = require("../model/hospital");
const { updateHospitalAvailability } = require("../model/utils");

const checkLink = (link) => {
  return new Promise((resolve, reject) => {
    checker(link, async (err, result) => {
      if (err) {
        reject({ err });
      }

      resolve(result);
    });
  });
};

const statusTypes = ["Unknown", "100's", "200's", "300's", "400's", "500's"];

const getStatusClassification = (status) => {
  if (typeof status === "number") {
    if (status < 200) {
      return statusTypes[1];
    } else if (status >= 200 && status < 300) {
      return statusTypes[2];
    } else if (status >= 300 && status < 400) {
      return statusTypes[3];
    } else if (status >= 400 && status < 500) {
      return statusTypes[4];
    } else if (status >= 500 && status < 600) {
      return statusTypes[5];
    }
  }

  return statusTypes[0];
};

const setStatus = (linkStatus) => {
  if (linkStatus.statusCode === 200) {
    return "Ok";
  } else if (linkStatus.statusCode === 401) {
    return "UnAuthorized";
  } else if (linkStatus.statusCode === 404) {
    return "Not Found";
  }
  return linkStatus.status;
};

const availabilityChecker = () => {
  return new Promise((resolve, reject) => {
    Hospital.find({}, async (err, doc) => {
      if (err) {
        console.log("Avalability Checker Error");
        reject(err);
      }
      if (doc.length === 0) {
        reject({ mesage: "No Hospital Found" });
      }

      const updateError = [];
      for (const link of doc) {
        // console.log("this is hospital list", link);

        const { _id, patients_API } = link;
        try {
          const linkStatus = await checkLink(patients_API);
          if (linkStatus.status) {
            const linkFromStatusClassifier = getStatusClassification(
              linkStatus.statusCode
            );
            const updateData = {
              status: setStatus(linkStatus),
              lastChecked: Date.now(),
            };

            console.log(updateData);

            if (
              linkStatus.statusCode === 200 ||
              linkStatus.statusCode === 401
            ) {
              updateData.isOnline = true;
            } else {
              updateData.isOnline = false;
            }

            try {
              updateHospitalAvailability(updateData, { _id }, "Hospital");
            } catch (err) {
              updateError.push(_id, err);
            }
          }
        } catch (err) {
          reject(err.mesage || 500);
        }
      }
      resolve({ message: "All Documents updated" });
    });
  });
};

module.exports = {
  availabilityChecker,
};
