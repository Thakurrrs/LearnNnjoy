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
    item("g5-2", "A map is 2.5 km long. You walk another 1.5 km. How far have you walked?", ["3 km", "4 km", "4.5 km"], "4 km", "Add the whole numbers and the tenths.", "2.5 + 1.5 = 4.0 km.", "number-line", "number-sense"),
    item("g5-3", "A fruit drink uses 3 cups of water for 6 glasses. How many cups are needed for 12 glasses?", ["3", "6", "9"], "6", "12 glasses is double 6 glasses.", "Doubling the glasses doubles the water: 3 cups becomes 6 cups.", "ratio", "proportion"),
  ],
  6: [
    item("g6-1", "Which is larger?", ["3/5", "2/5", "They are equal"], "3/5", "The denominators are equal, so compare the numerators.", "With fifths, three parts are greater than two parts.", "fraction", "fractions"),
    item("g6-2", "On a number line, which is greater?", ["-2", "-5", "They are equal"], "-2", "Numbers farther right are greater.", "-2 is to the right of -5 on a number line.", "number-line", "number-sense"),
    item("g6-3", "A club has 4 red badges for every 6 blue badges. What is the simplified ratio red:blue?", ["2:3", "3:2", "4:6"], "2:3", "Divide both parts by 2.", "4:6 simplifies to 2:3.", "ratio", "proportion"),
  ],
  7: [
    item("g7-1", "Which fraction is closest to 1?", ["7/8", "5/8", "3/8"], "7/8", "Look for the numerator nearest the denominator.", "7 is only one away from 8, so 7/8 is closest to one whole.", "fraction", "fractions"),
    item("g7-2", "What is -3 + 8?", ["-11", "5", "11"], "5", "Start at -3 and move 8 steps right.", "Moving 8 steps right from -3 lands on 5.", "number-line", "number-sense"),
    item("g7-3", "A model uses a 2:5 scale. If the model length is 8 cm, what is the real length?", ["16 cm", "20 cm", "40 cm"], "20 cm", "8 is 4 groups of 2; use 4 groups of 5.", "4 × 5 = 20 cm.", "ratio", "proportion"),
  ],
  8: [
    item("g8-1", "A shop gives 25% off a ₹200 notebook set. What is the discount?", ["₹25", "₹50", "₹150"], "₹50", "25% is one quarter.", "One quarter of ₹200 is ₹50.", "fraction", "fractions"),
    item("g8-2", "What is the value of 3²?", ["6", "9", "12"], "9", "A square means multiply the number by itself.", "3² means 3 × 3, which is 9.", "number-line", "number-sense"),
    item("g8-3", "A recipe for 5 people uses 300 g flour. How much is needed for 10 people?", ["450 g", "500 g", "600 g"], "600 g", "10 is double 5.", "Doubling the people doubles 300 g to 600 g.", "ratio", "proportion"),
  ],
  9: [
    item("g9-1", "Which number is irrational?", ["1/3", "√2", "0.75"], "√2", "Can it be written as a ratio of integers?", "√2 cannot be written as a ratio of integers, so it is irrational.", "fraction", "fractions"),
    item("g9-2", "Between which integers does √20 lie?", ["2 and 3", "4 and 5", "5 and 6"], "4 and 5", "Compare 20 with nearby perfect squares.", "4² is 16 and 5² is 25, so √20 lies between 4 and 5.", "number-line", "number-sense"),
    item("g9-3", "A phone plan costs ₹299 for 2 GB. At the same rate, what is 6 GB?", ["₹598", "₹897", "₹1,196"], "₹897", "6 GB is three groups of 2 GB.", "3 × ₹299 = ₹897.", "ratio", "proportion"),
  ],
  10: [
    item("g10-1", "A jacket marked ₹1,200 has a 20% discount. What is the sale price?", ["₹240", "₹960", "₹1,020"], "₹960", "Find 20%, then subtract it from the marked price.", "20% of ₹1,200 is ₹240; ₹1,200 − ₹240 = ₹960.", "fraction", "fractions"),
    item("g10-2", "Which is the larger real number?", ["√7", "2.5", "They are equal"], "√7", "Compare squares: 2.5² is 6.25.", "Since 2.5² is below 7, √7 is greater than 2.5.", "number-line", "number-sense"),
    item("g10-3", "A ₹5,000 investment grows by 10%. What is its new value?", ["₹5,050", "₹5,500", "₹6,000"], "₹5,500", "10% of ₹5,000 is ₹500.", "Adding ₹500 to ₹5,000 gives ₹5,500.", "ratio", "proportion"),
  ],
  11: [
    item("g11-1", "Which interval represents x with -2 < x ≤ 4?", ["[-2, 4]", "(-2, 4]", "(-2, 4)"], "(-2, 4]", "A round bracket excludes; a square bracket includes.", "-2 is excluded and 4 is included, so the interval is (-2, 4].", "fraction", "fractions"),
    item("g11-2", "If f(x) = 2x + 3, what is f(4)?", ["8", "11", "14"], "11", "Substitute 4 for x.", "2(4) + 3 = 11.", "number-line", "number-sense"),
    item("g11-3", "A lab solution has 3 parts acid for every 7 parts water. How much acid is in a 50 mL mixture?", ["15 mL", "20 mL", "35 mL"], "15 mL", "There are 10 total parts; find 3/10 of 50.", "3/10 × 50 = 15 mL.", "ratio", "proportion"),
  ],
  12: [
    item("g12-1", "What is 3/4 written as a decimal?", ["0.34", "0.75", "1.25"], "0.75", "Divide 3 by 4.", "3 ÷ 4 = 0.75.", "fraction", "fractions"),
    item("g12-2", "For y = 3x², what is y when x = -2?", ["-12", "6", "12"], "12", "Square -2 before multiplying.", "(-2)² = 4, then 3 × 4 = 12.", "number-line", "number-sense"),
    item("g12-3", "A product price rises from ₹800 to ₹920. What is the percentage increase?", ["12%", "15%", "20%"], "15%", "Find the increase, then divide by the original price.", "₹120 ÷ ₹800 = 0.15 = 15%.", "ratio", "proportion"),
  ],
};

export function getQuestsForGrade(grade: Grade): Question[] {
  return gradeQuestArc[grade];
}
