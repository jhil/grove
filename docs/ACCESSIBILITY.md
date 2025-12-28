# Accessibility (A11y)

This document tracks Plangrove's WCAG 2.1 AA compliance status and accessibility features.

---

## Status: Partial Compliance

Plangrove aims for WCAG 2.1 AA compliance. Most features are accessible, with ongoing improvements.

---

## Implemented Features

### Keyboard Navigation
- [x] Skip-to-content link for bypassing navigation
- [x] Focus visible states on all interactive elements
- [x] Escape key closes modals and menus
- [x] Tab navigation through forms and buttons

### Screen Reader Support
- [x] Toast notifications with `aria-live` regions
  - `aria-live="polite"` for success/info
  - `aria-live="assertive"` for errors/warnings
- [x] Form inputs with proper labels and `aria-required`
- [x] Error states with `aria-invalid`
- [x] Loading states with `aria-busy`
- [x] Menu buttons with `aria-expanded` and `aria-haspopup`
- [x] Dropdown menus with `role="menu"` and `role="menuitem"`

### Semantic Structure
- [x] Proper heading hierarchy (h1 > h2 > h3)
- [x] Section landmarks with `aria-labelledby`
- [x] Navigation landmarks with `aria-label`
- [x] Main content identified with `id="main-content"`

### Visual Accessibility
- [x] Viewport zooming enabled (no maximum-scale restriction)
- [x] Focus visible rings on interactive elements
- [x] Color contrast follows WCAG AA guidelines (sage/cream palette)
- [x] Status indicators use icons + color (not color alone)

### Components (Base UI)
- [x] Dialog - accessible modal with focus trap
- [x] Select - keyboard-navigable dropdown
- [x] Combobox - accessible autocomplete with arrow keys
- [x] Button - proper focus states and loading indicators

---

## Known Gaps

### Not Yet Implemented
- [ ] `aria-describedby` for form field hints/errors
- [ ] Keyboard shortcuts documentation/help dialog
- [ ] High contrast mode support
- [ ] Reduced motion preference detection
- [ ] Focus management for dynamic content (plant added/removed)

### Needs Testing
- [ ] Screen reader testing with VoiceOver (macOS)
- [ ] Screen reader testing with NVDA (Windows)
- [ ] Keyboard-only navigation testing
- [ ] Color contrast verification with automated tools

---

## Testing Recommendations

### Automated Testing
1. Run axe-core or Lighthouse accessibility audit
2. Check with WAVE browser extension
3. Validate HTML semantics

### Manual Testing
1. Navigate entire app with keyboard only (Tab, Enter, Escape)
2. Test with VoiceOver/NVDA screen reader
3. Test with browser zoom at 200%
4. Verify focus visibility on all interactive elements

---

## Component Guidelines

### Buttons
```tsx
<Button
  aria-label="Descriptive action"
  aria-busy={isLoading}
  disabled={isDisabled}
>
  Button Text
</Button>
```

### Form Inputs
```tsx
<Input
  id="field-id"
  aria-required="true"
  aria-invalid={hasError}
  aria-describedby="field-hint"
/>
<span id="field-hint">Helpful hint text</span>
```

### Toast Notifications
```tsx
<div
  role="alert"
  aria-live={isUrgent ? "assertive" : "polite"}
  aria-atomic="true"
>
  Notification content
</div>
```

### Dropdown Menus
```tsx
<Button
  aria-label="Options"
  aria-haspopup="menu"
  aria-expanded={isOpen}
>
  <MoreIcon />
</Button>
<div role="menu" aria-label="Menu name">
  <button role="menuitem">Option 1</button>
  <button role="menuitem">Option 2</button>
</div>
```

---

## Resources

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [ARIA Authoring Practices](https://www.w3.org/WAI/ARIA/apg/)
- [Base UI Accessibility](https://mui.com/base-ui/getting-started/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)

---

## Last Updated
December 27, 2025
