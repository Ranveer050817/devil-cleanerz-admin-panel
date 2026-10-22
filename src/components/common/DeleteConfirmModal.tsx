import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  title: string;
  itemName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  title,
  itemName,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl border border-[#EAEAEA] shadow-2xl max-w-md w-full overflow-hidden p-6 animate-in fade-in zoom-in-95 duration-150"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-start justify-between">
          <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-[#E31B23] shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-lg font-bold text-[#171717]">{title}</h3>
          <p className="text-sm text-[#666666] mt-2 leading-relaxed">
            Are you sure you want to delete <span className="font-semibold text-[#171717]">"{itemName}"</span>?
          </p>
          <div className="mt-3 p-3 bg-red-50/60 rounded-lg border border-red-100 text-xs text-[#E31B23]">
            This record will be removed from your active preview state. (Note: currently running in local demo mode).
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-[#171717] bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="px-4 py-2 text-sm font-medium text-white bg-[#E31B23] hover:bg-[#c9151c] rounded-lg transition-colors shadow-xs cursor-pointer"
          >
            Yes, Delete Record
          </button>
        </div>
      </div>
    </div>
  );
};
