module.exports = {
  launch: {
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: (process.env.HEADLESS || "true") === "true",
    slowMo: process.env.SLO_MO || 0,
    devtools: true,
  },
};
