// Mock data for Study Edit Tracker
export const mockUser = {
  id: '1',
  name: 'Alex Student',
  email: 'alex@example.com',
  grade: 12,
  createdAt: '2024-09-01'
};

export const mockSubjects = [
  { id: '1', name: 'Mathematics', color: '#3B82F6', icon: 'Calculator' },
  { id: '2', name: 'Life Sciences', color: '#10B981', icon: 'Microscope' },
  { id: '3', name: 'Physical Sciences', color: '#F59E0B', icon: 'Atom' },
  { id: '4', name: 'English', color: '#EF4444', icon: 'BookOpen' },
  { id: '5', name: 'Afrikaans', color: '#8B5CF6', icon: 'Languages' },
  { id: '6', name: 'History', color: '#F97316', icon: 'Clock' },
  { id: '7', name: 'Geography', color: '#06B6D4', icon: 'Globe' }
];

export const mockGoals = {
  dailyStudyTime: 4, // hours
  weeklySubjectGoals: [
    { subjectId: '1', targetHours: 8 },
    { subjectId: '2', targetHours: 6 },
    { subjectId: '3', targetHours: 6 },
    { subjectId: '4', targetHours: 4 },
    { subjectId: '5', targetHours: 3 }
  ]
};

export const mockStudySessions = [
  {
    id: '1',
    subjectId: '1',
    startTime: '2024-12-20T09:00:00Z',
    endTime: '2024-12-20T11:30:00Z',
    duration: 150, // minutes
    focusRating: 8,
    distractionRating: 3,
    moodBefore: 6,
    moodAfter: 8,
    notes: 'Worked on calculus problems. Phone kept buzzing.',
    distractionSource: 'Phone notifications'
  },
  {
    id: '2',
    subjectId: '2',
    startTime: '2024-12-20T14:00:00Z',
    endTime: '2024-12-20T15:45:00Z',
    duration: 105,
    focusRating: 9,
    distractionRating: 2,
    moodBefore: 7,
    moodAfter: 9,
    notes: 'Cell division chapter review. Very focused session.',
    distractionSource: 'None'
  },
  {
    id: '3',
    subjectId: '1',
    startTime: '2024-12-19T16:00:00Z',
    endTime: '2024-12-19T18:00:00Z',
    duration: 120,
    focusRating: 6,
    distractionRating: 7,
    moodBefore: 5,
    moodAfter: 6,
    notes: 'Struggled with trigonometry. Kept checking social media.',
    distractionSource: 'Social media'
  },
  {
    id: '4',
    subjectId: '3',
    startTime: '2024-12-19T10:00:00Z',
    endTime: '2024-12-19T12:00:00Z',
    duration: 120,
    focusRating: 7,
    distractionRating: 4,
    moodBefore: 6,
    moodAfter: 7,
    notes: 'Chemistry practicals preparation.',
    distractionSource: 'Background noise'
  },
  {
    id: '5',
    subjectId: '4',
    startTime: '2024-12-18T15:00:00Z',
    endTime: '2024-12-18T16:30:00Z',
    duration: 90,
    focusRating: 8,
    distractionRating: 2,
    moodBefore: 7,
    moodAfter: 8,
    notes: 'Essay writing practice. Good flow.',
    distractionSource: 'None'
  }
];

export const mockWeeklyStats = {
  totalHours: 12.5,
  averageFocus: 7.6,
  averageDistraction: 3.6,
  averageMoodImprovement: 1.4,
  completedGoals: 3,
  totalGoals: 5
};

export const distractionSources = [
  'Phone notifications',
  'Social media',
  'Background noise',
  'Family/friends',
  'Hunger/thirst',
  'Tiredness',
  'Other thoughts',
  'None'
];

export const getCurrentWeekSessions = () => {
  const today = new Date();
  const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
  return mockStudySessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= startOfWeek;
  });
};

export const getSubjectById = (id) => {
  return mockSubjects.find(subject => subject.id === id);
};

export const getTotalStudyTimeBySubject = () => {
  const subjectTotals = {};
  mockStudySessions.forEach(session => {
    const subject = getSubjectById(session.subjectId);
    if (subject) {
      subjectTotals[subject.name] = (subjectTotals[subject.name] || 0) + session.duration;
    }
  });
  return subjectTotals;
};