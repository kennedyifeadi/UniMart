import { useState, useMemo } from 'react'
import { validateEmail } from '../../utils/validateEmail'
import { validatePassword } from '../../utils/validatePassword'
import { validateConfirmPassword } from '../../utils/validateConfirmPassword'

export interface InputProps {
  type?: string
  placeholder?: string
  name?: string
  label?: string
  required?: boolean
  value?: string
  defaultValue?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  // Optional custom validator: return a string message for invalid, or null/empty for valid
  validate?: (value: string) => string | null
  // Optional onBlur callback gives the computed error (if any)
  onBlur?: (error: string | null, e: React.FocusEvent<HTMLInputElement>) => void
  className?: string
  // Optional: for confirm password scenarios, supply the original password to compare with
  confirmWith?: string
  checked?: boolean
  // Optional: for checkboxes to render label inline
  children?: React.ReactNode
}

export const Input = ({
  type = 'text',
  placeholder,
  name,
  label,
  required = false,
  value,
  defaultValue = '',
  onChange,
  validate,
  onBlur,
  className = '',
  confirmWith,
  checked,
  children
}: InputProps) => {
  const isControlled = typeof value === 'string'
  const [internalValue, setInternalValue] = useState<string>(defaultValue)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentValue = isControlled ? (value as string) : internalValue
  const isCheckbox = type === 'checkbox'

  const validateValue = useMemo(() => {
    return (val: string, isChecked?: boolean): string | null => {
      // For checkboxes, validate based on checked state
      if (isCheckbox) {
        if (required && !isChecked) {
          return 'You must agree before submitting'
        }
        return null
      }
      
      const trimmed = val?.toString().trim()
      if (required && !trimmed) {
        return 'This field is required'
      }
      if (validate) {
        // If a custom validator is provided, use it
        const v = validate(trimmed)
        return v || null
      }
      // Basic type-based checks via utils
      if (type === 'email' && trimmed) {
        return validateEmail(trimmed)
      }
      if (type === 'password' && trimmed) {
        if (confirmWith !== undefined) {
          return validateConfirmPassword(trimmed, confirmWith)
        }
        return validatePassword(trimmed)
      }
      return null
    }
  }, [required, validate, type, confirmWith, isCheckbox])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isCheckbox) {
      // For checkboxes, re-validate on change to clear errors immediately
      if (touched) {
        const nextError = validateValue('', e.target.checked)
        setError(nextError)
        onBlur?.(nextError, e as unknown as React.FocusEvent<HTMLInputElement>)
      }
    } else {
      if (!isControlled) setInternalValue(e.target.value)
    }
    onChange?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true)
    const nextError = isCheckbox 
      ? validateValue('', e.target.checked)
      : validateValue(currentValue)
    setError(nextError)
    onBlur?.(nextError, e)
  }

  const baseClass = 'w-full border rounded-md px-3 py-2 outline-none transition-colors duration-150'
  const stateClass = error && touched
    ? 'border-red-500 focus:ring-1 focus:ring-red-400'
    : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400'

  const describedBy = error && touched ? `${name || 'input'}-error` : undefined

  // Checkbox render
  if (isCheckbox) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-2">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`mt-0.5 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer ${className}`}
            aria-invalid={Boolean(error && touched)}
            aria-describedby={describedBy}
          />
          {(label || children) && (
            <label htmlFor={name} className="text-sm text-gray-700 cursor-pointer select-none">
              {children || label}
              {required && <span className="text-red-500 ml-0.5">*</span>}
            </label>
          )}
        </div>
        {/* Reserve space for error to prevent layout shift */}
        <div className="min-h-[20px]">
          {error && touched && (
            <p id={describedBy} className="mt-1 text-xs text-red-600">
              {error}
            </p>
          )}
        </div>
      </div>
    )
  }

  // Regular input render
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        className={`${baseClass} ${stateClass} ${className}`}
        value={currentValue}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={Boolean(error && touched)}
        aria-describedby={describedBy}
      />
      {error && touched && (
        <p id={describedBy} className="mt-1 text-xs text-red-600">
          {error}
        </p>
      )}
    </div>
  )
}
