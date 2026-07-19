import type { Grade, Question } from "./learning";

const item = (id: string, prompt: string, choices: string[], answer: string, hint: string, explanation: string, visual: Question["visual"], skill: Question["skill"]): Question => ({ id, prompt, choices, answer, hint, explanation, visual, skill });

export const gradeQuestArc: Record<Grade, Question[]> = {
  4: [
    item("g4-1", "Mira and Nova share one whole moon-fruit equally. What fraction does Nova get?", ["1/2", "1/3", "2/3"], "1/2", "There is one whole and two equal explorers.", "Nova gets one of two equal parts: 1/2.", "fraction", "fractions"),
    item("g4-2", "Which picture would show one half of one whole?", ["1 of 2 equal parts", "1 of 2 unequal parts", "1 of 4 equal parts"], "1 of 2 equal parts", "The whole must be split into equal parts.", "One half means one out of two equal parts. Unequal parts are not fair halves.", "fraction", "fractions"),
    item("g4-3", "Which fraction is another way to show one half?", ["1/4", "2/4", "3/4"], "2/4", "Imagine four equal panels. How many panels make the same amount as one half?", "Two out of four equal parts covers the same amount as one half: 2/4 = 1/2.", "fraction", "fractions"),
    item("g4-4", "A lantern has 4 equal windows. 3 windows glow. What fraction of the lantern is glowing?", ["1/4", "2/4", "3/4"], "3/4", "Count the glowing equal windows, then count all windows.", "Three of four equal windows glow, so the glowing fraction is 3/4.", "fraction", "fractions"),
    item("g4-5", "Eight starlights are shared into 4 equal packs. How many starlights are in each pack?", ["1", "2", "4"], "2", "Make four equal groups from eight objects.", "Eight shared equally into four packs gives 2 in each pack.", "ratio", "number-sense"),
    item("g4-6", "A trail has 12 equal steps. Which step is exactly halfway along the trail?", ["Step 3", "Step 6", "Step 9"], "Step 6", "Half of 12 is the same as splitting 12 into two equal groups.", "Step 6 is halfway because there are 6 equal steps before it and 6 after it.", "number-line", "number-sense"),
  ],
  5: [
    item("g5-1", "Which fraction is equal to 1/2?", ["2/4", "1/4", "3/4"], "2/4", "Double the top and bottom of 1/2.", "Two fourths covers the same amount as one half.", "fraction", "fractions"),
    item("g5-2", "Which decimal is equal to 3/4?", ["0.25", "0.5", "0.75"], "0.75", "Think of 3 out of 4 equal parts as 75 out of 100.", "Three fourths is seventy-five hundredths: 0.75.", "fraction", "fractions"),
    item("g5-3", "One quarter of 20 star tokens is how many tokens?", ["4", "5", "10"], "5", "Split 20 into four equal groups.", "One quarter means one of four equal groups. 20 ÷ 4 = 5.", "fraction", "fractions"),
    item("g5-4", "A map is 2.5 km long. You walk another 1.5 km. How far have you walked?", ["3 km", "4 km", "4.5 km"], "4 km", "Add the whole numbers and the tenths.", "2.5 + 1.5 = 4.0 km.", "number-line", "number-sense"),
    item("g5-5", "On a trail marked 0, 0.5, 1.0, 1.5, which marker is halfway between 1 and 2?", ["1.0", "1.5", "2.0"], "1.5", "Halfway means add one half to 1.", "The point halfway from 1 to 2 is 1.5.", "number-line", "number-sense"),
    item("g5-6", "A fruit drink uses 3 cups of water for 6 glasses. How many cups are needed for 12 glasses?", ["3", "6", "9"], "6", "12 glasses is double 6 glasses.", "Doubling the glasses doubles the water: 3 cups becomes 6 cups.", "ratio", "proportion"),
  ],
  6: [
    item("g6-1", "Which is larger?", ["3/5", "2/5", "They are equal"], "3/5", "The denominators are equal, so compare the numerators.", "With fifths, three parts are greater than two parts.", "fraction", "fractions"),
    item("g6-2", "Which fraction is equal to 2/3?", ["3/4", "4/6", "2/6"], "4/6", "Multiply the numerator and denominator by the same number.", "Two thirds is the same amount as four sixths.", "fraction", "fractions"),
    item("g6-3", "On a number line, which is greater?", ["-2", "-5", "They are equal"], "-2", "Numbers farther right are greater.", "-2 is to the right of -5 on a number line.", "number-line", "number-sense"),
    item("g6-4", "What is -6 + 4?", ["-10", "-2", "2"], "-2", "Start at -6 and move 4 steps right.", "Moving 4 steps right from -6 lands on -2.", "number-line", "number-sense"),
    item("g6-5", "A club has 4 red badges for every 6 blue badges. What is the simplified ratio red:blue?", ["2:3", "3:2", "4:6"], "2:3", "Divide both parts by 2.", "4:6 simplifies to 2:3.", "ratio", "proportion"),
    item("g6-6", "A paint mix uses 3 blue drops for every 2 gold drops. If it has 12 blue drops, how many gold drops are needed?", ["6", "8", "18"], "8", "12 is four groups of 3. Use four groups of 2 as well.", "Four matching groups of 2 gold drops make 8 gold drops.", "ratio", "proportion"),
  ],
  7: [
    item("g7-1", "Which fraction is closest to 1?", ["7/8", "5/8", "3/8"], "7/8", "Look for the numerator nearest the denominator.", "7 is only one away from 8, so 7/8 is closest to one whole.", "fraction", "fractions"),
    item("g7-2", "Which decimal is equal to 3/4?", ["0.34", "0.5", "0.75"], "0.75", "Three fourths is seventy-five hundredths.", "3/4 is equal to 0.75.", "fraction", "fractions"),
    item("g7-3", "What is -3 + 8?", ["-11", "5", "11"], "5", "Start at -3 and move 8 steps right.", "Moving 8 steps right from -3 lands on 5.", "number-line", "number-sense"),
    item("g7-4", "What is -7 + 2?", ["-9", "-5", "5"], "-5", "Start at -7 and move 2 steps right.", "Moving 2 steps right from -7 lands on -5.", "number-line", "number-sense"),
    item("g7-5", "A model uses a 2:5 scale. If the model length is 8 cm, what is the real length?", ["16 cm", "20 cm", "40 cm"], "20 cm", "8 is 4 groups of 2; use 4 groups of 5.", "4 × 5 = 20 cm.", "ratio", "proportion"),
    item("g7-6", "A recipe uses 3 berries for every 4 explorers. How many berries are needed for 24 explorers?", ["12", "18", "24"], "18", "24 is six groups of 4. Use six groups of 3 berries.", "Six matching groups of 3 berries make 18 berries.", "ratio", "proportion"),
  ],
  8: [
    item("g8-1", "A shop gives 25% off a ₹200 notebook set. What is the discount?", ["₹25", "₹50", "₹150"], "₹50", "25% is one quarter.", "One quarter of ₹200 is ₹50.", "fraction", "fractions"),
    item("g8-2", "What is the value of 3²?", ["6", "9", "12"], "9", "A square means multiply the number by itself.", "3² means 3 × 3, which is 9.", "formula", "algebra"),
    item("g8-3", "A recipe for 5 people uses 300 g flour. How much is needed for 10 people?", ["450 g", "500 g", "600 g"], "600 g", "10 is double 5.", "Doubling the people doubles 300 g to 600 g.", "ratio", "proportion"),
    item("g8-4", "Solve 3x + 5 = 20.", ["3", "5", "8"], "5", "First remove 5, then divide the remaining amount into three equal groups.", "3x = 15, so x = 5.", "formula", "algebra"),
    item("g8-5", "A rectangular garden is 8 m long and 5 m wide. What is its area?", ["13 m²", "26 m²", "40 m²"], "40 m²", "Area of a rectangle is length × width.", "8 × 5 = 40, so the garden covers 40 square metres.", "coordinate", "geometry"),
    item("g8-6", "A bag has 3 red and 2 blue counters. What is the probability of picking red?", ["2/5", "3/5", "3/2"], "3/5", "Count favourable counters, then count every counter.", "Three of the five equally likely counters are red, so the probability is 3/5.", "coordinate", "data"),
  ],
  9: [
    item("g9-1", "Which number is irrational?", ["1/3", "√2", "0.75"], "√2", "Can it be written as a ratio of integers?", "√2 cannot be written as a ratio of integers, so it is irrational.", "number-line", "number-sense"),
    item("g9-2", "Between which integers does √20 lie?", ["2 and 3", "4 and 5", "5 and 6"], "4 and 5", "Compare 20 with nearby perfect squares.", "4² is 16 and 5² is 25, so √20 lies between 4 and 5.", "number-line", "number-sense"),
    item("g9-3", "A phone plan costs ₹299 for 2 GB. At the same rate, what is 6 GB?", ["₹598", "₹897", "₹1,196"], "₹897", "6 GB is three groups of 2 GB.", "3 × ₹299 = ₹897.", "ratio", "proportion"),
    item("g9-4", "Solve 2x + 5 = 17.", ["5", "6", "11"], "6", "Remove 5 first, then split 12 into two equal groups.", "2x = 12, so x = 6.", "formula", "algebra"),
    item("g9-5", "In which quadrant is the point (-2, 3)?", ["Quadrant I", "Quadrant II", "Quadrant III"], "Quadrant II", "Its x-coordinate is negative and its y-coordinate is positive.", "A negative x and positive y place the point in Quadrant II.", "coordinate", "geometry"),
    item("g9-6", "What is the mean of 4, 6, 8, and 10?", ["6", "7", "8"], "7", "Add the values, then share the total equally among four values.", "The total is 28; 28 ÷ 4 = 7.", "coordinate", "data"),
  ],
  10: [
    item("g10-1", "A jacket marked ₹1,200 has a 20% discount. What is the sale price?", ["₹240", "₹960", "₹1,020"], "₹960", "Find 20%, then subtract it from the marked price.", "20% of ₹1,200 is ₹240; ₹1,200 − ₹240 = ₹960.", "fraction", "fractions"),
    item("g10-2", "Which is the larger real number?", ["√7", "2.5", "They are equal"], "√7", "Compare squares: 2.5² is 6.25.", "Since 2.5² is below 7, √7 is greater than 2.5.", "number-line", "number-sense"),
    item("g10-3", "A ₹5,000 investment grows by 10%. What is its new value?", ["₹5,050", "₹5,500", "₹6,000"], "₹5,500", "10% of ₹5,000 is ₹500.", "Adding ₹500 to ₹5,000 gives ₹5,500.", "ratio", "proportion"),
    item("g10-4", "What are the roots of x² − 5x + 6 = 0?", ["2 and 3", "1 and 6", "−2 and −3"], "2 and 3", "Find two numbers that multiply to 6 and add to −5.", "(x − 2)(x − 3) = 0, so x is 2 or 3.", "formula", "algebra"),
    item("g10-5", "An arithmetic progression starts at 3 and increases by 4 each time. What is its 10th term?", ["35", "39", "43"], "39", "Use a + (n − 1)d.", "3 + 9 × 4 = 39.", "formula", "algebra"),
    item("g10-6", "A right triangle has shorter sides 6 cm and 8 cm. What is its hypotenuse?", ["10 cm", "12 cm", "14 cm"], "10 cm", "Use a² + b² = c².", "6² + 8² = 36 + 64 = 100, so c = 10 cm.", "coordinate", "geometry"),
  ],
  11: [
    item("g11-1", "Which interval represents x with -2 < x ≤ 4?", ["[-2, 4]", "(-2, 4]", "(-2, 4)"], "(-2, 4]", "A round bracket excludes; a square bracket includes.", "-2 is excluded and 4 is included, so the interval is (-2, 4].", "number-line", "number-sense"),
    item("g11-2", "If f(x) = 2x + 3, what is f(4)?", ["8", "11", "14"], "11", "Substitute 4 for x.", "2(4) + 3 = 11.", "formula", "algebra"),
    item("g11-3", "A lab solution has 3 parts acid for every 7 parts water. How much acid is in a 50 mL mixture?", ["15 mL", "20 mL", "35 mL"], "15 mL", "There are 10 total parts; find 3/10 of 50.", "3/10 × 50 = 15 mL.", "ratio", "proportion"),
    item("g11-4", "What are the solutions of x² − 9 = 0?", ["3 only", "−3 only", "−3 and 3"], "−3 and 3", "Move 9 to the other side, then take both square roots.", "x² = 9, so x = −3 or 3.", "formula", "algebra"),
    item("g11-5", "What is the distance from (0, 0) to (3, 4)?", ["5", "6", "7"], "5", "Use the right triangle made by the horizontal and vertical changes.", "The distance is √(3² + 4²) = 5.", "coordinate", "geometry"),
    item("g11-6", "A fair die is rolled once. What is the probability of an even number?", ["1/6", "1/2", "2/3"], "1/2", "There are three even outcomes out of six equally likely outcomes.", "2, 4, and 6 are even, so 3/6 = 1/2.", "coordinate", "data"),
  ],
  12: [
    item("g12-1", "If f(x) = x² + 1, what is f(3)?", ["7", "9", "10"], "10", "Substitute 3 for x before doing the operations.", "3² + 1 = 10.", "formula", "algebra"),
    item("g12-2", "What is the derivative of x²?", ["x", "2x", "x³/3"], "2x", "Bring the exponent down, then reduce it by one.", "The derivative of x² is 2x.", "formula", "algebra"),
    item("g12-3", "A product price rises from ₹800 to ₹920. What is the percentage increase?", ["12%", "15%", "20%"], "15%", "Find the increase, then divide by the original price.", "₹120 ÷ ₹800 = 0.15 = 15%.", "ratio", "proportion"),
    item("g12-4", "What is ∫₀² x dx?", ["1", "2", "4"], "2", "An antiderivative of x is x²/2; evaluate it at both ends.", "At 2, x²/2 is 2; at 0 it is 0, so the definite integral is 2.", "formula", "algebra"),
    item("g12-5", "What is the determinant of [[2, 1], [3, 4]]?", ["5", "8", "11"], "5", "For a 2×2 matrix, multiply the main diagonal and subtract the other diagonal.", "2 × 4 − 1 × 3 = 5.", "coordinate", "geometry"),
    item("g12-6", "A bag has 3 red and 2 blue balls. Two are drawn without replacement. What is the probability both are red?", ["1/5", "3/10", "3/5"], "3/10", "Multiply the chance of red first by the chance of red after one red is removed.", "3/5 × 2/4 = 6/20 = 3/10.", "coordinate", "data"),
  ],
};

export function getQuestsForGrade(grade: Grade): Question[] {
  return gradeQuestArc[grade];
}

// The opening check samples the same mathematical territory as the learner's
// grade mission. It is a quiet placement signal, not a test score.
export function getDiagnosticForGrade(grade: Grade): Question[] {
  const quests = gradeQuestArc[grade];
  return [quests[0], quests[Math.min(3, quests.length - 1)], quests[Math.min(5, quests.length - 1)]];
}
