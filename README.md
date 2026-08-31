# ✨ Xpovio — Modern Digital Agency & Creative Portfolio

<div align="center">

![Astro](https://img.shields.io/badge/Astro-5.0+-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-Modern%20Design%20System-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![GSAP](https://img.shields.io/badge/GSAP-ScrollTrigger%20%26%20SplitText-88CE02?style=for-the-badge&logo=greensock&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)

**A high-performance, responsive, and animated multi-page website featuring 25 distinct routes, seamless View Transitions, custom cursor interactions, dynamic GSAP motion design, and modular component architecture.**

[Explore Routes](#-complete-route-directory) • [Key Features](#-key-features) • [Getting Started](#-getting-started) • [Architecture](#-architecture--tech-stack)

</div>

---

## 🌟 Overview

**Xpovio** is a cutting-edge creative digital agency and portfolio template engineered with **Astro**. It offers a premium visual aesthetic with dark and light themes, rich typography, magnetic interactions, fluid typography, and complex GSAP-driven scroll animations.

Originally ported from legacy multi-page HTML/PHP markup, this project demonstrates modern frontend engineering best practices by consolidating repetitive markup into reusable Astro layouts and components, orchestrating complex JavaScript lifecycles across Astro's client-side `<ClientRouter />`, and achieving sub-second build times with zero runtime layout thrashing.

---

## 🎯 Key Features

- ⚡ **25 Fully Interactive Routes**: Includes 5 unique homepage archetypes (Creative Agency, Digital Agency, IT Solutions, Personal Portfolio, and Interactive Portfolio) in both Dark & Light modes, along with complete inner pages (Services, Projects, Case Studies, Story, Team, Testimonials, FAQ, Blog, Contact, and 404).
- 🔄 **Astro `<ClientRouter />` (View Transitions)**: Native SPA-like page navigation with smooth page swaps and lifecycle hooks (`astro:page-load`, `astro:before-swap`).
- 🎭 **GSAP Motion Suite**:
  - SplitText typography reveals (`.title-anim`, `.folks-text`).
  - ScrollTrigger viewport animations (`.fade-left`, `.fade-right`, `.fade-top`, `.fade-down`).
  - Pinned horizontal project showcases (`.project-sl`, `.banner-five`).
  - Parallax thumb and floating tag animations.
- 🎠 **16 Slick Carousel Variations**: Infinite auto-scrolling ticker bands, testimonial sliders, team showcases, project posters, and sponsor logo strips.
- 🧮 **Isotope Masonry Grid**: Instant category-filtered portfolio masonry with smooth layout transitions.
- 🖱️ **Interactive Dual Cursor**: Custom outer & inner cursor follower with hover expansion on interactive links and cursor-following floating image cards.
- 📱 **100% Responsive Design**: Pixel-perfect scaling across mobile, tablet, laptop, and ultra-wide displays.
- 🎨 **Multi-Variant Design System**: Dynamic header & footer variants with contextual theming.

---

## 🏗️ Architecture & Tech Stack

```
xpovio-astro/
├── public/
│   └── assets/
│       ├── css/
│       │   └── main.min.css          # Core design tokens, typography & animations
│       ├── images/                   # Optimized images, SVGs, and MP4 videos
│       ├── js/
│       │   └── app-init.js           # ClientRouter lifecycle & animation controller
│       └── vendor/                   # GSAP, Slick, Bootstrap, Isotope, FontAwesome
├── src/
│   ├── components/
│   │   ├── Breadcrumb.astro          # Hero breadcrumb for inner pages
│   │   ├── Cursor.astro              # Custom dual-cursor follower
│   │   ├── Footer.astro              # 4 footer variants (default, cmn, three, four)
│   │   ├── Header.astro              # 5 navigation headers (secondary, cmn, tertiary, quaternary, quinary)
│   │   ├── MobileMenu.astro          # Mobile drawer menu
│   │   ├── OffcanvasMenu.astro       # Fullscreen drawer with staggered animations
│   │   ├── Preloader.astro           # Non-blocking page loader
│   │   ├── ScrollToTop.astro         # Circular SVG scroll progress indicator
│   │   └── VideoModal.astro          # Corner video popup player
│   ├── layouts/
│   │   └── Layout.astro              # Base document layout with ClientRouter
│   └── pages/                        # 25 Astro route templates
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

### Technologies Used

| Technology | Purpose |
| :--- | :--- |
| **Astro 5+** | Static Site Generation (SSG) & Island Architecture |
| **GSAP (GreenSock)** | ScrollTrigger, SplitText, ScrollTo, and Chroma color gradients |
| **Slick Carousel** | Smooth multi-breakpoint slider configurations |
| **Isotope** | Dynamic grid filtering and masonry layouts |
| **Vanilla CSS / SASS** | Custom properties, responsive media queries, keyframes |
| **FontAwesome 6 Pro & Glyyphter** | Vector icons and brand glyphs |

---

## 🗺️ Complete Route Directory

| Route | Page Title / Description | Navbar Variant | Footer Variant | Theme |
| :--- | :--- | :--- | :--- | :--- |
| `/` | Creative Agency (Home 1) | `secondary` | `one` | Dark |
| `/index-light` | Creative Agency Light | `secondary` | `one` | Light |
| `/index-two` | Digital Agency (Home 2) | `cmn` | `two` | Dark |
| `/index-two-light` | Digital Agency Light | `cmn` | `two` | Light |
| `/index-three` | IT Solutions (Home 3) | `tertiary` | `three` | Dark |
| `/index-three-light` | IT Solutions Light | `tertiary` | `three` | Light |
| `/index-four` | Personal Portfolio (Home 4) | `quaternary` | `four` | Dark |
| `/index-four-light` | Personal Portfolio Light | `quaternary` | `four` | Light |
| `/index-five` | Interactive Portfolio (Home 5) | `quinary` | `four` | Dark |
| `/index-five-light` | Interactive Portfolio Light | `quinary` | `four` | Light |
| `/about-us` | About Company & Story | `cmn` | `two` | Dark |
| `/our-story` | Company History & Milestones | `cmn` | `two` | Dark |
| `/our-services` | Service Capabilities & Offerings | `cmn` | `two` | Dark |
| `/service-single` | Single Service Case Study | `cmn` | `two` | Dark |
| `/our-projects` | Projects Grid Showcase | `cmn` | `two` | Dark |
| `/project-single` | Project In-Depth Case Study | `cmn` | `two` | Dark |
| `/our-teams` | Team Members Directory | `cmn` | `two` | Dark |
| `/team-single` | Member Profile & Experience | `cmn` | `two` | Dark |
| `/portfolio` | Masonry Portfolio with Filter Tabs | `cmn` | `two` | Dark |
| `/client-feedback` | Client Reviews & Testimonials | `cmn` | `two` | Dark |
| `/faq` | Frequently Asked Questions | `cmn` | `two` | Dark |
| `/blog` | Articles & Insights Archive | `cmn` | `two` | Dark |
| `/blog-single` | Single Blog Post & Discussion | `cmn` | `two` | Dark |
| `/contact-us` | Contact Form & Map Location | `cmn` | `two` | Dark |
| `/404` | Custom 404 Error Page | `cmn` | `two` | Dark |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.17.0` or higher (Node `v20+` recommended)
- **npm**, **pnpm**, or **yarn**

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/your-username/xpovio-astro.git

# 2. Navigate to project root
cd xpovio-astro

# 3. Install dependencies
npm install
```

### Development Server

Start the local development server with hot module reloading:

```bash
npm run dev
```

The application will be accessible at `http://localhost:4321`.

### Production Build

Compile the static bundle for production deployment:

```bash
npm run build
```

To test the generated static output locally:

```bash
npm run preview
```

---

## ⚡ Performance & Lifecycle Optimizations

1. **Non-Blocking Asset Loading**: Scripts and heavy stylesheets are organized to prevent render-blocking and layout shifts.
2. **Lifecycle Cleanups**: The `app-init.js` controller safely unmounts and re-initializes GSAP triggers and Slick instances between Astro page swaps (`astro:before-swap` and `astro:page-load`), avoiding memory leaks and cloned DOM artifacts.
3. **Instant Responsive Scroll**: Native browser scrolling enhanced with GSAP `ScrollTrigger` ensures immediate trackpad/wheel feedback without virtual scrollbar locking.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
