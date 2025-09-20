export const EXAM_AREAS = [
  { value: 'metalurgia', label: 'Metalurgia', color: 'bg-blue-500' },
  { value: 'mineria', label: 'Minería', color: 'bg-green-500' },
  { value: 'geologia', label: 'Geología', color: 'bg-orange-500' }
]

export const DEFAULT_QUESTION_FORM = {
  id: null,
  question: '',
  questionImage: '',
  options: ['', '', '', ''],
  optionImages: ['', '', '', ''],
  correct: 0,
  area: 'metalurgia'
}

export const DEFAULT_QUESTIONS = [
  {
    id: 1,
    question: "¿Cuál es el principal componente del acero?",
    questionImage: "",
    options: ["Hierro", "Carbono", "Níquel", "Cromo"],
    optionImages: ["", "", "", ""],
    correct: 0,
    area: "metalurgia"
  },
  {
    id: 2,
    question: "¿Qué tipo de roca se forma por enfriamiento del magma?",
    questionImage: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5b/Granite_Yosemite_P1160483.jpg/300px-Granite_Yosemite_P1160483.jpg",
    options: ["Sedimentaria", "Metamórfica", "Ígnea", "Calcárea"],
    optionImages: ["", "", "", ""],
    correct: 2,
    area: "geologia"
  },
  {
    id: 3,
    question: "¿Cuál es el método más común de extracción de oro?",
    questionImage: "",
    options: ["Cianuración", "Magnetización", "Destilación", "Electrólisis"],
    optionImages: ["", "", "", ""],
    correct: 0,
    area: "mineria"
  }
]

export const QUESTION_TYPES = {
  TEXT_ONLY: 'text_only',
  WITH_IMAGE: 'with_image',
  IMAGE_OPTIONS: 'image_options',
  MIXED: 'mixed'
}

export const getAreaColor = (area) => {
  const areaData = EXAM_AREAS.find(a => a.value === area)
  return areaData ? areaData.color : 'bg-gray-500'
}

export const getAreaLabel = (area) => {
  const areaData = EXAM_AREAS.find(a => a.value === area)
  return areaData ? areaData.label : area
}