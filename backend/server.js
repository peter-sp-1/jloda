import express from 'express';
import cors from 'cors';
import ytdl from 'ytdl-core'; // Youtube download library

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());  // Enable CORS for frontend to make requests

// Download route
app.get('/download', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl) {
    return res.status(400).send('No URL provided');
  }

  try {
    const videoStream = ytdl(videoUrl, {
      quality: 'highestvideo',  // or you can choose 'highestaudio' for audio-only downloads
      filter: 'audioandvideo',
    });

    res.header('Content-Disposition', 'attachment; filename="video.mp4"');  // Default file name
    res.header('Content-Type', 'video/mp4');
    videoStream.pipe(res);  // Pipe the video download to the client
  } catch (error) {
    console.error('Error downloading video:', error);
    res.status(500).send('Failed to download the video');
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
