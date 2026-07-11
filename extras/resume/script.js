const defaultBullets = {
  "list-education": [
    "List any specific certificates, VET courses, or classes you completed during school here that are relevant to the job you're applying for.",
  ],
  "list-credentials": ["Put your other relevant qualifications here."],
  "list-job1": [
    "Describe what you actually do on the field regarding player safety. How does this relate to your new role?",
    "Explain how you communicate with players or coaches when a game gets tense. How does this relate to your new role?",
  ],
  "list-job2": [
    "What were your daily responsibilities during this placement? How does this relate to your new role?",
  ],
  "list-job3": [
    "Describe your day-to-day duties handling stock. How does this relate to your new role?",
  ],
  "list-job4": [
    "Describe how you interacted with the public. How does this relate to your new role?",
  ],
  "list-volunteer": [
    "In your own words, describe what this organisation does and what your specific role was. How does this relate to your new role?",
    "What did you achieve volunteering here? Why is it worth including?",
  ],
};

document.addEventListener("DOMContentLoaded", () => {
  loadResumeData();
  setupListControllers();
  setupAutoSave();

  document
    .getElementById("printBtn")
    .addEventListener("click", () => window.print());
  document.getElementById("resetBtn").addEventListener("click", resetToDefault);
});

function renderList(listId, itemsArray) {
  const listEl = document.getElementById(listId);
  listEl.innerHTML = ""; // Clear existing elements

  itemsArray.forEach((text, index) => {
    const li = document.createElement("li");
    li.className = "bullet-item prompt";
    li.contentEditable = "true";
    li.innerText = text;
    li.setAttribute("data-index", index);

    li.addEventListener("input", saveResumeData);

    const removeBtn = document.createElement("button");
    removeBtn.className = "btn-remove-bullet";
    removeBtn.innerHTML = "×";
    removeBtn.contentEditable = "false";
    removeBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      removeBulletItem(listId, index);
    });

    li.appendChild(removeBtn);
    listEl.appendChild(li);
  });
}

function setupListControllers() {
  document.querySelectorAll(".dynamic-list").forEach((list) => {
    const controllerDiv = document.createElement("div");
    controllerDiv.className = "list-controls";

    const addBtn = document.createElement("button");
    addBtn.className = "btn-add-bullet";
    addBtn.innerText = "+ Add Bullet";
    addBtn.addEventListener("click", () => addBulletItem(list.id));

    controllerDiv.appendChild(addBtn);
    list.after(controllerDiv);
  });
}

function addBulletItem(listId) {
  const data = getFormData();
  data.lists[listId].push("Click here to write your new point...");
  saveDataToStorage(data);
  renderList(listId, data.lists[listId]);
}

function removeBulletItem(listId, index) {
  const data = getFormData();
  data.lists[listId].splice(index, 1);
  saveDataToStorage(data);
  renderList(listId, data.lists[listId]);
}

function getFormData() {
  const state = { textFields: {}, lists: {} };

  document
    .querySelectorAll("[contenteditable='true']:not(.bullet-item)")
    .forEach((el) => {
      state.textFields[el.id] = el.innerText;
    });

  document.querySelectorAll(".dynamic-list").forEach((list) => {
    const items = [];
    list.querySelectorAll(".bullet-item").forEach((li) => {
      // Remove text content belonging to child deletion button
      const cleanText = li.innerText.replace(/×$/, "").trim();
      items.push(cleanText);
    });
    state.lists[list.id] = items;
  });

  return state;
}

function saveResumeData() {
  saveDataToStorage(getFormData());
}

function saveDataToStorage(data) {
  localStorage.setItem("stJohnResumeBackup", JSON.stringify(data));
}

function setupAutoSave() {
  document.querySelectorAll("[contenteditable='true']").forEach((el) => {
    el.addEventListener("input", saveResumeData);
  });
}

function loadResumeData() {
  const saved = localStorage.getItem("stJohnResumeBackup");
  if (saved) {
    const data = JSON.parse(saved);

    Object.keys(data.textFields).forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.innerText = data.textFields[id];
    });

    Object.keys(data.lists).forEach((id) => {
      renderList(id, data.lists[id]);
    });
  } else {
    Object.keys(defaultBullets).forEach((id) => {
      renderList(id, defaultBullets[id]);
    });
  }
}

function resetToDefault() {
  if (confirm("Are you sure you want to completely clear your edits?")) {
    localStorage.removeItem("stJohnResumeBackup");
    window.location.reload();
  }
}
