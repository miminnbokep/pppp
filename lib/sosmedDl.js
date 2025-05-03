const {aio, igdl, fbdown, ttdl, twitter, youtube} = require('btch-downloader')


const instagram = async (url) =>{
  let data = await igdl(url)
  let result = {
      status: true,
      creator: "Gurita Darat",
      thumb : data.map((item) => item.thumbnail),
      url :data.map((item) => item.url),
  }
  return result
}

const facebook = async (url) =>{
  let data = await fbdown(url)
  let result = {
      status: true,
      creator: "Gurita Darat",
      SD : data.Normal_video,
      HD : data.HD
  }
 return result
}
const twitt = async (url) => {
  const data = await twitter(url)
  const result = {
    status: true,
    creator: "Gurita Darat",
    judul: data.title,
    HD : data.url[0].hd,
    SD : data.url[0].sd
  }
  return result
}

module.exports = {instagram, facebook, twitt}
