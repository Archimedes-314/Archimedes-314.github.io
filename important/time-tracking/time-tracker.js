(function () {
  if (!window.PAGE_META) return;

  const STORAGE_KEY = "timeTrackingData";
  const TICK_MS = 5000; // 5 seconds
  let lastTick = Date.now();
  let interval = null;

  function todayKey() {
    return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  }

  function loadData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  }

  function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }

  function ensurePath(obj, path) {
    return path.reduce((o, k) => (o[k] ||= {}), obj);
  }

  function addTime(seconds) {
    const data = loadData();
    const date = todayKey();

    const meta = window.PAGE_META;
    const path = [
      date,
      meta.topic || "Index",
      meta.section || "__total__",
      meta.lesson || "__total__"
    ];

    const node = ensurePath(data, path);
    node.seconds = (node.seconds || 0) + seconds;

    saveData(data);
  }

  function tick() {
    const now = Date.now();
    const delta = Math.floor((now - lastTick) / 1000);
    if (delta > 0) {
      addTime(delta);
      lastTick = now;
    }
  }

  function start() {
    lastTick = Date.now();
    interval = setInterval(tick, TICK_MS);
  }

  function stop() {
    tick();
    clearInterval(interval);
    interval = null;
  }

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  window.addEventListener("focus", start);
  window.addEventListener("blur", stop);

  start();
})();
