import React, { PropsWithChildren, useEffect, useRef } from 'react';

type ModalSize = 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'full';

/**
 * Props for the Modal component
 */
interface ModalProps extends PropsWithChildren {
  /** Controls whether the modal is open or closed */
  isOpen: boolean;
  /** Callback function to close the modal */
  onClose: () => void;
  /** Controls the maximum width of the modal */
  size?: ModalSize;
  /** Optional class name to apply to the modal box */
  className?: string;
}

/**
 * Reusable modal component used by AuthModal and LogoutModal
 * Uses the HTML dialog element with the showModal API
 */
export function Modal({ isOpen, onClose, children, size = 'medium', className = '' }: ModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!modalRef.current) return;
    if (isOpen) {
      modalRef.current.showModal();
    } else {
      modalRef.current.close();
    }
  }, [isOpen]);

  const modalSizeClasses = {
    small: 'max-w-sm',
    medium: 'max-w-md',
    large: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    full: 'max-w-full',
  };

  return (
    <dialog className="modal" ref={modalRef} onClose={onClose}>
      <div className={`modal-box ${modalSizeClasses[size]} ${className}`}>{children}</div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
