import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import config from "./config.js";

export async function getLatestPin() {
  try {

    const response = await axios.get(
      config.pinterest.feedUrl
    );

    const parser = new XMLParser({
      ignoreAttributes: false
    });

    const feed = parser.parse(response.data);

    const items =
      feed.rss?.channel?.item;


    if (!items) {
      console.log("No Pinterest pins found.");
      return null;
    }


    const item = Array.isArray(items)
      ? items[0]
      : items;


    const link =
      typeof item.link === "object"
        ? item.link["#text"]
        : item.link;


    const rawDescription =
      item.description || "";


    // Extract Pinterest image from HTML
    const imageMatch =
      rawDescription.match(
        /<img[^>]+src="([^"]+)"/
      );


    const image =
      imageMatch
        ? imageMatch[1]
        : null;


    // Remove HTML tags
    const cleanDescription =
      rawDescription
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim();



    return {

      id: link,

      title:
        item.title ||
        "New Pinterest Pin",


      description:
        cleanDescription,


      link: link,


      image: image,


      published:
        item.pubDate || null

    };


  } catch(error) {

    console.error(
      "Pinterest RSS Error:",
      error.message
    );


    return null;

  }
}
