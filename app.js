const admin = require("firebase-admin");
const os = require("os-utils");
const serviceAccount = require("./serviceAccountKey.json");

// ✅ เช็คให้ชัวร์ว่ามี " " ครอบ URL และมี }); ปิดท้ายบล็อกนี้
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ienas-cloud-default-rtdb.asia-southeast1.firebasedatabase.app/"
});

const db = admin.database();
const ref = db.ref("nas_status");

console.log("🚀 Precision 5810 กำลังเริ่มส่งข้อมูลไป Firebase...");

setInterval(() => {
  os.cpuUsage((v) => {
    const status = {
      cpu_usage: (v * 100).toFixed(2) + "%",
      free_mem: (os.freememPercentage() * 100).toFixed(2) + "%",
      uptime_hr: (os.sysUptime() / 3600).toFixed(2),
      last_update: new Date().toLocaleString("th-TH", { timeZone: "Asia/Bangkok" }),
      student_id: "68030271"
    };

    ref.set(status)
      .then(() => console.log(`✅ [${status.last_update}] ข้อมูลถูกส่งไป Cloud แล้ว!`))
      .catch((err) => console.error("❌ พังครับบอส:", err));
  });
}, 60000);
