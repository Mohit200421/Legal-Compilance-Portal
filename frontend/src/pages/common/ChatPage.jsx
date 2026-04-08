import { useParams, useLocation, useNavigate } from "react-router-dom";
import ChatModal from "../../components/chat/ChatModal";

export default function ChatPage() {
  const { id } = useParams(); // ✅ correct param
  const location = useLocation();
  const navigate = useNavigate();

  const receiverName = location.state?.receiverName;

  return (
    <div className="h-screen w-full">
      <ChatModal
        open={true}
        onClose={() => navigate(-1)}
        receiverId={id}
        receiverName={receiverName}
        fullPage={true}   // 🔥 IMPORTANT
      />
    </div>
  );
}