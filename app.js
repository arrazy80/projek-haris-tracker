// Simple Ideal Body Weight Tracker - LocalStorage only
const FORM = document.getElementById('trackForm');
const HEIGHT = document.getElementById('height');
const WEIGHT = document.getElementById('weight');
const AGE = document.getElementById('age');
const GENDER = document.getElementById('gender');
const BMI_RESULT = document.getElementById('bmiResult');
const BMI_CAT = document.getElementById('bmiCategory');
const IDEAL = document.getElementById('idealRange');
const PROG = document.getElementById('progress');
const HISTORY_LIST = document.getElementById('historyList');
const CHART = document.getElementById('weightChart');
const CLEAR = document.getElementById('clearHistory');

const STORAGE_KEY = 'ibwt_history_v1';

function calcBMI(kg, cm){
  const m = cm/100;
  if(!m) return 0;
  return kg / (m*m);
}

function bmiCategory(bmi){
  if(bmi < 18.5) return 'Underweight';
  if(bmi < 25) return 'Normal';
  if(bmi < 30) return 'Overweight';
  return 'Obesity';
}

function idealWeightRange(cm){
  const m = cm/100;
  const min = 18.5 * m * m;
  const max = 24.9 * m * m;
  return {min:+min.toFixed(1), max:+max.toFixed(1)};
}

function readHistory(){
  try{ return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }catch(e){return []}
}

function writeHistory(list){
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function saveEntry(entry){
  const list = readHistory();
  list.push(entry);
  writeHistory(list);
}

function renderHistory(){
  const list = readHistory();
  HISTORY_LIST.innerHTML = '';
  if(list.length === 0){ HISTORY_LIST.innerHTML = '<li>Belum ada data</li>'; drawChart([]); return }

  // show latest first
  const rev = list.slice().reverse();
  rev.forEach((e,i)=>{
    const li = document.createElement('li');
    const date = new Date(e.ts).toLocaleString();
    const left = document.createElement('div');
    left.textContent = `${date} — ${e.weight} kg`;
    const right = document.createElement('div');
    right.textContent = `BMI ${e.bmi.toFixed(1)}`;
    li.appendChild(left); li.appendChild(right);
    HISTORY_LIST.appendChild(li);
  });

  drawChart(list.map(i=>i.weight));
}

function drawChart(weights){
  const svg = CHART;
  while(svg.firstChild) svg.removeChild(svg.firstChild);
  if(weights.length === 0) return;

  const W = 300, H = 80, pad = 6;
  const n = Math.min(weights.length, 30);
  const slice = weights.slice(-n);
  const max = Math.max(...slice);
  const min = Math.min(...slice);
  const range = Math.max(1, max - min);

  const points = slice.map((w, i)=>{
    const x = (i/(n-1 || 1)) * (W - pad*2) + pad;
    const y = H - pad - ((w - min)/range) * (H - pad*2);
    return `${x},${y}`;
  }).join(' ');

  const poly = document.createElementNS('http://www.w3.org/2000/svg','polyline');
  poly.setAttribute('points', points);
  poly.setAttribute('fill','none');
  poly.setAttribute('stroke','#2463eb');
  poly.setAttribute('stroke-width','2');
  svg.appendChild(poly);
}

FORM.addEventListener('submit', (ev)=>{
  ev.preventDefault();
  const h = Number(HEIGHT.value);
  const w = Number(WEIGHT.value);
  const age = Number(AGE.value) || null;
  const gender = GENDER.value || 'other';
  if(!h || !w) return;

  const bmi = calcBMI(w,h);
  const category = bmiCategory(bmi);
  const labelMap = {Underweight: 'Kekurangan Berat Badan', Normal: 'Normal', Overweight: 'Kelebihan Berat Badan', Obesity: 'Obesitas'};
  const displayCategory = labelMap[category] || category;
  const range = idealWeightRange(h);

  // update UI
  BMI_RESULT.textContent = bmi.toFixed(1);
  BMI_CAT.textContent = displayCategory;
  BMI_CAT.className = 'category cat-' + category.replace(/\s+/g,'');
  IDEAL.textContent = `${range.min} kg — ${range.max} kg`;

  // progress vs range
  let progText = '';
  if(w < range.min) progText = `Anda ${(range.min - w).toFixed(1)} kg di bawah rentang ideal.`;
  else if(w > range.max) progText = `Anda ${(w - range.max).toFixed(1)} kg di atas rentang ideal.`;
  else progText = `Berada dalam rentang ideal (${(w - range.min).toFixed(1)} kg di atas batas bawah).`;

  // perbandingan dengan entri terakhir
  const history = readHistory();
  const last = history[history.length-1];
  if(last){
    const diff = (w - last.weight).toFixed(1);
    const sign = diff > 0 ? '+' : '';
    progText += ` Perubahan sejak terakhir: ${sign}${diff} kg.`;
  }

  PROG.textContent = progText;

  // save
  const entry = {ts: Date.now(), height:h, weight:+w.toFixed(1), age, gender, bmi:+bmi.toFixed(2)};
  saveEntry(entry);
  renderHistory();
});

CLEAR.addEventListener('click', ()=>{
  if(!confirm('Hapus semua riwayat berat yang tersimpan?')) return;
  localStorage.removeItem(STORAGE_KEY);
  renderHistory();
});

// initial load
(function(){
  renderHistory();
})();
