# AgriRS Lab Website - AI Agent Instructions

## Project Overview
The AgriRS Lab website is a institutional website for the Agricultural Remote Sensing Laboratory at INPE (Brazilian National Institute for Space Research). The project uses vanilla HTML, CSS, and JavaScript to create a responsive website with multiple pages for content management.

## Key Architecture Components

### Frontend Structure
- `pages/` - Contains all HTML pages (e.g., `membros.html`, `projetos.html`, `publicacoes.html`)
- `Layout/` - Reusable header/footer templates (`header.html`, `footer.html`)
- `css/` - Page-specific and global styles
  - `global.css` - Core styles and variables
  - `vars.css` - Design tokens and CSS variables
- `javascripts/` - Page-specific JavaScript files
- `assets/` and `public/` - Static assets (images, icons)

### Backend Structure (In Development)
- `src/` - Server-side code
  - `routes/` - API routes (e.g., `projetos.routes.js`, `publicacoes.routes.js`)
  - `models/` - Data models (e.g., `membros.js`, `projetos.js`)
  - `db/` - Database configuration

## Key Development Patterns

### CSS Conventions
- CSS files are modular and page-specific (e.g., `membros.css`, `projetos.css`)
- Global styles and variables are in `global.css` and `vars.css`
- BEM-like naming convention used for classes

### JavaScript Organization
- Page-specific logic is in dedicated files (e.g., `paginainicial.js`, `projetos.js`)
- Layout-related functionality in `layout.js`

### Content Management
- Most content is statically defined in HTML files
- Dynamic content loading is being implemented through API routes
- Images are organized by category in `public/img/` (e.g., `membros/`, `projetos/`)

## Common Development Tasks

### Adding a New Page
1. Create HTML file in `pages/`
2. Create corresponding CSS in `css/`
3. Include header/footer from `Layout/`
4. Add route if needed in `src/routes/`
5. Add link in navigation (header/footer)

### Updating Components
- Header/Footer changes go in `Layout/` directory
- Test changes across all pages that use the components

### Development Workflow
- Local development uses standard web server
- Database integration planned for Sprint 2
- Follow defined sprint tasks in backlog

## Project-Specific Conventions
- All pages must be bilingual (Portuguese/English) - WIP
- Follow responsive design patterns for mobile compatibility
- Use institutional branding guidelines for visuals
- Include proper metadata and accessibility attributes
- Coordinate feature development with sprint backlog items

## Key Files and References
- Project tracking in [Trello Board](https://trello.com/invite/b/68d3438109f6162f0c66abaa/ATTI0981fc780064200aaab49d972b5ea751C1BC62D6/undefined-sprint-1)
- Design mockups in [Figma](https://www.figma.com/team_invite/redeem/5p0PJg8oLlWeOnH18nydzl)
- Requirements documented in `README.md` (RF01-RF08 and RNF01-RNF06)

## Architecture Decisions
- Vanilla HTML/CSS/JS stack chosen for simplicity and maintainability
- Page-specific CSS/JS for modularity
- Shared components in `Layout/` for consistency
- API-first backend design for future scalability
- Database integration planned for dynamic content management