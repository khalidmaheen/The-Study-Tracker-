import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { 
  Target, 
  Clock, 
  Plus, 
  Trash2, 
  TrendingUp,
  CheckCircle,
  Circle
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Goals = () => {
  const { goals, subjects, updateGoals, getWeeklyStats } = useStudy();
  const { toast } = useToast();
  const [isEditing, setIsEditing] = useState(false);
  const [newGoals, setNewGoals] = useState(goals || { dailyStudyTime: 4, weeklySubjectGoals: [] });

  const weeklyStats = getWeeklyStats();

  const handleSaveGoals = () => {
    updateGoals(newGoals);
    setIsEditing(false);
    toast({
      title: "Goals updated!",
      description: "Your study targets have been saved.",
    });
  };

  const addSubjectGoal = (subjectId) => {
    setNewGoals({
      ...newGoals,
      weeklySubjectGoals: [
        ...newGoals.weeklySubjectGoals,
        { subjectId, targetHours: 5 }
      ]
    });
  };

  const removeSubjectGoal = (subjectId) => {
    setNewGoals({
      ...newGoals,
      weeklySubjectGoals: newGoals.weeklySubjectGoals.filter(g => g.subjectId !== subjectId)
    });
  };

  const updateSubjectGoal = (subjectId, targetHours) => {
    setNewGoals({
      ...newGoals,
      weeklySubjectGoals: newGoals.weeklySubjectGoals.map(g => 
        g.subjectId === subjectId ? { ...g, targetHours: parseInt(targetHours) } : g
      )
    });
  };

  const getSubjectById = (id) => subjects.find(s => s.id === id);

  // Calculate daily progress
  const todaySessions = weeklyStats.sessions.filter(session => {
    const today = new Date().toDateString();
    const sessionDate = new Date(session.startTime).toDateString();
    return today === sessionDate;
  });

  const todayHours = todaySessions.reduce((sum, session) => sum + session.duration, 0) / 60;
  const dailyProgress = goals ? (todayHours / goals.dailyStudyTime) * 100 : 0;

  // Calculate weekly subject progress
  const subjectProgressData = (goals?.weeklySubjectGoals || []).map(goal => {
    const subject = getSubjectById(goal.subjectId);
    const weekSessions = weeklyStats.sessions.filter(s => s.subjectId === goal.subjectId);
    const actualHours = weekSessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    const progress = (actualHours / goal.targetHours) * 100;

    return {
      ...goal,
      subject,
      actualHours: Math.round(actualHours * 10) / 10,
      progress: Math.min(progress, 100),
      completed: actualHours >= goal.targetHours
    };
  });

  const completedGoals = subjectProgressData.filter(g => g.completed).length;
  const totalGoals = subjectProgressData.length;

  const availableSubjects = subjects.filter(subject => 
    !newGoals.weeklySubjectGoals.find(g => g.subjectId === subject.id)
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Study Goals</h1>
          <p className="text-gray-600">
            Set targets and track your progress
          </p>
        </div>
        <Button
          onClick={() => isEditing ? handleSaveGoals() : setIsEditing(true)}
          variant={isEditing ? "default" : "outline"}
        >
          {isEditing ? 'Save Goals' : 'Edit Goals'}
        </Button>
      </div>

      {/* Daily Goal Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Daily Study Goal</span>
              </CardTitle>
              <CardDescription>
                {todayHours.toFixed(1)}h of {goals?.dailyStudyTime || 0}h completed today
              </CardDescription>
            </div>
            {dailyProgress >= 100 && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                Completed!
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-2">
              <Label htmlFor="daily-goal">Daily Study Time (hours)</Label>
              <Input
                id="daily-goal"
                type="number"
                value={newGoals.dailyStudyTime}
                onChange={(e) => setNewGoals({...newGoals, dailyStudyTime: parseInt(e.target.value)})}
                min="1"
                max="12"
                className="w-32"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <Progress value={Math.min(dailyProgress, 100)} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{Math.round(dailyProgress)}% complete</span>
                <span>{Math.max(0, (goals?.dailyStudyTime || 0) - todayHours).toFixed(1)}h remaining</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Weekly Subject Goals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Weekly Subject Goals</span>
              </CardTitle>
              <CardDescription>
                {completedGoals} of {totalGoals} goals completed this week
              </CardDescription>
            </div>
            {!isEditing && completedGoals === totalGoals && totalGoals > 0 && (
              <Badge className="bg-green-100 text-green-800">
                <CheckCircle className="h-3 w-3 mr-1" />
                All Goals Met!
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-6">
              {/* Existing Goals */}
              <div className="space-y-4">
                {newGoals.weeklySubjectGoals.map((goal) => {
                  const subject = getSubjectById(goal.subjectId);
                  return (
                    <div key={goal.subjectId} className="flex items-center space-x-4 p-3 border rounded-lg">
                      <div className="flex items-center space-x-2 flex-1">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject?.color }}
                        />
                        <span className="font-medium">{subject?.name}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="number"
                          value={goal.targetHours}
                          onChange={(e) => updateSubjectGoal(goal.subjectId, e.target.value)}
                          min="1"
                          max="20"
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">hours/week</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSubjectGoal(goal.subjectId)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Add New Goals */}
              {availableSubjects.length > 0 && (
                <div className="space-y-3">
                  <Label>Add Subject Goals</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {availableSubjects.map((subject) => (
                      <Button
                        key={subject.id}
                        variant="outline"
                        size="sm"
                        onClick={() => addSubjectGoal(subject.id)}
                        className="justify-start"
                      >
                        <Plus className="h-3 w-3 mr-2" />
                        <div 
                          className="w-2 h-2 rounded-full mr-2"
                          style={{ backgroundColor: subject.color }}
                        />
                        {subject.name}
                      </Button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {subjectProgressData.length > 0 ? (
                subjectProgressData.map((goalData) => (
                  <div key={goalData.subjectId} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: goalData.subject?.color }}
                        />
                        <span className="font-medium">{goalData.subject?.name}</span>
                        {goalData.completed && (
                          <Badge variant="outline" className="text-green-600 border-green-200">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Completed
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm text-gray-600">
                        {goalData.actualHours}h / {goalData.targetHours}h
                      </span>
                    </div>
                    <Progress value={goalData.progress} className="h-2" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Target className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No weekly goals set. Click "Edit Goals" to get started!</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Goal Insights */}
      {!isEditing && subjectProgressData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>This Week's Insights</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{weeklyStats.totalHours}h</div>
                <p className="text-sm text-gray-600">Total Study Time</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completedGoals}</div>
                <p className="text-sm text-gray-600">Goals Completed</p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{weeklyStats.totalSessions}</div>
                <p className="text-sm text-gray-600">Study Sessions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Goals;