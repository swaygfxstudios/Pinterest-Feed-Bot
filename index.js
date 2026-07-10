import fs from "fs";
import { getLatestPin } from "./pinterest.js";
import { sendPin } from "./discord.js";

const memoryFile = "./pinterest.json";

function getPostedPins() {

  if (!fs.existsSync(memoryFile)) {
    return [];
  }

  const data = JSON.parse(
    fs.readFileSync(memoryFile, "utf8")
  );

  return data.posted || [];

}

function savePostedPins(posted) {

  fs.writeFileSync(
    memoryFile,

    JSON.stringify(
      {
        posted: posted.slice(-100)
      },
      null,
      2
    )

  );

}

async function run() {

  console.log(
    "Checking Pinterest..."
  );

  const pin = await getLatestPin();

  if (!pin) {

    console.log(
      "No Pinterest pins found."
    );

    return;

  }

  const posted =
    getPostedPins();

  if (posted.includes(pin.id)) {

    console.log(
      "Already posted. Skipping."
    );

    return;

  }

  console.log(
    "New Pinterest pin found!"
  );

  await sendPin(pin);

  posted.push(pin.id);

  savePostedPins(posted);

  console.log(
    "Finished."
  );

}

run();
