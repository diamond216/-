import {
  ActivityLog,
  Category,
  DAY_MS,
  FrozenClock,
  Genre,
  HOUR_MS,
  Listing,
  LocalizedText,
  Maker,
  MakerStory,
  Project,
  type ProjectProps,
  ProjectUpdate,
  ReplyTime,
  Stage,
  UpdateType,
} from "@/domain";

export const NOW = new FrozenClock("2026-11-16T12:00:00Z");

export const maker = new Maker({
  id: "m",
  name: "Mo",
  nickname: new LocalizedText("Mo", "โม"),
  role: new LocalizedText("Tester", "ผู้ทดสอบ"),
  joinedYear: 2025,
  motto: new LocalizedText("Hi", "สวัสดี"),
  initials: "M",
  tone: "clay",
  story: new MakerStory({
    intro: LocalizedText.same("Hello."),
    description: LocalizedText.same("Mo makes things."),
    talkTopics: [],
    replyTime: new ReplyTime(2),
    languages: ["en"],
    timeline: [],
    recognitions: [],
    earlier: [],
  }),
});

export const genre = new Genre("puzzle", "Puzzle", "game");

/** An update posted `hoursAgo` before NOW. */
export function update(projectId: string, hoursAgo: number, type: UpdateType = UpdateType.DEVLOG, n = 0) {
  return new ProjectUpdate({
    id: `${projectId}-${hoursAgo}-${n}`,
    projectId,
    type,
    postedAt: new Date(NOW.now().getTime() - hoursAgo * HOUR_MS),
    summary: LocalizedText.same("did a thing."),
    title: LocalizedText.same("A thing"),
    body: LocalizedText.same("We did a thing."),
  });
}

export function listing(id: string, updates: ProjectUpdate[], props: Partial<ProjectProps> = {}) {
  const project = new Project({
    id,
    name: id,
    category: Category.GAME,
    genres: [genre],
    tags: [],
    stage: Stage.BETA,
    blurb: LocalizedText.same("A thing."),
    makerId: maker.id,
    quality: 0.5,
    trust: 0.5,
    coverColor: "#000",
    ...props,
  });
  return new Listing(project, maker, new ActivityLog(updates));
}

export { DAY_MS };
