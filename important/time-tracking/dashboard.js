const data = JSON.parse(localStorage.getItem("timeTrackingData") || "{}");
const statsEl = document.getElementById("stats");

function secondsToHours(s) {
  return (s / 3600).toFixed(2);
}

function getDates(range) {
  const days =
    range === "day" ? 1 :
    range === "week" ? 7 : 30;

  return [...Array(days)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().slice(0, 10);
  });
}

function render(range) {
  const totals = {};

  for (const date of getDates(range)) {
    const day = data[date];
    if (!day) continue;

    for (const topic in day) {
      const topicNode = day[topic];
      const topicSeconds =
        Object.values(topicNode)
          .flatMap(sec => Object.values(sec))
          .reduce((a, b) => a + (b.seconds || 0), 0);

      totals[topic] = (totals[topic] || 0) + topicSeconds;
    }
  }

  statsEl.innerHTML = Object.entries(totals)
    .map(([topic, sec]) =>
      `<p><strong>${topic}</strong>: ${secondsToHours(sec)} hours</p>`
    )
    .join("");
}

document.getElementById("range").onchange = e => render(e.target.value);
render("day");
