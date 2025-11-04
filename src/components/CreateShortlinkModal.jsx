import { X } from "lucide-react";
import ShortlinkForm from "./ShortlinkForm";

export default function CreateShortlinkModal({ isOpen, onClose, onSuccess }) {
  if (!isOpen) return null;

  const handleSuccess = () => {
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto border border-white/20">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-lime-200/50">
          <h2 className="text-xl font-bold text-gray-900">Create Shortlink</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:bg-gray-100 rounded-full p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* shortlink Form */}
        <div className="p-6">
          <ShortlinkForm
            onSuccess={handleSuccess}
            showTitle={false}
            compact={true}
          />
        </div>
      </div>
    </div>
  );
}
