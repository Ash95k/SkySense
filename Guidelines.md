# SkySense Mobile App Design Guidelines

## General Mobile-First Principles

* **Mobile-Only Design**: This app is exclusively designed for mobile devices (320px - 428px width)
* **Touch-First Interface**: All interactions optimized for finger touch, use `min-h-11` (44px) for touch targets
* **Single-Column Layout**: Always use single-column layouts to maximize mobile screen real estate
* **Bottom Navigation**: Primary navigation always at the bottom for thumb accessibility
* **Swipe Gestures**: Support horizontal swiping for navigation between related screens
* **Minimal Text Input**: Prioritize selections, toggles, and taps over typing when possible

## Screen Size Constraints

* **Target Width**: 375px (iPhone standard) with support for 320px - 428px range
* **Maximum Width**: Use `max-w-sm mx-auto` (384px max) for consistent mobile experience
* **Minimum Touch Target**: Use `min-h-11` (44px) for all interactive elements
* **Safe Areas**: Use `safe-area-bottom` and `safe-area-top` utilities for device compatibility

## Layout Guidelines

* **Container Width**: Always use `max-w-sm mx-auto` for consistent mobile experience
* **Padding**: Use `px-4` (16px) for consistent horizontal spacing
* **Vertical Spacing**: Use `space-y-4` or `space-y-6` between major sections
* **Bottom Padding**: Always use `pb-20` (80px) on screens with bottom navigation to prevent overlap

## Header Design Pattern (Mobile Optimized)

All mobile headers must follow this pattern:
```tsx
<div className="bg-blue-500 px-4 py-3 text-white">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-3">
      <Button variant="ghost" size="sm" className="text-white hover:bg-white/20 p-2 min-h-11">
        <ArrowLeft className="w-5 h-5" />
      </Button>
      <h1 className="text-lg font-medium">Screen Title</h1>
    </div>
    {/* Optional action buttons */}
  </div>
</div>
```

## Card System (Mobile Optimized)

* **Full Width Cards**: Cards should span full width with `px-4` margin from screen edges
* **Card Padding**: Use `p-4` for consistent internal spacing
* **Card Spacing**: `space-y-4` between cards for comfortable scrolling
* **Touch-Friendly**: Ensure cards are easy to tap and don't require precise targeting

## Button Guidelines

### Touch Target Requirements
* **Minimum Size**: Use `min-h-11` (44px) and `min-w-11` (44px) for all buttons
* **Button Spacing**: Minimum `gap-2` (8px) between adjacent buttons
* **Primary Actions**: Use `size="lg"` for main action buttons

### Button Variants
* **Primary**: `bg-blue-500 hover:bg-blue-600 text-white`
* **Secondary**: `variant="outline" border-blue-500 text-blue-500 hover:bg-blue-50`
* **Ghost**: `variant="ghost"` with appropriate hover states for navigation

## Navigation Patterns

### Bottom Navigation
* **Fixed Position**: `fixed bottom-0 left-0 right-0 z-50`
* **Maximum 5 Items**: Never exceed 5 navigation items for mobile usability
* **Active State**: Clear visual indication with blue accent color
* **Safe Area**: Include `safe-area-bottom` for devices with home indicators

### Stack Navigation
* **Back Button**: Always include back arrow in top-left of headers
* **Breadcrumb**: Avoid complex breadcrumbs, use simple back navigation
* **Screen Titles**: Clear, concise titles in headers using `text-lg font-medium`

## Typography (Mobile Optimized)

* **Headers**: `text-lg font-medium` for screen titles
* **Body Text**: Use default system sizing (14px base) for optimal mobile readability  
* **Secondary Text**: `text-sm text-muted-foreground` for supporting information
* **Minimum Size**: Never use text smaller than 12px for accessibility

## Form Elements (Mobile)

* **Large Input Fields**: Full-width inputs with `p-3` padding for easy tapping
* **Input Size**: Use `min-h-11` for input fields to ensure touch-friendly sizing
* **Select Dropdowns**: Use native select components for better mobile experience
* **Checkbox/Toggle Size**: Minimum 24px × 24px for easy selection

## Color System

* **Primary Blue**: `bg-blue-500` for headers and primary actions
* **Status Colors**:
  - Success: `bg-green-500` / `text-green-600`
  - Warning: `bg-orange-500` / `text-orange-600` 
  - Error: `bg-red-500` / `text-red-600`
  - Info: `bg-blue-500` / `text-blue-600`

## Mobile Interaction Patterns

### Touch Targets
* **Minimum Size**: Use `min-h-11 min-w-11` for all tappable elements
* **Button Spacing**: Use `gap-2` or larger between adjacent buttons
* **List Items**: Use `min-h-12` for list items with touch targets

### Gestures
* **Touch Manipulation**: Add `touch-manipulation` class for better touch response
* **Scroll Areas**: Use `scrollbar-hide` class for clean mobile scrolling
* **No Select**: Use `no-select` class to prevent text selection on UI elements

## Component Patterns

### Cards
```tsx
<Card className="p-4">
  <h3 className="font-medium text-foreground mb-4">Section Title</h3>
  {/* Card content */}
</Card>
```

### Touch-Friendly Buttons
```tsx
<Button className="min-h-11 min-w-11" size="lg">
  Primary Action
</Button>
```

### Mobile Navigation
```tsx
<nav className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-t border-border z-50 safe-area-bottom">
  {/* Navigation content */}
</nav>
```

## Responsive Design (Mobile Range)

* **Small Mobile**: 320px - 360px (use `max-w-xs` when needed)
* **Standard Mobile**: 361px - 414px (use `max-w-sm` - primary target)
* **Large Mobile**: 415px - 428px (use `max-w-sm` with responsive adjustments)

## Accessibility Requirements

* **Touch Navigation**: Ensure all features accessible via touch
* **Text Size**: Support system text size preferences
* **Color Independence**: Don't rely solely on color for important information
* **Focus States**: Use proper focus indicators for keyboard navigation

## Performance Guidelines

* **Smooth Scrolling**: Use `-webkit-overflow-scrolling: touch` (handled in CSS)
* **Touch Feedback**: Immediate visual feedback for all touch interactions
* **Loading States**: Clear loading indicators using standard Tailwind classes
* **Haptic Feedback**: Implement via JavaScript for supported devices

## Prohibited Patterns

* **Hover-Only Interactions**: No hover-only functionality
* **Desktop Layouts**: No multi-column or desktop-specific patterns
* **Tiny Touch Targets**: Nothing smaller than `min-h-11 min-w-11`
* **Complex Navigation**: No nested menus or complex hierarchies
* **Fixed Pixel Widths**: Use responsive classes, avoid fixed widths

## Safe Area Handling

* **Bottom Areas**: Use `safe-area-bottom` class for bottom navigation
* **Top Areas**: Use `safe-area-top` class when needed for headers
* **Full Screen**: Account for device notches and rounded corners

## Dark Mode Support

* **System Preference**: Automatically follow system dark/light mode
* **Manual Toggle**: Provide override option in settings
* **Consistent Colors**: Use design system tokens (`text-foreground`, `bg-background`, etc.)
* **Testing**: Verify all components work in both light and dark modes