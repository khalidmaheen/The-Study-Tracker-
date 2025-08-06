import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  mockStudySessions, 
  mockSubjects, 
  mockGoals, 
  distractionSources 
} from '../data/mockData';

const StudyContext = createContext();

export const useStudy = () => {
  const context = useContext(StudyContext);
  if (!context) {
    throw new Error('useStudy must be used within a StudyProvider');
  }
  return context;
};

export const StudyProvider = ({ children }) => {
  const [sessions, setSessions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [goals, setGoals] = useState(null);
  const [activeSession, setActiveSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load mock data
    setTimeout(() => {
      setSessions(mockStudySessions);
      setSubjects(mockSubjects);
      setGoals(mockGoals);
      setIsLoading(false);
    }, 500);
  }, []);

  const startSession = (subjectId) => {
    const newSession = {
      id: Date.now().toString(),
      subjectId,
      startTime: new Date().toISOString(),
      moodBefore: null
    };
    setActiveSession(newSession);
    return newSession;
  };

  const endSession = (sessionData) => {
    if (!activeSession) return null;

    const completedSession = {
      ...activeSession,
      endTime: new Date().toISOString(),
      duration: Math.round((new Date() - new Date(activeSession.startTime)) / 60000),
      ...sessionData
    };

    setSessions(prev => [completedSession, ...prev]);
    setActiveSession(null);
    return completedSession;
  };

  const cancelSession = () => {
    setActiveSession(null);
  };

  const addCustomSubject = (name, color, icon) => {
    const newSubject = {
      id: Date.now().toString(),
      name,
      color,
      icon,
      isCustom: true
    };
    setSubjects(prev => [...prev, newSubject]);
    return newSubject;
  };

  const updateGoals = (newGoals) => {
    setGoals(newGoals);
  };

  const getSessionsByDateRange = (startDate, endDate) => {
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= startDate && sessionDate <= endDate;
    });
  };

  const getWeeklyStats = () => {
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    const weekSessions = getSessionsByDateRange(startOfWeek, new Date());

    const totalMinutes = weekSessions.reduce((sum, session) => sum + session.duration, 0);
    const avgFocus = weekSessions.length > 0 
      ? weekSessions.reduce((sum, session) => sum + session.focusRating, 0) / weekSessions.length 
      : 0;
    const avgDistraction = weekSessions.length > 0
      ? weekSessions.reduce((sum, session) => sum + session.distractionRating, 0) / weekSessions.length
      : 0;

    return {
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      totalSessions: weekSessions.length,
      averageFocus: Math.round(avgFocus * 10) / 10,
      averageDistraction: Math.round(avgDistraction * 10) / 10,
      sessions: weekSessions
    };
  };

  const value = {
    sessions,
    subjects,
    goals,
    activeSession,
    isLoading,
    startSession,
    endSession,
    cancelSession,
    addCustomSubject,
    updateGoals,
    getSessionsByDateRange,
    getWeeklyStats,
    distractionSources
  };

  return (
    <StudyContext.Provider value={value}>
      {children}
    </StudyContext.Provider>
  );
};