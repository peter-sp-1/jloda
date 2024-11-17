import React, { useEffect, useState } from "react";
import axios from "axios";
import Searchbar from "./Search";

const DownloadPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [cache, setCache] = useState<{ [key: string]: any[] }>({});
  const apiKey = "AIzaSyC5S4s6DW7UJ2ydeQDYOtasidIE1RDE46s";
  const channelId = "UCxssq4RFmPSgUzyjpIZBjSQ";

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async (query = "") => {
    if (cache[query]) {
      setVideos(cache[query]);
      setNoResults(cache[query].length === 0);
      return;
    }

    setIsLoading(true);
    try {
      const requestUrl = query
        ? `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&q=${encodeURIComponent(query)}&part=snippet&type=video&maxResults=10`
        : `https://www.googleapis.com/youtube/v3/search?key=${apiKey}&channelId=${channelId}&part=snippet,id&order=date&maxResults=10`;

      const response = await fetch(requestUrl);
      const data = await response.json();

      setVideos(data.items || []);
      setNoResults(!data.items || data.items.length === 0);
      setCache((prevCache) => ({
        ...prevCache,
        [query]: data.items || [],
      }));
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
        "https://025d-105-112-231-67.ngrok-free.app/download",
        { url: videoUrl, format: selectedFormat },
        { responseType: "blob" }
      );

      // Prepare and trigger download
      const downloadLink = document.createElement("a");
      const url = window.URL.createObjectURL(response.data);
      downloadLink.href = url;
      downloadLink.setAttribute("download", `downloaded_video.${selectedFormat}`);
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      setStatus("Download successful!");
    } catch (error: any) {
      setStatus("Download failed: " + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black relative overflow-hidden">
      {/* Search and Format Selection Section */}
      <div className="fixed top-0 left-0 w-full bg-black py-6 shadow-lg">
        <div className="max-w-screen-lg mx-auto flex items-center">
          {/* Searchbar */}
          <div className="flex-1">
            <Searchbar onSearch={fetchVideos} />
          </div>
          {/* Dropdown Format */}
          <div className="ml-4">
            <div className="flex items-center space-x-2">
              <label htmlFor="format-select" className="text-white text-sm">
                Format:
              </label>
              <select
                id="format-select"
                value={selectedFormat}
                onChange={(e) => setSelectedFormat(e.target.value)}
                className="px-2 py-1 rounded bg-black text-white border border-black text-sm hover:bg-gray-700"
              >
                <option value="mp4">MP4</option>
                <option value="mp3">MP3</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mt-4 w-full px-4">
        <div className="max-w-screen-lg mx-auto">
          {/* "It's your video" Section */}
          <h1 className="font-bold text-white text-center mt-4">
            IT'S YOUR VIDEO! Watch it! Download it!
          </h1>

          {isLoading ? (
            <div className="text-white mt-8 text-center">
              <p>Loading videos...</p>
            </div>
          ) : noResults ? (
            <div className="text-white mt-8 text-center">
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
            <div className="text-white mt-4 text-center">
              <p>{status}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
