// lib/nepali-converter.ts

const englishToNepaliMap: { [key: string]: string } = {
  // Vowels and their independent forms
  'a': 'अ', 'aa': 'आ', 'i': 'इ', 'ee': 'ई', 'u': 'उ', 'oo': 'ऊ', 'e': 'ए', 'ai': 'ऐ', 'o': 'ओ', 'au': 'औ',
  'am': 'अं', 'ah': 'अः',
  'ru': 'रु', // This 'ru' is for the 'र' + 'ु' combination, not for independent ऋ
  'ri': 'रि', // This 'ri' is for the 'र' + 'ि' combination
  'Rri': 'ऋ', // Changed from 'ri' to 'Rri' for the independent vowel ऋ to resolve conflict

  // Consonants with 'a' sound (full form) - prioritize these over half-consonants
  'ka': 'क', 'kaa': 'का', 'ki': 'कि', 'kee': 'की', 'ku': 'कु', 'koo': 'कू', 'ke': 'के', 'kai': 'कै', 'ko': 'को', 'kau': 'कौ',
  'kha': 'ख', 'khaa': 'खा', 'khi': 'खि', 'khee': 'खी', 'khu': 'खु', 'khoo': 'खू', 'khe': 'खे', 'khai': 'खै', 'kho': 'खो', 'khau': 'खौ',
  'ga': 'ग', 'gaa': 'गा', 'gi': 'गि', 'gee': 'गी', 'gu': 'गु', 'goo': 'गू', 'ge': 'गे', 'gai': 'गै', 'go': 'गो', 'gau': 'गौ',
  'gha': 'घ', 'ghaa': 'घा', 'ghi': 'घि', 'ghee': 'घी', 'ghu': 'घु', 'ghoo': 'घू', 'ghe': 'घे', 'ghai': 'घै', 'gho': 'घो', 'ghau': 'घौ',
  'nga': 'ङ',

  'cha': 'च', 'chaa': 'चा', 'chi': 'चि', 'chee': 'ची', 'chu': 'चु', 'choo': 'चू', 'che': 'चे', 'chai': 'चै', 'cho': 'चो', 'chau': 'चौ',
  'chha': 'छ', 'chhaa': 'छा', 'chhi': 'छि', 'chhee': 'छी', 'chhu': 'छु', 'chhoo': 'छू', 'chhe': 'छे', 'chhai': 'छै', 'chho': 'छो', 'chhau': 'छौ',
  'ja': 'ज', 'jaa': 'जा', 'ji': 'जि', 'jee': 'जी', 'ju': 'जु', 'joo': 'जू', 'je': 'जे', 'jai': 'जै', 'jo': 'जो', 'jau': 'जौ',
  'jha': 'झ', 'jhaa': 'झा', 'jhi': 'झि', 'jhee': 'झी', 'jhu': 'झु', 'jhoo': 'झू', 'jhe': 'झे', 'jhai': 'झै', 'jho': 'झो', 'jhau': 'झौ',
  'yna': 'ञ', // For ञ

  // Retroflex (ट वर्ग) - using capitalized first letter for common distinction
  'Ta': 'ट', 'Taa': 'टा', 'Ti': 'टि', 'Tee': 'टी', 'Tu': 'टु', 'Too': 'टू', 'Te': 'टे', 'Tai': 'टै', 'To': 'टो', 'Tau': 'टौ',
  'Tha': 'ठ', 'Thaa': 'ठा', 'Thi': 'ठि', 'Thee': 'ठी', 'Thu': 'ठु', 'Thoo': 'ठू', 'The': 'ठे', 'Thai': 'ठै', 'Tho': 'ठो', 'Thau': 'ठौ',
  'Da': 'ड', 'Daa': 'डा', 'Di': 'डि', 'Dee': 'डी', 'Du': 'डु', 'Doo': 'डू', 'De': 'डे', 'Dai': 'डै', 'Do': 'डो', 'Dau': 'डौ',
  'Dha': 'ढ', 'Dhaa': 'ढा', 'Dhi': 'ढि', 'Dhee': 'ढी', 'Dhu': 'ढु', 'Dhoo': 'ढू', 'Dhe': 'ढे', 'Dhai': 'ढै', 'Dho': 'ढो', 'Dhau': 'ढौ',
  'Na': 'ण', 'Naa': 'णा', 'Ni': 'णि', 'Nee': 'णी', 'Nu': 'णु', 'Noo': 'णू', 'Ne': 'णे', 'Nai': 'णै', 'No': 'णो', 'Nau': 'णौ',

  // Dental (त वर्ग) - using lowercase
  'ta': 'त', 'taa': 'ता', 'ti': 'ति', 'tee': 'ती', 'tu': 'तु', 'too': 'तू', 'te': 'ते', 'tai': 'तै', 'to': 'तो', 'tau': 'तौ',
  'tha': 'थ', 'thaa': 'था', 'thi': 'थि', 'thee': 'थी', 'thu': 'थु', 'thoo': 'थू', 'the': 'थे', 'thai': 'थै', 'tho': 'थो', 'thau': 'थौ',
  'da': 'द', 'daa': 'दा', 'di': 'दि', 'dee': 'दी', 'du': 'दु', 'doo': 'दू', 'de': 'दे', 'dai': 'दै', 'do': 'दो', 'dau': 'दौ',
  'dha': 'ध', 'dhaa': 'धा', 'dhi': 'धि', 'dhee': 'धी', 'dhu': 'धु', 'dhoo': 'धू', 'dhe': 'धे', 'dhai': 'धै', 'dho': 'धो', 'dhau': 'धौ',
  'na': 'न', 'naa': 'ना', 'ni': 'नि', 'nee': 'नी', 'nu': 'नु', 'noo': 'नू', 'ne': 'ने', 'nai': 'नै', 'no': 'नो', 'nau': 'नौ',

  'pa': 'प', 'paa': 'पा', 'pi': 'पि', 'pee': 'पी', 'pu': 'पु', 'poo': 'पू', 'pe': 'पे', 'pai': 'पै', 'po': 'पो', 'pau': 'पौ',
  'pha': 'फ', 'phaa': 'फा', 'phi': 'फि', 'phee': 'फी', 'phu': 'फु', 'phoo': 'फू', 'phe': 'फे', 'phai': 'फै', 'pho': 'फो', 'phau': 'फौ',
  'ba': 'ब', 'baa': 'बा', 'bi': 'बि', 'bee': 'बी', 'bu': 'बु', 'boo': 'बू', 'be': 'बे', 'bai': 'बै', 'bo': 'बो', 'bau': 'बौ',
  'bha': 'भ', 'bhaa': 'भा', 'bhi': 'भि', 'bhee': 'भी', 'bhu': 'भु', 'bhoo': 'भू', 'bhe': 'भे', 'bhai': 'भै', 'bho': 'भो', 'bhau': 'भौ',
  'ma': 'म', 'maa': 'मा', 'mi': 'मि', 'mee': 'मी', 'mu': 'मु', 'moo': 'मू', 'me': 'मे', 'mai': 'मै', 'mo': 'मो', 'mau': 'मौ',

  'ya': 'य', 'yaa': 'या', 'yi': 'यि', 'yee': 'यी', 'yu': 'यु', 'yoo': 'यू', 'ye': 'ये', 'yai': 'यै', 'yo': 'यो', 'yau': 'यौ',
  'ra': 'र', 'raa': 'रा', 'ree': 'री', 'ro': 'रो', 'rau': 'रौ', // Removed 'ri' and 'ru' from here as they are defined above
  'la': 'ल', 'laa': 'ला', 'li': 'लि', 'lee': 'ली', 'lu': 'लु', 'loo': 'लू', 'le': 'ले', 'lai': 'लै', 'lo': 'लो', 'lau': 'लौ',
  'va': 'व', 'vaa': 'वा', 'vi': 'वि', 'vee': 'वी', 'vu': 'वु', 'voo': 'वू', 've': 'वे', 'vai': 'वै', 'vo': 'वो', 'vau': 'वौ',
  'wa': 'व', 'waa': 'वा', 'wi': 'वि', 'wee': 'वी', 'wu': 'वु', 'woo': 'वू', 'we': 'वे', 'wai': 'वै', 'wo': 'वो', 'wau': 'वौ',

  'sha': 'श', 'shaa': 'शा', 'shi': 'शि', 'shee': 'शी', 'shu': 'शु', 'shoo': 'शू', 'she': 'शे', 'shai': 'शै', 'sho': 'शो', 'shau': 'शौ', // For श
  'sa': 'स', 'saa': 'सा', 'si': 'सि', 'see': 'सी', 'su': 'सु', 'soo': 'सू', 'se': 'से', 'sai': 'सै', 'so': 'सो', 'sau': 'सौ', // For स
  'Sa': 'ष', 'Saa': 'षा', 'Si': 'षि', 'See': 'षी', 'Su': 'षु', 'Soo': 'षू', 'Se': 'षे', 'Sai': 'षै', 'So': 'षो', 'Sau': 'षौ', // For ष (using capitalized 'S')
  'ha': 'ह', 'haa': 'हा', 'hi': 'हि', 'hee': 'ही', 'hu': 'हु', 'hoo': 'हू', 'he': 'हे', 'hai': 'है', 'ho': 'हो', 'hau': 'हौ',

  // Half-consonants (used when no vowel follows immediately) - these should be processed after full forms
  'k': 'क्', 'kh': 'ख्', 'g': 'ग्', 'gh': 'घ्', 'c': 'च्', 'ch': 'छ्', 'j': 'ज्', 'jh': 'झ्',
  'T': 'ट्', 'Th': 'ठ्', 'D': 'ड्', 'Dh': 'ढ्', 'N': 'ण्', // For ट वर्ग half (capitalized)
  't': 'त्', 'th': 'थ्', 'd': 'द्', 'dh': 'ध्', 'n': 'न्', // For त वर्ग half (lowercase)
  'p': 'प्', 'ph': 'फ्', 'b': 'ब्', 'bh': 'भ्', 'm': 'म्',
  'y': 'य्', 'r': 'र्', 'l': 'ल्', 'v': 'व्', 'w': 'व्',
  'sh': 'श्', 's': 'स्', 'h': 'ह्',

  // Conjuncts and special characters
  'ksha': 'क्ष', 'tra': 'त्र', 'gya': 'ज्ञ', 'shra': 'श्र',
  'om': 'ॐ', // Om symbol
  '.': '।', // Purna Biram (Nepali full stop)
  ',': ',', // Comma
  '?': '?', // Question mark
  '!': '!', // Exclamation mark
  ' ': ' ', // Space
  // Add other common punctuation or symbols if needed
};

const numberMap: { [key: string]: string } = {
  '0': '०', '1': '१', '2': '२', '3': '३', '4': '४', '5': '५', '6': '६', '7': '७', '8': '८', '9': '९',
};

/**
 * Converts a given string from phonetic English to Nepali Devanagari script.
 * It processes the text word by word and then character by character within each word,
 * prioritizing longer phonetic matches for accuracy.
 * @param text The input string to convert.
 * @returns The converted Nepali text.
 */
export function convertToNepali(text: string): string {
  if (!text) return '';

  // Do NOT convert to lowercase here. The mapping now relies on case for retroflex vs dental.
  const words = text.split(' '); 
  const convertedWords: string[] = [];

  // Sort keys by length in descending order to ensure longer matches are found first
  const sortedEnglishKeys = Object.keys(englishToNepaliMap).sort((a, b) => b.length - a.length);
  const sortedNumberKeys = Object.keys(numberMap).sort((a, b) => b.length - a.length);

  for (const word of words) {
    if (word === '') {
      convertedWords.push('');
      continue;
    }

    let currentWordConverted = '';
    let i = 0;

    while (i < word.length) {
      let matched = false;

      // Try to match numbers first
      for (const numKey of sortedNumberKeys) {
        if (word.substring(i, i + numKey.length) === numKey) {
          currentWordConverted += numberMap[numKey];
          i += numKey.length;
          matched = true;
          break;
        }
      }

      if (matched) continue; // If a number was matched, move to the next iteration

      // Try to match phonetic English to Nepali
      for (const engKey of sortedEnglishKeys) {
        // Match case-sensitively now that we have capitalized keys
        if (word.substring(i, i + engKey.length) === engKey) {
          currentWordConverted += englishToNepaliMap[engKey];
          i += engKey.length;
          matched = true;
          break;
        }
      }

      // If no phonetic or number match is found, append the character as is
      // This handles characters not in the map or punctuation
      if (!matched) {
        currentWordConverted += word[i];
        i++;
      }
    }
    convertedWords.push(currentWordConverted);
  }

  // Join the words back together.
  // Post-processing for implicit 'a' at the end of words (e.g., 'm' -> 'म' instead of 'म्')
  // This is a simplified rule and might need more sophistication for complex cases.
  let finalResult = convertedWords.join(' ');
  
  // Regex to find a half-consonant (character followed by ्) at the end of a word or before a space
  // and remove the ् if it's a consonant that typically implies 'a' at the end of a word.
  // This is a common rule for words like 'sugam' -> 'सुगम' (not 'सुगम्')
  // We need to be careful not to remove halanta for actual conjuncts (e.g., 'ksha' -> 'क्ष')
  // This regex targets isolated half-consonants at word boundaries.
  // It looks for a Devanagari consonant followed by a halanta (्)
  // and then either a word boundary (\b) or a space (\s)
  // Example: 'म्' followed by space or end of string.
  // This list of consonants is a common set that often implies 'a' at the end of a word.
  const consonantsForImplicitA = 'कखगघङचछजझञटठडढणतथदधनपफबभमयरलवशसह'; // Add more if needed
  const regexForImplicitA = new RegExp(`([${consonantsForImplicitA}])्(?=\\s|$)`, 'g');
  
  finalResult = finalResult.replace(regexForImplicitA, '$1'); // Replace 'क् ' with 'क '

  return finalResult;
}
