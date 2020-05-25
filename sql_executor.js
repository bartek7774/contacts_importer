const { Client } = require("pg");
const _ = require("lodash");
const path = require("path");
const { saveFile, readFile, listFiles, asyncForEach } = require("./utils.js");
const {dbConfig} =require('./config');
const directorySqlQueries = path.join(__dirname, "sql_generated");
const directorySaveResponses = path.join(__dirname, "uniq_data");

const client = new Client(dbConfig);

client.connect();

const fetchDB = async (sql) => {
  try {
    console.log("\n" + "=".repeat(50));
    console.log("Client PG connected");
    console.log("-".repeat(50));
    const startTime = new Date().getTime();
    console.log(`Query started ...`);
    const results = await client.query(sql);
    const endTime = new Date(new Date().getTime() - startTime);
    console.log(
      `Query resolved  ${endTime.getMinutes() * 60 + endTime.getSeconds()}s.`
    );
    return results;
  } catch (err) {
    throw `fetchDB ${err}`;
  }
};

const storeQueryResults = async (filename, mapFunc) => {
  try {
    const filePath = path.join(directorySqlQueries, `${filename}.sql`);
    const filePathSaved = path.join(directorySaveResponses, `${filename}.json`);
    const sqlQuery = await readFile(filePath);
    const fetchedData = await fetchDB(sqlQuery);
    const filteredData = (_.get(fetchedData, "rows") || []).map(mapFunc);
    await saveFile(JSON.stringify(filteredData), filePathSaved);
  } catch (err) {
    console.log(`Error ${filename}.`, err);
  }
};

const generateAll = async (filePath, mapFunc) => {
  const files = await listFiles(filePath);
  await asyncForEach(files, async (file) => {
    const filename = path.parse(file).name;
    console.log({ filename });
    await storeQueryResults(filename, mapFunc);
    console.log("-".repeat(50));
  });
};

const sqlExecutor = async (files = [], mapper = (f) => f) => {
  try {
    if (Array.isArray(files) && files.length) {
      console.log("fetch for files:", files);
      await asyncForEach(files, async (file) => {
        await storeQueryResults(file, mapper);
        console.log(`${file} completed.`);
      });
    } else {
      console.log("fetch for all files");
      await generateAll(directorySqlQueries, mapper);
    }
  } catch (err) {
    console.log(`Error sqlExecutor: `, err);
  }
};

module.exports = {
  sqlExecutor,
};
