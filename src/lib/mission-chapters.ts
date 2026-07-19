import { curriculumMap, type SubjectId } from "./curriculum-map";
import type { Grade } from "./learning";

export type MissionChapter = {
  number: number;
  topic: string;
  startIndex: number;
  endIndex: number;
};

export function getMissionChapters(grade: Grade, subject: SubjectId, missionLength: number): MissionChapter[] {
  const topics = curriculumMap[grade][subject].topics;
  const questionsPerChapter = Math.max(1, Math.ceil(missionLength / topics.length));
  return topics.map((topic, index) => ({
    number: index + 1,
    topic,
    startIndex: index * questionsPerChapter,
    endIndex: Math.min(missionLength - 1, (index + 1) * questionsPerChapter - 1),
  })).filter((chapter) => chapter.startIndex < missionLength);
}

export function getMissionChapter(grade: Grade, subject: SubjectId, missionLength: number, questIndex: number): MissionChapter {
  const chapters = getMissionChapters(grade, subject, missionLength);
  return chapters.find((chapter) => questIndex >= chapter.startIndex && questIndex <= chapter.endIndex) ?? chapters[chapters.length - 1];
}
