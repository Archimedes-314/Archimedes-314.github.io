import { QRCodeSVG } from "qrcode.react";
import { useEffect, useRef, useState } from "react";
import { useRegisterSW } from "virtual:pwa-register/react";

// --- STATISTICAL HELPERS ---
const calculateMovingAverage = (entries, days = 7) => {
  if (!entries || entries.length === 0) return [];
  const sorted = [...entries].sort(
    (a, b) => new Date(a.date) - new Date(b.date) || a.id - b.id,
  );

  return sorted.map((entry, idx, arr) => {
    const current = new Date(entry.date);
    const windowStart = new Date(current);
    windowStart.setDate(windowStart.getDate() - (days - 1));

    const windowEntries = arr.filter((e) => {
      const d = new Date(e.date);
      return d >= windowStart && d <= current;
    });

    const sum = windowEntries.reduce(
      (acc, curr) => acc + Number(curr.value || 0),
      0,
    );
    const avg = sum / (windowEntries.length || 1);
    return { ...entry, movingAvg: avg.toFixed(2) };
  });
};

const getLocalDateString = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function App() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      if (r) {
        setInterval(
          () => {
            r.update();
          },
          60 * 60 * 1000,
        );
      }
    },
  });

  // --- APP VIEW STATE ---
  const [currentView, setCurrentView] = useState("goals"); // 'goals' | 'til'

  // --- METRIC TRACKER PERSISTENCE STATE ---
  const [trackers, setTrackers] = useState(() => {
    const saved = localStorage.getItem("goal_tracker_metrics_v1");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            name: "Body Weight",
            unit: "kg",
            target: 75,
            startValue: 85,
            type: "ongoing",
            direction: "down",
            entries: [
              {
                id: 101,
                date: "2026-03-20",
                value: 80.5,
                note: "Initial measurement",
              },
              { id: 102, date: "2026-03-22", value: 79.8, note: "Morning" },
              {
                id: 103,
                date: "2026-03-25",
                value: 79.2,
                note: "Post workout",
              },
            ],
          },
        ];
  });

  // --- LONG-TERM GOAL MODULES PERSISTENCE STATE ---
  const [goalModules, setGoalModules] = useState(() => {
    const saved = localStorage.getItem("goal_tracker_longterm_v1");
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 1,
            title: "Milestones",
            goals: [
              {
                id: 101,
                text: "Complete clinical placement hours",
                status: "In Progress",
                value: 45,
                target: 120,
                unit: "hrs",
              },
              {
                id: 102,
                text: "Submit final certification paperwork",
                status: "Not Started",
              },
            ],
          },
        ];
  });

  // --- ROUTINE LOGS PERSISTENCE STATE ---
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("goal_tracker_logs_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // --- TIL TRACKER PERSISTENCE STATE ---
  const [tilEntries, setTilEntries] = useState(() => {
    const saved = localStorage.getItem("goal_tracker_til_v1");
    return saved ? JSON.parse(saved) : [];
  });

  // TIL Calendar & Modal States
  const [tilCalendarDate, setTilCalendarDate] = useState(new Date());
  const [activeTilDate, setActiveTilDate] = useState(null); // 'YYYY-MM-DD'
  const [tilModalNote, setTilModalNote] = useState("");
  const [tilModalTags, setTilModalTags] = useState("");
  const [tilModalRating, setTilModalRating] = useState(3);

  // Active Selected Tracker
  const [activeTrackerId, setActiveTrackerId] = useState(null);

  // Form Inputs - Metric Creation
  const [newTrackerName, setNewTrackerName] = useState("");
  const [newTrackerUnit, setNewTrackerUnit] = useState("");
  const [newTrackerTarget, setNewTrackerTarget] = useState("");
  const [newTrackerStartValue, setNewTrackerStartValue] = useState("");
  const [newTrackerType, setNewTrackerType] = useState("daily");
  const [newTrackerDirection, setNewTrackerDirection] = useState("up");

  // Form Inputs - Metric Value Entry
  const [entryValue, setEntryValue] = useState("");
  const [entryDate, setEntryDate] = useState(() => getLocalDateString());
  const [entryNote, setEntryNote] = useState("");

  // Form Inputs - Long-term Goal Module Creation & Goal Addition
  const [newModuleTitle, setNewModuleTitle] = useState("");
  const [activeModuleInputs, setActiveModuleInputs] = useState({});
  const [collapsedModules, setCollapsedModules] = useState({}); // { [moduleId]: boolean }

  // Goal Modal States for Numeric Tracker Popup
  const [activeGoalModal, setActiveGoalModal] = useState(null); // { moduleId, goalId }
  const [goalModalVal, setGoalModalVal] = useState("");
  const [goalModalDelta, setGoalModalDelta] = useState("");
  const [goalModalUnit, setGoalModalUnit] = useState("");
  const [goalModalTarget, setGoalModalTarget] = useState("");

  // Manual Modal State
  const [showManualModal, setShowManualModal] = useState(false);

  // WebRTC Sync states
  const [peerId, setPeerId] = useState("");
  const [targetPeerId, setTargetPeerId] = useState("");
  const [syncStatus, setSyncStatus] = useState("");
  const [showP2PModal, setShowP2PModal] = useState(false);

  const fileInputRef = useRef(null);
  const peerRef = useRef(null);
  const connRef = useRef(null);

  // --- LOCALSTORAGE PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem("goal_tracker_metrics_v1", JSON.stringify(trackers));
  }, [trackers]);

  useEffect(() => {
    localStorage.setItem(
      "goal_tracker_longterm_v1",
      JSON.stringify(goalModules),
    );
  }, [goalModules]);

  useEffect(() => {
    localStorage.setItem("goal_tracker_logs_v1", JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem("goal_tracker_til_v1", JSON.stringify(tilEntries));
  }, [tilEntries]);

  // --- WEBRTC P2P SYNC LOGIC ---
  const initWebRTC = async () => {
    setSyncStatus("Initializing connection server...");
    const { default: Peer } = await import("peerjs");

    const peer = new Peer({
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peerRef.current = peer;

    peer.on("open", (id) => {
      setPeerId(id);
      setSyncStatus("Ready to connect. Share your code.");
    });

    peer.on("connection", (conn) => {
      connRef.current = conn;
      setupConnectionListeners(conn);
    });

    peer.on("error", (err) => {
      console.error("PeerJS Error:", err);
      setSyncStatus(`Error: ${err.type}`);
    });
  };

  const setupConnectionListeners = (conn) => {
    conn.on("open", () => {
      setSyncStatus("Connected to peer! Ready to sync.");
    });

    conn.on("data", (data) => {
      if (data && data.type === "SYNC_DATA") {
        if (
          window.confirm(
            "Received full app sync from another device. Overwrite local data?",
          )
        ) {
          setTrackers(data.payload?.trackers || []);
          setGoalModules(data.payload?.goalModules || []);
          setLogs(data.payload?.logs || []);
          setTilEntries(data.payload?.tilEntries || []);
          setSyncStatus("Sync successful!");
        }
      }
    });

    conn.on("close", () => setSyncStatus("Connection closed."));
  };

  const connectToPeer = () => {
    if (!targetPeerId.trim()) return;
    setSyncStatus("Connecting...");
    const conn = peerRef.current.connect(targetPeerId.trim());
    connRef.current = conn;
    setupConnectionListeners(conn);
  };

  const pushSyncData = () => {
    if (connRef.current && connRef.current.open) {
      connRef.current.send({
        type: "SYNC_DATA",
        payload: { trackers, goalModules, logs, tilEntries },
      });
      setSyncStatus("Data pushed successfully!");
    } else {
      alert("No active connection.");
    }
  };

  // --- IMPORT / EXPORT DATA (FULL APP BACKUP) ---
  const exportData = () => {
    try {
      const payload = { trackers, goalModules, logs, tilEntries };
      const dataStr =
        "data:application/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(payload, null, 2));
      const link = document.createElement("a");
      link.setAttribute("href", dataStr);
      link.setAttribute("download", "goal_tracker_full_backup.json");
      link.click();
    } catch (e) {
      alert("Failed to export.");
    }
  };

  const importData = (e) => {
    const reader = new FileReader();
    const file = e.target.files[0];
    if (!file) return;

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.trackers && Array.isArray(parsed.trackers)) {
          if (
            window.confirm(
              "Overwrite current app data with imported full backup?",
            )
          ) {
            setTrackers(parsed.trackers);
            setGoalModules(parsed.goalModules || []);
            setLogs(parsed.logs || parsed.routineLogs || []);
            setTilEntries(parsed.tilEntries || []);
            setActiveTrackerId(null);
            setCurrentView("goals");
          }
        } else {
          alert("Invalid file structure.");
        }
      } catch (err) {
        alert("Error parsing file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  // --- CRUD METRICS ACTIONS ---
  const createTracker = (e) => {
    e.preventDefault();
    if (!newTrackerName.trim() || !newTrackerUnit.trim()) return;

    const newMetric = {
      id: Date.now(),
      name: newTrackerName.trim(),
      unit: newTrackerUnit.trim(),
      target: newTrackerTarget ? Number(newTrackerTarget) : null,
      startValue: newTrackerStartValue ? Number(newTrackerStartValue) : null,
      type: newTrackerType,
      direction: newTrackerDirection,
      entries: [],
    };

    setTrackers([...trackers, newMetric]);
    setNewTrackerName("");
    setNewTrackerUnit("");
    setNewTrackerTarget("");
    setNewTrackerStartValue("");
    setNewTrackerType("daily");
    setNewTrackerDirection("up");
  };

  const addMetricEntry = (e) => {
    e.preventDefault();
    if (!entryValue || !activeTrackerId) return;

    const newEntry = {
      id: Date.now(),
      date: entryDate,
      value: Number(entryValue),
      note: entryNote.trim(),
    };

    setTrackers(
      trackers.map((t) =>
        t.id === activeTrackerId
          ? { ...t, entries: [...t.entries, newEntry] }
          : t,
      ),
    );

    setEntryValue("");
    setEntryNote("");
  };

  const deleteEntry = (trackerId, entryId) => {
    setTrackers(
      trackers.map((t) =>
        t.id === trackerId
          ? { ...t, entries: t.entries.filter((e) => e.id !== entryId) }
          : t,
      ),
    );
  };

  const deleteTracker = (trackerId, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this tracker and all recorded data?")) {
      setTrackers(trackers.filter((t) => t.id !== trackerId));
      if (activeTrackerId === trackerId) setActiveTrackerId(null);
    }
  };

  // --- CRUD LONG-TERM GOALS ACTIONS ---
  const createGoalModule = (e) => {
    e.preventDefault();
    if (!newModuleTitle.trim()) return;

    const newModule = {
      id: Date.now(),
      title: newModuleTitle.trim(),
      goals: [],
    };

    setGoalModules([...goalModules, newModule]);
    setNewModuleTitle("");
  };

  const deleteGoalModule = (moduleId) => {
    if (window.confirm("Delete this goal module and all contained goals?")) {
      setGoalModules(goalModules.filter((m) => m.id !== moduleId));
    }
  };

  const toggleModuleCollapse = (moduleId) => {
    setCollapsedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  // --- REORDERING HELPERS ---
  const moveModule = (index, direction) => {
    const newModules = [...goalModules];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newModules.length) return;

    const temp = newModules[index];
    newModules[index] = newModules[targetIndex];
    newModules[targetIndex] = temp;

    setGoalModules(newModules);
  };

  const moveGoalItem = (moduleId, goalIndex, direction) => {
    setGoalModules(
      goalModules.map((m) => {
        if (m.id !== moduleId) return m;
        const newGoals = [...m.goals];
        const targetIndex = direction === "up" ? goalIndex - 1 : goalIndex + 1;
        if (targetIndex < 0 || targetIndex >= newGoals.length) return m;

        const temp = newGoals[goalIndex];
        newGoals[goalIndex] = newGoals[targetIndex];
        newGoals[targetIndex] = temp;

        return { ...m, goals: newGoals };
      }),
    );
  };

  const addGoalToModule = (moduleId, e) => {
    e.preventDefault();
    const text = activeModuleInputs[moduleId];
    if (!text || !text.trim()) return;

    const newGoal = {
      id: Date.now(),
      text: text.trim(),
      status: "Not Started",
    };

    setGoalModules(
      goalModules.map((m) =>
        m.id === moduleId ? { ...m, goals: [...m.goals, newGoal] } : m,
      ),
    );

    setActiveModuleInputs({ ...activeModuleInputs, [moduleId]: "" });
  };

  const cycleGoalStatus = (moduleId, goalId) => {
    const statusCycle = ["Not Started", "In Progress", "Completed"];
    setGoalModules(
      goalModules.map((m) => {
        if (m.id !== moduleId) return m;
        const updatedGoals = m.goals.map((g) => {
          if (g.id !== goalId) return g;
          const currentIndex = statusCycle.indexOf(g.status);
          const nextStatus =
            statusCycle[(currentIndex + 1) % statusCycle.length];
          return { ...g, status: nextStatus };
        });
        return { ...m, goals: updatedGoals };
      }),
    );
  };

  const deleteGoalItem = (moduleId, goalId) => {
    setGoalModules(
      goalModules.map((m) =>
        m.id === moduleId
          ? { ...m, goals: m.goals.filter((g) => g.id !== goalId) }
          : m,
      ),
    );
  };

  // --- GOAL TRACKER MODAL HANDLERS ---
  const openGoalModal = (moduleId, goal) => {
    setActiveGoalModal({ moduleId, goalId: goal.id });
    setGoalModalVal(
      goal.value !== undefined && goal.value !== null ? goal.value : "",
    );
    setGoalModalDelta("");
    setGoalModalUnit(goal.unit || "");
    setGoalModalTarget(
      goal.target !== undefined && goal.target !== null ? goal.target : "",
    );
  };

  const saveGoalModal = () => {
    if (!activeGoalModal) return;
    const { moduleId, goalId } = activeGoalModal;

    setGoalModules(
      goalModules.map((m) => {
        if (m.id !== moduleId) return m;
        const updatedGoals = m.goals.map((g) => {
          if (g.id !== goalId) return g;

          let updatedVal =
            goalModalVal === "" || goalModalVal === null
              ? null
              : Number(goalModalVal);

          if (goalModalDelta !== "" && !isNaN(Number(goalModalDelta))) {
            const base = updatedVal !== null ? updatedVal : 0;
            updatedVal = base + Number(goalModalDelta);
          }

          return {
            ...g,
            value: updatedVal,
            unit: goalModalUnit.trim() || null,
            target: goalModalTarget === "" ? null : Number(goalModalTarget),
          };
        });
        return { ...m, goals: updatedGoals };
      }),
    );
    setActiveGoalModal(null);
  };

  // --- TIL MODAL & STATS HANDLERS ---
  const openTilModalForDate = (dateStr) => {
    setActiveTilDate(dateStr);
    const existing = tilEntries.find((e) => e.date === dateStr);
    if (existing) {
      setTilModalNote(existing.note || "");
      setTilModalTags(
        Array.isArray(existing.tags)
          ? existing.tags.join(", ")
          : existing.tags || "",
      );
      setTilModalRating(existing.rating !== undefined ? existing.rating : 3);
    } else {
      setTilModalNote("");
      setTilModalTags("");
      setTilModalRating(3);
    }
  };

  const saveTilEntry = () => {
    if (!activeTilDate) return;
    const trimmedNote = tilModalNote.trim();
    if (!trimmedNote) {
      alert("Please enter what you learned.");
      return;
    }

    const tagsArray = tilModalTags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const updatedEntries = tilEntries.filter((e) => e.date !== activeTilDate);
    const newEntry = {
      id: Date.now(),
      date: activeTilDate,
      note: trimmedNote,
      tags: tagsArray,
      rating: Number(tilModalRating),
    };

    setTilEntries([...updatedEntries, newEntry]);
    setActiveTilDate(null);
  };

  const deleteTilEntry = (dateStr) => {
    if (window.confirm("Delete learning note for this date?")) {
      setTilEntries(tilEntries.filter((e) => e.date !== dateStr));
      setActiveTilDate(null);
    }
  };

  const calculateTilStats = () => {
    if (!tilEntries || tilEntries.length === 0) {
      return { streak: 0, totalDays: 0, uniqueTagsCount: 0 };
    }

    const uniqueDatesSet = new Set(tilEntries.map((e) => e.date));
    const totalDays = uniqueDatesSet.size;

    const tagSet = new Set();
    tilEntries.forEach((e) => {
      if (e.tags) {
        const tagsArr = Array.isArray(e.tags)
          ? e.tags
          : e.tags
              .split(",")
              .map((t) => t.trim())
              .filter(Boolean);
        tagsArr.forEach((t) => tagSet.add(t.toLowerCase()));
      }
    });
    const uniqueTagsCount = tagSet.size;

    let streak = 0;
    let checkDate = new Date();
    let checkDateStr = getLocalDateString(checkDate);
    if (!uniqueDatesSet.has(checkDateStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = getLocalDateString(checkDate);
    }

    while (uniqueDatesSet.has(checkDateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkDateStr = getLocalDateString(checkDate);
    }

    return { streak, totalDays, uniqueTagsCount };
  };

  const tilStats = calculateTilStats();

  // Metric Computations
  const activeTracker = trackers.find((t) => t.id === activeTrackerId);
  const processedEntries = activeTracker
    ? calculateMovingAverage(activeTracker.entries, 7)
    : [];

  // --- TIL CALENDAR RENDERER ---
  const renderTilCalendar = () => {
    const year = tilCalendarDate.getFullYear();
    const month = tilCalendarDate.getMonth();

    const firstDayIndex = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const entriesMap = {};
    tilEntries.forEach((e) => {
      entriesMap[e.date] = e;
    });

    const daysCells = [];

    for (let i = firstDayIndex - 1; i >= 0; i--) {
      const d = prevMonthDays - i;
      daysCells.push(
        <div
          key={`prev-${d}`}
          className="h-16 bg-slate-900/30 rounded-xl p-1 opacity-30 text-slate-500 text-xs flex flex-col justify-between"
        >
          <span>{d}</span>
        </div>,
      );
    }

    for (let day = 1; day <= totalDaysInMonth; day++) {
      const monthStr = String(month + 1).padStart(2, "0");
      const dayStr = String(day).padStart(2, "0");
      const dateStr = `${year}-${monthStr}-${dayStr}`;
      const entry = entriesMap[dateStr];
      const isToday = dateStr === getLocalDateString();

      daysCells.push(
        <div
          key={dateStr}
          onClick={() => openTilModalForDate(dateStr)}
          className={`h-20 rounded-xl p-1.5 flex flex-col justify-between cursor-pointer transition border ${
            isToday
              ? "border-indigo-500 bg-indigo-950/30"
              : entry
                ? "border-emerald-600/60 bg-emerald-950/20 hover:bg-emerald-950/40"
                : "border-slate-800 bg-slate-800/40 hover:bg-slate-800"
          }`}
        >
          <div className="flex justify-between items-center text-xs">
            <span
              className={`font-bold ${isToday ? "text-indigo-400" : "text-slate-300"}`}
            >
              {day}
            </span>
            {entry && (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
            )}
          </div>
          {entry ? (
            <div className="space-y-0.5">
              <div className="text-[10px] text-emerald-300 truncate font-medium">
                {entry.note}
              </div>
              <div className="flex items-center gap-1 text-[9px] text-amber-400 font-mono">
                {"★".repeat(entry.rating || 3)}
              </div>
            </div>
          ) : (
            <div className="text-[9px] text-slate-500 italic">No entry</div>
          )}
        </div>,
      );
    }

    return (
      <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-100 text-sm">
            {monthNames[month]} {year}
          </h3>
          <div className="flex gap-1">
            <button
              onClick={() => setTilCalendarDate(new Date(year, month - 1, 1))}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-xs transition"
            >
              ← Prev
            </button>
            <button
              onClick={() => setTilCalendarDate(new Date())}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-xs transition"
            >
              Today
            </button>
            <button
              onClick={() => setTilCalendarDate(new Date(year, month + 1, 1))}
              className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2.5 py-1 rounded-lg text-xs transition"
            >
              Next →
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          <span>Su</span>
          <span>Mo</span>
          <span>Tu</span>
          <span>We</span>
          <span>Th</span>
          <span>Fr</span>
          <span>Sa</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5">{daysCells}</div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans antialiased">
      <input
        type="file"
        ref={fileInputRef}
        onChange={importData}
        accept=".json"
        className="hidden"
      />

      {needRefresh && (
        <div className="fixed bottom-5 right-5 bg-gray-900 text-white p-4 rounded-xl flex items-center gap-4 shadow-2xl z-50 border border-gray-800">
          <span className="text-sm">New version available!</span>
          <button
            onClick={() => updateServiceWorker(true)}
            className="bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Update Now
          </button>
        </div>
      )}

      {/* --- MANUAL MODAL --- */}
      {showManualModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border-2 border-indigo-500 rounded-2xl p-5 w-full max-w-sm max-h-[85vh] flex flex-col shadow-2xl space-y-4 text-center">
            <div className="flex justify-between items-center shrink-0">
              <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wide">
                User Manual
              </h3>
              <button
                onClick={() => setShowManualModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="overflow-y-auto space-y-4 pr-1 text-left flex-1">
              <p className="text-slate-200 text-sm py-2 font-medium">
                <u>
                  <strong>Metric Trackers</strong>
                </u>{" "}
                <br /> The unit is just visual. It doesn't affect how the
                tracker counts. <br />
                <br />
                Using the 'daily reset tracker' will add all the values you put
                in, then reset back to 0 at midnight in your local timezone.
                <br />
                <br />
                Using the 'on-going tracker' will display the last value you put
                in, and won't reset.
              </p>
              <p className="text-slate-200 text-sm py-2 font-medium">
                <u>
                  <strong>Long-Term Goal Trackers</strong>
                  <br />
                </u>
                This is a numeric tracker for long term goals.
                <br />
                <br /> After setting a goal, tap on it to configure it. You can
                set the current value, the unit and the target goal.
              </p>
              <p className="text-slate-200 text-sm py-2 font-medium">
                <u>
                  <strong>TIL Tracker (Today I Learned)</strong>
                  <br />
                </u>
                Tap on the header title at the top to switch between the Goal
                Tracker and the TIL Tracker views.
                <br />
                <br /> Click any day on the calendar to log what you learned,
                add topic tags (e.g. #react, #history), and rate your progress.
              </p>
            </div>

            <button
              onClick={() => setShowManualModal(false)}
              className="w-full bg-indigo-600 hover:bg-indigo-500 font-bold py-2 rounded-xl text-xs uppercase transition text-white shrink-0"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* --- GOAL TRACKER CONFIG MODAL --- */}
      {activeGoalModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border-2 border-indigo-500 rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wide">
                ⚙️ Configure Goal Tracker
              </h3>
              <button
                onClick={() => setActiveGoalModal(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Current Value / Total
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 45"
                  value={goalModalVal}
                  onChange={(e) => setGoalModalVal(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Add / Remove Amount (+ or -)
                </label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 5 or -2"
                  value={goalModalDelta}
                  onChange={(e) => setGoalModalDelta(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Unit
                  </label>
                  <input
                    type="text"
                    placeholder="hrs, km, pages"
                    value={goalModalUnit}
                    onChange={(e) => setGoalModalUnit(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                    Target Goal (Optional)
                  </label>
                  <input
                    type="number"
                    step="any"
                    placeholder="100"
                    value={goalModalTarget}
                    onChange={(e) => setGoalModalTarget(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveGoalModal(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 font-bold py-2 rounded-xl text-xs uppercase transition text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={saveGoalModal}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 font-bold py-2 rounded-xl text-xs uppercase transition text-white"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- TIL ENTRY MODAL --- */}
      {activeTilDate && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border-2 border-indigo-500 rounded-2xl p-5 w-full max-w-sm shadow-2xl space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-indigo-400 text-sm uppercase tracking-wide">
                📝 TIL Note ({activeTilDate})
              </h3>
              <button
                onClick={() => setActiveTilDate(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  What did you learn today?
                </label>
                <textarea
                  rows="3"
                  placeholder="Today I learnt about React hooks, line integrals, etc."
                  value={tilModalNote}
                  onChange={(e) => setTilModalNote(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 resize-none"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Topic Tags (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="#react, #maths"
                  value={tilModalTags}
                  onChange={(e) => setTilModalTags(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">
                  Progress / Confidence Rating (1 - 5)
                </label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setTilModalRating(star)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold border transition ${
                        tilModalRating === star
                          ? "bg-indigo-600 border-indigo-500 text-white"
                          : "bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      ★ {star}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              {tilEntries.some((e) => e.date === activeTilDate) && (
                <button
                  onClick={() => deleteTilEntry(activeTilDate)}
                  className="bg-rose-950/50 hover:bg-rose-900/50 border border-rose-800 text-rose-300 font-bold py-2 px-3 rounded-xl text-xs uppercase transition"
                  title="Delete Entry"
                >
                  🗑️
                </button>
              )}
              <button
                onClick={() => setActiveTilDate(null)}
                className="flex-1 bg-slate-700 hover:bg-slate-600 font-bold py-2 rounded-xl text-xs uppercase transition text-slate-300"
              >
                Cancel
              </button>
              <button
                onClick={saveTilEntry}
                className="flex-1 bg-indigo-600 hover:bg-indigo-500 font-bold py-2 rounded-xl text-xs uppercase transition text-white"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- HEADER --- */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {!activeTrackerId && currentView === "goals" ? (
            <div className="flex items-center justify-between w-full">
              <div>
                <h1
                  onClick={() => setCurrentView("til")}
                  className="text-xl font-bold tracking-wide text-indigo-400 cursor-pointer hover:text-indigo-300 transition flex items-center gap-2"
                  title="switch to TIL Tracker"
                >
                  Goal Tracker
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded font-normal">
                    Switch
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">
                  Metrics & Long-Term Goals
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setShowP2PModal(true);
                    initWebRTC();
                  }}
                  className="p-1.5 text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-md transition"
                >
                  🌐 Sync
                </button>
                <button
                  onClick={exportData}
                  className="p-1.5 text-xs bg-slate-800 text-slate-300 rounded-md transition"
                  title="Export Full App Backup"
                >
                  📤 Export
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-xs bg-slate-800 text-slate-300 rounded-md transition"
                  title="Import Backup"
                >
                  📥 Import
                </button>
              </div>
            </div>
          ) : !activeTrackerId && currentView === "til" ? (
            <div className="flex items-center justify-between w-full">
              <div>
                <h1
                  onClick={() => setCurrentView("goals")}
                  className="text-xl font-bold tracking-wide text-indigo-400 cursor-pointer hover:text-indigo-300 transition flex items-center gap-2"
                  title="Click to switch to Goal Tracker"
                >
                  TIL Tracker
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-normal">
                    Switch
                  </span>
                </h1>
                <p className="text-[10px] text-slate-400">
                  Today I Learned & Consistency
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => {
                    setShowP2PModal(true);
                    initWebRTC();
                  }}
                  className="p-1.5 text-xs bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-md transition"
                >
                  🌐 Sync
                </button>
                <button
                  onClick={exportData}
                  className="p-1.5 text-xs bg-slate-800 text-slate-300 rounded-md transition"
                  title="Export Full App Backup"
                >
                  📤 Export
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1.5 text-xs bg-slate-800 text-slate-300 rounded-md transition"
                  title="Import Backup"
                >
                  📥 Import
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between w-full">
              <h1 className="text-lg font-bold tracking-wide text-indigo-400 truncate max-w-[70%]">
                {activeTracker.name}
              </h1>
              <button
                onClick={() => setActiveTrackerId(null)}
                className="text-sm font-medium bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition shrink-0"
              >
                ← Back
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* --- P2P WEBRTC MODAL SYNC MODULE --- */}
        {showP2PModal && (
          <div className="bg-slate-800 border-2 border-indigo-500 rounded-2xl p-4 shadow-xl">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-indigo-400 text-sm">Device Sync</h3>
              <button
                onClick={() => setShowP2PModal(false)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕ Close
              </button>
            </div>

            {peerId && (
              <div className="flex flex-col items-center justify-center p-4 mb-3 bg-white rounded-xl border border-slate-700 mx-auto w-40 h-40 shadow-inner">
                <QRCodeSVG
                  value={`${window.location.origin}${window.location.pathname}?connectId=${peerId}`}
                  size={128}
                  bgColor={"#ffffff"}
                  fgColor={"#0f172a"}
                />
              </div>
            )}

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 mb-3 text-center">
              <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                Sync Key
              </span>
              <span className="font-mono text-xs select-all text-emerald-400 block break-all">
                {peerId || "Generating connection key..."}
              </span>
            </div>

            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Paste peer code"
                value={targetPeerId}
                onChange={(e) => setTargetPeerId(e.target.value)}
                className="flex-1 bg-slate-900 text-xs border border-slate-700 rounded-xl px-3 py-2 text-slate-100"
              />
              <button
                onClick={connectToPeer}
                className="bg-indigo-600 hover:bg-indigo-500 px-3 py-1 text-xs font-bold rounded-xl transition"
              >
                Connect
              </button>
            </div>

            <button
              onClick={pushSyncData}
              className="w-full mt-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-xl text-xs uppercase tracking-wider transition"
            >
              📦 Push Full App Data to Peer
            </button>
            <div className="text-[11px] text-slate-400 text-center mt-2 font-mono italic">
              {syncStatus}
            </div>
          </div>
        )}

        {/* --- MAIN VIEWS --- */}
        {!activeTrackerId ? (
          currentView === "til" ? (
            /* --- TIL TRACKER VIEW --- */
            <div className="space-y-6">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowManualModal(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  press for manual
                </button>
              </div>

              {/* Streak & Stats Header Component */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3 text-center shadow-sm">
                  <span className="block text-2xl font-black text-amber-400">
                    🔥 {tilStats.streak}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                    Streak
                  </span>
                </div>
                <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3 text-center shadow-sm">
                  <span className="block text-2xl font-black text-emerald-400">
                    📅 {tilStats.totalDays}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                    Logged
                  </span>
                </div>
                <div className="bg-slate-800/60 border border-slate-800 rounded-2xl p-3 text-center shadow-sm">
                  <span className="block text-2xl font-black text-indigo-400">
                    🏷️ {tilStats.uniqueTagsCount}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1 block">
                    Topics
                  </span>
                </div>
              </div>

              {/* Interactive Calendar Component */}
              {renderTilCalendar()}
            </div>
          ) : (
            /* --- GOAL TRACKER / METRICS VIEW --- */
            <>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowManualModal(true)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-sm"
                >
                  press for manual
                </button>
              </div>

              {/* --- METRIC TRACKERS SECTION --- */}
              <form
                onSubmit={createTracker}
                className="flex flex-col gap-3 bg-slate-800/40 p-4 border border-slate-800 rounded-2xl shadow-sm"
              >
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ➕ Add New Metric Tracker
                </h2>
                <input
                  type="text"
                  placeholder="Metric Name (e.g., Weight, Walk Distance)"
                  value={newTrackerName}
                  onChange={(e) => setNewTrackerName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  required
                />
                <div className="flex flex-col sm:flex-row gap-2 min-w-0">
                  <input
                    type="text"
                    placeholder="Unit (kg, km, mins)"
                    value={newTrackerUnit}
                    onChange={(e) => setNewTrackerUnit(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    required
                  />
                  <input
                    type="number"
                    step="any"
                    placeholder="Target Goal"
                    value={newTrackerTarget}
                    onChange={(e) => setNewTrackerTarget(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>

                {newTrackerDirection === "down" && (
                  <input
                    type="number"
                    step="any"
                    placeholder="Start Value (e.g., initial weight)"
                    value={newTrackerStartValue}
                    onChange={(e) => setNewTrackerStartValue(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    required
                  />
                )}

                <div className="flex gap-2">
                  <select
                    value={newTrackerType}
                    onChange={(e) => setNewTrackerType(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="daily">Daily Reset Tracker</option>
                    <option value="ongoing">Ongoing Tracker</option>
                  </select>

                  <select
                    value={newTrackerDirection}
                    onChange={(e) => setNewTrackerDirection(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100"
                  >
                    <option value="up">Increase Goal (↑)</option>
                    <option value="down">Decrease Goal (↓)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 rounded-xl text-xs uppercase transition"
                >
                  Create Tracker
                </button>
              </form>

              <div>
                <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                  📊 Tracked Metrics
                </h2>
                {trackers.length === 0 ? (
                  <div className="text-center text-slate-500 py-6 text-sm italic">
                    No trackers configured.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {trackers.map((tracker) => {
                      const sorted = tracker.entries
                        .slice()
                        .sort(
                          (a, b) =>
                            new Date(b.date) - new Date(a.date) || b.id - a.id,
                        );
                      const latest = sorted[0];

                      return (
                        <div
                          key={tracker.id}
                          onClick={() => setActiveTrackerId(tracker.id)}
                          className="bg-slate-800/60 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex justify-between items-center cursor-pointer transition"
                        >
                          <div>
                            <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                              {tracker.name}
                              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded-md">
                                {tracker.unit}
                              </span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">
                              {latest
                                ? `Latest: ${latest.value} ${tracker.unit} (${latest.date})`
                                : "No entries yet"}
                            </p>
                          </div>
                          <button
                            onClick={(e) => deleteTracker(tracker.id, e)}
                            className="p-2 text-slate-500 hover:text-rose-400 rounded-lg text-xs"
                          >
                            🗑️
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* --- LONG-TERM GOALS SECTION --- */}
              <div className="border-t border-slate-800 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    🎯 Long-Term Goal Tracker
                  </h2>
                </div>

                <form
                  onSubmit={createGoalModule}
                  className="flex gap-2 bg-slate-800/40 p-3 border border-slate-800 rounded-2xl"
                >
                  <input
                    type="text"
                    placeholder="New Goal Module (e.g. Career, Fitness)"
                    value={newModuleTitle}
                    onChange={(e) => setNewModuleTitle(e.target.value)}
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-indigo-600 hover:bg-indigo-500 px-4 py-2 font-bold text-xs uppercase rounded-xl text-white transition shrink-0"
                  >
                    Add Module
                  </button>
                </form>

                {goalModules.length === 0 ? (
                  <div className="text-center text-slate-500 py-6 text-sm italic">
                    No long-term goal modules created yet.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {goalModules.map((module, moduleIndex) => {
                      const totalGoals = module.goals.length;
                      const completedGoals = module.goals.filter(
                        (g) => g.status === "Completed",
                      ).length;
                      const progressPercent =
                        totalGoals > 0
                          ? Math.round((completedGoals / totalGoals) * 100)
                          : 0;
                      const isCollapsed = !!collapsedModules[module.id]; // <-- ADD THIS

                      return (
                        <div
                          key={module.id}
                          className="bg-slate-800/60 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-sm"
                        >
                          {/* HEADER (Always visible) */}
                          <div className="flex justify-between items-start gap-2">
                            <div
                              onClick={() => toggleModuleCollapse(module.id)} // <-- OPTIONAL: clicking title toggles too
                              className="cursor-pointer select-none flex-1"
                            >
                              <h3 className="font-bold text-slate-100 text-base flex items-center gap-2">
                                <span>{module.title}</span>
                              </h3>
                              <p className="text-[11px] text-slate-400 mt-0.5">
                                {completedGoals} of {totalGoals} goals completed
                                ({progressPercent}%)
                              </p>
                            </div>

                            <div className="flex items-center gap-1">
                              {/* COLLAPSE/EXPAND BUTTON */}
                              <button
                                onClick={() => toggleModuleCollapse(module.id)}
                                className="p-1 text-slate-400 hover:text-slate-200 text-xs"
                                title={
                                  isCollapsed
                                    ? "Expand Module"
                                    : "Collapse Module"
                                }
                              >
                                {isCollapsed ? "➕" : "➖"}
                              </button>

                              <button
                                onClick={() => moveModule(moduleIndex, "up")}
                                disabled={moduleIndex === 0}
                                className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 text-xs"
                                title="Move Module Up"
                              >
                                ⬆️
                              </button>
                              <button
                                onClick={() => moveModule(moduleIndex, "down")}
                                disabled={
                                  moduleIndex === goalModules.length - 1
                                }
                                className="p-1 text-slate-400 hover:text-slate-200 disabled:opacity-30 text-xs"
                                title="Move Module Down"
                              >
                                ⬇️
                              </button>
                              <button
                                onClick={() => deleteGoalModule(module.id)}
                                className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg text-xs ml-1"
                                title="Delete Module"
                              >
                                🗑️
                              </button>
                            </div>
                          </div>

                          {/* PROGRESS BAR (Keep outside if you still want progress visible when collapsed) */}
                          <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700/60">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                              style={{ width: `${progressPercent}%` }}
                            ></div>
                          </div>

                          {/* COLLAPSIBLE BODY: Wrap the goals list and add-goal form */}
                          {!isCollapsed && (
                            <>
                              <div className="space-y-2 pt-1">
                                {module.goals.length === 0 ? (
                                  <div className="text-xs text-slate-500 italic py-1">
                                    No specific goals added to this module yet.
                                  </div>
                                ) : (
                                  module.goals.map((goal, goalIndex) => {
                                    let statusBadgeStyle =
                                      "bg-slate-900 text-slate-400 border-slate-700";
                                    if (goal.status === "In Progress") {
                                      statusBadgeStyle =
                                        "bg-indigo-950 text-indigo-300 border-indigo-800";
                                    } else if (goal.status === "Completed") {
                                      statusBadgeStyle =
                                        "bg-emerald-950 text-emerald-300 border-emerald-800";
                                    }

                                    return (
                                      <div
                                        key={goal.id}
                                        className="bg-slate-900/50 border border-slate-800/80 p-2.5 rounded-xl flex items-center justify-between gap-2"
                                      >
                                        <div
                                          onClick={() =>
                                            openGoalModal(module.id, goal)
                                          }
                                          className="flex-1 cursor-pointer group"
                                        >
                                          <span
                                            className={`text-xs text-slate-200 block group-hover:text-indigo-300 transition ${
                                              goal.status === "Completed"
                                                ? "line-through text-slate-400"
                                                : ""
                                            }`}
                                          >
                                            {goal.text}
                                          </span>
                                          {goal.value !== undefined &&
                                            goal.value !== null &&
                                            goal.value !== "" && (
                                              <span className="inline-block mt-1 text-[10px] bg-slate-800 text-indigo-300 border border-slate-700 px-1.5 py-0.5 rounded font-mono">
                                                {goal.value} {goal.unit || ""}
                                                {goal.target
                                                  ? ` / ${goal.target}`
                                                  : ""}
                                              </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-1.5 shrink-0">
                                          <button
                                            onClick={() =>
                                              moveGoalItem(
                                                module.id,
                                                goalIndex,
                                                "up",
                                              )
                                            }
                                            disabled={goalIndex === 0}
                                            className="text-slate-500 hover:text-slate-300 disabled:opacity-30 text-[10px] px-0.5"
                                            title="Move Up"
                                          >
                                            ▲
                                          </button>
                                          <button
                                            onClick={() =>
                                              moveGoalItem(
                                                module.id,
                                                goalIndex,
                                                "down",
                                              )
                                            }
                                            disabled={
                                              goalIndex ===
                                              module.goals.length - 1
                                            }
                                            className="text-slate-500 hover:text-slate-300 disabled:opacity-30 text-[10px] px-0.5"
                                            title="Move Down"
                                          >
                                            ▼
                                          </button>

                                          <button
                                            onClick={() =>
                                              cycleGoalStatus(
                                                module.id,
                                                goal.id,
                                              )
                                            }
                                            className={`text-[10px] font-semibold px-2 py-1 rounded-lg border transition ml-1 ${statusBadgeStyle}`}
                                            title="Click to change status"
                                          >
                                            {goal.status}
                                          </button>
                                          <button
                                            onClick={() =>
                                              deleteGoalItem(module.id, goal.id)
                                            }
                                            className="text-slate-500 hover:text-rose-400 text-xs px-1"
                                            title="Delete Goal"
                                          >
                                            ✕
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })
                                )}
                              </div>

                              <form
                                onSubmit={(e) => addGoalToModule(module.id, e)}
                                className="flex gap-2 pt-2 border-t border-slate-800/80"
                              >
                                <input
                                  type="text"
                                  placeholder="Add specific goal..."
                                  value={activeModuleInputs[module.id] || ""}
                                  onChange={(e) =>
                                    setActiveModuleInputs({
                                      ...activeModuleInputs,
                                      [module.id]: e.target.value,
                                    })
                                  }
                                  className="flex-1 bg-slate-900 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs text-slate-100"
                                />
                                <button
                                  type="submit"
                                  className="bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 font-bold text-xs rounded-xl text-slate-200 transition"
                                >
                                  Add Goal
                                </button>
                              </form>
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )
        ) : (
          /* --- INDIVIDUAL TRACKER METRIC DETAILS VIEW --- */
          <div className="space-y-6">
            {activeTracker.target !== null && (
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 shadow-sm">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  🎯 Visual Milestone Target (
                  {activeTracker.type === "ongoing" ? "Ongoing" : "Daily Reset"}
                  )
                </span>
                {(() => {
                  const todayStr = getLocalDateString();
                  let currentVal = 0;

                  const sortedDesc = activeTracker.entries
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(b.date) - new Date(a.date) || b.id - a.id,
                    );
                  const sortedAsc = activeTracker.entries
                    .slice()
                    .sort(
                      (a, b) =>
                        new Date(a.date) - new Date(b.date) || b.id - b.id,
                    );

                  if (activeTracker.type === "daily") {
                    currentVal = activeTracker.entries
                      .filter((e) => e.date === todayStr)
                      .reduce((acc, curr) => acc + Number(curr.value || 0), 0);
                  } else {
                    currentVal = sortedDesc[0]
                      ? sortedDesc[0].value
                      : (activeTracker.startValue ?? activeTracker.target);
                  }

                  const targetVal = activeTracker.target;
                  let percentage = 0;
                  let remaining = 0;

                  if (activeTracker.direction === "down") {
                    const startVal =
                      activeTracker.startValue ??
                      (sortedAsc[0] ? sortedAsc[0].value : targetVal);

                    const totalDistance = startVal - targetVal;
                    const progressMade = startVal - currentVal;

                    remaining = Math.max(0, currentVal - targetVal);

                    if (totalDistance > 0) {
                      percentage = (progressMade / totalDistance) * 100;
                    } else {
                      percentage = currentVal <= targetVal ? 100 : 0;
                    }
                  } else {
                    remaining = Math.max(0, targetVal - currentVal);
                    percentage =
                      targetVal > 0 ? (currentVal / targetVal) * 100 : 0;
                  }

                  percentage = Math.min(100, Math.max(0, percentage));

                  return (
                    <div>
                      <div className="flex justify-between text-xs font-semibold text-slate-300 mb-1.5">
                        <span>
                          Current: {currentVal} {activeTracker.unit}
                        </span>
                        <span>
                          Target: {targetVal} {activeTracker.unit}
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-700">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-2 text-right">
                        Remaining: {remaining.toFixed(2)} {activeTracker.unit}
                      </p>
                    </div>
                  );
                })()}
              </div>
            )}

            <form
              onSubmit={addMetricEntry}
              className="bg-slate-800/40 p-4 border border-slate-800 rounded-2xl flex flex-col gap-3"
            >
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ✍️ Log Measurement
              </h3>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="any"
                  placeholder={`Value (${activeTracker.unit})`}
                  value={entryValue}
                  onChange={(e) => setEntryValue(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  required
                />
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  required
                />
              </div>
              <input
                type="text"
                placeholder="Notes (optional)"
                value={entryNote}
                onChange={(e) => setEntryNote(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              />
              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-500 font-bold text-xs uppercase py-2 rounded-xl text-white transition"
              >
                Add Entry
              </button>
            </form>

            <div>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                📈 Historical Logs & Moving Averages
              </h3>
              {processedEntries.length === 0 ? (
                <div className="text-center text-slate-500 py-6 text-sm italic">
                  No measurement entries logged yet.
                </div>
              ) : (
                <div className="space-y-2">
                  {[...processedEntries].reverse().map((entry) => (
                    <div
                      key={entry.id}
                      className="bg-slate-800/60 border border-slate-800 p-3 rounded-xl flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-sm text-emerald-400">
                            {entry.value} {activeTracker.unit}
                          </span>
                          <span className="text-[10px] bg-slate-900 border border-slate-700 text-slate-300 px-1.5 py-0.5 rounded">
                            7d Avg: {entry.movingAvg} {activeTracker.unit}
                          </span>
                        </div>
                        <div className="text-xs text-slate-400 mt-1">
                          {entry.date} {entry.note ? `— ${entry.note}` : ""}
                        </div>
                      </div>
                      <button
                        onClick={() => deleteEntry(activeTracker.id, entry.id)}
                        className="text-slate-500 hover:text-rose-400 text-xs p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
