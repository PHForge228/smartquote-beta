'use strict';
const IR = {
FOB:{note:'<strong>FOB — Free On Board (船上交貨):</strong> Most common Taiwan export term. Seller delivers to vessel including export customs and all origin handling. Main freight, insurance, destination: buyer. 台灣最常用，賣方負責出口報關及裝船前所有費用。',freightReq:false,insReq:false},
CIF:{note:'<strong>CIF — Cost, Insurance &amp; Freight (成本保險費加運費):</strong> Seller pays freight + minimum insurance (110% CIF value, ICC-C). Risk passes at port of loading. Insurance REQUIRED. 賣方付運費與最低保險，保險為必填。',freightReq:true,insReq:true},
CPT:{note:'<strong>CPT — Carriage Paid To (運費付至):</strong> Seller pays freight to named place. Risk transfers at first carrier. No insurance obligation. Any mode incl. air. 賣方付運費至指定地點，無保險義務。',freightReq:true,insReq:false}
};
const OO=[
{g:'報關 & 出口作業費 Export Customs & Handling'},
{id:'oo-export',en:'Taiwan Export Expenses',zh:'台灣出口費用',hint:'',req:'FOB,CIF,CPT',na:'',def:0},
{id:'oo-customs',en:'Customs Clearance Fee',zh:'報關費',hint:'Typical NTD 2,500–4,000',req:'FOB,CIF,CPT',na:'',def:3500},
{id:'oo-inspect',en:'Inspection & Vehicle Fee',zh:'驗關/車資',hint:'If customs inspection required',req:'',na:'',def:0},
{id:'oo-edi',en:'EDI / Keying Fee',zh:'EDI / 鍵輸費',hint:'Electronic manifest filing',req:'FOB,CIF,CPT',na:'',def:0},
{id:'oo-doc',en:'Document & Print Fee',zh:'文件費 + 影印費',hint:'',req:'',na:'',def:0},
{id:'oo-labor',en:'Handling & Labor',zh:'理貨/工資',hint:'',req:'',na:'',def:0},
{g:'運費與附加費 Freight & Surcharges'},
{id:'oo-postage',en:'Postage',zh:'郵資',hint:'If courier documents sent separately',req:'',na:'',def:0},
{id:'oo-ams',en:'AMS (USA / Canada routes)',zh:'AMS 美加航線',hint:'Advance Manifest System ~NTD 400',req:'',na:'',def:400},
{id:'oo-visa',en:'Certificate / Visa / CO Fee',zh:'簽證費 / 產地證',hint:'If Certificate of Origin required',req:'',na:'',def:0},
{id:'oo-telex',en:'Telex / Exchange Fee',zh:'換單費 (Telex)',hint:'If B/L telex release required',req:'',na:'',def:0},
{id:'oo-wh',en:'Warehouse Storage',zh:'倉租費',hint:'If pre-loading storage applies',req:'',na:'',def:0},
{id:'oo-gmc',en:'GMC / GRI Surcharge',zh:'一般費率上漲',hint:'General Rate Increase if applicable',req:'',na:'',def:0},
{id:'oo-other',en:'Other Local Charges',zh:'其他本地費用',hint:'',req:'',na:'',def:0},
];
const AO=[
{g:'報關 & 空運作業費 Air Customs & Handling'},
{id:'ao-customs',en:'Customs Clearance Fee',zh:'報關費',hint:'Typical NTD 600–1,200 for air',req:'FOB,CIF,CPT',na:'',def:600},
{id:'ao-fuel',en:'Fuel Surcharge + War Risk',zh:'燃油費 + 兵險',hint:'Always confirm with forwarder',req:'FOB,CIF,CPT',na:'',def:350},
{id:'ao-edi',en:'EDI / Keying Fee',zh:'EDI / 鍵輸費',hint:'',req:'FOB,CIF,CPT',na:'',def:240},
{id:'ao-doc',en:'Document & Print Fee',zh:'文件費 + 影印費',hint:'',req:'',na:'',def:0},
{id:'ao-storage',en:'Storage & Palletizing',zh:'倉租 / 拆盤費',hint:'Pre-flight storage and pallet build-up',req:'FOB,CIF,CPT',na:'',def:800},
{id:'ao-custhdl',en:'Custom Handling Fee',zh:'海關處理費',hint:'',req:'FOB,CIF,CPT',na:'',def:600},
{id:'ao-truck',en:'Truck & Cartage',zh:'卡/拖車費',hint:'Origin trucking to air cargo terminal',req:'FOB,CIF,CPT',na:'',def:1500},
{id:'ao-awb',en:'Airway Bill (AWB) Fee',zh:'AWB 文件費',hint:'',req:'FOB,CIF,CPT',na:'',def:160},
{id:'ao-inspect',en:'Inspection Fee',zh:'檢驗費',hint:'If airline or authority inspection required',req:'',na:'',def:200},
{id:'ao-gmc',en:'GMC / Miscellaneous',zh:'其他雜費',hint:'',req:'',na:'',def:0},
{id:'ao-other',en:'Other Local Charges',zh:'其他本地費用',hint:'',req:'',na:'',def:0},
];
const OD=[
{g:'到港費用 Port Arrival Charges (Buyer pays under CIF · CPT seller may arrange)'},
{id:'od-thc',en:'Destination THC',zh:'目的地碼頭費 THC',hint:'BUYER cost under CIF. Seller cost under CPT. Enter for reference/awareness.',req:'CPT',na:'FOB',def:0},
{id:'od-terminal',en:'Port Terminal / LTC',zh:'本地碼頭費 LTC',hint:'BUYER cost under CIF. Enter for reference only.',req:'CPT',na:'FOB',def:0},
{id:'od-cfs',en:'CFS Handling / Devanning',zh:'倉儲拆箱費 CFS',hint:'LCL cargo unstuffing — BUYER cost under CIF.',req:'CPT',na:'FOB',def:0},
{id:'od-do',en:'Delivery Order Fee D/O',zh:'提貨單換單費 D/O',hint:'Shipping line D/O fee — BUYER cost under CIF.',req:'CPT',na:'FOB',def:0},
{id:'od-bl',en:'B/L Doc Fee (Destination)',zh:'目的地提單文件費',hint:'Destination agent doc fee — BUYER cost under CIF.',req:'CPT',na:'FOB',def:0},
{id:'od-storage',en:'Port Storage / Demurrage',zh:'超期倉租 / 滯港費',hint:'If cargo exceeds free time at port',req:'',na:'',def:0},
{g:'清關費用 Customs Clearance (Buyer handles under FOB & CIF)'},
{id:'od-clearance',en:'Import Customs Clearance',zh:'進口清關費',hint:'BUYER handles under FOB & CIF. Seller arranges under CPT — enter if applicable.',req:'CPT',na:'FOB,CIF',def:0},
{id:'od-isf',en:'ISF Filing (USA)',zh:'ISF 申報費 (美國)',hint:'Required 24hrs before loading for USA ocean imports',req:'',na:'',def:0},
{id:'od-other',en:'Other Destination Charges',zh:'其他目的地費用',hint:'',req:'',na:'',def:0},
];
const AD=[
{g:'目的地機場費用 Destination Airport Charges (Buyer pays under CIF · CPT seller arranges)'},
{id:'ad-airport',en:'Destination Airport Handling',zh:'目的地機場操作費',hint:'BUYER cost under CIF. Seller arranges under CPT.',req:'CPT',na:'FOB',def:0},
{id:'ad-breakdown',en:'Airline Breakdown / ULD Fee',zh:'航空公司拆板費 ULD',hint:'BUYER cost under CIF.',req:'CPT',na:'FOB',def:0},
{id:'ad-awb-dest',en:'AWB Release / D/O Fee',zh:'提單換單費',hint:'BUYER cost under CIF.',req:'CPT',na:'FOB',def:0},
{id:'ad-storage',en:'Airport Storage (after free time)',zh:'機場倉租 超免費期',hint:'Free time typically 24–48 hrs',req:'',na:'',def:0},
{g:'進口清關費用 Import Customs (Buyer handles under FOB & CIF)'},
{id:'ad-clearance',en:'Import Customs Clearance',zh:'進口清關費',hint:'BUYER handles under FOB & CIF. Seller arranges under CPT.',req:'CPT',na:'FOB,CIF',def:0},
{id:'ad-other',en:'Other Destination Charges',zh:'其他目的地費用',hint:'',req:'',na:'',def:0},
];
const EX={NTD:1,USD:30,EUR:33,THB:0.88,CAD:22,RMB:4.2,JPY:0.2,GBP:38,AUD:19.5,SGD:22.5,MYR:6.5,INR:0.36,SAR:8,AED:8.2,OTHER:1};
let MODE='ocean', INCO='FOB', bkdnOpen=false;
window.addEventListener('DOMContentLoaded',()=>{
renderOrigin(); renderDest();
applyIncoterm(); autoInsurance(); calcVol();
});
function setMode(m){
MODE=m;
document.getElementById('btn-ocean').className=m==='ocean'?'mode-btn on-ocean':'mode-btn';
document.getElementById('btn-air').className=m==='air'?'mode-btn on-air':'mode-btn';
const isO=m==='ocean';
document.getElementById('fi-icon').textContent=isO?'🚢':'✈️';
document.getElementById('fi-title').textContent=isO?'Ocean Freight Rate 海運費率':'Air Freight Rate 空運費率';
document.getElementById('fr-label').innerHTML=isO?'海運費 Ocean Freight <span class="zh">(NTD / CBM)</span>':'空運費 Air Freight <span class="zh">(NTD / KG chargeable)</span>';
document.getElementById('f-freight').value=isO?2640:80;
const cb=document.getElementById('calc-btn');
cb.className=isO?'btn btn-ocean btn-calc':'btn btn-air btn-calc';
cb.innerHTML=isO?'🚢 計算 &amp; 產生報價 — Calculate &amp; Generate Quote':'✈️ 計算 &amp; 產生報價 — Calculate &amp; Generate Quote';
document.getElementById('v-volwt-row').style.display=isO?'none':'';
document.getElementById('v-chargewt-row').style.display=isO?'none':'';
updateInsuranceUI();
renderOrigin(); renderDest(); applyIncoterm(); calcVol();
document.getElementById('result-panel').classList.remove('show');
}
function renderOrigin(){document.getElementById('origin-body').innerHTML=buildCharges(MODE==='ocean'?OO:AO);}
function renderDest(){
document.getElementById('dest-body').innerHTML=buildCharges(MODE==='ocean'?OD:AD)+
`<div class="subtotal"><span class="st-lbl">🏁 Destination Subtotal (NTD equiv.) 目的地費用小計</span><span class="st-val" id="dest-subtotal">—</span></div>`;
}
function buildCharges(defs){
let h='';
defs.forEach(d=>{
if(d.g){h+=`<div class="charge-group">${d.g}</div>`;return;}
const isNA=d.na&&d.na.split(',').includes(INCO);
const isReq=d.req&&d.req.split(',').includes(INCO);
h+=`<div class="charge-row${isNA?' is-na':''}" id="crow-${d.id}">
<div class="c-dot ${isNA?'dot-na':isReq?'dot-req':'dot-opt'}" id="cdot-${d.id}"></div>
<div class="c-info"><div class="c-en">${d.en}</div><div class="c-zh">${d.zh}</div>${d.hint?`<div class="c-hint">${d.hint}</div>`:''}</div>
<div class="c-badge" id="cbadge-${d.id}"><span class="cbadge ${isNA?'cbadge-na':isReq?'cbadge-req':'cbadge-opt'}">${isNA?'N/A':isReq?'Required':'Optional'}</span></div>
<div class="c-wrap">
<span class="c-pre">NTD</span>
<input class="c-input" type="number" id="${d.id}" min="0" value="${d.def}" oninput="liveUpdate()" ${isNA?'tabindex="-1"':''}>
</div>
</div>`;
});
return h;
}
function applyIncoterm(){
INCO=document.getElementById('incoterm').value;
const rule=IR[INCO];
document.getElementById('inco-note').innerHTML=rule.note;
document.getElementById('ins-tag').textContent=rule.insReq?'REQUIRED':'Optional';
document.getElementById('ins-tag').className='card-tag '+(rule.insReq?'tag-req':'tag-opt');
updateInsuranceUI();
renderOrigin(); renderDest();
liveUpdate();
}
function toM(v,u){return v*({cm:.01,m:1,inch:.0254,ft:.3048}[u]||.01);}
function calcVol(){
function box(pfx){
const L=parseFloat(document.getElementById('v-'+pfx+'L').value)||0;
const W=parseFloat(document.getElementById('v-'+pfx+'W').value)||0;
const H=parseFloat(document.getElementById('v-'+pfx+'H').value)||0;
const u=document.getElementById('v-'+pfx+'u').value;
const q=parseFloat(document.getElementById('v-'+pfx+'q').value)||0;
const w=(parseFloat(document.getElementById('v-'+pfx+'w').value)||0)*q;
return {cbm:toM(L,u)*toM(W,u)*toM(H,u)*q, wt:w, qty:q};
}
const S=box('S'), M=box('M');
const totalCBM=S.cbm+M.cbm;
const totalWt=S.wt+M.wt;
const totalQty=S.qty+M.qty;
const cbmEl=document.getElementById('v-cbm');
const wtEl=document.getElementById('v-weight');
const qtyEl=document.getElementById('v-qty');
cbmEl.value=totalCBM>0?totalCBM.toFixed(4):'';
cbmEl.className=totalCBM>0?'vi calc':'vi';
wtEl.value=totalWt>0?totalWt.toFixed(2):'';
qtyEl.value=totalQty>0?totalQty:'';
const note=document.getElementById('vol-note');
if(MODE==='air'){
const volKg=totalCBM>0?totalCBM*1000000/6000:0;
const cw=Math.max(totalWt,volKg);
document.getElementById('v-volwt').value=volKg>0?volKg.toFixed(2):'';
document.getElementById('v-chargewt').value=cw>0?cw.toFixed(2):'';
if(totalWt>0&&volKg>0){
if(volKg>totalWt){
note.className='vol-note warn';note.style.display='block';
note.textContent=`⚠ Volumetric weight (${volKg.toFixed(2)} kg) > actual (${totalWt.toFixed(2)} kg). Chargeable = ${cw.toFixed(2)} kg. 材積重超過實重，以材積重計費。`;
} else {
note.className='vol-note ok';note.style.display='block';
note.textContent=`✓ Actual weight (${totalWt.toFixed(2)} kg) >= volumetric (${volKg.toFixed(2)} kg). Chargeable = ${totalWt.toFixed(2)} kg. 實重計費。`;
}
} else { note.style.display='none'; }
} else {
if(totalCBM>0){
note.className='vol-note ok';note.style.display='block';
let msg=`✓ Total: ${totalCBM.toFixed(4)} m³ CBM | ${totalWt>0?totalWt.toFixed(2)+' kg':'no weight entered'} | ${totalQty} boxes`;
if(S.cbm>0&&M.cbm>0) msg+=` (S: ${S.cbm.toFixed(4)} m³ + M: ${M.cbm.toFixed(4)} m³)`;
note.textContent=msg;
} else { note.style.display='none'; }
}
updateFreightHint(); liveUpdate();
}
function updateFreightHint(){
const rate=parseFloat(document.getElementById('f-freight').value)||0;
const row=document.getElementById('fr-computed-row');
if(MODE==='ocean'){
const cbm=parseFloat(document.getElementById('v-cbm').value)||0;
row.innerHTML=cbm>0&&rate>0?`<span style="color:var(--green);font-weight:700">Ocean freight: ${cbm.toFixed(4)} CBM × NTD ${fmt(rate)} = <strong>NTD ${fmt(cbm*rate)}</strong></span>`:'<span style="color:var(--faint)">Enter dimensions above to compute freight charge. 請輸入尺寸計算運費。</span>';
}else{
const cw=parseFloat(document.getElementById('v-chargewt').value)||0;
row.innerHTML=cw>0&&rate>0?`<span style="color:var(--air);font-weight:700">Air freight: ${cw.toFixed(2)} KG × NTD ${fmt(rate)} = <strong>NTD ${fmt(cw*rate)}</strong></span>`:'<span style="color:var(--faint)">Enter dimensions and weight above. 請輸入尺寸與重量。</span>';
}
}
function autoInsurance(){
const inv=parseFloat(document.getElementById('f-invoice').value)||0;
const exr=parseFloat(document.getElementById('f-exrate').value)||30;
const rate=MODE==='ocean'?.003:.0065;
const ntd=Math.round(inv*rate*exr);
document.getElementById('ins-formula').textContent=`Invoice USD ${inv.toLocaleString()} × ${MODE==='ocean'?'0.3%':'0.65%'} × ${exr} = NTD ${fmt(ntd)}`;
document.getElementById('f-ins').value=ntd;
liveUpdate();
}
function updateInsuranceUI(){
const rule=IR[INCO];const isO=MODE==='ocean';const isReq=rule.insReq;
const box=document.getElementById('ins-box');
box.className='ins-box '+(isReq?'ins-required':(isO?'ins-ocean':'ins-air'));
const ttl=document.getElementById('ins-title');
ttl.style.color=isReq?'var(--orange)':(isO?'var(--green)':'var(--air)');
ttl.textContent=isReq?`Insurance - REQUIRED for ${INCO} 此貿易條件必須投保`:`Insurance - Auto-Calculated 保險費自動估算`;
document.getElementById('ins-note').textContent=isReq?`Required under ${INCO}. Minimum 110% of invoice value.`:`${isO?'Ocean 0.3%':'Air 0.65%'} of invoice value. Override if forwarder charges differently.`;
}
function updateExRate(){
const cur=document.getElementById('f-cur').value;
const rate=EX[cur]||1;
document.getElementById('f-exrate').value=rate;
document.getElementById('exrate-hint').textContent=`1 ${cur} ≈ NTD ${rate} — verify before finalizing 請確認匯率`;
liveUpdate();
}
function updateDestRate(){
const cur=document.getElementById('dest-cur').value;
const r=EX[cur]||1;
document.getElementById('dest-exrate').value=r;
document.getElementById('dest-rate-hint').textContent=`1 ${cur} ≈ NTD ${r}`;
liveUpdate();
}
function liveUpdate(){
updateFreightHint();
const destEx=parseFloat(document.getElementById('dest-exrate').value)||1;
const destLocal=sumDefs(MODE==='ocean'?OD:AD);
const st=document.getElementById('dest-subtotal');
if(st)st.textContent=fmt(destLocal*destEx)+' NTD';
}
function sumDefs(defs){return defs.filter(d=>!d.g).reduce((s,d)=>{const el=document.getElementById(d.id);return s+(el?parseFloat(el.value)||0:0);},0);}
function calculate(){
const rule=IR[INCO];
const errors=[];
const inv=parseFloat(document.getElementById('f-invoice').value)||0;
if(inv<=0)errors.push('Invoice value must be > 0');
const rate=parseFloat(document.getElementById('f-freight').value)||0;
const cbm=parseFloat(document.getElementById('v-cbm').value)||0;
const cw=parseFloat(document.getElementById('v-chargewt').value)||0;
const baseU=MODE==='ocean'?cbm:cw;
if(rule.freightReq&&rate===0)errors.push(`Freight rate required for ${INCO}`);
if(rule.freightReq&&baseU===0)errors.push('Volume/weight required to compute freight');
const ins=parseFloat(document.getElementById('f-ins').value)||0;
if(rule.insReq&&ins===0)errors.push(`Insurance required for ${INCO}`);
const wb=document.getElementById('warn-banner');
if(errors.length){wb.style.display='block';document.getElementById('warn-list').innerHTML=errors.map(e=>`<li>${e}</li>`).join('');wb.scrollIntoView({behavior:'smooth',block:'nearest'});return;}
wb.style.display='none';
const exRate=parseFloat(document.getElementById('dest-exrate').value)||1;
const basicsRate=parseFloat(document.getElementById('f-exrate').value)||30;
document.getElementById('f-ntdusd').value=basicsRate;
const ntdUsd=basicsRate;
const margin=parseFloat(document.getElementById('f-margin').value)||6;
const fCharge=rate*baseU;
const originLocal=sumDefs(MODE==='ocean'?OO:AO);
const destLocal=sumDefs(MODE==='ocean'?OD:AD);
const destNTD=destLocal*exRate;
const originTotal=fCharge+originLocal+ins;
const totalCost=originTotal+destNTD;
const afterMargin=totalCost*(1+margin/100);
const quoteUSD=afterMargin/ntdUsd;
document.getElementById('r-origin').textContent=fmt(originTotal)+' NTD';
document.getElementById('r-dest').textContent=fmt(destNTD)+' NTD';
document.getElementById('r-total').textContent=fmt(totalCost)+' NTD';
document.getElementById('r-after').textContent=fmt(afterMargin)+' NTD';
document.getElementById('r-rate').textContent=ntdUsd;
document.getElementById('r-usd').textContent='USD '+fmt(quoteUSD);
const client=document.getElementById('f-client').value||'—';
const dest=document.getElementById('f-dest').value||'—';
const notes=document.getElementById('f-notes').value;
const dateStr=new Date().toLocaleDateString('zh-TW');
let bH=`<div class="bdr info-row"><span class="bl">Client: <strong style="color:var(--text)">${client}</strong> | Dest: <strong style="color:var(--text)">${dest}</strong> | ${INCO} | ${MODE==='ocean'?'Ocean':'Air'} | ${dateStr} | Buffer: ${margin}%</span><span></span></div>`;
const addG=l=>bH+=`<div class="bdr grp"><span class="bl">${l}</span><span></span></div>`;
const addR=(l,v,cls='')=>{if(v===0&&cls!=='tot')return;bH+=`<div class="bdr ${cls}"><span class="bl">${l}</span><span class="bv">${fmt(v)}</span></div>`;};
addG('-- ORIGIN CHARGES 出口方本地費用 --');
const fLbl=MODE==='ocean'?`Ocean Freight (${cbm.toFixed(4)} CBM x NTD ${fmt(rate)})`:`Air Freight (${cw.toFixed(2)} KG x NTD ${fmt(rate)})`;
addR(fLbl,fCharge);
(MODE==='ocean'?OO:AO).filter(d=>!d.g).forEach(d=>{const v=parseFloat(document.getElementById(d.id)?.value)||0;addR(`${d.en} ${d.zh}`,v);});
addR('Insurance 保險費',ins);
addR('-- Origin Subtotal 出口方小計 --',originTotal,'tot');
if(destNTD>0){
addG('-- DESTINATION CHARGES 目的地費用 --');
(MODE==='ocean'?OD:AD).filter(d=>!d.g).forEach(d=>{const v=(parseFloat(document.getElementById(d.id)?.value)||0)*exRate;addR(`${d.en} ${d.zh}`,v);});
addR('-- Destination Subtotal 目的地小計 --',destNTD,'tot');
}
addG('-- PRICING 定價計算 --');
addR('Total Cost 總成本',totalCost,'tot');
addR(`Buffer Applied ${margin}% → After Margin`,afterMargin,'tot');
bH+=`<div class="bdr tot"><span class="bl">Final Quote 最終報價 USD</span><span class="bv" style="color:var(--green);font-size:1rem">USD ${fmt(quoteUSD)}</span></div>`;
if(notes)bH+=`<div class="bdr info-row"><span class="bl">Notes: ${notes}</span><span></span></div>`;
bH+=`<div class="bdr info-row"><span class="bl" style="color:var(--orange)">PRELIMINARY ESTIMATE ONLY — SmartQuote Freight Beta | PHforge © 2026 | P.Han@PHforge.co</span><span></span></div>`;
document.getElementById('bkdn-rows').innerHTML=bH;
const panel=document.getElementById('result-panel');
panel.classList.add('show');
if(bkdnOpen)document.getElementById('bkdn').classList.add('show');
panel.scrollIntoView({behavior:'smooth',block:'nearest'});
}
function toggleBkdn(){bkdnOpen=!bkdnOpen;document.getElementById('bkdn').classList.toggle('show',bkdnOpen);}
function copyResult(){
const lines=[
'SmartQuote Freight Beta — Preliminary Estimate | PHforge © 2026',
`Date: ${new Date().toLocaleDateString('zh-TW')}`,
`Client: ${document.getElementById('f-client').value||'—'} | Dest: ${document.getElementById('f-dest').value||'—'}`,
`Mode: ${MODE==='ocean'?'Ocean':'Air'} | Incoterm: ${INCO}`,
`Invoice Value: USD ${parseFloat(document.getElementById('f-invoice').value||0).toLocaleString()}`,
'---',
`Origin Costs: ${document.getElementById('r-origin').textContent}`,
`Destination Costs: ${document.getElementById('r-dest').textContent}`,
`Total Cost: ${document.getElementById('r-total').textContent}`,
`After Buffer: ${document.getElementById('r-after').textContent}`,
`Final Quote: ${document.getElementById('r-usd').textContent}`,
'---',
'PRELIMINARY ESTIMATE ONLY. Confirm actual freight scope, Incoterm responsibility,',
'route-specific charges, and customer agreement before releasing the final quote.',
'僅供估算，正式報價發出前請確認實際運費範圍、貿易條件責任及客戶協議。',
'PHforge | P.Han@PHforge.co'
];
navigator.clipboard.writeText(lines.join('\n')).then(()=>{
const btn=document.getElementById('copy-btn');const old=btn.innerHTML;
btn.innerHTML='✓ Copied!';setTimeout(()=>btn.innerHTML=old,2000);
});
}
function sendEmail(includeBuffer){
const qn=generateQuoteNo();
const client=document.getElementById('f-client').value||'—';
const dest=document.getElementById('f-dest').value||'—';
const exRate=parseFloat(document.getElementById('dest-exrate').value)||1;
const rate=parseFloat(document.getElementById('f-freight').value)||0;
const cbm=parseFloat(document.getElementById('v-cbm').value)||0;
const cw=parseFloat(document.getElementById('v-chargewt').value)||0;
const baseU=MODE==='ocean'?cbm:cw;
const fCharge=rate*baseU;
const ins=parseFloat(document.getElementById('f-ins').value)||0;
const margin=parseFloat(document.getElementById('f-margin').value)||6;
const ntdUsd=parseFloat(document.getElementById('f-ntdusd').value)||30;
const defs=[...(MODE==='ocean'?OO:AO),...(MODE==='ocean'?OD:AD)];
let rows=[];
if(fCharge>0)rows.push({l:MODE==='ocean'?`Ocean Freight (${cbm.toFixed(3)} CBM x NTD ${fmt(rate)})`:`Air Freight (${cw.toFixed(2)} KG x NTD ${fmt(rate)})`,v:fCharge,dest:false});
if(ins>0)rows.push({l:'Insurance 保險費',v:ins,dest:false});
defs.filter(d=>!d.g).forEach(d=>{
const el=document.getElementById(d.id);
if(!el)return;
const v=parseFloat(el.value)||0;
if(v>0){
const isD=(MODE==='ocean'?OD:AD).find(x=>x.id===d.id);
rows.push({l:`${d.zh} ${d.en}`,v:isD?v*exRate:v,dest:!!isD});
}
});
const total=rows.reduce((s,r)=>s+r.v,0);
const afterMargin=total*(1+margin/100);
const quoteUSD=afterMargin/ntdUsd;
const COL=42;
const pad=(str,len)=>{const s=String(str);return s.length>=len?s:s+' '.repeat(len-s.length);};
const fmtRow=(label,val)=>pad(label,COL)+'NTD '+fmt(val);
const SEP='─'.repeat(58);
const SEP2='═'.repeat(58);
let body='';
body+=`SmartQuote Freight Beta — Preliminary Estimate\n`;
body+=`${'─'.repeat(58)}\n`;
body+=`Quote No : ${qn}\n`;
body+=`Client : ${client}\n`;
body+=`Dest : ${dest}\n`;
body+=`Incoterm : ${INCO} Mode: ${MODE==='ocean'?'Ocean LCL':'Air Freight'}\n`;
body+=`Date : ${new Date().toLocaleDateString('zh-TW')}\n`;
body+=`${SEP}\n`;
body+=pad('ITEM',COL)+'AMOUNT (NTD)\n';
body+=`${SEP}\n`;
body+=`${' ── Origin Charges ──'}\n`;
rows.filter(r=>!r.dest).forEach(r=>{body+=fmtRow(' '+r.l,r.v)+'\n';});
const destRows=rows.filter(r=>r.dest);
if(destRows.length>0){
body+=`${' ── Destination Charges ──'}\n`;
destRows.forEach(r=>{body+=fmtRow(' '+r.l,r.v)+'\n';});
}
body+=`${SEP}\n`;
body+=fmtRow('SUBTOTAL',total)+'\n';
if(includeBuffer){
body+=fmtRow(`Buffer ${margin}%`,afterMargin-total)+'\n';
body+=`${SEP2}\n`;
body+=pad('FINAL QUOTE (USD)',COL)+'USD '+fmt(quoteUSD)+'\n';
body+=pad(` NTD→USD rate: ${ntdUsd}`,COL)+'\n';
body+=`${SEP2}\n`;
}
body+=`\nPRELIMINARY ESTIMATE ONLY — confirm all charges before releasing final quote.\n`;
body+=`SmartQuote Freight Beta | PHforge | P.Han@PHforge.co`;
const sub=encodeURIComponent(`[SmartQuote Beta] ${qn}`);
window.location.href=`mailto:?subject=${sub}&body=${encodeURIComponent(body)}`;
}
function generateQuoteNo(){
const c=(document.getElementById('f-client').value||'CLT').replace(/[^a-zA-Z]/g,'').substring(0,3).toUpperCase()||'CLT';
const d=(document.getElementById('f-dest').value||'DST').replace(/[^a-zA-Z]/g,'').substring(0,3).toUpperCase()||'DST';
const dt=new Date();
return `${c}_${d}_${dt.getFullYear()}${String(dt.getMonth()+1).padStart(2,'0')}${String(dt.getDate()).padStart(2,'0')}`;
}
function toggle(id){document.getElementById('card-'+id).classList.toggle('collapsed');}
function openModal(which){
if(which==='paypal')document.getElementById('modal-paypal').classList.add('open');
else if(which==='linepay')document.getElementById('modal-linepay').classList.add('open');
else document.getElementById('modal-second').classList.add('open');
document.body.style.overflow='hidden';
}
function closeModal(id){document.getElementById(id).classList.remove('open');document.body.style.overflow='';}
function handleOverlay(e,id){if(e.target===document.getElementById(id))closeModal(id);}
function expressInterest(){
const sub=encodeURIComponent('[SmartQuote Full Version] Interest Registration');
const body=encodeURIComponent(`Hi Lanny,\n\nI am using SmartQuote Freight Beta and I am interested in the Full Version.\n\nMy use case:\n[Please describe your typical shipments, Incoterms you use, team size]\n\nWould I pay for the Full Version?\n[ ] Yes — happy to pay\n[ ] Yes — if under a certain price\n[ ] Not sure yet\n[ ] Prefer free / donation\n\nContact:\nName: \nCompany: \nEmail: \n\n---\nSent from SmartQuote Freight Beta | PHforge`);
window.location.href=`mailto:P.Han@PHforge.co?subject=${sub}&body=${body}`;
}
function sendFeedback(){
const sub=encodeURIComponent('[SmartQuote Beta] Feedback');
const body=encodeURIComponent(`Hi Lanny,\n\nFeedback on SmartQuote Freight Beta:\n\n[Your feedback here]\n\n---\nSent from SmartQuote Freight Beta | PHforge`);
window.location.href=`mailto:P.Han@PHforge.co?subject=${sub}&body=${body}`;
}
function clearAll(){
if(!confirm('Clear all inputs and reset? 確認清除所有欄位？'))return;
['f-client','f-dest','f-notes'].forEach(id=>document.getElementById(id).value='');
document.getElementById('f-invoice').value=5000;
document.getElementById('f-cur').value='USD';
document.getElementById('f-exrate').value=30;
document.getElementById('exrate-hint').textContent='1 USD ≈ NTD 30 — verify before finalizing 請確認匯率';
['S','M'].forEach(pfx=>{
['L','W','H'].forEach(d=>{const e=document.getElementById('v-'+pfx+d);if(e)e.value='';});
const q=document.getElementById('v-'+pfx+'q');if(q)q.value=0;
const w=document.getElementById('v-'+pfx+'w');if(w)w.value='';
});
['v-qty','v-weight','v-cbm'].forEach(id=>{const e=document.getElementById(id);if(e)e.value='';});
document.getElementById('v-cbm').className='vi';
document.getElementById('f-freight').value=0;
document.getElementById('f-margin').value=6;
document.getElementById('f-ntdusd').value=30;
document.getElementById('vol-note').style.display='none';
document.getElementById('result-panel').classList.remove('show');
document.getElementById('bkdn').classList.remove('show');
document.getElementById('warn-banner').style.display='none';
bkdnOpen=false;
[...(MODE==='ocean'?OO:AO),...(MODE==='ocean'?OD:AD)].filter(d=>!d.g).forEach(d=>{const el=document.getElementById(d.id);if(el)el.value=d.def||0;});
autoInsurance(); calcVol(); liveUpdate();
}
function fmt(n){return Number(n).toLocaleString(undefined,{maximumFractionDigits:2});}