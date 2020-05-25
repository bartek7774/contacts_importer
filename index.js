const { generateSQLfromCSV } = require("./sql_generator");
const { sqlExecutor } = require("./sql_executor");
const { uploadExecutor } = require("./upload_contacts");
const {proceedAuthorization} = require('./authorization');
const { createSummary } = require("./summary");
const { getSqlQuery, getSqlQuerySWS } = require("./sql_queries.js");
const {
  mapper_phone,
  mapper_sws,
  filter_sws,
  pickUniqFields,
} = require("./other");
// const {URL_UNIQ} =require('./config');

const URL_UNIQ = "https://enaak18yvnf8.x.pipedream.net/";

const start = async () => {
  await generateSQLfromCSV("sws.csv", getSqlQuerySWS, mapper_sws, filter_sws);
  // await sqlExecutor(["1_1000"], pickUniqFields);
  const token=await proceedAuthorization();
  await uploadExecutor(["1_1000"], {url: URL_UNIQ, token});
  // await createSummary();
  console.log("OK");
};

start();
