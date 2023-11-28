export interface Course {
  id: number
  image: string
  user: string
  tutorImg: string
  completedTasks: number
  totalTasks: number
  userCount: number
  note: number
  view: number
  time: string
  logo: string
  courseTitle: string
  color: string
  desc: string
  tags: string
  rating: number
  ratingCount: number
}

export interface CourseDetails {
  title: string
  about: string
  instructor: string
  instructorAvatar: string
  instructorPosition: string
  skillLevel: string
  totalLectures: number
  totalStudents: number
  isCaptions: boolean
  language: string
  length: string
  content: CourseContent[]
  description: string
}

export interface CourseContent {
  title: string
  status: string
  time: string
  id: string
  topics: CourseTopic[]
}

export interface CourseTopic {
  title: string
  time: string
  isCompleted: boolean
}
