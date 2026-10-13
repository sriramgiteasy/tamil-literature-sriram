const list = document.querySelector("#work-list");
const search = document.querySelector("#search");
const filters = [...document.querySelectorAll(".filter")];
let activeFilter = "all";

function renderWorks() {
  const term = search.value.trim().toLocaleLowerCase();
  const filtered = works.filter((work) => {
    const matchesType = activeFilter === "all" || work.type === activeFilter;
    const matchesTerm = `${work.title} ${work.type} ${work.excerpt} ${work.body}`.toLocaleLowerCase().includes(term);
    return matchesType && matchesTerm;
  });

  if (!filtered.length) {
    list.innerHTML = `<div class="empty-state"><span class="empty-flower" aria-hidden="true">✳</span><h3>${works.length ? "தேடிய படைப்பு கிடைக்கவில்லை" : "முதல் படைப்புக்காகக் காத்திருக்கிறோம்"}</h3><p>${works.length ? "வேறு சொல்லைத் தேடிப் பாருங்கள்." : "உங்கள் கவிதை, கதை அல்லது கட்டுரையை works.js கோப்பில் சேர்த்ததும் இங்கே தோன்றும்."}</p></div>`;
    return;
  }

  list.innerHTML = filtered.map((work, index) => `
    <article class="work-card">
      <span class="work-number">${String(index + 1).padStart(2, "0")}</span>
      <div class="work-main"><div class="work-meta"><span>${work.type}</span><span>${work.date || ""}</span></div><h3>${work.title}</h3><p>${work.excerpt || ""}</p>${work.body ? `<details><summary>முழுவதும் வாசிக்க</summary><div class="work-body">${work.body.replaceAll("\n", "<br>")}</div></details>` : ""}</div>
      <span class="work-arrow" aria-hidden="true">↗</span>
    </article>`).join("");
}

filters.forEach((button) => button.addEventListener("click", () => {
  activeFilter = button.dataset.filter;
  filters.forEach((item) => item.classList.toggle("active", item === button));
  renderWorks();
}));
search.addEventListener("input", renderWorks);
document.querySelector("#year").textContent = new Date().getFullYear();
renderWorks();
