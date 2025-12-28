import * as Yup from 'yup'

const phoneRegex = /^[0-9]{9,11}$/

const vendorSchema = Yup.object().shape({
  vendorName: Yup.string().required('Vendor name is required'),
  businessName: Yup.string().required('Business name is required'),
  category: Yup.string().required('Category is required'),
  whatsappNumber: Yup.string()
    .matches(phoneRegex, 'Enter a valid phone number (no country code)')
    .required('WhatsApp number is required'),
  description: Yup.string().max(500, 'Maximum 500 characters').required('Description is required'),
})

export default vendorSchema
