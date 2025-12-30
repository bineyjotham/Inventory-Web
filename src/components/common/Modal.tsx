import React, { useEffect, useRef, useCallback } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export type ModalSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type ModalPosition = 'center' | 'top' | 'bottom' | 'left' | 'right';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string | null //| React.ReactNode;
  children: React.ReactNode;
  size?: ModalSize;
  position?: ModalPosition;
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  showOverlay?: boolean;
  overlayBlur?: boolean;
  overlayOpacity?: number;
  preventScroll?: boolean;
  initialFocusRef?: React.RefObject<HTMLElement>;
  onAfterOpen?: () => void;
  onAfterClose?: () => void;
  className?: string;
  contentClassName?: string;
  headerClassName?: string;
  footer?: React.ReactNode;
  hideHeader?: boolean;
  showBackdrop?: boolean;
  animationDuration?: number;
  zIndex?: number;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = 'Default Title',
  children,
  size = 'md',
  position = 'center',
  showCloseButton = true,
  closeOnOverlayClick = true,
  closeOnEsc = true,
  showOverlay = true,
  overlayBlur = false,
  overlayOpacity = 0.5,
  preventScroll = true,
  initialFocusRef,
  onAfterOpen,
  onAfterClose,
  className = '',
  contentClassName = '',
  headerClassName = '',
  footer,
  hideHeader = false,
  showBackdrop = true,
  animationDuration = 300,
  zIndex = 50,
  ...props
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const isAnimating = useRef(false);

  const sizeClasses = {
    xs: 'max-w-xs',
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    full: 'max-w-[95vw] max-h-[95vh]'
  };

  const positionClasses = {
    center: 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2',
    top: 'top-4 left-1/2 -translate-x-1/2',
    bottom: 'bottom-4 left-1/2 -translate-x-1/2',
    left: 'top-1/2 left-4 -translate-y-1/2',
    right: 'top-1/2 right-4 -translate-y-1/2'
  };

  const getAnimationClasses = () => {
    if (!isOpen) return 'opacity-0 scale-95';

    switch (position) {
      case 'center':
        return 'opacity-100 scale-100';
      case 'top':
        return 'opacity-100 translate-y-0';
      case 'bottom':
        return 'opacity-100 translate-y-0';
      case 'left':
        return 'opacity-100 translate-x-0';
      case 'right':
        return 'opacity-100 translate-x-0';
      default:
        return 'opacity-100 scale-100';
    }
  };

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && closeOnEsc && isOpen && !isAnimating.current) {
      e.preventDefault();
      onClose();
    }
  }, [closeOnEsc, isOpen, onClose]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (closeOnOverlayClick && !isAnimating.current && e.target === overlayRef.current) {
      onClose();
    }
  };

  const trapFocus = useCallback((e: KeyboardEvent) => {
    if (!modalRef.current || e.key !== 'Tab') return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  }, []);

  useEffect(() => {
    if (preventScroll && isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventScroll]);

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement as HTMLElement;
      
      const timer = setTimeout(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus();
        } else {
          const firstFocusable = modalRef.current?.querySelector(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          ) as HTMLElement;
          firstFocusable?.focus();
        }
      }, 10);

      return () => clearTimeout(timer);
    } else if (previousActiveElement.current) {
      previousActiveElement.current.focus();
    }
  }, [isOpen, initialFocusRef]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('keydown', trapFocus);
      onAfterOpen?.();
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keydown', trapFocus);
      if (!isOpen) {
        onAfterClose?.();
      }
    };
  }, [isOpen, handleKeyDown, trapFocus, onAfterOpen, onAfterClose]);

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      isAnimating.current = true;
      const timer = setTimeout(() => {
        isAnimating.current = false;
      }, animationDuration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, animationDuration]);

  // Don't render if not open
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto"
      style={{ zIndex }}
      aria-labelledby="modal-title"
      aria-modal="true"
      role="dialog"
    >
      {showOverlay && (
        <div
          ref={overlayRef}
          onClick={handleOverlayClick}
          className={`fixed inset-0 transition-opacity ${
            overlayBlur ? 'backdrop-blur-sm' : ''
          }`}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${overlayOpacity})`,
            animation: 'fadeIn 0.2s ease-out'
          }}
          aria-hidden="true"
        />
      )}

      {showBackdrop && (
        <div className="fixed inset-0" aria-hidden="true" />
      )}

      <div className="flex items-center justify-center min-h-screen p-4">
        {/* Modal */}
        <div
          ref={modalRef}
          className={`relative bg-white rounded-xl shadow-2xl transform transition-all duration-${animationDuration} ${sizeClasses[size]} w-full ${positionClasses[position]} ${getAnimationClasses()} ${className}`}
          style={{
            maxHeight: size === 'full' ? '95vh' : '90vh',
            overflow: 'hidden'
          }}
        >
          {showCloseButton && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              aria-label="Close modal"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
          )}

          {!hideHeader && (title || showCloseButton) && (
            <div className={`px-6 pt-6 pb-4 border-b border-gray-200 ${headerClassName}`}>
              {typeof title === 'string' ? (
                <h3
                  id="modal-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  {title}
                </h3>
              ) : (
                title
              )}
            </div>
          )}

          <div
            className={`overflow-y-auto ${
              size === 'full' ? 'h-full' : ''
            } ${contentClassName}`}
            style={{
              maxHeight: hideHeader && !footer 
                ? 'calc(90vh - 2rem)' 
                : hideHeader && footer 
                ? 'calc(90vh - 2rem - 4rem)' 
                : !hideHeader && footer 
                ? 'calc(90vh - 3.5rem - 4rem)' 
                : 'calc(90vh - 3.5rem)'
            }}
          >
            <div className="px-6 py-4">
              {children}
            </div>
          </div>

          {footer && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-xl">
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const ConfirmationModal: React.FC<
  Omit<ModalProps, 'children' | 'footer'> & {
    message: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel?: () => void;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
  }
> = ({
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  variant = 'info',
  isLoading = false,
  ...modalProps
}) => {
  const variantClasses = {
    danger: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
    warning: 'bg-orange-500 hover:bg-orange-600 focus:ring-orange-500',
    info: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
    success: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
  };

  const variantIcons = {
    danger: (
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    warning: (
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100">
        <svg className="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.998-.833-2.732 0L4.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
    ),
    info: (
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    ),
    success: (
      <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
    )
  };

  return (
    <Modal
      {...modalProps}
      size="sm"
      showCloseButton={false}
      closeOnOverlayClick={false}
      footer={
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel || modalProps.onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isLoading}
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 text-sm font-medium text-white ${variantClasses[variant]} border border-transparent rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      }
    >
      <div className="text-center">
        {variantIcons[variant]}
        <div className="mt-3">
          <h3 className="text-lg font-medium text-gray-900">
            {modalProps.title || 'Confirm Action'}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {message}
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export const AlertModal: React.FC<
  Omit<ModalProps, 'children' | 'footer'> & {
    message: string;
    buttonText?: string;
    onClose: () => void;
    variant?: 'danger' | 'warning' | 'info' | 'success';
  }
> = ({
  message,
  buttonText = 'OK',
  onClose,
  variant = 'info',
  ...modalProps
}) => {
  return (
    <ConfirmationModal
      {...modalProps}
      message={message}
      confirmText={buttonText}
      cancelText={undefined}
      onClose={onClose}
      onConfirm={onClose}
      onCancel={undefined}
      variant={variant}
    />
  );
};

export const SideModal: React.FC<ModalProps> = (props) => {
  return (
    <Modal
      {...props}
      position="right"
      size="lg"
      className="h-full max-w-md ml-auto rounded-l-xl rounded-r-none"
      contentClassName="h-full"
    />
  );
};

export const BottomSheet: React.FC<ModalProps> = (props) => {
  return (
    <Modal
      {...props}
      position="bottom"
      size="full"
      className="rounded-b-none rounded-t-xl"
      overlayOpacity={0.3}
      showCloseButton={false}
      closeOnOverlayClick={true}
    >
      <div className="flex justify-center mb-4">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
      </div>
      {props.children}
    </Modal>
  );
};

export const FullScreenModal: React.FC<ModalProps> = (props) => {
  return (
    <Modal
      {...props}
      size="full"
      position="center"
      showOverlay={false}
      className="h-screen max-w-none rounded-none"
      contentClassName="h-full"
    />
  );
};

export const LoadingModal: React.FC<
  Omit<ModalProps, 'children'> & {
    message?: string;
    progress?: number;
    showProgress?: boolean;
  }
> = ({
  message = 'Loading...',
  progress,
  showProgress = false,
  ...modalProps
}) => {
  return (
    <Modal
      {...modalProps}
      showCloseButton={false}
      closeOnOverlayClick={false}
      closeOnEsc={false}
    >
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mb-4" />
        <p className="text-gray-700 mb-4">{message}</p>
        {showProgress && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress || 0}%` }}
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen(prev => !prev), []);

  return {
    isOpen,
    open,
    close,
    toggle,
    modalProps: {
      isOpen,
      onClose: close
    }
  };
};

export default Modal;