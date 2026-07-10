import axios from "axios";
import config from "./config.js";

export async function sendPin(pin) {

  try {

    const description =
      pin.description.length > 200
        ? pin.description.substring(0, 200) + "..."
        : pin.description;

    const embed = {

      username:
        config.botName,

      embeds: [

        {

          title:
            "📌 New Pinterest Pin",

          description:

            description || pin.title,

          color:
            0xE60023,

          image:

            pin.image
              ? {
                  url: pin.image
                }
              : undefined,

          fields: [

            {
              name:
                "🔗 View Pin",

              value:
                `[Open Pinterest](${pin.link})`
            }

          ],

          footer: {

            text:
              config.botName

          },

          timestamp:

            pin.published
              ? new Date(
                  pin.published
                ).toISOString()
              : new Date().toISOString()

        }

      ]

    };


    await axios.post(

      config.discord.webhook,

      embed

    );


    console.log(
      "Pinterest pin sent to Discord."
    );


  } catch (error) {

    console.error(
      "Discord Error:",
      error.message
    );

  }

}
