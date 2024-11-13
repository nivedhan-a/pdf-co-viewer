import React, { useEffect, useState } from 'react';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import io from 'socket.io-client';

const PDFViewer = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to the Socket.IO server
    const newSocket = io('http://localhost:3001'); // Replace with your server URL
    setSocket(newSocket);

    // Listen for the pageChanged event from the server
    newSocket.on('pageChanged', (page) => {
      setCurrentPage(page);
    });

    // Clean up the socket listener when component unmounts
    return () => newSocket.disconnect();
  }, []);

  const handlePageChange = (event) => {
    const newPage = event.pageIndex + 1;
    setCurrentPage(newPage);

    // If in admin mode, emit the page change event to the server
    if (isAdmin && socket) {
      socket.emit('changePage', newPage);
    }
  };

  return (
    <div>
      <label>
        <input
          type="checkbox"
          checked={isAdmin}
          onChange={() => setIsAdmin(!isAdmin)}
        />
        Admin Mode
      </label>
      <div style={{ height: '750px', width: '100%' }}>
        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
          <Viewer
            fileUrl="/sample.pdf"
            plugins={[defaultLayoutPluginInstance]}
            onPageChange={handlePageChange}
            initialPage={currentPage - 1} // Ensure correct page is displayed on load
          />
        </Worker>
      </div>
    </div>
  );
};

export default PDFViewer;