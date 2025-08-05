export interface DateConversion {
  bs: string
  ad: string
}

// Simplified BS-AD conversion
// In production, use a proper library like 'bikram-sambat' or 'nepali-date'
const bsMonths = [
  'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भाद्र', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पौष', 'माघ', 'फाल्गुन', 'चैत्र'
]

const adMonthDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export function convertBSToAD(bsDate: string): string {
  try {
    const [year, month, day] = bsDate.split('-').map(Number)
    // Simplified conversion - subtract approximately 56-57 years
    const adYear = year - 57
    return `${adYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  } catch {
    return bsDate
  }
}

export function convertADToBS(adDate: string): string {
  try {
    const [year, month, day] = adDate.split('-').map(Number)
    // Simplified conversion - add approximately 56-57 years
    const bsYear = year + 57
    return `${bsYear}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
  } catch {
    return adDate
  }
}

export function calculateAge(birthDate: string, isBS: boolean = false): number {
  try {
    let dateToCalculate = birthDate
    if (isBS) {
      dateToCalculate = convertBSToAD(birthDate)
    }
    
    const today = new Date()
    const birth = new Date(dateToCalculate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    
    return age
  } catch {
    return 0
  }
}

export function formatDateDisplay(date: string, format: 'BS' | 'AD'): string {
  if (!date) return ''
  
  try {
    const [year, month, day] = date.split('-').map(Number)
    if (format === 'BS') {
      return `${bsMonths[month - 1]} ${day}, ${year}`
    } else {
      const adDate = new Date(year, month - 1, day)
      return adDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  } catch {
    return date
  }
}