import fs from 'fs-extra';
import axios from 'axios'
import { getImageSize } from './getImageSize.js';
import {log, time} from './log.js';

const endTime = time(``);

const {writeJSON} = fs

const INITIAL_ID_XKCD_COMIC = 2580;
const MAX_ID_XKCD_COMICS = 2587;

const indexFileContent =[]

for(let id = INITIAL_ID_XKCD_COMIC; id < MAX_ID_XKCD_COMICS; id++ ){
    const url = `https://xkcd.com/${id}/info.0.json`
    log(`Fetching${url}...`)
    const { data } = await axios.get(url)
    const {num, news, transcript,img,  ...restOfComit } = data
    log(`Fetched comic #${num}. Getting image dimnesions...`)
    const {height, width} = await getImageSize({ url: img})
    log(`Got image dimensions: ${width}x${height}`)
    const  comicToStore = {
        id,
        img,
        height,
        width,
        ...restOfComit
    }

    indexFileContent.push(comicToStore)
    const jsonFile = `./comics/${id}.json`
    await writeJSON(`./comics/${id}.json`, comicToStore)
    log(`Wrote ${jsonFile}!\n`)
}

await writeJSON('./comics/index.json', indexFileContent)
log(`Wrote Index Content!\n`)

endTime()