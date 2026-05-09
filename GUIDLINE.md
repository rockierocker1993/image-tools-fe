# front end image tools

## Project Overview`\n\n`Bangun frontend modern untuk platform AI Image Tools menggunakan Next.js, NestJS, dan shadcn/ui.`\n\n`Website memiliki dua fitur utama:`\n\n`- Remove Background`\n`- Image Upscaler`\n\n`Sistem terintegrasi dengan backend melalui REST API dan WebSocket.`\n\n`Konsep processing bersifat asynchronous dan event-driven:`\n`- User upload gambar`\n`- Frontend mengirim request ke backend`\n`- Backend memproses job secara async`\n`- Frontend subscribe status job menggunakan WebSocket`\n`- Ketika proses selesai, frontend menerima event realtime dan otomatis menampilkan hasil gambar`\n\n`Project harus:`\n`- scalable`\n`- readable`\n`- maintainable`\n`- modular`\n`- reusable`\n`- production-ready`\n`- clean architecture`\n`- responsive`\n`- modern UI/UX`\n\n`Gunakan TypeScript strict mode.`\n\n`---`\n\n`# Main Tech Stack`\n\n`## Frontend`\n\n`Gunakan:`\n\n`- Next.js 15+`\n`- React 19+`\n`- TypeScript`\n`- TailwindCSS`\n`- shadcn/ui`\n`- Zustand`\n`- TanStack Query`\n`- Axios`\n`- Socket.IO Client`\n`- Framer Motion`\n`- React Hook Form`\n`- Zod`\n`- Lucide React Icons`\n\n`## Backend Integration`\n\n`Frontend harus terintegrasi dengan:`\n`- REST API`\n`- WebSocket realtime event`\n\n`## Optional Recommended`\n\n`Tambahkan:`\n`- next-auth atau JWT auth handling`\n`- react-dropzone`\n`- react-image-crop`\n`- react-hot-toast / sonner`\n`- react-photo-view`\n`- cmdk`\n`- class-variance-authority`\n`- tailwind-merge`\n\n`---`\n\n`# Architecture Requirements`\n\n`Gunakan struktur enterprise-grade.`\n\n`## Folder Structure`\n\n```` ```txt ````\n`src/`\n` ├── app/`\n` ├── modules/`\n` │    ├── remove-background/`\n` │    ├── upscaler/`\n` │    ├── editor/`\n` │    ├── auth/`\n` │    └── dashboard/`\n` │`\n` ├── components/`\n` │    ├── ui/`\n` │    ├── layout/`\n` │    ├── editor/`\n` │    └── shared/`\n` │`\n` ├── services/`\n` │    ├── api/`\n` │    ├── websocket/`\n` │    └── storage/`\n` │`\n` ├── hooks/`\n` ├── store/`\n` ├── types/`\n` ├── utils/`\n` ├── lib/`\n` ├── constants/`\n` └── styles/`

Project harus:

* modular
* feature-based architecture
* reusable component
* isolated business logic
* clean separation responsibility


---

# Application Flow

## Remove Background Flow


1. User upload image
2. Frontend call REST API create job
3. Backend return:
   * jobId
   * status
4. Frontend connect WebSocket
5. Frontend subscribe ke:
   * remove-background:{jobId}
6. Backend emit realtime event:
   * PROCESSING
   * COMPLETED
   * FAILED
7. Ketika COMPLETED:
   * preview otomatis update
   * user bisa edit hasil
   * tombol download aktif


---

# WebSocket Requirements

Gunakan Socket.IO.

Implement:

* auto reconnect
* heartbeat
* retry connection
* event subscription per job
* reconnect handling
* loading synchronization

Buat service websocket reusable.

Contoh event:

`remove-background:processing`\n`remove-background:completed`\n`remove-background:failed`\n\n`upscaler:processing`\n`upscaler:completed`\n`upscaler:failed`


---

# REST API Requirements

Gunakan Axios wrapper.

Implement:

* request interceptor
* auth interceptor
* global error handling
* timeout handling
* retry strategy

Buat API layer terpisah.

Contoh:

`services/api/remove-background.api.ts`\n`services/api/upscaler.api.ts`


---

# UI/UX Requirements

## Main Design Style

Gunakan:

* modern SaaS UI
* clean
* minimal
* elegant
* smooth animation
* whitespace-heavy layout

JANGAN meniru visual Canva secara langsung.

Yang ditiru:

* user experience
* layout flow
* editor interaction
* positioning
* usability

Gunakan style bawaan shadcn/ui sebagai foundation.


---

# Logged In User Experience

## Dashboard Layout

Untuk user login:

* gunakan dashboard layout modern
* sidebar collapsible
* top navigation
* workspace-centered UI
* mirip editor SaaS modern

Menu:

* Dashboard
* Remove Background
* Upscaler
* History
* Billing
* Settings

Gunakan:

* command palette
* breadcrumb
* recent project
* upload shortcut


---

# Guest / Non Login Experience

## Landing Page Style

Route public:

`/remove-background`\n`/upscaler`

Untuk non-login:

* tidak ada dashboard
* tidak ada sidebar
* layout seperti landing page modern
* fokus langsung ke upload image

Halaman harus:

* cepat dipahami
* conversion-focused
* CTA jelas
* mobile friendly

Section:

* Hero section
* Upload area
* Before/After preview
* Feature explanation
* FAQ
* CTA button


---

# Image Editor Requirements

Ketika upload berhasil:

* tampilkan editor image modern

## Layout

### Top Toolbar

* Tinggi sekitar 56px
* Rounded pill style
* Background putih
* Soft shadow ringan

Isi toolbar:

* Cutout
* Background
* Effects
* Adjust
* Design
* Undo
* Redo

Gunakan:

* outline icon modern
* hover animation
* active state
* subtle transition

Di kanan:

* tombol biru primary "Download"
* dropdown arrow


---

## Canvas Area

* Center aligned
* Preview portrait vertical
* Rounded card 20px
* Transparent checker background
* Floating action button di atas gambar
* Editable preview

Tambahkan:

* zoom
* pan
* compare original/result
* drag interaction


---

## Bottom Thumbnail Section

* Horizontal layout
* Rounded thumbnail
* Active border biru
* Add image button (+)
* Scrollable pada mobile


---

# Animation Requirements

Gunakan Framer Motion.

Implement:

* fade animation
* image transition
* upload progress animation
* loading skeleton
* websocket state transition

Animation harus:

* smooth
* cepat
* subtle
* professional


---

# Upload Experience

Gunakan drag & drop modern.

Requirements:

* drag overlay
* upload progress
* file validation
* image compression
* preview sebelum upload

Supported:

* PNG
* JPG
* WEBP


---

# State Management

Gunakan:

* Zustand untuk UI state
* TanStack Query untuk server state

Pisahkan:

* websocket state
* upload state
* editor state
* authentication state


---

# Responsive Requirements

Desktop:

* centered workspace
* full editor mode

Tablet:

* toolbar horizontal scroll

Mobile:

* collapsible toolbar
* bottom action sheet
* responsive preview


---

# Performance Requirements

* lazy loading
* code splitting
* optimized image rendering
* suspense loading
* virtualized history list
* websocket efficient reconnect
* avoid unnecessary rerender

Gunakan:

* React.memo
* dynamic import
* useCallback/useMemo properly


---

# Accessibility Requirements

Implement:

* keyboard navigation
* aria label
* focus state
* semantic HTML
* screen reader support


---

# Theme Requirements

Support:

* light mode
* dark mode

Gunakan:

* next-themes


---

# Error Handling

Implement:

* websocket disconnected state
* upload failed state
* retry upload
* API timeout state
* empty state
* skeleton loading


---

# Authentication Requirements

Support:

* JWT authentication
* refresh token
* protected route
* guest mode


---

# Deliverables

Generate:


 1. Full frontend architecture
 2. Reusable UI components
 3. Dashboard layout
 4. Public landing pages
 5. Upload module
 6. WebSocket realtime integration
 7. REST API integration layer
 8. Image editor UI
 9. Zustand store structure
10. TanStack Query integration
11. Responsive design
12. Dark mode support
13. Framer Motion animation
14. Error boundary
15. Loading skeleton
16. Production-ready folder structure


---

# Coding Standards

Requirements:

* clean code
* reusable components
* readable naming
* no massive component
* strict typing
* avoid any type
* SOLID principles
* scalable architecture

Gunakan:

* feature-based architecture
* composition pattern
* custom hooks
* shared design system


---

# Final Goal

Hasil akhir harus terlihat seperti:

* modern AI SaaS platform
* polished
* professional
* scalable
* premium product quality

Dengan user experience:

* cepat
* seamless
* realtime
* intuitive
* responsive
* production ready