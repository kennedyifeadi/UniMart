export const validateConfirmPassword = (
	value: string,
	original: string
): string | null => {
	const v = (value ?? '').trim()
	const o = (original ?? '').trim()
	if (!v) return null // required should be handled outside
	return v === o ? null : 'Passwords do not match'
}

export default validateConfirmPassword
