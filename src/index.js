const lecturePerPage = 10;
let $tbody
let page = 0;
let lectures;

function getEveryLectures() {
  const scripts = document.querySelectorAll("script");
  let matches = [];
  for (const script of scripts) {
    if (script.textContent.includes("이전달")) {
      const regex = /resultList\.push\(\s*(\{[^]*?\})\s*\);/g;
      let match;

      while ((match = regex.exec(script.textContent)) !== null) {
        matches.push(JSON.parse(match[1]));
      }
      break;
    }
  }
  return matches;
}

function getPagedLectures(page) {
  const start = page * lecturePerPage;
  return lectures.slice(
    start,
    Math.min(lectures.length, start + lecturePerPage)
  );
}

function clearTbody() {
  $tbody.innerHTML = "";
}

function makeTr({
  categoryNm = "-",
  number = "-",
  subjectTitle = "-",
  url = "-",
  status = "-",
  registerPeriod = "-",
  date = "-",
  time = "-",
  registerCount = "-",
  confirmStatus = "-",
  writer = "-",
  writeDate = "-",
} = {}) {
  const tr = document.createElement("tr");

  tr.innerHTML = `
    <td class="pc_only">${number}</td>
    <td class="tit">
      <div class="rel">
        <a href="${url}">
          [${categoryNm}] ${subjectTitle}</a>
        <div class="ab color-blue block-t">${status}</div>
      </div>
      <div class="block-t bbs_m">
        <span>접수기간 : ${registerPeriod}</span>
        <span>강의날짜 : ${time}</span>
        <span>접수인원 : ${registerCount}</span>
      </div>
    </td>
    <td class="pc_only" style="white-space: nowrap;">
      <a href="${url}">${registerPeriod}</a>
    </td>
    <td class="pc_only">
      ${date}
    </td>
    <td class="pc_only">${registerCount}</td>
    <td class="pc_only">${confirmStatus}</td>
    <td class="pc_only">${status}</td>
    <td class="pc_only">${writer}</td>
    <td class="pc_only">${writeDate}</td>
  `;

  return tr;
}

function addLectures(lecs) {
  const $frag = document.createDocumentFragment();
  let count = 0;
  for (const lec of lecs) {
    $frag.appendChild(makeTr({...lec, number: lectures.length-page*lecturePerPage-count++}));
  }
  $tbody.appendChild($frag);
}

function isHalfScreenLeft() {
  const scrollY = window.scrollY;
  const viewportHeight = window.innerHeight;
  const totalHeight = document.documentElement.scrollHeight;

  const remainingScroll = totalHeight - (scrollY + viewportHeight);

  return remainingScroll <= viewportHeight / 2;
}

function firstCall() {
  clearTbody();
  page = 0;
  addLectures(getPagedLectures(page++));
  window.addEventListener("scroll", () => {
    if (isHalfScreenLeft() && lectures.length > page * lecturePerPage)
      addLectures(getPagedLectures(page++));
  });
}

function init() {
  $tbody = document.querySelector("table.t:nth-child(1) > tbody");
  lectures = getEveryLectures();
  const $div = document.querySelector("div.sch.reset");
  const $button = document.createElement("button");
  $button.innerHTML = `<span class="ico-reset">최신순</span>`;
  $button.className = "btn-reset";
  $button.type = "button";
  $div.appendChild($button);
  $button.addEventListener("click", () => {
    firstCall();
  });
}

init();