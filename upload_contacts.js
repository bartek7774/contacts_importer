const axios = require("axios");
const _ = require("lodash");
const {
  saveFile,
  readFile,
  moveFile,
  listFiles,
  asyncForEach,
} = require("./utils.js");

const path = require("path");

const directoryUniq = path.join(__dirname, "uniq_data");
const directoryUniqResults = path.join(__dirname, "results");
const directoryUniqProcessed = path.join(__dirname, "uniq_data_processed");

const uploadContacts = async (data,{url,token}) => {
  try {
    console.log("\n" + "=".repeat(50));
    console.log("Upload to UNIQ");
    console.log("-".repeat(50) + "\n");
    const headers=token?({Authorization:`Bearer ${token}`}):({})
    const response = await axios({
      headers,
      url,
      method: "post",
      data: data,
    });
    return response;
  } catch (err) {
    console.log(`Error uploadContacts `, err);
    throw new Error(err);
  }
};

const processContacts = async (filename, options) => {
  try {
    const filePath = path.join(directoryUniq, `${filename}.json`);
    const newPath = path.join(directoryUniqProcessed, `${filename}.json`);
    const data = await readFile(filePath);
    const { data: response } = await uploadContacts(data,options);
    await saveFile(
      JSON.stringify({
        count: (JSON.parse(data) || []).length,
        filename,
        server: {
          ...response,
        },
      }),
      path.join(directoryUniqResults, `${filename}.json`)
    );
    await moveFile(filePath, newPath);
  } catch (err) {
    console.log(`Error ${filename}.`, err);
  }
};

const processAll = async (filePath,options) => {
  const files = await listFiles(filePath);
  await asyncForEach(files, async (file) => {
    const filename = path.parse(file).name;
    console.log({ filename });
    await processContacts(filename, options);
    console.log("-".repeat(50));
  });
};

const uploadExecutor = async (files = [], options = { url: "", token: "" }) => {
  try {
    if (!options.url) throw new Error("Url required!");

    if (Array.isArray(files) && files.length) {
      console.log("send for files:", files);
      await asyncForEach(files, async (file) => {
        await processContacts(file, options);
      });
    } else {
      console.log("send for all.");
      await processAll(directoryUniq, options);
    }
  } catch (err) {
    console.log(`Error uploadExecutor: `, err);
  }
};

module.exports = {
  uploadExecutor,
};
