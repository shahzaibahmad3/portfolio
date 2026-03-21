import type { SkillCategory } from '../types'

export const skillCategories: SkillCategory[] = [
  {
    name: 'Languages',
    skills: [
      { name: 'Java', usedAt: ['CARS24', 'Paytail', 'Monster India'] },
      { name: 'Python', usedAt: ['Monster India', 'Personal Projects'] },
      { name: 'TypeScript', usedAt: ['This Portfolio'] },
    ],
  },
  {
    name: 'Frameworks',
    skills: [
      { name: 'Spring Boot', usedAt: ['CARS24', 'Paytail', 'Monster India'] },
      { name: 'Spring Reactive', usedAt: ['CARS24'] },
      { name: 'Spring Cloud', usedAt: ['CARS24'] },
      { name: 'Microservices', usedAt: ['CARS24', 'Paytail'] },
    ],
  },
  {
    name: 'Databases',
    skills: [
      { name: 'MySQL', usedAt: ['CARS24', 'Paytail', 'Monster India'] },
      { name: 'MongoDB', usedAt: ['CARS24', 'Paytail'] },
      { name: 'Redis', usedAt: ['CARS24'] },
    ],
  },
  {
    name: 'Message Queues',
    skills: [
      { name: 'Apache Kafka', usedAt: ['CARS24'] },
      { name: 'RabbitMQ', usedAt: ['CARS24'] },
      { name: 'GCP PubSub', usedAt: ['CARS24'] },
    ],
  },
  {
    name: 'Cloud & DevOps',
    skills: [
      { name: 'AWS Lambda', usedAt: ['CARS24'] },
      { name: 'AWS S3', usedAt: ['CARS24'] },
      { name: 'AWS API Gateway', usedAt: ['CARS24'] },
      { name: 'AWS RDS', usedAt: ['CARS24'] },
      { name: 'AWS CloudWatch', usedAt: ['CARS24'] },
      { name: 'Docker', usedAt: ['CARS24'] },
      { name: 'Jenkins', usedAt: ['CARS24', 'Paytail'] },
    ],
  },
  {
    name: 'Tools & Practices',
    skills: [
      { name: 'DataDog', usedAt: ['CARS24'] },
      { name: 'StatSig', usedAt: ['CARS24'] },
      { name: 'Graylog', usedAt: ['CARS24'] },
      { name: 'Kibana', usedAt: ['CARS24'] },
      { name: 'REST APIs', usedAt: ['CARS24', 'Paytail', 'Monster India'] },
      { name: 'DSA', usedAt: ['~425 LeetCode', '165 CodeChef', '15+ Contests'] },
    ],
  },
]
