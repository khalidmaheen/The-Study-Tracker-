import React, { useState, useEffect } from 'react';
import { useStudy } from '../contexts/StudyContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Badge } from '../components/ui/badge';
import { 
  Play, 
  Square, 
  Clock, 
  Brain, 
  Zap, 
  Smile,
  Frown,
  Meh 
} from 'lucide-react';
import { useToast } from '../hooks/use-toast';

const StudySession = () => {
  const { 
    subjects, 
    activeSession, 
    startSession, 
    endSession, 
    cancelSession,
    distractionSources 
  } = useStudy();
  const { toast } = useToast();

  const [selectedSubject, setSelectedSubject] = useState('');
  const [timer, setTimer] = useState(0);
  const [sessionData, setSessionData] = useState({
    moodBefore: 5,
    moodAfter: 5,
    focusRating: 5,
    distractionRating: 5,
    notes: '',
    distractionSource: ''
  });

  // Timer effect
  useEffect(() => {
    let interval;
    if (activeSession) {
      interval = setInterval(() => {
        const elapsed = Math.floor((new Date() - new Date(activeSession.startTime)) / 1000);
        setTimer(elapsed);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [activeSession]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartSession = () => {
    if (!selectedSubject) {
      toast({
        title: "Select a subject",
        description: "Please choose a subject before starting your session.",
        variant: "destructive"
      });
      return;
    }

    const session = startSession(selectedSubject);
    setTimer(0);
    toast({
      title: "Session started!",
      description: "Focus mode activated. You've got this! 💪",
    });
  };

  const handleEndSession = () => {
    if (!activeSession) return;

    const completedSession = endSession(sessionData);
    setTimer(0);
    setSessionData({
      moodBefore: 5,
      moodAfter: 5,
      focusRating: 5,
      distractionRating: 5,
      notes: '',
      distractionSource: ''
    });

    const duration = Math.round(completedSession.duration / 60 * 10) / 10;
    toast({
      title: "Session completed! 🎉",
      description: `Great work! You studied for ${duration} hours.`,
    });
  };

  const handleCancelSession = () => {
    cancelSession();
    setTimer(0);
    toast({
      title: "Session cancelled",
      description: "No worries, take a break and come back when ready!",
    });
  };

  const getMoodIcon = (mood) => {
    if (mood <= 3) return <Frown className="h-4 w-4" />;
    if (mood <= 7) return <Meh className="h-4 w-4" />;
    return <Smile className="h-4 w-4" />;
  };

  const getSelectedSubject = () => {
    return subjects.find(s => s.id === selectedSubject);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Study Session</h1>
        <p className="text-gray-600">
          Track your focus, mood, and productivity in real-time
        </p>
      </div>

      {!activeSession ? (
        /* Session Setup */
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Start a New Session</CardTitle>
            <CardDescription>
              Choose your subject and set your intentions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select onValueChange={setSelectedSubject} value={selectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a subject to study" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      <div className="flex items-center space-x-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subject.color }}
                        />
                        <span>{subject.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Mood Before Studying</Label>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">😔</span>
                <Slider
                  value={[sessionData.moodBefore]}
                  onValueChange={([value]) => setSessionData({...sessionData, moodBefore: value})}
                  max={10}
                  min={1}
                  step={1}
                  className="flex-1"
                />
                <span className="text-sm text-gray-500">😊</span>
                <Badge variant="outline">{sessionData.moodBefore}/10</Badge>
              </div>
            </div>

            <Button 
              onClick={handleStartSession}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
              disabled={!selectedSubject}
            >
              <Play className="h-4 w-4 mr-2" />
              Start Study Session
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Active Session */
        <div className="space-y-6">
          {/* Timer and Subject */}
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center space-x-3">
                  <div 
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: getSelectedSubject()?.color }}
                  />
                  <h2 className="text-2xl font-bold text-gray-900">
                    {getSelectedSubject()?.name}
                  </h2>
                </div>
                
                <div className="text-6xl font-mono font-bold text-gray-900">
                  {formatTime(timer)}
                </div>
                
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Session in progress...</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Session Feedback */}
          <Card>
            <CardHeader>
              <CardTitle>How's it going?</CardTitle>
              <CardDescription>
                Rate your session so far - this helps track your patterns
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-4 w-4" />
                    <Label>Focus Level</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">Low</span>
                    <Slider
                      value={[sessionData.focusRating]}
                      onValueChange={([value]) => setSessionData({...sessionData, focusRating: value})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">High</span>
                    <Badge variant="outline">{sessionData.focusRating}/10</Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Zap className="h-4 w-4" />
                    <Label>Distraction Level</Label>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">None</span>
                    <Slider
                      value={[sessionData.distractionRating]}
                      onValueChange={([value]) => setSessionData({...sessionData, distractionRating: value})}
                      max={10}
                      min={1}
                      step={1}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500">High</span>
                    <Badge variant="outline">{sessionData.distractionRating}/10</Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Main Distraction Source</Label>
                <Select 
                  onValueChange={(value) => setSessionData({...sessionData, distractionSource: value})}
                  value={sessionData.distractionSource}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="What's distracting you?" />
                  </SelectTrigger>
                  <SelectContent>
                    {distractionSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* End Session */}
          <Card>
            <CardHeader>
              <CardTitle>Ready to wrap up?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  {getMoodIcon(sessionData.moodAfter)}
                  <Label>Mood After Studying</Label>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-500">😔</span>
                  <Slider
                    value={[sessionData.moodAfter]}
                    onValueChange={([value]) => setSessionData({...sessionData, moodAfter: value})}
                    max={10}
                    min={1}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-500">😊</span>
                  <Badge variant="outline">{sessionData.moodAfter}/10</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Session Notes</Label>
                <Textarea
                  placeholder="What did you work on? Any insights or struggles?"
                  value={sessionData.notes}
                  onChange={(e) => setSessionData({...sessionData, notes: e.target.value})}
                  rows={3}
                />
              </div>

              <div className="flex space-x-4">
                <Button 
                  onClick={handleEndSession}
                  className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
                >
                  <Square className="h-4 w-4 mr-2" />
                  End Session
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleCancelSession}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default StudySession;