import React, { useEffect, useState } from "react";
import Searchbar from "./Search";

const DownloadPage: React.FC = () => {
  const [videos, setVideos] = useState<any[]>([]);
  const [noResults, setNoResults] = useState(false);
  const [status, setStatus] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState("mp4");
  const [cache, setCache] = useState<{ [key: string]: any[] }>({});
  const apiKey = import.meta.env.VITE_YOUTUBE_API_KEY;
  const channelId = import.meta.env.VITE_APP_CHANNEL_ID;
  

  const BACKEND_URL = "https://jloda-server-0ccf03f71e0c.herokuapp.com";

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
      
      const response = await fetch(`${BACKEND_URL}/download`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        credentials: 'include', // Include cookies in the request

        body: JSON.stringify({ 
          url: videoUrl,
          format: selectedFormat 
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Download failed');
      }

      // Get filename from Content-Disposition header if available
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = `downloaded_video.${selectedFormat}`;
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }

      // Handle the file download
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(downloadUrl);
      document.body.removeChild(a);

      setStatus("Download successful!");
    } catch (error: any) {
      console.error('Download error:', error);
      setStatus(`Download failed: ${error.message}`);
    } finally {
      setTimeout(() => setStatus(""), 3000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-black relative overflow-hidden">
      {/* Search and Format Selection Section */}
      <div className="fixed top-0 left-0 w-full bg-black py-6 shadow-lg z-10">
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
        {/* Status Message */}
        {status && (
          <div className="mt-2 text-center text-sm bg-black text-white py-2 rounded">
            {status}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="mt-24 w-full px-4"> {/* Increased top margin to account for fixed header */}
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
                  <p className="text-white mt-2 line-clamp-2">{video.snippet.title}</p>
                  <button
                    onClick={() => handleDownload(`https://www.youtube.com/watch?v=${video.id.videoId}`)}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DownloadPage;
