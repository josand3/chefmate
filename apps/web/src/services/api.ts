import { useAppStore } from '../store/useAppStore'

export const apiAdapter = {
  async saveProfile(userId: string, profile: any) {
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
    return { ok: true };
  },
  
  async loadProfile(userId: string) {
    const { onboarding, hasOnboarded } = useAppStore.getState();
    if (!hasOnboarded) return { profile: null };
    
    const reverseExperienceMapping: { [key: string]: string } = {
      'beginner': 'stage',
      'prep cook': 'line-cook',
      'sous chef': 'sous-chef',
      'executive chef': 'executive-chef'
    };
    
    return {
      profile: {
        cuisinePreferences: onboarding.cuisines,
        dietaryNeeds: onboarding.dietaryPrefs,
        skillLevel: reverseExperienceMapping[onboarding.experience] || onboarding.experience,
        location: onboarding.zipCode
      }
    };
  }
};
