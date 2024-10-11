import React from 'react';

const Controls = ({ localStream }) => {
  const toggleCamera = () => {
    const videoTrack = localStream.getTracks().find((track) => track.kind === 'video');
    if (videoTrack.enabled) {
      videoTrack.enabled = false;
      document.getElementById('camera-btn').style.backgroundColor = 'rgb(255,80,80)';
    } else {
      videoTrack.enabled = true;
      document.getElementById('camera-btn').style.backgroundColor = 'rgba(179,102,249,0.9)';
    }
  };

  const toggleMic = () => {
    const audioTrack = localStream.getTracks().find((track) => track.kind === 'audio');
    if (audioTrack.enabled) {
      audioTrack.enabled = false;
      document.getElementById('mic-btn').style.backgroundColor = 'rgb(255,80,80)';
    } else {
      audioTrack.enabled = true;
      document.getElementById('mic-btn').style.backgroundColor = 'rgba(179,102,249,0.9)';
    }
  };

  return (
    <div id="controls">
      <div id="camera-btn" className="control-container" onClick={toggleCamera}>
        <img src="icons/camera.png" alt="Camera" />
      </div>
      <div id="mic-btn" className="control-container" onClick={toggleMic}>
        <img src="icons/mic.png" alt="Mic" />
      </div>
      <a href="lobby.html">
        <div id="leave-btn" className="control-container">
          <img src="icons/phone.png" alt="Leave" />
        </div>
      </a>
    </div>
  );
};

export default Controls;
