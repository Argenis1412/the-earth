import { normalizeText } from '../geography/coordinates.js';
import {
  CAPITAL_EN,
  CAPITAL_EN_BY_NAME,
  CONTINENT_EN,
  CURRENCY_EN,
  LANGUAGE_EN,
  NAME_EN,
  NAME_EN_BY_NAME,
} from './countryDetails.en.js';

/**
 * Detailed country information catalogue in Spanish for world countries and territories.
 * Decoupled from DOM and Three.js.
 */
export const COUNTRY_DETAILS = [
  {
    "name": "Afganistán",
    "capital": "Kabul",
    "population": 41128771,
    "languages": [
      "Pastún",
      "Darí"
    ],
    "currency": "Afgani afgano (؋)",
    "iso2": "AF",
    "iso3": "AFG",
    "flag": "🇦🇫",
    "continent": "Asia"
  },
  {
    "name": "Alandia",
    "capital": "Mariehamn",
    "population": 30344,
    "languages": [
      "Sueco"
    ],
    "currency": "Euro (€)",
    "iso2": "AX",
    "iso3": "ALA",
    "flag": "🇦🇽",
    "continent": "Europa"
  },
  {
    "name": "Albania",
    "capital": "Tirana",
    "population": 2761785,
    "languages": [
      "Albanés"
    ],
    "currency": "Lek albanés (L)",
    "iso2": "AL",
    "iso3": "ALB",
    "flag": "🇦🇱",
    "continent": "Europa"
  },
  {
    "name": "Alemania",
    "capital": "Berlín",
    "population": 84400000,
    "languages": [
      "Alemán"
    ],
    "currency": "Euro (€)",
    "iso2": "DE",
    "iso3": "DEU",
    "flag": "🇩🇪",
    "continent": "Europa"
  },
  {
    "name": "Andorra",
    "capital": "Andorra la Vieja",
    "population": 80088,
    "languages": [
      "Catalán",
      "Español"
    ],
    "currency": "Euro (€)",
    "iso2": "AD",
    "iso3": "AND",
    "flag": "🇦🇩",
    "continent": "Europa"
  },
  {
    "name": "Angola",
    "capital": "Luanda",
    "population": 35588987,
    "languages": [
      "Portugués"
    ],
    "currency": "Kwanza angoleño (Kz)",
    "iso2": "AO",
    "iso3": "AGO",
    "flag": "🇦🇴",
    "continent": "África"
  },
  {
    "name": "Anguilla",
    "capital": "The Valley",
    "population": 15753,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "AI",
    "iso3": "AIA",
    "flag": "🇦🇮",
    "continent": "América del Norte"
  },
  {
    "name": "Antigua y Barbuda",
    "capital": "Saint John",
    "population": 93763,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "AG",
    "iso3": "ATG",
    "flag": "🇦🇬",
    "continent": "América del Norte"
  },
  {
    "name": "Antártida",
    "capital": "Tratado Antártico",
    "population": 1100,
    "languages": [
      "Varios"
    ],
    "currency": "Diversas",
    "iso2": "AQ",
    "iso3": "ATA",
    "flag": "🇦🇶",
    "continent": "Antártida"
  },
  {
    "name": "Arabia Saudí",
    "capital": "Riad",
    "population": 32175224,
    "languages": [
      "Árabe"
    ],
    "currency": "Riyal saudí (﷼)",
    "iso2": "SA",
    "iso3": "SAU",
    "flag": "🇸🇦",
    "continent": "Asia"
  },
  {
    "name": "Argelia",
    "capital": "Argel",
    "population": 44900000,
    "languages": [
      "Árabe",
      "Tamazight"
    ],
    "currency": "Dinar argelino (د.ج)",
    "iso2": "DZ",
    "iso3": "DZA",
    "flag": "🇩🇿",
    "continent": "África"
  },
  {
    "name": "Argentina",
    "capital": "Buenos Aires",
    "population": 46044703,
    "languages": [
      "Español"
    ],
    "currency": "Peso argentino ($)",
    "iso2": "AR",
    "iso3": "ARG",
    "flag": "🇦🇷",
    "continent": "América del Sur"
  },
  {
    "name": "Armenia",
    "capital": "Ereván",
    "population": 2780469,
    "languages": [
      "Armenio"
    ],
    "currency": "Dram armenio (֏)",
    "iso2": "AM",
    "iso3": "ARM",
    "flag": "🇦🇲",
    "continent": "Asia"
  },
  {
    "name": "Aruba",
    "capital": "Oranjestad",
    "population": 106445,
    "languages": [
      "Papiamento",
      "Neerlandés"
    ],
    "currency": "Florín arubeño (ƒ)",
    "iso2": "AW",
    "iso3": "ABW",
    "flag": "🇦🇼",
    "continent": "América del Norte"
  },
  {
    "name": "Australia",
    "capital": "Camberra",
    "population": 26000000,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar australiano (A$)",
    "iso2": "AU",
    "iso3": "AUS",
    "flag": "🇦🇺",
    "continent": "Oceanía"
  },
  {
    "name": "Austria",
    "capital": "Viena",
    "population": 9104772,
    "languages": [
      "Alemán"
    ],
    "currency": "Euro (€)",
    "iso2": "AT",
    "iso3": "AUT",
    "flag": "🇦🇹",
    "continent": "Europa"
  },
  {
    "name": "Azerbaiyán",
    "capital": "Bakú",
    "population": 10173200,
    "languages": [
      "Azerí"
    ],
    "currency": "Manat azerí (₼)",
    "iso2": "AZ",
    "iso3": "AZE",
    "flag": "🇦🇿",
    "continent": "Asia"
  },
  {
    "name": "Bahamas",
    "capital": "Nasáu",
    "population": 409984,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar bahameño (B$)",
    "iso2": "BS",
    "iso3": "BHS",
    "flag": "🇧🇸",
    "continent": "América del Norte"
  },
  {
    "name": "Bahrein",
    "capital": "Manama",
    "population": 1472233,
    "languages": [
      "Árabe"
    ],
    "currency": "Dinar bareiní (.د.ب)",
    "iso2": "BH",
    "iso3": "BHR",
    "flag": "🇧🇭",
    "continent": "Asia"
  },
  {
    "name": "Bangladesh",
    "capital": "Daca",
    "population": 171186372,
    "languages": [
      "Bengalí"
    ],
    "currency": "Taka (৳)",
    "iso2": "BD",
    "iso3": "BGD",
    "flag": "🇧🇩",
    "continent": "Asia"
  },
  {
    "name": "Barbados",
    "capital": "Bridgetown",
    "population": 281635,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar de Barbados (Bds$)",
    "iso2": "BB",
    "iso3": "BRB",
    "flag": "🇧🇧",
    "continent": "América del Norte"
  },
  {
    "name": "Belice",
    "capital": "Belmopán",
    "population": 405272,
    "languages": [
      "Inglés",
      "Español"
    ],
    "currency": "Dólar beliceño (BZ$)",
    "iso2": "BZ",
    "iso3": "BLZ",
    "flag": "🇧🇿",
    "continent": "América del Norte"
  },
  {
    "name": "Benín",
    "capital": "Porto Novo",
    "population": 13352864,
    "languages": [
      "Francés"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "BJ",
    "iso3": "BEN",
    "flag": "🇧🇯",
    "continent": "África"
  },
  {
    "name": "Bermudas",
    "capital": "Hamilton",
    "population": 63532,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar bermudeño (BD$)",
    "iso2": "BM",
    "iso3": "BMU",
    "flag": "🇧🇲",
    "continent": "América del Norte"
  },
  {
    "name": "Bielorrusia",
    "capital": "Minsk",
    "population": 9200617,
    "languages": [
      "Bielorruso",
      "Ruso"
    ],
    "currency": "Rublo bielorruso (Br)",
    "iso2": "BY",
    "iso3": "BLR",
    "flag": "🇧🇾",
    "continent": "Europa"
  },
  {
    "name": "Bolivia",
    "capital": "Sucre / La Paz",
    "population": 12224110,
    "languages": [
      "Español",
      "Quechua",
      "Aimara"
    ],
    "currency": "Boliviano (Bs)",
    "iso2": "BO",
    "iso3": "BOL",
    "flag": "🇧🇴",
    "continent": "América del Sur"
  },
  {
    "name": "Bosnia y Herzegovina",
    "capital": "Sarajevo",
    "population": 3233526,
    "languages": [
      "Bosnio",
      "Croata",
      "Serbio"
    ],
    "currency": "Marco convertible (KM)",
    "iso2": "BA",
    "iso3": "BIH",
    "flag": "🇧🇦",
    "continent": "Europa"
  },
  {
    "name": "Botswana",
    "capital": "Gaborone",
    "population": 2630296,
    "languages": [
      "Inglés",
      "Setsuana"
    ],
    "currency": "Pula (P)",
    "iso2": "BW",
    "iso3": "BWA",
    "flag": "🇧🇼",
    "continent": "África"
  },
  {
    "name": "Brasil",
    "capital": "Brasilia",
    "population": 215313498,
    "languages": [
      "Portugués"
    ],
    "currency": "Real brasileño (R$)",
    "iso2": "BR",
    "iso3": "BRA",
    "flag": "🇧🇷",
    "continent": "América del Sur"
  },
  {
    "name": "Brunei",
    "capital": "Bandar Seri Begawan",
    "population": 449002,
    "languages": [
      "Malayo"
    ],
    "currency": "Dólar de Brunéi (B$)",
    "iso2": "BN",
    "iso3": "BRN",
    "flag": "🇧🇳",
    "continent": "Asia"
  },
  {
    "name": "Bulgaria",
    "capital": "Sofía",
    "population": 6447710,
    "languages": [
      "Búlgaro"
    ],
    "currency": "Lev búlgaro (лв)",
    "iso2": "BG",
    "iso3": "BGR",
    "flag": "🇧🇬",
    "continent": "Europa"
  },
  {
    "name": "Burkina Faso",
    "capital": "Uagadugú",
    "population": 22673762,
    "languages": [
      "Francés",
      "Mossi"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "BF",
    "iso3": "BFA",
    "flag": "🇧🇫",
    "continent": "África"
  },
  {
    "name": "Burundi",
    "capital": "Gitega",
    "population": 12889576,
    "languages": [
      "Kirundi",
      "Francés",
      "Inglés"
    ],
    "currency": "Franco burundés (FBu)",
    "iso2": "BI",
    "iso3": "BDI",
    "flag": "🇧🇮",
    "continent": "África"
  },
  {
    "name": "Bután",
    "capital": "Timbu",
    "population": 782455,
    "languages": [
      "Dzongkha"
    ],
    "currency": "Ngultrum butanés (Nu.)",
    "iso2": "BT",
    "iso3": "BTN",
    "flag": "🇧🇹",
    "continent": "Asia"
  },
  {
    "name": "Bélgica",
    "capital": "Bruselas",
    "population": 11697557,
    "languages": [
      "Neerlandés",
      "Francés",
      "Alemán"
    ],
    "currency": "Euro (€)",
    "iso2": "BE",
    "iso3": "BEL",
    "flag": "🇧🇪",
    "continent": "Europa"
  },
  {
    "name": "Cabo Verde",
    "capital": "Praia",
    "population": 593149,
    "languages": [
      "Portugués"
    ],
    "currency": "Escudo caboverdiano ($)",
    "iso2": "CV",
    "iso3": "CPV",
    "flag": "🇨🇻",
    "continent": "África"
  },
  {
    "name": "Camboya",
    "capital": "Nom Pen",
    "population": 16767842,
    "languages": [
      "Jemer"
    ],
    "currency": "Riel camboyano (៛)",
    "iso2": "KH",
    "iso3": "KHM",
    "flag": "🇰🇭",
    "continent": "Asia"
  },
  {
    "name": "Camerún",
    "capital": "Yaundé",
    "population": 27914536,
    "languages": [
      "Francés",
      "Inglés"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "CM",
    "iso3": "CMR",
    "flag": "🇨🇲",
    "continent": "África"
  },
  {
    "name": "Canadá",
    "capital": "Ottawa",
    "population": 40000000,
    "languages": [
      "Inglés",
      "Francés"
    ],
    "currency": "Dólar canadiense (C$)",
    "iso2": "CA",
    "iso3": "CAN",
    "flag": "🇨🇦",
    "continent": "América del Norte"
  },
  {
    "name": "Catar",
    "capital": "Doha",
    "population": 2979200,
    "languages": [
      "Árabe"
    ],
    "currency": "Riyal catarí (ر.ق)",
    "iso2": "QA",
    "iso3": "QAT",
    "flag": "🇶🇦",
    "continent": "Asia"
  },
  {
    "name": "Chad",
    "capital": "Yamena",
    "population": 17723315,
    "languages": [
      "Francés",
      "Árabe"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "TD",
    "iso3": "TCD",
    "flag": "🇹🇩",
    "continent": "África"
  },
  {
    "name": "Chequia",
    "capital": "Praga",
    "population": 10827529,
    "languages": [
      "Checo"
    ],
    "currency": "Corona checa (Kč)",
    "iso2": "CZ",
    "iso3": "CZE",
    "flag": "🇨🇿",
    "continent": "Europa"
  },
  {
    "name": "Chile",
    "capital": "Santiago de Chile",
    "population": 19603733,
    "languages": [
      "Español"
    ],
    "currency": "Peso chileno ($)",
    "iso2": "CL",
    "iso3": "CHL",
    "flag": "🇨🇱",
    "continent": "América del Sur"
  },
  {
    "name": "China",
    "capital": "Pekín",
    "population": 1411750000,
    "languages": [
      "Chino mandarín"
    ],
    "currency": "Yuan chino (¥)",
    "iso2": "CN",
    "iso3": "CHN",
    "flag": "🇨🇳",
    "continent": "Asia"
  },
  {
    "name": "Chipre",
    "capital": "Nicosia",
    "population": 1251488,
    "languages": [
      "Griego",
      "Turco"
    ],
    "currency": "Euro (€)",
    "iso2": "CY",
    "iso3": "CYP",
    "flag": "🇨🇾",
    "continent": "Europa"
  },
  {
    "name": "Chipre del Norte",
    "capital": "Nicosia del Norte",
    "population": 382836,
    "languages": [
      "Turco"
    ],
    "currency": "Lira turca (₺)",
    "iso2": "CY",
    "iso3": "CYP",
    "flag": "🇨🇾",
    "continent": "Europa"
  },
  {
    "name": "Ciudad del Vaticano",
    "capital": "Ciudad del Vaticano",
    "population": 825,
    "languages": [
      "Italiano",
      "Latín"
    ],
    "currency": "Euro (€)",
    "iso2": "VA",
    "iso3": "VAT",
    "flag": "🇻🇦",
    "continent": "Europa"
  },
  {
    "name": "Colombia",
    "capital": "Bogotá",
    "population": 51874024,
    "languages": [
      "Español"
    ],
    "currency": "Peso colombiano ($)",
    "iso2": "CO",
    "iso3": "COL",
    "flag": "🇨🇴",
    "continent": "América del Sur"
  },
  {
    "name": "Comoras",
    "capital": "Moroni",
    "population": 836774,
    "languages": [
      "Comorense",
      "Árabe",
      "Francés"
    ],
    "currency": "Franco comorense (CF)",
    "iso2": "KM",
    "iso3": "COM",
    "flag": "🇰🇲",
    "continent": "África"
  },
  {
    "name": "Congo",
    "capital": "Brazzaville",
    "population": 6106869,
    "languages": [
      "Francés",
      "Lingala"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "CG",
    "iso3": "COG",
    "flag": "🇨🇬",
    "continent": "África"
  },
  {
    "name": "Congo (Rep. Dem.)",
    "capital": "Kinsasa",
    "population": 99010212,
    "languages": [
      "Francés",
      "Lingala",
      "Suajili"
    ],
    "currency": "Franco congoleño (FC)",
    "iso2": "CD",
    "iso3": "COD",
    "flag": "🇨🇩",
    "continent": "África"
  },
  {
    "name": "Corea del Norte",
    "capital": "Pionyang",
    "population": 26000000,
    "languages": [
      "Coreano"
    ],
    "currency": "Won norcoreano (₩)",
    "iso2": "KP",
    "iso3": "PRK",
    "flag": "🇰🇵",
    "continent": "Asia"
  },
  {
    "name": "Corea del Sur",
    "capital": "Seúl",
    "population": 51740000,
    "languages": [
      "Coreano"
    ],
    "currency": "Won surcoreano (₩)",
    "iso2": "KR",
    "iso3": "KOR",
    "flag": "🇰🇷",
    "continent": "Asia"
  },
  {
    "name": "Costa Rica",
    "capital": "San José",
    "population": 5180829,
    "languages": [
      "Español"
    ],
    "currency": "Colón costarricense (₡)",
    "iso2": "CR",
    "iso3": "CRI",
    "flag": "🇨🇷",
    "continent": "América del Norte"
  },
  {
    "name": "Costa de Marfil",
    "capital": "Yamusukro",
    "population": 29389150,
    "languages": [
      "Francés"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "CI",
    "iso3": "CIV",
    "flag": "🇨🇮",
    "continent": "África"
  },
  {
    "name": "Croacia",
    "capital": "Zagreb",
    "population": 3855641,
    "languages": [
      "Croata"
    ],
    "currency": "Euro (€)",
    "iso2": "HR",
    "iso3": "HRV",
    "flag": "🇭🇷",
    "continent": "Europa"
  },
  {
    "name": "Cuba",
    "capital": "La Habana",
    "population": 11212191,
    "languages": [
      "Español"
    ],
    "currency": "Peso cubano ($)",
    "iso2": "CU",
    "iso3": "CUB",
    "flag": "🇨🇺",
    "continent": "América del Norte"
  },
  {
    "name": "Curazao",
    "capital": "Willemstad",
    "population": 152369,
    "languages": [
      "Papiamento",
      "Neerlandés"
    ],
    "currency": "Florín antillano (NAƒ)",
    "iso2": "CW",
    "iso3": "CUW",
    "flag": "🇨🇼",
    "continent": "América del Norte"
  },
  {
    "name": "Dinamarca",
    "capital": "Copenhague",
    "population": 5932654,
    "languages": [
      "Danés"
    ],
    "currency": "Corona danesa (kr)",
    "iso2": "DK",
    "iso3": "DNK",
    "flag": "🇩🇰",
    "continent": "Europa"
  },
  {
    "name": "Djibouti",
    "capital": "Yibuti",
    "population": 1120849,
    "languages": [
      "Árabe",
      "Francés"
    ],
    "currency": "Franco yibutiano (Fdj)",
    "iso2": "DJ",
    "iso3": "DJI",
    "flag": "🇩🇯",
    "continent": "África"
  },
  {
    "name": "Dominica",
    "capital": "Roseau",
    "population": 72737,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "DM",
    "iso3": "DMA",
    "flag": "🇩🇲",
    "continent": "América del Norte"
  },
  {
    "name": "Ecuador",
    "capital": "Quito",
    "population": 18001000,
    "languages": [
      "Español",
      "Kichwa"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "EC",
    "iso3": "ECU",
    "flag": "🇪🇨",
    "continent": "América del Sur"
  },
  {
    "name": "Egipto",
    "capital": "El Cairo",
    "population": 112716598,
    "languages": [
      "Árabe"
    ],
    "currency": "Libra egipcia (E£)",
    "iso2": "EG",
    "iso3": "EGY",
    "flag": "🇪🇬",
    "continent": "África"
  },
  {
    "name": "El Salvador",
    "capital": "San Salvador",
    "population": 6336392,
    "languages": [
      "Español"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "SV",
    "iso3": "SLV",
    "flag": "🇸🇻",
    "continent": "América del Norte"
  },
  {
    "name": "Emiratos Árabes Unidos",
    "capital": "Abu Dabi",
    "population": 9441129,
    "languages": [
      "Árabe"
    ],
    "currency": "Dírham de los EAU (د.إ)",
    "iso2": "AE",
    "iso3": "ARE",
    "flag": "🇦🇪",
    "continent": "Asia"
  },
  {
    "name": "Eritrea",
    "capital": "Asmara",
    "population": 3684032,
    "languages": [
      "Tigriña",
      "Árabe",
      "Inglés"
    ],
    "currency": "Nakfa eritreo (Nkf)",
    "iso2": "ER",
    "iso3": "ERI",
    "flag": "🇪🇷",
    "continent": "África"
  },
  {
    "name": "Eslovaquia",
    "capital": "Bratislava",
    "population": 5428792,
    "languages": [
      "Eslovaco"
    ],
    "currency": "Euro (€)",
    "iso2": "SK",
    "iso3": "SVK",
    "flag": "🇸🇰",
    "continent": "Europa"
  },
  {
    "name": "Eslovenia",
    "capital": "Liubliana",
    "population": 2116972,
    "languages": [
      "Esloveno"
    ],
    "currency": "Euro (€)",
    "iso2": "SI",
    "iso3": "SVN",
    "flag": "🇸🇮",
    "continent": "Europa"
  },
  {
    "name": "España",
    "capital": "Madrid",
    "population": 47420000,
    "languages": [
      "Español"
    ],
    "currency": "Euro (€)",
    "iso2": "ES",
    "iso3": "ESP",
    "flag": "🇪🇸",
    "continent": "Europa"
  },
  {
    "name": "Estados Unidos",
    "capital": "Washington D. C.",
    "population": 333287557,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "US",
    "iso3": "USA",
    "flag": "🇺🇸",
    "continent": "América del Norte"
  },
  {
    "name": "Estonia",
    "capital": "Tallin",
    "population": 1365884,
    "languages": [
      "Estonio"
    ],
    "currency": "Euro (€)",
    "iso2": "EE",
    "iso3": "EST",
    "flag": "🇪🇪",
    "continent": "Europa"
  },
  {
    "name": "Etiopía",
    "capital": "Adís Abeba",
    "population": 126527060,
    "languages": [
      "Amárico",
      "Oromo"
    ],
    "currency": "Birr etíope (Br)",
    "iso2": "ET",
    "iso3": "ETH",
    "flag": "🇪🇹",
    "continent": "África"
  },
  {
    "name": "Filipinas",
    "capital": "Manila",
    "population": 115559009,
    "languages": [
      "Filipino",
      "Inglés"
    ],
    "currency": "Peso filipino (₱)",
    "iso2": "PH",
    "iso3": "PHL",
    "flag": "🇵🇭",
    "continent": "Asia"
  },
  {
    "name": "Finlandia",
    "capital": "Helsinki",
    "population": 5563970,
    "languages": [
      "Finés",
      "Sueco"
    ],
    "currency": "Euro (€)",
    "iso2": "FI",
    "iso3": "FIN",
    "flag": "🇫🇮",
    "continent": "Europa"
  },
  {
    "name": "Fiyi",
    "capital": "Suva",
    "population": 929766,
    "languages": [
      "Inglés",
      "Fiyiano",
      "Hindi fiyiano"
    ],
    "currency": "Dólar fiyiano (FJ$)",
    "iso2": "FJ",
    "iso3": "FJI",
    "flag": "🇫🇯",
    "continent": "Oceanía"
  },
  {
    "name": "Francia",
    "capital": "París",
    "population": 67970000,
    "languages": [
      "Francés"
    ],
    "currency": "Euro (€)",
    "iso2": "FR",
    "iso3": "FRA",
    "flag": "🇫🇷",
    "continent": "Europa"
  },
  {
    "name": "Gabón",
    "capital": "Libreville",
    "population": 2388992,
    "languages": [
      "Francés"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "GA",
    "iso3": "GAB",
    "flag": "🇬🇦",
    "continent": "África"
  },
  {
    "name": "Gambia",
    "capital": "Banjul",
    "population": 2705992,
    "languages": [
      "Inglés"
    ],
    "currency": "Dalasi gambiano (D)",
    "iso2": "GM",
    "iso3": "GMB",
    "flag": "🇬🇲",
    "continent": "África"
  },
  {
    "name": "Georgia",
    "capital": "Tiflis",
    "population": 3712502,
    "languages": [
      "Georgiano"
    ],
    "currency": "Lari georgiano (₾)",
    "iso2": "GE",
    "iso3": "GEO",
    "flag": "🇬🇪",
    "continent": "Asia"
  },
  {
    "name": "Ghana",
    "capital": "Acra",
    "population": 34121985,
    "languages": [
      "Inglés"
    ],
    "currency": "Cedi ghanés (GH₵)",
    "iso2": "GH",
    "iso3": "GHA",
    "flag": "🇬🇭",
    "continent": "África"
  },
  {
    "name": "Glaciar Siachen",
    "capital": "Región militar",
    "population": 3000,
    "languages": [
      "Hindi",
      "Urdu"
    ],
    "currency": "Rupia india (₹)",
    "iso2": "IN",
    "iso3": "IND",
    "flag": "🏔️",
    "continent": "Asia"
  },
  {
    "name": "Grecia",
    "capital": "Atenas",
    "population": 10413982,
    "languages": [
      "Griego"
    ],
    "currency": "Euro (€)",
    "iso2": "GR",
    "iso3": "GRC",
    "flag": "🇬🇷",
    "continent": "Europa"
  },
  {
    "name": "Grenada",
    "capital": "Saint George",
    "population": 125438,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "GD",
    "iso3": "GRD",
    "flag": "🇬🇩",
    "continent": "América del Norte"
  },
  {
    "name": "Groenlandia",
    "capital": "Nuuk",
    "population": 56609,
    "languages": [
      "Groenlandés",
      "Danés"
    ],
    "currency": "Corona danesa (kr)",
    "iso2": "GL",
    "iso3": "GRL",
    "flag": "🇬🇱",
    "continent": "América del Norte"
  },
  {
    "name": "Guam",
    "capital": "Agaña",
    "population": 153836,
    "languages": [
      "Inglés",
      "Chamorro"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "GU",
    "iso3": "GUM",
    "flag": "🇬🇺",
    "continent": "Oceanía"
  },
  {
    "name": "Guatemala",
    "capital": "Ciudad de Guatemala",
    "population": 17980803,
    "languages": [
      "Español"
    ],
    "currency": "Quetzal (Q)",
    "iso2": "GT",
    "iso3": "GTM",
    "flag": "🇬🇹",
    "continent": "América del Norte"
  },
  {
    "name": "Guernsey",
    "capital": "Saint Peter Port",
    "population": 63463,
    "languages": [
      "Inglés"
    ],
    "currency": "Libra de Guernsey (£)",
    "iso2": "GG",
    "iso3": "GGY",
    "flag": "🇬🇬",
    "continent": "Europa"
  },
  {
    "name": "Guinea",
    "capital": "Conakri",
    "population": 13859341,
    "languages": [
      "Francés"
    ],
    "currency": "Franco guineano (FG)",
    "iso2": "GN",
    "iso3": "GIN",
    "flag": "🇬🇳",
    "continent": "África"
  },
  {
    "name": "Guinea Ecuatorial",
    "capital": "Malabo",
    "population": 1674908,
    "languages": [
      "Español",
      "Francés",
      "Portugués"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "GQ",
    "iso3": "GNQ",
    "flag": "🇬🇶",
    "continent": "África"
  },
  {
    "name": "Guinea-Bisáu",
    "capital": "Bisáu",
    "population": 2105566,
    "languages": [
      "Portugués"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "GW",
    "iso3": "GNB",
    "flag": "🇬🇼",
    "continent": "África"
  },
  {
    "name": "Guyana",
    "capital": "Georgetown",
    "population": 808726,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar guyanés ($)",
    "iso2": "GY",
    "iso3": "GUY",
    "flag": "🇬🇾",
    "continent": "América del Sur"
  },
  {
    "name": "Haití",
    "capital": "Puerto Príncipe",
    "population": 11584996,
    "languages": [
      "Francés",
      "Criollo haitiano"
    ],
    "currency": "Gourde (G)",
    "iso2": "HT",
    "iso3": "HTI",
    "flag": "🇭🇹",
    "continent": "América del Norte"
  },
  {
    "name": "Honduras",
    "capital": "Tegucigalpa",
    "population": 10432860,
    "languages": [
      "Español"
    ],
    "currency": "Lempira (L)",
    "iso2": "HN",
    "iso3": "HND",
    "flag": "🇭🇳",
    "continent": "América del Norte"
  },
  {
    "name": "Hong Kong",
    "capital": "Hong Kong",
    "population": 7498100,
    "languages": [
      "Cantonés",
      "Inglés"
    ],
    "currency": "Dólar de Hong Kong (HK$)",
    "iso2": "HK",
    "iso3": "HKG",
    "flag": "🇭🇰",
    "continent": "Asia"
  },
  {
    "name": "Hungría",
    "capital": "Budapest",
    "population": 9604000,
    "languages": [
      "Húngaro"
    ],
    "currency": "Forinto húngaro (Ft)",
    "iso2": "HU",
    "iso3": "HUN",
    "flag": "🇭🇺",
    "continent": "Europa"
  },
  {
    "name": "India",
    "capital": "Nueva Delhi",
    "population": 1428627663,
    "languages": [
      "Hindi",
      "Inglés"
    ],
    "currency": "Rupia india (₹)",
    "iso2": "IN",
    "iso3": "IND",
    "flag": "🇮🇳",
    "continent": "Asia"
  },
  {
    "name": "Indonesia",
    "capital": "Yakarta",
    "population": 277534122,
    "languages": [
      "Indonesio"
    ],
    "currency": "Rupia indonesia (Rp)",
    "iso2": "ID",
    "iso3": "IDN",
    "flag": "🇮🇩",
    "continent": "Asia"
  },
  {
    "name": "Irak",
    "capital": "Bagdad",
    "population": 44496122,
    "languages": [
      "Árabe",
      "Kurdo"
    ],
    "currency": "Dinar iraquí (ع.د)",
    "iso2": "IQ",
    "iso3": "IRQ",
    "flag": "🇮🇶",
    "continent": "Asia"
  },
  {
    "name": "Iran",
    "capital": "Teherán",
    "population": 88550570,
    "languages": [
      "Persa"
    ],
    "currency": "Rial iraní (﷼)",
    "iso2": "IR",
    "iso3": "IRN",
    "flag": "🇮🇷",
    "continent": "Asia"
  },
  {
    "name": "Irlanda",
    "capital": "Dublín",
    "population": 5127170,
    "languages": [
      "Irlandés",
      "Inglés"
    ],
    "currency": "Euro (€)",
    "iso2": "IE",
    "iso3": "IRL",
    "flag": "🇮🇪",
    "continent": "Europa"
  },
  {
    "name": "Isla de Man",
    "capital": "Douglas",
    "population": 84069,
    "languages": [
      "Inglés",
      "Manés"
    ],
    "currency": "Libra manesa (£)",
    "iso2": "IM",
    "iso3": "IMN",
    "flag": "🇮🇲",
    "continent": "Europa"
  },
  {
    "name": "Isla de Norfolk",
    "capital": "Kingston",
    "population": 1748,
    "languages": [
      "Inglés",
      "Norfuk"
    ],
    "currency": "Dólar australiano (A$)",
    "iso2": "NF",
    "iso3": "NFK",
    "flag": "🇳🇫",
    "continent": "Oceanía"
  },
  {
    "name": "Islandia",
    "capital": "Reikiavik",
    "population": 387800,
    "languages": [
      "Islandés"
    ],
    "currency": "Corona islandesa (kr)",
    "iso2": "IS",
    "iso3": "ISL",
    "flag": "🇮🇸",
    "continent": "Europa"
  },
  {
    "name": "Islas Caimán",
    "capital": "George Town",
    "population": 68706,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar caimanés (CI$)",
    "iso2": "KY",
    "iso3": "CYM",
    "flag": "🇰🇾",
    "continent": "América del Norte"
  },
  {
    "name": "Islas Cook",
    "capital": "Avarua",
    "population": 17564,
    "languages": [
      "Maorí de Islas Cook",
      "Inglés"
    ],
    "currency": "Dólar neozelandés (NZ$)",
    "iso2": "CK",
    "iso3": "COK",
    "flag": "🇨🇰",
    "continent": "Oceanía"
  },
  {
    "name": "Islas Faroe",
    "capital": "Tórshavn",
    "population": 54000,
    "languages": [
      "Feroés",
      "Danés"
    ],
    "currency": "Corona feroesa (kr)",
    "iso2": "FO",
    "iso3": "FRO",
    "flag": "🇫🇴",
    "continent": "Europa"
  },
  {
    "name": "Islas Georgias del Sur y Sandwich del Sur",
    "capital": "King Edward Point",
    "population": 30,
    "languages": [
      "Inglés"
    ],
    "currency": "Libra malvinense (£)",
    "iso2": "GS",
    "iso3": "SGS",
    "flag": "🇬🇸",
    "continent": "Antártida"
  },
  {
    "name": "Islas Heard y McDonald",
    "capital": "Deshabitada",
    "population": 0,
    "languages": [
      "Ninguno"
    ],
    "currency": "Dólar australiano (A$)",
    "iso2": "HM",
    "iso3": "HMD",
    "flag": "🇭🇲",
    "continent": "Antártida"
  },
  {
    "name": "Islas Malvinas",
    "capital": "Puerto Argentino / Stanley",
    "population": 3764,
    "languages": [
      "Inglés"
    ],
    "currency": "Libra malvinense (£)",
    "iso2": "FK",
    "iso3": "FLK",
    "flag": "🇫🇰",
    "continent": "América del Sur"
  },
  {
    "name": "Islas Marianas del Norte",
    "capital": "Saipán",
    "population": 47329,
    "languages": [
      "Inglés",
      "Chamorro",
      "Carolinio"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "MP",
    "iso3": "MNP",
    "flag": "🇲🇵",
    "continent": "Oceanía"
  },
  {
    "name": "Islas Marshall",
    "capital": "Majuro",
    "population": 41569,
    "languages": [
      "Marshalés",
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "MH",
    "iso3": "MHL",
    "flag": "🇲🇭",
    "continent": "Oceanía"
  },
  {
    "name": "Islas Pitcairn",
    "capital": "Adamstown",
    "population": 47,
    "languages": [
      "Inglés",
      "Pitcairnés"
    ],
    "currency": "Dólar neozelandés (NZ$)",
    "iso2": "PN",
    "iso3": "PCN",
    "flag": "🇵🇳",
    "continent": "Oceanía"
  },
  {
    "name": "Islas Salomón",
    "capital": "Honiara",
    "population": 724273,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar de las Islas Salomón (SI$)",
    "iso2": "SB",
    "iso3": "SLB",
    "flag": "🇸🇧",
    "continent": "Oceanía"
  },
  {
    "name": "Islas Turks y Caicos",
    "capital": "Cockburn Town",
    "population": 45703,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "TC",
    "iso3": "TCA",
    "flag": "🇹🇨",
    "continent": "América del Norte"
  },
  {
    "name": "Islas Vírgenes de los Estados Unidos",
    "capital": "Charlotte Amalie",
    "population": 87146,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "VI",
    "iso3": "VIR",
    "flag": "🇻🇮",
    "continent": "América del Norte"
  },
  {
    "name": "Islas Vírgenes del Reino Unido",
    "capital": "Road Town",
    "population": 31305,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "VG",
    "iso3": "VGB",
    "flag": "🇻🇬",
    "continent": "América del Norte"
  },
  {
    "name": "Israel",
    "capital": "Jerusalén",
    "population": 9842000,
    "languages": [
      "Hebreo",
      "Árabe"
    ],
    "currency": "Nuevo séquel (₪)",
    "iso2": "IL",
    "iso3": "ISR",
    "flag": "🇮🇱",
    "continent": "Asia"
  },
  {
    "name": "Italia",
    "capital": "Roma",
    "population": 58850717,
    "languages": [
      "Italiano"
    ],
    "currency": "Euro (€)",
    "iso2": "IT",
    "iso3": "ITA",
    "flag": "🇮🇹",
    "continent": "Europa"
  },
  {
    "name": "Jamaica",
    "capital": "Kingston",
    "population": 2827377,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar jamaiquino (J$)",
    "iso2": "JM",
    "iso3": "JAM",
    "flag": "🇯🇲",
    "continent": "América del Norte"
  },
  {
    "name": "Japón",
    "capital": "Tokio",
    "population": 124500000,
    "languages": [
      "Japonés"
    ],
    "currency": "Yen japonés (¥)",
    "iso2": "JP",
    "iso3": "JPN",
    "flag": "🇯🇵",
    "continent": "Asia"
  },
  {
    "name": "Jersey",
    "capital": "Saint Helier",
    "population": 103267,
    "languages": [
      "Inglés",
      "Francés"
    ],
    "currency": "Libra de Jersey (£)",
    "iso2": "JE",
    "iso3": "JEY",
    "flag": "🇯🇪",
    "continent": "Europa"
  },
  {
    "name": "Jordania",
    "capital": "Amán",
    "population": 11285869,
    "languages": [
      "Árabe"
    ],
    "currency": "Dinar jordano (د.ا)",
    "iso2": "JO",
    "iso3": "JOR",
    "flag": "🇯🇴",
    "continent": "Asia"
  },
  {
    "name": "Kazajistán",
    "capital": "Astaná",
    "population": 20000000,
    "languages": [
      "Kazajo",
      "Ruso"
    ],
    "currency": "Tenge kazajo (₸)",
    "iso2": "KZ",
    "iso3": "KAZ",
    "flag": "🇰🇿",
    "continent": "Asia"
  },
  {
    "name": "Kenia",
    "capital": "Nairobi",
    "population": 54027487,
    "languages": [
      "Suajili",
      "Inglés"
    ],
    "currency": "Chelín keniano (KSh)",
    "iso2": "KE",
    "iso3": "KEN",
    "flag": "🇰🇪",
    "continent": "África"
  },
  {
    "name": "Kirguizistán",
    "capital": "Biskek",
    "population": 7000000,
    "languages": [
      "Kirguís",
      "Ruso"
    ],
    "currency": "Som kirguís (с)",
    "iso2": "KG",
    "iso3": "KGZ",
    "flag": "🇰🇬",
    "continent": "Asia"
  },
  {
    "name": "Kiribati",
    "capital": "Tarawa Sur",
    "population": 131232,
    "languages": [
      "Gilbertés",
      "Inglés"
    ],
    "currency": "Dólar australiano (A$)",
    "iso2": "KI",
    "iso3": "KIR",
    "flag": "🇰🇮",
    "continent": "Oceanía"
  },
  {
    "name": "Kosovo",
    "capital": "Pristina",
    "population": 1782115,
    "languages": [
      "Albanés",
      "Serbio"
    ],
    "currency": "Euro (€)",
    "iso2": "XK",
    "iso3": "XKX",
    "flag": "🇽🇰",
    "continent": "Europa"
  },
  {
    "name": "Kuwait",
    "capital": "Kuwait",
    "population": 4822000,
    "languages": [
      "Árabe"
    ],
    "currency": "Dinar kuwaití (د.ك)",
    "iso2": "KW",
    "iso3": "KWT",
    "flag": "🇰🇼",
    "continent": "Asia"
  },
  {
    "name": "Laos",
    "capital": "Vientián",
    "population": 7529475,
    "languages": [
      "Laosiano"
    ],
    "currency": "Kip laosiano (₭)",
    "iso2": "LA",
    "iso3": "LAO",
    "flag": "🇱🇦",
    "continent": "Asia"
  },
  {
    "name": "Lesotho",
    "capital": "Maseru",
    "population": 2306000,
    "languages": [
      "Sesotho",
      "Inglés"
    ],
    "currency": "Loti (L) / Rand (R)",
    "iso2": "LS",
    "iso3": "LSO",
    "flag": "🇱🇸",
    "continent": "África"
  },
  {
    "name": "Letonia",
    "capital": "Riga",
    "population": 1883008,
    "languages": [
      "Letón"
    ],
    "currency": "Euro (€)",
    "iso2": "LV",
    "iso3": "LVA",
    "flag": "🇱🇻",
    "continent": "Europa"
  },
  {
    "name": "Liberia",
    "capital": "Monrovia",
    "population": 5302681,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar liberiano (L$)",
    "iso2": "LR",
    "iso3": "LBR",
    "flag": "🇱🇷",
    "continent": "África"
  },
  {
    "name": "Libia",
    "capital": "Trípoli",
    "population": 6812341,
    "languages": [
      "Árabe"
    ],
    "currency": "Dinar libio (ل.د)",
    "iso2": "LY",
    "iso3": "LBY",
    "flag": "🇱🇾",
    "continent": "África"
  },
  {
    "name": "Liechtenstein",
    "capital": "Vaduz",
    "population": 39327,
    "languages": [
      "Alemán"
    ],
    "currency": "Franco suizo (CHF)",
    "iso2": "LI",
    "iso3": "LIE",
    "flag": "🇱🇮",
    "continent": "Europa"
  },
  {
    "name": "Lituania",
    "capital": "Vilna",
    "population": 2857279,
    "languages": [
      "Lituano"
    ],
    "currency": "Euro (€)",
    "iso2": "LT",
    "iso3": "LTU",
    "flag": "🇱🇹",
    "continent": "Europa"
  },
  {
    "name": "Luxemburgo",
    "capital": "Luxemburgo",
    "population": 660809,
    "languages": [
      "Luxemburgués",
      "Francés",
      "Alemán"
    ],
    "currency": "Euro (€)",
    "iso2": "LU",
    "iso3": "LUX",
    "flag": "🇱🇺",
    "continent": "Europa"
  },
  {
    "name": "Líbano",
    "capital": "Beirut",
    "population": 5490000,
    "languages": [
      "Árabe"
    ],
    "currency": "Libra libanesa (ل.ل)",
    "iso2": "LB",
    "iso3": "LBN",
    "flag": "🇱🇧",
    "continent": "Asia"
  },
  {
    "name": "Macao",
    "capital": "Macao",
    "population": 682800,
    "languages": [
      "Cantonés",
      "Portugués"
    ],
    "currency": "Pataca de Macao (MOP$)",
    "iso2": "MO",
    "iso3": "MAC",
    "flag": "🇲🇴",
    "continent": "Asia"
  },
  {
    "name": "Macedonia del Norte",
    "capital": "Skopie",
    "population": 1832696,
    "languages": [
      "Macedonio",
      "Albanés"
    ],
    "currency": "Denar macedonio (den)",
    "iso2": "MK",
    "iso3": "MKD",
    "flag": "🇲🇰",
    "continent": "Europa"
  },
  {
    "name": "Madagascar",
    "capital": "Antananarivo",
    "population": 29611714,
    "languages": [
      "Malgache",
      "Francés"
    ],
    "currency": "Ariary malgache (Ar)",
    "iso2": "MG",
    "iso3": "MDG",
    "flag": "🇲🇬",
    "continent": "África"
  },
  {
    "name": "Malasia",
    "capital": "Kuala Lumpur",
    "population": 33938221,
    "languages": [
      "Malayo"
    ],
    "currency": "Ringgit malayo (RM)",
    "iso2": "MY",
    "iso3": "MYS",
    "flag": "🇲🇾",
    "continent": "Asia"
  },
  {
    "name": "Malawi",
    "capital": "Lilongüe",
    "population": 20405317,
    "languages": [
      "Chichewa",
      "Inglés"
    ],
    "currency": "Kwacha malauí (MK)",
    "iso2": "MW",
    "iso3": "MWI",
    "flag": "🇲🇼",
    "continent": "África"
  },
  {
    "name": "Maldivas",
    "capital": "Malé",
    "population": 523781,
    "languages": [
      "Dhivehi"
    ],
    "currency": "Rufiyaa maldiva (Rf)",
    "iso2": "MV",
    "iso3": "MDV",
    "flag": "🇲🇻",
    "continent": "Asia"
  },
  {
    "name": "Mali",
    "capital": "Bamako",
    "population": 22593590,
    "languages": [
      "Francés",
      "Bambara"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "ML",
    "iso3": "MLI",
    "flag": "🇲🇱",
    "continent": "África"
  },
  {
    "name": "Malta",
    "capital": "La Valeta",
    "population": 533286,
    "languages": [
      "Maltés",
      "Inglés"
    ],
    "currency": "Euro (€)",
    "iso2": "MT",
    "iso3": "MLT",
    "flag": "🇲🇹",
    "continent": "Europa"
  },
  {
    "name": "Marruecos",
    "capital": "Rabat",
    "population": 37840000,
    "languages": [
      "Árabe",
      "Bereber"
    ],
    "currency": "Dírham marroquí (MAD)",
    "iso2": "MA",
    "iso3": "MAR",
    "flag": "🇲🇦",
    "continent": "África"
  },
  {
    "name": "Mauricio",
    "capital": "Port Louis",
    "population": 1261043,
    "languages": [
      "Inglés",
      "Francés"
    ],
    "currency": "Rupia de Mauricio (₨)",
    "iso2": "MU",
    "iso3": "MUS",
    "flag": "🇲🇺",
    "continent": "África"
  },
  {
    "name": "Mauritania",
    "capital": "Nuakchot",
    "population": 4736139,
    "languages": [
      "Árabe"
    ],
    "currency": "Uguiya (UM)",
    "iso2": "MR",
    "iso3": "MRT",
    "flag": "🇲🇷",
    "continent": "África"
  },
  {
    "name": "Micronesia",
    "capital": "Palikir",
    "population": 114164,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "FM",
    "iso3": "FSM",
    "flag": "🇫🇲",
    "continent": "Oceanía"
  },
  {
    "name": "Moldavia",
    "capital": "Chisináu",
    "population": 2512758,
    "languages": [
      "Rumano"
    ],
    "currency": "Leu moldavo (L)",
    "iso2": "MD",
    "iso3": "MDA",
    "flag": "🇲🇩",
    "continent": "Europa"
  },
  {
    "name": "Mongolia",
    "capital": "Ulán Bator",
    "population": 3447157,
    "languages": [
      "Mongol"
    ],
    "currency": "Tugrik mongol (₮)",
    "iso2": "MN",
    "iso3": "MNG",
    "flag": "🇲🇳",
    "continent": "Asia"
  },
  {
    "name": "Montenegro",
    "capital": "Podgorica",
    "population": 617213,
    "languages": [
      "Montenegrino"
    ],
    "currency": "Euro (€)",
    "iso2": "ME",
    "iso3": "MNE",
    "flag": "🇲🇪",
    "continent": "Europa"
  },
  {
    "name": "Montserrat",
    "capital": "Plymouth / Brades",
    "population": 4390,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "MS",
    "iso3": "MSR",
    "flag": "🇲🇸",
    "continent": "América del Norte"
  },
  {
    "name": "Mozambique",
    "capital": "Maputo",
    "population": 32969518,
    "languages": [
      "Portugués"
    ],
    "currency": "Metical mozambiqueño (MT)",
    "iso2": "MZ",
    "iso3": "MOZ",
    "flag": "🇲🇿",
    "continent": "África"
  },
  {
    "name": "Myanmar",
    "capital": "Naipyidó",
    "population": 54179306,
    "languages": [
      "Birmano"
    ],
    "currency": "Kyat birmano (Ks)",
    "iso2": "MM",
    "iso3": "MMR",
    "flag": "🇲🇲",
    "continent": "Asia"
  },
  {
    "name": "México",
    "capital": "Ciudad de México",
    "population": 128455567,
    "languages": [
      "Español"
    ],
    "currency": "Peso mexicano ($)",
    "iso2": "MX",
    "iso3": "MEX",
    "flag": "🇲🇽",
    "continent": "América del Norte"
  },
  {
    "name": "Mónaco",
    "capital": "Mónaco",
    "population": 39050,
    "languages": [
      "Francés"
    ],
    "currency": "Euro (€)",
    "iso2": "MC",
    "iso3": "MCO",
    "flag": "🇲🇨",
    "continent": "Europa"
  },
  {
    "name": "Namibia",
    "capital": "Windhoek",
    "population": 2604172,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar namibio (N$)",
    "iso2": "NA",
    "iso3": "NAM",
    "flag": "🇳🇦",
    "continent": "África"
  },
  {
    "name": "Nauru",
    "capital": "Yaren",
    "population": 12668,
    "languages": [
      "Nauruano",
      "Inglés"
    ],
    "currency": "Dólar australiano (A$)",
    "iso2": "NR",
    "iso3": "NRU",
    "flag": "🇳🇷",
    "continent": "Oceanía"
  },
  {
    "name": "Nepal",
    "capital": "Katmandú",
    "population": 30547580,
    "languages": [
      "Nepalí"
    ],
    "currency": "Rupia nepalí (₨)",
    "iso2": "NP",
    "iso3": "NPL",
    "flag": "🇳🇵",
    "continent": "Asia"
  },
  {
    "name": "Nicaragua",
    "capital": "Managua",
    "population": 6948392,
    "languages": [
      "Español"
    ],
    "currency": "Córdoba (C$)",
    "iso2": "NI",
    "iso3": "NIC",
    "flag": "🇳🇮",
    "continent": "América del Norte"
  },
  {
    "name": "Nigeria",
    "capital": "Abuya",
    "population": 223804632,
    "languages": [
      "Inglés",
      "Hausa",
      "Yoruba",
      "Igbo"
    ],
    "currency": "Naira nigeriana (₦)",
    "iso2": "NG",
    "iso3": "NGA",
    "flag": "🇳🇬",
    "continent": "África"
  },
  {
    "name": "Niue",
    "capital": "Alofi",
    "population": 1937,
    "languages": [
      "Niueano",
      "Inglés"
    ],
    "currency": "Dólar neozelandés (NZ$)",
    "iso2": "NU",
    "iso3": "NIU",
    "flag": "🇳🇺",
    "continent": "Oceanía"
  },
  {
    "name": "Noruega",
    "capital": "Oslo",
    "population": 5488984,
    "languages": [
      "Noruego"
    ],
    "currency": "Corona noruega (kr)",
    "iso2": "NO",
    "iso3": "NOR",
    "flag": "🇳🇴",
    "continent": "Europa"
  },
  {
    "name": "Nueva Caledonia",
    "capital": "Numea",
    "population": 271407,
    "languages": [
      "Francés"
    ],
    "currency": "Franco CFP (CFP)",
    "iso2": "NC",
    "iso3": "NCL",
    "flag": "🇳🇨",
    "continent": "Oceanía"
  },
  {
    "name": "Nueva Zelanda",
    "capital": "Wellington",
    "population": 5124100,
    "languages": [
      "Inglés",
      "Maorí"
    ],
    "currency": "Dólar neozelandés (NZ$)",
    "iso2": "NZ",
    "iso3": "NZL",
    "flag": "🇳🇿",
    "continent": "Oceanía"
  },
  {
    "name": "Níger",
    "capital": "Niamey",
    "population": 26207977,
    "languages": [
      "Francés",
      "Hausa"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "NE",
    "iso3": "NER",
    "flag": "🇳🇪",
    "continent": "África"
  },
  {
    "name": "Omán",
    "capital": "Mascate",
    "population": 4576298,
    "languages": [
      "Árabe"
    ],
    "currency": "Rial omaní (ر.ع.)",
    "iso2": "OM",
    "iso3": "OMN",
    "flag": "🇴🇲",
    "continent": "Asia"
  },
  {
    "name": "Pakistán",
    "capital": "Islamabad",
    "population": 241499431,
    "languages": [
      "Urdu",
      "Inglés"
    ],
    "currency": "Rupia pakistaní (₨)",
    "iso2": "PK",
    "iso3": "PAK",
    "flag": "🇵🇰",
    "continent": "Asia"
  },
  {
    "name": "Palau",
    "capital": "Ngerulmud",
    "population": 18055,
    "languages": [
      "Palauano",
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "PW",
    "iso3": "PLW",
    "flag": "🇵🇼",
    "continent": "Oceanía"
  },
  {
    "name": "Palestina",
    "capital": "Jerusalén Este / Ramala",
    "population": 5483450,
    "languages": [
      "Árabe"
    ],
    "currency": "Nuevo séquel (₪)",
    "iso2": "PS",
    "iso3": "PSE",
    "flag": "🇵🇸",
    "continent": "Asia"
  },
  {
    "name": "Panamá",
    "capital": "Panamá",
    "population": 4408581,
    "languages": [
      "Español"
    ],
    "currency": "Balboa (B/.) / Dólar ($)",
    "iso2": "PA",
    "iso3": "PAN",
    "flag": "🇵🇦",
    "continent": "América del Norte"
  },
  {
    "name": "Papúa Nueva Guinea",
    "capital": "Puerto Moresby",
    "population": 10142615,
    "languages": [
      "Tok Pisin",
      "Inglés",
      "Hiri Motu"
    ],
    "currency": "Kina (K)",
    "iso2": "PG",
    "iso3": "PNG",
    "flag": "🇵🇬",
    "continent": "Oceanía"
  },
  {
    "name": "Paraguay",
    "capital": "Asunción",
    "population": 6780504,
    "languages": [
      "Español",
      "Guaraní"
    ],
    "currency": "Guaraní (₲)",
    "iso2": "PY",
    "iso3": "PRY",
    "flag": "🇵🇾",
    "continent": "América del Sur"
  },
  {
    "name": "Países Bajos",
    "capital": "Ámsterdam",
    "population": 17811291,
    "languages": [
      "Neerlandés"
    ],
    "currency": "Euro (€)",
    "iso2": "NL",
    "iso3": "NLD",
    "flag": "🇳🇱",
    "continent": "Europa"
  },
  {
    "name": "Perú",
    "capital": "Lima",
    "population": 34049588,
    "languages": [
      "Español",
      "Quechua",
      "Aimara"
    ],
    "currency": "Sol (S/)",
    "iso2": "PE",
    "iso3": "PER",
    "flag": "🇵🇪",
    "continent": "América del Sur"
  },
  {
    "name": "Polinesia Francesa",
    "capital": "Papeete",
    "population": 278786,
    "languages": [
      "Francés",
      "Tahitiano"
    ],
    "currency": "Franco CFP (CFP)",
    "iso2": "PF",
    "iso3": "PYF",
    "flag": "🇵🇫",
    "continent": "Oceanía"
  },
  {
    "name": "Polonia",
    "capital": "Varsovia",
    "population": 37749000,
    "languages": [
      "Polaco"
    ],
    "currency": "Złoty (zł)",
    "iso2": "PL",
    "iso3": "POL",
    "flag": "🇵🇱",
    "continent": "Europa"
  },
  {
    "name": "Portugal",
    "capital": "Lisboa",
    "population": 10467366,
    "languages": [
      "Portugués"
    ],
    "currency": "Euro (€)",
    "iso2": "PT",
    "iso3": "PRT",
    "flag": "🇵🇹",
    "continent": "Europa"
  },
  {
    "name": "Puerto Rico",
    "capital": "San Juan",
    "population": 3221789,
    "languages": [
      "Español",
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "PR",
    "iso3": "PRI",
    "flag": "🇵🇷",
    "continent": "América del Norte"
  },
  {
    "name": "Reino Unido",
    "capital": "Londres",
    "population": 67736802,
    "languages": [
      "Inglés"
    ],
    "currency": "Libra esterlina (£)",
    "iso2": "GB",
    "iso3": "GBR",
    "flag": "🇬🇧",
    "continent": "Europa"
  },
  {
    "name": "República Centroafricana",
    "capital": "Bangui",
    "population": 5579144,
    "languages": [
      "Francés",
      "Sango"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "CF",
    "iso3": "CAF",
    "flag": "🇨🇫",
    "continent": "África"
  },
  {
    "name": "República Dominicana",
    "capital": "Santo Domingo",
    "population": 11228821,
    "languages": [
      "Español"
    ],
    "currency": "Peso dominicano (RD$)",
    "iso2": "DO",
    "iso3": "DOM",
    "flag": "🇩🇴",
    "continent": "América del Norte"
  },
  {
    "name": "Ruanda",
    "capital": "Kigali",
    "population": 13776698,
    "languages": [
      "Kinyarwanda",
      "Francés",
      "Inglés"
    ],
    "currency": "Franco ruandés (FRw)",
    "iso2": "RW",
    "iso3": "RWA",
    "flag": "🇷🇼",
    "continent": "África"
  },
  {
    "name": "Rumania",
    "capital": "Bucarest",
    "population": 19051562,
    "languages": [
      "Rumano"
    ],
    "currency": "Leu rumano (lei)",
    "iso2": "RO",
    "iso3": "ROU",
    "flag": "🇷🇴",
    "continent": "Europa"
  },
  {
    "name": "Rusia",
    "capital": "Moscú",
    "population": 144236933,
    "languages": [
      "Ruso"
    ],
    "currency": "Rublo ruso (₽)",
    "iso2": "RU",
    "iso3": "RUS",
    "flag": "🇷🇺",
    "continent": "Europa"
  },
  {
    "name": "Sahara Occidental",
    "capital": "El Aaiún",
    "population": 587259,
    "languages": [
      "Árabe",
      "Español"
    ],
    "currency": "Dírham marroquí (MAD)",
    "iso2": "EH",
    "iso3": "ESH",
    "flag": "🇪🇭",
    "continent": "África"
  },
  {
    "name": "Saint Martin",
    "capital": "Marigot",
    "population": 31477,
    "languages": [
      "Francés"
    ],
    "currency": "Euro (€)",
    "iso2": "MF",
    "iso3": "MAF",
    "flag": "🇲🇫",
    "continent": "América del Norte"
  },
  {
    "name": "Samoa",
    "capital": "Apia",
    "population": 222382,
    "languages": [
      "Samoano",
      "Inglés"
    ],
    "currency": "Tālā (WS$)",
    "iso2": "WS",
    "iso3": "WSM",
    "flag": "🇼🇸",
    "continent": "Oceanía"
  },
  {
    "name": "Samoa Americana",
    "capital": "Pago Pago",
    "population": 49710,
    "languages": [
      "Samoano",
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "AS",
    "iso3": "ASM",
    "flag": "🇦🇸",
    "continent": "Oceanía"
  },
  {
    "name": "San Bartolomé",
    "capital": "Gustavia",
    "population": 10585,
    "languages": [
      "Francés"
    ],
    "currency": "Euro (€)",
    "iso2": "BL",
    "iso3": "BLM",
    "flag": "🇧🇱",
    "continent": "América del Norte"
  },
  {
    "name": "San Cristóbal y Nieves",
    "capital": "Basseterre",
    "population": 47657,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "KN",
    "iso3": "KNA",
    "flag": "🇰🇳",
    "continent": "América del Norte"
  },
  {
    "name": "San Marino",
    "capital": "San Marino",
    "population": 33660,
    "languages": [
      "Italiano"
    ],
    "currency": "Euro (€)",
    "iso2": "SM",
    "iso3": "SMR",
    "flag": "🇸🇲",
    "continent": "Europa"
  },
  {
    "name": "San Pedro y Miquelón",
    "capital": "San Pedro",
    "population": 5888,
    "languages": [
      "Francés"
    ],
    "currency": "Euro (€)",
    "iso2": "PM",
    "iso3": "SPM",
    "flag": "🇵🇲",
    "continent": "América del Norte"
  },
  {
    "name": "San Vicente y Granadinas",
    "capital": "Kingstown",
    "population": 103948,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "VC",
    "iso3": "VCT",
    "flag": "🇻🇨",
    "continent": "América del Norte"
  },
  {
    "name": "Santa Elena, Ascensión y Tristán de Acuña",
    "capital": "Jamestown",
    "population": 5633,
    "languages": [
      "Inglés"
    ],
    "currency": "Libra de Santa Elena (£)",
    "iso2": "SH",
    "iso3": "SHN",
    "flag": "🇸🇭",
    "continent": "África"
  },
  {
    "name": "Santa Lucía",
    "capital": "Castries",
    "population": 180251,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar del Caribe Oriental (EC$)",
    "iso2": "LC",
    "iso3": "LCA",
    "flag": "🇱🇨",
    "continent": "América del Norte"
  },
  {
    "name": "Santo Tomé y Príncipe",
    "capital": "Santo Tomé",
    "population": 227380,
    "languages": [
      "Portugués"
    ],
    "currency": "Dobra (Db)",
    "iso2": "ST",
    "iso3": "STP",
    "flag": "🇸🇹",
    "continent": "África"
  },
  {
    "name": "Senegal",
    "capital": "Dakar",
    "population": 17316449,
    "languages": [
      "Francés",
      "Wolof"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "SN",
    "iso3": "SEN",
    "flag": "🇸🇳",
    "continent": "África"
  },
  {
    "name": "Serbia",
    "capital": "Belgrado",
    "population": 6664449,
    "languages": [
      "Serbio"
    ],
    "currency": "Dinar serbio (din.)",
    "iso2": "RS",
    "iso3": "SRB",
    "flag": "🇷🇸",
    "continent": "Europa"
  },
  {
    "name": "Seychelles",
    "capital": "Victoria",
    "population": 100060,
    "languages": [
      "Criollo seselwa",
      "Inglés",
      "Francés"
    ],
    "currency": "Rupia de Seychelles (SCR)",
    "iso2": "SC",
    "iso3": "SYC",
    "flag": "🇸🇨",
    "continent": "África"
  },
  {
    "name": "Sierra Leone",
    "capital": "Freetown",
    "population": 8605718,
    "languages": [
      "Inglés"
    ],
    "currency": "Leone (Le)",
    "iso2": "SL",
    "iso3": "SLE",
    "flag": "🇸🇱",
    "continent": "África"
  },
  {
    "name": "Singapur",
    "capital": "Singapur",
    "population": 5917600,
    "languages": [
      "Inglés",
      "Malayo",
      "Mandarín",
      "Tamil"
    ],
    "currency": "Dólar de Singapur (S$)",
    "iso2": "SG",
    "iso3": "SGP",
    "flag": "🇸🇬",
    "continent": "Asia"
  },
  {
    "name": "Sint Maarten",
    "capital": "Philipsburg",
    "population": 41486,
    "languages": [
      "Inglés",
      "Neerlandés"
    ],
    "currency": "Florín antillano (NAƒ)",
    "iso2": "SX",
    "iso3": "SXM",
    "flag": "🇸🇽",
    "continent": "América del Norte"
  },
  {
    "name": "Siria",
    "capital": "Damasco",
    "population": 22125249,
    "languages": [
      "Árabe"
    ],
    "currency": "Libra siria (LS)",
    "iso2": "SY",
    "iso3": "SYR",
    "flag": "🇸🇾",
    "continent": "Asia"
  },
  {
    "name": "Somalia",
    "capital": "Mogadiscio",
    "population": 17597511,
    "languages": [
      "Somalí",
      "Árabe"
    ],
    "currency": "Chelín somalí (Sh.So.)",
    "iso2": "SO",
    "iso3": "SOM",
    "flag": "🇸🇴",
    "continent": "África"
  },
  {
    "name": "Somalilandia",
    "capital": "Hargeisa",
    "population": 5700000,
    "languages": [
      "Somalí",
      "Árabe",
      "Inglés"
    ],
    "currency": "Chelín de Somalilandia (Sl.Sh.)",
    "iso2": "SO",
    "iso3": "SOM",
    "flag": "🇸🇴",
    "continent": "África"
  },
  {
    "name": "Sri Lanka",
    "capital": "Sri Jayawardenepura Kotte / Colombo",
    "population": 22181000,
    "languages": [
      "Cingalés",
      "Tamil"
    ],
    "currency": "Rupia de Sri Lanka (Rs)",
    "iso2": "LK",
    "iso3": "LKA",
    "flag": "🇱🇰",
    "continent": "Asia"
  },
  {
    "name": "Suazilandia",
    "capital": "Mbabane / Lobamba",
    "population": 1201670,
    "languages": [
      "Suazi",
      "Inglés"
    ],
    "currency": "Lilangeni (E) / Rand (R)",
    "iso2": "SZ",
    "iso3": "SWZ",
    "flag": "🇸🇿",
    "continent": "África"
  },
  {
    "name": "Sudáfrica",
    "capital": "Pretoria / Ciudad del Cabo",
    "population": 62027503,
    "languages": [
      "Zulú",
      "Xhosa",
      "Afrikáans",
      "Inglés"
    ],
    "currency": "Rand sudafricano (R)",
    "iso2": "ZA",
    "iso3": "ZAF",
    "flag": "🇿🇦",
    "continent": "África"
  },
  {
    "name": "Sudán",
    "capital": "Jartum",
    "population": 46874204,
    "languages": [
      "Árabe",
      "Inglés"
    ],
    "currency": "Libra sudanesa (SDG)",
    "iso2": "SD",
    "iso3": "SDN",
    "flag": "🇸🇩",
    "continent": "África"
  },
  {
    "name": "Sudán del Sur",
    "capital": "Yuba",
    "population": 10913164,
    "languages": [
      "Inglés"
    ],
    "currency": "Libra sursudanesa (SSP)",
    "iso2": "SS",
    "iso3": "SSD",
    "flag": "🇸🇸",
    "continent": "África"
  },
  {
    "name": "Suecia",
    "capital": "Estocolmo",
    "population": 10521556,
    "languages": [
      "Sueco"
    ],
    "currency": "Corona sueca (kr)",
    "iso2": "SE",
    "iso3": "SWE",
    "flag": "🇸🇪",
    "continent": "Europa"
  },
  {
    "name": "Suiza",
    "capital": "Berna",
    "population": 8815385,
    "languages": [
      "Alemán",
      "Francés",
      "Italiano",
      "Romanche"
    ],
    "currency": "Franco suizo (CHF)",
    "iso2": "CH",
    "iso3": "CHE",
    "flag": "🇨🇭",
    "continent": "Europa"
  },
  {
    "name": "Surinam",
    "capital": "Paramaribo",
    "population": 618040,
    "languages": [
      "Neerlandés"
    ],
    "currency": "Dólar surinamés ($)",
    "iso2": "SR",
    "iso3": "SUR",
    "flag": "🇸🇷",
    "continent": "América del Sur"
  },
  {
    "name": "Tailandia",
    "capital": "Bangkok",
    "population": 71801279,
    "languages": [
      "Tailandés"
    ],
    "currency": "Bat tailandés (฿)",
    "iso2": "TH",
    "iso3": "THA",
    "flag": "🇹🇭",
    "continent": "Asia"
  },
  {
    "name": "Taiwán",
    "capital": "Taipéi",
    "population": 23375314,
    "languages": [
      "Mandarín"
    ],
    "currency": "Nuevo dólar taiwanés (NT$)",
    "iso2": "TW",
    "iso3": "TWN",
    "flag": "🇹🇼",
    "continent": "Asia"
  },
  {
    "name": "Tanzania",
    "capital": "Dodoma",
    "population": 65497748,
    "languages": [
      "Suajili",
      "Inglés"
    ],
    "currency": "Chelín tanzano (TSh)",
    "iso2": "TZ",
    "iso3": "TZA",
    "flag": "🇹🇿",
    "continent": "África"
  },
  {
    "name": "Tayikistán",
    "capital": "Dusambé",
    "population": 10000000,
    "languages": [
      "Tayiko"
    ],
    "currency": "Somoni tayiko (ЅМ)",
    "iso2": "TJ",
    "iso3": "TJK",
    "flag": "🇹🇯",
    "continent": "Asia"
  },
  {
    "name": "Terr. del Océano Índico (Australia)",
    "capital": "Flying Fish Cove / West Island",
    "population": 2200,
    "languages": [
      "Inglés",
      "Malayo"
    ],
    "currency": "Dólar australiano (A$)",
    "iso2": "CC",
    "iso3": "CCK",
    "flag": "🇨🇨",
    "continent": "Oceanía"
  },
  {
    "name": "Territorio Británico del Océano Índico",
    "capital": "Diego García",
    "population": 3000,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "IO",
    "iso3": "IOT",
    "flag": "🇮🇴",
    "continent": "África"
  },
  {
    "name": "Tierras Australes y Antárticas Francesas",
    "capital": "Port-aux-Français",
    "population": 400,
    "languages": [
      "Francés"
    ],
    "currency": "Euro (€)",
    "iso2": "TF",
    "iso3": "ATF",
    "flag": "🇹🇫",
    "continent": "Antártida"
  },
  {
    "name": "Timor Oriental",
    "capital": "Dili",
    "population": 1341296,
    "languages": [
      "Tetun",
      "Portugués"
    ],
    "currency": "Dólar estadounidense ($)",
    "iso2": "TL",
    "iso3": "TLS",
    "flag": "🇹🇱",
    "continent": "Asia"
  },
  {
    "name": "Togo",
    "capital": "Lomé",
    "population": 8848699,
    "languages": [
      "Francés"
    ],
    "currency": "Franco CFA (CFA)",
    "iso2": "TG",
    "iso3": "TGO",
    "flag": "🇹🇬",
    "continent": "África"
  },
  {
    "name": "Tonga",
    "capital": "Nukualofa",
    "population": 106858,
    "languages": [
      "Tongano",
      "Inglés"
    ],
    "currency": "Paʻanga (T$)",
    "iso2": "TO",
    "iso3": "TON",
    "flag": "🇹🇴",
    "continent": "Oceanía"
  },
  {
    "name": "Trinidad y Tobago",
    "capital": "Puerto España",
    "population": 1531044,
    "languages": [
      "Inglés"
    ],
    "currency": "Dólar trinitense (TT$)",
    "iso2": "TT",
    "iso3": "TTO",
    "flag": "🇹🇹",
    "continent": "América del Norte"
  },
  {
    "name": "Turkmenistán",
    "capital": "Asjabad",
    "population": 6430770,
    "languages": [
      "Turcomano"
    ],
    "currency": "Manat turcomano (m)",
    "iso2": "TM",
    "iso3": "TKM",
    "flag": "🇹🇲",
    "continent": "Asia"
  },
  {
    "name": "Turquía",
    "capital": "Ankara",
    "population": 85279553,
    "languages": [
      "Turco"
    ],
    "currency": "Lira turca (₺)",
    "iso2": "TR",
    "iso3": "TUR",
    "flag": "🇹🇷",
    "continent": "Asia"
  },
  {
    "name": "Tuvalu",
    "capital": "Funafuti",
    "population": 11312,
    "languages": [
      "Tuvaluano",
      "Inglés"
    ],
    "currency": "Dólar australiano (A$)",
    "iso2": "TV",
    "iso3": "TUV",
    "flag": "🇹🇻",
    "continent": "Otro"
  },
  {
    "name": "Túnez",
    "capital": "Túnez",
    "population": 12458223,
    "languages": [
      "Árabe"
    ],
    "currency": "Dinar tunecino (د.ت)",
    "iso2": "TN",
    "iso3": "TUN",
    "flag": "🇹🇳",
    "continent": "África"
  },
  {
    "name": "Ucrania",
    "capital": "Kiev",
    "population": 38000000,
    "languages": [
      "Ucraniano"
    ],
    "currency": "Grivna (₴)",
    "iso2": "UA",
    "iso3": "UKR",
    "flag": "🇺🇦",
    "continent": "Europa"
  },
  {
    "name": "Uganda",
    "capital": "Kampala",
    "population": 47249585,
    "languages": [
      "Inglés",
      "Suajili"
    ],
    "currency": "Chelín ugandés (USh)",
    "iso2": "UG",
    "iso3": "UGA",
    "flag": "🇺🇬",
    "continent": "África"
  },
  {
    "name": "Uruguay",
    "capital": "Montevideo",
    "population": 3422794,
    "languages": [
      "Español"
    ],
    "currency": "Peso uruguayo ($)",
    "iso2": "UY",
    "iso3": "URY",
    "flag": "🇺🇾",
    "continent": "América del Sur"
  },
  {
    "name": "Uzbekistán",
    "capital": "Taskent",
    "population": 36000000,
    "languages": [
      "Uzbeko"
    ],
    "currency": "Som uzbeko (soʻm)",
    "iso2": "UZ",
    "iso3": "UZB",
    "flag": "🇺🇿",
    "continent": "Asia"
  },
  {
    "name": "Vanuatu",
    "capital": "Port Vila",
    "population": 326740,
    "languages": [
      "Bislama",
      "Inglés",
      "Francés"
    ],
    "currency": "Vatu (VT)",
    "iso2": "VU",
    "iso3": "VUT",
    "flag": "🇻🇺",
    "continent": "Oceanía"
  },
  {
    "name": "Venezuela",
    "capital": "Caracas",
    "population": 28302000,
    "languages": [
      "Español"
    ],
    "currency": "Bolívar digital (Bs.)",
    "iso2": "VE",
    "iso3": "VEN",
    "flag": "🇻🇪",
    "continent": "América del Sur"
  },
  {
    "name": "Vietnam",
    "capital": "Hanói",
    "population": 98858915,
    "languages": [
      "Vietnamita"
    ],
    "currency": "Dong vietnamita (₫)",
    "iso2": "VN",
    "iso3": "VNM",
    "flag": "🇻🇳",
    "continent": "Asia"
  },
  {
    "name": "Wallis y Futuna",
    "capital": "Mata-Utu",
    "population": 11558,
    "languages": [
      "Francés"
    ],
    "currency": "Franco CFP (CFP)",
    "iso2": "WF",
    "iso3": "WLF",
    "flag": "🇼🇫",
    "continent": "Oceanía"
  },
  {
    "name": "Yemen",
    "capital": "Saná",
    "population": 33696614,
    "languages": [
      "Árabe"
    ],
    "currency": "Rial yemení (﷼)",
    "iso2": "YE",
    "iso3": "YEM",
    "flag": "🇾🇪",
    "continent": "Asia"
  },
  {
    "name": "Zambia",
    "capital": "Lusaka",
    "population": 20017675,
    "languages": [
      "Inglés"
    ],
    "currency": "Kwacha zambiano (ZK)",
    "iso2": "ZM",
    "iso3": "ZMB",
    "flag": "🇿🇲",
    "continent": "África"
  },
  {
    "name": "Zimbabue",
    "capital": "Harare",
    "population": 16320537,
    "languages": [
      "Inglés",
      "Shona",
      "Ndebele"
    ],
    "currency": "Dólar de Zimbabue / USD",
    "iso2": "ZW",
    "iso3": "ZWE",
    "flag": "🇿🇼",
    "continent": "África"
  }
];

/**
 * Pre-indexed maps for O(1) lookup by exact name, normalized name, ISO-2 and ISO-3 codes.
 */
const byNormalizedName = new Map();
const byIso2 = new Map();
const byIso3 = new Map();

for (const country of COUNTRY_DETAILS) {
  byNormalizedName.set(normalizeText(country.name), country);
  if (country.iso2) byIso2.set(country.iso2.toUpperCase(), country);
  if (country.iso3) byIso3.set(country.iso3.toUpperCase(), country);
}

for (const country of COUNTRY_DETAILS) {
  const englishName = NAME_EN_BY_NAME[country.name] || NAME_EN[country.iso2];
  if (englishName) byNormalizedName.set(normalizeText(englishName), country);
}

/**
 * Returns a country record with its display fields in the requested language,
 * falling back to the Spanish value when a translation is missing.
 * @param {typeof COUNTRY_DETAILS[0]} details
 * @param {'en' | 'es'} [lang='en']
 * @returns {{name: string, capital: string, continent: string, languages: string[], currency: string}}
 */
export function getLocalizedDetails(details, lang = 'en') {
  if (!details) return null;
  if (lang === 'es') {
    return {
      name: details.name,
      capital: details.capital,
      continent: details.continent,
      languages: details.languages || [],
      currency: details.currency,
    };
  }

  return {
    name: NAME_EN_BY_NAME[details.name] || NAME_EN[details.iso2] || details.name,
    capital:
      CAPITAL_EN_BY_NAME[details.name] ||
      CAPITAL_EN[details.iso2] ||
      details.capital,
    continent: CONTINENT_EN[details.continent] || details.continent,
    languages: (details.languages || []).map((language) => LANGUAGE_EN[language] || language),
    currency: CURRENCY_EN[details.currency] || details.currency,
  };
}

/**
 * Formats a population number into human-readable text in the requested language.
 * Spanish keeps the original "47,4 M hab." style; English uses "47.4 M".
 * @param {number|null|undefined} population
 * @param {'en' | 'es'} [lang='en']
 * @returns {string}
 */
export function formatPopulation(population, lang = 'en') {
  if (population === null || population === undefined || isNaN(population)) return '—';
  if (lang === 'es') {
    if (population === 0) return 'Deshabitado';
    if (population >= 1_000_000_000) {
      const val = (population / 1_000_000_000).toLocaleString('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      });
      return `${val} B hab.`;
    }
    if (population >= 1_000_000) {
      const val = (population / 1_000_000).toLocaleString('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      });
      return `${val} M hab.`;
    }
    return `${population.toLocaleString('es-ES')} hab.`;
  }

  if (population === 0) return 'Uninhabited';
  if (population >= 1_000_000_000) {
    const val = (population / 1_000_000_000).toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 2,
    });
    return `${val} B`;
  }
  if (population >= 1_000_000) {
    const val = (population / 1_000_000).toLocaleString('en-US', {
      minimumFractionDigits: 1,
      maximumFractionDigits: 1,
    });
    return `${val} M`;
  }
  return population.toLocaleString('en-US');
}

/**
 * Finds country details by name, normalized name, ISO-2, or ISO-3 code.
 * @param {string} query
 * @returns {typeof COUNTRY_DETAILS[0] | null}
 */
export function getCountryDetails(query) {
  if (!query || typeof query !== 'string') return null;
  const trimmed = query.trim();
  if (!trimmed) return null;

  const upper = trimmed.toUpperCase();
  if (upper.length === 2 && byIso2.has(upper)) return byIso2.get(upper);
  if (upper.length === 3 && byIso3.has(upper)) return byIso3.get(upper);

  const normalized = normalizeText(trimmed);
  if (byNormalizedName.has(normalized)) return byNormalizedName.get(normalized);

  // Prefix match
  for (const [key, country] of byNormalizedName.entries()) {
    if (key.startsWith(normalized)) return country;
  }

  // Substring match (for queries >= 3 chars)
  if (normalized.length >= 3) {
    for (const [key, country] of byNormalizedName.entries()) {
      if (key.includes(normalized)) return country;
    }
  }

  return null;
}
