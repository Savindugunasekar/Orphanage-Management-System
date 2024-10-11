import React, { useEffect, useState, useRef } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faVideoSlash, faMicrophone, faMicrophoneSlash } from "@fortawesome/free-solid-svg-icons";

const APP_ID = "842c19bfef574283a1d647958dfcd2f8";
const TOKEN = null;

const client = AgoraRTC.createClient({
  mode: 'rtc',
  codec: 'vp8',
});

const VideoChat = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const [joined, setJoined] = useState(false);
  const [videoEnabled, setVideoEnabled] = useState(true); 
  const [audioEnabled, setAudioEnabled] = useState(true); 
  const user0Ref = useRef(null);
  const user1Ref = useRef(null);

  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);
    if (mediaType === 'video') {
      setUsers((prevUsers) => [...prevUsers, user]);
    }
  };

  const handleUserLeft = (user) => {
    setUsers((prevUsers) => prevUsers.filter((u) => u.uid !== user.uid));
  };

  useEffect(() => {
    client.on('user-published', handleUserJoined);
    client.on('user-left', handleUserLeft);

    client.join(APP_ID, roomId, TOKEN, null)
      .then(async (uid) => {
        const tracks = await AgoraRTC.createMicrophoneAndCameraTracks();
        setLocalTracks(tracks);
        const [audioTrack, videoTrack] = tracks;
        setUsers((prevUsers) => [
          ...prevUsers,
          { uid, videoTrack, audioTrack },
        ]);
        await client.publish(tracks);
        setJoined(true);
      })
      .catch(error => {
        console.error('Failed to join the channel', error);
      });

    return () => {
      if (joined) {
        localTracks.forEach(track => {
          track.stop();
          track.close();
        });
        client.unpublish(localTracks)
          .then(() => client.leave())
          .then(() => navigate(-1))
          .catch(error => {
            console.error('Failed to unpublish and leave the channel', error);
          });
      }
      client.off('user-published', handleUserJoined);
      client.off('user-left', handleUserLeft);
    };
  }, [roomId, joined]);

  useEffect(() => {
    if (users[0]?.videoTrack) {
      users[0].videoTrack.play(user0Ref.current);
    }
    if (users[1]?.videoTrack) {
      users[1].videoTrack.play(user1Ref.current);
    }
  }, [users]);

  const toggleVideo = async () => {
    if (videoEnabled) {
      
      users[0]?.videoTrack?.stop();
      setVideoEnabled(false);

      
      await client.unpublish(users[0]?.videoTrack);
    } else {
      
      await client.publish(users[0]?.videoTrack);

     
      users[0]?.videoTrack?.play(user0Ref.current);
      setVideoEnabled(true);
    }
  };

  const toggleAudio = async () => {
    if (audioEnabled) {
     
      users[0]?.audioTrack?.stop();
      setAudioEnabled(false);

      
      await client.unpublish(users[0]?.audioTrack);
    } else {
      
      await client.publish(users[0]?.audioTrack);
      setAudioEnabled(true);
    }
  };

  const disconnectCall = () => {
    if (joined) {
      localTracks.forEach(track => {
        track.stop();
        track.close();
      });
      client.unpublish(localTracks)
        .then(() => client.leave())
        .then(() => navigate(-1))
        .catch(error => {
          console.error('Failed to unpublish and leave the channel', error);
        });
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="relative w-screen h-screen">
      <h1 className="text-2xl font-bold text-center">Video Call</h1>
      <p className="text-center mt-2">
        user1: {users[0]?.uid ?? 'N/A'}, user2: {users[1]?.uid ?? 'N/A'}
      </p>

      <div ref={user0Ref} className="absolute top-0 left-0 w-full h-full bg-black"></div>

      {users[1] && (
        <div ref={user1Ref} className="absolute top-2 left-2 w-48 h-48 bg-black border-2 border-white"></div>
      )}

      <div className="absolute bottom-5 left-5 flex space-x-4">
        <button onClick={toggleVideo} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 flex items-center space-x-2">
          <FontAwesomeIcon icon={videoEnabled ? faVideo : faVideoSlash} />
          <span>{videoEnabled ? 'Turn Off Video' : 'Turn On Video'}</span>
        </button>
        <button onClick={toggleAudio} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 flex items-center space-x-2">
          <FontAwesomeIcon icon={audioEnabled ? faMicrophone : faMicrophoneSlash} />
          <span>{audioEnabled ? 'Mute Audio' : 'Unmute Audio'}</span>
        </button>
        <button onClick={disconnectCall} className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-700 flex items-center space-x-2">
          <FontAwesomeIcon icon={faVideoSlash} />
          <span>End Call</span>
        </button>
      </div>
    </div>
  );
};

export default VideoChat;
