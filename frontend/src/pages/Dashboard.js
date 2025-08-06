import React from 'react';
import { useStudy } from '../contexts/StudyContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Button } from '../components/ui/button';
import { 
  Clock, 
  Target, 
  TrendingUp, 
  BookOpen, 
  Play,
  Brain,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const { sessions, subjects, goals, getWeeklyStats } = useStudy();
  const weeklyStats = getWeeklyStats();

  const getSubjectById = (id) => subjects.find(s => s.id === id);

  const todaySessions = sessions.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.startTime).toDateString();
    return today === sessionDate;
  });

  const todayHours = todaySessions.reduce((sum, session) => sum + session.duration, 0) / 60;
  const dailyGoalProgress = goals ? (todayHours / goals.dailyStudyTime) * 100 : 0;

  const recentSessions = sessions.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-gray-600">
          Ready to crush your study goals today?
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Study Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayHours.toFixed(1)}h</div>
            <div className="text-xs text-muted-foreground">
              Goal: {goals?.dailyStudyTime || 0}h
            </div>
            <Progress value={Math.min(dailyGoalProgress, 100)} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.totalHours}h</div>
            <div className="text-xs text-muted-foreground">
              {weeklyStats.totalSessions} sessions
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Focus Score</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.averageFocus}/10</div>
            <div className="text-xs text-muted-foreground">
              Weekly average
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Distraction Level</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{weeklyStats.averageDistraction}/10</div>
            <div className="text-xs text-muted-foreground">
              Lower is better
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Jump right into your study session</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Link to="/session">
              <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                <Play className="h-4 w-4 mr-2" />
                Start Study Session
              </Button>
            </Link>
            <Link to="/goals">
              <Button variant="outline">
                <Target className="h-4 w-4 mr-2" />
                View Goals
              </Button>
            </Link>
            <Link to="/analytics">
              <Button variant="outline">
                <TrendingUp className="h-4 w-4 mr-2" />
                Check Analytics
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Recent Sessions & Subject Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Sessions</CardTitle>
            <CardDescription>Your latest study sessions</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSessions.length > 0 ? (
              <div className="space-y-4">
                {recentSessions.map((session) => {
                  const subject = getSubjectById(session.subjectId);
                  return (
                    <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject?.color }}
                        />
                        <div>
                          <p className="font-medium text-sm">{subject?.name}</p>
                          <p className="text-xs text-gray-500">
                            {Math.round(session.duration / 60 * 10) / 10}h • Focus: {session.focusRating}/10
                          </p>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(session.startTime).toLocaleDateString()}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No sessions yet. Start your first study session!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Weekly Subject Goals */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Subject Goals</CardTitle>
            <CardDescription>Track your progress by subject</CardDescription>
          </CardHeader>
          <CardContent>
            {goals?.weeklySubjectGoals ? (
              <div className="space-y-4">
                {goals.weeklySubjectGoals.map((goal) => {
                  const subject = getSubjectById(goal.subjectId);
                  const weekSessions = weeklyStats.sessions.filter(s => s.subjectId === goal.subjectId);
                  const actualHours = weekSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
                  const progress = (actualHours / goal.targetHours) * 100;

                  return (
                    <div key={goal.subjectId} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{subject?.name}</span>
                        <span className="text-gray-500">
                          {actualHours.toFixed(1)}h / {goal.targetHours}h
                        </span>
                      </div>
                      <Progress value={Math.min(progress, 100)} className="h-2" />
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Set up your weekly goals to track progress!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;