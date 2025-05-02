import React, { ChangeEvent, FormEvent, useState } from 'react'
import { useDispatch } from 'react-redux'

import { UseLoginMutation } from '../state/authApi'
import { setUser } from '../state/authSlice'
import { getAuthErrorMessage } from '../utils/errors'
import { AuthErrorType } from '../utils/types'
import { Modal } from './Modal'

/**
 * Props for the error display component
 */
interface AuthErrorDisplayProps {
  error: any
  errorClassName?: string
}

/**
 * Simple error display component for authentication errors
 */
const AuthErrorDisplay: React.FC<AuthErrorDisplayProps> = ({
  error,
  errorClassName = 'text-red-500 w-full mb-4',
}) => {
  if (!error) return null

  const errorData = (error as any)?.data
  if (!errorData)
    return <div className={errorClassName}>Authentication failed</div>

  let errorMessage = 'Failed to log in'

  if (
    errorData.error_type &&
    Object.values(AuthErrorType).includes(errorData.error_type)
  ) {
    errorMessage = getAuthErrorMessage(errorData.error_type as AuthErrorType)
  } else if (errorData.detail) {
    errorMessage = errorData.detail
  }

  return <div className={errorClassName}>{errorMessage}</div>
}

/**
 * AuthModal configuration options
 */
export interface AuthModalConfig {
  titleText?: string
  usernameLabel?: string
  usernamePlaceholder?: string
  passwordLabel?: string
  passwordPlaceholder?: string
  submitButtonText?: string
  loadingText?: string
  successMessage?: string
  modalSize?: 'small' | 'medium' | 'large' | 'xl' | '2xl' | '3xl' | 'full'
  formClassName?: string
  inputClassName?: string
  buttonClassName?: string
  errorClassName?: string
  onLoginSuccess?: (username: string) => void
}

/**
 * Props for the AuthModal component
 */
export interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  useLoginMutation: UseLoginMutation
  config?: AuthModalConfig
}

/**
 * Authentication modal component for login functionality
 * Configurable via the config prop
 */
export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  useLoginMutation,
  config = {},
}) => {
  // Default configuration with fallbacks
  const {
    titleText = 'Login',
    usernameLabel = 'Username',
    usernamePlaceholder = 'Enter your username',
    passwordLabel = 'Password',
    passwordPlaceholder = 'Enter your password',
    submitButtonText = 'Login',
    loadingText = 'Loading...',
    modalSize = 'medium',
    formClassName = 'bg-white p-8 rounded-lg',
    inputClassName = 'border rounded p-2 w-full mt-1 mb-4',
    buttonClassName = 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full',
    errorClassName = 'text-red-500 w-full mb-4',
    onLoginSuccess,
  } = config

  // Component state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  })

  // Redux hooks
  const dispatch = useDispatch()
  const [login, { isLoading, error }] = useLoginMutation

  // Form handlers
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((data) => ({
      ...data,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      const data = await login(formData).unwrap()
      // Update Redux state
      dispatch(setUser(data.user))
      // Close the modal
      onClose()
      // Call success callback if provided
      if (onLoginSuccess) {
        onLoginSuccess(data.user.username)
      }
    } catch (err) {
      // Error is handled by the AuthErrorDisplay component
      console.error('Failed to login:', err)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size={modalSize}>
      <div className={formClassName}>
        <h2 className='text-2xl font-semibold mb-4'>{titleText}</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor='username' className='block text-gray-700'>
              {usernameLabel}
            </label>
            <input
              id='username'
              name='username'
              className={inputClassName}
              value={formData.username}
              placeholder={usernamePlaceholder}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor='password' className='block text-gray-700'>
              {passwordLabel}
            </label>
            <input
              type='password'
              id='password'
              name='password'
              value={formData.password}
              onChange={handleChange}
              className={inputClassName}
              placeholder={passwordPlaceholder}
              required
            />
          </div>

          {error && (
            <AuthErrorDisplay error={error} errorClassName={errorClassName} />
          )}

          <button
            type='submit'
            className={buttonClassName}
            disabled={isLoading}
          >
            {isLoading ? loadingText : submitButtonText}
          </button>
        </form>
      </div>
    </Modal>
  )
}
