import type { Question } from "./learning";

const item = (id: string, prompt: string, choices: string[], answer: string, hint: string, explanation: string): Question => ({ id, prompt, choices, answer, hint, explanation, visual: "map", skill: "social-inquiry" });

export const grade4SocialQuestArc: Question[] = [
  item("ss4-1", "On a map, which direction is usually at the top when there is a north arrow?", ["North", "South", "West"], "North", "Follow the point of the north arrow.", "Maps usually place north at the top, shown by a north arrow."),
  item("ss4-2", "You face north and turn right. Which direction are you facing?", ["East", "West", "South"], "East", "Picture the four main directions around you.", "When you face north, your right side points east."),
  item("ss4-3", "Why does a map use symbols such as a blue line for a river?", ["To show places clearly in a small space", "To hide the river", "To make every map identical"], "To show places clearly in a small space", "A map cannot draw everything full size.", "Symbols help maps show important features clearly without drawing them at real size."),
  item("ss4-4", "A neighbour uses a wheelchair. What makes a public building easier for them to enter?", ["A ramp", "A locked gate", "A very high step"], "A ramp", "Think about what lets wheels move safely from ground level to the entrance.", "A ramp helps wheelchair users enter a building more independently and safely."),
  item("ss4-5", "Which action helps save a shared resource?", ["Turning off a tap after use", "Leaving lights on all day", "Throwing litter into a drain"], "Turning off a tap after use", "Shared resources need care so everyone can use them.", "Turning off taps helps avoid wasting water, a resource people and living things need."),
  item("ss4-6", "Two classmates speak different home languages. What is a respectful response?", ["Be curious and listen", "Tell one classmate to stop speaking", "Exclude them from the game"], "Be curious and listen", "Communities can include many languages and ways of life.", "Listening with curiosity helps everyone feel included in a diverse community."),
];

export function getSocialQuestsForGrade(grade: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): Question[] {
  return grade === 4 ? grade4SocialQuestArc : [];
}
