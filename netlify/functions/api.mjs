import { getStore } from "@netlify/blobs";

/* =========================================================
   ตารางเช็คระยะ ZONTES 150X (0–100,000 กม.)
   คัดลอกมาจาก Code.gs เดิมทุกแถว ไม่มีการแก้ไขตัวเลขหรือข้อความใด ๆ
   [ระยะ(กม.), ชื่อรอบ, รายการหลัก(คั่นด้วย ; ), งบต่ำ, งบสูง, งบแนะนำ]
   ========================================================= */
const SCHEDULE = [
  [1000, '1,000 กม. / 3 เดือน', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; เช็คระยะแรก; ขันน็อต/จุดยึด', 500, 900, 700],
  [4000, '4,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; ตรวจกรองอากาศ; ตรวจกรอง CVT; ตรวจเบรก ยาง และช่วงล่าง', 350, 650, 500],
  [8000, '8,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; ตรวจสายพาน CVT; ตรวจชุด CVT', 500, 1000, 800],
  [12000, '12,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว', 1200, 2500, 1800],
  [15000, '15,000 กม.', 'ตรวจ/เปลี่ยนลูกปืนคอตามสภาพและแนวทางคู่มือ', 1200, 2800, 2000],
  [16000, '16,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; ตรวจ CVT; ตรวจเบรก ยาง และช่วงล่าง', 500, 1000, 800],
  [20000, '20,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนหัวเทียน; ตรวจระบบทั่วไป', 650, 1300, 900],
  [24000, '24,000 กม. (รอบใหญ่)', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; เปลี่ยนสายพาน CVT; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว; น้ำหล่อเย็นตามอายุ/ระยะ', 3000, 6000, 4500],
  [28000, '28,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; ตรวจ CVT; ตรวจเบรก ยาง และช่วงล่าง; ตรวจสภาพและรายการที่อาจเคลมก่อนหมดประกัน 3 ปี / 30,000 กม.', 350, 1000, 700],
  [30000, '30,000 กม.', 'ตรวจ/เปลี่ยนลูกปืนคอตามสภาพและแนวทางคู่มือ; ตรวจสถานะประกัน 3 ปี / 30,000 กม. แล้วแต่อย่างใดถึงก่อน', 1200, 2800, 2000],
  [32000, '32,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; ตรวจสายพาน CVT; ตรวจชุด CVT', 500, 1000, 800],
  [36000, '36,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว', 1200, 2500, 1800],
  [40000, '40,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; เปลี่ยนหัวเทียน; ตรวจสายพาน CVT', 650, 1300, 900],
  [44000, '44,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; ตรวจ CVT; ตรวจเบรก ยาง และช่วงล่าง', 350, 650, 500],
  [45000, '45,000 กม.', 'ตรวจ/เปลี่ยนลูกปืนคอตามสภาพและแนวทางคู่มือ', 1200, 2800, 2000],
  [48000, '48,000 กม. (รอบใหญ่)', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; เปลี่ยนสายพาน CVT; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว; น้ำหล่อเย็นตามอายุ/ระยะ', 3000, 6000, 4500],
  [52000, '52,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; ตรวจ CVT; ตรวจเบรก ยาง และช่วงล่าง', 350, 650, 500],
  [56000, '56,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; ตรวจสายพาน CVT; ตรวจชุด CVT', 500, 1000, 800],
  [60000, '60,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว; เปลี่ยนหัวเทียน; ตรวจ/เปลี่ยนลูกปืนคอตามสภาพและแนวทางคู่มือ', 2500, 5200, 3500],
  [64000, '64,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; ตรวจสายพาน CVT; ตรวจชุด CVT', 500, 1000, 800],
  [68000, '68,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; ตรวจ CVT; ตรวจเบรก ยาง และช่วงล่าง', 350, 650, 500],
  [72000, '72,000 กม. (รอบใหญ่)', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; เปลี่ยนสายพาน CVT; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว; น้ำหล่อเย็นตามอายุ/ระยะ', 3000, 6000, 4500],
  [75000, '75,000 กม.', 'ตรวจ/เปลี่ยนลูกปืนคอตามสภาพและแนวทางคู่มือ', 1200, 2800, 2000],
  [76000, '76,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; ตรวจ CVT; ตรวจเบรก ยาง และช่วงล่าง', 350, 650, 500],
  [80000, '80,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; เปลี่ยนหัวเทียน; ตรวจสายพาน CVT; ตรวจชุด CVT', 700, 1500, 1000],
  [84000, '84,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว', 1200, 2500, 1800],
  [88000, '88,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; ตรวจสายพาน CVT; ตรวจชุด CVT', 500, 1000, 800],
  [90000, '90,000 กม.', 'ตรวจ/เปลี่ยนลูกปืนคอตามสภาพและแนวทางคู่มือ', 1200, 2800, 2000],
  [92000, '92,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; ตรวจ CVT; ตรวจเบรก ยาง และช่วงล่าง', 350, 650, 500],
  [96000, '96,000 กม. (รอบใหญ่)', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนกรองน้ำมันเครื่อง; เปลี่ยนสายพาน CVT; เปลี่ยนกรองอากาศ; เปลี่ยนกรอง CVT; เปลี่ยนน้ำมันเฟืองท้าย; ตรวจ/ตั้งวาล์ว; น้ำหล่อเย็นตามอายุ/ระยะ', 3000, 6000, 4500],
  [100000, '100,000 กม.', 'เปลี่ยนน้ำมันเครื่อง; เปลี่ยนหัวเทียน; ตรวจระบบทั่วไป; ตรวจระบบเบรก ช่วงล่าง ระบบไฟ ระบบระบายความร้อน และเสียงผิดปกติ', 800, 1800, 1200]
];

const STORE_NAME = 'zontes150x';
const DATA_KEY = 'app-data';

/* ===== ที่เก็บข้อมูล (Netlify Blobs แทน Google Sheet) ===== */

function getDataStore() {
  // consistency: 'strong' เพื่อให้อ่านค่าล่าสุดได้ทันทีหลังบันทึก (สำคัญสำหรับแอปคนเดียว/ไม่กี่คน)
  return getStore({ name: STORE_NAME, consistency: 'strong' });
}

function defaultHistory() {
  return { done: false, date: '', actualKm: '', cost: '', shop: '', note: '' };
}

function defaultData() {
  return {
    vehicle: { owner: '', plate: '', startDate: '', currentKm: 0 },
    maintenance: {},   // key = ระยะ(กม.) แบบสตริง เช่น "1000"
    extras: []
  };
}

async function loadData(store) {
  const raw = await store.get(DATA_KEY, { type: 'json' });
  if (raw && typeof raw === 'object') {
    return {
      vehicle: { owner: '', plate: '', startDate: '', currentKm: 0, ...(raw.vehicle || {}) },
      maintenance: (raw.maintenance && typeof raw.maintenance === 'object') ? raw.maintenance : {},
      extras: Array.isArray(raw.extras) ? raw.extras : []
    };
  }
  return defaultData();
}

async function saveData(store, data) {
  await store.setJSON(DATA_KEY, data);
}

function nowBangkok() {
  // รูปแบบ "yyyy-MM-dd HH:mm:ss" ตามเวลาไทย (เหมือนพฤติกรรมเดิมของ Code.gs ที่ fallback เป็น Asia/Bangkok)
  return new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' });
}

function newId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') return crypto.randomUUID();
  return 'id-' + Date.now() + '-' + Math.random().toString(16).slice(2);
}

/* ===== ประกอบข้อมูลสำหรับหน้าเว็บ (รูปแบบเดียวกับ getAppData() เดิมทุกฟิลด์) ===== */

function buildRecords(maintenance) {
  return SCHEDULE.map(row => {
    const km = Number(row[0]);
    const h = maintenance[String(km)] || defaultHistory();
    return {
      km,
      label: String(row[1] || ''),
      tasks: String(row[2] || '').split(';').map(x => x.trim()).filter(Boolean),
      estimateLow: Number(row[3]) || 0,
      estimateHigh: Number(row[4]) || 0,
      estimateRecommended: Number(row[5]) || 0,
      done: h.done === true,
      date: String(h.date || ''),
      actualKm: (h.actualKm === '' || h.actualKm === null || typeof h.actualKm === 'undefined') ? '' : Number(h.actualKm) || 0,
      cost: (h.cost === '' || h.cost === null || typeof h.cost === 'undefined') ? '' : Number(h.cost) || 0,
      shop: String(h.shop || ''),
      note: String(h.note || '')
    };
  });
}

function sortedExtras(extras) {
  return extras.slice().sort((a, b) =>
    String(b.date || '').localeCompare(String(a.date || '')) || Number(b.km || 0) - Number(a.km || 0)
  );
}

/* ===== การทำงานของแต่ละ action (ย้ายมาจาก Code.gs เดิม ตรรกะเดียวกันทุกจุด) ===== */

function doGetAppData(data) {
  return {
    vehicle: data.vehicle,
    records: buildRecords(data.maintenance),
    extras: sortedExtras(data.extras),
    updatedAt: nowBangkok()
  };
}

function doSaveVehicleIdentityOnce(data, payload) {
  payload = payload || {};
  const cur = data.vehicle;
  const owner = String(cur.owner || '').trim() || String(payload.owner || '').trim();
  const plate = String(cur.plate || '').trim() || String(payload.plate || '').trim();
  const startDateExisting = cur.startDate;

  if (!owner || !plate || (!startDateExisting && !payload.startDate)) {
    throw new Error('กรุณาระบุชื่อเจ้าของ ทะเบียน และวันที่เริ่มใช้ให้ครบ');
  }

  // อนุญาตให้บันทึกจาก WebApp ได้เฉพาะช่องที่ยังว่างเท่านั้น เหมือนพฤติกรรมเดิม
  if (!String(cur.owner || '').trim()) cur.owner = owner;
  if (!String(cur.plate || '').trim()) cur.plate = plate;
  if (!startDateExisting && payload.startDate) cur.startDate = String(payload.startDate);

  return { owner: cur.owner, plate: cur.plate, startDate: cur.startDate, currentKm: cur.currentKm };
}

function doSaveCurrentKm(data, newKm) {
  const cur = data.vehicle;
  const currentValue = Math.max(0, Number(cur.currentKm) || 0);
  const inputValue = Number(newKm);

  if (!Number.isFinite(inputValue) || inputValue < 0) {
    throw new Error('กรุณาระบุเลขไมล์ให้ถูกต้อง');
  }
  // ป้องกันการกรอกเลขไมล์ย้อนกลับ เหมือนพฤติกรรมเดิม
  if (inputValue < currentValue) {
    throw new Error('เลขไมล์ใหม่ต้องไม่ต่ำกว่าเลขไมล์ปัจจุบัน ' + currentValue.toLocaleString('en-US') + ' กม.');
  }

  cur.currentKm = inputValue;
  return { ok: true, currentKm: inputValue };
}

function doSaveMaintenanceRecord(data, km, patch) {
  patch = patch || {};
  const exists = SCHEDULE.some(r => Number(r[0]) === Number(km));
  if (!exists) throw new Error('ไม่พบระยะ ' + km + ' กม.');

  const key = String(Number(km));
  const cur = data.maintenance[key] ? { ...data.maintenance[key] } : defaultHistory();

  if (Object.prototype.hasOwnProperty.call(patch, 'done')) cur.done = Boolean(patch.done);
  if (Object.prototype.hasOwnProperty.call(patch, 'date')) cur.date = patch.date ? String(patch.date) : '';
  if (Object.prototype.hasOwnProperty.call(patch, 'actualKm')) cur.actualKm = patch.actualKm === '' ? '' : Math.max(0, Number(patch.actualKm) || 0);
  if (Object.prototype.hasOwnProperty.call(patch, 'cost')) cur.cost = patch.cost === '' ? '' : Math.max(0, Number(patch.cost) || 0);
  if (Object.prototype.hasOwnProperty.call(patch, 'shop')) cur.shop = String(patch.shop || '');
  if (Object.prototype.hasOwnProperty.call(patch, 'note')) cur.note = String(patch.note || '');

  if (cur.done === true) {
    if (!cur.date) cur.date = nowBangkok().slice(0, 10);
    if (cur.actualKm === '' || cur.actualKm === null) cur.actualKm = Number(km);
  }

  data.maintenance[key] = cur;
  return { ok: true };
}

function doSaveExtraRecord(data, payload) {
  payload = payload || {};
  const id = String(payload.id || '').trim() || newId();
  const date = String(payload.date || '').trim();
  const item = String(payload.item || '').trim();
  const category = String(payload.category || '').trim();

  if (!date) throw new Error('กรุณาระบุวันที่');
  if (!item) throw new Error('กรุณาระบุรายการที่ทำ');
  if (!category) throw new Error('กรุณาเลือกประเภทงาน');

  const kmRaw = payload.km;
  const costRaw = payload.cost;
  const km = (kmRaw === '' || kmRaw === null || typeof kmRaw === 'undefined') ? '' : Number(kmRaw);
  const cost = (costRaw === '' || costRaw === null || typeof costRaw === 'undefined') ? '' : Number(costRaw);
  if (km !== '' && (!Number.isFinite(km) || km < 0)) throw new Error('เลขไมล์ไม่ถูกต้อง');
  if (cost !== '' && (!Number.isFinite(cost) || cost < 0)) throw new Error('ค่าใช้จ่ายไม่ถูกต้อง');

  const record = {
    id, date, km, category, item,
    cost,
    shop: String(payload.shop || '').trim(),
    note: String(payload.note || '').trim()
  };

  const idx = data.extras.findIndex(x => x.id === id);
  if (idx >= 0) data.extras[idx] = record; else data.extras.push(record);
  return { ok: true, id };
}

function doDeleteExtraRecord(data, id) {
  const target = String(id || '').trim();
  const idx = data.extras.findIndex(x => x.id === target);
  if (idx < 0) throw new Error('ไม่พบบันทึกที่ต้องการลบ');
  data.extras.splice(idx, 1);
  return { ok: true };
}

/* ===== Netlify Function entrypoint ===== */

export default async (req) => {
  if (req.method !== 'POST') {
    return Response.json({ ok: false, error: 'Method not allowed' }, { status: 405 });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: 'รูปแบบคำขอไม่ถูกต้อง' }, { status: 400 });
  }

  const expectedPin = process.env.APP_PIN || '';
  if (!expectedPin) {
    return Response.json({ ok: false, error: 'ยังไม่ได้ตั้งค่า APP_PIN ใน Netlify' }, { status: 500 });
  }
  if (String(body.pin || '') !== expectedPin) {
    return Response.json({ ok: false, error: 'PIN ไม่ถูกต้อง' }, { status: 401 });
  }

  const action = String(body.action || '');
  const args = Array.isArray(body.args) ? body.args : [];

  try {
    const store = getDataStore();
    const data = await loadData(store);

    let result;
    switch (action) {
      case 'getAppData':
        result = doGetAppData(data);
        break;
      case 'saveVehicleIdentityOnce':
        result = doSaveVehicleIdentityOnce(data, args[0]);
        break;
      case 'saveCurrentKm':
        result = doSaveCurrentKm(data, args[0]);
        break;
      case 'saveVehicleInfo': // เก็บไว้เพื่อความเข้ากันได้กับเวอร์ชันเก่า เหมือน Code.gs เดิม
        doSaveCurrentKm(data, args[0] && args[0].currentKm);
        result = { ok: true };
        break;
      case 'saveMaintenanceRecord':
        result = doSaveMaintenanceRecord(data, args[0], args[1]);
        break;
      case 'saveExtraRecord':
        result = doSaveExtraRecord(data, args[0]);
        break;
      case 'deleteExtraRecord':
        result = doDeleteExtraRecord(data, args[0]);
        break;
      default:
        return Response.json({ ok: false, error: 'Unknown action' }, { status: 400 });
    }

    // บันทึกทุกครั้งท้ายสุด (รวมถึง getAppData เพื่อให้ Blob ถูกสร้างไว้ตั้งแต่ครั้งแรกที่เปิดแอป)
    await saveData(store, data);

    return Response.json({ ok: true, result }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    return Response.json({
      ok: false,
      error: (err && err.message) ? err.message : String(err || 'เกิดข้อผิดพลาด')
    }, { status: 400 });
  }
};
