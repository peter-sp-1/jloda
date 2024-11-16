import React, { useEffect, useState } from "react";
import axios from "axios";
import Searchbar from "./Search";

const DownloadPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp4");  // Default format is "mp4"
  const apiKey = import.meta.env.VITE_API_KEY;  
  const channelId = import.meta.env.VITE_APP_CHANNEL_ID;

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (query = "") => {
    setIsLoading(true);
    try {
      const requestUrl = query
        ? `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=10`
        : `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

      const response = await fetch(requestUrl);
      const data = await response.json();

      setVideos(data.items || []);
      setNoResults(!data.items || data.items.length === 0);
    } catch (error) {
      console.error("Error fetching videos:", error);
      setNoResults(true);
    } finally {
      setIsLoading(false);
    } 
  };

  const handleDownload = async (videoUrl: string): Promise<void> => {
    try {
      setStatus("Starting download...");
      const response = await axios.post(
        "https://70e9-102-91-102-175.ngrok-free.app/download", 
        { url: videoUrl, format: selectedFormat }, 
        { responseType: "blob" }
      );

      // Prepare and trigger download
      const downloadLink = document.createElement("a");
      const url = window.URL.createObjectURL(response.data);
      downloadLink.href = url;
      downloadLink.setAttribute('download', `downloaded_video.${selectedFormat}`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setStatus("Download successful!");
    } catch (error: any) {
      setStatus("Download failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center text-center bg-black relative overflow-hidden">
      <Searchbar onSearch={fetchVideos} />
      <div className="mt-[60px]">
        <h1 className="font-bold text-white mb-5">
          IT'S YOUR VIDEO! Watch it! Download it!
        </h1>

        {/* Dropdown for format selection */}
        <div className="mt-4">
          <label htmlFor="format-select" className="text-white mr-2">
            Choose format:
          </label>
          <select 
            id="format-select" 
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="px-2 py-1 rounded bg-gray-800 text-white"
          >
            <option value="mp4">MP4</option>
            <option value="mp3">MP3</option>
          </select>
        </div>

        {isLoading ? (
          <div className="text-white mt-8">
            <p>Loading videos...</p>
          </div>
        ) : noResults ? (
          <div className="text-white mt-8">
            <p>No results found. Try another keyword.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {videos.map((video) => (
              <div key={video.id.videoId} className="p-2">
                <iframe
                  width="100%"
                  height="200"
                  src={`https://www.youtube.com/embed/${video.id.videoId}`}
                  title={video.snippet.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
                <p className="text-white mt-2">{video.snippet.title}</p>
                <button
                  onClick={() => handleDownload(`https://www.youtube.com/watch?v=${video.id.videoId}`)}
                  className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        )}

        {status && (
          <div className="text-white mt-4">
            <p>{status}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DownloadPage;
