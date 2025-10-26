# TrustDAG Design Guidelines

## Design Approach: Web3 Glassmorphism

Selected approach: Custom Web3 aesthetic combining glassmorphism with blockchain/tech-forward visual language. This creates a trustworthy, cutting-edge appearance suitable for decentralized storage platforms.

**Design References**: Draw inspiration from modern Web3 platforms (Uniswap's interface clarity, OpenSea's dashboard patterns, MetaMask's trust signals) combined with futuristic glassmorphism aesthetics.

## Core Design Elements

### A. Typography

**Font Families** (via Google Fonts CDN):
- **Primary/Display**: Orbitron (700, 600, 500) - Used for headings, navigation, major CTAs, file IDs, and blockchain data
- **Body/UI**: Poppins (400, 500, 600) - Used for body text, descriptions, form labels, card content
- **Data/Technical**: Space Grotesk (400, 500) - Used for addresses, CIDs, timestamps, technical specifications

**Hierarchy**:
- Hero/Main Title: Orbitron 700, 3.5rem (mobile: 2rem)
- Section Headers: Orbitron 600, 2rem (mobile: 1.5rem)
- Card Titles: Poppins 600, 1.25rem
- Body Text: Poppins 400, 1rem
- Metadata/Technical: Space Grotesk 400, 0.875rem
- Micro-copy: Poppins 400, 0.75rem

### B. Layout System

**Tailwind Spacing Units**: Consistently use p-4, p-6, p-8, m-4, m-6, m-8, gap-4, gap-6, gap-8, space-y-6, space-y-8
- Card padding: p-6 (mobile: p-4)
- Section padding: py-12 md:py-20 (generous vertical rhythm)
- Grid gaps: gap-6 (mobile: gap-4)
- Container max-width: max-w-7xl mx-auto px-4

**Grid Patterns**:
- Dashboard file cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Access control panels: Two-column layout on desktop (form + list)

### C. Color Palette (User-Specified)

**Primary Colors**:
- Deep Navy: #0A0F24 (primary background, card backgrounds)
- Neon Cyan: #00FFFF (primary accent, active states, highlights)
- Teal Accent: #00BFA6 (secondary accent, success states)
- Neutral Gray: #A0A0A0 (secondary text, borders)

**Gradients**:
- Background: linear-gradient(135deg, #0A0F24 0%, #000000 100%)
- Button Primary: linear-gradient(90deg, #00FFFF 0%, #00BFA6 100%)
- Card Overlays: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 191, 166, 0.05) 100%)

**Glassmorphism Treatment**:
- Background: rgba(10, 15, 36, 0.6)
- Backdrop blur: 12px
- Border: 1px solid rgba(0, 255, 255, 0.2)
- Subtle inner glow using box-shadow with cyan at 0.15 opacity

### D. Component Library

**Navigation Bar**:
- Fixed top position with glassmorphism effect
- Logo (left): TrustDAG branding with neon glow
- Center: Role indicator badge, file count badge
- Right: Connected wallet address (truncated), network status indicator
- Mobile: Hamburger menu with slide-in drawer

**Hero Section** (Landing/Welcome Page):
- Large hero image showing abstract blockchain network visualization or encrypted data flow
- Overlaid heading with Orbitron font describing "Decentralized File Storage"
- Two-button CTA: "Connect Wallet" (primary gradient) + "Learn More" (outline with glow)
- Subtle animated particles or grid overlay
- Background buttons should have blur backdrop

**Dashboard Cards**:
- Glassmorphism cards with rounded corners (rounded-xl)
- Card header: File icon + File type badge + Timestamp
- Card body: CID (truncated with copy button), File ID, Owner address
- Card footer: Access count badge + Action buttons (Grant/Revoke/Download)
- Hover state: Subtle cyan glow intensification

**Upload Module**:
- Large drag-and-drop zone with dashed cyan border
- File preview area
- Role selector dropdown with custom styled options
- Encryption status indicator
- Progress bar with gradient fill during upload
- Success state with file ID display and IPFS CID

**Access Control Panel**:
- Split layout: Left (Form to grant access), Right (List of granted addresses)
- Address input with validation styling
- Grant button with confirmation modal
- Revoke buttons with warning state
- Visual indicators for access status (granted/pending/revoked)

**Audit Trail**:
- Timeline-style event list with vertical connector line
- Event cards showing: Event type icon, timestamp, actor address, file ID
- Filter buttons at top: All/Uploads/Grants/Revokes/Access
- Color-coded event types (Upload: cyan, Grant: green, Revoke: red, Access: blue)

**Modals/Dialogs**:
- Glassmorphism overlay with darker backdrop
- Centered modal with neon border glow
- Clear action buttons (primary + secondary)
- Close icon top-right

**Form Elements**:
- Input fields: Dark background with cyan border on focus
- Labels: Poppins 500, small text with cyan accent
- Buttons: Gradient fill (primary), outlined with glow (secondary)
- Dropdowns: Custom styled with glassmorphism treatment
- Checkboxes/Radio: Cyan accent with subtle glow on selection

**Buttons**:
- Primary: Gradient cyan-to-teal, Orbitron 500, rounded-lg, px-6 py-3
- Secondary: Outlined with cyan border, transparent background with blur
- Icon buttons: Square/circular with glassmorphism, icon-only
- Hover states: Intensified glow, slight scale (1.02)
- Disabled: Reduced opacity (0.5), no glow

**Badges/Pills**:
- Role badges: Colored background with role name (Health: green, Government: blue, etc.)
- Status indicators: Small pills with dot + text
- File type badges: Icon + extension label

**Icons** (Lucide Icons via CDN):
- Use throughout for: Upload, Download, Lock/Unlock, User, File, Settings, Trash, Copy, Check, Alert
- Size: 20px standard, 24px for primary actions, 16px for inline
- Color: Inherit from parent or cyan accent

### E. Animations

**Subtle Interactions** (use sparingly):
- Card hover: Subtle glow intensification (0.3s ease)
- Button hover: Slight scale + glow (0.2s ease)
- Modal appearance: Fade in + scale up (0.3s ease-out)
- Loading states: Pulsing gradient on progress bars
- Success feedback: Checkmark with brief scale animation
- NO complex scroll animations or excessive motion

**Loading States**:
- Spinner: Rotating cyan gradient circle
- Skeleton screens: Pulsing glassmorphism placeholders
- Progress indicators: Animated gradient fill

## Page-Specific Layouts

**Landing Page** (if separate from dashboard):
- Hero with large background image (blockchain visualization)
- Features grid (3 columns): Security, Decentralization, Access Control
- How It Works section: 3-step process with icons
- Role overview cards showing different user types
- CTA section: "Start Securing Your Files"
- Footer: Links, social icons, contract address display

**Dashboard/Main App**:
- Top: Navigation bar with wallet connection
- Left sidebar (desktop): Quick actions, role status, stats
- Main area: File cards grid with filters and search
- Right panel (optional): Recent activity feed
- Bottom: Pagination for file list

**Upload Page**:
- Centered upload zone taking 60% width
- Step indicator at top (Select → Encrypt → Upload → Confirm)
- File preview and metadata form below drop zone
- Clear status messages for each step

**Access Management Page**:
- File selector at top
- Two-panel layout: Grant form + Current access list
- Visual representation of access graph (optional)

**Audit Page**:
- Full-width timeline view
- Filters sidebar on left
- Event cards in center with search functionality
- Export button for audit logs

## Images

**Hero Image**: Abstract visualization of blockchain network with nodes and connections, or encrypted data streams flowing through a digital grid. Dark background with cyan/teal glowing elements. Full-width, 60vh height (mobile: 40vh).

**Feature Icons**: Use Lucide icon library for all feature representations (Shield for security, Network for decentralization, Key for access control).

**Empty States**: Custom illustrations for "No files uploaded", "No access granted", showing stylized locked folder or empty vault with cyan accents.

## Design Principles

1. **Trust Through Transparency**: All blockchain interactions clearly displayed with transaction states
2. **Security-First Visual Language**: Lock icons, encrypted badges, verification checkmarks throughout
3. **Progressive Disclosure**: Complex features (encryption details, contract events) hidden behind expandable sections
4. **Immediate Feedback**: All user actions provide instant visual confirmation
5. **Consistent Glassmorphism**: Every card, modal, and container uses the same glass treatment for brand cohesion
6. **Neon Accents Sparingly**: Cyan glow reserved for interactive elements and success states
7. **Technical Information Accessible**: CIDs, addresses, file IDs always copyable with one click
8. **Mobile-First Responsive**: All layouts stack gracefully on mobile with maintained functionality