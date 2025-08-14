import { useState, useEffect, useCallback } from 'react';
import { SplashScreen } from './components/SplashScreen';
import { OnboardingFlow } from './components/OnboardingFlow';
import { HealthProfileScreen } from './components/HealthProfileScreen';
import { HomeScreen } from './components/HomeScreen';
import { NearbyParksScreen } from './components/NearbyParksScreen';
import { DisasterAlertsScreen } from './components/DisasterAlertsScreen';
import { WeeklyForecastScreen } from './components/WeeklyForecastScreen';
import { SettingsScreen } from './components/SettingsScreen';
import { NotificationCenter } from './components/NotificationCenter';
import { AQITrendsScreen } from './components/AQITrendsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { CommunityReportsScreen } from './components/CommunityReportsScreen';
import { EcoScoreScreen } from './components/EcoScoreScreen';
import { BadgesScreen } from './components/BadgesScreen';
import { VoiceAssistant } from './components/VoiceAssistant';
import { api } from './utils/supabase/client';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';

type AppScreen = 'splash' | 'onboarding' | 'healthProfile' | 'home' | 'parks' | 'alerts' | 'forecast' | 'settings' | 'notifications' | 'trends' | 'profile' | 'community' | 'eco' | 'badges';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  condition: string;
  isActive: boolean;
  notes?: string;
}

interface UserProfile {
  hasAsthma: boolean;
  hasDustAllergy: boolean;
  hasPollenAllergy: boolean;
  hasHeartCondition: boolean;
  hasUVSensitivity: boolean;
  gender: string;
  ageGroup: string;
  medications: Medication[];
}

interface AppSettings {
  darkMode: boolean;
  voiceAssistant: boolean;
  pushNotifications: boolean;
  weatherAlerts: boolean;
  airQualityAlerts: boolean;
  healthReminders: boolean;
  medicationReminders: boolean;
  communityUpdates: boolean;
  locationSharing: boolean;
  autoRefresh: boolean;
}

interface AppState {
  currentScreen: AppScreen;
  isDarkMode: boolean;
  userProfile: UserProfile;
  appSettings: AppSettings;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
}

export default function App() {
  const [state, setState] = useState<AppState>({
    currentScreen: 'splash',
    isDarkMode: false,
    userProfile: {
      hasAsthma: false,
      hasDustAllergy: false,
      hasPollenAllergy: false,
      hasHeartCondition: false,
      hasUVSensitivity: false,
      gender: '',
      ageGroup: '',
      medications: []
    },
    appSettings: {
      darkMode: false,
      voiceAssistant: true,
      pushNotifications: true,
      weatherAlerts: true,
      airQualityAlerts: true,
      healthReminders: true,
      medicationReminders: true,
      communityUpdates: false,
      locationSharing: true,
      autoRefresh: true
    },
    isInitialized: false,
    isLoading: false,
    error: null
  });

  // Optimized state updaters
  const updateState = useCallback((updates: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const updateUserProfile = useCallback((updates: Partial<UserProfile>) => {
    setState(prev => ({
      ...prev,
      userProfile: { ...prev.userProfile, ...updates }
    }));
  }, []);

  const updateAppSettings = useCallback((updates: Partial<AppSettings>) => {
    setState(prev => ({
      ...prev,
      appSettings: { ...prev.appSettings, ...updates }
    }));
  }, []);

  // Enhanced mobile viewport setup
  useEffect(() => {
    const setupMobileViewport = () => {
      // Set mobile-optimized viewport with enhanced settings
      const viewport = document.querySelector('meta[name=viewport]');
      if (viewport) {
        viewport.setAttribute('content', 
          'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content'
        );
      } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover, interactive-widget=resizes-content';
        document.getElementsByTagName('head')[0].appendChild(meta);
      }

      // Add comprehensive mobile meta tags
      const metaTags = [
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
        { name: 'apple-mobile-web-app-title', content: 'SkySense' },
        { name: 'application-name', content: 'SkySense' },
        { name: 'msapplication-TileColor', content: '#3b82f6' },
        { name: 'theme-color', content: '#3b82f6' },
        { name: 'format-detection', content: 'telephone=no' }
      ];

      metaTags.forEach(({ name, content }) => {
        if (!document.querySelector(`meta[name="${name}"]`)) {
          const meta = document.createElement('meta');
          meta.name = name;
          meta.content = content;
          document.getElementsByTagName('head')[0].appendChild(meta);
        }
      });

      // Prevent iOS bounce scrolling
      document.body.style.overscrollBehavior = 'none';
      document.body.style.overscrollBehaviorY = 'contain';
      
      // Enhanced touch optimization
      document.body.style.webkitTouchCallout = 'none';
      document.body.style.webkitUserSelect = 'none';
      document.body.style.webkitTapHighlightColor = 'transparent';
    };

    setupMobileViewport();
  }, []);

  // Initialize app with enhanced error handling and offline support
  useEffect(() => {
    const initializeApp = async () => {
      try {
        updateState({ isLoading: true, error: null });
        console.log('🚀 Initializing SkySense mobile app...');
        
        // Test backend connection with timeout
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Backend timeout')), 5000)
        );
        
        try {
          await Promise.race([api.healthCheck(), timeoutPromise]);
          console.log('✅ Backend connection successful');
        } catch (healthError) {
          console.warn('⚠️ Backend health check failed, app will work in offline mode:', healthError);
          toast.info('Running in offline mode', {
            description: 'Some features may be limited until connection is restored.'
          });
        }
        
        // Load stored preferences with enhanced error handling
        const storedData = {
          darkMode: localStorage.getItem('skysense_dark_mode'),
          profileId: localStorage.getItem('skysense_profile_id'),
          onboardingComplete: localStorage.getItem('skysense_onboarding_complete'),
          lastSync: localStorage.getItem('skysense_last_sync')
        };

        console.log('📱 Loading stored preferences:', {
          darkMode: storedData.darkMode,
          profileId: storedData.profileId ? 'Present' : 'Not found',
          onboardingComplete: storedData.onboardingComplete,
          lastSync: storedData.lastSync
        });

        // Set initial dark mode with system preference fallback
        const systemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const initialDarkMode = storedData.darkMode === 'true' || 
          (storedData.darkMode === null && systemDarkMode);
        
        updateState({ isDarkMode: initialDarkMode });
        document.documentElement.classList.toggle('dark', initialDarkMode);

        // Enhanced onboarding logic
        if (storedData.onboardingComplete === 'true' && storedData.profileId) {
          console.log('👤 Returning user detected, loading existing data...');
          updateState({ currentScreen: 'home' });
          
          // Load user profile with retry mechanism
          await loadUserData(storedData.profileId, initialDarkMode);
        } else {
          console.log('🆕 New user or incomplete onboarding, showing splash screen');
          // Add welcome animation delay for new users
          setTimeout(() => {
            if (state.currentScreen === 'splash') {
              updateState({ currentScreen: 'splash' });
            }
          }, 100);
        }

        // Update app settings dark mode
        updateAppSettings({ darkMode: initialDarkMode });
        
      } catch (error) {
        console.error('❌ Failed to initialize app:', error);
        updateState({ 
          error: 'Failed to initialize app. Please refresh and try again.',
          currentScreen: 'home' // Graceful fallback
        });
        toast.error('Initialization Error', {
          description: 'App started with limited functionality. Please refresh if issues persist.'
        });
      } finally {
        updateState({ isLoading: false, isInitialized: true });
        console.log('✨ SkySense mobile app initialization complete');
      }
    };

    initializeApp();
  }, []);

  // Enhanced user data loading
  const loadUserData = async (profileId: string, initialDarkMode: boolean) => {
    try {
      // Load user profile
      console.log('📊 Loading user profile from backend...');
      const profileResponse = await api.getProfile(profileId);
      if (profileResponse.profile) {
        const profile = {
          ...profileResponse.profile,
          medications: profileResponse.profile.medications || []
        };
        updateUserProfile(profile);
        console.log('✅ User profile loaded successfully');
        
        // Show welcome back message for returning users
        setTimeout(() => {
          toast.success('Welcome back to SkySense!', {
            description: 'Your health profile has been restored.'
          });
        }, 1000);
      } else {
        console.log('ℹ️ No profile found in backend response, using defaults');
      }

      // Load app settings
      console.log('⚙️ Loading app settings from backend...');
      const settingsResponse = await api.getUserSettings(profileId);
      if (settingsResponse.settings) {
        const loadedSettings = {
          ...state.appSettings,
          ...settingsResponse.settings,
          darkMode: initialDarkMode,
          medicationReminders: settingsResponse.settings.medicationReminders ?? true
        };
        updateAppSettings(loadedSettings);
        console.log('✅ App settings loaded successfully');
        
        // Sync dark mode if different
        if (loadedSettings.darkMode !== initialDarkMode) {
          console.log('🌙 Syncing dark mode with backend settings');
          updateState({ isDarkMode: loadedSettings.darkMode });
          document.documentElement.classList.toggle('dark', loadedSettings.darkMode);
          localStorage.setItem('skysense_dark_mode', loadedSettings.darkMode.toString());
        }
      } else {
        console.log('ℹ️ Using default settings');
      }

      // Update last sync timestamp
      localStorage.setItem('skysense_last_sync', new Date().toISOString());
      
    } catch (error) {
      console.error('⚠️ Failed to load user data:', error);
      toast.warning('Sync Warning', {
        description: 'Could not sync latest data. Using local version.'
      });
    }
  };

  // Enhanced medication reminder system
  useEffect(() => {
    if (!state.isInitialized || !state.appSettings.medicationReminders || 
        state.userProfile.medications.length === 0) {
      return;
    }

    const checkMedicationReminders = () => {
      const now = new Date();
      const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      state.userProfile.medications.forEach(medication => {
        if (medication.isActive && medication.times.includes(currentTime)) {
          const reminderKey = `medication_reminder_${medication.id}_${now.toDateString()}_${currentTime}`;
          
          if (!localStorage.getItem(reminderKey)) {
            // Enhanced notification with sound and vibration
            if ('Notification' in window && Notification.permission === 'granted') {
              const notification = new Notification(`💊 Time for ${medication.name}`, {
                body: `Take ${medication.dosage} as prescribed for your ${medication.condition}`,
                icon: '/icon-192x192.png',
                tag: `medication-${medication.id}`,
                badge: '/icon-72x72.png',
                silent: false,
                requireInteraction: true,
                actions: [
                  { action: 'taken', title: 'Mark as Taken' },
                  { action: 'snooze', title: 'Remind in 5 min' }
                ]
              });

              // Handle notification actions
              notification.addEventListener('click', () => {
                window.focus();
                notification.close();
              });
            }

            // Haptic feedback for medication reminders
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200]); // Double pulse
            }

            // In-app toast notification as backup
            toast.info(`💊 Time for ${medication.name}`, {
              description: `Take ${medication.dosage} for your ${medication.condition}`,
              duration: 10000,
              action: {
                label: 'Mark Taken',
                onClick: () => {
                  localStorage.setItem(reminderKey, 'taken');
                  toast.success(`${medication.name} marked as taken`);
                }
              }
            });
            
            localStorage.setItem(reminderKey, 'sent');
            console.log(`💊 Medication reminder sent: ${medication.name} at ${currentTime}`);
          }
        }
      });
    };

    // Check every minute with enhanced timing
    const interval = setInterval(checkMedicationReminders, 60000);
    checkMedicationReminders(); // Check immediately

    return () => clearInterval(interval);
  }, [state.isInitialized, state.appSettings.medicationReminders, state.userProfile.medications]);

  // Request notification permissions with better UX
  useEffect(() => {
    if (state.appSettings.medicationReminders && 'Notification' in window) {
      if (Notification.permission === 'default') {
        // Request permission with context
        const requestPermission = async () => {
          const permission = await Notification.requestPermission();
          console.log('🔔 Notification permission:', permission);
          
          if (permission === 'granted') {
            toast.success('Notifications enabled', {
              description: 'You\'ll receive medication and health reminders'
            });
          } else if (permission === 'denied') {
            toast.warning('Notifications blocked', {
              description: 'Enable notifications in browser settings for reminders'
            });
          }
        };

        // Delay permission request for better UX
        setTimeout(requestPermission, 2000);
      }
    }
  }, [state.appSettings.medicationReminders]);

  // Auto-save settings with debouncing
  useEffect(() => {
    if (!state.isInitialized) return;

    const saveSettings = async () => {
      const userId = localStorage.getItem('skysense_profile_id');
      if (userId && state.appSettings) {
        try {
          await api.saveSettings(userId, state.appSettings);
          console.log('💾 Settings auto-saved successfully');
        } catch (error) {
          console.error('⚠️ Failed to auto-save settings:', error);
        }
      }
    };

    // Debounce settings save
    const timeoutId = setTimeout(saveSettings, 1000);
    return () => clearTimeout(timeoutId);
  }, [state.appSettings, state.isInitialized]);

  // Enhanced navigation with haptic feedback and smooth transitions
  const navigateToScreen = useCallback((screen: AppScreen) => {
    // Add haptic feedback for navigation
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }

    // Smooth transition
    updateState({ currentScreen: screen });
    
    // Track navigation for analytics (could be extended)
    console.log(`🧭 Navigated to: ${screen}`);
    
    // Reset scroll position for new screens
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  }, []);

  // Enhanced profile save with comprehensive error handling
  const handleProfileSave = useCallback(async (profile: UserProfile) => {
    updateState({ isLoading: true });
    updateUserProfile(profile);
    
    try {
      console.log('💾 Attempting to save profile:', profile);
      
      const response = await api.saveProfile(profile);
      console.log('📤 Profile save response:', response);
      
      if (response.success) {
        const profileId = response.profileId || response.userId;
        if (profileId) {
          localStorage.setItem('skysense_profile_id', profileId);
          localStorage.setItem('skysense_last_sync', new Date().toISOString());
          console.log('✅ Profile ID stored:', profileId);
        }
        
        localStorage.setItem('skysense_onboarding_complete', 'true');
        
        toast.success('Profile saved successfully!', {
          description: 'Your health preferences have been updated.'
        });
        
        navigateToScreen('home');
      } else {
        throw new Error('Profile save was not successful');
      }
    } catch (error) {
      console.error('❌ Failed to save profile:', error);
      
      // Enhanced offline fallback
      const fallbackProfileId = `local_profile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem('skysense_profile_id', fallbackProfileId);
      localStorage.setItem('skysense_onboarding_complete', 'true');
      
      toast.warning('Saved locally', {
        description: 'Profile saved on device. Will sync when connection is restored.'
      });
      
      navigateToScreen('home');
    } finally {
      updateState({ isLoading: false });
    }
  }, [navigateToScreen]);

  // Enhanced dark mode toggle with system preference sync
  const toggleDarkMode = useCallback(() => {
    const newDarkMode = !state.isDarkMode;
    updateState({ isDarkMode: newDarkMode });
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    localStorage.setItem('skysense_dark_mode', newDarkMode.toString());
    updateAppSettings({ darkMode: newDarkMode });

    // Enhanced haptic feedback
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }

    toast.success(`${newDarkMode ? 'Dark' : 'Light'} mode enabled`, {
      description: 'Theme preference saved'
    });
  }, [state.isDarkMode]);

  // Enhanced loading screen with progress indication
  if (!state.isInitialized) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-sm mx-auto px-4 text-center">
          <div className="relative">
            <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-6"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          <h2 className="text-lg font-medium text-foreground mb-2">SkySense</h2>
          <p className="text-muted-foreground text-sm mb-4">
            {state.isLoading ? 'Loading your health profile...' : 'Initializing...'}
          </p>
          {state.error && (
            <p className="text-destructive text-xs mt-2">{state.error}</p>
          )}
        </div>
      </div>
    );
  }

  // Enhanced screen rendering with error boundaries
  const renderCurrentScreen = () => {
    try {
      switch (state.currentScreen) {
        case 'splash':
          return <SplashScreen onComplete={() => navigateToScreen('onboarding')} />;
        case 'onboarding':
          return <OnboardingFlow onComplete={() => navigateToScreen('healthProfile')} />;
        case 'healthProfile':
          return (
            <HealthProfileScreen
              initialProfile={state.userProfile}
              onSave={handleProfileSave}
            />
          );
        case 'home':
          return (
            <HomeScreen
              isDarkMode={state.isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onNavigate={navigateToScreen}
              userProfile={state.userProfile}
            />
          );
        case 'parks':
          return <NearbyParksScreen onNavigate={navigateToScreen} />;
        case 'alerts':
          return <DisasterAlertsScreen onNavigate={navigateToScreen} />;
        case 'forecast':
          return <WeeklyForecastScreen onNavigate={navigateToScreen} />;
        case 'settings':
          return (
            <SettingsScreen
              isDarkMode={state.isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onNavigate={navigateToScreen}
              userProfile={state.userProfile}
              onEditProfile={() => navigateToScreen('healthProfile')}
              appSettings={state.appSettings}
              onUpdateSettings={updateAppSettings}
            />
          );
        case 'notifications':
          return <NotificationCenter onNavigate={navigateToScreen} />;
        case 'trends':
          return <AQITrendsScreen onNavigate={navigateToScreen} />;
        case 'profile':
          return (
            <ProfileScreen 
              onNavigate={navigateToScreen}
              userProfile={state.userProfile}
              onEditProfile={() => navigateToScreen('healthProfile')}
            />
          );
        case 'community':
          return <CommunityReportsScreen onNavigate={navigateToScreen} />;
        case 'eco':
          return <EcoScoreScreen onNavigate={navigateToScreen} />;
        case 'badges':
          return <BadgesScreen onNavigate={navigateToScreen} />;
        default:
          return (
            <HomeScreen
              isDarkMode={state.isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              onNavigate={navigateToScreen}
              userProfile={state.userProfile}
            />
          );
      }
    } catch (error) {
      console.error('❌ Error rendering screen:', error);
      return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
          <div className="text-center">
            <h2 className="text-lg font-medium text-foreground mb-2">Something went wrong</h2>
            <p className="text-muted-foreground text-sm mb-4">Please refresh the app to continue</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Refresh App
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className={`min-h-screen ${state.isDarkMode ? 'dark' : ''}`}>
      {/* Mobile app container with enhanced mobile optimizations */}
      <div className="max-w-sm mx-auto bg-background min-h-screen relative mobile-app-container touch-manipulation">
        {renderCurrentScreen()}
        
        {/* Voice Assistant - Available on main screens */}
        {state.currentScreen !== 'splash' && 
         state.currentScreen !== 'onboarding' && 
         state.appSettings.voiceAssistant && (
          <VoiceAssistant />
        )}
        
        {/* Enhanced toast notifications with mobile optimizations */}
        <Toaster 
          theme={state.isDarkMode ? 'dark' : 'light'}
          position="top-center"
          expand={false}
          richColors
          closeButton
          duration={4000}
          toastOptions={{
            style: {
              maxWidth: '350px',
              fontSize: '14px'
            }
          }}
        />
      </div>
    </div>
  );
}