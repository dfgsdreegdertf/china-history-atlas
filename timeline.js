const archiveImages = {
  868: {"url":"https://upload.wikimedia.org/wikipedia/commons/0/05/Diamond_Sutra_of_868_AD_-_The_Diamond_Sutra_(868)%2C_frontispiece_and_text_-_BL_Or._8210-P.2_(cropped).jpg","caption":"868 年《金刚经》刻本卷首 · 大英图书馆藏","position":"center 43%","credit":"https://commons.wikimedia.org/wiki/File:Diamond_Sutra_of_868_AD_-_The_Diamond_Sutra_(868)%2C_frontispiece_and_text_-_BL_Or._8210-P.2_(cropped).jpg"},
  1110: {"url":"https://upload.wikimedia.org/wikipedia/commons/4/43/Along_the_River_During_the_Qingming_Festival_(detail_of_original).jpg","caption":"《清明上河图》原卷局部 · 张择端","position":"center 48%","credit":"https://commons.wikimedia.org/wiki/File:Along_the_River_During_the_Qingming_Festival_(detail_of_original).jpg"},
  1840: {"url":"https://upload.wikimedia.org/wikipedia/commons/8/89/Destroying_Chinese_war_junks%2C_by_E._Duncan_%281843%29.jpg","key":"opium","caption":"1841 年穿鼻海战 · 爱德华·邓肯版画（1843 年出版）","position":"center 45%","credit":"https://commons.wikimedia.org/wiki/File:Destroying_Chinese_war_junks%2C_by_E._Duncan_(1843).jpg"},
  1851: {"url":"https://upload.wikimedia.org/wikipedia/commons/6/60/The_Taeping_Rebellion_in_China-_Palace_of_the_Taeping_Wang_at_Nankin%2C_lately_captured_by_the_Imperial_forces_%281864%29.jpg","key":"taiping","caption":"天京的太平天国王府 · 1864 年刊载的版画","position":"center 44%","credit":"https://commons.wikimedia.org/wiki/File:The_Taeping_Rebellion_in_China-_Palace_of_the_Taeping_Wang_at_Nankin%2C_lately_captured_by_the_Imperial_forces_(1864).jpg"},
  1911: {"url":"https://upload.wikimedia.org/wikipedia/commons/0/0b/%E6%AD%A6%E6%98%8C%E9%A6%96%E4%B9%89%E6%88%98%E6%97%B6%E5%8F%B8%E4%BB%A4%E9%83%A8%E6%88%90%E5%91%98%E5%90%88%E5%BD%B1%E7%85%A7.jpg","key":"revolution","caption":"1911 年 11 月，武昌首义战时司令部成员合影","position":"center 43%","credit":"https://commons.wikimedia.org/wiki/File:%E6%AD%A6%E6%98%8C%E9%A6%96%E4%B9%89%E6%88%98%E6%97%B6%E5%8F%B8%E4%BB%A4%E9%83%A8%E6%88%90%E5%91%98%E5%90%88%E5%BD%B1%E7%85%A7.jpg"},
  1919: {"url":"https://upload.wikimedia.org/wikipedia/commons/2/23/Student_Demonstrations%2C_June_4th_and_5th%2C_1919_2.jpg","key":"may","caption":"1919 年 6 月学生示威 · 西德尼·甘博摄","position":"center 48%","credit":"https://commons.wikimedia.org/wiki/File:Student_Demonstrations%2C_June_4th_and_5th%2C_1919_2.jpg"},
  1937: {"url":"https://upload.wikimedia.org/wikipedia/commons/e/e0/Chinese_Soldier_Went_Out_of_Wanping.jpg","key":"bridge","caption":"卢沟桥事变期间，宛平城附近的中国守军","position":"center 48%","credit":"https://commons.wikimedia.org/wiki/File:Chinese_Soldier_Went_Out_of_Wanping.jpg"},
  1945: {"url":"https://upload.wikimedia.org/wikipedia/commons/b/b2/Surrender_of_Japan_in_Nanjing.jpg","key":"surrender","caption":"1945 年 9 月 9 日，南京受降仪式现场","position":"center 44%","credit":"https://commons.wikimedia.org/wiki/File:Surrender_of_Japan_in_Nanjing.jpg"},
  1949: {"url":"https://upload.wikimedia.org/wikipedia/commons/1/12/Mao_proclaiming_establishment_of_PRC.jpg","key":"founding","caption":"1949 年 10 月 1 日，毛泽东在天安门城楼（修版照片）","position":"center 33%","credit":"https://commons.wikimedia.org/wiki/File:Mao_proclaiming_establishment_of_PRC.jpg"},
};

const byId = (id) => document.getElementById(id);
const slider = byId('slider');
const ruler = byId('ruler');
const plot = byId('plot');
const chapterSelect = byId('chapter-select');
const previous = byId('prev');
const next = byId('next');
const dialog = byId('info');
const dialogBody = byId('info-body');
const playEvents = byId('play-events');
const playSpeed = byId('play-speed');
const firstYear = chapters[0].start;
const lastYear = chapters.at(-1).end;
let current;
let chapterIndex = -1;
let cursorYear;
let visibleMarkers = [];
let frame = 0;
let queuedYear;
let drag;
let playback;

const yearGroups = new Map();
for (const record of records) {
  if (!yearGroups.has(record.year)) yearGroups.set(record.year, []);
  yearGroups.get(record.year).push(record);
}
const chapterFor = (year) => chapters.findLastIndex((chapter) => chapter.start <= year);
const chapterRecords = chapters.map((_, index) => records.filter((record) => chapterFor(record.year) === index));
const number = (value) => String(value).padStart(2, '0');
const portion = (year, start, end) => (year - start) / (end - start) * 100;
const labelFor = (chapter) => chapter.title + ' · ' + chapter.start + '—' + chapter.end;

function link(title, url, shortTitle = title) {
  const anchor = document.createElement('a');
  anchor.textContent = shortTitle + ' ↗';
  anchor.title = title;
  anchor.href = url;
  anchor.target = '_blank';
  anchor.rel = 'noopener noreferrer';
  return anchor;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

for (const chapter of chapters) {
  chapterSelect.add(new Option(labelFor(chapter), chapter.start));
  const divider = element('i', '');
  divider.style.left = portion(chapter.start, firstYear, lastYear) + '%';
  ruler.append(divider);
}
for (const lane of lanes) {
  const label = element('div', 'lane-label');
  label.style.setProperty('--lane-color', lane.color);
  label.append(element('span', 'lane-full', lane.label), element('span', 'lane-short', lane.short));
  byId('lane-labels').append(label);
}
byId('record-count').textContent = records.length + ' 个事件 · ' + lanes.length + ' 条主题轨道';

function drawChapter(index) {
  chapterIndex = index;
  const chapter = chapters[index];
  chapterSelect.value = chapter.start;
  const rows = lanes.map(() => element('div', 'plot-row'));
  visibleMarkers = [];
  const grouped = Map.groupBy(chapterRecords[index], (record) => record.year + ':' + record.lane.key);
  for (const group of grouped.values()) {
    const { year, lane } = group[0];
    const name = year + ' 年 · ' + group.map((record) => record.title).join(' / ');
    const marker = element('button', 'plot-marker', group.length > 1 ? String(group.length) : '');
    marker.type = 'button';
    marker.title = name;
    marker.setAttribute('aria-label', name);
    marker.style.left = portion(year, chapter.start, chapter.end) + '%';
    marker.style.setProperty('--lane-color', lane.color);
    marker.addEventListener('click', () => {
      const selected = group.indexOf(current);
      showRecord(group[(selected + 1) % group.length]);
    });
    rows[lane.index].append(marker);
    visibleMarkers.push({ marker, group });
  }
  byId('plot-rows').replaceChildren(...rows);

  const tickLabels = [];
  const lines = [];
  for (let i = 0; i <= 4; i++) {
    const year = Math.round(chapter.start + (chapter.end - chapter.start) * i / 4);
    const left = portion(year, chapter.start, chapter.end) + '%';
    const tick = element('span', 'tick', year);
    const line = element('i', '');
    tick.style.left = left;
    line.style.left = left;
    tickLabels.push(tick);
    lines.push(line);
  }
  byId('ticks').replaceChildren(...tickLabels);
  byId('plot-lines').replaceChildren(...lines);
}

function drawEvent(record) {
  current = record;
  const index = records.indexOf(record);
  const chapter = chapterFor(record.year);
  byId('chapter-label').textContent = '篇章 ' + number(chapter + 1) + ' · ' + chapters[chapter].title;
  byId('event-index').textContent = number(index + 1) + ' / ' + records.length;
  byId('date').textContent = record.date;
  const kind = byId('event-kind');
  kind.textContent = record.lane.label;
  kind.style.setProperty('--lane-color', record.lane.color);
  byId('event-title').textContent = record.title;
  byId('location').textContent = record.place;
  byId('summary').textContent = record.summary;
  byId('impact').textContent = record.impact;
  byId('event-sources').replaceChildren(...record.refs.map((ref) => {
    const [name, url] = sources[ref];
    return link(name, url, name.split(' · ')[0]);
  }));

  const sameYear = byId('same-year');
  const siblings = yearGroups.get(record.year).filter((other) => other !== record);
  sameYear.hidden = siblings.length === 0;
  sameYear.replaceChildren(element('span', 'same-year-label', '同年还有'), ...siblings.map((other) => {
    const button = element('button', 'same-year-button', other.title);
    button.type = 'button';
    button.style.setProperty('--lane-color', other.lane.color);
    button.addEventListener('click', () => showRecord(other, true, button === document.activeElement));
    return button;
  }));

  previous.disabled = index === 0;
  next.disabled = index === records.length - 1;
  drawEventMap(record);
}

function closestRecord(year, index) {
  const candidates = chapterRecords[index];
  let closest = candidates[0];
  for (const candidate of candidates) {
    if (Math.abs(candidate.year - year) < Math.abs(closest.year - year)) closest = candidate;
  }
  return current?.year === closest.year ? current : closest;
}

function showYear(year, selected) {
  const index = chapterFor(year);
  const changedChapter = index !== chapterIndex;
  if (changedChapter) drawChapter(index);
  const record = selected ?? closestRecord(year, index);
  if (record !== current || changedChapter) {
    if (record !== current) drawEvent(record);
    for (const { marker, group } of visibleMarkers) {
      marker.setAttribute('aria-pressed', String(group.includes(record)));
    }
  }
  if (year === cursorYear && !selected) return;
  cursorYear = year;
  slider.value = year;
  slider.setAttribute('aria-valuetext', year === record.year
    ? record.year + ' 年 · ' + record.title
    : '游标 ' + year + ' 年 · 最近事件 ' + record.year + ' 年 ' + record.title);
  ruler.style.setProperty('--progress', portion(year, firstYear, lastYear) + '%');
  byId('timeline-year').textContent = record.year;
  byId('timeline-hint').textContent = year === record.year
    ? '拖动浏览，松手定位到事件。'
    : '浏览 ' + year + ' 年 · 最近事件在 ' + record.year + ' 年';
  const chapter = chapters[index];
  plot.style.setProperty('--cursor', portion(record.year, chapter.start, chapter.end) + '%');
  scheduleConnector();
}

function commitSelection() {
  const hash = '#event-' + current.key;
  if (location.hash !== hash) history.replaceState(null, '', hash);
}

function showRecord(record, commit = true, focusTitle = false) {
  pausePlayback();
  cancelAnimationFrame(frame);
  frame = 0;
  showYear(record.year, record);
  if (commit) commitSelection();
  if (focusTitle) byId('event-title').focus({ preventScroll: true });
}

function pausePlayback() {
  if (!playback) return;
  clearInterval(playback);
  playback = undefined;
  playEvents.textContent = '▶ 播放';
  playEvents.setAttribute('aria-pressed', 'false');
}

function startPlayback() {
  if (current === records.at(-1)) showRecord(records[0]);
  playEvents.textContent = 'Ⅱ 暂停';
  playEvents.setAttribute('aria-pressed', 'true');
  playback = setInterval(() => {
    const record = records[records.indexOf(current) + 1];
    showYear(record.year, record);
    commitSelection();
    if (record === records.at(-1)) pausePlayback();
  }, 2300 / Number(playSpeed.value));
}

function selectFromHash() {
  if (location.hash.startsWith('#event-')) {
    const key = location.hash.slice('#event-'.length);
    showRecord(records.find((record) => record.key === key) ?? records[0], false);
  } else if (!current) {
    showRecord(records[0], false);
  }
}

function queueYear(year) {
  queuedYear = year;
  if (frame) return;
  frame = requestAnimationFrame(() => {
    frame = 0;
    showYear(queuedYear);
  });
}

function finishYear(year) {
  cancelAnimationFrame(frame);
  frame = 0;
  const record = closestRecord(year, chapterFor(year));
  showYear(record.year, record);
  commitSelection();
}

function yearAt(clientX) {
  const { rect, chapter } = drag;
  const fraction = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
  return Math.round(chapter.start + fraction * (chapter.end - chapter.start));
}

plot.addEventListener('pointerdown', (event) => {
  if (!event.isPrimary || event.button !== 0) return;
  pausePlayback();
  drag = { id: event.pointerId, x: event.clientX, rect: plot.getBoundingClientRect(),
    chapter: chapters[chapterIndex], moved: false };
});
plot.addEventListener('pointermove', (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  if (!drag.moved && Math.abs(event.clientX - drag.x) < 4) return;
  if (!drag.moved) {
    drag.moved = true;
    plot.setPointerCapture(event.pointerId);
  }
  queueYear(yearAt(event.clientX));
});
plot.addEventListener('pointerup', (event) => {
  if (!drag || drag.id !== event.pointerId) return;
  if (drag.moved || !event.target.closest('.plot-marker')) finishYear(yearAt(event.clientX));
  drag = undefined;
});
plot.addEventListener('pointercancel', () => {
  if (drag?.moved) finishYear(queuedYear);
  drag = undefined;
});

const directoryPeriods = [
  ['全部时期', firstYear, lastYear],
  ['近现代 · 1840 年至今', 1840, lastYear],
  ['晚清与民国 · 1840—1948', 1840, 1948],
  ['1949—1977', 1949, 1977],
  ['改革开放以来 · 1978 年至今', 1978, lastYear],
];

function openDirectory(nearModern = false) {
  pausePlayback();
  byId('info-title').textContent = nearModern ? '近现代事件' : '事件目录';
  const filters = element('div', 'directory-filters');
  const search = element('input', 'directory-search');
  search.type = 'search';
  search.placeholder = '按事件、地点或年份查找';
  search.setAttribute('aria-label', search.placeholder);
  const period = element('select', 'directory-period');
  period.setAttribute('aria-label', '筛选年代');
  directoryPeriods.forEach(([label], i) => period.add(new Option(label, i)));
  period.value = nearModern ? '1' : '0';
  const imageLabel = element('label', 'directory-image-filter');
  const imageOnly = document.createElement('input');
  imageOnly.type = 'checkbox';
  imageLabel.append(imageOnly, '只看配图');
  const resultCount = element('p', 'directory-count');
  resultCount.setAttribute('aria-live', 'polite');
  filters.append(search, period, imageLabel, resultCount);
  const empty = element('p', 'directory-empty', '没有找到匹配的事件。');
  empty.hidden = true;
  dialogBody.replaceChildren(filters, empty);
  const sections = [];
  chapters.forEach((chapter, i) => {
    const section = element('section', 'directory-group');
    const entries = [];
    section.append(element('h3', '', number(i + 1) + ' · ' + labelFor(chapter)));
    for (const record of chapterRecords[i]) {
      const image = imageFor(record);
      const button = element('button', '');
      button.type = 'button';
      button.style.setProperty('--lane-color', record.lane.color);
      button.append(element('time', '', record.year), element('span', 'directory-event', record.title));
      if (image) button.append(element('span', 'directory-image-tag', '有图'));
      button.append(element('span', 'directory-kind', record.lane.short));
      if (record === current) button.setAttribute('aria-current', 'true');
      button.addEventListener('click', () => {
        dialog.close();
        showRecord(record, true, true);
        byId('event').scrollIntoView({ block: 'start' });
      });
      section.append(button);
      entries.push({ button, year: record.year, hasImage: Boolean(image),
        label: (record.year + ' ' + record.date + ' ' + record.title + ' ' + record.place).toLowerCase() });
    }
    dialogBody.append(section);
    sections.push([section, entries]);
  });
  function filterDirectory() {
    const query = search.value.trim().toLowerCase();
    const [, start, end] = directoryPeriods[Number(period.value)];
    let count = 0;
    for (const [section, entries] of sections) {
      for (const { button, year, label, hasImage } of entries) {
        button.hidden = year < start || year > end || !label.includes(query) || (imageOnly.checked && !hasImage);
        if (!button.hidden) count++;
      }
      section.hidden = entries.every(({ button }) => button.hidden);
    }
    resultCount.textContent = count + ' 条事件';
    empty.hidden = count > 0;
  }
  search.addEventListener('input', filterDirectory);
  period.addEventListener('change', filterDirectory);
  imageOnly.addEventListener('change', filterDirectory);
  filterDirectory();
  dialog.showModal();
  search.focus();
}

byId('open-directory').addEventListener('click', () => openDirectory());
byId('open-modern').addEventListener('click', () => openDirectory(true));

byId('open-sources').addEventListener('click', () => {
  byId('info-title').textContent = '资料来源';
  const note = element('p', '', '本展选编 618—2026 年间的 ' + records.length + ' 个历史节点。横轴按年份比例绘制。拖动时预览最近的事件，松手定位到事件所在年。地图各断面标有独立年份和来源。');
  const list = element('ul', 'references');
  for (const [title, url] of Object.values(sources)) {
    const item = document.createElement('li');
    item.append(link(title, url));
    list.append(item);
  }
  dialogBody.replaceChildren(note, list);
  dialog.showModal();
});

slider.addEventListener('input', () => {
  pausePlayback();
  queueYear(slider.valueAsNumber);
});
slider.addEventListener('keydown', (event) => {
  if (!['ArrowLeft', 'ArrowRight', 'ArrowDown', 'ArrowUp'].includes(event.key)) return;
  event.preventDefault();
  const direction = ['ArrowLeft', 'ArrowDown'].includes(event.key) ? -1 : 1;
  const record = records[records.indexOf(current) + direction];
  if (record) showRecord(record);
});
slider.addEventListener('change', () => finishYear(slider.valueAsNumber));
chapterSelect.addEventListener('change', () => {
  pausePlayback();
  finishYear(Number(chapterSelect.value));
});
playEvents.addEventListener('click', () => {
  if (playback) pausePlayback();
  else startPlayback();
});
playSpeed.addEventListener('change', () => {
  if (!playback) return;
  pausePlayback();
  startPlayback();
});
previous.addEventListener('click', () => showRecord(records[records.indexOf(current) - 1]));
next.addEventListener('click', () => showRecord(records[records.indexOf(current) + 1]));
window.addEventListener('hashchange', selectFromHash);
selectFromHash();
