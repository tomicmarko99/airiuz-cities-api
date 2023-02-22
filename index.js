const express = require("express");
const axios = require("axios");
var cors = require("cors");

const PORT = process.env.PORT || 8000;
const app = express();
app.use(cors());

var options = {
  method: "GET",
  url: "https://waqi.info/rtdata/ranking/index2.json",
  params: { _: "1673444568832" },
  headers: {
    authority: "waqi.info",
    accept: "*/*",
    "accept-language": "en-US,en;q=0.9",
    "cache-control": "no-cache",
    pragma: "no-cache",
    referer: "https://waqi.info/",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent":
      "Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1",
  },
};

const waqidata = [];
const waqicities = [];

axios
  .request(options)
  .then(function (response) {
    // console.log(response.data);
    waqidata.push(...response.data.cities.map((city) => city.country));

    waqidata.forEach((country) => {
      axios
        .get(`https://waqi.info/rtdata/ranking/${country}.json`)
        .then((response) => {
          console.log(response.data);
          const cities = response.data.cities.map((x) => ({
            country: country,
            city: x.city,
            ctname: x.city,
          }));
          waqicities.push(...cities);
        })
        .catch((error) => {
          console.error(error);
        });
    });

    app.get("/", (req, res) => {
      res.json("Welcome to Airiuz-cities-api");
    });

    app.get("/countries", (req, res) => {
      res.json(waqidata);
    });

    app.get("/cities", (req, res) => {
      res.json(waqicities);
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(function (error) {
    console.error(error);
  });
