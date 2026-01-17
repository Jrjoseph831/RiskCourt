# Terminal UI Implementation - "Today" Page

## What Changed

This implementation delivers a production-quality "Today/Terminal" page with Jules/Stitch reference styling (design-2 minimal aesthetic).

### New Components

1. **CommandPalette** (`components/ui/CommandPalette.tsx`)
   - Global search with Cmd+K shortcut
   - Quick navigation to all pages
   - Built with cmdk for smooth UX

2. **Sheet** (`components/ui/Sheet.tsx`)
   - Mobile drawer for sidebar navigation
   - Backdrop overlay with proper focus management

3. **LoadingSkeleton** (`components/terminal/LoadingSkeleton.tsx`)
   - Skeleton states for StatCards and LiveMarketsTable
   - Smooth loading experience with subtle animations

4. **ErrorState** (`components/terminal/ErrorState.tsx`)
   - Non-technical error messaging
   - Collapsible technical details
   - Retry action button

### Updated Components

1. **LiveMarketsTable** (`components/terminal/LiveMarketsTable.tsx`)
   - ✅ Fixed TypeScript `ExpandedState` type error
   - ✅ Added keyboard navigation (Enter/Space to expand)
   - ✅ Improved accessibility with aria-labels
   - ✅ Enhanced focus states for all interactive elements

2. **Sidebar** (`components/layout/Sidebar.tsx`)
   - ✅ Mobile-responsive (hidden on mobile, shown on desktop)
   - ✅ Extracted `SidebarContent` for reuse in Sheet
   - ✅ Added focus states for keyboard navigation

3. **TopBar** (`components/layout/TopBar.tsx`)
   - ✅ Wired CommandPalette to search button
   - ✅ Added focus states

4. **AppShell** (`components/layout/AppShell.tsx`)
   - ✅ Mobile menu button (hamburger)
   - ✅ Sheet integration for mobile sidebar

5. **Terminal Page** (`app/terminal/page.tsx`)
   - ✅ Loading state with skeletons
   - ✅ Error state with non-technical messaging
   - ✅ Success state with live markets table
   - ✅ Mobile-responsive layout

6. **Root Layout** (`app/layout.tsx`)
   - ✅ Added JetBrains Mono font for data/metrics

7. **Global Styles** (`app/globals.css`)
   - ✅ Updated font-family references to use CSS variables

## Features

### Desktop Experience
- Left sidebar with grouped navigation (Research + Config)
- Top bar with search, system status, latency, date
- KPI cards: Opportunities, Risk Cap, Data Status, Engine Latency
- Live Markets table with:
  - Sort by Edge % and Time
  - Text filter across all columns
  - Row expansion for "Model Reasoning"
  - Non-gambling language ("Add to Ledger" vs "Place Bet")

### Mobile Experience
- Sidebar collapses into hamburger menu
- Sheet drawer for navigation
- Responsive table layout
- Touch-friendly controls

### Accessibility
- ✅ Keyboard navigation for all primary flows
- ✅ Visible focus rings (teal accent)
- ✅ Aria labels on interactive elements
- ✅ Semantic HTML structure

### States
- **Loading**: Skeleton placeholders for cards and table
- **Error**: Non-technical message + collapsible details
- **Success**: Full UI with mock data

### Keyboard Shortcuts
- `Cmd+K` / `Ctrl+K`: Open command palette
- `Enter` / `Space`: Expand table rows
- `Tab`: Navigate through interactive elements

## How to Test

### 1. Install Dependencies (if needed)
```bash
cd web
npm install
```

### 2. Start Dev Server
```bash
npm run dev
```
Server will start at http://localhost:3001 (or 3000 if available)

### 3. Desktop Testing
- ✅ Navigate to http://localhost:3001
- ✅ Should redirect to `/terminal`
- ✅ Verify sidebar shows on left (Terminal, Analysis, Ledger, Parameters)
- ✅ Verify top bar shows search, status, latency, date, avatar
- ✅ Click search bar or press `Cmd+K` to open command palette
- ✅ Type to filter pages, press Enter to navigate
- ✅ Verify 4 KPI cards display correctly
- ✅ Verify Live Markets table shows 3 mock rows
- ✅ Click chevron or press Enter to expand a row
- ✅ Verify "Model Reasoning" shows with tags
- ✅ Click "Add to Ledger" button (non-functional, UI only)
- ✅ Type in "Filter slate..." input to filter table
- ✅ Click Yesterday/Today/Tomorrow buttons (Today is highlighted)

### 4. Mobile Testing (Resize Browser < 1024px)
- ✅ Sidebar should hide on mobile
- ✅ Hamburger menu appears in top-left
- ✅ Click hamburger to open Sheet drawer
- ✅ Navigation links work in drawer
- ✅ Drawer closes after clicking a link
- ✅ Table remains usable (may wrap or scroll)
- ✅ Date selector buttons stack properly

### 5. Keyboard Testing
- ✅ Press `Tab` to navigate through interactive elements
- ✅ Focus rings should be visible (teal accent)
- ✅ Press `Cmd+K` to open command palette
- ✅ Press `Escape` to close palette
- ✅ Use arrow keys in command palette
- ✅ Press Enter to select a page
- ✅ Tab to table expand button, press Space/Enter to expand

### 6. State Testing
To test different states, edit `app/terminal/page.tsx`:

**Loading State:**
```tsx
const [state] = useState<"loading" | "error" | "success">("loading");
```

**Error State:**
```tsx
const [state] = useState<"loading" | "error" | "success">("error");
```

**Success State (default):**
```tsx
const [state] = useState<"loading" | "error" | "success">("success");
```

### 7. Linting
```bash
npm run lint
```
Should pass with no errors.

### 8. Type Checking
```bash
npx tsc --noEmit
```
Should pass with no errors.

## Acceptance Criteria ✅

- [✅] Desktop layout matches Jules reference: minimal, readable, high signal
- [✅] Mobile works: sidebar collapses, table usable
- [✅] Table supports: filter, sort, row expand with "Model notes"
- [✅] Loading/empty/error states exist and look intentional
- [✅] Copy is non-technical (no "de-vig", "alpha", etc.)
- [✅] No console errors, no broken routes, changes localized
- [✅] Keyboard navigation works for primary controls
- [✅] Accessibility: focus states, aria-labels, semantic HTML

## Design Tokens

```css
--bg-deep: #121212       /* Main background */
--bg-dark: #1e1e1e       /* Card/panel background */
--bg-card: #242424       /* Elevated surfaces */
--accent-teal: #00bfa5   /* Primary accent, active states */
--text-primary: #ffffff  /* Headings, important text */
--text-secondary: #a0a0a0 /* Body text */
--text-muted: #666666    /* Subtle text */
--border-subtle: #2a2a2a /* Dividers */
--border-default: #333333 /* Input borders */
```

## Typography

- **UI Text**: Inter (clean sans-serif)
- **Data/Metrics**: JetBrains Mono (monospace)
- **Numbers**: Always use `font-mono` class

## Non-Technical Language

Following user story requirements:
- ❌ "Execute bet" → ✅ "Add to Ledger"
- ❌ "Alpha" → ✅ "Edge %"
- ❌ "De-vig" → ✅ "Fair Value"
- ❌ "Sharp money" → ✅ OK (industry term, but explained in context)

## Next Steps (Future Work)

1. **Live Data Integration**: Replace mock data with actual Supabase calls
2. **Real Command Actions**: Wire up "Add to Ledger" to actual functionality
3. **Filtering/Sorting Persistence**: Save user preferences
4. **Column Visibility**: Implement "Columns" button functionality
5. **Real-time Updates**: Add polling or WebSocket for live odds changes
6. **More Pages**: Implement Analysis, Ledger, Parameters pages
7. **User Settings**: Avatar menu with theme switcher, settings
8. **Performance**: Add React.memo where appropriate for large datasets

## Notes

- All changes are localized to `/web` directory
- No Lane A (Supabase/DB) changes made
- Mock data is intentionally used (Lane B: UI only)
- Component structure follows shadcn/ui patterns
- Uses Radix UI primitives indirectly through cmdk
- Tailwind 4.0 syntax used throughout

## Troubleshooting

**Port 3000 in use?**
- Next.js will auto-assign port 3001
- Or stop other dev server: `npx kill-port 3000`

**Module not found errors?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Styles not loading?**
- Hard refresh: `Cmd+Shift+R` / `Ctrl+Shift+R`
- Clear Next.js cache: `rm -rf .next`

**Sheet not opening on mobile?**
- Check browser console for errors
- Verify screen width < 1024px
- Try toggling responsive mode in DevTools
