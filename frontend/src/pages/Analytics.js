import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  BarChart, 
  Clock, 
  TrendingUp, 
  Brain, 
  Target,
  Calendar,
  Zap
} from 'lucide-react';

const Analytics = () => {
  const { sessions, subjects, getWeeklyStats } = useStudy();
  const [timeframe, setTimeframe] = useState('week');

  const weeklyStats = getWeeklyStats();

  const getSubjectById = (id) => subjects.find(s => s.id === id);

  // Calculate subject-wise statistics
  const subjectStats = subjects.map(subject => {
    const subjectSessions = sessions.filter(s => s.subjectId === subject.id);
    const totalMinutes = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
    const avgFocus = subjectSessions.length > 0 
      ? subjectSessions.reduce((sum, s) => sum + s.focusRating, 0) / subjectSessions.length 
      : 0;
    const avgDistraction = subjectSessions.length > 0
      ? subjectSessions.reduce((sum, s) => sum + s.distractionRating, 0) / subjectSessions.length
      : 0;

    return {
      ...subject,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      sessionCount: subjectSessions.length,
      avgFocus: Math.round(avgFocus * 10) / 10,
      avgDistraction: Math.round(avgDistraction * 10) / 10
    };
  }).filter(s => s.sessionCount > 0).sort((a, b) => b.totalHours - a.totalHours);

  // Daily breakdown for the current week
  const getDailyBreakdown = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const today = new Date();
    const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
    
    return days.map((day, index) => {
      const currentDay = new Date(startOfWeek);
      currentDay.setDate(startOfWeek.getDate() + index);
      
      const daySessions = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.toDateString() === currentDay.toDateString();
      });
      
      const totalMinutes = daySessions.reduce((sum, s) => sum + s.duration, 0);
      
      return {
        day,
        date: currentDay.getDate(),
        hours: Math.round((totalMinutes / 60) * 10) / 10,
        sessions: daySessions.length
      };
    });
  };

  const dailyData = getDailyBreakdown();
  const maxDailyHours = Math.max(...dailyData.map(d => d.hours), 1);

  // Mood and focus trends
  const getTrends = () => {
    if (sessions.length === 0) return { moodImprovement: 0, focusTrend: 0 };
    
    const recentSessions = sessions.slice(0, 10);
    const moodImprovements = recentSessions.map(s => s.moodAfter - s.moodBefore);
    const avgMoodImprovement = moodImprovements.reduce((sum, imp) => sum + imp, 0) / moodImprovements.length;
    
    const focuses = recentSessions.map(s => s.focusRating);
    const firstHalf = focuses.slice(0, Math.floor(focuses.length / 2));
    const secondHalf = focuses.slice(Math.floor(focuses.length / 2));
    const focusTrend = secondHalf.reduce((sum, f) => sum + f, 0) / secondHalf.length - 
                      firstHalf.reduce((sum, f) => sum + f, 0) / firstHalf.length;

    return {
      moodImprovement: Math.round(avgMoodImprovement * 10) / 10,
      focusTrend: Math.round(focusTrend * 10) / 10
    };
  };

  const trends = getTrends();

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600">
          Insights into your study patterns and productivity
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.reduce((sum, s) => sum + s.duration, 0) / 60}h
            </div>
            <p className="text-xs text-muted-foreground">
              Across {sessions.length} sessions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Focus</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {sessions.length > 0 
                ? Math.round((sessions.reduce((sum, s) => sum + s.focusRating, 0) / sessions.length) * 10) / 10
                : 0}/10
            </div>
            <p className="text-xs text-muted-foreground">
              {trends.focusTrend >= 0 ? '📈' : '📉'} 
              {trends.focusTrend >= 0 ? '+' : ''}{trends.focusTrend} recent trend
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mood Improvement</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {trends.moodImprovement >= 0 ? '+' : ''}{trends.moodImprovement}
            </div>
            <p className="text-xs text-muted-foreground">
              Average per session
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.totalHours}h</div>
            <p className="text-xs text-muted-foreground">
              {weeklyStats.totalSessions} sessions
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="subjects" className="space-y-6">
        <TabsList>
          <TabsTrigger value="subjects">By Subject</TabsTrigger>
          <TabsTrigger value="daily">Daily Breakdown</TabsTrigger>
          <TabsTrigger value="patterns">Study Patterns</TabsTrigger>
        </TabsList>

        <TabsContent value="subjects" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Subject Performance</CardTitle>
              <CardDescription>
                Time spent and effectiveness by subject
              </CardDescription>
            </CardHeader>
            <CardContent>
              {subjectStats.length > 0 ? (
                <div className="space-y-4">
                  {subjectStats.map((subject) => (
                    <div key={subject.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full"
                            style={{ backgroundColor: subject.color }}
                          />
                          <span className="font-medium">{subject.name}</span>
                          <Badge variant="outline">{subject.sessionCount} sessions</Badge>
                        </div>
                        <span className="text-sm font-medium">{subject.totalHours}h</span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 ml-7">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Focus:</span>
                          <span className="font-medium">{subject.avgFocus}/10</span>
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Distraction:</span>
                          <span className="font-medium">{subject.avgDistraction}/10</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No study sessions yet. Start tracking to see insights!</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="daily" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>This Week's Study Pattern</CardTitle>
              <CardDescription>
                Daily study hours and session count
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dailyData.map((day) => (
                  <div key={day.day} className="flex items-center space-x-4">
                    <div className="w-12 text-sm font-medium text-gray-600">
                      {day.day}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <div 
                          className="bg-blue-500 h-4 rounded"
                          style={{ 
                            width: `${(day.hours / maxDailyHours) * 100}%`,
                            minWidth: day.hours > 0 ? '8px' : '0px'
                          }}
                        />
                        <span className="text-sm font-medium">{day.hours}h</span>
                        {day.sessions > 0 && (
                          <Badge variant="outline" className="text-xs">
                            {day.sessions} sessions
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="patterns" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distraction Analysis</CardTitle>
                <CardDescription>
                  Most common distractions in your sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(
                      sessions.reduce((acc, session) => {
                        const source = session.distractionSource || 'Not specified';
                        acc[source] = (acc[source] || 0) + 1;
                        return acc;
                      }, {})
                    )
                    .sort(([,a], [,b]) => b - a)
                    .slice(0, 5)
                    .map(([source, count]) => (
                      <div key={source} className="flex items-center justify-between">
                        <span className="text-sm">{source}</span>
                        <Badge variant="outline">{count} times</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Zap className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p>No data yet</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Study Effectiveness</CardTitle>
                <CardDescription>
                  Correlation between mood and focus
                </CardDescription>
              </CardHeader>
              <CardContent>
                {sessions.length > 0 ? (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {Math.round((sessions.reduce((sum, s) => sum + s.focusRating, 0) / sessions.length) * 10) / 10}
                      </div>
                      <p className="text-sm text-gray-600">Average Focus Score</p>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Best focus sessions:</span>
                        <span className="font-medium">
                          {sessions.filter(s => s.focusRating >= 8).length} sessions
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Low distraction:</span>
                        <span className="font-medium">
                          {sessions.filter(s => s.distractionRating <= 3).length} sessions
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Mood improvement:</span>
                        <span className="font-medium">
                          {sessions.filter(s => s.moodAfter > s.moodBefore).length} sessions
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    <Target className="h-6 w-6 mx-auto mb-2 opacity-50" />
                    <p>No data yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analytics;