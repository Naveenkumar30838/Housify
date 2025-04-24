// Used to Generate Url of house Images and save them in a ImageUrl.json file , for running this file via node add this key in the package.json file, "type": "module"

import { createClient } from 'pexels';
import dotenv from 'dotenv';
import fs from 'fs';
const client = createClient(process.env.API_KEY);
const query = 'house';

async function searchPhotos() {
    try {
        const response = await client.photos.search({ query, per_page: 232320 });
        const arr =[]
        for (const photo of response.photos){
            arr.push(photo.url)
        }
        
        fs.writeFileSync('ImageUrl.json', JSON.stringify(arr, null, 2));
    } catch (error) {
        console.error('Error fetching photos:', error);
    }
}

searchPhotos();