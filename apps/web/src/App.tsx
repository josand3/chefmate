import React, { useEffect, useState } from 'react'
import { useAppStore } from './store/useAppStore'
import { ProfileSetup } from './components/figma/ProfileSetup'
import { SimpleChatInterface } from './components/figma/SimpleChatInterface'

interface UserProfile {
  cuisinePreferences: string[];
  dietaryNeeds: string[];
  skillLevel: string;
  location: string;
}

function Shell() {
  const hasOnboarded = useAppStore((s) => s.hasOnboarded)
  const onboarding = useAppStore((s) => s.onboarding)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  
  useEffect(() => {
    if (hasOnboarded) {
      const reverseExperienceMapping: { [key: string]: string } = {
        'beginner': 'stage',
        'prep cook': 'line-cook',
        'sous chef': 'sous-chef',
        'executive chef': 'executive-chef'
      };
      
      setUserProfile({
        cuisinePreferences: onboarding.cuisines,
        dietaryNeeds: onboarding.dietaryPrefs,
        skillLevel: reverseExperienceMapping[onboarding.experience] || onboarding.experience,
        location: onboarding.zipCode
      });
    }
  }, [hasOnboarded, onboarding]);

  const handleProfileComplete = (profile: any) => {
    const { setOnboarding, completeOnboarding } = useAppStore.getState();
    
    const experienceMapping: { [key: string]: string } = {
      'stage': 'beginner',
      'line-cook': 'prep cook',
      'sous-chef': 'sous chef',
      'executive-chef': 'executive chef'
    };
    
    setOnboarding({
      zipCode: profile.location || '',
      dietaryPrefs: profile.dietaryNeeds || [],
      cuisines: profile.cuisinePreferences || [],
      experience: experienceMapping[profile.skillLevel] || profile.skillLevel || ''
    });
    completeOnboarding();
    setUserProfile(profile);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-100">
      {!hasOnboarded ? (
        <ProfileSetup onComplete={handleProfileComplete} userId="current-user" />
      ) : (
        <SimpleChatInterface userProfile={userProfile!} userId="current-user" />
      )}
    </div>
  );
}

export default function App() {
  return <Shell />
}
