const form = document.getElementById("logForm");
const preview = document.getElementById("preview");
const logList = document.getElementById("logList");
const search = document.getElementById("search");
const clearBtn = document.getElementById("clearBtn");

let editId = null;

function getData() {
  return JSON.parse(localStorage.getItem("logbookData")) || [];
}

function saveData(data) {
  localStorage.setItem("logbookData", JSON.stringify(data));
}

function formatPreview(entry) {
  return `
HARI: ${entry.hari}
TARIKH: ${entry.tarikh}
UNIT: ${entry.unit}

TUGAS/AKTIVITI:
${entry.tugas}

OBJEKTIF:
${entry.objektif || "-"}

PROSEDUR KERJA:
${entry.prosedur || "-"}

KESIMPULAN:
${entry.kesimpulan || "-"}
  `.trim();
}

function updatePreviewFromForm() {
  const entry = {
    tarikh: document.getElementById("tarikh").value || "-",
    hari: document.getElementById("hari").value || "-",
    unit: document.getElementById("unit").value || "-",
    tugas: document.getElementById("tugas").value || "-",
    objektif: document.getElementById("objektif").value,
    prosedur: document.getElementById("prosedur").value,
    kesimpulan: document.getElementById("kesimpulan").value,
  };
  preview.textContent = formatPreview(entry);
}

["tarikh","hari","unit","tugas","objektif","prosedur","kesimpulan"].forEach(id => {
  document.getElementById(id).addEventListener("input", updatePreviewFromForm);
});

function renderList(filter = "") {
  const data = getData();
  logList.innerHTML = "";

  const filtered = data.filter(item => {
    const text = `${item.tarikh} ${item.hari} ${item.unit} ${item.tugas}`.toLowerCase();
    return text.includes(filter.toLowerCase());
  });

  if (filtered.length === 0) {
    logList.innerHTML = `<p style="color:#666;">Tiada logbook lagi.</p>`;
    return;
  }

  filtered
    .sort((a,b) => (a.tarikh > b.tarikh ? -1 : 1))
    .forEach(item => {
      const div = document.createElement("div");
      div.className = "item";

      div.innerHTML = `
        <div class="itemTop">
          <div>
            <strong>${item.tarikh}</strong> - ${item.hari}<br/>
            <span class="badge">${item.unit}</span>
          </div>
          <div style="text-align:right;">
            <strong>${item.tugas}</strong>
          </div>
        </div>

        <button class="openBtn">Lihat Detail</button>

        <div class="actions">
          <button onclick="editEntry('${item.id}')">Edit</button>
          <button onclick="deleteEntry('${item.id}')">Delete</button>
        </div>
      `;

      div.querySelector(".openBtn").addEventListener("click", () => {
        window.location.href = `detail.html?id=${item.id}`;
      });

      logList.appendChild(div);
    });
}

function resetForm() {
  form.reset();
  editId = null;
  updatePreviewFromForm();
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const entry = {
    id: editId || crypto.randomUUID(),
    tarikh: document.getElementById("tarikh").value,
    hari: document.getElementById("hari").value,
    unit: document.getElementById("unit").value,
    tugas: document.getElementById("tugas").value,
    objektif: document.getElementById("objektif").value,
    prosedur: document.getElementById("prosedur").value,
    kesimpulan: document.getElementById("kesimpulan").value,
  };

  let data = getData();

  if (editId) {
    data = data.map(x => x.id === editId ? entry : x);
  } else {
    data.push(entry);
  }

  saveData(data);
  resetForm();
  renderList(search.value);
});

clearBtn.addEventListener("click", resetForm);
search.addEventListener("input", () => renderList(search.value));

window.editEntry = function(id) {
  const data = getData();
  const entry = data.find(x => x.id === id);
  if (!entry) return;

  editId = id;

  document.getElementById("tarikh").value = entry.tarikh;
  document.getElementById("hari").value = entry.hari;
  document.getElementById("unit").value = entry.unit;
  document.getElementById("tugas").value = entry.tugas;
  document.getElementById("objektif").value = entry.objektif;
  document.getElementById("prosedur").value = entry.prosedur;
  document.getElementById("kesimpulan").value = entry.kesimpulan;

  updatePreviewFromForm();
};

window.deleteEntry = function(id) {
  let data = getData();
  data = data.filter(x => x.id !== id);
  saveData(data);
  renderList(search.value);
};

updatePreviewFromForm();
renderList();

// auto open edit if coming from detail page
const editFromDetail = sessionStorage.getItem("editLogId");
if(editFromDetail){
  sessionStorage.removeItem("editLogId");
  window.editEntry(editFromDetail);
}
