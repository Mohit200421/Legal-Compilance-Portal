import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import Peer from "simple-peer";
import socket from "../api/socket";

const CallContext = createContext();

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error("useCall must be used within CallProvider");
  }
  return context;
};

export const CallProvider = ({ children }) => {
  const [callState, setCallState] = useState("idle"); // idle, calling, ringing, connected, ended
  const [incomingCall, setIncomingCall] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [peer, setPeer] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const durationRef = useRef();
  const socketIdRef = useRef();

  // Get user media
  const getMediaStream = useCallback(async (video = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: video,
        audio: true,
      });
      setMyStream(stream);
      return stream;
    } catch (err) {
      console.error("Error accessing media devices:", err);
      throw err;
    }
  }, []);

  // Create peer connection
  const createPeer = useCallback((stream, userToCallId, isCaller = false) => {
    const p = new Peer({
      initiator: isCaller,
      trickle: false,
      stream: stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    p.on("signal", (data) => {
      if (!isCaller) {
        socket.emit("answer-call", {
          to: socketIdRef.current,
          signalData: data,
        });
      } else {
        socket.emit("call-user", {
          userToCall: userToCallId,
          from: socketIdRef.current,
          signalData: data,
        });
      }
    });

    p.on("stream", (remoteStream) => {
      setRemoteStream(remoteStream);
      setCallState("connected");
    });

    return p;
  }, []);

  // Call functions
  const callUser = useCallback(
    async (lawyerId, callType = "video") => {
      try {
        const stream = await getMediaStream(callType === "video");
        setCurrentCall({ lawyerId, callType });
        setCallState("calling");
        const p = createPeer(stream, lawyerId, true);
        setPeer(p);
      } catch (err) {
        console.error("Call failed:", err);
      }
    },
    [getMediaStream, createPeer]
  );

  const answerCall = useCallback(async () => {
    try {
      const stream = await getMediaStream(incomingCall.callType === "video");
      const p = createPeer(stream, incomingCall.from, false);
      setPeer(p);
      socket.emit("answer-call", {
        to: incomingCall.from,
        signalData: incomingCall.signalData,
      });
      setCurrentCall(incomingCall);
      setIncomingCall(null);
      setCallState("connected");
    } catch (err) {
      console.error("Answer call failed:", err);
    }
  }, [getMediaStream, createPeer, incomingCall]);

  const endCall = useCallback(() => {
    if (peer) peer.destroy();
    if (myStream) {
      myStream.getTracks().forEach((track) => track.stop());
    }
    socket.emit("end-call", {
      to: currentCall?.lawyerId || incomingCall?.from,
    });
    setCallState("ended");
    setTimeout(() => {
      setCallState("idle");
      setCurrentCall(null);
      setIncomingCall(null);
      setRemoteStream(null);
      setMyStream(null);
      setPeer(null);
      setCallDuration(0);
    }, 2000);
  }, [peer, myStream, currentCall, incomingCall]);

  // Event listeners
  useEffect(() => {
    socketIdRef.current = socket.id;

    socket.on("incoming-call", (data) => {
      setIncomingCall(data);
      setCallState("ringing");
    });

    socket.on("call-accepted", (data) => {
      setRemoteStream(data.stream);
      setCallState("connected");
    });

    socket.on("call-ended", () => {
      endCall();
    });

    socket.on("ice-candidate", (data) => {
      if (peer) peer.addIceCandidate(new RTCIceCandidate(data.candidate));
    });

    return () => {
      socket.off("incoming-call");
      socket.off("call-accepted");
      socket.off("call-ended");
      socket.off("ice-candidate");
    };
  }, [endCall]);

  // Call timer
  useEffect(() => {
    let interval;
    if (callState === "connected") {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [callState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (peer) peer.destroy();
      if (myStream) myStream.getTracks().forEach((track) => track.stop());
    };
  }, []);

  const value = {
    callState,
    incomingCall,
    currentCall,
    remoteStream,
    myStream,
    isMuted,
    setIsMuted,
    isCameraOn,
    setIsCameraOn,
    callDuration,
    callUser,
    answerCall,
    rejectCall: () => {
      socket.emit("end-call", { to: incomingCall?.from });
      setIncomingCall(null);
      setCallState("idle");
    },
    endCall,
    getMediaStream,
  };

  return <CallContext.Provider value={value}>{children}</CallContext.Provider>;
};
