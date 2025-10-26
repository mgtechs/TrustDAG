# TrustDAG - Decentralized File Storage DApp

## Project Overview

TrustDAG is a decentralized file storage application featuring blockchain-based access control, IPFS storage, and client-side AES-256 encryption. The application provides a secure, transparent, and trustless way to store and share files.

**Last Updated:** October 26, 2025

---

## Tech Stack

### Frontend
- **React** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching and caching
- **Tailwind CSS** with Web3 glassmorphism design
- **Shadcn UI** components
- **Lucide React** for icons

### Backend
- **Express.js** server
- **In-memory storage** (MemStorage)
- **Zod** for validation

### Blockchain & Storage
- **MetaMask** for wallet connection
- **BDAG Network** (custom blockchain)
- **IPFS** for decentralized file storage (Web3.Storage/Pinata)
- **Web3 Crypto API** for AES-256 encryption

---

## Project Structure

```
TrustDAG/
├── client/src/
│   ├── components/
│   │   ├── ui/              # Shadcn UI components
│   │   ├── GlassCard.tsx    # Web3 glassmorphism card component
│   │   └── Navbar.tsx       # Main navigation with wallet connection
│   ├── pages/
│   │   ├── Home.tsx         # Landing page with hero section
│   │   ├── Dashboard.tsx    # File management dashboard
│   │   ├── Upload.tsx       # File upload with encryption
│   │   ├── Access.tsx       # Access control panel
│   │   ├── Audit.tsx        # Audit trail timeline
│   │   └── Profile.tsx      # User profile settings
│   ├── hooks/
│   │   └── useWallet.ts     # Wallet connection hook
│   ├── lib/
│   │   ├── web3.ts          # Web3 utilities and contract ABI
│   │   ├── encryption.ts    # AES-256 encryption utilities
│   │   ├── queryClient.ts   # TanStack Query configuration
│   │   └── utils.ts         # General utilities
│   └── App.tsx              # Main app with routing
├── server/
│   ├── routes.ts            # API endpoint definitions
│   ├── storage.ts           # In-memory storage implementation
│   └── index.ts             # Express server setup
├── shared/
│   └── schema.ts            # Shared TypeScript types and Zod schemas
└── design_guidelines.md     # Web3 glassmorphism design system
```

---

## Features Implemented

### ✅ Phase 1: Schema & Frontend (Complete)

**Data Models:**
- Files table with metadata (name, size, IPFS CID, encryption key, file ID)
- Access grants table for permissions tracking
- Audit events table for operation logging
- User preferences table for profile settings

**React Components:**
1. **Home Page**
   - Hero section with blockchain network image
   - Feature cards (encryption, IPFS, access control, audit trail)
   - CTA sections with wallet connection
   - Responsive design with glassmorphism effects

2. **Dashboard**
   - File cards grid with metadata
   - Stats overview (total files, encryption, storage)
   - File actions (download, manage access)
   - Empty state with upload CTA

3. **Upload Page**
   - Drag-and-drop file zone
   - File preview with metadata
   - Upload progress with encryption status
   - Success state with file ID and CID

4. **Access Control**
   - Grant access form (file selection, address input, role selector)
   - Granted access list with revoke buttons
   - Role badges (viewer/editor)
   - Permission explanations

5. **Audit Trail**
   - Event timeline with color-coded icons
   - Event type filters (all, uploads, grants, revokes, access)
   - Stats cards for each event type
   - Detailed event information

6. **Profile Page**
   - Wallet information card
   - Profile settings form (display name, email)
   - Notification preferences toggle
   - Security information

**Layout & Design:**
- Web3 glassmorphism theme with backdrop blur
- Neon cyan (#00FFFF) and teal (#00BFA6) accents
- Fixed navbar with wallet connection
- Responsive mobile navigation
- Gradient backgrounds and glowing effects

---

## Design System

### Color Palette
- **Deep Navy:** #0A0F24 (backgrounds, cards)
- **Neon Cyan:** #00FFFF (primary accent, active states)
- **Teal:** #00BFA6 (secondary accent, success)
- **Gray:** #A0A0A0 (secondary text, borders)

### Typography
- **Headings:** Orbitron (700, 600, 500)
- **Body:** Poppins (400, 500, 600)
- **Technical:** Space Grotesk (400, 500)

### Glassmorphism Effects
- Background: `rgba(10, 15, 36, 0.6)`
- Backdrop blur: `12px`
- Border: `1px solid rgba(0, 255, 255, 0.2)`
- Glow shadow: `0 0 10px rgba(0, 255, 255, 0.15)`

---

## Environment Variables

**Required Secrets:**
- `VITE_BDAG_RPC` - BDAG network RPC endpoint
- `VITE_CHAIN_ID` - BDAG chain ID (decimal)
- `VITE_WEB3STORAGE_TOKEN` - Web3.Storage API token
- `VITE_IPFS_API_KEY` - Pinata API key (fallback)
- `VITE_IPFS_API_SECRET` - Pinata API secret (fallback)
- `SESSION_SECRET` - Express session secret

---

## Smart Contract

**Address:** `0x6370e5bF266a7197F0426eB35cB01677BdcD2B3e`

**Functions:**
- `uploadFile(string cid)` - Register file upload
- `grantAccess(uint256 fileId, address user)` - Grant access
- `revokeAccess(uint256 fileId, address user)` - Revoke access
- `hasAccess(uint256 fileId, address user)` - Check access
- `files(uint256)` - Get file info

---

## API Endpoints (To Be Implemented)

### Files
- `GET /api/files` - Get all files for connected wallet
- `POST /api/files` - Upload file metadata
- `GET /api/files/:id` - Get file by ID
- `DELETE /api/files/:id` - Delete file

### Access Control
- `GET /api/access-grants` - Get access grants for file
- `POST /api/access-grants` - Grant access
- `DELETE /api/access-grants/:id` - Revoke access

### Audit Trail
- `GET /api/audit-events` - Get audit events
- `POST /api/audit-events` - Log audit event

### User Preferences
- `GET /api/user-preferences/:address` - Get user preferences
- `POST /api/user-preferences` - Update user preferences

---

## Development Status

**Current Phase:** Phase 3 - Integration & Testing (In Progress)
**Completed Phases:** 
- Phase 1: Schema & Frontend ✅
- Phase 2: Backend Implementation ✅

### Implementation Complete
1. ✅ Data schemas for files, access grants, audit events, user preferences
2. ✅ All React components with Web3 glassmorphism design
3. ✅ Backend API endpoints for all CRUD operations
4. ✅ IPFS integration (Web3.Storage + Pinata fallback)
5. ✅ Client-side AES-256 encryption/decryption
6. ✅ Frontend-backend integration with TanStack Query
7. ✅ Real file upload/download with encryption
8. ✅ Access control grant/revoke functionality
9. ✅ Audit trail logging and display
10. ✅ User preferences management

### Testing In Progress
- Full end-to-end user journey testing
- Wallet connection and network switching
- File encryption and IPFS upload flow
- Access control operations
- Audit trail verification

---

## User Preferences

- Design aesthetic: Web3 glassmorphism with neon accents
- Color scheme: Deep navy, cyan, and teal
- Component style: Shadcn UI with custom glassmorphism
- Typography: Modern tech fonts (Orbitron, Poppins, Space Grotesk)

---

## Notes

- All frontend components follow design_guidelines.md religiously
- Glassmorphism effects applied consistently across all cards and overlays
- Responsive design with mobile-first approach
- Accessibility considerations with proper ARIA labels and test IDs
- Wallet connection required for all authenticated pages
- File encryption happens client-side before IPFS upload
