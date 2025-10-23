export const validateEmail = (value: string): string | null => {
	const v = (value ?? '').trim()
	if (!v) return null // required should be handled outside
	// Basic but practical email regex
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
	return emailRegex.test(v) ? null : 'Please enter a valid email address'
}

export default validateEmail
