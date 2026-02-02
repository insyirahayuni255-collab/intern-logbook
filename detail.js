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

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const detailBox = document.getElementById("detailBox");
const subtitle = document.getElementById("subtitle");
const backBtn = document.getElementById("backBtn");
const copyBtn = document.getElementById("copyBtn");
const editBtn = document.getElementById("editBtn");
const deleteBtn = document.getElementById("deleteBtn");

backBtn.addEventListener("click", () => {
  window.location.href = "index.html";
});

let entry = null;

function loadEntry(){
  const data = getData();
  entry = data.find(x => x.id === id);

  if(!entry){
    subtitle.textContent = "Logbook tidak dijumpai.";
    detailBox.textContent = "Tiada data untuk ID ini.";
    copyBtn.disabled = true;
    editBtn.disabled = true;
    deleteBtn.disabled = true;
    return;
  }

  subtitle.textContent = `${entry.tarikh} - ${entry.hari} (${entry.unit})`;
  detailBox.textContent = formatPreview(entry);
}
loadEntry();

copyBtn.addEventListener("click", async () => {
  if(!entry) return;
  try{
    await navigator.clipboard.writeText(formatPreview(entry));
    copyBtn.textContent = "Copied!";
    setTimeout(() => copyBtn.textContent = "Copy", 900);
  }catch(err){
    alert("Tak dapat copy. Cuba manual select text.");
  }
});

editBtn.addEventListener("click", () => {
  if(!entry) return;
  sessionStorage.setItem("editLogId", entry.id);
  window.location.href = "index.html";
});

deleteBtn.addEventListener("click", () => {
  if(!entry) return;
  const ok = confirm("Confirm delete logbook ini?");
  if(!ok) return;

  let data = getData();
  data = data.filter(x => x.id !== entry.id);
  saveData(data);
  window.location.href = "index.html";
});
