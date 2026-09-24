# SiteOps Interface Design

## Product Character

SiteOps is a practical operations tool. The interface should feel quiet, clear, and dependable. It should prioritize records, status, and actions over decoration.

## Design Principles

- Use plain text labels instead of decorative icons.
- Keep navigation visible and predictable.
- Use one primary action per page.
- Prefer restrained borders and neutral surfaces over shadows and decoration.
- Keep tables readable with compact rows and clear headers.
- Show real application states: loading, empty, filtered, success, and failure.
- Keep destructive actions behind a confirmation step.
- Preserve functionality across desktop, tablet, and mobile layouts.

## Visual System

### Typography

- System UI font stack
- Page title: 28px desktop, 24px mobile
- Section title: 14px
- Body and controls: 12-13px
- Metadata: 11px
- Letter spacing: 0

### Spacing

Use an 8px base rhythm with 4px increments for compact controls.

- Page side padding: 40px desktop, 16px mobile
- Page header bottom padding: 28px
- Section spacing: 24px
- Table cell padding: 14px vertical, 16px horizontal
- Control height: 36-38px
- Border radius: 5-7px

### Color

The application uses neutral surfaces with a restrained blue action color. Green, amber, and red are reserved for status.

- Light page: `#f6f6f7`
- Light surface: `#ffffff`
- Dark page: `#121213`
- Dark surface: `#1b1c1e`
- Primary action: `#3155d9`
- Text: `#202124` in light mode and `#e5e6e8` in dark mode
- Border: `#dedfe3` in light mode and `#343539` in dark mode

## Layout

### Sidebar

- 224px expanded
- 184px collapsed
- Text-only navigation
- Dark neutral surface
- Theme control at the bottom
- Horizontal navigation on mobile

### Content

- Maximum content width: 1120px
- Page title, short description, and one primary action
- Summary metrics in one bordered grid
- Operational records in one bordered section
- No decorative hero sections, gradients, illustrations, or oversized headings

## Tables

Desktop uses traditional rows and columns. Below 720px, each row becomes a labeled record so columns do not require horizontal scrolling.

## Dialogs and Feedback

- Dialogs use a neutral surface and a short description
- Escape and backdrop clicks close dialogs
- Create, update, and delete operations show a toast
- Failed operations show an error toast and preserve the open form
- Destructive operations use a confirmation dialog

## Responsive Behavior

- Sidebar becomes a compact top navigation on mobile
- Page actions span the available width when needed
- Filters stack vertically
- Form fields use one column
- Dialogs become bottom sheets on narrow screens
- Summary metrics use two columns, then one column on very small screens
