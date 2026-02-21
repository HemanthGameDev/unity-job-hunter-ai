import Parser from "rss-parser";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const parser = new Parser();

const KEYWORDS = ["unity", "game developer"];
const LOCATIONS = ["hyderabad", "remote"];

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
  await resend.emails.send({
    from: "Job Hunter <onboarding@resend.dev>",
    to: EMAIL,
    subject: "🚀 New Unity Job Found!",
    html: `
      <h2>New Job Match</h2>
      <p><strong>Title:</strong> ${jobTitle}</p>
      <p><a href="${link}">View Job</a></p>
    `
  });

  console.log("Email sent:", jobTitle);
}

async function checkJobs() {
  for (const feed of feeds) {
    const feedData = await parser.parseURL(feed);

    for (const item of feedData.items) {
      if (matchesCriteria(item.title, item.contentSnippet || "")) {
        await sendEmail(item.title.trim(), item.link);
      }
    }
  }
}

checkJobs();