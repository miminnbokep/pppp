const { search, ytmp3, ytmp4, ytdlv2, channel } = require('@vreden/youtube_scraper');

const youtubemp3 = async (url) =>{
    const result = await ytmp3(url);
    //return console.log(result
    let data = {
        title: result.metadata.title,
        thumbnail: result.metadata.thumbnail,
        author: result.metadata.author,
        duration: result.metadata.duration,
    download : result.download
    
    }
  return data
}
const youtubemp4 = async (url) =>{
    const result = await ytmp4(url);
    //return console.log(result
    let data = {
        title: result.metadata.title,
        thumbnail: result.metadata.thumbnail,
        author: result.metadata.author,
        duration: result.metadata.duration,
        download : result.download
    }
  return data
}

const yts = async (query) =>{
    const result = await search(query);
  return result
 
}
module.exports = { youtubemp3, youtubemp4, yts }