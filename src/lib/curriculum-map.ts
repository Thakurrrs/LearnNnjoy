import type { Grade } from "./learning";

export type SubjectId = "maths" | "science" | "social" | "english";

export type SubjectRoadmap = {
  id: SubjectId;
  label: string;
  icon: string;
  questWorld: string;
  topics: string[];
  pilotStatus: "live" | "mapped";
};

type GradeRoadmap = Record<SubjectId, SubjectRoadmap>;

const entry = (id: SubjectId, label: string, icon: string, questWorld: string, topics: string[], pilotStatus: SubjectRoadmap["pilotStatus"]): SubjectRoadmap => ({ id, label, icon, questWorld, topics, pilotStatus });

// Competency bands, versioned separately from individual NCERT textbook chapters.
// This lets LearnNnjoy support the current NCERT transition without hard-coding a
// publisher's chapter numbering into the learner experience.
export const curriculumMap: Record<Grade, GradeRoadmap> = {
  4: {
    maths: entry("maths", "Mathematics", "✦", "Lumina Restoration", ["Numbers, place value and operations", "Fractions, measurement and time", "Shapes, patterns and data"], "live"),
    science: entry("science", "EVS", "🌿", "Earthkeepers", ["Families, food and communities", "Plants, animals and habitats", "Water, travel and the local environment"], "live"),
    social: entry("social", "Our World", "🧭", "Mapmakers' Camp", ["Neighbourhoods and diversity", "Maps, directions and places", "Caring for people and resources"], "live"),
    english: entry("english", "English", "📚", "Story Studio", ["Reading for meaning", "Vocabulary and speaking", "Writing vivid stories"], "live"),
  },
  5: {
    maths: entry("maths", "Mathematics", "✦", "Lumina Restoration", ["Large numbers and operations", "Fractions, decimals and measurement", "Geometry, patterns and data"], "live"),
    science: entry("science", "EVS", "🌿", "Earthkeepers", ["Living systems and health", "Materials, water and work", "People, places and sustainability"], "live"),
    social: entry("social", "Our World", "🧭", "Mapmakers' Camp", ["India's regions and communities", "Maps and journeys", "Rights, responsibilities and resources"], "live"),
    english: entry("english", "English", "📚", "Story Studio", ["Comprehension and inference", "Grammar in context", "Narrative and informative writing"], "live"),
  },
  6: {
    maths: entry("maths", "Mathematics", "✦", "Lumina Restoration", ["Whole numbers and fractions", "Decimals, integers and ratio", "Geometry, algebraic thinking and data"], "live"),
    science: entry("science", "Science", "🔬", "Discovery Lab", ["Food, materials and living things", "Motion, light and electricity", "Earth, water and our environment"], "live"),
    social: entry("social", "Social Science", "🧭", "Chronicle Quest", ["Early societies and history", "Earth, maps and livelihoods", "Government and diversity"], "live"),
    english: entry("english", "English", "📚", "Story Studio", ["Close reading and response", "Language for expression", "Creative and purposeful writing"], "live"),
  },
  7: {
    maths: entry("maths", "Mathematics", "✦", "Lumina Restoration", ["Integers, fractions and decimals", "Rational numbers, ratio and percentage", "Algebra, geometry and data"], "live"),
    science: entry("science", "Science", "🔬", "Discovery Lab", ["Nutrition, weather and ecosystems", "Heat, acids and physical processes", "Life processes and reproduction"], "live"),
    social: entry("social", "Social Science", "🧭", "Chronicle Quest", ["Medieval and modern transitions", "Environment and human settlements", "Democracy, equality and markets"], "live"),
    english: entry("english", "English", "📚", "Story Studio", ["Literary response", "Language choices and grammar", "Argument, description and storytelling"], "live"),
  },
  8: {
    maths: entry("maths", "Mathematics", "✦", "Lumina Restoration", ["Rational numbers and exponents", "Linear equations, percentage and graphs", "Geometry, mensuration and probability"], "live"),
    science: entry("science", "Science", "🔬", "Discovery Lab", ["Crop systems, microbes and health", "Force, pressure, sound and light", "Cells, adolescence and conservation"], "mapped"),
    social: entry("social", "Social Science", "🧭", "Chronicle Quest", ["Colonial history and the Constitution", "Resources, industries and agriculture", "Justice and public institutions"], "mapped"),
    english: entry("english", "English", "📚", "Story Studio", ["Reading across genres", "Grammar for clarity", "Research, reports and creative writing"], "mapped"),
  },
  9: {
    maths: entry("maths", "Mathematics", "✦", "Orbit Academy", ["Number systems and algebra", "Coordinate geometry and linear equations", "Geometry, statistics and probability"], "live"),
    science: entry("science", "Science", "🔬", "Discovery Lab", ["Matter, atoms and the cell", "Motion, force and gravitation", "Life, health and natural resources"], "mapped"),
    social: entry("social", "Social Science", "🧭", "Chronicle Quest", ["Contemporary history and democracy", "India's geography and economy", "Rights and constitutional design"], "mapped"),
    english: entry("english", "English", "📚", "Story Studio", ["Critical reading", "Language and literary craft", "Analytical and creative writing"], "mapped"),
  },
  10: {
    maths: entry("maths", "Mathematics", "✦", "Orbit Academy", ["Real numbers, polynomials and equations", "Trigonometry and coordinate geometry", "Mensuration, statistics and probability"], "live"),
    science: entry("science", "Science", "🔬", "Discovery Lab", ["Chemical reactions and carbon", "Life processes and heredity", "Light, electricity and environment"], "mapped"),
    social: entry("social", "Social Science", "🧭", "Chronicle Quest", ["Modern India and the world", "Resources, development and economy", "Democracy, power and gender"], "mapped"),
    english: entry("english", "English", "📚", "Story Studio", ["Literature and evidence", "Grammar in authentic use", "Exam-ready writing and speaking"], "mapped"),
  },
  11: {
    maths: entry("maths", "Mathematics", "✦", "Orbit Academy", ["Sets, functions and trigonometry", "Complex numbers and coordinate geometry", "Calculus foundations, probability and statistics"], "live"),
    science: entry("science", "Science", "🔬", "Discovery Lab", ["Physics: motion, matter and waves", "Chemistry: structure and reactions", "Biology: diversity and physiology"], "mapped"),
    social: entry("social", "Social Science", "🧭", "Chronicle Quest", ["Political theory and society", "Economics and development", "Historical inquiry and geography"], "mapped"),
    english: entry("english", "English", "📚", "Story Studio", ["Close literary analysis", "Research and synthesis", "Clear academic expression"], "mapped"),
  },
  12: {
    maths: entry("maths", "Mathematics", "✦", "Orbit Academy", ["Relations, functions and calculus", "Vectors, matrices and three-dimensional geometry", "Probability, linear programming and applications"], "live"),
    science: entry("science", "Science", "🔬", "Discovery Lab", ["Physics, chemistry and biology pathways", "Practical investigation", "Exam and career-linked applications"], "mapped"),
    social: entry("social", "Social Science", "🧭", "Chronicle Quest", ["Politics, society and global change", "Economics and public policy", "Evidence-based historical and geographic thinking"], "mapped"),
    english: entry("english", "English", "📚", "Story Studio", ["Literature, voice and context", "Argument and synthesis", "Writing for higher education and work"], "mapped"),
  },
};

export function getGradeRoadmap(grade: Grade) {
  return Object.values(curriculumMap[grade]);
}
