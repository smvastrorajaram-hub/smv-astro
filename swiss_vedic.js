'use strict';

// V138: Swiss Ephemeris primary Vedic calculation layer.
// The project must provide its own licensed ephemeris data in ./ephe or via
// SWISSEPH_EPHE_PATH. No ephemeris binaries are bundled in this patch.
const swe = require('sweph');
const { constants: C } = swe;
const path = require('path');
const fs = require('fs');

const RASIS = ['மேஷம்','ரிஷபம்','மிதுனம்','கடகம்','சிம்மம்','கன்னி','துலாம்','விருச்சிகம்','தனுசு','மகரம்','கும்பம்','மீனம்'];
const NAKSHATRAS = ['அஸ்வினி','பரணி','கார்த்திகை','ரோகிணி','மிருகசீரிடம்','திருவாதிரை','புனர்பூசம்','பூசம்','ஆயில்யம்','மகம்','பூரம்','உத்திரம்','ஹஸ்தம்','சித்திரை','சுவாதி','விசாகம்','அனுஷம்','கேட்டை','மூலம்','பூராடம்','உத்திராடம்','திருவோணம்','அவிட்டம்','சதயம்','பூரட்டாதி','உத்திரட்டாதி','ரேவதி'];
const NAK_LORDS = ['கேது','சுக்கிரன்','சூரியன்','சந்திரன்','செவ்வாய்','ராகு','குரு','சனி','புதன்'];
const PLANETS = [
  ['சூரியன்', C.SE_SUN], ['சந்திரன்', C.SE_MOON], ['செவ்வாய்', C.SE_MARS], ['புதன்', C.SE_MERCURY],
  ['குரு', C.SE_JUPITER], ['சுக்கிரன்', C.SE_VENUS], ['சனி', C.SE_SATURN]
];
const nodeId = C.SE_MEAN_NODE;
function norm360(x){ x%=360; return x<0?x+360:x; }
function zodiac(lon){ const x=norm360(lon), i=Math.floor(x/30), d=x-i*30; return {index:i,sign:RASIS[i],degree:d}; }
function degText(x){ const z=zodiac(x), d=Math.floor(z.degree), m=Math.floor((z.degree-d)*60); return `${String(d).padStart(2,'0')}° ${String(m).padStart(2,'0')}′`; }
function nakshatra(lon){ const span=360/27, q=norm360(lon), i=Math.floor(q/span), within=q-i*span; return {index:i,name:NAKSHATRAS[i],pada:Math.floor(within/(span/4))+1,lord:NAK_LORDS[i%9]}; }
function navamsa(lon){
  const q=norm360(lon), r=Math.floor(q/30), part=Math.min(8,Math.floor((q%30)/(30/9)));
  const start=r%3===0?r:r%3===1?(r+8)%12:(r+4)%12;
  return {rasi:RASIS[(start+part)%12],pada:part+1};
}
function setEphe(){
  const configured=process.env.SWISSEPH_EPHE_PATH || '';
  const candidates=[
    configured ? path.resolve(process.cwd(), configured) : null,
    configured ? path.resolve(__dirname, configured) : null,
    path.join(__dirname,'ephe'),
    path.join(process.cwd(),'ephe')
  ].filter(Boolean);
  const ephe=candidates.find(p=>fs.existsSync(p)) || candidates[0];
  swe.set_ephe_path(ephe);
  return ephe;
}
function hasSwissEpheFiles(ephe){
  return fs.existsSync(path.join(ephe,'sepl_18.se1')) && fs.existsSync(path.join(ephe,'semo_18.se1'));
}
function fail(result, what){
  if(!result) throw new Error(`${what}: Swiss Ephemeris returned no result`);
  if(result.error) throw new Error(`${what}: ${result.error}`);
  if(result.flag !== undefined && Number(result.flag) < 0) throw new Error(`${what}: Swiss Ephemeris calculation failed (flag ${result.flag})`);
  if(!Array.isArray(result.data) || !Number.isFinite(Number(result.data[0]))) throw new Error(`${what}: Swiss Ephemeris returned invalid data`);
}
function calcPlanetSafe(jdEt,id,flags,moshierFlags,name,useSwissFiles){
  let r=swe.calc(jdEt,id,flags);
  try{ fail(r,name); return {result:r,mode:useSwissFiles?'SWIEPH':'MOSEPH'}; }
  catch(primaryErr){
    const fallback=swe.calc(jdEt,id,moshierFlags);
    try{ fail(fallback,`${name} (Moshier fallback)`); return {result:fallback,mode:'MOSEPH'}; }
    catch(fallbackErr){
      throw new Error(`${name}: Swiss Ephemeris calculation failed. Primary=${primaryErr.message}; Fallback=${fallbackErr.message}`);
    }
  }
}
function extractPoint(points, keyNames, index){
  for(const k of keyNames){ const v=points?.[k]; if(Array.isArray(v) && Number.isFinite(v[0])) return v[0]; if(Number.isFinite(v)) return v; }
  if(Array.isArray(points) && Number.isFinite(points[index])) return points[index];
  return null;
}
function houseFromCusps(lon,cusps){
  const x=norm360(lon);
  for(let i=0;i<12;i++){
    const a=norm360(cusps[i]), b=norm360(cusps[(i+1)%12]);
    const span=norm360(b-a), pos=norm360(x-a);
    if(pos < (span===0?360:span)) return i+1;
  }
  return 12;
}
function midpointArc(a,b){
  return norm360(a + norm360(b-a)/2);
}
function bhavaDetails(cusps){
  return cusps.map((c,i)=>{
    const prev=cusps[(i+11)%12], next=cusps[(i+1)%12];
    const arambha=midpointArc(prev,c), antya=midpointArc(c,next);
    return {
      house:i+1,
      arambhaLongitude:Number(arambha.toFixed(8)),
      arambha:degText(arambha),
      longitude:Number(c.toFixed(8)),
      degree:degText(c),
      madhya:degText(c),
      rasi:zodiac(c).sign,
      rasiIndex:zodiac(c).index,
      nakshatra:nakshatra(c).name,
      antyaLongitude:Number(antya.toFixed(8)),
      antya:degText(antya)
    };
  });
}

function calculateSwiss({date,time,lat,lon,height=0,houseSystem,timezone='Asia/Kolkata',utcOffsetMinutes=330}){
  const ds=String(date||''); const ts=String(time||'');
  const m=ts.match(/^(\d{1,2}):(\d{2})$/); if(!/^\d{4}-\d{2}-\d{2}$/.test(ds)||!m) throw new Error('பிறந்த தேதி / நேரம் சரியாக உள்ளிடவும்.');
  const hh=Number(m[1]), mm=Number(m[2]); if(hh>23||mm>59) throw new Error('பிறந்த நேரம் சரியாக உள்ளிடவும்.');
  const latitude=Number(lat), longitude=Number(lon); if(!Number.isFinite(latitude)||latitude<-90||latitude>90||!Number.isFinite(longitude)||longitude<-180||longitude>180) throw new Error('Latitude / Longitude சரியாக உள்ளிடவும்.');
  const [y,mo,d]=ds.split('-').map(Number);
  const offsetMinutes=Number(utcOffsetMinutes);
  if(!Number.isFinite(offsetMinutes) || offsetMinutes < -720 || offsetMinutes > 840) throw new Error('UTC offset சரியாக உள்ளிடவும்.');
  const localTotal=hh*60+mm;
  const utcTotal=localTotal-offsetMinutes;
  const dayShift=Math.floor(utcTotal/1440);
  const normalized=((utcTotal%1440)+1440)%1440;
  const utcBase=new Date(Date.UTC(y,mo-1,d));
  utcBase.setUTCDate(utcBase.getUTCDate()+dayShift);
  const uy=utcBase.getUTCFullYear(), umo=utcBase.getUTCMonth()+1, ud=utcBase.getUTCDate();
  const uhh=Math.floor(normalized/60), umm=normalized%60;
  const utc=swe.utc_to_jd(uy,umo,ud,uhh,umm,0,C.SE_GREG_CAL); fail(utc,'UTC/JD');
  const [jdEt,jdUt]=utc.data;
  const ephePath=setEphe();
  if(typeof swe.set_sid_mode==='function' && C.SE_SIDM_LAHIRI!==undefined) swe.set_sid_mode(C.SE_SIDM_LAHIRI, 0, 0);
  const useSwissFiles=hasSwissEpheFiles(ephePath);
  const epheFlag=useSwissFiles ? C.SEFLG_SWIEPH : C.SEFLG_MOSEPH;
  const flags=epheFlag|C.SEFLG_SIDEREAL|C.SEFLG_SPEED;
  const moshierFlags=C.SEFLG_MOSEPH|C.SEFLG_SIDEREAL|C.SEFLG_SPEED;
  const planets=[];
  let calculationMode=useSwissFiles?'SWIEPH':'MOSEPH';
  for(const [ta,id] of PLANETS){ const calc=calcPlanetSafe(jdEt,id,flags,moshierFlags,ta,useSwissFiles); const r=calc.result; calculationMode=calc.mode==='MOSEPH'?'MOSEPH':calculationMode; const sid=norm360(r.data[0]); const z=zodiac(sid), nk=nakshatra(sid); planets.push({name:ta,longitude:Number(sid.toFixed(8)),degree:degText(sid),rasi:z.sign,nakshatra:nk.name,pada:nk.pada,lord:nk.lord,speed:Number((r.data[3]||0).toFixed(8)),navamsa:navamsa(sid)}); }
  const nodeCalc=calcPlanetSafe(jdEt,nodeId,flags,moshierFlags,'ராகு',useSwissFiles); calculationMode=nodeCalc.mode==='MOSEPH'?'MOSEPH':calculationMode; const rn=nodeCalc.result; const rahu=norm360(rn.data[0]), ketu=norm360(rahu+180);
  for(const [name,sid] of [['ராகு',rahu],['கேது',ketu]]){ const z=zodiac(sid), nk=nakshatra(sid); planets.push({name,longitude:Number(sid.toFixed(8)),degree:degText(sid),rasi:z.sign,nakshatra:nk.name,pada:nk.pada,lord:nk.lord,speed:0,navamsa:navamsa(sid)}); }
  // Numeric Lahiri ayanamsa for the UI. sweph returns {flag,error,data}.
  // Keep the label separate so the frontend can safely format the numeric value.
  // sweph 2.10.3-7 bindings may expose swe_get_ayanamsa_ut() as either
  // a numeric return value or an Ayanamsa result object { flag, error, data }.
  // Normalize both forms instead of assuming .data is always present.
  const ayRes = typeof swe.get_ayanamsa_ut === 'function' ? swe.get_ayanamsa_ut(jdUt) : null;
  let ayanamsaValue = null;
  if(Number.isFinite(Number(ayRes))){
    ayanamsaValue = Number(ayRes);
  } else if(ayRes && typeof ayRes === 'object'){
    if(ayRes.error) throw new Error(`அயனாம்சம்: ${ayRes.error}`);
    if(ayRes.flag !== undefined && Number(ayRes.flag) < 0) throw new Error(`அயனாம்சம்: Swiss Ephemeris failed (flag ${ayRes.flag})`);
    const rawAyan = Array.isArray(ayRes.data) ? ayRes.data[0] : ayRes.data;
    if(Number.isFinite(Number(rawAyan))) ayanamsaValue = Number(rawAyan);
  }
  if(!Number.isFinite(ayanamsaValue)){
    throw new Error('அயனாம்சம்: Swiss Ephemeris returned invalid data');
  }
  const hs=houseSystem || process.env.HOUSE_SYSTEM || 'S';
  const hres=swe.houses_ex2(jdUt, C.SEFLG_SIDEREAL, latitude, longitude, hs);
  // houses_ex2() returns data as an object { houses, points }, unlike calc()/utc_to_jd()
  // which return data as an array. Do NOT pass a house result through the generic
  // array validator; that was the cause of the current "returned invalid data" error.
  if(!hres) throw new Error('பாவ/லக்னம்: Swiss Ephemeris returned no result');
  if(hres.error) throw new Error(`பாவ/லக்னம்: ${hres.error}`);
  if(hres.flag !== undefined && Number(hres.flag) < 0) throw new Error(`பாவ/லக்னம்: Swiss Ephemeris house calculation failed (flag ${hres.flag})`);
  const hd=hres.data||{};
  if(!hd || typeof hd !== 'object') throw new Error('பாவ/லக்னம்: Swiss Ephemeris returned invalid house data');
  const rawCusps=hd.houses || hd.cusps || [];
  let sourceCusps=[];
  if(Array.isArray(rawCusps)) sourceCusps=rawCusps;
  else if(rawCusps && typeof rawCusps==='object'){
    if(Array.isArray(rawCusps.houses)) sourceCusps=rawCusps.houses;
    else if(Array.isArray(rawCusps.cusps)) sourceCusps=rawCusps.cusps;
    else sourceCusps=Array.from({length:13},(_,i)=>rawCusps[i] ?? rawCusps[String(i)]);
  }
  const oneBased=sourceCusps.length>=13;
  const cusps=Array.from({length:12},(_,i)=>norm360(Number(sourceCusps[oneBased?i+1:i])));
  if(cusps.some(x=>!Number.isFinite(x))) throw new Error('பாவ/லக்னம்: Swiss Ephemeris returned invalid house cusps.');
  if(cusps.some(x=>!Number.isFinite(x))) throw new Error('Swiss Ephemeris returned invalid house cusps.');
  const points=hd.points||hd.ascmc||{}; const asc=extractPoint(points,['ascendant','ASC','asc'],0); const mc=extractPoint(points,['mc','MC','mediumCoeli'],1);
  const ascLon=Number.isFinite(asc)?norm360(asc):cusps[0];
  const ascZ=zodiac(ascLon), ascNk=nakshatra(ascLon);
  const bhavas=bhavaDetails(cusps);
  const enriched=planets.map(p=>({...p,bhava:houseFromCusps(p.longitude,cusps)}));
  const d9Lagna=navamsa(ascLon);
  const moon=enriched.find(p=>p.name==='சந்திரன்');
  return {
    ok:true, engine:'Swiss Ephemeris', engineVersion:'sweph 2.10.3-7 / Swiss Ephemeris 2.10.03', ephemerisMode:calculationMode, ephemerisFilesPresent:useSwissFiles, zodiac:'Sidereal', ayanamsa:ayanamsaValue, ayanamsaName:'Lahiri', houseSystem:hs==='S'?'Sripati':hs==='P'?'Placidus':hs, ephemerisPath:process.env.SWISSEPH_EPHE_PATH||'./ephe',
    birth:{date,time,timezone,utcOffsetMinutes:offsetMinutes,utcDate:`${uy}-${String(umo).padStart(2,'0')}-${String(ud).padStart(2,'0')}`,utcTime:`${String(uhh).padStart(2,'0')}:${String(umm).padStart(2,'0')}`,latitude,longitude,utc_jd:Number(jdUt.toFixed(8)),et_jd:Number(jdEt.toFixed(8))},
    lagna:{longitude:Number(ascLon.toFixed(8)),degree:degText(ascLon),rasi:ascZ.sign,nakshatra:ascNk.name,pada:ascNk.pada,mc:Number.isFinite(mc)?Number(norm360(mc).toFixed(8)):null},
    moonRasi:moon.rasi,moonNakshatra:moon.nakshatra,moonPada:moon.pada,
    planets:enriched,
    bhavas,
    navamsa:{lagna:d9Lagna,planets:[{name:'லக்னம்',longitude:ascLon,degree:degText(ascLon),rasi:ascZ.sign,navamsa:d9Lagna,bhava:1},...enriched]},
    swissValidation:{latitude:Number(latitude.toFixed(8)),longitude:Number(longitude.toFixed(8)),utcJd:Number(jdUt.toFixed(8)),ayanamsaMode:'Lahiri',houseSystem:hs,timezone,utcOffsetMinutes:offsetMinutes,ephemerisPath:ephePath,ephemerisFilesPresent:useSwissFiles,ascendantSource:'Swiss Ephemeris houses_ex2()',houseCuspSource:'Swiss Ephemeris houses_ex2()'},
    calculatedAt:new Date().toISOString()
  };
}
module.exports={calculateSwiss};
