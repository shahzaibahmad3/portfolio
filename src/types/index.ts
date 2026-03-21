export type AppMode = 'landing' | 'recruiter' | 'normal'

export interface Project {
  id: string
  title: string
  subtitle: string
  problem: string
  design: string
  scale: string
  impact: string
  tech: string[]
  metric: string
  metricLabel: string
  icon: string
}

export interface TimelineEntry {
  id: string
  company: string
  role: string
  period: string
  location: string
  achievements: string[]
  award?: string
  metric?: string
}

export interface SkillCategory {
  name: string
  skills: Skill[]
}

export interface Skill {
  name: string
  usedAt: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  unlocked: boolean
}

export interface Quest {
  id: string
  title: string
  description: string
  completed: boolean
  progress: number
  total: number
}

export interface TraceStep {
  id: string
  label: string
  description: string
  metric?: string
  icon: string
}

export interface EducationEntry {
  id: string
  degree: string
  institution: string
  board?: string
  score: string
  period: string
}
