const sections = {
  "Exterior Walk-Around": [
    "Body Damage",
    "Fluid Leaks",
    "Windshield",
    "Mirrors",
    "Headlights",
    "Brake Lights",
    "Indicators",
    "Hazards",
    "Reverse Lights"
  ],
  "Tires & Wheels": [
    "Tire Pressure",
    "Tread Depth",
    "Sidewall Condition",
    "Wheel Nuts",
    "Spare Tire",
    "Jack & Tools"
  ],
  "Engine Bay": [
    "Oil Level",
    "Coolant Level",
    "Brake Fluid",
    "Washer Fluid",
    "Battery",
    "Belts & Hoses"
  ],
  "Interior & Controls": [
    "Fuel Level",
    "Fuel Card",
    "Seatbelts",
    "Horn",
    "Wipers",
    "Warning Lights",
    "Gauges",
    "Heater/Defrost",
    "A/C"
  ],
  "Operational Check": [
    "Brakes",
    "Steering",
    "Vibrations",
    "Unusual Noises",
    "Transmission"
  ]
};

const checklistDiv = document.getElementById("checklist");
const summaryBox = document.getElementById("liveSummary");
const form = document.getElementById("checkForm");
const entriesDiv = document.getElementById("entries");

function setNow(){
  const now = new Date();
  document.getElementById("date").value = now.toISOString().split("T")[0];
  document.getElementById("time").value = now.toTimeString().slice(0,5);
}

// Build checklist
for (const section in sections){
  const title = document.createElement("div");
  title.className="section-title";
  title.textContent=section;
  checklistDiv.appendChild(title);

  sections[section].forEach(item=>{
    const div=document.createElement("div");
    div.className="check-item";
    div.dataset.item=item;
    div.innerHTML=`
      <div class="check-label">${item}</div>
      <div class="status-buttons">
        <button type="button" class="status-btn good">Good</button>
        <button type="button" class="status-btn bad">Needs Attention</button>
        <button type="button" class="status-btn na">N/A</button>
      </div>
    `;
    checklistDiv.appendChild(div);
  });
}

// Button toggle logic
document.addEventListener("click", function(e){
  if(!e.target.classList.contains("status-btn")) return;
  const parent=e.target.closest(".status-buttons");
  parent.querySelectorAll(".status-btn")
    .forEach(btn=>btn.classList.remove("active"));
  e.target.classList.add("active");
  updateSummary();
});

function updateSummary(){
  let good=0,bad=0,na=0;
  document.querySelectorAll(".check-item").forEach(item=>{
    if(item.querySelector(".good").classList.contains("active")) good++;
    if(item.querySelector(".bad").classList.contains("active")) bad++;
    if(item.querySelector(".na").classList.contains("active")) na++;
  });
  summaryBox.textContent=`Good: ${good} | Needs Attention: ${bad} | N/A: ${na}`;
}

// Submit
form.addEventListener("submit", e => {
  e.preventDefault();

  let checks=[], issuesList=[], incomplete=false;

  document.querySelectorAll(".check-item").forEach(item=>{
    const label=item.dataset.item;
    const good=item.querySelector(".good").classList.contains("active");
    const bad=item.querySelector(".bad").classList.contains("active");
    const na=item.querySelector(".na").classList.contains("active");

    if(!good && !bad && !na) incomplete = true;

    if(good) checks.push(label+": Good");
    if(bad){
      checks.push(label+": Needs Attention");
      issuesList.push(label);
    }
    if(na) checks.push(label+": N/A");
  });

  if(incomplete){
    alert("Please complete all checks before saving.");
    return;
  }

  if(issuesList.length > 0){
    document.getElementById("issues").value=
      issuesList.join(", ");
  }

  const log={
    date:date.value,
    time:time.value,
    vehicleId:vehicleId.value,
    odometer:odometer.value,
    checks,
    issues:issues.value,
    notes:notes.value
  };

  const logs=JSON.parse(localStorage.getItem("carPrecheckLogs"))||[];
  logs.push(log);
  localStorage.setItem("carPrecheckLogs",JSON.stringify(logs));

  form.reset();
  document.querySelectorAll(".status-btn")
    .forEach(btn=>btn.classList.remove("active"));
  updateSummary();
  alert("Pre-check saved.");

  loadEntries();
});

function loadEntries(){
  const logs=JSON.parse(localStorage.getItem("carPrecheckLogs"))||[];
  entriesDiv.innerHTML="";
  logs.slice().reverse().forEach(log => {
    const div=document.createElement("div");
    div.className="entry";
    div.innerHTML=`
      <strong>${log.date} ${log.time}</strong><br>
      <strong>Vehicle:</strong> ${log.vehicleId}<br>
      <strong>Odometer:</strong> ${log.odometer||"—"} km<br>
      <strong>Issues:</strong> ${log.issues||"None"}<br>
      <strong>Notes:</strong> ${log.notes||"—"}
      <br>
      <button class="delete-btn" onclick="deleteEntry(${log.originalIndex})">Delete</button>
    `;
    entriesDiv.appendChild(div);
  });
}


//Delete and Clear
function deleteEntry(index) {
    const logs = JSON.parse(localStorage.getItem("carPrecheckLogs")) || []; 
    logs.splice(index, 1); 
    localStorage.setItem("carPrecheckLogs", JSON.stringify(logs)); 
    loadEntries();
}

function clearAll(){
  if (confirm("Delete ALL stored entries?")) {
    localStorage.removeItem("carPrecheckLogs");
    loadEntries();
  }
}

// PWA Service Worker
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').then(()=>console.log("Service Worker Registered"));}

updateSummary();
loadEntries();