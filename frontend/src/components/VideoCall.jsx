import React from "react";
import { PhoneOff, Mic, MicOff, Video, VideoOff, Clock } from "lucide-react";
import { useCall } from "../context/CallContext";

const VideoCall = () => {
  const {
    callState,
    currentCall,
    remoteStream,
    myStream,
    isMuted,
    setIsMuted,
    isCameraOn,
    setIsCameraOn,
    callDuration,
    endCall,
  } = useCall();

  if (callState !== "connected") return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black">
      {/* Call Info Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-lg font-bold text-white">L</span>
          </div>
          <div>
            <h3 className="text-white font-semibold">
              {currentCall?.lawyerId ? "Lawyer Consultation" : "Lawyer Name"}
            </h3>
            <p className="text-xs text-gray-400 flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>
                {Math.floor(callDuration / 60)}:
                {(callDuration % 60).toString().padStart(2, "0")}
              </span>
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className={`p-2 rounded-full transition-all ${
              isMuted
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-200"
            }`}
          >
            {isMuted ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={() => setIsCameraOn(!isCameraOn)}
            className={`p-2 rounded-full transition-all ${
              isCameraOn
                ? "bg-white text-gray-700 hover:bg-gray-200"
                : "bg-red-600 text-white"
            }`}
          >
            {isCameraOn ? (
              <Video className="h-5 w-5" />
            ) : (
              <VideoOff className="h-5 w-5" />
            )}
          </button>
          <button
            onClick={endCall}
            className="p-3 bg-red-600 hover:bg-red-700 text-white rounded-full transition-all shadow-lg"
          >
            <PhoneOff className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Video Container */}
      <div className="flex-1 relative overflow-hidden">
        {/* Remote Video (main screen) */}
        {remoteStream && (
          <video
            playsInline
            autoPlay
            ref={(video) => {
              if (video) video.srcObject = remoteStream;
            }}
            className="w-full h-full object-cover"
          />
        )}

        {/* Local Video (small pip) */}
        {myStream && (
          <video
            playsInline
            muted
            autoPlay
            ref={(video) => {
              if (video) video.srcObject = myStream;
            }}
            className="absolute bottom-24 right-6 w-28 h-32 rounded-2xl border-4 border-black shadow-2xl object-cover"
          />
        )}

        {/* No remote stream placeholder */}
        {!remoteStream && callState === "connected" && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
            <div className="text-white text-center">
              <Phone className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-lg">Connecting...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoCall;
