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

export const grade5SocialQuestArc: Question[] = [
  item("ss5-1", "Which map feature helps you understand what a symbol means?", ["Key or legend", "Title only", "Page number"], "Key or legend", "Look for the part that explains map symbols.", "A map key, also called a legend, explains what each symbol represents."),
  item("ss5-2", "A scale says 1 cm on the map represents 2 km in real life. What does 3 cm represent?", ["6 km", "3 km", "5 km"], "6 km", "Each centimetre stands for 2 km; make three equal groups.", "3 × 2 km = 6 km in real life."),
  item("ss5-3", "Which is a responsibility of a community member?", ["Following shared safety rules", "Damaging public property", "Ignoring an emergency"], "Following shared safety rules", "Responsibilities help people live safely and fairly together.", "Following shared safety rules helps protect everyone in the community."),
  item("ss5-4", "Why do families and communities celebrate different festivals?", ["People have diverse traditions and beliefs", "Only one festival is allowed", "Maps choose every celebration"], "People have diverse traditions and beliefs", "India includes many communities with different customs.", "Different festivals reflect the diverse traditions and beliefs of people and communities."),
  item("ss5-5", "Which choice uses a natural resource responsibly?", ["Carrying a reusable bottle", "Wasting clean water", "Burning plastic in a park"], "Carrying a reusable bottle", "Think about choices that reduce waste and protect resources.", "A reusable bottle can reduce single-use waste and help care for shared resources."),
  item("ss5-6", "A local council wants to know whether a park needs more bins. What is a fair first step?", ["Ask park users and observe the area", "Guess without visiting", "Only ask one person"], "Ask park users and observe the area", "A fair decision uses information from the people and place involved.", "Listening to users and observing the park provides better evidence for a community decision."),
];

export const grade6SocialQuestArc: Question[] = [
  item("ss6-1", "Why do historians use more than one source to learn about the past?", ["Different sources can provide evidence and perspectives", "One source is always enough", "History has no evidence"], "Different sources can provide evidence and perspectives", "Think about how one source can be limited or incomplete.", "Comparing sources helps historians build a stronger, more balanced understanding of the past."),
  item("ss6-2", "Which tool helps show the exact direction of a place from another place?", ["Compass", "Thermometer", "Ruler only"], "Compass", "This tool is designed to identify directions such as north and east.", "A compass helps identify directions on the ground or on a map."),
  item("ss6-3", "What does a globe show especially well?", ["The Earth as a round model", "Every building at full size", "Only one country"], "The Earth as a round model", "Think about how a globe differs from a flat map.", "A globe is a round model that represents the Earth’s shape and global locations."),
  item("ss6-4", "Why are rules needed in a classroom or community?", ["They help people act safely and fairly together", "They remove everyone’s voice", "They make shared spaces unusable"], "They help people act safely and fairly together", "Consider what happens when people share a space without agreed expectations.", "Fair rules help people cooperate, stay safe, and respect one another."),
  item("ss6-5", "A farmer’s work depends on reliable rainfall. Which type of resource is rainfall?", ["Natural resource", "Human-made resource", "A map symbol only"], "Natural resource", "It comes from nature rather than being made by people.", "Rainfall is a natural resource that supports agriculture and many living systems."),
  item("ss6-6", "Which action best supports equality in a group project?", ["Give each member a meaningful chance to contribute", "Let one person do every task", "Ignore quieter group members"], "Give each member a meaningful chance to contribute", "Equality includes fair chances to participate.", "Sharing meaningful roles helps all members contribute and be respected."),
];

export function getSocialQuestsForGrade(grade: 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12): Question[] {
  return grade === 4 ? grade4SocialQuestArc : grade === 5 ? grade5SocialQuestArc : grade === 6 ? grade6SocialQuestArc : [];
}
