export interface PasswordRules {
	minLength?: number
}

export const validatePassword = (
	value: string,
	rules: PasswordRules = { minLength: 6 }
): string | null => {
	const v = (value ?? '').trim()
	if (!v) return null // required should be handled outside
	const min = rules.minLength ?? 6
	if (v.length < min) return `Password must be at least ${min} characters`
	return null
}

export default validatePassword
