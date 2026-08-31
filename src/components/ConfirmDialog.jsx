import React from 'react';
import { AlertCircle } from 'lucide-react';
import Modal from './Modal';

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm,
  onCancel,
}) {
  return (
    <Modal isOpen={isOpen} title={title} onClose={onCancel}>
      <div className="flex gap-4">
        {isDangerous && (
          <AlertCircle size={24} className="text-red-600 flex-shrink-0" />
        )}
        <p className="text-gray-700">{message}</p>
      </div>

      <div className="flex gap-3 mt-6">
        <button onClick={onCancel} className="btn-secondary flex-1">
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          className={`${isDangerous ? 'btn-danger' : 'btn-primary'} flex-1`}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
}
