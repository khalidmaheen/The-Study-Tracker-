import React, { useState } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { 
  BookOpen, 
  Plus, 
  Palette,
  Calculator,
  Microscope,
  Atom,
  Languages,
  Clock,
  Globe,
  Edit
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const Subjects = () => {
  const { subjects, addCustomSubject, sessions } = useStudy();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    color: '#3B82F6',
    icon: 'BookOpen'
  });

  const iconOptions = [
    { name: 'BookOpen', icon: BookOpen, label: 'Book' },
    { name: 'Calculator', icon: Calculator, label: 'Calculator' },
    { name: 'Microscope', icon: Microscope, label: 'Microscope' },
    { name: 'Atom', icon: Atom, label: 'Atom' },
    { name: 'Languages', icon: Languages, label: 'Languages' },
    { name: 'Clock', icon: Clock, label: 'History' },
    { name: 'Globe', icon: Globe, label: 'Geography' },
    { name: 'Edit', icon: Edit, label: 'Writing' }
  ];

  const colorOptions = [
    '#3B82F6', '#10B981', '#F59E0B', '#EF4444', 
    '#8B5CF6', '#F97316', '#06B6D4', '#84CC16',
    '#EC4899', '#6366F1', '#14B8A6', '#F97316'
  ];

  const handleAddSubject = () => {
    if (!newSubject.name.trim()) {
      toast({
        title: "Subject name required",
        description: "Please enter a name for your subject.",
        variant: "destructive"
      });
      return;
    }

    addCustomSubject(newSubject.name, newSubject.color, newSubject.icon);
    setNewSubject({ name: '', color: '#3B82F6', icon: 'BookOpen' });
    setIsAdding(false);
    
    toast({
      title: "Subject added!",
      description: `${newSubject.name} has been added to your subjects.`,
    });
  };

  const getSubjectStats = (subjectId) => {
    const subjectSessions = sessions.filter(s => s.subjectId === subjectId);
    const totalMinutes = subjectSessions.reduce((sum, s) => sum + s.duration, 0);
    const avgFocus = subjectSessions.length > 0 
      ? subjectSessions.reduce((sum, s) => sum + s.focusRating, 0) / subjectSessions.length 
      : 0;

    return {
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      sessionCount: subjectSessions.length,
      avgFocus: Math.round(avgFocus * 10) / 10
    };
  };

  const getIconComponent = (iconName) => {
    const iconOption = iconOptions.find(opt => opt.name === iconName);
    return iconOption ? iconOption.icon : BookOpen;
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Subjects</h1>
          <p className="text-gray-600">
            Manage your study subjects and track performance
          </p>
        </div>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subject
        </Button>
      </div>

      {/* Add New Subject */}
      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Subject</CardTitle>
            <CardDescription>
              Create a custom subject for your studies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="subject-name">Subject Name</Label>
              <Input
                id="subject-name"
                placeholder="e.g., Advanced Programming, Art History"
                value={newSubject.name}
                onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label>Choose Color</Label>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setNewSubject({...newSubject, color})}
                    className={`w-8 h-8 rounded-full border-2 ${
                      newSubject.color === color ? 'border-gray-800' : 'border-gray-200'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Choose Icon</Label>
              <div className="grid grid-cols-4 gap-2">
                {iconOptions.map((option) => {
                  const IconComponent = option.icon;
                  return (
                    <button
                      key={option.name}
                      onClick={() => setNewSubject({...newSubject, icon: option.name})}
                      className={`p-3 rounded-lg border-2 flex flex-col items-center space-y-1 transition-colors ${
                        newSubject.icon === option.name 
                          ? 'border-blue-500 bg-blue-50' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <IconComponent className="h-5 w-5" />
                      <span className="text-xs">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleAddSubject} className="flex-1">
                Add Subject
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsAdding(false)}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subjects.map((subject) => {
          const stats = getSubjectStats(subject.id);
          const IconComponent = getIconComponent(subject.icon);
          
          return (
            <Card key={subject.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${subject.color}15` }}
                  >
                    <IconComponent 
                      className="h-6 w-6" 
                      style={{ color: subject.color }}
                    />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{subject.name}</CardTitle>
                    {subject.isCustom && (
                      <Badge variant="outline" className="text-xs">Custom</Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: subject.color }}>
                        {stats.totalHours}h
                      </div>
                      <p className="text-xs text-gray-600">Total Time</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold" style={{ color: subject.color }}>
                        {stats.sessionCount}
                      </div>
                      <p className="text-xs text-gray-600">Sessions</p>
                    </div>
                  </div>
                  
                  {stats.sessionCount > 0 && (
                    <div className="pt-3 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Avg Focus:</span>
                        <Badge variant="outline">{stats.avgFocus}/10</Badge>
                      </div>
                    </div>
                  )}
                  
                  {stats.sessionCount === 0 && (
                    <div className="text-center py-4 text-gray-500">
                      <p className="text-sm">No sessions yet</p>
                      <p className="text-xs">Start studying to see stats!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Subject Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Subject Performance Summary</CardTitle>
          <CardDescription>
            Overview of your study time across all subjects
          </CardDescription>
        </CardHeader>
        <CardContent>
          {subjects.some(s => getSubjectStats(s.id).sessionCount > 0) ? (
            <div className="space-y-4">
              {subjects
                .map(subject => ({ ...subject, stats: getSubjectStats(subject.id) }))
                .filter(s => s.stats.sessionCount > 0)
                .sort((a, b) => b.stats.totalHours - a.stats.totalHours)
                .map((subject) => {
                  const IconComponent = getIconComponent(subject.icon);
                  const maxHours = Math.max(...subjects.map(s => getSubjectStats(s.id).totalHours));
                  const widthPercentage = maxHours > 0 ? (subject.stats.totalHours / maxHours) * 100 : 0;
                  
                  return (
                    <div key={subject.id} className="flex items-center space-x-4">
                      <div className="flex items-center space-x-3 w-40">
                        <IconComponent 
                          className="h-5 w-5" 
                          style={{ color: subject.color }}
                        />
                        <span className="font-medium text-sm">{subject.name}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <div className="flex-1 bg-gray-100 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full transition-all duration-300"
                              style={{ 
                                backgroundColor: subject.color,
                                width: `${widthPercentage}%`
                              }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12 text-right">
                            {subject.stats.totalHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No study sessions recorded yet</p>
              <p className="text-sm">Start your first session to see performance data!</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subjects;