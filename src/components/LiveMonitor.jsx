import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';

const LiveMonitor = () => {
  const videoRef = useRef(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [frameCount, setFrameCount] = useState(1);
  const [intervalId, setIntervalId] = useState(null);

  const startCamera = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    videoRef.current.srcObject = stream;
    setIsStreaming(true);
  };

  useEffect(() => {
    if (isStreaming) {
      const id = setInterval(() => {
        captureAndSend();
      }, 1000); // 1 frame per second
      setIntervalId(id);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isStreaming]);

  const captureAndSend = async () => {
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.current, 0, 0);

    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "frame.jpg");

      try {
        const res = await axios.post("https://5778-34-90-18-133.ngrok-free.app/test-frame", formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          });          
        console.log(`sent frame ${frameCount}`);
        setFrameCount(prev => prev + 1);

        const timestamp = new Date().toLocaleString();
        res.data.results.forEach((result) => {
          console.log(`[${timestamp}] name: ${result.name}`);
        });

      } catch (error) {
        console.error("Error sending frame:", error);
      }
    }, "image/jpeg");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Live Camera Monitor</h2>
      <video ref={videoRef} autoPlay playsInline width="640" height="480" />
      <br />
      <button onClick={startCamera}>Start Camera & Stream Frames</button>
    </div>
  );
};

export default LiveMonitor;
