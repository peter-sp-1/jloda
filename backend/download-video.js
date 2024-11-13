// Import necessary modules
import ytdl from 'ytdl-core';
import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define the YouTube video URL
const videoUrl = 'https://www.youtube.com/shorts/Hzt7WrqtobE';

// Use __dirname in an ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Function to download and convert the video
const downloadAndConvertVideo = async (url) => {
  try {
    console.log('Starting download...');
    
    // Define the output paths
    const outputVideoPath = path.resolve(__dirname, 'video.mp4');
    const tempVideoPath = path.resolve(__dirname, 'video_temp.mp4');

    // Start downloading the video using ytdl
    const videoStream = ytdl(url, { 
        quality: 'highestvideo',
        requestOptions: { headers: { 'User-Agent': 'Mozilla/5.0' } }
      });
      

    // Pipe to temporary file
    const tempFile = fs.createWriteStream(tempVideoPath);
    videoStream.pipe(tempFile);

    videoStream.on('end', () => {
      console.log('Download complete! Starting conversion...');

      // Use FFmpeg to copy the temporary video to the final output format
      exec(`ffmpeg -i ${tempVideoPath} -c copy ${outputVideoPath}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error during conversion: ${error.message}`);
          return;
        }

        console.log('Conversion complete!');
        console.log(`Video saved to ${outputVideoPath}`);
        
        // Optional: log FFmpeg command output for debugging
        console.log('FFmpeg output:', stdout);
        console.log('FFmpeg error (if any):', stderr);

        // Delete the temporary file
        fs.unlinkSync(tempVideoPath);
      });
    });

    // Handle any download errors
    videoStream.on('error', (err) => {
      console.error('Error during video download:', err.message);
    });

  } catch (error) {
    console.error(`Failed to download or convert video: ${error.message}`);
  }
};

// Run the function
downloadAndConvertVideo(videoUrl);
