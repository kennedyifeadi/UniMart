import * as yup from 'yup'

const FILE_SIZE = 5 * 1024 * 1024 // 5MB
const SUPPORTED_FORMATS = ['image/jpeg', 'image/png', 'application/pdf']

export const artisanSchema = yup.object({
	fullName: yup.string().required('Full name is required'),
	businessName: yup.string().required('Business name is required'),
	category: yup.string().required('Please select a category'),
	bio: yup.string().max(500, 'Bio must be at most 500 characters').required('Business details are required'),
	whatsapp: yup
		.string()
		.required('WhatsApp number is required')
		.matches(/^\d{10}$/, 'Enter a valid 10-digit phone number (without country code)')
		,
	studentIdFile: yup
		.mixed()
		.test('fileSize', 'File is too large', (value: unknown) => {
			if (!value) return true
			// ensure value is a File/Blob and has a numeric size property
			if (!(value instanceof File)) return true
			return typeof value.size === 'number' ? value.size <= FILE_SIZE : true
		})
		.test('fileType', 'Unsupported file format', (value: unknown) => {
			if (!value) return true
			// ensure value is a File and has a string type property
			if (!(value instanceof File)) return true
			return typeof value.type === 'string' ? SUPPORTED_FORMATS.includes(value.type) : true
		})
})

export default artisanSchema
