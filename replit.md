# Work Hub - Team Presence Dashboard

## Overview
A minimalist dark mode work hub that provides real-time team presence tracking, quick access to Google Meet, and Google Drive integration. Built with React, Firebase, and Tailwind CSS.

## Purpose
Work Hub serves as a central dashboard for teams to:
- See who's online, offline, or in a call in real-time
- Quickly join the main team Google Meet room
- Access Google Drive and view recent files
- Maintain presence awareness across the team

## Current State
**Status**: MVP Implementation Complete
- ✅ Firebase Authentication with Google sign-in
- ✅ Real-time team presence tracking with Firestore
- ✅ Automatic status updates (Online/Offline/In Call)
- ✅ Smart status reversion (In Call → Online when returning to tab)
- ✅ Dark mode UI with minimalist design
- ✅ Google Meet integration with status updates
- ✅ Google Drive UI with sample files (ready for API integration)
- ✅ Responsive grid layout for team members
- ✅ Smooth transitions and polished interactions
- ✅ Toast notifications for errors
- ✅ Beautiful loading states and empty states

## Project Architecture

### Frontend (React + Vite)
- **Pages**:
  - `Login.tsx`: Google sign-in page with centered card layout
  - `Dashboard.tsx`: Main hub with team presence grid and Drive sidebar
- **Components**:
  - `TeamMemberCard.tsx`: Displays individual team member with avatar, status, and info
  - `StatusBadge.tsx`: Status indicator (Online/Offline/In Call) with color coding and pulse animation
  - `TeamMemberSkeleton.tsx`: Loading state for team member cards
  - `DriveFilesList.tsx`: Recent files display with sample data (ready for Google Drive API)
- **Hooks**:
  - `usePresence.ts`: Manages user presence and status updates with smart state handling

### Backend (Firebase)
- **Authentication**: Firebase Auth with Google provider
- **Database**: Cloud Firestore
  - Collection: `users`
  - Document structure:
    ```typescript
    {
      uid: string,
      name: string,
      email: string,
      photoURL: string | null,
      status: "Online" | "Offline" | "In Call",
      lastSeen: number (timestamp)
    }
    ```

### Design System
- **Theme**: Dark mode only (as specified)
- **Fonts**: Inter (UI), JetBrains Mono (status badges)
- **Colors**: Blue primary, semantic status colors (green=online, blue=in call, gray=offline)
- **Layout**: Responsive grid (1→2→3→4 columns based on screen size)
- **Spacing**: Consistent 4-6-8 spacing scale
- **Transitions**: 200ms duration on all interactive elements

## User Preferences
- Dark mode is the primary and only theme
- Minimalist design with no unnecessary decorations
- Real-time updates for immediate feedback
- Google Meet as primary video conferencing tool
- Smooth animations and transitions for better UX

## Recent Changes
**October 31, 2025**
- Initial implementation of Work Hub MVP
- Set up Firebase Authentication with Google provider
- Implemented real-time presence system with Firestore
- Created responsive dashboard with team member grid
- Added automatic status management (login/logout/beforeunload)
- Integrated Google Meet quick access with status updates
- Built complete UI with dark mode design system
- Added DriveFilesList component with sample data
- Implemented smart status reversion (In Call → Online on focus/visibility)
- Added smooth transitions throughout (200ms duration)
- Fixed presence hook to use setDoc with merge for reliability
- Added toast notifications for error handling
- Improved loading states with skeleton components

## Environment Variables
Required Firebase configuration (already set):
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_API_KEY`

## Running the Project
The project runs automatically with `npm run dev`:
- Backend: Express server
- Frontend: Vite dev server
- Both served on the same port

## Firebase Setup
1. Firebase project configured with Google Authentication
2. Firestore database initialized
3. Authorized domains configured for OAuth redirect

## Key Features
1. **Real-time Presence**: Firestore onSnapshot listeners for instant updates
2. **Automatic Status**: Updates to "Online" on login, "Offline" on browser close
3. **In Call Management**: Automatically set when joining Meet, reverts to Online on tab focus
4. **Team Grid**: Sorted view (current user first, then by status priority)
5. **Beautiful UI**: Skeleton loaders, smooth transitions, proper empty states
6. **Drive Integration**: UI ready for Google Drive API (currently showing sample data)
7. **Error Handling**: Toast notifications for authentication and data loading errors
8. **Responsive Design**: Works on mobile, tablet, and desktop

## Google Drive Integration Note
The DriveFilesList component currently displays sample data to demonstrate the UI. To connect to real Google Drive files, you would need to:
1. Enable Google Drive API in Firebase Console
2. Add Drive scope to OAuth configuration
3. Implement backend endpoint to fetch files using user's access token
4. Update DriveFilesList to fetch real data instead of mock data

## Next Phase Features (Future)
- Real Google Drive API integration with OAuth scopes
- Custom status messages and away/busy states
- File upload and management directly to Google Drive
- Shared team calendar integration
- Quick notes or announcements board
- Activity logs showing team activity history
- Status history and analytics
