# Design Guidelines: Dark Mode Work Hub

## Design Approach
**Selected Approach**: Design System + Reference Hybrid
- Primary inspiration: Linear (modern dark mode productivity), Discord (team presence), Notion (workspace simplicity)
- Focus on minimalist clarity with purposeful use of space
- Dark mode is the primary and only theme (user specified requirement)

## Core Design Elements

### A. Typography
**Font Stack**: Google Fonts
- Primary: Inter (400, 500, 600, 700) - UI elements, body text
- Accent: JetBrains Mono (500) - for status badges and technical info

**Hierarchy**:
- Page Title: text-2xl, font-semibold
- Section Headers: text-lg, font-medium
- Card Titles: text-base, font-medium
- Body Text: text-sm, font-normal
- Captions/Status: text-xs, font-medium

### B. Layout System
**Spacing Primitives**: Tailwind units of 2, 4, 6, 8, 12, 16
- Component padding: p-6
- Section spacing: space-y-8
- Card gaps: gap-4
- Inline spacing: space-x-2

**Grid Structure**:
- Main container: max-w-7xl mx-auto px-6
- Team grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4
- Dashboard sections: Single column on mobile, strategic 2-column on desktop where appropriate

### C. Component Library

**1. Authentication (Login Screen)**
- Centered card layout (max-w-md mx-auto, min-h-screen flex items-center)
- Logo/app name at top
- Single "Sign in with Google" button with Google icon
- Minimalist, no distracting background elements

**2. Main Dashboard Layout**
- Top Navigation Bar (sticky top-0):
  - App logo/name (left)
  - User profile with status indicator (right)
  - Sign out option in dropdown
  - Height: h-16, backdrop-blur effect
  
- Main Content Area (pt-20 px-6):
  - Welcome section with user name
  - Quick actions row (Meet button, Drive button)
  - Team presence grid (primary focus)

**3. Team Member Cards**
- Compact card design (rounded-lg, p-4)
- Layout structure:
  - Avatar (w-12 h-12, rounded-full) with status ring (ring-2)
  - Name (text-base, font-medium, truncate)
  - Email (text-xs, opacity-70, truncate)
  - Status badge (absolute top-2 right-2, text-xs, px-2 py-1, rounded-full)
- Status indicators: Small dot (w-2 h-2) next to name
- Hover: subtle scale (hover:scale-102) and elevation change

**4. Quick Action Buttons**
- Primary CTA (Meet button): Large, prominent (px-6 py-3, text-base, rounded-lg)
- Secondary actions (Drive links): Medium size (px-4 py-2, text-sm, rounded-md)
- Icons from Heroicons (24x24 for large buttons, 20x20 for medium)
- Consistent icon-left pattern with text-right alignment (gap-2)

**5. Google Drive Section**
- Header with "Recent Files" title and "Open Drive" link
- File list items:
  - File icon (from Heroicons or Google Material Icons)
  - File name (text-sm, truncate)
  - Last modified time (text-xs, opacity-60)
  - Compact spacing (py-2, border-b on each item)
- Maximum 5-7 recent files shown

**6. Status Management**
- Status options: "Online" (default on login), "Offline", "In Call" (auto when clicking Meet)
- Visual treatment: Badge with dot indicator, consistent positioning across all instances
- Real-time updates with smooth transitions

### D. Visual Hierarchy

**Emphasis Levels**:
1. Primary: User's own card, Meet button (highest contrast)
2. Secondary: Online team members, section headers
3. Tertiary: Offline members, metadata, timestamps
4. Minimal: Dividers, borders, background containers

**Spacing Rhythm**:
- Tight spacing (gap-2): Related items within a card
- Medium spacing (gap-4): Cards in grid, list items
- Generous spacing (gap-8): Major sections
- Section padding: py-12 for main content areas

### E. Interaction Patterns

**Real-time Updates**:
- Smooth transitions for status changes (transition-all duration-200)
- Subtle pulse animation for "In Call" status (animate-pulse, very gentle)
- No loading spinners - show skeleton cards during initial load

**Micro-interactions**:
- Button states: hover lift (hover:-translate-y-0.5), active press (active:translate-y-0)
- Card hover: subtle elevation and scale
- Status dot pulse for online users (subtle, 2s cycle)

### F. Responsive Behavior

**Breakpoints**:
- Mobile (base): Single column, stacked layout, simplified nav
- Tablet (md): 2-column team grid, compact header
- Desktop (lg): 3-column grid, full header with all actions
- Wide (xl): 4-column grid, maximum information density

**Mobile Optimizations**:
- Bottom sheet pattern for user menu
- Larger touch targets (min-h-12)
- Simplified status display (icon only on small cards)

## Images

**Profile Photos**:
- Source: Firebase Auth photoURL from Google account
- Fallback: User initials in centered circle
- Treatment: rounded-full with subtle ring on hover
- Placement: All team member cards, top-right user menu

**No hero images** - This is a utility dashboard, not a marketing page. Focus on functional clarity.

## Key Design Principles

1. **Minimalism**: Every element serves a purpose, no decorative additions
2. **Clarity**: Information hierarchy through typography and spacing, not excessive styling
3. **Real-time Feel**: Immediate visual feedback for all status changes
4. **Accessibility**: Sufficient contrast ratios, clear focus states, semantic HTML
5. **Performance**: Lightweight, fast-loading interface with optimized real-time listeners