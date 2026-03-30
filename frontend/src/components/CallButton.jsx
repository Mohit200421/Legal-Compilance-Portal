import React from "react";
import { Phone, Video } from "lucide-react";
import { useCall } from "../context/CallContext";

const CallButton = ({ lawyer, className = "" }) => {
  const { callUser } = useCall();

  const handleAudioCall = () => {
    callUser(lawyer._id, "audio");
  };

  const handleVideoCall = () => {
    callUser(lawyer._id, "video");
  };

  return (
    <div className={`flex space-x-2 ${className}`}>
      <button
        onClick={handleAudioCall}
        className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 group"
        title="Audio Call"
      >
        <Phone className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </button>

      <button
        onClick={handleVideoCall}
        className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center space-x-2 group"
        title="Video Call"
      >
        <Video className="h-5 w-5 group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
};

export default CallButton;
