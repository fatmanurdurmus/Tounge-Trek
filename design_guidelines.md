# Design Guidelines: Çok Dilli Kültürel İçerik Keşif Uygulaması

## Platform & Language
- **Platform**: React Native with Expo (mobile-only, no web)
- **Testing**: expo-go
- **Backend**: Supabase (file storage + optional remote API)
- **Default Language**: Turkish
- **Secondary Language**: English
- **i18n Support**: Minimum 11 languages with easy expansion architecture

## Architecture Decisions

### Authentication
- **No authentication required** for core functionality
- **Profile/Settings Screen** includes:
  - User-customizable local avatar
  - Display name field
  - App preferences (theme, notifications, language)

### Navigation Structure
**Root Navigation**: Tab Navigation (6 tabs)
- **Tabs**: Home, Explore, Travel, Daily, Library, Profile
- Each tab has its own navigation stack
- Detail screens and modals presented over tabs

## Screen Specifications

### 1. Home Screen
- **Purpose**: Daily engagement entry point
- **Layout**:
  - Transparent header with theme toggle button
  - Scrollable content with safe area insets (top: insets.top + Spacing.xl, bottom: tabBarHeight + Spacing.xl)
- **Components**:
  - Daily featured expression card ("Expression/Quote of the Day")
  - Spotlight carousel (featured, trending, newly added)
  - Quick category chips (horizontal scroll)
  - Streak counter & progress indicators
  - Search bar with auto-suggestions

### 2. Explore Screen
- **Purpose**: Content discovery and filtering
- **Layout**:
  - Header with search bar
  - Filter drawer/panel button in header right
  - Grid/List toggle view
- **Components**:
  - FTS5 live search results
  - Filter options: language, type, category, region, tags, popularity, date
  - Sort options: alphabetical, popularity, date added, recently viewed
  - Content cards with semantic "Related expressions" preview

### 3. Travel Mode Screen
- **Purpose**: Language-specific travel phrase collections
- **Layout**:
  - Country/language selector at top
  - Scrollable content with offline badges
- **Components**:
  - Curated TravelPhrase content cards
  - Survival phrases, etiquette tips, common memes
  - One-tap copy button
  - Optional TTS playback (expo-speech)
  - Download buttons for offline packs

### 4. Daily Screen
- **Purpose**: Daily learning queue and streaks
- **Layout**:
  - Scrollable form-like layout
  - Top: Streak display & XP gains
- **Components**:
  - "Today's 5" expression queue
  - Mark as learned buttons
  - Quick quiz mode toggle
  - Daily notification time picker
  - Streak calendar visualization

### 5. Library Screen
- **Purpose**: User's saved and cached content
- **Layout**:
  - Sectioned list: Bookmarks, Downloads, Recently Viewed
  - Filter and sort controls in header
- **Components**:
  - Offline badges for cached items
  - Grid/List toggle
  - Empty states for each section

### 6. Profile/Settings Screen
- **Purpose**: User stats, achievements, settings
- **Layout**:
  - Scrollable form with sections
  - Header with avatar and display name
- **Components**:
  - Learning statistics (per category/language, time-on-task, quiz accuracy)
  - Achievements gallery preview
  - Streak calendar
  - Leaderboard rank summary
  - Settings sections:
    - Theme (Light/Dark/System)
    - App UI language (i18n selector)
    - Notification preferences
    - Data sync controls
  - Action buttons:
    - Upload Meme
    - View Achievements
    - View Leaderboards
    - Feedback/Report

### 7. Detail Screen (Entry/[id])
- **Purpose**: Full content display with relationships
- **Layout**:
  - Scrollable content
  - Floating action buttons (Favorite, Bookmark, Share)
- **Components**:
  - Full text, translation, meaning, cultural context
  - Tags chips
  - Audio pronunciation button (if audioUrl present)
  - Semantic relationships section: "Related expressions" & "Related myths/stories"
  - Community stats: favorites count, rating
  - Report/Feedback button

### 8. Achievements Screen
- **Purpose**: Display all badges and unlock status
- **Layout**: Grid of achievement cards
- **Components**:
  - Badge icon, name, description, unlock status
  - Progress bars for incomplete achievements
  - Categories: "First Steps", "Cultural Explorer", "Week Warrior", "Month Master", "Myth Hunter", "Social Butterfly", "Travel Ready", "Meme Whisperer"

### 9. Leaderboards Screen
- **Purpose**: Weekly/monthly/all-time rankings
- **Layout**: Tabbed view (Weekly, Monthly, All-time)
- **Components**:
  - User rank card at top
  - Ranked list of users
  - Category-specific leaderboard tabs
  - Friend comparison section (optional)

### 10. Story Module Screen
- **Purpose**: Interactive narrative experience
- **Layout**: 
  - Full-screen immersive
  - Paginated slides
- **Components**:
  - Multi-page narratives with illustrations
  - Audio narration controls
  - Interactive choice buttons
  - End-of-story quiz
  - Related content suggestions

### 11. Feedback Screen
- **Purpose**: User feedback and content reporting
- **Layout**: Scrollable form
- **Components**:
  - General feedback form
  - Per-content report form
  - Category selection
  - Text input area
  - Submit button

### 12. What's New Screen
- **Purpose**: Content/app update announcements
- **Layout**: Scrollable list
- **Components**:
  - Update cards with date
  - New categories/stories highlights
  - Feature announcements

## Design System

### Color Palette
Must support Light and Dark themes with system preference detection. Define color tokens for:
- Primary brand color
- Secondary/accent color
- Background colors (base, elevated, card)
- Text colors (primary, secondary, tertiary)
- Success, warning, error states
- Border colors
- Overlay/scrim colors

### Typography
Define type scale for:
- Display/Hero text
- Headings (H1-H4)
- Body text (regular, medium, bold)
- Captions and labels
- Button text

### Spacing
Consistent spacing tokens (e.g., xs, sm, md, lg, xl, xxl)

### Components
- **Cards**: Rounded corners, subtle elevation for content items
- **Buttons**: 
  - Primary (filled)
  - Secondary (outlined)
  - Text buttons
  - Floating action buttons with shadow (shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.10, shadowRadius: 2)
- **Icons**: Use Feather icons from @expo/vector-icons (NO emojis)
- **Chips**: Category and tag chips with tap feedback
- **Progress Indicators**: Streak counter, XP bars, loading skeletons
- **Empty States**: Friendly illustrations and helper text
- **Error States**: Clear error messages with retry options

### Visual Feedback
- All touchable components MUST have visual feedback (opacity change or scale)
- Pull-to-refresh on list screens
- Loading states with skeleton loaders
- Success animations for achievements unlocked

### Accessibility
- Minimum touch target size: 44x44 points
- Sufficient color contrast ratios
- Support for system font scaling
- Screen reader compatible labels
- Keyboard navigation support where applicable

## Content Types & Metadata
Support 12 content types with consistent interface:
- proverb, idiom, legend, myth, folkStory, epic, mythologyNote, regionalTale, meme, travelPhrase, dailyExpression, trending_quote

Each entry includes: translation, meaning, cultural context, tags, region, popularity, relatedContent IDs

## Features

### Gamification
- **Point System**: Daily login (+10), Learn content (+5), Daily challenge (+20), Quiz correct (+10), Bookmark (+2), Share (+3)
- **Streaks**: Consecutive day counter with milestone rewards (7, 30 days)
- **Achievements**: Minimum 8 badges as specified
- **Daily Challenges**: Quote of the day + 5-question quiz

### Notifications (expo-notifications)
- User-configurable daily reminder time
- Achievement unlock notifications
- Streak warnings
- New content alerts
- Personalized suggestions (opt-in)

### Sharing (react-native-share + react-native-view-shot)
- Generate themed quote cards as images
- Share as image or text with app link
- Deep linking support (Expo Link)
- Copy to clipboard option
- Save image to device option

### Offline Support (expo-file-system)
- Cache meme images and audio
- Download travel phrase packs for offline use
- Offline badges on cached content
- Bookmarks accessible offline

### Search & Filtering
- FTS5 full-text search in SQLite
- Multi-filter support: language, type, category, region, tags, popularity
- Sort options: alphabetical, popularity, date, recently viewed
- Semantic relationship browsing

### Meme Management (expo-image-picker + Supabase)
- Image picker (camera + gallery)
- Image compression before upload
- Upload to Supabase Storage (use EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY)
- Metadata persistence in local SQLite
- Optional watermark on exported cards

### Versioning & Updates
- App content version tracking
- "Check for updates" button
- Remote JSON merge into SQLite
- "What's New" screen after updates
- Content update badges (e.g., "New · 5")

## Assets
- **NO emojis** - use system icons or Feather icons
- **Required Assets**:
  - App logo/icon
  - Achievement badge icons (8+ unique badges)
  - Placeholder avatars for user profiles
  - Category illustration icons
  - Empty state illustrations
  - Story module illustrations (per story)
  - Cultural/regional visual themes for content cards

## Safe Area & Layout
- **With Tab Bar**: bottom inset = tabBarHeight + Spacing.xl
- **Without Tab Bar**: bottom inset = insets.bottom + Spacing.xl
- **Transparent Header**: top inset = headerHeight + Spacing.xl
- **No Header**: top inset = insets.top + Spacing.xl
- **Solid Header**: top inset = Spacing.xl

## Testing Requirements
- Minimum 10 passing tests using Jest and React Native Testing Library
- Test: i18n switching, theme switching, search functionality, gamification logic, offline caching