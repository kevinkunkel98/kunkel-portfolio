# Astro Starter Kit: Mini# Portfolio Website

A modern portfolio website built with Astro.js, React, and Tailwind CSS. Features sections for machine learning and web development projects, a blog, and a contact form.

## ✨ Features

- **Modern Stack**: Built with Astro.js for optimal performance
- **Interactive Components**: React components with selective hydration
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Blog System**: Content collections for type-safe blog management
- **Project Showcase**: Dedicated sections for ML and web development projects
- **Contact Form**: Interactive contact form with validation
- **SEO Optimized**: Built-in SEO optimizations and meta tags
- **Dark Mode Ready**: Prepared for dark/light theme switching

## 🚀 Tech Stack

- **Framework**: [Astro.js](https://astro.build/) - Zero JS by default, fast performance
- **UI Library**: [React](https://reactjs.org/) - For interactive components
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- **Typography**: [@tailwindcss/typography](https://tailwindcss.com/docs/typography-plugin) - Beautiful blog post styling
- **Language**: TypeScript for type safety
- **Content**: Markdown with frontmatter for blog posts

## 📁 Project Structure

```
/
├── public/                 # Static assets
│   ├── favicon.svg
│   └── ...
├── src/
│   ├── components/         # Reusable components
│   │   ├── Navigation.astro
│   │   ├── Footer.astro
│   │   ├── ContactForm.tsx    # React component
│   │   └── ProjectCard.tsx    # React component
│   ├── content/           # Content collections
│   │   ├── config.ts      # Content schema definitions
│   │   └── blog/          # Blog posts in Markdown
│   │       ├── post-1.md
│   │       └── post-2.md
│   ├── layouts/           # Page layouts
│   │   ├── Layout.astro   # Base HTML layout
│   │   └── BaseLayout.astro # Layout with navigation
│   ├── pages/             # File-based routing
│   │   ├── index.astro    # Homepage
│   │   ├── projects.astro # Projects showcase
│   │   ├── contact.astro  # Contact page
│   │   └── blog/
│   │       ├── index.astro    # Blog listing
│   │       └── [slug].astro   # Individual blog posts
│   └── styles/
│       └── global.css     # Global styles
├── astro.config.mjs       # Astro configuration
├── tailwind.config.mjs    # Tailwind configuration
└── package.json
```

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`     |
| `npm run build`           | Build your production site to `./dist/`         |
| `npm run preview`         | Preview your build locally, before deploying    |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check`|
| `npm run astro -- --help` | Get help using the Astro CLI                    |

## 🎨 Customization

### Personal Information
1. Update personal details in:
   - `src/pages/index.astro` (hero section)
   - `src/pages/contact.astro` (contact information)
   - `src/components/Footer.astro` (social links)

### Projects
1. Edit the project data in `src/pages/index.astro` and `src/pages/projects.astro`
2. Add project images to the `public/` directory
3. Update GitHub and live demo URLs

### Blog Posts
1. Add new blog posts to `src/content/blog/`
2. Follow the frontmatter schema defined in `src/content/config.ts`
3. Posts support categories: 'Machine Learning', 'Web Development', 'Tutorial', 'Opinion'

### Styling
1. Customize colors and themes in `tailwind.config.mjs`
2. Add global styles in `src/styles/global.css`
3. Component-specific styles can be added in individual `.astro` files

## 📝 Adding Content

### New Blog Post
Create a new `.md` file in `src/content/blog/`:

```markdown
---
title: 'Your Post Title'
description: 'Brief description of your post'
pubDate: 2024-01-15
category: 'Machine Learning'
tags: ['ML', 'Python', 'Tutorial']
heroImage: '/blog-image.jpg'
---

# Your Post Title

Your content here...
```

### New Project
Add project data to the arrays in `src/pages/projects.astro`:

```javascript
{
  title: "Project Name",
  description: "Project description",
  technologies: ["React", "Node.js"],
  category: "WebDev", // or "ML"
  githubUrl: "https://github.com/username/repo",
  liveUrl: "https://project-demo.com",
  imageUrl: "/project-image.jpg"
}
```

## 🚀 Deployment

This project can be deployed to any static hosting platform:

### Vercel
```bash
npm run build
# Deploy the dist/ folder
```

### Netlify
```bash
npm run build
# Deploy the dist/ folder
```

### GitHub Pages
1. Build: `npm run build`
2. Deploy the `dist/` folder to the `gh-pages` branch

## 🔧 Development Tips

1. **Hot Reload**: The dev server supports hot reloading for instant updates
2. **Component Islands**: Use `client:load`, `client:visible`, or `client:idle` directives for React components
3. **Image Optimization**: Place images in `public/` for automatic optimization
4. **SEO**: Update meta descriptions in each page's frontmatter

## 📚 Learn More

- [Astro Documentation](https://docs.astro.build)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

This is a personal portfolio template. Feel free to fork and customize for your own use!

## 📄 License

This project is open source and available under the [MIT License](LICENSE).ate astro@latest -- --template minimal
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
├── src/
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
