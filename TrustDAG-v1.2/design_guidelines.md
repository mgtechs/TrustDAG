# TrustDAG Design Guidelines

## Design Approach: Web3 Glassmorphism

**Selected Approach:** Custom Web3 aesthetic combining glassmorphism with blockchain/tech-forward visual language for a trustworthy, cutting-edge decentralized storage platform.

**Design References:** Modern Web3 platforms (Uniswap's interface clarity, OpenSea's dashboard patterns, MetaMask's trust signals) combined with futuristic glassmorphism aesthetics.

---

## Typography

**Font Families** (Google Fonts CDN):
- **Orbitron** (700, 600, 500): Headings, navigation, CTAs, file IDs, blockchain data
- **Poppins** (400, 500, 600): Body text, descriptions, form labels, card content
- **Space Grotesk** (400, 500): Addresses, CIDs, timestamps, technical data

**Hierarchy:**
- Hero/Main Title: Orbitron 700, 3.5rem (mobile: 2rem)
- Section Headers: Orbitron 600, 2rem (mobile: 1.5rem)
- Card Titles: Poppins 600, 1.25rem
- Body Text: Poppins 400, 1rem
- Metadata/Technical: Space Grotesk 400, 0.875rem
- Micro-copy: Poppins 400, 0.75rem

---

## Layout System

**Tailwind Spacing:** Consistently use p-4, p-6, p-8, m-4, m-6, m-8, gap-4, gap-6, gap-8, space-y-6, space-y-8

**Structure:**
- Card padding: p-6 (mobile: p-4)
- Section padding: py-12 md:py-20
- Grid gaps: gap-6 (mobile: gap-4)
- Container: max-w-7xl mx-auto px-4

**Grid Patterns:**
- Dashboard file cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Feature sections: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Access control: Two-column desktop layout

---

## Color Palette

**Primary Colors:**
- Deep Navy: #0A0F24 (backgrounds, cards)
- Neon Cyan: #00FFFF (primary accent, active states)
- Teal Accent: #00BFA6 (secondary accent, success)
- Neutral Gray: #A0A0A0 (secondary text, borders)

**Gradients:**
- Background: linear-gradient(135deg, #0A0F24 0%, #000000 100%)
- Primary Button: linear-gradient(90deg, #00FFFF 0%, #00BFA6 100%)
- Card Overlays: linear-gradient(135deg, rgba(0, 255, 255, 0.1) 0%, rgba(0, 191, 166, 0.05) 100%)

**Glassmorphism Treatment:**
- Background: rgba(10, 15, 36, 0.6)
- Backdrop blur: 12px
- Border: 1px solid rgba(0, 255, 255, 0.2)
- Inner glow: box-shadow with cyan at 0.15 opacity

---

## Component Library

**Navigation Bar:**
- Fixed top with glassmorphism
- Logo (left) with neon glow
- Center: Role badge, file count badge
- Right: Wallet address (truncated), network status
- Mobile: Hamburger with slide-in drawer

**Hero Section:**
- Large hero image: Abstract blockchain network visualization or encrypted data flow
- Overlaid heading: "Decentralized File Storage" (Orbitron)
- Two-button CTA: "Connect Wallet" (gradient) + "Learn More" (outline with glow)
- Animated particles or grid overlay
- Buttons with blur backdrop

**Dashboard Cards:**
- Glassmorphism with rounded-xl corners
- Header: File icon + Type badge + Timestamp
- Body: CID (truncated with copy), File ID, Owner address
- Footer: Access count + Action buttons (Grant/Revoke/Download)
- Hover: Subtle cyan glow intensification

**Upload Module:**
- Large drag-and-drop zone with dashed cyan border
- File preview area
- Role selector dropdown
- Encryption status indicator
- Progress bar with gradient fill
- Success state with file ID and IPFS CID

**Access Control Panel:**
- Split layout: Grant form (left) + Granted addresses list (right)
- Address input with validation styling
- Grant button with confirmation modal
- Revoke buttons with warning state
- Visual access status indicators

**Audit Trail:**
- Timeline-style vertical event list
- Event cards: Icon, timestamp, actor address, file ID
- Top filters: All/Uploads/Grants/Revokes/Access
- Color-coded events (Upload: cyan, Grant: green, Revoke: red, Access: blue)

**Form Elements:**
- Dark background inputs with cyan border on focus
- Labels: Poppins 500, cyan accent
- Buttons: Gradient (primary), outlined with glow (secondary)
- Custom styled dropdowns with glassmorphism
- Checkboxes/Radio: Cyan accent with glow

**Buttons:**
- Primary: Gradient cyan-to-teal, Orbitron 500, rounded-lg, px-6 py-3
- Secondary: Outlined cyan border, transparent with blur
- Icon buttons: Square/circular glassmorphism
- Hover: Intensified glow, slight scale (1.02)
- Disabled: 0.5 opacity, no glow

**Icons** (Lucide via CDN):
- Upload, Download, Lock/Unlock, User, File, Settings, Trash, Copy, Check, Alert
- Sizes: 16px (inline), 20px (standard), 24px (primary actions)

---

## Animations

**Subtle Interactions:**
- Card hover: Glow intensification (0.3s ease)
- Button hover: Scale + glow (0.2s ease)
- Modal: Fade + scale (0.3s ease-out)
- Progress bars: Pulsing gradient
- Success: Checkmark scale animation
- NO complex scroll animations

**Loading States:**
- Rotating cyan gradient spinner
- Pulsing glassmorphism skeleton screens

---

## Images

**Hero Image:**
Abstract blockchain network with nodes and connections, or encrypted data streams through digital grid. Dark background with cyan/teal glowing elements. Full-width, 60vh height (mobile: 40vh).

**Feature Icons:**
Lucide icons for all features (Shield for security, Network for decentralization, Key for access control).

**Empty States:**
Stylized locked folder or empty vault illustrations with cyan accents for "No files uploaded" and "No access granted" states.

---

## Design Principles

1. **Trust Through Transparency:** All blockchain interactions clearly displayed
2. **Security-First Visual Language:** Lock icons, encrypted badges, verification checkmarks
3. **Progressive Disclosure:** Complex features hidden behind expandable sections
4. **Immediate Feedback:** Instant visual confirmation for all actions
5. **Consistent Glassmorphism:** Unified glass treatment across all containers
6. **Neon Accents Sparingly:** Cyan glow reserved for interactive and success states
7. **Technical Accessibility:** CIDs, addresses, file IDs always copyable
8. **Mobile-First Responsive:** Graceful stacking on mobile with maintained functionality