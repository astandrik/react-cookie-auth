import React from 'react'
import { useDispatch } from 'react-redux'

import { UseLogoutMutation } from '../state/authApi'
import { setUser } from '../state/authSlice'
import { Modal } from './Modal'

/**
 * LogoutModal configuration options
 */
export interface LogoutModalConfig {
  titleText?: string
  confirmationText?: string
  confirmButtonText?: string
  cancelButtonText?: string
  loadingText?: string
  successMessage?: string
  modalSize?: 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'full'
  contentClassName?: string
  buttonClassName?: string
  cancelButtonClassName?: string
  confirmButtonClassName?: string
  spinnerClassName?: string
  onLogoutSuccess?: () => void
}

/**
 * Props for the LogoutModal component
 */
export interface LogoutModalProps {
  isOpen: boolean
  onClose: () => void
  useLogoutMutation: UseLogoutMutation
  config?: LogoutModalConfig
}

/**
 * Logout confirmation modal component
 * Configurable via the config prop
 */
export const LogoutModal: React.FC<LogoutModalProps> = ({
  isOpen,
  onClose,
  useLogoutMutation,
  config = {},
}) => {
  // Default configuration with fallbacks
  const {
    titleText = 'Logout',
    confirmationText = 'Are you sure you want to log out?',
    confirmButtonText = 'Yes',
    cancelButtonText = 'No',
    loadingText = 'Loading...',
    modalSize = 'small',
    contentClassName = 'p-6',
    buttonClassName = 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded',
    cancelButtonClassName = 'bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded',
    confirmButtonClassName = 'bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded',
    spinnerClassName = 'animate-spin h-6 w-6 border-4 border-blue-500 rounded-full border-t-transparent',
    onLogoutSuccess,
  } = config

  // Redux hooks
  const dispatch = useDispatch()
  const [logout, { isLoading }] = useLogoutMutation

  /**
   * Handle logout action
   */
  const handleLogout = async () => {
    try {
      // With cookie-based auth, we don't need to pass tokens
      await logout().unwrap()

      // Clear user from Redux state
      dispatch(setUser(null))

      // Close the modal
      onClose()

      // Call success callback if provided
      if (onLogoutSuccess) {
        onLogoutSuccess()
      }
    } catch (error) {
      console.error('Failed to logout:', error)

      // Even if there's an error, still close the modal
      // to prevent users from being stuck
      onClose()
    }
  }

  return (
    <>
      {isLoading && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <div className={spinnerClassName} />
        </div>
      )}
      <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
        <div className={contentClassName}>
          <h2 className='text-2xl font-semibold mb-4'>{titleText}</h2>
          <p className='mb-6'>{confirmationText}</p>
          <div className='flex justify-between'>
            <button
              onClick={onClose}
              className={`${buttonClassName} ${cancelButtonClassName}`}
              disabled={isLoading}
            >
              {cancelButtonText}
            </button>
            <button
              onClick={handleLogout}
              className={`${buttonClassName} ${confirmButtonClassName}`}
              disabled={isLoading}
            >
              {isLoading ? loadingText : confirmButtonText}
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
