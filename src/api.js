'use strict';
const express = require("express");
const sgMail = require("@sendgrid/mail");
const serverless = require('serverless-http');
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb" }));
app.use(cookieParser());
const router = express.Router();

const db = require("../models");
const Data = db.dune_user_data;
db.sequelize.sync();
dotenv.config({ path: "../config.env" });

app.get("/", (req, res) => {
  res.send("Hello from DuneAesthetics!");
});

var allowedDomains = [
  "http://localhost:3000",
  "https://sendgrid.api-docs.io",
  "https://duneaesthetics.vercel.app",
  "https://duneaesthetics.com",
];

const SENDGRID_API = process.env.API_KEY;
sgMail.setApiKey(SENDGRID_API);

app.use(
  cors({
    origin: function (origin, callback) {
      // bypass the requests with no origin (like curl requests, mobile apps, etc )
      if (!origin) return callback(null, true);

      if (allowedDomains.indexOf(origin) === -1) {
        var msg = `This site ${origin} does not have an access. Only specific domains are allowed to access it.`;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);
app.use(`/.netlify/functions/server`, router);
const giveAccess=true;

app.get("/duneaesthetics",async(req,res)=>{
  try {
    if(giveAccess)
    {
      res.status(200).send({message:"Great"});
    }
    else{
      res.status(404).send({message:"not authorized"});
    }
  } catch (error) {
    console.log(error);
  }
})

app.post("/sendmail", async (req, res) => {
  try {
    const { name, phone, email, note, date } = req.body;
    if (!name || !phone) {
      return res
        .status(400)
        .send({ message: "Please enter all the mandatory details" });
    }
    const userData = {
      customer_name: name,
      phone_number: phone,
      customer_email: email,
      appointment_date: date,
      notes: note,
    };
    Data.create(userData)
      .then((data) => {
        res.status(200);
      })
      .catch((err) => {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Tutorial.",
        });
      });

    const message = {
      to: "devashishbhandari09@gmail.com",
      from: "info@duneaesthetics.com",
      subject: "New Customer Enquiry",
      text: "New Customer Enquiry",
      html: `<h3>New customer Enquiry</h3><br /><h4>Name : <p>${name}</p></h4><br /><h4>Phone : <p>${phone}</p></h4><br /><h4>Appointment Date : <p>${date}</p></h4><br /><h4>Email : <p>${email}</p></h4><br /><h4>Any Note : <p>${note}</p></h4><br />`,
    };
    const mailSent = await sgMail.send(message);
    if (mailSent) {
      res.status(200).send({ message: "Mail has been sent to the user." });
    }
  } catch (error) {
    res
      .status(404)
      .send({ message: "Something went wrong! Please try again later" });

    console.log(error);
  }
});
app.use(`/.netlify/functions/api`, router);

app.listen(process.env.PORT || 3001, () => {
  console.log(`server running at port ${process.env.PORT}`);
});

module.exports = app;
module.exports.handler = serverless(app);
