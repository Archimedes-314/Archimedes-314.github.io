const form = document.getElementById("logForm");
const entriesDiv = document.getElementById("entries");
const summaryDiv = document.getElementById("summary");

// Chip toggle with haptic feedback
function toggleChips(containerId, single=false) {
    const container = document.getElementById(containerId);
    container.addEventListener("click", e => {
        if (!e.target.classList.contains("chip")) return;
        if(single) [...container.children].forEach(c => c.classList.remove("active"));
        e.target.classList.toggle("active");
        if(navigator.vibrate) navigator.vibrate(50);
    });
}
toggleChips("severityChips", true);
toggleChips("levelChips", true);
toggleChips("contextChips");
toggleChips("interventionChips");
toggleChips("reflectionChips");

// Date/time
function setNow(){
  const now = new Date();
  document.getElementById("date").value = now.toISOString().split("T")[0];
  document.getElementById("time").value = now.toTimeString().slice(0,5);
}

// Voice
function startVoice() {
    if(!('webkitSpeechRecognition' in window)){alert("Voice not supported"); return;}
    const recognition = new webkitSpeechRecognition();
    recognition.lang="en-AU";
    recognition.start();
    recognition.onresult = e => document.getElementById("notes").value += e.results[0][0].transcript;
}

// Load entries
function loadEntries(){
    const entries = JSON.parse(localStorage.getItem("shiftEntries"))||[];
    entriesDiv.innerHTML="";
    let caseCount = {}; let total=0;
    entries.slice().reverse().forEach((entry,index)=>{
        total++;
        caseCount[entry.caseType] = (caseCount[entry.caseType]||0)+1;
        const div=document.createElement("div");
        div.className="entry";
        div.innerHTML = `
        <strong>${entry.date} ${entry.time}</strong> | ${entry.severity||""}<br>
        <strong>Type:</strong> ${entry.caseType}<br>
        <strong>Clinical Level:</strong> ${entry.clinicalLevel||"&mdash;"}<br>
        <strong>Context:</strong> ${entry.context?.join(", ")||"&mdash;"}<br>
        <strong>Interventions:</strong> ${entry.interventions?.join(", ")||"&mdash;"}<br>
        <strong>Reflection:</strong> ${entry.reflection?.join(", ")||"&mdash;"}<br>
        <strong>Learning Point:</strong> ${entry.learningPoint||"&mdash;"}<br>
        <strong>Emotional State:</strong> ${entry.emotionalState||"&mdash;"}<br>
        <strong>Notes:</strong> ${entry.notes||"&mdash;"}<br>
        <button class="delete-btn" onclick="deleteEntry(${entries.length-1-index})">Delete</button>`;
        entriesDiv.appendChild(div);
    });
    let summaryHTML=`<strong>Total Cases:</strong> ${total}<br>`;
    for(let type in caseCount) summaryHTML+=`${type}: ${caseCount[type]}<br>`;
    summaryDiv.innerHTML=summaryHTML;
}

// Submit
form.addEventListener("submit", e=>{
    e.preventDefault();
    const severity = [...document.querySelectorAll("#severityChips .active")].map(c => c.innerText)[0]||"";
    const interventions=[...document.querySelectorAll("#interventionChips .active")].map(c=>c.innerText);
    const customInt=document.getElementById("customIntervention").value.trim();
    if(customInt) interventions.push(customInt);

    const selectedType=document.getElementById("caseType").value;
    const customType=document.getElementById("customCase").value.trim();
    const finalType=customType||selectedType;
    if(!finalType){alert("Select or enter case type."); return;}

    const clinicalLevel=[...document.querySelectorAll("#levelChips .active")].map(c=>c.innerText)[0]||"";
    const context=[...document.querySelectorAll("#contextChips .active")].map(c=>c.innerText);
    const reflection=[...document.querySelectorAll("#reflectionChips .active")].map(c=>c.innerText);
    const learningPoint=document.getElementById("learningPoint").value.trim();
    const emotionalState=document.getElementById("emotionalState").value;
    let date=document.getElementById("date").value;
    let time=document.getElementById("time").value;
    if(!date){alert("Enter a Date"); return;}
    if(!time){alert("Enter the time"); return;}
    
    const entry={date,time,severity,caseType:finalType,clinicalLevel,context,interventions,reflection,learningPoint,emotionalState,notes:document.getElementById("notes").value.trim()};
    const entries=JSON.parse(localStorage.getItem("shiftEntries"))||[];
    entries.push(entry);
    localStorage.setItem("shiftEntries",JSON.stringify(entries));
    form.reset();
    document.querySelectorAll(".chip").forEach(c=>c.classList.remove("active"));
    loadEntries();
});

//Delete and Clear
function deleteEntry(index) {
    const entries=JSON.parse(localStorage.getItem("shiftEntries")) || []; 
    entries.splice(index,1); 
    localStorage.setItem("shiftEntries", JSON.stringify(entries)); 
    loadEntries();
}
function clearAll() {
    if (confirm("Delete ALL stored entries?")) {
        localStorage.removeItem("shiftEntries"); 
        loadEntries();
    }
}

// Initial load
loadEntries();

// PWA Service worker
if('serviceWorker' in navigator){navigator.serviceWorker.register('sw.js').then(()=>console.log("Service Worker Registered"));}