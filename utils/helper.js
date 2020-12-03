const dns = require("dns");

const getIpAddress = (url) => {
  return new Promise((resolve, reject) => {
    dns.lookup(url, (err, address) => {
      if (err) {
        reject("Failed to get IP");
      } else {
        resolve(address);
      }
    });
  });
};

const getDomainAndProtocol = (url) => {
  let mainUrl = null;

  if (typeof url === "string") {
    mainUrl = url.replace(/([^:]\/)\/+/g, "$1");
  }

  const theUrl = patternTwo.match(mainUrl);
  if (!theUrl) {
    return { domain: null, protocol: null, subpages: null };
  }
  const domain = `${theUrl.subdomain || ""}${theUrl.subdomain ? "." : ""}${
    theUrl.domain
  }.${theUrl.tld}`.replace(/\s+/g, "");
  let subpages = theUrl._ || null;
  subpages = typeof subpages === "string" ? subpages.replace(/\s+/g, "") : null;
  return { domain, protocol: theUrl.protocol, subpages };
};

module.exports = {
  getIpAddress,
  getDomainAndProtocol,
};
