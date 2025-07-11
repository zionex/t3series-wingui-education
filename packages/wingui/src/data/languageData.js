export const datetimeFormatTypes = [
  { label: "yyyy-MM-dd HH:mm:ss", value: "yyyy-MM-dd" },
  { label: "dd-MM-yyyy HH:mm:ss", value: "dd-MM-yyyy" },
  { label: "dd.MM.yyyy HH:mm:ss", value: "dd.MM.yyyy" },
  { label: "dd/MM/yyyy HH:mm:ss", value: "dd/MM/yyyy" },
  { label: "MM-dd-yy HH:mm:ss", value: "MM-dd-yy" },
  { label: "dd.MM.yy HH:mm:ss", value: "dd.MM.yy" },
  { label: "dd/MM/yy HH:mm:ss", value: "dd/MM/yy" },
]

export const timeFormatTypes = [
  { label: "HH:mm:ss", value: "HH:mm:ss" },
  { label: "HH시 mm분 ss초", value: "HH시 mm분 ss초" },
]

export const hour12TimeFormatTypes = [
  { label: "a/p hh:mm:ss", value: "a/p hh:mm:ss" },
  { label: "a/p hh시 mm분 ss초", value: "a/p hh시 mm분 ss초" },
]

export const dateFormatTypes = [
  { label: "yyyy-MM-dd", value: "yyyy-MM-dd" },
  { label: "dd.MM.yyyy", value: "dd.MM.yyyy" },
  { label: "dd-MM-yyyy", value: "dd-MM-yyyy" },
  { label: "dd/MM/yyyy", value: "dd/MM/yyyy" },
  { label: "yyyy년 MM월 dd일", value: "yyyy년 MM월 dd일" },
  { label: "MM-dd-yy", value: "MM-dd-yy" },
  { label: "dd.MM.yy", value: "dd.MM.yy" },
  { label: "dd/MM/yy", value: "dd/MM/yy" },
]

export const numberFormatTypes = [
  { label: "#,###.###", value: "#,###.###", format: "#,###.###;.;,;", type:'kr' }, //kr
  { label: "# ###,###", value: "# ###,###", format: "#,###.###;,; ;", type:'fr' }, //fr
  { label: "#.###,###", value: "#.###,###", format: "#,###.###;,;.;", type:'de' }, //de
]

export const languageData = {
  'af': {
    code: 'af',
    name: 'Afrikaans',
    currencyFormat: '#,###',
    numberFormat: '#,###.###',
    dateFormat: 'yyyy-MM-dd',
    datetimeFormat: 'yyyy-MM-dd HH:mm:ss',
    timeFormat: 'HH:mm:ss'
  },
  'af-ZA': {
    code: 'af-ZA',
    name: 'Afrikaans (South Africa)'
  },
  'ar': {
    code: 'ar',
    name: 'Arabic'
  },
  'ar-AE': {
    code: 'ar-AE',
    name: 'Arabic (U.A.E.)'
  },
  'ar-BH': {
    code: 'ar-BH',
    name: 'Arabic (Bahrain)'
  },
  'ar-DZ': {
    code: 'ar-DZ',
    name: 'Arabic (Algeria)'
  },
  'ar-EG': {
    code: 'ar-EG',
    name: 'Arabic (Egypt)'
  },
  'ar-IQ': {
    code: 'ar-IQ',
    name: 'Arabic (Iraq)'
  },
  'ar-JO': {
    code: 'ar-JO',
    name: 'Arabic (Jordan)'
  },
  'ar-KW': {
    code: 'ar-KW',
    name: 'Arabic (Kuwait)'
  },
  'ar-LB': {
    code: 'ar-LB',
    name: 'Arabic (Lebanon)'
  },
  'ar-LY': {
    code: 'ar-LY',
    name: 'Arabic (Libya)'
  },
  'ar-MA': {
    code: 'ar-MA',
    name: 'Arabic (Morocco)'
  },
  'ar-OM': {
    code: 'ar-OM',
    name: 'Arabic (Oman)'
  },
  'ar-QA': {
    code: 'ar-QA',
    name: 'Arabic (Qatar)'
  },
  'ar-SA': {
    code: 'ar-SA',
    name: 'Arabic (Saudi Arabia)'
  },
  'ar-SY': {
    code: 'ar-SY',
    name: 'Arabic (Syria)'
  },
  'ar-TN': {
    code: 'ar-TN',
    name: 'Arabic (Tunisia)'
  },
  'ar-YE': {
    code: 'ar-YE',
    name: 'Arabic (Yemen)'
  },
  'az': {
    code: 'az',
    name: 'Azeri (Latin)'
  },
  'az-AZ': {
    code: 'az-AZ',
    name: 'Azeri (Latin) (Azerbaijan)'
  },
  'be': {
    code: 'be',
    name: 'Belarusian'
  },
  'be-BY': {
    code: 'be-BY',
    name: 'Belarusian (Belarus)'
  },
  'bg': {
    code: 'bg',
    name: 'Bulgarian'
  },
  'bg-BG': {
    code: 'bg-BG',
    name: 'Bulgarian (Bulgaria)'
  },
  'bs-BA': {
    code: 'bs-BA',
    name: 'Bosnian (Bosnia and Herzegovina)'
  },
  'ca': {
    code: 'ca',
    name: 'Catalan'
  },
  'ca-ES': {
    code: 'ca-ES',
    name: 'Catalan (Spain)'
  },
  'cs': {
    code: 'cs',
    name: 'Czech'
  },
  'cs-CZ': {
    code: 'cs-CZ',
    name: 'Czech (Czech Republic)'
  },
  'cy': {
    code: 'cy',
    name: 'Welsh'
  },
  'cy-GB': {
    code: 'cy-GB',
    name: 'Welsh (United Kingdom)'
  },
  'da': {
    code: 'da',
    name: 'Danish',
    currencyFormat: '#,###',
    numberFormat: '# ###,000',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'da-DK': {
    code: 'da-DK',
    name: 'Danish (Denmark)',
    currencyFormat: '#,###',
    numberFormat: '# ###,000',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'de': {
    code: 'de',
    name: 'German',
    currencyFormat: '#,###',
    numberFormat: '#.###,000',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'de-AT': {
    code: 'de-AT',
    name: 'German (Austria)'
  },
  'de-CH': {
    code: 'de-CH',
    name: 'German (Switzerland)'
  },
  'de-DE': {
    code: 'de-DE',
    name: 'German (Germany)'
  },
  'de-LI': {
    code: 'de-LI',
    name: 'German (Liechtenstein)'
  },
  'de-LU': {
    code: 'de-LU',
    name: 'German (Luxembourg)'
  },
  'dv': {
    code: 'dv',
    name: 'Divehi'
  },
  'dv-MV': {
    code: 'dv-MV',
    name: 'Divehi (Maldives)'
  },
  'el': {
    code: 'el',
    name: 'Greek'
  },
  'el-GR': {
    code: 'el-GR',
    name: 'Greek (Greece)'
  },
  'en': {
    code: 'en-US',
    currency: 'en-US',
    name: 'LANG_EN',
    datetimeFormat: 'MM-dd-yy HH:mm:ss',
    currencyFormat: '#,###',
    numberFormat: '#,###.00',
    dateFormat: 'MM-dd-yy',
    timeFormat: 'HH:mm:ss',
    weekFormat: 'Week ww'
  },
  'en-AU': {
    code: 'en-AU',
    name: 'English (Australia)'
  },
  'en-BZ': {
    code: 'en-BZ',
    name: 'English (Belize)'
  },
  'en-CA': {
    code: 'en-CA',
    name: 'English (Canada)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'en-CB': {
    code: 'en-CB',
    name: 'English (Caribbean)'
  },
  'en-GB': {
    code: 'en-GB',
    name: 'English (United Kingdom)',
    currencyFormat: '#,###',
    numberFormat: '#,###.00',
    dateFormat: 'dd/mm/yy',
    timeFormat: 'HH:mm:ss'
  },
  'en-IE': {
    code: 'en-IE',
    name: 'English (Ireland)'
  },
  'en-JM': {
    code: 'en-JM',
    name: 'English (Jamaica)'
  },
  'en-NZ': {
    code: 'en-NZ',
    name: 'English (New Zealand)'
  },
  'en-PH': {
    code: 'en-PH',
    name: 'English (Republic of the Philippines)'
  },
  'en-TT': {
    code: 'en-TT',
    name: 'English (Trinidad and Tobago)'
  },
  'en-US': {
    code: 'en-US',
    name: 'English (United States)',
    currencyFormat: '#,###',
    numberFormat: '#,###.00',
    dateFormat: 'MM-dd-yy',
    timeFormat: 'HH:mm:ss'
  },
  'en-ZA': {
    code: 'en-ZA',
    name: 'English (South Africa)'
  },
  'en-ZW': {
    code: 'en-ZW',
    name: 'English (Zimbabwe)'
  },
  'eo': {
    code: 'eo',
    name: 'Esperanto'
  },
  'es': {
    code: 'es',
    name: 'Spanish',
    currencyFormat: '#,###',
    numberFormat: '#.###,000',
    dateFormat: 'dd-MM-yy',
    timeFormat: 'HH:mm:ss'
  },
  'es-AR': {
    code: 'es-AR',
    name: 'Spanish (Argentina)'
  },
  'es-BO': {
    code: 'es-BO',
    name: 'Spanish (Bolivia)'
  },
  'es-CL': {
    code: 'es-CL',
    name: 'Spanish (Chile)'
  },
  'es-CO': {
    code: 'es-CO',
    name: 'Spanish (Colombia)'
  },
  'es-CR': {
    code: 'es-CR',
    name: 'Spanish (Costa Rica)'
  },
  'es-DO': {
    code: 'es-DO',
    name: 'Spanish (Dominican Republic)'
  },
  'es-EC': {
    code: 'es-EC',
    name: 'Spanish (Ecuador)'
  },
  'es-ES': {
    code: 'es-ES',
    name: 'Spanish (Spain)'
  },
  'es-GT': {
    code: 'es-GT',
    name: 'Spanish (Guatemala)'
  },
  'es-HN': {
    code: 'es-HN',
    name: 'Spanish (Honduras)'
  },
  'es-MX': {
    code: 'es-MX',
    name: 'Spanish (Mexico)'
  },
  'es-NI': {
    code: 'es-NI',
    name: 'Spanish (Nicaragua)'
  },
  'es-PA': {
    code: 'es-PA',
    name: 'Spanish (Panama)'
  },
  'es-PE': {
    code: 'es-PE',
    name: 'Spanish (Peru)'
  },
  'es-PR': {
    code: 'es-PR',
    name: 'Spanish (Puerto Rico)'
  },
  'es-PY': {
    code: 'es-PY',
    name: 'Spanish (Paraguay)'
  },
  'es-SV': {
    code: 'es-SV',
    name: 'Spanish (El Salvador)'
  },
  'es-UY': {
    code: 'es-UY',
    name: 'Spanish (Uruguay)'
  },
  'es-VE': {
    code: 'es-VE',
    name: 'Spanish (Venezuela)'
  },
  'et': {
    code: 'et',
    name: 'Estonian'
  },
  'et-EE': {
    code: 'et-EE',
    name: 'Estonian (Estonia)'
  },
  'eu': {
    code: 'eu',
    name: 'Basque'
  },
  'eu-ES': {
    code: 'eu-ES',
    name: 'Basque (Spain)'
  },
  'fa': {
    code: 'fa',
    name: 'Farsi'
  },
  'fa-IR': {
    code: 'fa-IR',
    name: 'Farsi (Iran)'
  },
  'fi': {
    code: 'fi',
    name: 'Finnish',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd.mm.yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'fi-FI': {
    code: 'fi-FI',
    name: 'Finnish (Finland)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd.mm.yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'fo': {
    code: 'fo',
    name: 'Faroese'
  },
  'fo-FO': {
    code: 'fo-FO',
    name: 'Faroese (Faroe Islands)'
  },
  'fr': {
    code: 'fr',
    name: 'français'
  },
  'fr-BE': {
    code: 'fr-BE',
    name: 'French (Belgium)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'fr-CA': {
    code: 'fr-CA',
    name: 'French (Canada)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'fr-CH': {
    code: 'fr-CH',
    name: 'French (Switzerland)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'fr-FR': {
    code: 'fr-FR',
    name: 'French (France)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'fr-LU': {
    code: 'fr-LU',
    name: 'French (Luxembourg)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'fr-MC': {
    code: 'fr-MC',
    name: 'French (Principality of Monaco)',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'gl': {
    code: 'gl',
    name: 'Galician'
  },
  'gl-ES': {
    code: 'gl-ES',
    name: 'Galician (Spain)'
  },
  'gu': {
    code: 'gu',
    name: 'Gujarati'
  },
  'gu-IN': {
    code: 'gu-IN',
    name: 'Gujarati (India)'
  },
  'he': {
    code: 'he',
    name: 'Hebrew'
  },
  'he-IL': {
    code: 'he-IL',
    name: 'Hebrew (Israel)'
  },
  'hi': {
    code: 'hi',
    name: 'Hindi'
  },
  'hi-IN': {
    code: 'hi-IN',
    name: 'Hindi (India)'
  },
  'hr': {
    code: 'hr',
    name: 'Croatian'
  },
  'hr-BA': {
    code: 'hr-BA',
    name: 'Croatian (Bosnia and Herzegovina)'
  },
  'hr-HR': {
    code: 'hr-HR',
    name: 'Croatian (Croatia)'
  },
  'hu': {
    code: 'hu',
    name: 'Hungarian'
  },
  'hu-HU': {
    code: 'hu-HU',
    name: 'Hungarian (Hungary)'
  },
  'hy': {
    code: 'hy',
    name: 'Armenian'
  },
  'hy-AM': {
    code: 'hy-AM',
    name: 'Armenian (Armenia)'
  },
  'id': {
    code: 'id',
    name: 'Indonesian'
  },
  'id-ID': {
    code: 'id-ID',
    name: 'Indonesian (Indonesia)'
  },
  'is': {
    code: 'is',
    name: 'Icelandic'
  },
  'is-IS': {
    code: 'is-IS',
    name: 'Icelandic (Iceland)'
  },
  'it': {
    code: 'it',
    name: 'Italian',
    currencyFormat: '#,###',
    numberFormat: '#.###,000',
    dateFormat: 'dd.mm.yy',
    timeFormat: 'HH:mm:ss'
  },
  'it-CH': {
    code: 'it-CH',
    name: 'Italian (Switzerland)'
  },
  'it-IT': {
    code: 'it-IT',
    name: 'Italian (Italy)'
  },
  'ja': {
    code: 'ja',
    currency: 'ja-JP',
    name: 'LANG_JA',
    datetimeFormat: 'yyyy-MM-dd HH:mm:ss',
    currencyFormat: '#,###',
    numberFormat: '#,###.00',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'ja-JP': {
    code: 'ja-JP',
    name: '日本語',
    currencyFormat: '#,###',
    numberFormat: '#,###.00',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'ka': {
    code: 'ka',
    name: 'Georgian'
  },
  'ka-GE': {
    code: 'ka-GE',
    name: 'Georgian (Georgia)'
  },
  'kk': {
    code: 'kk',
    name: 'Kazakh'
  },
  'kk-KZ': {
    code: 'kk-KZ',
    name: 'Kazakh (Kazakhstan)'
  },
  'kn': {
    code: 'kn',
    name: 'Kannada'
  },
  'kn-IN': {
    code: 'kn-IN',
    name: 'Kannada (India)'
  },
  'ko': {
    code: 'ko',
    currency: 'kr',
    name: 'LANG_KO',
    datetimeFormat: 'yyyy-MM-dd HH:mm:ss',
    currencyFormat: '#,###,###',
    numberFormat: '#,###.###',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss',
    dateWithWeekFormat: '{date}(Www)',
    weekFormat: 'Www',
    querter: 'Q{q}'
  },
  'ko-KR': {
    code: 'ko',
    name: 'Korean (Korea)',
    currencyFormat: '#,###,###',
    numberFormat: '#,###.###',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'kok': {
    code: 'kok',
    name: 'Konkani'
  },
  'kok-IN': {
    code: 'kok-IN',
    name: 'Konkani (India)'
  },
  'ky': {
    code: 'ky',
    name: 'Kyrgyz'
  },
  'ky-KG': {
    code: 'ky-KG',
    name: 'Kyrgyz (Kyrgyzstan)'
  },
  'lt': {
    code: 'lt',
    name: 'Lithuanian'
  },
  'lt-LT': {
    code: 'lt-LT',
    name: 'Lithuanian (Lithuania)'
  },
  'lv': {
    code: 'lv',
    name: 'Latvian'
  },
  'lv-LV': {
    code: 'lv-LV',
    name: 'Latvian (Latvia)'
  },
  'mi': {
    code: 'mi',
    name: 'Maori'
  },
  'mi-NZ': {
    code: 'mi-NZ',
    name: 'Maori (New Zealand)'
  },
  'mk': {
    code: 'mk',
    name: 'FYRO Macedonian'
  },
  'mk-MK': {
    code: 'mk-MK',
    name: 'FYRO Macedonian (Former Yugoslav Republic of Macedonia)'
  },
  'mn': {
    code: 'mn',
    name: 'Mongolian'
  },
  'mn-MN': {
    code: 'mn-MN',
    name: 'Mongolian (Mongolia)'
  },
  'mr': {
    code: 'mr',
    name: 'Marathi'
  },
  'mr-IN': {
    code: 'mr-IN',
    name: 'Marathi (India)'
  },
  'ms': {
    code: 'ms',
    name: 'Malay'
  },
  'ms-BN': {
    code: 'ms-BN',
    name: 'Malay (Brunei Darussalam)'
  },
  'ms-MY': {
    code: 'ms-MY',
    name: 'Malay (Malaysia)'
  },
  'mt': {
    code: 'mt',
    name: 'Maltese'
  },
  'mt-MT': {
    code: 'mt-MT',
    name: 'Maltese (Malta)'
  },
  'nb': {
    code: 'nb',
    name: 'Norwegian (Bokm?l)',
    currencyFormat: '#,###,###',
    numberFormat: '#.###,000',
    dateFormat: 'dd.mm.yy',
    timeFormat: 'HH:mm:ss'
  },
  'nb-NO': {
    code: 'nb-NO',
    name: 'Norwegian (Bokm?l) (Norway)'
  },
  'nl': {
    code: 'nl',
    name: 'Dutch'
  },
  'nl-BE': {
    code: 'nl-BE',
    name: 'Dutch (Belgium)'
  },
  'nl-NL': {
    code: 'nl-NL',
    name: 'Dutch (Netherlands)'
  },
  'nn-NO': {
    code: 'nn-NO',
    name: 'Norwegian (Nynorsk) (Norway)'
  },
  'ns': {
    code: 'ns',
    name: 'Northern Sotho'
  },
  'ns-ZA': {
    code: 'ns-ZA',
    name: 'Northern Sotho (South Africa)'
  },
  'pa': {
    code: 'pa',
    name: 'Punjabi'
  },
  'pa-IN': {
    code: 'pa-IN',
    name: 'Punjabi (India)'
  },
  'pl': {
    code: 'pl',
    name: 'Polish'
  },
  'pl-PL': {
    code: 'pl-PL',
    name: 'Polish (Poland)'
  },
  'ps': {
    code: 'ps',
    name: 'Pashto'
  },
  'ps-AR': {
    code: 'ps-AR',
    name: 'Pashto (Afghanistan)'
  },
  'pt': {
    code: 'pt',
    name: 'Portuguese'
  },
  'pt-BR': {
    code: 'pt-BR',
    name: 'Portuguese (Brazil)'
  },
  'pt-PT': {
    code: 'pt-PT',
    name: 'Portuguese (Portugal)'
  },
  'qu': {
    code: 'qu',
    name: 'Quechua'
  },
  'qu-BO': {
    code: 'qu-BO',
    name: 'Quechua (Bolivia)'
  },
  'qu-EC': {
    code: 'qu-EC',
    name: 'Quechua (Ecuador)'
  },
  'qu-PE': {
    code: 'qu-PE',
    name: 'Quechua (Peru)'
  },
  'ro': {
    code: 'ro',
    name: 'Romanian'
  },
  'ro-RO': {
    code: 'ro-RO',
    name: 'Romanian (Romania)'
  },
  'ru': {
    code: 'ru',
    name: 'Russian'
  },
  'ru-RU': {
    code: 'ru-RU',
    name: 'Russian (Russia)'
  },
  'sa': {
    code: 'sa',
    name: 'Sanskrit'
  },
  'sa-IN': {
    code: 'sa-IN',
    name: 'Sanskrit (India)'
  },
  'se': {
    code: 'se',
    name: 'Sami (Northern)'
  },
  'se-FI': {
    code: 'se-FI',
    name: 'Sami (Northern) (Finland)'
  },
  'se-NO': {
    code: 'se-NO',
    name: 'Sami (Northern) (Norway)'
  },
  'se-SE': {
    code: 'se-SE',
    name: 'Sami (Northern) (Sweden)'
  },
  'sk': {
    code: 'sk',
    name: 'Slovak'
  },
  'sk-SK': {
    code: 'sk-SK',
    name: 'Slovak (Slovakia)'
  },
  'sl': {
    code: 'sl',
    name: 'Slovenian'
  },
  'sl-SI': {
    code: 'sl-SI',
    name: 'Slovenian (Slovenia)'
  },
  'sq': {
    code: 'sq',
    name: 'Albanian'
  },
  'sq-AL': {
    code: 'sq-AL',
    name: 'Albanian (Albania)'
  },
  'sr-BA': {
    code: 'sr-BA',
    name: 'Serbian (Latin) (Bosnia and Herzegovina)'
  },
  'sr-SP': {
    code: 'sr-SP',
    name: 'Serbian (Latin) (Serbia and Montenegro)'
  },
  'sv': {
    code: 'sv',
    name: 'Swedish',
    currencyFormat: '#,###,###',
    numberFormat: '# ###,000',
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'sv-FI': {
    code: 'sv-FI',
    name: 'Swedish (Finland)'
  },
  'sv-SE': {
    code: 'sv-SE',
    name: 'Swedish (Sweden)'
  },
  'sw': {
    code: 'sw',
    name: 'Swahili'
  },
  'sw-KE': {
    code: 'sw-KE',
    name: 'Swahili (Kenya)'
  },
  'syr': {
    code: 'syr',
    name: 'Syriac'
  },
  'syr-SY': {
    code: 'syr-SY',
    name: 'Syriac (Syria)'
  },
  'ta': {
    code: 'ta',
    name: 'Tamil'
  },
  'ta-IN': {
    code: 'ta-IN',
    name: 'Tamil (India)'
  },
  'te': {
    code: 'te',
    name: 'Telugu'
  },
  'te-IN': {
    code: 'te-IN',
    name: 'Telugu (India)'
  },
  'th': {
    code: 'th',
    name: 'Thai',
    currencyFormat: '#,###,###',
    numberFormat: '#,###,###.00',
    dateFormat: 'dd/mm/yyyy',
    timeFormat: 'HH:mm:ss'
  },
  'th-TH': {
    code: 'th-TH',
    name: 'Thai (Thailand)'
  },
  'tl': {
    code: 'tl',
    name: 'Tagalog'
  },
  'tl-PH': {
    code: 'tl-PH',
    name: 'Tagalog (Philippines)'
  },
  'tn': {
    code: 'tn',
    name: 'Tswana'
  },
  'tn-ZA': {
    code: 'tn-ZA',
    name: 'Tswana (South Africa)'
  },
  'tr': {
    code: 'tr',
    name: 'Turkish'
  },
  'tr-TR': {
    code: 'tr-TR',
    name: 'Turkish (Turkey)'
  },
  'tt': {
    code: 'tt',
    name: 'Tatar'
  },
  'tt-RU': {
    code: 'tt-RU',
    name: 'Tatar (Russia)'
  },
  'ts': {
    code: 'ts',
    name: 'Tsonga'
  },
  'uk': {
    code: 'uk',
    name: 'Ukrainian'
  },
  'uk-UA': {
    code: 'uk-UA',
    name: 'Ukrainian (Ukraine)'
  },
  'ur': {
    code: 'ur',
    name: 'Urdu'
  },
  'ur-PK': {
    code: 'ur-PK',
    name: 'Urdu (Islamic Republic of Pakistan)'
  },
  'uz': {
    code: 'uz',
    name: 'Uzbek (Latin)'
  },
  'uz-UZ': {
    code: 'uz-UZ',
    name: 'Uzbek (Latin) (Uzbekistan)'
  },
  'vi': {
    code: 'vi',
    name: 'LANG_VI',
    datetimeFormat: 'dd-MM-yyyy HH:mm:ss',
    currencyFormat: '#,###,###',
    numberFormat: '#,###.###',
    dateFormat: 'dd-MM-yyyy',
    timeFormat: 'HH:mm:ss',
    dateWithWeekFormat: 'dd-MM-yyyy, Www',
    weekFormat: 'Www',
    querter: 'Q{q}'
  },
  'vi-VN': {
    code: 'vi-VN',
    name: 'Vietnamese (Viet Nam)'
  },
  'xh': {
    code: 'xh',
    name: 'Xhosa'
  },
  'xh-ZA': {
    code: 'xh-ZA',
    name: 'Xhosa (South Africa)'
  },
  'zh': {
    code: 'zh-CN',
    currency: 'zh-CN',
    name: 'LANG_ZH',
    datetimeFormat: 'yyyy-MM-dd HH:mm:ss',
    currencyFormat: '#,###,###',
    numberFormat: '#,###.00',
    decimalsPlace: 2,
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'zh-CN': {
    code: 'zh-CN',
    name: '中國語',
    currencyFormat: '#,###,###',
    numberFormat: '#,###.00',
    decimalsPlace: 2,
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'zh-HK': {
    code: 'zh-HK',
    name: 'Chinese (Hong Kong)'
  },
  'zh-MO': {
    code: 'zh-MO',
    name: 'Chinese (Macau)'
  },
  'zh-SG': {
    code: 'zh-SG',
    name: 'Chinese (Singapore)'
  },
  'zh-TW': {
    code: 'zh-TW',
    currency: 'zh-TW',
    name: 'LANG_TW',
    datetimeFormat: 'yyyy-MM-dd HH:mm:ss',
    currencyFormat: '#,###,###',
    numberFormat: '#,###.00',
    decimalsPlace: 2,
    dateFormat: 'yyyy-MM-dd',
    timeFormat: 'HH:mm:ss'
  },
  'zu': {
    code: 'zu',
    name: 'Zulu'
  },
  'zu-ZA': {
    code: 'zu-ZA',
    name: 'Zulu (South Africa)'
  }
};
