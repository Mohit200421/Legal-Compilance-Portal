import React from "react";
import AiAssistant from "../../components/AiAssistant";
import { Shield, BookOpen, Scale } from "lucide-react";

const AiChatPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-xl border">
            <Shield className="w-6 h-6 text-blue-600" />
            <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              LawSetu AI Legal Assistant
            </h1>
            <Scale className="w-6 h-6 text-green-600" />
          </div>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Get instant legal guidance on Indian laws, compliance checklists,
            and document analysis.
            <br />
            <span className="font-semibold text-blue-600">
              Powered by Gemini AI
            </span>
          </p>
        </div>

        {/* Chat Container */}
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden max-h-[70vh] lg:max-h-[75vh]">
          <AiAssistant />
        </div>

        {/* Features */}
        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm border hover:shadow-xl transition-all">
            <BookOpen className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Laws & Sections</h3>
            <p className="text-gray-600">
              IPC, CrPC, Consumer Protection, Cyber Laws explained simply.
            </p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm border hover:shadow-xl transition-all">
            <Shield className="w-12 h-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Compliance Guide</h3>
            <p className="text-gray-600">
              Business & individual compliance checklists & requirements.
            </p>
          </div>
          <div className="text-center p-6 bg-white/50 rounded-2xl backdrop-blur-sm border hover:shadow-xl transition-all">
            <Scale className="w-12 h-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Document Analysis</h3>
            <p className="text-gray-600">
              Upload documents for OCR + legal risk highlights.
            </p>
          </div>
        </div>

        <div className="mt-12 text-center p-8 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-dashed border-red-200 rounded-2xl">
          <div className="max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold text-red-800 mb-2">
              ⚠️ Important Notice
            </h3>
            <p className="text-red-700 leading-relaxed">
              AI responses are general information only. This is not legal
              advice.
              <br />
              Always consult a qualified lawyer for your specific situation.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AiChatPage;
