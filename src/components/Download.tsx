import React, { useEffect, useState } from "react";
import Searchbar from "./Search";

const DownloadPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const apiKey = "";
  const channelId = "";

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (query = "") => {
    const url = query
      ? `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=10`
      : `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

    const response = await fetch(url);
    const data = await response.json();
    setVideos(data.items || []);
    setNoResults(!data.items || data.items.length === 0);
  };

  const handleDownload = async (videoId: any) => {
    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    try {
      // Fetch the video from the backend download route
      const response = await fetch(`https://142e-105-112-225-78.ngrok-free.app/download?url=${encodeURIComponent(videoUrl)}`, {
        method: 'GET',
      });
  
      if (!response.ok) {
        throw new Error("Failed to download the video.");
      }
  
      // Convert response to a Blob, which will contain the video data
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
  
      // Create a temporary anchor element to trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = "video.mp4"; // Set a default filename
      document.body.appendChild(a);
      a.click();
  
      // Clean up by removing the element and revoking the URL
      a.remove();
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Error downloading the video:", error);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center text-center bg-black relative overflow-hidden">
      <Searchbar onSearch={fetchVideos} />
      <div className="mt-[60px]">
        <h1 className="font-bold text-white mb-5">
          IT'S YOUR VIDEO! Watch it! Download it!
        </h1>
        <div className="relative h-full w-1/3 bg-slate-950">
          {/* Right-side gradient */}
          <div className="absolute bottom-0 left-[-20%] right-0 top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
          <div className="absolute bottom-0 right-[-20%] top-[-10%] h-[500px] w-[500px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]" />
        </div>

        {noResults ? (
          <div className="text-white mt-8">
            <p>No results found. Try another keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {videos.map((video) => (
              <div key={video.id.videoId || video.id} className="p-2">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${video.id.videoId || video.id}`}
                  title={video.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
                <p className="text-white mt-2">{video.snippet.title}</p>
                <button
                  onClick={() => handleDownload(video.id.videoId || video.id)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
