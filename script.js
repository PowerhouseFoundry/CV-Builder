const STORAGE_KEY = 'powerhouseCvBuilderV14';
const CV_STORE_KEY = 'powerhouseCvSavedRecordsV14';
const FIREBASE_COLLECTION = 'cvRecords';
const TEACHER_PIN = '3267';

const state = {
  template: 'classic',
  selectedTarget: 'statement',
  data: {
    fullName: '', jobGoal: '', phone: '', email: '', location: '', link: '',
    statement: '', skills: '', educationPlace: '', course: '', english: '', maths: '', training: '', interests: ''
  },
  experience: [blankExperience()],
  education: [blankEducation()],
  design: {
    theme: 'navy', font: 'aptos', fontSize: 11.2, spacing: 'normal', photo: '', photoStyle: 'none', blocks: []
  }
};

const templateNames = { classic:'Classic', modern:'Modern', simple:'Simple', skills:'Skills First', executive:'Executive', profile:'Profile Card' };
const themes = {
  navy: { name:'Professional Navy', accent:'#2457d6', text:'#172033', soft:'#eaf1ff' },
  charcoal: { name:'Charcoal', accent:'#3b4658', text:'#151a22', soft:'#edf0f4' },
  teal: { name:'Deep Teal', accent:'#087a83', text:'#173238', soft:'#e8f8f9' },
  green: { name:'Forest Green', accent:'#157f5b', text:'#17261f', soft:'#eaf7f1' },
  burgundy: { name:'Burgundy', accent:'#8d2444', text:'#231822', soft:'#f8eaf0' },
  slate: { name:'Slate Blue', accent:'#4e5fb8', text:'#202641', soft:'#edf0ff' },
  mono: { name:'Black and White', accent:'#111827', text:'#111827', soft:'#f3f4f6' },
  warm: { name:'Warm Grey', accent:'#78614d', text:'#25201c', soft:'#f4eee8' }
};
const fonts = { aptos:'Aptos', arial:'Arial', calibri:'Calibri', georgia:'Georgia', trebuchet:'Trebuchet MS' };
const fontSizes = [8,9,10,11,12,14,16,18,20,22,24,26,28,36,48,72];
const blockNames = { achievement:'Achievement box', availability:'Availability table', certTable:'Certificate table', qualities:'Personal qualities' };

const industries = {
  Hospitality: {
    statement: ['I am a reliable and friendly person who enjoys helping customers and working as part of a team.','I can stay calm in busy environments and take pride in completing tasks to a high standard.','I have experience following hygiene rules, keeping areas tidy and supporting good customer service.'],
    skills: ['Friendly customer service','Keeping work areas clean and tidy','Following hygiene rules','Working well during busy times'],
    training: ['Food hygiene awareness','Customer service training','Workplace health and safety']
  },
  Retail: {
    statement: ['I am a polite and reliable person who enjoys helping customers and keeping work areas organised.','I am interested in retail work because I enjoy speaking to people and completing practical tasks.','I can follow instructions carefully and understand the importance of good timekeeping.'],
    skills: ['Helping customers politely','Keeping displays tidy','Checking stock carefully','Good timekeeping'],
    training: ['Customer service training','Till practice','Workplace safety awareness']
  },
  'Office/Admin': {
    statement: ['I am an organised and focused person who enjoys using computers and completing tasks carefully.','I can record information accurately, follow instructions and stay focused on a task.','I am interested in office work because I enjoy helping with information, messages and organisation.'],
    skills: ['Using computers confidently','Recording information accurately','Sorting emails or documents','Clear communication'],
    training: ['Basic office administration','Computer skills','Data handling practice']
  },
  Care: {
    statement: ['I am a caring, patient and respectful person who enjoys helping others.','I understand the importance of listening carefully, following instructions and treating people with respect.','I would like to build my skills in a role where I can support people and make a positive difference.'],
    skills: ['Listening carefully','Showing patience and respect','Following safety instructions','Helping others appropriately'],
    training: ['Safeguarding awareness','Health and safety awareness','Communication skills']
  },
  'Animal Care': {
    statement: ['I am a calm and responsible person who enjoys caring for animals and completing practical tasks.','I can follow instructions carefully and understand the importance of keeping animals safe and comfortable.','I am interested in animal care because I enjoy practical work and taking responsibility.'],
    skills: ['Following care instructions','Keeping areas clean','Working calmly around animals','Being responsible and patient'],
    training: ['Animal care experience','Health and safety awareness','Practical workplace skills']
  },
  Cleaning: {
    statement: ['I am a hard-working and reliable person who takes pride in keeping spaces clean and organised.','I can follow cleaning instructions, work safely and complete tasks to a good standard.','I understand the importance of being punctual, focused and thorough at work.'],
    skills: ['Cleaning surfaces thoroughly','Following instructions','Using equipment safely','Working independently'],
    training: ['COSHH awareness','Workplace health and safety','Cleaning routines practice']
  },
  'Practical Work': {
    statement: ['I am a practical and reliable person who enjoys hands-on tasks and learning new skills.','I can follow instructions, work safely and complete tasks carefully.','I enjoy practical work because I like keeping busy and seeing a task through to the end.'],
    skills: ['Following instructions safely','Completing practical tasks','Good teamwork','Staying focused'],
    training: ['Manual handling awareness','Workplace health and safety','Practical employability skills']
  },
  'Customer Service': {
    statement: ['I am a friendly and helpful person who enjoys supporting customers and making people feel welcome.','I can listen carefully, speak politely and ask for help when needed.','I understand that good customer service means being calm, respectful and professional.'],
    skills: ['Speaking politely to customers','Listening carefully','Staying calm and professional','Asking for help appropriately'],
    training: ['Customer service training','Communication skills','Workplace behaviour training']
  }
};

function blankExperience(){ return { place:'', role:'', dates:'', bullets:'' }; }
function blankQualification(){ return { course:'', qualification:'', dates:'' }; }
function blankEducation(){ return { provider:'', dates:'', qualifications:[blankQualification()] }; }
function q(sel){ return document.querySelector(sel); }
function qa(sel){ return [...document.querySelectorAll(sel)]; }
function esc(str=''){ return String(str).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m])); }
function lines(str=''){ return String(str).split('\n').map(s=>s.trim()).filter(Boolean); }

let savedSelection = null;
let activeIndustry = 'Hospitality';
let activeStarterType = 'statement';

function init(){
  renderIndustries(); renderExperience(); renderEducation(); renderEditorOptions(); bindEvents(); initSaveSystem(); loadSaved(true); updatePreview();
}

function bindEvents(){
  q('#startBtn').addEventListener('click', showBuilder);
  q('#continueBtn').addEventListener('click', () => openSaveLoadModal('load'));
  q('#teacherAdminBtn').addEventListener('click', openTeacherModal);
  q('#teacherAdminHomeBtn').addEventListener('click', openTeacherModal);
  q('#saveBtn').addEventListener('click', () => openSaveLoadModal('save'));
  q('#downloadBtn').addEventListener('click', downloadPdf);
  q('#editorSaveBtn').addEventListener('click', () => openSaveLoadModal('save'));
  q('#editorDownloadBtn').addEventListener('click', downloadPdfFromEditor);
  q('#clearBtn').addEventListener('click', clearForm);
  q('#openEditorBtn').addEventListener('click', openEditor);
  q('#openEditorTopBtn').addEventListener('click', () => { showBuilder(); openEditor(); });
  q('#backToBuilderBtn').addEventListener('click', closeEditor);
  q('#addExperience').addEventListener('click', () => { state.experience.push(blankExperience()); renderExperience(); updatePreview(); });
  q('#addEducation').addEventListener('click', () => { state.education.push(blankEducation()); renderEducation(); updatePreview(); });
  qa('[data-field]').forEach(el => el.addEventListener('input', onInput));
  qa('[data-target]').forEach(btn => btn.addEventListener('click', () => selectTarget(btn.dataset.target)));
  qa('.template-card').forEach(btn => btn.addEventListener('click', () => { state.template = btn.dataset.template; syncControls(); updatePreview(); }));
  ['editorTemplate','themeSelect','fontSelect','spacingSelect','photoStyleSelect'].forEach(id => q('#'+id).addEventListener('change', onDesignChange));
  const fontSizeSelect = q('#fontSizeSelect');
  ['mousedown','pointerdown','focus','click'].forEach(evt => fontSizeSelect.addEventListener(evt, saveEditorSelection));
  fontSizeSelect.addEventListener('change', applySelectedFontSize);
  q('#photoInput').addEventListener('change', onPhotoUpload);
  q('#removePhotoBtn').addEventListener('click', () => { state.design.photo = ''; state.design.photoStyle = 'none'; syncControls(); updatePreview(); });
  qa('[data-block]').forEach(btn => btn.addEventListener('click', () => toggleBlock(btn.dataset.block)));
  qa('[data-command]').forEach(btn => btn.addEventListener('click', () => runFormatCommand(btn.dataset.command)));
  qa('[data-insert]').forEach(btn => btn.addEventListener('click', () => insertFormattedItem(btn.dataset.insert)));
  qa('[data-command], [data-insert]').forEach(btn => btn.addEventListener('mousedown', e => e.preventDefault()));
  q('#editorPreview').addEventListener('input', syncFromEditableCv);
  ['mouseup','keyup','touchend'].forEach(evt => q('#editorPreview').addEventListener(evt, saveEditorSelection));
  document.addEventListener('selectionchange', () => { if(selectionInsideEditor()) saveEditorSelection(); });
}

function showBuilder(){ q('#homePanel').classList.add('hidden'); q('#builderPanel').classList.remove('hidden'); }
function openEditor(){ updatePreview(); q('#editorModal').classList.remove('hidden'); q('#editorPreview').focus(); }
function closeEditor(){ q('#editorModal').classList.add('hidden'); updateFormFields(); updatePreview(); }
function selectTarget(target){
  state.selectedTarget = target;
  qa('[data-target]').forEach(b => b.classList.toggle('active', b.dataset.target === target));
  if(['statement','skills','training'].includes(target)){
    activeStarterType = target;
    syncStarterTabs();
    renderStarters(activeIndustry);
  }
  q(`[data-field="${target}"]`)?.focus();
}
function onInput(e){ state.data[e.target.dataset.field] = e.target.value; updatePreview(); }

function renderEditorOptions(){
  q('#editorTemplate').innerHTML = Object.entries(templateNames).map(([v,n]) => `<option value="${v}">${n}</option>`).join('');
  q('#themeSelect').innerHTML = Object.entries(themes).map(([v,t]) => `<option value="${v}">${t.name}</option>`).join('');
  q('#fontSelect').innerHTML = Object.entries(fonts).map(([v,n]) => `<option value="${v}">${n}</option>`).join('');
  q('#fontSizeSelect').innerHTML = fontSizes.map(size => `<option value="${size}">${size}</option>`).join('');
  syncControls();
}

function syncControls(){
  qa('.template-card').forEach(b => b.classList.toggle('active', b.dataset.template === state.template));
  q('#editorTemplate').value = state.template;
  q('#themeSelect').value = state.design.theme;
  q('#fontSelect').value = state.design.font;
  q('#fontSizeSelect').value = '11';
  q('#spacingSelect').value = state.design.spacing;
  q('#photoStyleSelect').value = state.design.photoStyle;
  renderActiveBlocks();
}

function onDesignChange(e){
  if(e.target.id === 'editorTemplate') state.template = e.target.value;
  if(e.target.id === 'themeSelect') state.design.theme = e.target.value;
  if(e.target.id === 'fontSelect') state.design.font = e.target.value;
  if(e.target.id === 'spacingSelect') state.design.spacing = e.target.value;
  if(e.target.id === 'photoStyleSelect') state.design.photoStyle = e.target.value;
  if(state.design.photo && state.design.photoStyle === 'none') state.design.photoStyle = 'circle';
  syncControls(); updatePreview();
}

function onPhotoUpload(e){
  const file = e.target.files && e.target.files[0]; if(!file) return;
  const reader = new FileReader();
  reader.onload = () => { state.design.photo = reader.result; if(state.design.photoStyle === 'none') state.design.photoStyle = 'circle'; syncControls(); updatePreview(); };
  reader.readAsDataURL(file);
}

function clampFontSize(value){
  const num = Number(value);
  if(Number.isNaN(num)) return 11.2;
  return Math.min(72, Math.max(8, num));
}

function saveEditorSelection(){
  const editor = q('#editorPreview');
  const sel = window.getSelection();
  if(!editor || !sel || sel.rangeCount === 0) return;
  const range = sel.getRangeAt(0);
  if(editor.contains(range.commonAncestorContainer) && !range.collapsed){
    savedSelection = range.cloneRange();
  }
}
function restoreEditorSelection(){
  const editor = q('#editorPreview');
  if(!editor || !savedSelection) return false;
  try{
    if(!editor.contains(savedSelection.commonAncestorContainer)) return false;
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(savedSelection);
    return true;
  }catch(err){
    return false;
  }
}
function selectionInsideEditor(){
  const editor = q('#editorPreview');
  const sel = window.getSelection();
  if(!editor || !sel || sel.rangeCount === 0) return false;
  return editor.contains(sel.getRangeAt(0).commonAncestorContainer);
}
function normaliseEditorFontTags(pt){
  const editor = q('#editorPreview');
  if(!editor) return;
  editor.querySelectorAll('font[size="7"]').forEach(font => {
    const span = document.createElement('span');
    span.className = 'manual-font-size';
    span.style.fontSize = pt + 'pt';
    while(font.firstChild) span.appendChild(font.firstChild);
    font.replaceWith(span);
  });
}
function applySelectedFontSize(){
  const select = q('#fontSizeSelect');
  const pt = clampFontSize(select.value);
  const editor = q('#editorPreview');
  if(!editor) return;

  const restored = restoreEditorSelection();
  editor.focus({preventScroll:true});

  const sel = window.getSelection();
  if(!restored || !selectionInsideEditor() || !sel || sel.rangeCount === 0 || sel.isCollapsed){
    q('#fontSizeHelp').textContent = 'Highlight text on the CV first, then choose a size.';
    return;
  }

  try{
    document.execCommand('fontSize', false, '7');
    normaliseEditorFontTags(pt);
    q('#fontSizeHelp').textContent = 'Selected text changed to ' + pt + 'pt.';
    saveEditorSelection();
  }catch(err){
    console.warn('Font size change failed', err);
    q('#fontSizeHelp').textContent = 'Could not resize that selection. Try highlighting a smaller piece of text.';
  }
}

function runFormatCommand(command){
  const editor = q('#editorPreview');
  if(!editor) return;
  restoreEditorSelection();
  editor.focus({preventScroll:true});
  document.execCommand(command, false, null);
  saveEditorSelection();
}

function insertFormattedItem(kind){
  const editor = q('#editorPreview');
  if(!editor) return;
  let html = '';
  if(kind === 'title') html = '<h2 class="cv-custom-title">New Section Title</h2>';
  if(kind === 'subtitle') html = '<p class="cv-custom-subtitle">Professional subtitle or short note</p>';
  if(kind === 'table') html = '<section class="cv-section"><h2>New Table</h2><table class="cv-table"><tr><th>Item</th><th>Details</th></tr><tr><td>Add item</td><td>Add details</td></tr><tr><td>Add item</td><td>Add details</td></tr></table></section>';
  restoreEditorSelection();
  editor.focus({preventScroll:true});
  if(html) document.execCommand('insertHTML', false, html);
  saveEditorSelection();
}

function toggleBlock(block){
  const i = state.design.blocks.indexOf(block);
  if(i >= 0) state.design.blocks.splice(i,1); else state.design.blocks.push(block);
  renderActiveBlocks(); updatePreview();
}
function renderActiveBlocks(){
  const wrap = q('#activeBlocks'); if(!wrap) return;
  wrap.innerHTML = state.design.blocks.length ? state.design.blocks.map(b => `<button type="button" data-remove-block="${b}">${blockNames[b]} <span>Remove</span></button>`).join('') : '<p class="help-text">No extra blocks added yet.</p>';
  wrap.querySelectorAll('[data-remove-block]').forEach(btn => btn.addEventListener('click', () => toggleBlock(btn.dataset.removeBlock)));
}

function starterLabel(type){
  if(type === 'statement') return 'Personal statement';
  if(type === 'skills') return 'Skill';
  return 'Training';
}
function syncStarterTabs(){
  qa('[data-starter-type]').forEach(btn => btn.classList.toggle('active', btn.dataset.starterType === activeStarterType));
}
function renderIndustries(){
  const select = q('#industrySelect');
  if(!select) return;
  select.innerHTML = Object.keys(industries).map(name => `<option value="${esc(name)}">${esc(name)}</option>`).join('');
  select.value = activeIndustry;
  select.addEventListener('change', () => {
    activeIndustry = select.value;
    renderStarters(activeIndustry);
  });
  qa('[data-starter-type]').forEach(btn => btn.addEventListener('click', () => {
    activeStarterType = btn.dataset.starterType;
    syncStarterTabs();
    renderStarters(activeIndustry);
  }));
  syncStarterTabs();
  renderStarters(activeIndustry);
}
function renderStarters(industry = activeIndustry){
  const pack = industries[industry] || industries[Object.keys(industries)[0]];
  const list = pack?.[activeStarterType] || [];
  const target = activeStarterType;
  const intro = target === 'statement'
    ? 'Use these to build a strong opening paragraph.'
    : target === 'skills'
      ? 'Click one to add it as a new skill line.'
      : 'Click one to add training or certificate wording.';
  q('#starterBox').innerHTML = `
    <div class="starter-box-header">
      <strong>${esc(industry)} - ${starterLabel(target)}</strong>
      <span>${intro}</span>
    </div>
    ${list.map(text => `<button type="button" data-insert-target="${target}" data-text="${esc(text)}">${esc(text)}</button>`).join('')}
  `;
  q('#starterBox').querySelectorAll('button').forEach(btn => btn.addEventListener('click', () => insertStarter(btn.dataset.insertTarget, btn.dataset.text)));
}
function insertStarter(target, text){
  const el = q(`[data-field="${target}"]`); if(!el) return;
  const current = el.value.trim(); const addAsLine = target !== 'statement';
  el.value = current ? current + (addAsLine ? '\n' : ' ') + text : text;
  state.data[target] = el.value; selectTarget(target); updatePreview();
}

function renderExperience(){
  q('#experienceList').innerHTML = state.experience.map((exp, index) => `
    <div class="experience-entry" data-exp-index="${index}">
      <div class="experience-header"><strong>Experience ${index + 1}</strong>${state.experience.length > 1 ? `<button class="remove-btn" type="button" data-remove-exp="${index}">Remove</button>` : ''}</div>
      <div class="field-grid two">
        <label>Workplace<input data-exp-field="place" value="${esc(exp.place)}" placeholder="e.g. The Foundry Restaurant"></label>
        <label>Role<input data-exp-field="role" value="${esc(exp.role)}" placeholder="e.g. Work Placement Assistant"></label>
        <label>Dates<input data-exp-field="dates" value="${esc(exp.dates)}" placeholder="e.g. Sept 2025 - March 2026"></label>
      </div>
      <label style="margin-top:14px">What did you do?<textarea data-exp-field="bullets" rows="4" placeholder="Add one responsibility per line. Example: Greeted customers politely">${esc(exp.bullets)}</textarea></label>
    </div>`).join('');
  q('#experienceList').querySelectorAll('[data-exp-field]').forEach(el => el.addEventListener('input', e => { const entry = e.target.closest('[data-exp-index]'); state.experience[Number(entry.dataset.expIndex)][e.target.dataset.expField] = e.target.value; updatePreview(); }));
  q('#experienceList').querySelectorAll('[data-remove-exp]').forEach(btn => btn.addEventListener('click', () => { state.experience.splice(Number(btn.dataset.removeExp), 1); renderExperience(); updatePreview(); }));
}

function renderEducation(){
  const list = q('#educationList');
  if(!list) return;
  normaliseEducationStructure();
  list.innerHTML = state.education.map((edu, providerIndex) => {
    const quals = (edu.qualifications && edu.qualifications.length) ? edu.qualifications : [blankQualification()];
    return `
    <div class="experience-entry education-entry" data-edu-index="${providerIndex}">
      <div class="experience-header">
        <strong>Provider ${providerIndex + 1}</strong>
        ${state.education.length > 1 ? `<button class="remove-btn" type="button" data-remove-edu="${providerIndex}">Remove provider</button>` : ''}
      </div>
      <div class="field-grid two">
        <label>Provider / place<input data-edu-field="provider" value="${esc(edu.provider)}" placeholder="e.g. West SILC Powerhouse, college, training provider"></label>
        <label>Dates / years at provider<input data-edu-field="dates" value="${esc(edu.dates)}" placeholder="e.g. 2024 - 2026"></label>
      </div>
      <div class="qualification-list">
        <div class="qualification-heading">
          <strong>Qualifications for this provider</strong>
          <button class="add-btn mini-add" type="button" data-add-qual="${providerIndex}">Add Qualification</button>
        </div>
        ${quals.map((qual, qualIndex) => `
          <div class="qualification-entry" data-qual-index="${qualIndex}">
            <div class="qualification-row-title">
              <span>Qualification ${qualIndex + 1}</span>
              ${quals.length > 1 ? `<button class="remove-btn subtle" type="button" data-remove-qual="${providerIndex}:${qualIndex}">Remove qualification</button>` : ''}
            </div>
            <div class="field-grid three">
              <label>Course / subject<input data-qual-field="course" value="${esc(qual.course)}" placeholder="e.g. English, Maths, GCSE Art"></label>
              <label>Qualification / level<input data-qual-field="qualification" value="${esc(qual.qualification)}" placeholder="e.g. GCSE Grade 4, Level 1, Entry Level 3"></label>
              <label>Date / year<input data-qual-field="dates" value="${esc(qual.dates)}" placeholder="e.g. 2026"></label>
            </div>
          </div>`).join('')}
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('[data-edu-field]').forEach(el => el.addEventListener('input', e => {
    const entry = e.target.closest('[data-edu-index]');
    state.education[Number(entry.dataset.eduIndex)][e.target.dataset.eduField] = e.target.value;
    updatePreview();
  }));
  list.querySelectorAll('[data-qual-field]').forEach(el => el.addEventListener('input', e => {
    const providerEntry = e.target.closest('[data-edu-index]');
    const qualEntry = e.target.closest('[data-qual-index]');
    const providerIndex = Number(providerEntry.dataset.eduIndex);
    const qualIndex = Number(qualEntry.dataset.qualIndex);
    state.education[providerIndex].qualifications[qualIndex][e.target.dataset.qualField] = e.target.value;
    updatePreview();
  }));
  list.querySelectorAll('[data-add-qual]').forEach(btn => btn.addEventListener('click', () => {
    const providerIndex = Number(btn.dataset.addQual);
    state.education[providerIndex].qualifications.push(blankQualification());
    renderEducation(); updatePreview();
  }));
  list.querySelectorAll('[data-remove-qual]').forEach(btn => btn.addEventListener('click', () => {
    const [providerIndex, qualIndex] = btn.dataset.removeQual.split(':').map(Number);
    state.education[providerIndex].qualifications.splice(qualIndex, 1);
    if(!state.education[providerIndex].qualifications.length) state.education[providerIndex].qualifications = [blankQualification()];
    renderEducation(); updatePreview();
  }));
  list.querySelectorAll('[data-remove-edu]').forEach(btn => btn.addEventListener('click', () => {
    state.education.splice(Number(btn.dataset.removeEdu), 1);
    if(!state.education.length) state.education = [blankEducation()];
    renderEducation(); updatePreview();
  }));
}

function updatePreview(){
  applyPaper(q('#cvPreview'), false); applyPaper(q('#editorPreview'), true); syncControls();
}
function applyPaper(paper, editable){
  if(!paper) return;
  const t = themes[state.design.theme] || themes.navy;
  paper.className = `cv-paper cv-${state.template} cv-font-${state.design.font} cv-spacing-${state.design.spacing}`;
  paper.style.setProperty('--cv-accent', t.accent); paper.style.setProperty('--cv-text', t.text); paper.style.setProperty('--cv-soft', t.soft); paper.style.setProperty('--body-size', `${state.design.fontSize || 11.2}pt`);
  paper.contentEditable = editable ? 'true' : 'false';
  paper.innerHTML = (state.template === 'skills' || state.template === 'profile') ? skillsLayout() : standardLayout();
}

function photoHtml(){
  if(!state.design.photo || state.design.photoStyle === 'none') return '';
  const cls = state.design.photoStyle === 'square' ? 'photo-square' : state.design.photoStyle === 'header' ? 'photo-header' : 'photo-circle';
  return `<img class="cv-photo ${cls}" src="${state.design.photo}" alt="CV photo">`;
}
function brandMarkHtml(){ return ''; }
function headerHtml(){
  const d = state.data;
  const contact = [d.phone, d.email].filter(Boolean).map(x => `<span>${esc(x)}</span>`).join('');
  const role = d.jobGoal ? `<div class="cv-role" data-edit="jobGoal">${esc(d.jobGoal)}</div>` : '';
  const contactHtml = contact ? `<div class="cv-contact"><span data-edit="phone">${esc(d.phone)}</span>${d.email ? `<span data-edit="email">${esc(d.email)}</span>` : ''}</div>` : '';
  return `<header class="cv-header"><div class="cv-head-row">${photoHtml()}<div class="cv-head-text"><h1 class="cv-name" data-edit="fullName">${esc(d.fullName)}</h1>${role}${contactHtml}</div></div></header>`;
}
function section(title, body){ return body ? `<section class="cv-section"><h2>${esc(title)}</h2>${body}</section>` : ''; }
function bulletList(items, cls=''){ return items.length ? `<ul class="cv-list ${cls}">${items.map(i=>`<li>${esc(i)}</li>`).join('')}</ul>` : ''; }
function experienceHtml(){
  const entries = state.experience.filter(e => e.place || e.role || e.dates || e.bullets); if(!entries.length) return '';
  return entries.map((e,i) => `<div class="job-entry"><div class="job-title" data-exp-edit="${i}:role">${esc(e.role || 'Role')}</div>${e.place ? `<div class="cv-meta" data-exp-edit="${i}:place">${esc(e.place)}</div>` : ''}${e.dates ? `<div class="cv-meta" data-exp-edit="${i}:dates">${esc(e.dates)}</div>` : ''}${bulletList(lines(e.bullets))}</div>`).join('');
}
function educationHtml(){
  normaliseEducationStructure();
  const entries = (state.education || []).map(provider => {
    const qualifications = (provider.qualifications || []).filter(q => q.course || q.qualification || q.dates);
    const hasProvider = provider.provider || provider.dates;
    return { ...provider, qualifications, hasContent: hasProvider || qualifications.length };
  }).filter(e => e.hasContent);
  if(!entries.length) return '';

  return entries.map(e => {
    const providerTitle = esc(e.provider || 'Education / Qualifications');
    const providerDates = e.dates ? `<div class="cv-meta">${esc(e.dates)}</div>` : '';
    const qualList = e.qualifications.length ? `<ul class="cv-list education-qual-list">${e.qualifications.map(q => {
      const main = [q.course, q.qualification].filter(Boolean).map(esc).join(' - ');
      const date = q.dates ? ` <span class="cv-meta inline-meta">${esc(q.dates)}</span>` : '';
      return `<li>${main || 'Qualification'}${date}</li>`;
    }).join('')}</ul>` : '';
    return `<div class="job-entry education-cv-entry"><div class="job-title">${providerTitle}</div>${providerDates}${qualList}</div>`;
  }).join('');
}
function designBlocksHtml(){
  return state.design.blocks.map(block => {
    if(block === 'achievement') return `<section class="cv-design-block"><h2>Proudest Achievement</h2><p>I am proud of developing my workplace skills, building confidence and completing tasks to a professional standard.</p></section>`;
    if(block === 'availability') return `<section class="cv-section"><h2>Availability</h2><table class="cv-table"><tr><th>Day</th><th>Availability</th></tr><tr><td>Weekdays</td><td>Available by arrangement</td></tr><tr><td>Weekends</td><td>Available by arrangement</td></tr></table></section>`;
    if(block === 'certTable') return `<section class="cv-section"><h2>Certificate Table</h2><table class="cv-table"><tr><th>Training</th><th>Level / Date</th></tr><tr><td>Workplace training</td><td>Add details</td></tr><tr><td>Health and safety</td><td>Add details</td></tr></table></section>`;
    if(block === 'qualities') return `<section class="cv-section"><h2>Personal Qualities</h2><div class="qualities-grid"><span class="quality-pill">Reliable</span><span class="quality-pill">Hard-working</span><span class="quality-pill">Positive attitude</span><span class="quality-pill">Good teamwork</span></div></section>`;
    return '';
  }).join('');
}
function standardLayout(){
  const d = state.data; const skills = bulletList(lines(d.skills), lines(d.skills).length > 6 ? 'two-col' : '');
  return `${brandMarkHtml()}${headerHtml()}${section('Personal Statement', d.statement ? `<p data-edit="statement">${esc(d.statement)}</p>` : '')}${designBlocksHtml()}${section('Key Skills', skills)}${section('Work Experience', experienceHtml())}${section('Education and Qualifications', educationHtml())}${section('Training and Certificates', bulletList(lines(d.training)))}${section('Interests', d.interests ? `<p data-edit="interests">${esc(d.interests)}</p>` : '')}${section('References', '<p>References available on request.</p>')}`;
}
function skillsLayout(){
  const d = state.data;
  return `${brandMarkHtml()}<aside class="cv-sidebar">${headerHtml()}${section('Key Skills', bulletList(lines(d.skills)))}${section('Training', bulletList(lines(d.training)))}</aside><main class="cv-main">${section('Personal Statement', d.statement ? `<p data-edit="statement">${esc(d.statement)}</p>` : '')}${designBlocksHtml()}${section('Work Experience', experienceHtml())}${section('Education and Qualifications', educationHtml())}${section('Interests', d.interests ? `<p data-edit="interests">${esc(d.interests)}</p>` : '')}${section('References', '<p>References available on request.</p>')}</main>`;
}

function syncFromEditableCv(){
  const paper = q('#editorPreview');
  paper.querySelectorAll('[data-edit]').forEach(el => {
    const key = el.dataset.edit; const text = el.innerText.trim();
    if(key && key in state.data && !['phone','email','location'].includes(key)) state.data[key] = text;
    if(['phone','email','location','link'].includes(key)) state.data[key] = text;
  });
  const skillItems = [...paper.querySelectorAll('.cv-section h2')].find(h => h.textContent.trim().toLowerCase() === 'key skills')?.parentElement?.querySelectorAll('li');
  if(skillItems && skillItems.length) state.data.skills = [...skillItems].map(li => li.innerText.trim()).filter(Boolean).join('\n');
  const trainingHead = [...paper.querySelectorAll('.cv-section h2')].find(h => ['training and certificates','training'].includes(h.textContent.trim().toLowerCase()));
  const trainingItems = trainingHead?.parentElement?.querySelectorAll('li');
  if(trainingItems && trainingItems.length) state.data.training = [...trainingItems].map(li => li.innerText.trim()).filter(Boolean).join('\n');
  updateFormFields(false);
}
function updateFormFields(updatePreviewAfter=true){ qa('[data-field]').forEach(el => { el.value = state.data[el.dataset.field] || ''; }); renderExperience(); renderEducation(); if(updatePreviewAfter) updatePreview(); }

function normaliseEducationStructure(){
  if(!Array.isArray(state.education) || !state.education.length){ state.education = [blankEducation()]; return; }
  state.education = state.education.map(item => {
    if(item && Array.isArray(item.qualifications)){
      item.qualifications = item.qualifications.length ? item.qualifications.map(q => ({ course:q.course || '', qualification:q.qualification || '', dates:q.dates || '' })) : [blankQualification()];
      return { provider:item.provider || '', dates:item.dates || '', qualifications:item.qualifications };
    }
    return {
      provider: item?.provider || '',
      dates: '',
      qualifications: [{ course:item?.course || '', qualification:item?.qualification || '', dates:item?.dates || '' }]
    };
  });
}

function migrateEducationData(){
  const d = state.data || {};
  if(state.education && state.education.length){ normaliseEducationStructure(); return; }
  const legacyQuals = [];
  if(d.course){ legacyQuals.push({ course:d.course || '', qualification:'', dates:'' }); }
  if(d.english){ legacyQuals.push({ course:'English', qualification:d.english, dates:'' }); }
  if(d.maths){ legacyQuals.push({ course:'Maths', qualification:d.maths, dates:'' }); }
  state.education = legacyQuals.length ? [{ provider:d.educationPlace || '', dates:'', qualifications:legacyQuals }] : [blankEducation()];
}

function saveCv(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); q('#saveStatus').textContent = 'Saved'; setTimeout(()=> q('#saveStatus').textContent = 'Saved in this browser', 900); }
function loadSaved(silent){
  const saved = localStorage.getItem(STORAGE_KEY) || localStorage.getItem('powerhouseCvBuilderV11') || localStorage.getItem('powerhouseCvBuilderV10') || localStorage.getItem('powerhouseCvBuilderV9') || localStorage.getItem('powerhouseCvBuilderV8') || localStorage.getItem('powerhouseCvBuilderV7') || localStorage.getItem('powerhouseCvBuilderV6') || localStorage.getItem('powerhouseCvBuilderV5') || localStorage.getItem('powerhouseCvBuilderV4') || localStorage.getItem('powerhouseCvBuilderV3') || localStorage.getItem('powerhouseCvBuilderV2') || localStorage.getItem('powerhouseCvBuilderV1');
  if(!saved){ if(!silent) alert('No saved CV found in this browser yet.'); return; }
  try{ const parsed = JSON.parse(saved); Object.assign(state, parsed); state.design = Object.assign({theme:'navy',font:'aptos',fontSize:11.2,spacing:'normal',photo:'',photoStyle:'none',blocks:[]}, state.design || {}); if(state.design.size && !state.design.fontSize){ state.design.fontSize = state.design.size === 'compact' ? 10.3 : state.design.size === 'large' ? 12.3 : 11.2; delete state.design.size; } if(!state.experience?.length) state.experience = [blankExperience()]; migrateEducationData(); if(!state.education?.length) state.education = [blankEducation()]; updateFormFields(false); syncControls(); renderExperience(); renderEducation(); updatePreview(); q('#saveStatus').textContent = 'Loaded saved CV'; }catch(err){ console.warn(err); }
}
function clearForm(){
  if(!confirm('Clear the current CV form?')) return;
  state.template='classic'; state.data={fullName:'',jobGoal:'',phone:'',email:'',location:'',link:'',statement:'',skills:'',educationPlace:'',course:'',english:'',maths:'',training:'',interests:''}; state.experience=[blankExperience()]; state.education=[blankEducation()]; state.design={theme:'navy',font:'aptos',fontSize:11.2,spacing:'normal',photo:'',photoStyle:'none',blocks:[]}; updateFormFields(false); syncControls(); updatePreview();
}
function downloadPdf(){ quickSaveCurrentCv(); makePdf(q('#cvPreview')); }
function downloadPdfFromEditor(){ syncFromEditableCv(); quickSaveCurrentCv(); makePdf(q('#editorPreview')); }
function makePdf(element){
  const name = (state.data.fullName || 'CV').replace(/[^a-z0-9]+/gi,'-').replace(/^-|-$/g,'');
  const opt = { margin:0, filename:`${name}-CV.pdf`, image:{type:'jpeg',quality:0.98}, html2canvas:{scale:2,useCORS:true,backgroundColor:'#ffffff'}, jsPDF:{unit:'pt',format:'a4',orientation:'portrait'}, pagebreak:{mode:['css','legacy']} };
  html2pdf().set(opt).from(element).save();
}


/* V14 Firebase-ready student save/load and teacher admin system */
let currentCvRecord = null;
let teacherUnlocked = false;
let firebaseInitialised = false;
let firestoreDb = null;

function hasFirebaseConfig(){
  const cfg = window.POWERHOUSE_FIREBASE_CONFIG;
  return !!(cfg && cfg.apiKey && !String(cfg.apiKey).includes('PASTE_') && cfg.projectId);
}
function usingCloudStorage(){ return !!(window.firebase && hasFirebaseConfig()); }
async function ensureFirebase(){
  if(!usingCloudStorage()) return false;
  if(firebaseInitialised && firestoreDb) return true;
  try{
    if(!firebase.apps || !firebase.apps.length){ firebase.initializeApp(window.POWERHOUSE_FIREBASE_CONFIG); }
    firestoreDb = firebase.firestore();
    firebaseInitialised = true;
    return true;
  }catch(err){
    console.warn('Firebase could not start. Falling back to browser storage.', err);
    return false;
  }
}
function storageModeText(){ return usingCloudStorage() ? 'Cloud save ready' : 'Browser-only save'; }
function setSaveStatus(text){ const el = q('#saveStatus'); if(el) el.textContent = text; }
function getLocalCvStore(){
  try{ return JSON.parse(localStorage.getItem(CV_STORE_KEY) || '[]'); }
  catch(err){ return []; }
}
function setLocalCvStore(records){ localStorage.setItem(CV_STORE_KEY, JSON.stringify(records)); }
async function getCvStore(){
  if(await ensureFirebase()){
    const snap = await firestoreDb.collection(FIREBASE_COLLECTION).get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  return getLocalCvStore();
}
async function getCvRecordById(id){
  if(await ensureFirebase()){
    const doc = await firestoreDb.collection(FIREBASE_COLLECTION).doc(id).get();
    return doc.exists ? { id: doc.id, ...doc.data() } : null;
  }
  return getLocalCvStore().find(r => r.id === id) || null;
}
async function saveCvRecord(record){
  if(await ensureFirebase()){
    await firestoreDb.collection(FIREBASE_COLLECTION).doc(record.id).set(record, { merge:false });
    return;
  }
  const records = getLocalCvStore();
  const index = records.findIndex(r => r.id === record.id);
  if(index >= 0) records[index] = record; else records.push(record);
  setLocalCvStore(records);
}
async function deleteCvRecordById(id){
  if(await ensureFirebase()){
    await firestoreDb.collection(FIREBASE_COLLECTION).doc(id).delete();
    return;
  }
  setLocalCvStore(getLocalCvStore().filter(r => r.id !== id));
}
async function findStudentCvRecords(studentCode, studentPin){
  if(await ensureFirebase()){
    const snap = await firestoreDb.collection(FIREBASE_COLLECTION)
      .where('studentCode', '==', studentCode)
      .where('studentPin', '==', studentPin)
      .get();
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }
  return getLocalCvStore().filter(r => r.studentCode === studentCode && r.studentPin === studentPin);
}
function makeRecordId(){ return 'cv_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2,8); }
function cleanStudentCode(value=''){ return String(value).trim().replace(/\s+/g,'').toUpperCase(); }
function cleanPin(value=''){ return String(value).trim().replace(/\D/g,'').slice(0,4); }
function formattedDate(value){
  if(!value) return 'Not recorded';
  try{ return new Date(value).toLocaleString('en-GB', { dateStyle:'short', timeStyle:'short' }); }
  catch(err){ return value; }
}
function snapshotState(){
  try{ syncFromEditableCv(); }catch(err){}
  return JSON.parse(JSON.stringify(state));
}
function initSaveSystem(){
  q('#saveModeBtn')?.addEventListener('click', () => setSaveLoadMode('save'));
  q('#loadModeBtn')?.addEventListener('click', () => setSaveLoadMode('load'));
  q('#confirmSaveStudentCv')?.addEventListener('click', saveStudentCvFromModal);
  q('#findStudentCvs')?.addEventListener('click', findStudentCvsFromModal);
  q('#teacherLoginBtn')?.addEventListener('click', teacherLogin);
  q('#exportTeacherDataBtn')?.addEventListener('click', exportTeacherBackup);
  ['saveLoadModal','teacherModal'].forEach(id => {
    q('#'+id)?.addEventListener('click', e => { if(e.target.id === id) q('#'+id).classList.add('hidden'); });
  });
  q('#closeSaveLoadModal')?.addEventListener('click', closeSaveLoadModal);
  q('#closeTeacherModal')?.addEventListener('click', closeTeacherModal);
  setSaveStatus(storageModeText());
}
function openSaveLoadModal(mode='save'){
  setSaveLoadMode(mode);
  const d = state.data || {};
  q('#saveStudentCode').value = currentCvRecord?.studentCode || '';
  q('#saveStudentPin').value = currentCvRecord?.studentPin || '';
  q('#saveCvName').value = currentCvRecord?.cvName || (d.jobGoal ? `${d.jobGoal} CV` : 'Main CV');
  q('#saveStudentName').value = currentCvRecord?.studentName || d.fullName || '';
  q('#studentCvList').innerHTML = '';
  q('#saveLoadModal').classList.remove('hidden');
  setTimeout(() => q(mode === 'save' ? '#saveStudentCode' : '#loadStudentCode')?.focus(), 50);
}
function closeSaveLoadModal(){ q('#saveLoadModal').classList.add('hidden'); }
function setSaveLoadMode(mode){
  const isSave = mode === 'save';
  q('#saveLoadTitle').textContent = isSave ? 'Save CV' : 'Load Saved CV';
  q('#saveLoadEyebrow').textContent = isSave ? 'Student save' : 'Student load';
  q('#studentSavePanel').classList.toggle('hidden', !isSave);
  q('#studentLoadPanel').classList.toggle('hidden', isSave);
  q('#saveModeBtn').classList.toggle('active', isSave);
  q('#loadModeBtn').classList.toggle('active', !isSave);
}
async function saveStudentCvFromModal(){
  const studentCode = cleanStudentCode(q('#saveStudentCode').value);
  const studentPin = cleanPin(q('#saveStudentPin').value);
  const cvName = q('#saveCvName').value.trim() || 'Main CV';
  const studentName = q('#saveStudentName').value.trim() || state.data.fullName || '';
  if(!studentCode){ alert('Please enter a student code.'); return; }
  if(studentPin.length !== 4){ alert('Please enter a 4-digit student PIN.'); return; }
  setSaveStatus('Saving...');
  try{
    const records = await getCvStore();
    const now = new Date().toISOString();
    let id = currentCvRecord?.id;
    let index = id ? records.findIndex(r => r.id === id) : -1;
    if(index < 0){
      index = records.findIndex(r => r.studentCode === studentCode && r.studentPin === studentPin && String(r.cvName || '').toLowerCase() === cvName.toLowerCase());
    }
    const record = {
      id: index >= 0 ? records[index].id : makeRecordId(),
      studentCode,
      studentPin,
      cvName,
      studentName,
      lastSaved: now,
      data: snapshotState()
    };
    await saveCvRecord(record);
    currentCvRecord = { id: record.id, studentCode, studentPin, cvName, studentName };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSaveStatus(`Saved as ${cvName}`);
    closeSaveLoadModal();
  }catch(err){
    console.error(err);
    setSaveStatus('Save failed');
    alert('The CV could not be saved. Check Firebase setup or internet connection.');
  }
}
async function findStudentCvsFromModal(){
  const studentCode = cleanStudentCode(q('#loadStudentCode').value);
  const studentPin = cleanPin(q('#loadStudentPin').value);
  if(!studentCode){ alert('Please enter your student code.'); return; }
  if(studentPin.length !== 4){ alert('Please enter your 4-digit PIN.'); return; }
  q('#studentCvList').innerHTML = '<p class="help-text">Finding saved CVs...</p>';
  try{
    const matches = await findStudentCvRecords(studentCode, studentPin);
    renderStudentCvList(matches);
  }catch(err){
    console.error(err);
    q('#studentCvList').innerHTML = '<p class="help-text">Could not load CVs. Check Firebase setup or internet connection.</p>';
  }
}
function renderStudentCvList(records){
  const list = q('#studentCvList');
  if(!records.length){ list.innerHTML = '<p class="help-text">No CVs found for that student code and PIN.</p>'; return; }
  list.innerHTML = records.sort((a,b) => String(b.lastSaved).localeCompare(String(a.lastSaved))).map(r => `
    <div class="saved-item">
      <div><strong>${esc(r.cvName || 'Saved CV')}</strong><span>${esc(r.studentName || 'No name on CV')} · Last saved ${esc(formattedDate(r.lastSaved))}</span></div>
      <button class="primary-btn" type="button" data-load-record="${esc(r.id)}">Open CV</button>
    </div>`).join('');
  list.querySelectorAll('[data-load-record]').forEach(btn => btn.addEventListener('click', () => loadCvRecord(btn.dataset.loadRecord)));
}
async function loadCvRecord(id){
  try{
    const record = await getCvRecordById(id);
    if(!record){ alert('Could not find that saved CV.'); return; }
    applyLoadedCvRecord(record);
    closeSaveLoadModal();
    closeTeacherModal();
    showBuilder();
  }catch(err){
    console.error(err);
    alert('Could not load that CV. Check Firebase setup or internet connection.');
  }
}
function applyLoadedCvRecord(record){
  Object.keys(state).forEach(k => delete state[k]);
  Object.assign(state, JSON.parse(JSON.stringify(record.data || {})));
  state.design = Object.assign({theme:'navy',font:'aptos',fontSize:11.2,spacing:'normal',photo:'',photoStyle:'none',blocks:[]}, state.design || {});
  if(!state.experience?.length) state.experience = [blankExperience()];
  migrateEducationData();
  if(!state.education?.length) state.education = [blankEducation()];
  currentCvRecord = { id: record.id, studentCode: record.studentCode, studentPin: record.studentPin, cvName: record.cvName, studentName: record.studentName };
  updateFormFields(false); syncControls(); renderExperience(); renderEducation(); updatePreview();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  setSaveStatus(`Loaded ${record.cvName || 'saved CV'}`);
}
async function quickSaveCurrentCv(){
  if(!currentCvRecord){ localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); return; }
  try{
    const existing = await getCvRecordById(currentCvRecord.id);
    if(existing){
      const record = Object.assign({}, existing, {
        data: snapshotState(),
        studentName: state.data.fullName || existing.studentName || '',
        lastSaved: new Date().toISOString()
      });
      await saveCvRecord(record);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSaveStatus(`Saved as ${record.cvName || 'CV'}`);
    }else{
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }catch(err){
    console.warn(err);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    setSaveStatus('Saved in this browser only');
  }
}
async function saveCv(){
  if(currentCvRecord){ await quickSaveCurrentCv(); return; }
  openSaveLoadModal('save');
}
function loadSaved(silent){
  const legacyKeys = ['powerhouseCvBuilderV14','powerhouseCvBuilderV13','powerhouseCvBuilderV12','powerhouseCvBuilderV11','powerhouseCvBuilderV10','powerhouseCvBuilderV9','powerhouseCvBuilderV8','powerhouseCvBuilderV7','powerhouseCvBuilderV6','powerhouseCvBuilderV5','powerhouseCvBuilderV4','powerhouseCvBuilderV3','powerhouseCvBuilderV2','powerhouseCvBuilderV1'];
  const saved = legacyKeys.map(k => localStorage.getItem(k)).find(Boolean);
  if(!saved){ if(!silent) openSaveLoadModal('load'); return; }
  try{
    const parsed = JSON.parse(saved);
    Object.assign(state, parsed);
    state.design = Object.assign({theme:'navy',font:'aptos',fontSize:11.2,spacing:'normal',photo:'',photoStyle:'none',blocks:[]}, state.design || {});
    if(state.design.size && !state.design.fontSize){ state.design.fontSize = state.design.size === 'compact' ? 10.3 : state.design.size === 'large' ? 12.3 : 11.2; delete state.design.size; }
    if(!state.experience?.length) state.experience = [blankExperience()];
    migrateEducationData();
    if(!state.education?.length) state.education = [blankEducation()];
    updateFormFields(false); syncControls(); renderExperience(); renderEducation(); updatePreview();
    if(!silent) setSaveStatus('Loaded last CV from this browser');
  }catch(err){ console.warn(err); if(!silent) openSaveLoadModal('load'); }
}
async function openTeacherModal(){
  q('#teacherModal').classList.remove('hidden');
  if(teacherUnlocked){ await renderTeacherDashboard(); }
  else{
    q('#teacherLoginPanel').classList.remove('hidden');
    q('#teacherDashboardPanel').classList.add('hidden');
    q('#teacherPinInput').value = '';
    setTimeout(() => q('#teacherPinInput')?.focus(), 50);
  }
}
function closeTeacherModal(){ q('#teacherModal').classList.add('hidden'); }
async function teacherLogin(){
  if(q('#teacherPinInput').value.trim() !== TEACHER_PIN){ alert('Incorrect teacher PIN.'); return; }
  teacherUnlocked = true;
  await renderTeacherDashboard();
}
async function renderTeacherDashboard(){
  q('#teacherLoginPanel').classList.add('hidden');
  q('#teacherDashboardPanel').classList.remove('hidden');
  const body = q('#teacherCvTable');
  body.innerHTML = '<tr><td colspan="6">Loading saved CVs...</td></tr>';
  try{
    const records = (await getCvStore()).sort((a,b) => String(b.lastSaved).localeCompare(String(a.lastSaved)));
    q('#teacherCount').textContent = `${records.length} saved CV${records.length === 1 ? '' : 's'} · ${storageModeText()}`;
    if(!records.length){
      body.innerHTML = '<tr><td colspan="6">No student CVs have been saved yet.</td></tr>';
      return;
    }
    body.innerHTML = records.map(r => `
      <tr>
        <td><strong>${esc(r.studentCode || '')}</strong></td>
        <td>${esc(r.studentPin || '')}</td>
        <td>${esc(r.cvName || 'Saved CV')}</td>
        <td>${esc(r.studentName || r.data?.data?.fullName || '')}</td>
        <td>${esc(formattedDate(r.lastSaved))}</td>
        <td><div class="teacher-actions">
          <button type="button" data-teacher-open="${esc(r.id)}">Open</button>
          <button type="button" data-teacher-copy="${esc(r.id)}">Duplicate</button>
          <button type="button" class="danger" data-teacher-delete="${esc(r.id)}">Delete</button>
        </div></td>
      </tr>`).join('');
    body.querySelectorAll('[data-teacher-open]').forEach(btn => btn.addEventListener('click', () => loadCvRecord(btn.dataset.teacherOpen)));
    body.querySelectorAll('[data-teacher-copy]').forEach(btn => btn.addEventListener('click', () => duplicateTeacherCv(btn.dataset.teacherCopy)));
    body.querySelectorAll('[data-teacher-delete]').forEach(btn => btn.addEventListener('click', () => deleteTeacherCv(btn.dataset.teacherDelete)));
  }catch(err){
    console.error(err);
    body.innerHTML = '<tr><td colspan="6">Could not load teacher dashboard. Check Firebase setup or internet connection.</td></tr>';
  }
}
async function duplicateTeacherCv(id){
  const original = await getCvRecordById(id);
  if(!original) return;
  const copy = JSON.parse(JSON.stringify(original));
  copy.id = makeRecordId();
  copy.cvName = `${copy.cvName || 'CV'} copy`;
  copy.lastSaved = new Date().toISOString();
  await saveCvRecord(copy);
  await renderTeacherDashboard();
}
async function deleteTeacherCv(id){
  const record = await getCvRecordById(id);
  if(!record) return;
  if(!confirm(`Delete ${record.cvName || 'this CV'} for ${record.studentCode}?`)) return;
  await deleteCvRecordById(id);
  if(currentCvRecord?.id === id) currentCvRecord = null;
  await renderTeacherDashboard();
}
async function exportTeacherBackup(){
  const records = await getCvStore();
  const blob = new Blob([JSON.stringify(records, null, 2)], { type:'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'powerhouse-cv-builder-backup.json';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(link.href);
}


document.addEventListener('DOMContentLoaded', init);
