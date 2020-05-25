const axios = require("axios");
const _ = require("lodash");
const {URL_AUTH_UNIQ,CREDENTIALS} = require('./config');

const proceedAuthorization = async (
  url = URL_AUTH_UNIQ,
  credentials = CREDENTIALS
) => {
  try {
    const response = await axios({
      url,
      method: "post",
      data: credentials,
    });
    const token = _.get(response, "data.token");
    console.log("\n" + "=".repeat(50));
    console.log(`Authorization to ${url}. \nSUCCESS!`);
    console.log("-".repeat(50));
    console.log(`Token obtained:\n${token}`)
    return token;
  } catch (err) {
    console.log(`Error was occurred while authorization`, err);
    throw new Error(err);
  }
};

module.exports={
  proceedAuthorization
}
