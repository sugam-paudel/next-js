import { z } from "zod"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "application/pdf"]

// Date validation helpers
const isValidBSDate = (dateStr: string): boolean => {
  // Basic BS date validation - you can enhance this
  const parts = dateStr.split('-')
  if (parts.length !== 3) return false
  
  const year = parseInt(parts[0])
  const month = parseInt(parts[1])
  const day = parseInt(parts[2])
  
  return year >= 2000 && year <= 2100 && month >= 1 && month <= 12 && day >= 1 && day <= 32
}

const isValidADDate = (dateStr: string): boolean => {
  const date = new Date(dateStr)
  return date instanceof Date && !isNaN(date.getTime()) && dateStr === date.toISOString().split('T')[0]
}

export const personalInfoSchema = z.object({
  fullNameEnglish: z.string()
    .min(1, "Full name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only English alphabets and spaces are allowed")
    .max(100, "Name must be less than 100 characters")
    .trim(),
    
  fullNameNepali: z.string()
    .min(1, "नेपाली नाम आवश्यक छ")
    .max(100, "नाम १०० अक्षरभन्दा कम हुनुपर्छ")
    .trim(),
    
  gender: z.enum(["male", "female", "other"], {
    message: "Please select a valid gender"
  }),
  
  dateOfBirth: z.string()
    .min(1, "Date of birth is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)")
    .refine((dateStr) => {
      // Additional date validation can be added here
      const date = new Date(dateStr)
      const today = new Date()
      const hundredYearsAgo = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
      
      return date <= today && date >= hundredYearsAgo
    }, "Please enter a valid date of birth"),
    
  dateFormat: z.enum(["BS", "AD"], {
    message: "Please select a valid date format"
  }),
  
  phoneNumber: z.string()
    .regex(/^9\d{9}$/, "Phone number must be exactly 10 digits starting with 9")
    .length(10, "Phone number must be exactly 10 digits")
})

// Enhanced file schema with better validation
const fileSchema = z.array(z.instanceof(File))
  .min(1, "File is required")
  .max(1, "Only one file is allowed") // Assuming single file upload
  .refine(
    (files) => files.every(file => file.size > 0),
    "File cannot be empty"
  )
  .refine(
    (files) => files.every(file => file.size <= MAX_FILE_SIZE),
    `Max file size is ${MAX_FILE_SIZE / (1024 * 1024)}MB`
  )
  .refine(
    (files) => files.every(file => ACCEPTED_IMAGE_TYPES.includes(file.type)),
    "Only .jpg, .jpeg, .png, .webp and .pdf files are accepted"
  )
  .refine(
    (files) => files.every(file => file.name.length <= 255),
    "File name must be less than 255 characters"
  )

export const documentInfoSchema = z.object({
  citizenshipNumber: z.string()
    .min(1, "Citizenship number is required")
    .max(20, "Citizenship number must be less than 20 characters")
    .regex(/^[A-Za-z0-9\-\/]+$/, "Citizenship number contains invalid characters")
    .trim(),
    
  issuedDistrict: z.string()
    .min(1, "Please select issued district")
    .refine(
      (district) => nepaliDistricts.includes(district),
      "Please select a valid district"
    ),
    
  issuedDate: z.string()
    .min(1, "Issued date is required")
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Please enter a valid date (YYYY-MM-DD)")
    .refine((dateStr) => {
      const date = new Date(dateStr)
      const today = new Date()
      const fiftyYearsAgo = new Date(today.getFullYear() - 50, today.getMonth(), today.getDate())
      
      return date <= today && date >= fiftyYearsAgo
    }, "Please enter a valid issued date"),
    
  issuedDateFormat: z.enum(["BS", "AD"], {
    message: "Please select a valid date format"
  }),
  
  citizenshipFront: fileSchema,
  citizenshipBack: fileSchema,
})

// Cross-field validation for the complete form
export const completeFormSchema = personalInfoSchema.and(documentInfoSchema)
  .refine((data) => {
    // Ensure date formats are consistent or valid for their respective fields
    if (data.dateFormat === 'BS') {
      return isValidBSDate(data.dateOfBirth)
    } else {
      return isValidADDate(data.dateOfBirth)
    }
  }, {
    message: "Date of birth format doesn't match the selected date format",
    path: ["dateOfBirth"]
  })
  .refine((data) => {
    // Ensure issued date format is valid
    if (data.issuedDateFormat === 'BS') {
      return isValidBSDate(data.issuedDate)
    } else {
      return isValidADDate(data.issuedDate)
    }
  }, {
    message: "Issued date format doesn't match the selected date format",
    path: ["issuedDate"]
  })
  .refine((data) => {
    // Ensure issued date is after birth date (basic validation)
    const birthDate = new Date(data.dateOfBirth)
    const issuedDate = new Date(data.issuedDate)
    return issuedDate > birthDate
  }, {
    message: "Citizenship issued date must be after date of birth",
    path: ["issuedDate"]
  })

export type PersonalInfoForm = z.infer<typeof personalInfoSchema>
export type DocumentInfoForm = z.infer<typeof documentInfoSchema>
export type CompleteFormData = z.infer<typeof completeFormSchema>

// Export districts for use in components
export const nepaliDistricts = [
  "Achham", "Arghakhanchi", "Baglung", "Baitadi", "Bajhang", "Bajura",
  "Banke", "Bara", "Bardiya", "Bhaktapur", "Bhojpur", "Chitwan",
  "Dadeldhura", "Dailekh", "Dang", "Darchula", "Dhading", "Dhankuta",
  "Dhanusa", "Dolakha", "Dolpa", "Doti", "Gorkha", "Gulmi",
  "Humla", "Ilam", "Jajarkot", "Jhapa", "Jumla", "Kailali",
  "Kalikot", "Kanchanpur", "Kapilvastu", "Kaski", "Kathmandu", "Kavrepalanchok",
  "Khotang", "Lalitpur", "Lamjung", "Mahottari", "Makwanpur", "Manang",
  "Morang", "Mugu", "Mustang", "Myagdi", "Nawalparasi", "Nuwakot",
  "Okhaldhunga", "Palpa", "Panchthar", "Parbat", "Parsa", "Pyuthan",
  "Ramechhap", "Rasuwa", "Rautahat", "Rolpa", "Rukum", "Rupandehi",
  "Salyan", "Sankhuwasabha", "Saptari", "Sarlahi", "Sindhuli", "Sindhupalchok",
  "Siraha", "Solukhumbu", "Sunsari", "Surkhet", "Syangja", "Tanahu",
  "Taplejung", "Terhathum", "Udayapur"
]

// Utility functions for date conversion (you can expand these)
export const convertBSToAD = (bsDate: string): string => {
  // Implement BS to AD conversion logic
  // This is a placeholder - you'll need a proper conversion library
  return bsDate // Return as-is for now
}

export const convertADToBS = (adDate: string): string => {
  // Implement AD to BS conversion logic
  // This is a placeholder - you'll need a proper conversion library
  return adDate // Return as-is for now
}