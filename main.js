require('./settings.js')
const express = require('express');
const app = express();
const port = process.env.SERVER_PORT || 443
const cors = require('cors');
const axios = require('axios');
const getBuffer = async (url, options) => {
        try {
            options ? options : {}
            const res = await axios({
                method: "get",
                url,
                headers: {
                    'DNT': 1,
                    'Upgrade-Insecure-Request': 1
                },
                ...options,
                responseType: 'arraybuffer'
            })
            return res.data
        } catch (err) {
            return err
        }
    }

const {
  convertCRC16,
  generateTransactionId,
  generateExpirationTime,
  elxyzFile,
  generateQRIS,
  createQRIS,
  checkQRISStatus
} = require('./lib/orkut.js') 
const {instagram, facebook, twitt} = require('./lib/sosmedDl.js')
const {youtubemp3, youtubemp4, yts} = require('./lib/ytdl.js')
const ai = require('./lib/ai.js')

global.dbai = {}
dbai.aicache = {}
global.botstatus = {status : true}

app.use(express.json());
app.use(cors());
// tampilan
// Middleware untuk 404 Not Found
app.use('/foto', express.static(__dirname + '/foto'));
app.get('/', (req, res) => {
  res.sendFile('tampilan/root.html' , { root : __dirname });
})
app.get('/beranda',(req, res) => {
 res.sendFile('tampilan/home.html' , { root : __dirname });
})
app.get('/tentang',(req, res) => {
 res.sendFile('tampilan/tentang.html' , { root : __dirname });
})
app.get('/layanan',(req, res) => {
 res.sendFile('tampilan/layanan.html' , { root : __dirname });
})
app.get('/kontak',(req, res) => {
 res.sendFile('tampilan/kontak.html' , { root : __dirname });
})

app.get('/api',(req, res) => {
 res.sendFile('tampilan/api.html' , { root : __dirname });
})
app.get('/produk',(req, res) => {
 res.sendFile('tampilan/produk.html' , { root : __dirname });
})
app.get('/produk2',(req, res) =>{
  res.sendFile('tampilan/produk2.html' , { root : __dirname });  
})

// authuser

//baca db
app.get('/user/readUsr/:id', async  (req, res) => {
    const apikey = req.query.apikey;
    if (apikey == adminkey){
  const db = require('./db/dbuser.json');
  res.json(db)
    }else{
        res.send({status:false, message:'Key salah'})
    }
})

app.post('/user/auth',async (req, res) =>{
const db = require('./db/dbuser.json');
const {username, password} = req.body;
let alluser = Object.keys(db)
if (username && password){
  if(alluser.includes(username)){
    if(db[username] === password){
      res.send({status: true, message:'Login Success'})
    }else{
      res.send({status: false, message:'Password Salah'})
    } 
  }else{
    res.send({status: false, message:'Username Tidak Terdaftar'})
  }
}else{
  res.send({status: false, message:'Anda Ngawur'})
}
});

app.post('/user/add',async (req, res) =>{
const db = require('./db/dbuser.json');
const {username, password, key} = req.body;
if(key === adminkey){
let alluser = Object.keys(db)
if (username && password){
  if(alluser.includes(username)){
    res.send({status: false, message:'Username Sudah Terdaftar'})
  }else{
    if(username.length > 12)return res.send({status: false, message:'Username Terlalu Panjang'})
    if(password.length > 12)return res.send({status: false, message:'Password Terlalu Panjang'})
    db[username] = password;
    //console.log(db)
    await fs.writeFileSync('./db/dbuser.json', JSON.stringify(db,null,1));
    res.send({status: true, message:'Berhasil Menambahkan User'})
  }
}else{
  res.send({status: false, message:'Anda Ngawur'})
}
}else{
  res.send({status: false, message:'Key Salah'})
}
});

app.get('/user/del/:id', async  (req, res) => {
  const username = req.query.username;
   const apikey = req.query.apikey;
  if (apikey == adminkey){
  let db = require('./db/dbuser.json');
  let alluser = Object.keys(db)
  if(!alluser.includes(username))return res.send({status: false, message:'Username Tidak Terdaftar'})
  delete db[username]
  await fs.writeFileSync('./db/dbuser.json', JSON.stringify(db,null,1));
  res.send({status: true, message:'Berhasil Menghapus User'})
  }else{
        res.send({status:false, message:'Key salah'})
  }
})
//bot status
app.get('/bot/status', async  (req, res) =>{
    res.send(botstatus)
})
app.get('/bot/setstatus', async  (req, res) =>{
    const {apikey , set } = req.query;
    if (apikey == adminkey){
        if(set == 'on'){
            botstatus.status = true
            res.send({status: true, message:'Berhasil Mengubah Status Bot'})
        }else if(set == 'off'){
            botstatus.status = false
            res.send({status: true, message:'Berhasil Mengubah Status Bot'})
        }else{
            res.send({status: false, message:'Status Tidak Valid'})
        }
    }else{
        res.send({status:false, message:'Key salah'})
    }
})
app.post('/bot/info', async  (req, res) =>{
    const { username , botowner , nobot} = req.body;
    if (!username) return
    const telegram = require('node-telegram-bot-api');
    const token = tokenbot
    const bot = new telegram(token, { polling: false });
    bot.sendMessage(parseInt(idtele), `   [BOT CONNECTED]\nUsername : ${username}\nowner bot : ${botowner}\nNo Bot : ${nobot}`)

})
//orkut


app.get('/api/orkut/createpayment', async (req, res) => {
    const { apikey, amount } = req.query;
    if (!apikey) {
    return res.json("Isi Parameter Apikey.");
    }
    const check = global.apikey
    if (!check.includes(apikey)) return res.json("Apikey Tidak Valid!.")
    if (!amount) {
    return res.json("Isi Parameter Amount.")
    }
    const { codeqr } = req.query;
    if (!codeqr) {
    return res.json("Isi Parameter CodeQr menggunakan qris code kalian.");
    }
    try {
        const qrData = await createQRIS(amount, codeqr);
        res.json({ status: true, creator: global.creator, result: qrData });        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

//API area
app.get('/api/orkut/cekstatus', async (req, res) => {
    const { merchant, keyorkut } = req.query;
        if (!merchant) {
        return res.json("Isi Parameter Merchant.")
    }
    if (!keyorkut) {
        return res.json("Isi Parameter Keyorkut.");
    }
    try {
        const apiUrl = `https://gateway.okeconnect.com/api/mutasi/qris/${merchant}/${keyorkut}`;
        const response = await axios.get(apiUrl);
        const result = await response.data;
                // Check if data exists and get the latest transaction
        const latestTransaction = result.data && result.data.length > 0 ? result.data[0] : null;
                if (latestTransaction) {
            res.json(latestTransaction);
        } else {
            res.json({ message: "No transactions found." });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

app.get('/api/tiktok', async (req, res) =>{
    const { url } = req.query;
    if (!url) {
        return res.json("Isi Parameter Url.");
    }
    try{
        const tiktokDl = require('./lib/tiktok.js')
        const result = await tiktokDl(url)
        res.json(result)
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})
app.get('/api/instagram', async (req, res) =>{
    const { url } = req.query;
    if (!url) {
        return res.json("Isi Parameter Url.");
    }
    try{
        const result = await instagram(url)
        res.json(result)
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})
app.get('/api/facebook', async (req, res) =>{
    const { url } = req.query;
    if (!url) {
        return res.json("Isi Parameter Url.");
    }
    try{
        const result = await facebook(url)
        res.json(result)
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})
app.get('/api/twitter', async (req, res) =>{
    const { url } = req.query;
    if (!url) {
        return res.json("Isi Parameter Url.");
    }
    try{
        const result = await twitt(url)
        res.json(result)
    }catch (error){
        res.status(500).json({ error: error.message });
    }  
})
app.get('/api/ytmp3', async (req, res) =>{
    const { url } = req.query;
    if (!url) {
        return res.json("Isi Parameter Url.");
    }
    try{
        const result = await youtubemp3(url)
        res.json(result)
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})
app.get('/api/ytmp4', async (req, res) =>{
    const { url } = req.query;
    if (!url) {
        return res.json("Isi Parameter Url.");
    }
    try{
        const result = await youtubemp4(url)
        res.json(result)
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})
app.get('/api/yts', async (req, res) =>{
    const { query } = req.query;
    if (!query) {
        return res.json("Isi Parameter Query.");
    }
    try{
        const result = await yts(query)
        res.json(result)
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})


//ai

app.post('/api/aichat', async (req, res) => {
  const { cmd, id, name, unix ,prompt} = req.body;
  console.log(req.body)
if (!query || !id || !name || !unix) {
 return res.status(400).send({
  status: false,
  error: 'All fields (cmd, id, name, unix) are required.'
});
  }

try {
    let aires = await ai(cmd, id, name, unix, prompt);
    res.send(aires);
  } catch (err) {
    console.error(err);
    res.status(500).send({ status: false, error: 'Internal Server Error' });
  }
});

//image
app.get('/api/smeme',async (req, res) =>{
    const { atas, bawah, image } = req.query;
    if (!atas) {
        return res.json("Isi Parameter atas.");
    }
    if (!bawah) {
        return res.json("Isi Parameter bawah.");
    }
    if (!image) {
        return res.json("Isi Parameter Image.");
    }
    try{
         let smeme = `https://api.memegen.link/images/custom/${encodeURIComponent(atas)}/${encodeURIComponent(bawah)}.png?background=${image}`
        let buff = await getBuffer(smeme)
        res.setHeader('Content-Type', 'image/png')
        res.setHeader('Content-Disposition', 'attachment; filename=smeme.png')
        res.send(buff)
    }catch (error){
        res.status(500).json({ error: error.message });
    }
})
app.get('/api/brat', async (req, res) =>{
    try {     
          const { text } = req.query
          if (!text) return res.json("Isi Parameternya!");
          const image = await getBuffer(`https://brat.caliphdev.com/api/brat?text=${text}`)
          if (!image) res.json("Error!")
          await res.set("Content-Type", "image/png")
          await res.send(image)
        } catch (error) {
            console.log(error);
            res.send(error)
        }
})

app.use((req, res) => {
  res.sendFile('tampilan/error.html',{ root : __dirname});
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
})
