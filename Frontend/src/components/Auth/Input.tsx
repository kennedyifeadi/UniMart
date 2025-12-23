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
  onChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  variant?: 'input' | 'textarea' | 'select'
  options?: Array<{ value: string; label: string }>
  validate?: (value: string) => string | null
  onBlur?: (error: string | null, e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  formikOnBlur?: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void
  prefix?: React.ReactNode
  maxLength?: number
  className?: string
  confirmWith?: string
  checked?: boolean
  children?: React.ReactNode
  externalError?: string | null
  externalTouched?: boolean
}

const Input = ({
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
  formikOnBlur,
  className = '',
  confirmWith,
  checked,
  children,
  externalError,
  externalTouched,
  variant = 'input',
  options,
  prefix,
  maxLength,
}: InputProps) => {
  const isControlled = typeof value === 'string'
  const [internalValue, setInternalValue] = useState<string>(defaultValue)
  const [touched, setTouched] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const currentValue = isControlled ? (value as string) : internalValue
  const isCheckbox = type === 'checkbox'
  const isTextarea = variant === 'textarea'
  const isSelect = variant === 'select'

  const validateValue = useMemo(() => {
    return (val: string, isChecked?: boolean): string | null => {
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
        const v = validate(trimmed)
        return v || null
      }
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (isCheckbox) {
      const target = e.target as HTMLInputElement
        if (touched) {
          const nextError = validateValue('', target.checked)
          setError(nextError)
          onBlur?.(nextError, e as unknown as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)
        }
    } else {
      if (!isControlled) setInternalValue((e.target as HTMLInputElement).value)
    }
    onChange?.(e)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setTouched(true)
    const target = e.target as HTMLInputElement
    const nextError = isCheckbox ? validateValue('', target.checked) : validateValue(currentValue)
    setError(nextError)
    onBlur?.(nextError, e)
    formikOnBlur?.(e)
  }

  const baseClass = 'w-full border rounded-md px-3 py-2 outline-none transition-colors duration-150'

  const visibleError = externalTouched ? externalError : (error && touched ? error : null)

  const stateClass = visibleError
    ? 'border-red-500 focus:ring-1 focus:ring-red-400'
    : 'border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400'

  const describedBy = visibleError ? `${name || 'input'}-error` : undefined

  if (isCheckbox) {
    return (
      <div className="w-full">
        <div className="flex items-start gap-2">
          <input
            id={name}
            name={name}
            type="checkbox"
            checked={checked}
            onChange={handleChange as unknown as (e: React.ChangeEvent<HTMLInputElement>) => void}
            onBlur={handleBlur as unknown as (e: React.FocusEvent<HTMLInputElement>) => void}
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
        <div className="min-h-[20px]">
          {visibleError && (
            <p id={describedBy} className="mt-1 text-xs text-red-600">
              {visibleError}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className={`${prefix ? 'flex items-stretch gap-0' : ''}`}>
        {prefix && (
          <div className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-sm text-gray-700">
            {prefix}
          </div>
        )}

        {isTextarea ? (
          <textarea
            id={name}
            name={name}
            placeholder={placeholder}
            className={`${baseClass} ${stateClass} ${prefix ? 'rounded-l-none' : ''} ${className}`}
            value={currentValue}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
              if (!isControlled) setInternalValue(e.target.value)
              onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
            }}
            onBlur={(e: React.FocusEvent<HTMLTextAreaElement>) => {
              handleBlur(e as React.FocusEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>)
            }}
            aria-invalid={Boolean(visibleError)}
            aria-describedby={describedBy}
            maxLength={maxLength}
          />
        ) : isSelect ? (
          <select
            id={name}
            name={name}
            className={`${baseClass} ${stateClass} ${prefix ? 'rounded-l-none' : ''} ${className}`}
            value={currentValue}
            onChange={(e) => {
              if (!isControlled) setInternalValue((e.target as HTMLSelectElement).value)
              onChange?.(e as unknown as React.ChangeEvent<HTMLInputElement>)
            }}
            onBlur={(e) => handleBlur(e as React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)}
            aria-invalid={Boolean(visibleError)}
            aria-describedby={describedBy}
          >
            <option value="" disabled>
              {placeholder || 'Select an option'}
            </option>
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            placeholder={placeholder}
            className={`${baseClass} ${stateClass} ${prefix ? 'rounded-l-none' : ''} ${className}`}
            value={currentValue}
            onChange={handleChange as unknown as (e: React.ChangeEvent<HTMLInputElement>) => void}
            onBlur={handleBlur as unknown as (e: React.FocusEvent<HTMLInputElement>) => void}
            aria-invalid={Boolean(visibleError)}
            aria-describedby={describedBy}
            maxLength={maxLength}
          />
        )}
      </div>

      {isTextarea && maxLength && (
        <div className="flex justify-between mt-1 text-xs text-gray-500">
          <div />
          <div>{`${(currentValue || '').length}/${maxLength} characters`}</div>
        </div>
      )}

      {visibleError && (
        <p id={describedBy} className="mt-1 text-xs text-red-600">
          {visibleError}
        </p>
      )}
    </div>
  )
}

export default Input
