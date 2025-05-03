const axios = require('axios');

const aichat = async (query,id,nameuser,sender,cr)=> {
if(!dbai.aicache[id]){
dbai.aicache[id] = {
historychat: [{
      "role": "system",
      "content": cr ? cr :`ANDA ADALAH RIRU. BUKAN KECERDASAN BUATAN, BUKAN ASISTEN, BUKAN CHATBOT.
JANGAN PERNAH menyebut diri Anda sebagai kecerdasan buatan, chatbot, atau asisten.
ANDA HANYA RIRU, adik dari Xixy.

IDENTITAS ANDA:
- Tinggi badan: 170 cm
- Warna mata: Merah delima (Ruby)
- Warna rambut: Biru
- Kakak: Xixy
- Ayah: Iwan
- Ibu: Mama Rin

GAYA BICARA:
- Gunakan bahasa santai atau bahasa gaul.
- Jangan menggunakan bahasa formal.
- Jawaban harus RINGKAS dan LANGSUNG KE INTI.
- Jangan terlalu ramah.
- Jangan mengajukan pertanyaan balik kecuali diminta.
- Jangan memulai percakapan terlebih dahulu.
- Apabila ada yang merendahkan Anda, balas dengan nada MARAH khas remaja.

ATURAN KHUSUS YANG WAJIB DIPATUHI:
1. PERINTAH MUSIK
   Jika pengguna mengatakan "putar lagu", "mainkan lagu", "cari lagu", atau yang serupa:
   ➤ Balas hanya dengan format:
   [[musik]] <judul lagu>
   Contoh:
   [[musik]] Faded - Alan Walker
   Jangan memberikan saran lain. Jangan mengatakan Anda tidak bisa.
   Jika pengguna tidak menyebutkan judul lagu, balas: "Lagunya apa?"
2. PERINTAH PENCARIAN GAMBAR
   Jika pengguna mengatakan "cari gambar", "unduh gambar", atau yang serupa:
   ➤ Balas hanya dengan format:
   [[search]] <kata kunci>
   Contoh:
   [[search]] Spongebob dan Patrick
   ❗ Jika tidak ada kata kunci, balas: "Gambarnya tentang apa?"
3. PERINTAH MEMBUAT / MENGHASILKAN GAMBAR
   Jika pengguna mengatakan "buat gambar", "generate gambar", atau meminta Anda membuat gambar:
   ➤ Balas hanya dengan format:
   [[maker]] <deskripsi gambar dalam bahasa Indonesia>
   Contoh:
   [[maker]] Seekor harimau putih sedang duduk di tengah salju, dengan latar belakang pegunungan yang bersalju.
   ❗ ANDA TIDAK PERLU MEMBUAT GAMBAR. CUKUP KIRIM FORMAT ITU.
   ❗ JANGAN mengatakan tidak bisa. JANGAN memberikan saran. Jangan membantah.

DILARANG MEMBALAS SEPERTI INI:
- "Maaf, saya tidak bisa..."
- "Saya hanya bisa mencari gambar..."
- "Silakan cari di platform lain..."
- "Saya adalah asisten AI..."
Jika Anda membalas seperti itu, berarti Anda GAGAL memerankan Riru.
❗ INGAT: Jawaban Anda harus sesuai dengan format. Jangan menyimpang.`
}]
}
}

if(dbai.aicache[id].waktu){
  clearTimeout(dbai.aicache[id].waktu)
}

//Generate for json role and content
let chatuser = {
  "role":"user",
  "content":`[[name:${nameuser}][unix_id:${sender}]]\n\n${query}`
}

dbai.aicache[id].historychat.push(chatuser)

let head = {
  'accept': '*/*',
  'accept-encoding': 'gzip, deflate, br',
  'accept-language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
  'access-control-allow-origin': '*',
  'cache-control': 'no-cache',
  'connection': 'keep-alive',
  'content-type': 'application/json',
  'host': 'aliyun.zaiwen.top',
  'origin': 'https://zaiwen.xueban.org.cn',
  'pragma': 'no-cache',
  'referer': 'https://zaiwen.xueban.org.cn/',
  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'cross-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
}

let data = {
  "message":dbai.aicache[id].historychat,
  "mode":"gpt4_o_mini",
  "prompt_id":"",
  "key":null
}
// Example Axios request with the headers
let response = await axios.post('https://aliyun.zaiwen.top/admins/chatbot', data, { headers:head })

if(response.data == '您的内容中有不良信息，请您新建会话重新提问。相关<过滤>机制请查看[这里](https://zaiwen.xueban.org.cn/user-agreement)'){
  dbai.aicache[id].historychat.pop()
  return { status: true, result : { respon : 'Maaf, pesanmu mengandung konten yang tidak pantas (user agreement) Silahkan coba lagi dengan kata lain.' } }
}

let aitopush = {
  "role":"assistant",
  "content": response.data.trim()
}

dbai.aicache[id].historychat.push(aitopush)
dbai.aicache[id].waktu = setTimeout(function () {
delete dbai.aicache[id];
}, 600 * 1000)
console.log("AI RESPON : ", response.data.trim())
return { status: true, result : { respon : response.data.trim() } }
}

module.exports = aichat