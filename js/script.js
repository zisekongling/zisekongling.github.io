// ======================== DOM 元素引用 ========================
const elements = {
    hours: document.getElementById('hours'),
    minutes: document.getElementById('minutes'),
    seconds: document.getElementById('seconds'),
    milliseconds: document.getElementById('milliseconds'),
    colonAfterHour: document.getElementById('colonAfterHour'),
    colonAfterMinute: document.getElementById('colonAfterMinute'),
    dateDisplay: document.getElementById('dateDisplay'),
    quoteContent: document.getElementById('quoteContent'),
    quoteText: document.querySelector('.quote-text'),
    quoteAuthor: document.getElementById('quoteAuthor'),
    quoteType: document.getElementById('quoteType'),
    apiStatus: document.getElementById('apiStatus'),
    apiStatusText: document.getElementById('apiStatusText'),
    settingsPanel: document.getElementById('settingsPanel'),
    container: document.querySelector('.container'),
    gaokaoCountdown: document.getElementById('gaokaoCountdown'),
    gaokaoText: document.getElementById('gaokaoText'),
    quoteProgressBar: document.getElementById('quoteProgressBar'),
    bgProgress: document.getElementById('bgProgress'),
    bgProgressBar: document.getElementById('bgProgressBar'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toastMessage'),
    refreshBtn: document.getElementById('refreshBtn'),
    noSleepVideo: document.getElementById('noSleepVideo'),
    extStatus: document.getElementById('extStatus'),
    extStatusText: document.getElementById('extStatusText'),
    downloadExtBtn: document.getElementById('downloadExtBtn'),
    nextExamContainer: document.getElementById('nextExamContainer'),
    nextExamText: document.getElementById('nextExamText'),
    topCountdowns: document.getElementById('topCountdowns'),
    countdownPanelItems: document.getElementById('countdownPanelItems'),
    countdownsList: document.getElementById('countdownsList'),
    showHolidayImageCheckbox: document.getElementById('showHolidayImage'),
    aboutBtn: document.getElementById('aboutBtn'),
    bgLoader: document.getElementById('bgLoader'),
    countdownSidebar: document.getElementById('countdownSidebar'),
    tagFilterGroup: document.getElementById('tagFilterGroup'),
    bgLayer1: document.getElementById('bg-layer-1'),
    bgLayer2: document.getElementById('bg-layer-2'),
    showDateCheckbox: document.getElementById('showDate'),
    showSecondsCheckbox: document.getElementById('showSeconds'),
    showMillisecondsCheckbox: document.getElementById('showMilliseconds'),
    showGaokaoCheckbox: document.getElementById('showGaokao'),
    showQuoteProgressCheckbox: document.getElementById('showQuoteProgress'),
    showBgProgressCheckbox: document.getElementById('showBgProgress'),
    bgUrlInput: document.getElementById('bgUrl'),
    bgLocalBtn: document.getElementById('bgLocalBtn'),
    saveBgBtn: document.getElementById('saveBgBtn'),
    fullscreenBtn: document.getElementById('fullscreenBtn'),
    themeBtn: document.getElementById('themeBtn'),
    settingsBtn: document.getElementById('settingsBtn'),
    cancelSettingsBtn: document.getElementById('cancelSettingsBtn'),
    saveSettingsBtn: document.getElementById('saveSettingsBtn'),
    selectAllBtn: document.getElementById('selectAllBtn'),
    deselectAllBtn: document.getElementById('deselectAllBtn'),
    presetBtns: document.querySelectorAll('.preset-btn'),
    quoteIntervalInput: document.getElementById('quoteInterval'),
    bgIntervalInput: document.getElementById('bgInterval'),
    refreshQuoteBtn: document.getElementById('refreshQuoteBtn'),
    refreshBgBtn: document.getElementById('refreshBgBtn'),
    resetBtn: document.getElementById('resetBtn'),
    quotePriorityRadio: document.getElementById('quotePriority'),
    timePriorityRadio: document.getElementById('timePriority'),
    extensionTypeCheckbox: document.getElementById('extensionType'),
    toggleGuaranteeBtn: document.getElementById('toggleGuaranteeBtn'),
    countdownTitleInput: document.getElementById('countdownTitle'),
    countdownDateInput: document.getElementById('countdownDate'),
    addCountdownBtn: document.getElementById('addCountdownBtn'),
    typewriterAnimationRadio: document.getElementById('typewriterAnimation'),
    noAnimationRadio: document.getElementById('noAnimation'),
    countdownPanel: document.getElementById('countdownPanel'),
    exportSettingsBtn: document.getElementById('exportSettingsBtn'),
    importSettingsBtn: document.getElementById('importSettingsBtn'),
    importFileInput: document.getElementById('importFileInput')
};

// ======================== 全局状态 ========================
let currentTheme = 'light';
const themes = ['light', 'dark', 'ocean', 'forest', 'sunset', 'midnight', 'sakura'];
let currentThemeIndex = 0;
let quoteTypes = ['a', 'c', 'f', 'h', 'k'];
let quoteInterval = 1;
let bgIntervalTime = 30;
let quoteStartTime = 0, bgStartTime = 0, quoteDuration = 0, bgDuration = 0;
let currentPreset = null, customBg = null, isTyping = false, lastProgressUpdate = Date.now();
let tempSettings = null, animationFrameId = null, quoteAnimationFrame = null, bgAnimationFrame = null;
let currentBgUrl = '', timeOffset = 0, lastTimeSync = 0;
let extensionQuotes = [], displayPriority = 'quote', wakeLock = null, downloadRetryCount = 0;
const maxRetries = 10;
let consecutiveNonExtension = 0, enableQuoteGuarantee = true;
let countdowns = [], editingCountdownId = null;
let quoteAnimationType = 'typewriter', showHolidayImage = true;
let activeBgLayer = elements.bgLayer1, inactiveBgLayer = elements.bgLayer2;
let bgLoading = false, bgClearTimeout = null, filteredTags = [], allTags = [], bgInterval = null;

// 高考科目
const examSubjects = [
    { name: "语文", date: "06-07", startTime: "09:00", endTime: "11:30" },
    { name: "数学", date: "06-07", startTime: "15:00", endTime: "17:00" },
    { name: "物理/历史", date: "06-08", startTime: "09:00", endTime: "10:15" },
    { name: "外语", date: "06-08", startTime: "15:00", endTime: "17:00" },
    { name: "化学", date: "06-09", startTime: "08:30", endTime: "09:45" },
    { name: "地理", date: "06-09", startTime: "11:00", endTime: "12:15" },
    { name: "政治", date: "06-09", startTime: "14:30", endTime: "15:45" },
    { name: "生物", date: "06-09", startTime: "17:00", endTime: "18:15" }
];
let ignoredSubjects = [];

// 示例扩展金句 & 本地备用库
const sampleExtensionQuotes = [
    { hitokoto: "生活不止眼前的苟且，还有诗和远方。", from: "高晓松", from_who: "", type: "m", tag: ["励志","生活"] },
    { hitokoto: "成功的秘诀在于坚持自己的梦想。", from: "马云", from_who: "", type: "m", tag: ["成功","励志"] },
    { hitokoto: "学习如逆水行舟，不进则退。", from: "《增广贤文》", from_who: "", type: "m", tag: ["学习","励志"] },
    { hitokoto: "世上无难事，只要肯登攀。", from: "毛泽东", from_who: "", type: "m", tag: ["励志","奋斗"] },
    { hitokoto: "知识就是力量。", from: "培根", from_who: "", type: "m", tag: ["学习","知识"] },
    { hitokoto: "一个男人不会因为年龄的成长而成长，而是经历某些事情后才会成长", from: "徐天乐", from_who: "鸿鹄一班", type: "e", tag: ["成长","人生"] }
];
const localQuotes = [
    {quote: "宝剑锋从磨砺出，梅花香自苦寒来", author: "出自：《警世贤文》", type: "文学"},
    {quote: "不积跬步，无以至千里；不积小流，无以成江海", author: "出自：荀子《劝学》", type: "文学"},
    {quote: "青春须早为，岂能长少年", author: "出自：孟郊《劝学》", type: "文学"},
    {quote: "成功不是将来才有的，而是从决定去做的那一刻起，持续累积而成", author: "俞敏洪", type: "励志"},
    {quote: "学习如逆水行舟，不进则退", author: "中国谚语", type: "网络"},
    {quote: "时间就像海绵里的水，只要愿挤，总还是有的", author: "鲁迅", type: "文学"},
    {quote: "坚持就是胜利，努力就有收获", author: "佚名", type: "网络"},
    {quote: "书山有路勤为径，学海无涯苦作舟", author: "出自：《增广贤文》", type: "文学"},
    {quote: "机会总是留给有准备的人", author: "路易·巴斯德", type: "励志"},
    {quote: "今天的努力，明天的实力", author: "佚名", type: "网络"}
];

const bgPresets = {
    none: '', weimei: 'https://t.alcy.cc/fj', bluearchive: 'https://rba.kanostar.top/adapt',
    anime: 'https://imgapi.xl0408.top/index.php', yuanshen: 'https://api.suyanw.cn/api/ys',
    random: ['https://t.alcy.cc/fj','https://rba.kanostar.top/adapt','https://imgapi.xl0408.top/index.php','https://api.suyanw.cn/api/ys']
};

// ======================== 辅助函数 ========================
function showToast(msg) {
    elements.toastMessage.textContent = msg;
    elements.toast.classList.add('show');
    setTimeout(() => elements.toast.classList.remove('show'), 3000);
}

function formatDate(date) { return `${date.getFullYear()}年${date.getMonth()+1}月${date.getDate()}日`; }
function formatDateTimeLocal(date) {
    let y = date.getFullYear(), m = String(date.getMonth()+1).padStart(2,'0'), d = String(date.getDate()).padStart(2,'0');
    let h = String(date.getHours()).padStart(2,'0'), mi = String(date.getMinutes()).padStart(2,'0');
    return `${y}-${m}-${d}T${h}:${mi}`;
}
function calculateTimeDiff(now, target) {
    if(target < now) return { days:0, hours:0, minutes:0 };
    let diff = target - now;
    return { days: Math.floor(diff/(86400000)), hours: Math.floor((diff%86400000)/(3600000)), minutes: Math.floor((diff%3600000)/60000) };
}
function formatTimeDiff(td) {
    if(td.days > 0) return `${td.days}天${td.hours}小时`;
    if(td.hours > 0) return `${td.hours}小时${td.minutes}分钟`;
    return `${td.minutes}分钟`;
}
function getTypeName(type) {
    const map = { a:'动画',b:'漫画',c:'游戏',d:'文学',e:'原创',f:'网络',g:'其他',h:'影视',i:'诗词',j:'网易云',k:'哲学',l:'抖机灵',m:'拓展' };
    return map[type] || type;
}
function updateExtensionStatus() {
    let saved = localStorage.getItem('extensionQuotes');
    if(saved) {
        try { let q = JSON.parse(saved); elements.extStatus.className = 'status-indicator'; elements.extStatusText.textContent = `拓展金句: 已启用 (${q.length}条)`; }
        catch(e){ elements.extStatus.className = 'status-indicator offline'; elements.extStatusText.textContent = '拓展金句: 数据损坏'; }
    } else { elements.extStatus.className = 'status-indicator offline'; elements.extStatusText.textContent = '拓展金句: 已禁用'; }
}
function extractTags() {
    let set = new Set();
    extensionQuotes.forEach(q => { if(q.tag && Array.isArray(q.tag)) q.tag.forEach(t => set.add(t)); });
    allTags = Array.from(set);
    renderTagFilters();
}
function renderTagFilters() {
    elements.tagFilterGroup.innerHTML = '';
    allTags.forEach(tag => {
        let el = document.createElement('div');
        el.className = `tag-filter-item ${filteredTags.includes(tag) ? 'active' : ''}`;
        el.innerHTML = `<span>${tag}</span>`;
        el.addEventListener('click', () => toggleTagFilter(tag));
        elements.tagFilterGroup.appendChild(el);
    });
}
function toggleTagFilter(tag) {
    if(filteredTags.includes(tag)) filteredTags = filteredTags.filter(t => t !== tag);
    else filteredTags.push(tag);
    localStorage.setItem('filteredTags', JSON.stringify(filteredTags));
    renderTagFilters();
    showToast(`标签过滤已更新`);
}
function isQuoteFiltered(quote) { return quote.tag && quote.tag.some(t => filteredTags.includes(t)); }

// ======================== 倒数日逻辑 ========================
function initCountdowns() {
    let saved = localStorage.getItem('countdowns');
    if(saved) try { countdowns = JSON.parse(saved); } catch(e){ countdowns = []; }
    renderCountdownsList();
    updateCountdownDisplay();
}
function renderCountdownsList() {
    elements.countdownsList.innerHTML = '';
    countdowns.forEach(cd => {
        let row = document.createElement('div'); row.className = 'countdown-item-row';
        row.innerHTML = `
            <div class="countdown-item-info"><div class="countdown-item-title">${cd.title}</div><div class="countdown-item-date">${formatDate(new Date(cd.endDate))}</div></div>
            <div class="countdown-item-actions">
                <button class="countdown-toggle-btn ${cd.hidden ? 'hidden' : ''}" data-id="${cd.id}" title="${cd.hidden ? '显示' : '隐藏'}"><i class="fas ${cd.hidden ? 'fa-eye-slash' : 'fa-eye'}"></i></button>
                <button class="countdown-edit-btn" data-id="${cd.id}" title="编辑"><i class="fas fa-edit"></i></button>
                <button class="countdown-delete-btn" data-id="${cd.id}" title="删除"><i class="fas fa-trash"></i></button>
            </div>`;
        elements.countdownsList.appendChild(row);
    });
    document.querySelectorAll('.countdown-edit-btn').forEach(btn => btn.addEventListener('click', () => editCountdown(btn.dataset.id)));
    document.querySelectorAll('.countdown-delete-btn').forEach(btn => btn.addEventListener('click', () => deleteCountdown(btn.dataset.id)));
    document.querySelectorAll('.countdown-toggle-btn').forEach(btn => btn.addEventListener('click', () => toggleCountdownVisibility(btn.dataset.id)));
}
function toggleCountdownVisibility(id) {
    let idx = countdowns.findIndex(c => c.id == id);
    if(idx !== -1) { countdowns[idx].hidden = !countdowns[idx].hidden; localStorage.setItem('countdowns',JSON.stringify(countdowns)); renderCountdownsList(); updateCountdownDisplay(); showToast(`已${countdowns[idx].hidden?'隐藏':'显示'}该倒数日`); }
}
function addCountdown() {
    let title = elements.countdownTitleInput.value.trim(), dateVal = elements.countdownDateInput.value;
    if(!title) return showToast('请输入事件内容');
    if(title.length>10) return showToast('事件内容最多10个字');
    if(!dateVal) return showToast('请选择结束时间');
    let endDate = new Date(dateVal);
    let newCd = { id: Date.now(), title, endDate: endDate.toISOString(), hidden: false };
    if(editingCountdownId) {
        let idx = countdowns.findIndex(c => c.id === editingCountdownId);
        if(idx !== -1) countdowns[idx] = newCd;
        editingCountdownId = null;
        showToast('倒数日已更新');
    } else { countdowns.push(newCd); showToast('倒数日已添加'); }
    localStorage.setItem('countdowns', JSON.stringify(countdowns));
    elements.countdownTitleInput.value = ''; elements.countdownDateInput.value = '';
    renderCountdownsList(); updateCountdownDisplay();
}
function editCountdown(id) {
    let cd = countdowns.find(c => c.id == id);
    if(cd) { elements.countdownTitleInput.value = cd.title; elements.countdownDateInput.value = formatDateTimeLocal(new Date(cd.endDate)); editingCountdownId = cd.id; document.querySelector('.countdowns-form').scrollIntoView({ behavior:'smooth' }); }
}
function deleteCountdown(id) {
    if(confirm('确定要删除这个倒数日吗？')) { countdowns = countdowns.filter(c => c.id != id); localStorage.setItem('countdowns',JSON.stringify(countdowns)); renderCountdownsList(); updateCountdownDisplay(); showToast('倒数日已删除'); }
}
function updateCountdownDisplay() {
    let now = new Date(Date.now() + timeOffset);
    updateTopCountdowns(now);
    updateCountdownPanel(now);
}
function updateTopCountdowns(now) {
    elements.topCountdowns.innerHTML = '';
    if(elements.showGaokaoCheckbox.checked) elements.topCountdowns.appendChild(elements.gaokaoCountdown);
    let visible = countdowns.filter(c => !c.hidden);
    for(let i=0; i<Math.min(2, visible.length); i++) {
        let cd = visible[i];
        let diff = calculateTimeDiff(now, new Date(cd.endDate));
        let span = document.createElement('span'); span.className = 'countdown-item';
        span.innerHTML = `<i class="fas fa-calendar"></i><span>${cd.title}：${formatTimeDiff(diff)}</span>`;
        elements.topCountdowns.appendChild(span);
    }
}
function updateCountdownPanel(now) {
    elements.countdownPanelItems.innerHTML = '';
    if(elements.showGaokaoCheckbox.checked) {
        let gDiff = calculateGaokaoTimeDiff(now);
        if(gDiff) {
            let item = document.createElement('div'); item.className = 'countdown-panel-item';
            item.innerHTML = `<div class="countdown-panel-item-title">高考倒计时</div><div class="countdown-panel-item-time">${formatTimeDiff(gDiff)}</div>`;
            elements.countdownPanelItems.appendChild(item);
        }
    }
    countdowns.forEach(cd => {
        let diff = calculateTimeDiff(now, new Date(cd.endDate));
        let item = document.createElement('div'); item.className = 'countdown-panel-item';
        item.innerHTML = `<div class="countdown-panel-item-title">${cd.title}</div><div class="countdown-panel-item-time">${formatTimeDiff(diff)}</div>`;
        elements.countdownPanelItems.appendChild(item);
    });
    if(elements.countdownPanelItems.children.length === 0) elements.countdownPanelItems.innerHTML = '<div class="countdown-panel-item"><div class="countdown-panel-item-title">暂无倒数日</div></div>';
}
function calculateGaokaoTimeDiff(now) {
    let year = now.getFullYear();
    let start = new Date(year,5,7), end = new Date(year,5,9,23,59,59,999);
    if(now >= start && now <= end) { elements.gaokaoText.innerHTML = `${year}年高考进行中！<br>加油！`; elements.gaokaoCountdown.style.background = 'rgba(106, 17, 203, 0.2)'; return null; }
    let target = start;
    if(now > end) target = new Date(year+1,5,7);
    return calculateTimeDiff(now, target);
}

// ======================== 北京时间同步 & 时间显示 ========================
async function fetchBeijingTime() {
    try {
        let res = await fetch('/.netlify/functions/bj-time');
        if(!res.ok) throw new Error();
        let data = await res.json();
        if(data.success && data.originalData && data.originalData.code === 200) {
            let beijing = new Date(data.originalData.time);
            timeOffset = beijing - new Date();
            lastTimeSync = Date.now();
        } else throw new Error();
    } catch(e) { console.error('时间同步失败',e); timeOffset = 0; }
}
function updateTimeDisplay() {
    let now = new Date(Date.now() + timeOffset);
    elements.hours.textContent = String(now.getHours()).padStart(2,'0');
    elements.minutes.textContent = String(now.getMinutes()).padStart(2,'0');
    if(elements.showSecondsCheckbox.checked) {
        elements.seconds.textContent = String(now.getSeconds()).padStart(2,'0');
        elements.seconds.style.display = 'inline'; elements.colonAfterMinute.style.display = 'inline';
        if(elements.colonAfterHour) elements.colonAfterHour.classList.remove('blink-colon');
    } else { elements.seconds.style.display = 'none'; elements.colonAfterMinute.style.display = 'none'; if(elements.colonAfterHour) elements.colonAfterHour.classList.add('blink-colon'); }
    if(elements.showMillisecondsCheckbox.checked) { elements.milliseconds.textContent = String(now.getMilliseconds()).padStart(3,'0'); document.querySelector('.milliseconds').style.display = 'inline'; }
    else document.querySelector('.milliseconds').style.display = 'none';
    if(elements.showDateCheckbox.checked) elements.dateDisplay.textContent = now.toLocaleDateString('zh-CN', {year:'numeric', month:'long', day:'numeric', weekday:'long'});
    else elements.dateDisplay.style.display = 'none';
    updateGaokaoCountdown(); updateNextExam(); updateCountdownDisplay();
}
function updateTime(timestamp) { updateTimeDisplay(); animationFrameId = requestAnimationFrame(updateTime); }
function updateGaokaoCountdown() {
    let now = new Date(Date.now()+timeOffset), year = now.getFullYear();
    let start = new Date(year,5,7), end = new Date(year,5,9,23,59,59,999);
    if(now >= start && now <= end) { elements.gaokaoText.innerHTML = `${year}年高考进行中！<br>加油！`; elements.gaokaoCountdown.style.background = 'rgba(106, 17, 203, 0.2)'; return; }
    let target = start; if(now > end) target = new Date(year+1,5,7);
    let diff = target - now;
    if(diff < 0) { elements.gaokaoText.innerHTML = `${target.getFullYear()}年高考已结束！`; return; }
    let days = Math.floor(diff/86400000), hours = Math.floor((diff%86400000)/3600000), minutes = Math.floor((diff%3600000)/60000);
    elements.gaokaoText.innerHTML = `距离${target.getFullYear()}年高考还有<br>${days}天${hours}小时${minutes}分钟`;
    elements.gaokaoCountdown.style.background = 'rgba(106, 17, 203, 0.1)';
}
function updateNextExam() {
    let now = new Date(Date.now()+timeOffset), year = now.getFullYear();
    let month = now.getMonth()+1, date = now.getDate();
    if(month !== 6 || date<7 || date>9) { elements.nextExamContainer.style.display = 'none'; return; }
    elements.nextExamContainer.style.display = 'inline-block';
    let next = null, minDiff = Infinity;
    for(let sub of examSubjects) {
        if(ignoredSubjects.includes(sub.name)) continue;
        let [m,d] = sub.date.split('-'), [h,mi] = sub.startTime.split(':');
        let examDate = new Date(year, parseInt(m)-1, parseInt(d), parseInt(h), parseInt(mi));
        let diff = examDate - now;
        if(diff > 0 && diff < minDiff) { minDiff = diff; next = sub; }
    }
    if(next) { let hours = Math.floor(minDiff/3600000), minutes = Math.floor((minDiff%3600000)/60000); elements.nextExamText.innerHTML = `下一科是: ${next.name}<br>距离开考仅剩: ${hours}时${minutes}分`; }
    else elements.nextExamText.innerHTML = "所有科目考试结束";
}

// ======================== 金句逻辑 ========================
function typewriterEffect(text) {
    isTyping = true; let i=0; elements.quoteText.innerHTML = ''; elements.quoteAuthor.textContent = ''; elements.quoteType.textContent = '';
    let timer = setInterval(() => {
        if(i < text.length) { elements.quoteText.innerHTML = text.substring(0,i+1) + '<span class="cursor"></span>'; i++; }
        else { clearInterval(timer); isTyping = false; elements.quoteText.innerHTML = text; }
    }, 50);
}
function displayQuote(text, author, type) {
    elements.quoteText.innerHTML = '';
    elements.quoteContent.classList.remove('fade-in','slide-up');
    if(quoteAnimationType === 'typewriter') typewriterEffect(text);
    else elements.quoteText.textContent = text;
    setTimeout(() => {
        let authorInfo = author || '未知';
        elements.quoteAuthor.textContent = `—— ${authorInfo}`;
        elements.quoteType.textContent = type;
    }, 300);
}
async function fetchQuote() {
    if(isTyping) return;
    let forceExt = false;
    if(enableQuoteGuarantee && consecutiveNonExtension >= 9 && elements.extensionTypeCheckbox.checked && extensionQuotes.length > 0) { forceExt = true; consecutiveNonExtension = 0; }
    let randomType = quoteTypes[Math.floor(Math.random()*quoteTypes.length)];
    if((forceExt || randomType === 'm') && elements.extensionTypeCheckbox.checked && extensionQuotes.length > 0) {
        let avail = extensionQuotes.filter(q => !isQuoteFiltered(q));
        if(avail.length) {
            let q = avail[Math.floor(Math.random()*avail.length)];
            let authorInfo = q.from_who ? (q.from_who + (q.from ? ` · ${q.from}` : '')) : (q.from ? `出自：${q.from}` : '未知');
            displayQuote(q.hitokoto, authorInfo, getTypeName(q.type));
            elements.apiStatus.className = 'status-indicator'; elements.apiStatusText.textContent = '扩展金句';
            resetQuoteTimer(); return;
        }
    }
    try {
        let urls = ['https://v1.hitokoto.cn','https://international.v1.hitokoto.cn'];
        let data = null;
        for(let url of urls) {
            try { let res = await fetch(`${url}?c=${randomType}&encode=json`); if(res.ok) { data = await res.json(); break; } } catch(e) {}
        }
        if(!data) throw new Error();
        let authorInfo = data.from_who ? (data.from_who + (data.from ? ` · ${data.from}` : '')) : (data.from ? `出自：${data.from}` : '未知');
        displayQuote(data.hitokoto, authorInfo, getTypeName(data.type));
        elements.apiStatus.className = 'status-indicator'; elements.apiStatusText.textContent = 'API正常';
        if(enableQuoteGuarantee && data.type !== 'm') consecutiveNonExtension++;
    } catch(e) {
        let local = localQuotes[Math.floor(Math.random()*localQuotes.length)];
        displayQuote(local.quote, local.author, local.type);
        elements.apiStatus.className = 'status-indicator offline'; elements.apiStatusText.textContent = '使用本地金句';
        if(enableQuoteGuarantee) consecutiveNonExtension++;
        showToast('金句API不可用，已使用本地金句');
    }
    resetQuoteTimer();
}
function resetQuoteTimer() {
    if(quoteAnimationFrame) cancelAnimationFrame(quoteAnimationFrame);
    quoteStartTime = Date.now(); quoteDuration = quoteInterval * 60 * 1000;
    let update = () => {
        let elapsed = Date.now() - quoteStartTime, remaining = quoteDuration - elapsed;
        let progress = Math.min(100, (remaining/quoteDuration)*100);
        elements.quoteProgressBar.style.transform = `scaleX(${progress/100})`;
        elements.quoteProgressBar.style.backgroundColor = remaining < 15000 ? '#e74c3c' : '#2ecc71';
        if(elapsed >= quoteDuration) fetchQuote();
        else quoteAnimationFrame = requestAnimationFrame(update);
    };
    quoteAnimationFrame = requestAnimationFrame(update);
}

// ======================== 背景逻辑 ========================
function applyBackground(url, avoidCache=true, showNotif=false) {
    if(bgLoading) return;
    elements.bgLoader.classList.add('visible'); bgLoading = true;
    let finalUrl = url;
    if(avoidCache && url.startsWith('http')) finalUrl += (url.includes('?')?'&':'?') + `t=${Date.now()}`;
    let img = new Image();
    img.onload = () => {
        inactiveBgLayer.style.backgroundImage = `url('${finalUrl}')`;
        inactiveBgLayer.classList.add('active');
        activeBgLayer.classList.remove('active');
        let tmp = activeBgLayer; activeBgLayer = inactiveBgLayer; inactiveBgLayer = tmp;
        if(bgClearTimeout) clearTimeout(bgClearTimeout);
        bgClearTimeout = setTimeout(() => { inactiveBgLayer.style.backgroundImage = ''; }, 5000);
        setTimeout(() => { elements.bgLoader.classList.remove('visible'); bgLoading = false; }, 300);
        currentBgUrl = finalUrl;
        if(showNotif) showToast('背景图片已成功应用！');
        if(elements.showBgProgressCheckbox.checked && finalUrl && !finalUrl.startsWith('data:') && currentPreset !== 'bing') elements.bgProgress.style.display = 'block';
        else elements.bgProgress.style.display = 'none';
    };
    img.onerror = () => { elements.bgLoader.classList.remove('visible'); bgLoading = false; showToast('背景图片加载失败'); };
    img.src = finalUrl;
}
function applyPresetBackground(preset, avoidCache=false, showNotif=false) {
    currentPreset = preset; customBg = null;
    localStorage.setItem('backgroundPreset', preset); localStorage.removeItem('customBackground');
    if(bgInterval) clearInterval(bgInterval);
    if(preset === 'random') {
        changeRandomBg(avoidCache, showNotif);
        bgInterval = setInterval(() => changeRandomBg(true,false), bgIntervalTime*60*1000);
    } else {
        let url = bgPresets[preset];
        applyBackground(url, avoidCache, showNotif);
        bgInterval = setInterval(() => applyPresetBackground(preset, true, false), bgIntervalTime*60*1000);
    }
    resetBgTimer();
    updatePresetButtons(preset);
}
function changeRandomBg(avoidCache=true, showNotif=false) {
    let idx = Math.floor(Math.random() * bgPresets.random.length);
    applyBackground(bgPresets.random[idx], avoidCache, showNotif);
    resetBgTimer();
}
function updatePresetButtons(active) {
    elements.presetBtns.forEach(btn => { if(btn.dataset.preset === active) btn.classList.add('active'); else btn.classList.remove('active'); });
}
function applyCustomBackground(url, showNotif=true) {
    customBg = url; currentPreset = null;
    localStorage.setItem('customBackground', url); localStorage.removeItem('backgroundPreset');
    updatePresetButtons(null);
    if(bgInterval) clearInterval(bgInterval);
    applyBackground(url, false, showNotif);
    bgInterval = setInterval(() => applyBackground(url, true, false), bgIntervalTime*60*1000);
    resetBgTimer();
}
function resetBgTimer() {
    if(bgAnimationFrame) cancelAnimationFrame(bgAnimationFrame);
    bgStartTime = Date.now(); bgDuration = bgIntervalTime * 60 * 1000;
    let update = () => {
        let elapsed = Date.now() - bgStartTime, remaining = bgDuration - elapsed;
        let progress = Math.min(100, (remaining/bgDuration)*100);
        elements.bgProgressBar.style.transform = `scaleX(${progress/100})`;
        elements.bgProgressBar.style.backgroundColor = remaining < 15000 ? '#e74c3c' : '#2ecc71';
        if(elapsed >= bgDuration) resetBgTimer();
        else bgAnimationFrame = requestAnimationFrame(update);
    };
    bgAnimationFrame = requestAnimationFrame(update);
}

// ======================== 主题、全屏、设置面板等UI ========================
function toggleTheme() {
    currentThemeIndex = (currentThemeIndex+1)%themes.length;
    currentTheme = themes[currentThemeIndex];
    document.body.classList.remove('dark-theme','ocean-theme','forest-theme','sunset-theme','midnight-theme','sakura-theme');
    if(currentTheme !== 'light') document.body.classList.add(`${currentTheme}-theme`);
    localStorage.setItem('theme', currentTheme); localStorage.setItem('themeIndex', currentThemeIndex);
}
function toggleFullscreen() {
    if(!document.fullscreenElement) { document.documentElement.requestFullscreen(); elements.fullscreenBtn.innerHTML = '<i class="fas fa-compress"></i><span class="tooltip">退出全屏</span>'; }
    else { document.exitFullscreen(); elements.fullscreenBtn.innerHTML = '<i class="fas fa-expand"></i><span class="tooltip">全屏显示</span>'; }
}
function toggleSettings() {
    elements.container.classList.toggle('settings-open');
    if(elements.container.classList.contains('settings-open')) {
        document.querySelector('header').style.display = 'none';
        document.querySelector('.main-content').style.display = 'none';
        elements.countdownSidebar.style.display = 'none';
        tempSettings = getCurrentFormSettings();
        elements.refreshBtn.classList.add('hidden');
    } else {
        document.querySelector('header').style.display = 'flex';
        document.querySelector('.main-content').style.display = 'flex';
        elements.countdownSidebar.style.display = 'flex';
        elements.refreshBtn.classList.remove('hidden');
    }
}
function getCurrentFormSettings() {
    return {
        showDate: elements.showDateCheckbox.checked, showSeconds: elements.showSecondsCheckbox.checked,
        showMilliseconds: elements.showMillisecondsCheckbox.checked, showQuoteProgress: elements.showQuoteProgressCheckbox.checked,
        showBgProgress: elements.showBgProgressCheckbox.checked, showGaokao: elements.showGaokaoCheckbox.checked,
        showHolidayImage: elements.showHolidayImageCheckbox.checked,
        quoteTypes: Array.from(document.querySelectorAll('input[name="quoteType"]:checked')).map(cb=>cb.value),
        quoteInterval: parseFloat(elements.quoteIntervalInput.value)||1, bgInterval: parseFloat(elements.bgIntervalInput.value)||30,
        bgUrl: elements.bgUrlInput.value, currentPreset: currentPreset,
        displayPriority: document.querySelector('input[name="displayPriority"]:checked').value,
        enableQuoteGuarantee: enableQuoteGuarantee, ignoredSubjects: ignoredSubjects,
        quoteAnimationType: document.querySelector('input[name="quoteAnimation"]:checked').value,
        collapsedGroups: getCollapsedGroups(), filteredTags: filteredTags
    };
}
function getCollapsedGroups() { let arr=[]; document.querySelectorAll('.setting-group').forEach(g=>{ if(g.classList.contains('collapsed')) arr.push(g.id); }); return arr; }
function applyFormSettings(settings) {
    elements.showDateCheckbox.checked = settings.showDate;
    elements.showSecondsCheckbox.checked = settings.showSeconds;
    elements.showMillisecondsCheckbox.checked = settings.showMilliseconds;
    elements.showGaokaoCheckbox.checked = settings.showGaokao !== undefined ? settings.showGaokao : true;
    elements.showQuoteProgressCheckbox.checked = settings.showQuoteProgress;
    elements.showBgProgressCheckbox.checked = settings.showBgProgress;
    elements.showHolidayImageCheckbox.checked = settings.showHolidayImage !== undefined ? settings.showHolidayImage : true;
    document.querySelectorAll('input[name="quoteType"]').forEach(cb => { cb.checked = settings.quoteTypes.includes(cb.value); });
    elements.quoteIntervalInput.value = settings.quoteInterval;
    elements.bgIntervalInput.value = settings.bgInterval;
    elements.bgUrlInput.value = settings.bgUrl;
    currentPreset = settings.currentPreset; updatePresetButtons(currentPreset);
    enableQuoteGuarantee = settings.enableQuoteGuarantee !== undefined ? settings.enableQuoteGuarantee : true;
    ignoredSubjects = settings.ignoredSubjects || [];
    quoteAnimationType = settings.quoteAnimationType || 'typewriter';
    filteredTags = settings.filteredTags || [];
    document.querySelectorAll('input[name="quoteAnimation"]').forEach(r => { r.checked = (r.value === quoteAnimationType); });
    document.body.classList.remove('quote-priority','time-priority');
    if(settings.displayPriority === 'time') { document.body.classList.add('time-priority'); elements.timePriorityRadio.checked = true; }
    else { document.body.classList.add('quote-priority'); elements.quotePriorityRadio.checked = true; }
    document.querySelectorAll('input[name="ignoredSubject"]').forEach(cb => { cb.checked = !ignoredSubjects.includes(cb.value); });
    updateHolidayImageVisibility();
    if(settings.collapsedGroups) settings.collapsedGroups.forEach(gid => { let g = document.getElementById(gid); if(g) g.classList.add('collapsed'); });
}
function updateHolidayImageVisibility() {
    if(elements.showHolidayImageCheckbox.checked) elements.countdownPanel.classList.remove('hide-holiday-image');
    else elements.countdownPanel.classList.add('hide-holiday-image');
}
function selectAllTypes() { document.querySelectorAll('input[name="quoteType"]').forEach(cb=>cb.checked=true); }
function deselectAllTypes() { document.querySelectorAll('input[name="quoteType"]').forEach(cb=>cb.checked=false); }
function saveSettings() {
    let settings = {
        showDate: elements.showDateCheckbox.checked, showSeconds: elements.showSecondsCheckbox.checked,
        showMilliseconds: elements.showMillisecondsCheckbox.checked, showQuoteProgress: elements.showQuoteProgressCheckbox.checked,
        showBgProgress: elements.showBgProgressCheckbox.checked, showGaokao: elements.showGaokaoCheckbox.checked,
        showHolidayImage: elements.showHolidayImageCheckbox.checked,
        quoteTypes: Array.from(document.querySelectorAll('input[name="quoteType"]:checked')).map(cb=>cb.value),
        theme: currentTheme, themeIndex: currentThemeIndex,
        quoteInterval: quoteInterval, bgInterval: bgIntervalTime,
        displayPriority: document.querySelector('input[name="displayPriority"]:checked').value,
        enableQuoteGuarantee: enableQuoteGuarantee, ignoredSubjects: ignoredSubjects,
        quoteAnimationType: document.querySelector('input[name="quoteAnimation"]:checked').value,
        filteredTags: filteredTags, collapsedGroups: getCollapsedGroups()
    };
    localStorage.setItem('appSettings', JSON.stringify(settings));
}
function loadSettings() {
    let saved = localStorage.getItem('appSettings');
    if(saved) {
        let s = JSON.parse(saved);
        elements.showDateCheckbox.checked = s.showDate;
        elements.showSecondsCheckbox.checked = s.showSeconds;
        elements.showMillisecondsCheckbox.checked = s.showMilliseconds;
        elements.showGaokaoCheckbox.checked = s.showGaokao !== undefined ? s.showGaokao : true;
        elements.showQuoteProgressCheckbox.checked = s.showQuoteProgress || true;
        elements.showBgProgressCheckbox.checked = s.showBgProgress || true;
        elements.showHolidayImageCheckbox.checked = s.showHolidayImage !== undefined ? s.showHolidayImage : true;
        document.querySelector('.quote-progress-container').style.display = elements.showQuoteProgressCheckbox.checked ? 'block' : 'none';
        elements.bgProgress.style.display = elements.showBgProgressCheckbox.checked ? 'block' : 'none';
        document.querySelectorAll('input[name="quoteType"]').forEach(cb => { cb.checked = s.quoteTypes.includes(cb.value); });
        quoteTypes = s.quoteTypes.length ? s.quoteTypes : ['k'];
        if(s.quoteTypes.length===0) elements.container.classList.add('quote-hidden');
        else elements.container.classList.remove('quote-hidden');
        currentTheme = s.theme || 'light'; currentThemeIndex = s.themeIndex || 0;
        document.body.classList.remove('dark-theme','ocean-theme','forest-theme','sunset-theme','midnight-theme','sakura-theme');
        if(currentTheme !== 'light') document.body.classList.add(`${currentTheme}-theme`);
        quoteAnimationType = s.quoteAnimationType || 'typewriter';
        document.querySelectorAll('input[name="quoteAnimation"]').forEach(r => { r.checked = (r.value === quoteAnimationType); });
        document.body.classList.remove('quote-priority','time-priority');
        if(s.displayPriority === 'time') { document.body.classList.add('time-priority'); elements.timePriorityRadio.checked = true; }
        else { document.body.classList.add('quote-priority'); elements.quotePriorityRadio.checked = true; }
        if(s.quoteInterval) { quoteInterval = s.quoteInterval; elements.quoteIntervalInput.value = quoteInterval; }
        if(s.bgInterval) { bgIntervalTime = s.bgInterval; elements.bgIntervalInput.value = bgIntervalTime; }
        enableQuoteGuarantee = s.enableQuoteGuarantee !== undefined ? s.enableQuoteGuarantee : true;
        ignoredSubjects = s.ignoredSubjects || [];
        filteredTags = s.filteredTags || [];
        document.querySelectorAll('input[name="ignoredSubject"]').forEach(cb => { cb.checked = !ignoredSubjects.includes(cb.value); });
        updateHolidayImageVisibility();
        if(s.collapsedGroups) s.collapsedGroups.forEach(gid => { let g = document.getElementById(gid); if(g) g.classList.add('collapsed'); });
    } else {
        elements.showDateCheckbox.checked = true; elements.showSecondsCheckbox.checked = true;
        elements.showMillisecondsCheckbox.checked = false; elements.showGaokaoCheckbox.checked = true;
        elements.showQuoteProgressCheckbox.checked = true; elements.showBgProgressCheckbox.checked = true;
        elements.showHolidayImageCheckbox.checked = true;
        selectAllTypes(); quoteTypes = Array.from(document.querySelectorAll('input[name="quoteType"]')).map(cb=>cb.value);
        elements.quoteIntervalInput.value = 1; elements.bgIntervalInput.value = 30;
        elements.quotePriorityRadio.checked = true; document.body.classList.add('quote-priority');
        enableQuoteGuarantee = true; ignoredSubjects = []; elements.typewriterAnimationRadio.checked = true;
        saveSettings();
    }
    document.querySelector('.quote-progress-container').style.display = elements.showQuoteProgressCheckbox.checked ? 'block' : 'none';
    elements.bgProgress.style.display = elements.showBgProgressCheckbox.checked ? 'block' : 'none';
    let savedPreset = localStorage.getItem('backgroundPreset'), savedCustom = localStorage.getItem('customBackground');
    if(savedCustom) { applyCustomBackground(savedCustom, false); elements.bgUrlInput.value = savedCustom; }
    else if(savedPreset) { applyPresetBackground(savedPreset, false, false); elements.bgUrlInput.value = ''; }
    else { applyPresetBackground('weimei', false, false); }
    updateCountdownDisplay();
}
function resetToDefault() {
    if(confirm('确定要重置所有设置吗？此操作不可撤销！')) {
        localStorage.removeItem('appSettings'); localStorage.removeItem('backgroundPreset'); localStorage.removeItem('customBackground');
        localStorage.removeItem('extensionQuotes'); localStorage.removeItem('countdowns'); localStorage.removeItem('filteredTags');
        loadSettings(); initCountdowns(); fetchQuote(); showToast('设置已重置为默认值！');
    }
}
async function downloadExtensionQuotes(silent=false) {
    try {
        elements.extStatus.className = 'status-indicator pulse'; elements.extStatusText.textContent = '下载中...';
        let res = await fetch('/.netlify/functions/jinju');
        if(!res.ok) throw new Error();
        let data = await res.json();
        if(data.success && data.contents) {
            let json = JSON.parse(data.contents);
            if(Array.isArray(json) && json.length) {
                extensionQuotes = json; localStorage.setItem('extensionQuotes', JSON.stringify(json));
                localStorage.setItem('extensionQuotesLastUpdate', Date.now());
                if(!silent) showToast('扩展金句已更新');
                updateExtensionStatus(); downloadRetryCount = 0; extractTags();
            } else throw new Error();
        } else throw new Error();
    } catch(e) {
        if(downloadRetryCount < maxRetries) { downloadRetryCount++; setTimeout(()=>downloadExtensionQuotes(silent), Math.min(3000, downloadRetryCount*500)); if(!silent) showToast(`下载失败，正在重试 (${downloadRetryCount}/${maxRetries})`); }
        else { extensionQuotes = sampleExtensionQuotes; localStorage.setItem('extensionQuotes', JSON.stringify(sampleExtensionQuotes)); if(!silent) showToast('使用本地扩展金句'); updateExtensionStatus(); downloadRetryCount=0; extractTags(); }
    }
}
function initExtensionQuotes() {
    let saved = localStorage.getItem('extensionQuotes'), savedTags = localStorage.getItem('filteredTags');
    if(saved) try { extensionQuotes = JSON.parse(saved); } catch(e){ extensionQuotes = sampleExtensionQuotes; localStorage.setItem('extensionQuotes',JSON.stringify(sampleExtensionQuotes)); }
    else extensionQuotes = sampleExtensionQuotes;
    if(savedTags) try { filteredTags = JSON.parse(savedTags); } catch(e){ filteredTags = []; }
    updateExtensionStatus(); extractTags();
    let last = localStorage.getItem('extensionQuotesLastUpdate');
    if(elements.extensionTypeCheckbox.checked && (!last || Date.now()-last > 86400000)) downloadExtensionQuotes(true);
}
async function enableNoSleep() {
    try { if('wakeLock' in navigator) { wakeLock = await navigator.wakeLock.request('screen'); wakeLock.addEventListener('release',()=>console.log('Wake Lock released')); }
    else { await elements.noSleepVideo.play(); } } catch(e) { console.error('防休眠失败',e); }
}

// ======================== 设置导入导出 ========================
function exportSettings() {
    const exportData = {
        version: '1.0',
        exportTime: new Date().toISOString(),
        settings: null,
        countdowns: null,
        extensionQuotes: null,
        filteredTags: null
    };
    
    // 导出所有设置
    const savedSettings = localStorage.getItem('appSettings');
    if (savedSettings) {
        try { exportData.settings = JSON.parse(savedSettings); } catch(e) {}
    }
    
    // 导出倒数日
    const savedCountdowns = localStorage.getItem('countdowns');
    if (savedCountdowns) {
        try { exportData.countdowns = JSON.parse(savedCountdowns); } catch(e) {}
    }
    
    // 导出拓展金句
    const savedExtensionQuotes = localStorage.getItem('extensionQuotes');
    if (savedExtensionQuotes) {
        try { exportData.extensionQuotes = JSON.parse(savedExtensionQuotes); } catch(e) {}
    }
    
    // 导出标签过滤
    const savedFilteredTags = localStorage.getItem('filteredTags');
    if (savedFilteredTags) {
        try { exportData.filteredTags = JSON.parse(savedFilteredTags); } catch(e) {}
    }
    
    // 创建下载
    const dataStr = JSON.stringify(exportData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `青春时光设置备份_${new Date().toLocaleDateString('zh-CN').replace(/\//g, '-')}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showToast('设置已导出！');
}

function importSettings(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const importData = JSON.parse(e.target.result);
            
            // 验证版本
            if (!importData.version) {
                showToast('无效的备份文件！');
                return;
            }
            
            // 确认导入
            if (!confirm('导入设置将覆盖当前所有设置，是否继续？')) {
                return;
            }
            
            // 导入设置
            if (importData.settings) {
                localStorage.setItem('appSettings', JSON.stringify(importData.settings));
            }
            
            // 导入倒数日
            if (importData.countdowns) {
                localStorage.setItem('countdowns', JSON.stringify(importData.countdowns));
                countdowns = importData.countdowns;
            }
            
            // 导入拓展金句
            if (importData.extensionQuotes) {
                localStorage.setItem('extensionQuotes', JSON.stringify(importData.extensionQuotes));
                extensionQuotes = importData.extensionQuotes;
                extractTags();
            }
            
            // 导入标签过滤
            if (importData.filteredTags) {
                localStorage.setItem('filteredTags', JSON.stringify(importData.filteredTags));
                filteredTags = importData.filteredTags;
                renderTagFilters();
            }
            
            // 重新加载所有设置
            loadSettings();
            initCountdowns();
            renderCountdownsList();
            updateCountdownDisplay();
            updateExtensionStatus();
            
            showToast('设置导入成功！');
        } catch (err) {
            console.error('导入失败:', err);
            showToast('导入失败：文件格式错误！');
        }
    };
    reader.onerror = function() {
        showToast('读取文件失败！');
    };
    reader.readAsText(file);
}

// ======================== 初始化 & 事件绑定 ========================
function init() {
    fetchBeijingTime(); setInterval(fetchBeijingTime, 5*60*1000);
    loadSettings(); animationFrameId = requestAnimationFrame(updateTime);
    fetchQuote(); initExtensionQuotes(); initCountdowns(); enableNoSleep();
    document.querySelectorAll('.setting-group').forEach(group => {
        let header = group.querySelector('.setting-group-header');
        header.addEventListener('click', () => { group.classList.toggle('collapsed'); saveSettings(); });
    });
    elements.extensionTypeCheckbox.addEventListener('change', () => {
        if(elements.extensionTypeCheckbox.checked) { if(!localStorage.getItem('extensionQuotes')) downloadExtensionQuotes(); else updateExtensionStatus(); }
        else { localStorage.removeItem('extensionQuotes'); updateExtensionStatus(); }
        saveSettings();
    });
    elements.quotePriorityRadio.addEventListener('change', () => { if(elements.quotePriorityRadio.checked) { document.body.classList.remove('time-priority'); document.body.classList.add('quote-priority'); } saveSettings(); });
    elements.timePriorityRadio.addEventListener('change', () => { if(elements.timePriorityRadio.checked) { document.body.classList.remove('quote-priority'); document.body.classList.add('time-priority'); } saveSettings(); });
    document.querySelectorAll('input[name="ignoredSubject"]').forEach(cb => {
        cb.addEventListener('change', () => { let sub = cb.value; if(cb.checked) ignoredSubjects = ignoredSubjects.filter(s=>s!==sub); else if(!ignoredSubjects.includes(sub)) ignoredSubjects.push(sub); saveSettings(); updateNextExam(); });
    });
    elements.showGaokaoCheckbox.addEventListener('change', () => { saveSettings(); updateCountdownDisplay(); });
    elements.showHolidayImageCheckbox.addEventListener('change', () => { updateHolidayImageVisibility(); saveSettings(); });
    elements.toggleGuaranteeBtn.addEventListener('click', () => { enableQuoteGuarantee = !enableQuoteGuarantee; elements.toggleGuaranteeBtn.innerHTML = enableQuoteGuarantee ? '<i class="fas fa-shield-alt"></i> 保底机制: 开' : '<i class="fas fa-shield-alt"></i> 保底机制: 关'; showToast(`金句保底机制已${enableQuoteGuarantee?'开启':'关闭'}`); saveSettings(); });
    elements.aboutBtn.addEventListener('click', () => window.open('https://zise-blog.netlify.app/2025/07/27/time/', '_blank'));
    elements.refreshBtn.addEventListener('click', fetchQuote);
    elements.themeBtn.addEventListener('click', toggleTheme);
    elements.settingsBtn.addEventListener('click', toggleSettings);
    elements.fullscreenBtn.addEventListener('click', toggleFullscreen);
    elements.selectAllBtn.addEventListener('click', selectAllTypes);
    elements.deselectAllBtn.addEventListener('click', deselectAllTypes);
    elements.resetBtn.addEventListener('click', resetToDefault);
    elements.downloadExtBtn.addEventListener('click', () => downloadExtensionQuotes());
    elements.addCountdownBtn.addEventListener('click', addCountdown);
    elements.cancelSettingsBtn.addEventListener('click', () => { if(tempSettings) applyFormSettings(tempSettings); toggleSettings(); showToast('设置已恢复'); });
    elements.saveSettingsBtn.addEventListener('click', () => {
        quoteInterval = Math.max(0.5, parseFloat(elements.quoteIntervalInput.value) || 1);
        bgIntervalTime = Math.max(0.5, parseFloat(elements.bgIntervalInput.value) || 30);
        let selected = Array.from(document.querySelectorAll('input[name="quoteType"]:checked')).map(cb=>cb.value);
        if(selected.length) quoteTypes = selected;
        else { quoteTypes = ['k']; elements.container.classList.add('quote-hidden'); }
        quoteAnimationType = document.querySelector('input[name="quoteAnimation"]:checked').value;
        if(!elements.extensionTypeCheckbox.checked) localStorage.removeItem('extensionQuotes');
        resetQuoteTimer(); resetBgTimer();
        document.querySelector('.quote-progress-container').style.display = elements.showQuoteProgressCheckbox.checked ? 'block' : 'none';
        elements.bgProgress.style.display = elements.showBgProgressCheckbox.checked ? 'block' : 'none';
        saveSettings(); toggleSettings(); showToast('设置已保存');
    });
    elements.presetBtns.forEach(btn => {
        btn.addEventListener('click', () => { let p = btn.dataset.preset; currentPreset = p; customBg = null; updatePresetButtons(p); applyPresetBackground(p, true, true); });
    });
    elements.refreshQuoteBtn.addEventListener('click', () => { fetchQuote(); showToast('金句已成功更换！'); });
    elements.refreshBgBtn.addEventListener('click', () => { if(currentPreset === 'random') changeRandomBg(true,true); else if(currentPreset) applyPresetBackground(currentPreset, true, true); else if(customBg) applyBackground(customBg, true, true); });
    elements.saveBgBtn.addEventListener('click', () => { let url = elements.bgUrlInput.value.trim(); if(url) applyCustomBackground(url, true); });
    elements.bgLocalBtn.addEventListener('click', () => {
        let inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*';
        inp.onchange = (e) => { let file = e.target.files[0]; if(file) { let reader = new FileReader(); reader.onload = (ev) => { let dataUrl = ev.target.result; elements.bgUrlInput.value = dataUrl; applyCustomBackground(dataUrl, true); }; reader.readAsDataURL(file); } };
        inp.click();
    });
    elements.showQuoteProgressCheckbox.addEventListener('change', () => { document.querySelector('.quote-progress-container').style.display = elements.showQuoteProgressCheckbox.checked ? 'block' : 'none'; saveSettings(); });
    elements.showBgProgressCheckbox.addEventListener('change', () => { elements.bgProgress.style.display = elements.showBgProgressCheckbox.checked ? 'block' : 'none'; saveSettings(); });
    
    // 导入导出事件绑定
    elements.exportSettingsBtn.addEventListener('click', exportSettings);
    elements.importSettingsBtn.addEventListener('click', () => elements.importFileInput.click());
    elements.importFileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            importSettings(e.target.files[0]);
            e.target.value = ''; // 重置input，允许重复导入同一文件
        }
    });
}
window.addEventListener('DOMContentLoaded', init);
