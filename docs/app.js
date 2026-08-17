const profiles = Array.from({ length: 10 }, (_, index) => ({
  slot: index + 1,
  name: `青年员工 ${String(index + 1).padStart(2, "0")}`,
  department: "所属机构待发布",
  role: "岗位信息待发布",
  intro: "员工自我介绍资料待发布，敬请期待。",
  reflection: "清廉与自身岗位相结合的感悟资料待发布，敬请期待。",
  keyword: "待发布",
}));

const pad = (value) => String(value).padStart(2, "0");
const tabs = document.querySelector("#profile-tabs");
const panel = document.querySelector("#profile-panel");
let activeIndex = 0;
let touchStart = null;

profiles.forEach((profile, index) => {
  const button = document.createElement("button");
  button.type = "button";
  button.role = "tab";
  button.setAttribute("aria-controls", "profile-panel");
  button.innerHTML = `<span>${pad(profile.slot)}</span><small>${profile.name}</small>`;
  button.addEventListener("click", () => selectProfile(index));
  tabs.append(button);
});

function selectProfile(index, direction) {
  const normalized = (index + profiles.length) % profiles.length;
  const nextDirection = direction || (normalized >= activeIndex ? "next" : "previous");
  activeIndex = normalized;
  renderProfile(nextDirection);
}

function renderProfile(direction = "next") {
  const profile = profiles[activeIndex];
  const number = pad(profile.slot);

  tabs.querySelectorAll("button").forEach((button, index) => {
    const selected = index === activeIndex;
    button.classList.toggle("is-active", selected);
    button.setAttribute("aria-selected", String(selected));
    button.tabIndex = selected ? 0 : -1;
    if (selected && window.innerWidth <= 760) {
      button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  });

  document.querySelector("#photo-module-label").textContent = `MODULE 01 · PHOTO / NO. ${number}`;
  document.querySelector("#photo-keyword").textContent = `青荷 · ${profile.keyword}`;
  document.querySelector("#profile-count").textContent = `YOUTH PROFILE · ${number} / 10`;
  document.querySelector("#profile-name").textContent = profile.name;
  document.querySelector("#profile-department").textContent = profile.department;
  document.querySelector("#profile-role").textContent = profile.role;
  document.querySelector("#profile-intro-copy").textContent = profile.intro;
  document.querySelector("#profile-reflection-copy").textContent = `“${profile.reflection}”`;
  document.querySelector("#reflection-keyword").textContent = profile.keyword;
  document.querySelector("#active-number").textContent = number;
  document.querySelector("#profile-progress").style.width = `${((activeIndex + 1) / profiles.length) * 100}%`;
  panel.setAttribute("aria-label", `${profile.name}的完整档案`);

  panel.classList.remove("slide-next", "slide-previous");
  void panel.offsetWidth;
  panel.classList.add(`slide-${direction}`);
}

document.querySelector("#previous-profile").addEventListener("click", () => selectProfile(activeIndex - 1, "previous"));
document.querySelector("#next-profile").addEventListener("click", () => selectProfile(activeIndex + 1, "next"));

panel.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft") selectProfile(activeIndex - 1, "previous");
  if (event.key === "ArrowRight") selectProfile(activeIndex + 1, "next");
});

panel.addEventListener("touchstart", (event) => {
  const touch = event.changedTouches[0];
  touchStart = { x: touch.clientX, y: touch.clientY };
}, { passive: true });

panel.addEventListener("touchend", (event) => {
  if (!touchStart) return;
  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStart.x;
  const deltaY = touch.clientY - touchStart.y;
  touchStart = null;
  if (Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.25) {
    selectProfile(activeIndex + (deltaX < 0 ? 1 : -1), deltaX < 0 ? "next" : "previous");
  }
}, { passive: true });

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add("is-visible");
  });
}, { threshold: 0.12 });

document.querySelectorAll("[data-reveal]").forEach((item) => revealObserver.observe(item));
renderProfile();
