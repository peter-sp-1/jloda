import ytdl from 'ytdl-core';
import fs from 'fs';

// URL of a public, unrestricted YouTube video
const videoUrl = 'https://www.youtube.com/watch?v=HBc0wyhf68U'; // Use a popular, unrestricted video


// Download video
ytdl(videoUrl, { quality: 'highestvideo' })
  .pipe(fs.createWriteStream('test_video.mp4'))
  .on('finish', () => {
    console.log('Download completed!');
  })
  .on('error', (error) => {
    console.error('Download error:', error.message);
  });
 