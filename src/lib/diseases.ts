export interface DiseaseInfo {
  display_name: string
  severity: 'low' | 'medium' | 'high'
  crops: string[]
  quick_steps: string[]
  organic_cure: string
  chemical_cure: string
  cost_inr: number
  days_to_act: number
  description: string
}

export const DISEASE_DB: Record<string, DiseaseInfo> = {
  'early-blight': {
    display_name: 'Early Blight',
    severity: 'medium',
    crops: ['Tomato', 'Potato'],
    quick_steps: [
      'Remove all infected leaves immediately and burn them',
      'Spray copper-based fungicide every 7 days',
      'Avoid overhead watering — water at soil level only'
    ],
    organic_cure: 'Neem oil spray (5ml per liter water) every 5 days. Add 1ml of dish soap as emulsifier. Spray in early morning or late evening to avoid leaf burn.',
    chemical_cure: 'Mancozeb 75% WP at 2g per liter water. Apply every 7-10 days. Alternatively, Chlorothalonil 2g per liter for severe cases. Wear protective gear during application.',
    cost_inr: 350,
    days_to_act: 7,
    description: 'Early blight is a fungal disease caused by Alternaria solani. It causes dark spots with concentric rings (target-like appearance) on lower leaves first, then spreads upward. Spreads rapidly in humid weather (above 24°C with 90% humidity). Can reduce yield by 20-30% if untreated.'
  },
  'late-blight': {
    display_name: 'Late Blight',
    severity: 'high',
    crops: ['Tomato', 'Potato'],
    quick_steps: [
      'Remove and destroy ALL infected plant parts immediately',
      'Apply fungicide within 24 hours of detection',
      'Improve air circulation around plants',
      'Avoid working in wet fields to prevent spread'
    ],
    organic_cure: 'Bordeaux mixture (1% solution): Mix 100g copper sulfate + 100g lime in 10 liters water. Spray every 5-7 days. Add 2ml neem oil per liter for enhanced protection.',
    chemical_cure: 'Metalaxyl + Mancozeb (Ridomil MZ) at 2.5g per liter. Fosetyl-Al (Aliette) 2.5g per liter for systemic protection. Alternate between products every spray. Critical: Apply preventatively if cool wet weather is forecast.',
    cost_inr: 450,
    days_to_act: 3,
    description: 'Late blight is the most devastating tomato/potato disease, caused by Phytophthora infestans. It thrives in cool, wet conditions (15-20°C). Causes water-soaked lesions that turn brown and papery. Can destroy entire crop within days. Infamous for causing the Irish Potato Famine (1845).'
  },
  'leaf-mold': {
    display_name: 'Leaf Mold',
    severity: 'medium',
    crops: ['Tomato'],
    quick_steps: [
      'Remove infected lower leaves and destroy them',
      'Increase greenhouse ventilation immediately',
      'Reduce humidity below 85%',
      'Apply fungicide spray to protect remaining foliage'
    ],
    organic_cure: 'Spray potassium bicarbonate (3g per liter) + neem oil (5ml per liter). Apply weekly. Good airflow is essential - space plants at least 45cm apart. Remove lower leaves to improve circulation.',
    chemical_cure: 'Chlorothalonil (2g per liter) or Copper oxychloride (3g per liter). Apply every 7-10 days. Focus on lower leaf surfaces where fungus starts. In greenhouses, consider sulfur vaporizers.',
    cost_inr: 280,
    days_to_act: 10,
    description: 'Leaf mold (Passalora fulva) primarily affects tomatoes in humid conditions. Olive-green to yellowish patches appear on leaf undersides, turning velvety. Prefers temperatures 20-25°C with high humidity. Common in greenhouse tomatoes. Can defoliate plants if left unchecked.'
  },
  'bacterial-spot': {
    display_name: 'Bacterial Spot',
    severity: 'high',
    crops: ['Tomato', 'Pepper'],
    quick_steps: [
      'Remove infected plant debris from field',
      'Avoid overhead irrigation completely',
      'Apply copper-based bactericide immediately',
      'Do NOT work in wet fields - spreads bacteria'
    ],
    organic_cure: 'Copper sulfate spray (3g per liter) + streptomycin alternative: Bacillus subtilis-based biofungicide (follow label rate). Add 1ml dish soap for better coverage. Apply every 5-7 days during wet weather.',
    chemical_cure: 'Copper hydroxide (Kocide) at 2g per liter + Mancozeb 2g per liter tank mix. Streptomycin sulfate (if registered) for severe cases. Copper resistance is common - rotate with different copper formulations.',
    cost_inr: 320,
    days_to_act: 5,
    description: 'Bacterial spot (Xanthomonas spp.) causes small, water-soaked lesions that become brown and scabby. Spreads rapidly in warm, wet conditions. Bacteria enter through leaf pores and wounds. Fruits develop raised, scabby spots rendering them unmarketable. No cure - only prevention and spread control.'
  },
  'powdery-mildew': {
    display_name: 'Powdery Mildew',
    severity: 'medium',
    crops: ['Tomato', 'Cucumber', 'Squash', 'Pepper', 'Grapes'],
    quick_steps: [
      'Prune affected leaves and improve air circulation',
      'Apply sulfur-based fungicide or potassium bicarbonate',
      'Water at soil level - avoid wetting leaves',
      'Space plants wider in future plantings'
    ],
    organic_cure: 'Milk spray: 1 part milk to 9 parts water, spray every 7 days. Alternatively, potassium bicarbonate (4g per liter) + neem oil (5ml per liter). Sulfur dust works well but can burn plants in hot weather (>32°C).',
    chemical_cure: 'Myclobutanil (Nova) at 0.5ml per liter, or Trifloxystrobin (Flint) 0.3g per liter. Tebuconazole (Folicur) at 1ml per liter is highly effective. Apply every 10-14 days. Alternate modes of action to prevent resistance.',
    cost_inr: 250,
    days_to_act: 10,
    description: 'Powdery mildew appears as white to gray powdery growth on leaf surfaces. Unlike other fungi, it thrives in dry conditions with high humidity. Temperatures 20-27°C favor infection. Does NOT require free water to infect - spreads by wind-borne spores. Commonly affects cucurbits and solanaceous crops.'
  },
  'gray-mold': {
    display_name: 'Gray Mold / Botrytis',
    severity: 'high',
    crops: ['Tomato', 'Strawberry', 'Grapes', 'Beans', 'Pepper'],
    quick_steps: [
      'Remove and destroy ALL infected plant parts',
      'Reduce humidity below 80% immediately',
      'Improve air circulation around plants',
      'Apply fungicide preventatively before flowering'
    ],
    organic_cure: 'Trichoderma harzianum-based biofungicide at label rate. Bacillus subtilis sprays (5g per liter) every 7 days. Remove senescent flowers and dying tissue - primary infection sites. Avoid late afternoon irrigation.',
    chemical_cure: 'Fludioxonil (Switch) at 0.8g per liter, or Boscalid + Pyraclostrobin (Pristine) 1g per liter. Iprodione (Rovral) 1.5g per liter is a standard treatment. Apply at first sign of disease and repeat every 7-10 days. Critical to get good coverage of flowers and fruit.',
    cost_inr: 420,
    days_to_act: 7,
    description: 'Gray mold (Botrytis cinerea) attacks weakened, damaged, or senescing tissue. Characteristic gray-brown fuzzy growth appears on infected areas. Thrives in cool, humid conditions (15-21°C, >90% humidity). Affects all above-ground plant parts. Post-harvest losses can be significant if fruit infected.'
  },
  'mosaic-virus': {
    display_name: 'Mosaic Virus',
    severity: 'high',
    crops: ['Tomato', 'Pepper', 'Cucumber', 'Tobacco'],
    quick_steps: [
      'Remove and destroy infected plants immediately',
      'Disinfect all tools with bleach solution (10%)',
      'Control aphid vectors with insecticidal soap',
      'Do NOT smoke near plants - tobacco mosaic spreads virus'
    ],
    organic_cure: 'NO CURE EXISTS for viral diseases. Focus on: (1) Removing infected plants, (2) Controlling aphids with neem oil + insecticidal soap, (3) Using virus-free certified seed, (4) Growing resistant varieties. Milk spray may reduce spread.',
    chemical_cure: 'NO CHEMICAL CURE. Only prevention: Use imidacloprid or thiamethoxam seed treatment to control aphids. Apply mineral oil sprays to interfere with virus transmission. Remove all solanaceous weeds (nightshade, jimsonweed) from field borders.',
    cost_inr: 200,
    days_to_act: 1,
    description: 'Mosaic viruses (TMV, CMV, etc.) cause mottled light/dark green patterns on leaves. Leaves may be stunted, curled, or deformed. Fruits can be mottled and reduced in size. Spread by aphids, infected seed, and mechanical transmission (tools, hands). Tobacco smokers can transmit TMV to plants. No cure - infected plants must be destroyed.'
  },
  'root-rot': {
    display_name: 'Root Rot',
    severity: 'high',
    crops: ['Tomato', 'Pepper', 'Beans', 'Cotton'],
    quick_steps: [
      'Reduce watering immediately - soil is too wet',
      'Apply fungicide drench around plant base',
      'Improve drainage in the field',
      'Remove severely affected plants to prevent spread'
    ],
    organic_cure: 'Trichoderma viride or T. harzianum drench (10g per liter). Apply at planting and repeat monthly. Mix well-rotted compost into soil to improve drainage. Avoid over-irrigation. Raised beds help prevent waterlogging.',
    chemical_cure: 'Metalaxyl + Mancozeb (Ridomil MZ) drench at 2g per liter around root zone. Fosetyl-Al (Aliette) 2g per liter as soil drench. For Fusarium: Carbendazim 1g per liter drench. Allow soil to dry between irrigations.',
    cost_inr: 380,
    days_to_act: 5,
    description: 'Root rot complex includes Pythium, Phytophthora, Rhizoctonia, and Fusarium species. Causes yellowing, wilting, and plant death. Roots turn brown and mushy, often with sour smell. Thrives in waterlogged, poorly drained soils. Over-irrigation is the primary cause. Preventative measures are key - once infected, treatment is difficult.'
  },
  'rust': {
    display_name: 'Rust',
    severity: 'medium',
    crops: ['Corn', 'Wheat', 'Beans', 'Sugarcane', 'Groundnut'],
    quick_steps: [
      'Remove volunteer plants and crop debris',
      'Apply fungicide at first sign of pustules',
      'Plant resistant varieties next season',
      'Avoid late planting when disease pressure is high'
    ],
    organic_cure: 'Sulfur dust (25-30 kg/ha) or wettable sulfur spray (5g per liter). Neem oil (5ml per liter) provides some protection. Remove alternate hosts if known. Early planting helps avoid peak infection periods.',
    chemical_cure: 'Propiconazole (Tilt) at 1ml per liter, or Tebuconazole (Folicur) 1ml per liter. Mancozeb (2g per liter) for protectant activity. Trifloxystrobin (Flint) 0.3g per liter is highly effective. Apply at first sign and repeat every 10-14 days.',
    cost_inr: 300,
    days_to_act: 7,
    description: 'Rust diseases (Puccinia, Uromyces spp.) produce characteristic orange-brown pustules on leaves and stems. Spores are wind-dispersed over long distances. Requires living plant tissue to survive. Severity increases with leaf wetness and moderate temperatures (15-25°C). Can cause significant yield loss in wheat and corn.'
  },
  'healthy': {
    display_name: 'Healthy Crop',
    severity: 'low',
    crops: ['All'],
    quick_steps: [
      'Continue regular monitoring weekly',
      'Maintain current agricultural practices',
      'Consider preventive fungicide spray before monsoon',
      'Keep field free of weeds and debris'
    ],
    organic_cure: 'No treatment needed. Continue good agricultural practices: proper irrigation, balanced fertilization, and crop rotation. Consider neem-based sprays as preventive measure during humid weather.',
    chemical_cure: 'No treatment needed. For high-value crops, a preventive copper spray before monsoon can protect against fungal diseases. Follow integrated pest management (IPM) practices.',
    cost_inr: 0,
    days_to_act: 0,
    description: 'Your crop appears healthy with no visible disease symptoms. Continue regular scouting and maintain proper nutrition. Early detection is key - check leaves (both sides), stems, and developing fruits weekly. Remove any suspicious plants immediately to protect the rest of your field.'
  }
}

export function getDiseaseBySlug(slug: string): DiseaseInfo | undefined {
  return DISEASE_DB[slug]
}

export function getDiseaseSlug(displayName: string): string {
  return displayName.toLowerCase().replace(/\s+/g, '-').replace(/\//g, '-')
}

export const CROP_TYPES = [
  'Tomato', 'Potato', 'Pepper', 'Cucumber', 'Squash',
  'Corn', 'Wheat', 'Rice', 'Cotton', 'Groundnut',
  'Sugarcane', 'Beans', 'Grapes', 'Strawberry', 'Tobacco'
]

export const AP_DISTRICTS = [
  'Anantapur', 'Chittoor', 'East Godavari', 'Guntur',
  'Krishna', 'Kurnool', 'Nellore', 'Prakasam',
  'Srikakulam', 'Visakhapatnam', 'Vizianagaram',
  'West Godavari', 'YSR Kadapa'
]

export const LANGUAGES = [
  { code: 'en', name: 'English', native: 'English' },
  { code: 'hi', name: 'Hindi', native: 'हिंदी' },
  { code: 'te', name: 'Telugu', native: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', native: 'தமிழ்' }
]

export function getRandomMockDiagnosis() {
  const diseases = Object.entries(DISEASE_DB).filter(([slug]) => slug !== 'healthy')
  const randomIndex = Math.floor(Math.random() * diseases.length)
  const [slug, info] = diseases[randomIndex]

  return {
    disease: info.display_name,
    slug,
    confidence: 0.85 + Math.random() * 0.13,
    severity: info.severity
  }
}
