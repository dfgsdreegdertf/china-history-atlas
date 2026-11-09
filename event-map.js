const mapChina = {
  sheet: 'china-sheet', pins: 'china-pins', button: 'map-china',
  source: 'https://hunan.tianditu.gov.cn/subApp/tjxz/',
  credit: '现代底图 · 中国标准地图 GS(2016)1600号',
};
const mapHistory = { sheet: 'history-sheet', pins: 'history-pins', button: 'map-history' };
const mapWorld = {
  sheet: 'world-sheet', pins: 'world-pins', button: 'map-world',
  source: 'https://www.naturalearthdata.com/downloads/110m-physical-vectors/110m-land/',
  credit: 'Natural Earth · 世界陆地轮廓',
};

let mapRecord;
let activeMap;
let activePoint;
let selectedImage;
let photoTimer;
let mapEdition;
let connectorFrame = 0;

const mapModes = [mapHistory, mapChina, mapWorld];
const placesFor = (record) => record.points ? record : eventPlaces[record.key];

// Match the conic graticule printed on GS(2016)1600. Pins show the
// representative locations of events on the modern reference sheet.
function chinaPosition(longitude, latitude) {
  const angle = (longitude - 110) * .01006;
  const radius = 3198 - 27.79 * latitude;
  const x = 906 + radius * Math.sin(angle);
  const y = -1555 + radius * Math.cos(angle);
  if (x < 86 || x > 1558 || y < 134 || y > 1152) return null;
  if (y > 832 && x > 1343) return null;
  return [x / 1648, y / 1292];
}

function worldPosition(longitude, latitude) {
  return [(longitude + 180) / 360, (84 - latitude) / 142];
}

function historyPosition(longitude, latitude) {
  if (longitude < 68 || longitude > 142 || latitude < 13 || latitude > 56) return null;
  return [(longitude - 68) / 74, (56 - latitude) / 43];
}

function positionFor(mode) {
  if (mode === mapHistory) return historyPosition;
  return mode === mapChina ? chinaPosition : worldPosition;
}

function historyFor(year) {
  if (year >= 1949) return undefined;
  const edition = historicalMaps.findLast((map) => (map.from ?? map.year) <= year);
  return edition && year <= (edition.to ?? 1948) ? edition : undefined;
}

function drawConnector() {
  connectorFrame = 0;
  const svg = byId('event-connector');
  const node = document.querySelector('.plot-marker[aria-pressed="true"]');
  const pin = document.querySelector('.map-sheet:not([hidden]):not(.is-loading) .map-pin[aria-pressed="true"]');
  if (!node || !pin || enlargedMap.open) {
    svg.setAttribute('hidden', '');
    return;
  }
  const a = node.getBoundingClientRect();
  const b = pin.getBoundingClientRect();
  const x1 = a.left + a.width / 2;
  const y1 = a.top + a.height / 2;
  const x2 = b.left + b.width / 2;
  const y2 = b.top + b.height / 2;
  const topOfTimeline = byId('timeline').getBoundingClientRect().top;
  if (y1 < 0 || y1 > window.innerHeight || y2 < 0 || y2 >= topOfTimeline) {
    svg.setAttribute('hidden', '');
    return;
  }
  const bend = y1 - (y1 - y2) * .42;
  const path = 'M' + x1 + ',' + y1 + ' C' + x1 + ',' + bend + ' ' + x2 + ',' + bend + ' ' + x2 + ',' + y2;
  for (const stroke of svg.children) stroke.setAttribute('d', path);
  svg.style.setProperty('--connector-color', mapRecord.lane.color);
  svg.removeAttribute('hidden');
}

function scheduleConnector() {
  if (!connectorFrame) connectorFrame = requestAnimationFrame(drawConnector);
}

function selectMapPoint(index, returnFocus) {
  const { points } = placesFor(mapRecord);
  const point = points[index];
  activePoint = index;
  if (!positionFor(activeMap)(point[1], point[2])) activeMap = mapWorld;
  drawMap();
  if (returnFocus) byId(returnFocus)?.focus({ preventScroll: true });
}

function showHistoryEdition(edition) {
  const previous = byId('history-image');
  if (previous.getAttribute('src') === edition.url) return;

  const sheet = byId('history-sheet');
  const status = byId('history-status');
  const image = new Image(edition.width, edition.height);
  image.id = previous.id;
  image.alt = edition.title;
  sheet.classList.add('is-loading');
  status.textContent = '正在加载历史版图…';
  status.hidden = false;
  previous.replaceWith(image);
  image.addEventListener('load', () => {
    if (byId(image.id) !== image) return;
    sheet.classList.remove('is-loading');
    status.hidden = true;
    scheduleConnector();
  }, { once: true });
  image.addEventListener('error', () => {
    if (byId(image.id) === image) status.textContent = '这张版图暂时无法显示，可查看地图出处。';
  }, { once: true });
  image.src = edition.url;
}

function drawMap() {
  const { points, note } = placesFor(mapRecord);
  const pinLayer = byId(activeMap.pins);
  const places = byId('map-locations');
  for (const mode of mapModes) {
    const visible = mode === activeMap;
    byId(mode.sheet).hidden = !visible;
    byId(mode.button).setAttribute('aria-pressed', String(visible));
    if (!visible) byId(mode.pins).replaceChildren();
  }
  byId(mapHistory.button).hidden = !mapEdition;
  const credit = byId('map-credit');
  const edition = activeMap === mapHistory ? mapEdition : null;
  if (edition) {
    showHistoryEdition(edition);
    byId('map-title').textContent = edition.title;
    const label = mapRecord.year === edition.year ? '版图断面' : '参考断面';
    byId('map-context').textContent = mapRecord.year + ' 年事件 · ' + edition.year + ' 年' + label;
    credit.replaceChildren(link(edition.creditTitle, edition.credit));
    if (edition.license) credit.append(' · ', link('地图许可', edition.license, '许可'));
    if (edition.dataSource) credit.append(' · ', link('版图数据与绘制源码', edition.dataSource, '数据与源码'));
  } else {
    byId('map-title').textContent = activeMap === mapChina ? '中国地图' : '世界地图';
    byId('map-context').textContent = mapRecord.year + ' 年事件 · 现代地理定位';
    credit.replaceChildren(link(activeMap.credit, activeMap.source));
  }

  const pins = [];
  const placeButtons = [];
  const position = positionFor(activeMap);
  let drawn = 0;
  points.forEach(([name, longitude, latitude], index) => {
    const selected = index === activePoint;
    const xy = position(longitude, latitude);
    const place = element('button', 'map-place', name);
    place.type = 'button';
    place.id = 'map-place-' + index;
    place.setAttribute('aria-pressed', String(selected));
    place.addEventListener('click', () => selectMapPoint(index, place.id));
    placeButtons.push(place);
    if (!xy) return;
    drawn++;

    const [x, y] = xy;
    const pin = element('button', 'map-pin');
    pin.type = 'button';
    pin.id = 'map-pin-' + index;
    pin.title = name;
    pin.setAttribute('aria-label', name);
    pin.setAttribute('aria-pressed', String(selected));
    pin.style.left = x * 100 + '%';
    pin.style.top = y * 100 + '%';
    pin.classList.toggle('pin-left', x > .64);
    pin.classList.toggle('pin-low', y < .15);
    const label = element('span', 'pin-label', name);
    label.setAttribute('aria-hidden', 'true');
    pin.append(label);
    pin.addEventListener('click', () => selectMapPoint(index, pin.id));
    pins.push(pin);
  });

  pinLayer.replaceChildren(...pins);
  places.replaceChildren(...placeButtons);
  const mapNote = byId('map-note');
  const outside = drawn < points.length ? '点地点名称可查看图外地点。' : '';
  mapNote.textContent = [edition?.note, note, outside].filter(Boolean).join(' ');
  mapNote.hidden = !mapNote.textContent;
  scheduleConnector();
}

function imageFor(record) {
  const key = record.key;
  return record.image ?? modernExtraImages[key] ?? modernImageRecords[key] ?? earlyImageRecords[key] ?? archiveImages[key];
}

function drawEventImage(record) {
  const image = imageFor(record);
  const imageButton = byId('open-photo');
  const credit = byId('photo-credit');
  const status = byId('photo-status');
  selectedImage = image;
  clearTimeout(photoTimer);
  imageButton.closest('figure').hidden = !image;
  imageButton.hidden = true;
  status.hidden = false;
  status.textContent = '正在加载史料图像…';
  credit.replaceChildren();
  if (!image) return;

  renderPhotoCredit(credit, image);
  const photo = new Image();
  photo.id = 'event-photo';
  photo.alt = image.caption;
  photo.decoding = 'async';
  if (image.position) photo.style.objectPosition = image.position;
  if (image.fit) photo.style.objectFit = image.fit;
  photo.addEventListener('load', () => {
    if (mapRecord !== record) return;
    byId('event-photo').replaceWith(photo);
    status.hidden = true;
    imageButton.hidden = false;
  }, { once: true });
  photo.addEventListener('error', () => {
    if (mapRecord !== record) return;
    status.textContent = '图像暂时无法加载，可打开出处查看。';
  }, { once: true });
  photoTimer = setTimeout(() => { photo.src = image.local ?? image.url; }, 125);
}

function renderPhotoCredit(target, image) {
  const { caption, credit, license, related } = image;
  target.replaceChildren(element('p', '', caption), link(caption, credit, '图像出处'));
  if (license) target.append(link('许可条款', license, '许可'));
  if (related) target.append(link('现场图像', related, '现场原图'));
}

function drawEventMap(record) {
  mapRecord = record;
  mapEdition = historyFor(record.year);
  const { points, mode } = placesFor(record);
  activeMap = mapEdition ? mapHistory : mapChina;
  if (!mapEdition && (mode === 'world' || points.every(([, lon, lat]) => !chinaPosition(lon, lat)))) activeMap = mapWorld;
  activePoint = Math.max(0, points.findIndex(([, lon, lat]) => positionFor(activeMap)(lon, lat)));
  drawMap();
  drawEventImage(record);
}

for (const mode of mapModes) {
  document.getElementById(mode.button).addEventListener('click', () => {
    activeMap = mode;
    const points = placesFor(mapRecord).points;
    const position = positionFor(mode);
    if (!position(points[activePoint][1], points[activePoint][2])) {
      activePoint = Math.max(0, points.findIndex(([, lon, lat]) => position(lon, lat)));
    }
    drawMap();
  });
}
document.getElementById('open-photo').addEventListener('click', () => {
  if (!selectedImage) return;
  pausePlayback();
  const { caption, local, url } = selectedImage;
  const full = byId('photo-full');
  full.alt = caption;
  full.src = local ?? url;
  renderPhotoCredit(byId('photo-full-credit'), selectedImage);
  byId('photo-dialog').showModal();
});

const enlargedMap = document.getElementById('map-dialog');
const mapViewport = document.getElementById('map-viewport');
document.getElementById('expand-map').addEventListener('click', () => {
  pausePlayback();
  document.getElementById('map-enlarged').append(mapViewport);
  enlargedMap.showModal();
  scheduleConnector();
});
enlargedMap.addEventListener('close', () => {
  document.querySelector('.map-content').prepend(mapViewport);
  scheduleConnector();
});
const connectorObserver = new ResizeObserver(scheduleConnector);
connectorObserver.observe(mapViewport);
connectorObserver.observe(document.getElementById('plot'));
window.addEventListener('scroll', scheduleConnector, { passive: true });
window.addEventListener('resize', scheduleConnector);
