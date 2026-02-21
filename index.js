import axios from "axios";
import Parser from "rss-parser";

const parser = new Parser();

const KEYWORDS = ["unity", "game developer"];
const LOCATIONS = ["hyderabad", "remote"];

const EMAILJS_SERVICE_ID = process.env.SERVICE_ID;
const EMAILJS_TEMPLATE_ID = process.env.TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY = process.env.PUBLIC_KEY;

const EMAIL = "gunti.hemanth.kumar.dev@gmail.com";

const feeds = [
  "https://remoteok.com/remote-dev-jobs.rss",
  "https://weworkremotely.com/categories/remote-programming-jobs.rss"
];

function matchesCriteria(title, content) {
  const text = (title + " " + content).toLowerCase();

  const hasKeyword = KEYWORDS.some(k => text.includes(k));
  const hasLocation = LOCATIONS.some(l => text.includes(l));

  return hasKeyword && hasLocation;
}

async function sendEmail(jobTitle, link) {
  await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
    service_id: EMAILJS_SERVICE_ID,
    template_id: EMAILJS_TEMPLATE_ID,
    user_id: EMAILJS_PUBLIC_KEY,
    template_params: {
      to_email: EMAIL,
      job_title: jobTitle,
      job_link: link
    }
  });

  console.log("Email sent for:", jobTitle);
}

async function checkJobs() {
  for (const feed of feeds) {
    const feedData = await parser.parseURL(feed);

    for (const item of feedData.items) {
      if (matchesCriteria(item.title, item.contentSnippet || "")) {
        await sendEmail(item.title, item.link);
      }
    }
  }
}

checkJobs();