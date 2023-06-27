import express from "express";
import cors from "cors";

//import cheerio and express
import { load } from "cheerio";
import axios from "axios";

//initialise express application
const app = express();
app.use(cors());

//api route to handle requests
app.get("/api/preview", async (req, res) => {
  try {
    //get url to generate preview, the url will be based as a query param.

    const { url } = req.query;
    /*request url html document*/
    const { data } = await axios.get(url);
    //load html document in cheerio
    const $ = load(data);

    /*function to get needed values from meta tags to generate preview*/
    const getMetaTag = (name) => {
      return (
        $(`meta[name=${name}]`).attr("content") ||
        $(`meta[propety="twitter${name}"]`).attr("content") ||
        $(`meta[property="og:${name}"]`).attr("content")
      );
    };

    /*Fetch values into an object */
    const preview = {
      url,
      title: $("title").first().text(),
      favicon:
        $('link[rel="shortcut icon"]').attr("href") ||
        $('link[rel="alternate icon"]').attr("href"),
      description: getMetaTag("description"),
      image: getMetaTag("image"),
      author: getMetaTag("author"),
    };

    //Send object as response
    res.status(200).json(preview);
  } catch (error) {
    res
      .status(500)
      .json(
        "Something went wrong, please check your internet connection and also the url you provided"
      );
  }
});

/* */

//tell express to expose server from port 4000
app.listen(4000, () => {
  console.log("Server running on port 4000");
});
