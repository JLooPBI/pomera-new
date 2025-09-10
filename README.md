This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Design System

### Brand Colors
- **Primary Green**: `hsl(75, 31%, 48%)` / `#6B8E23` - Used for primary buttons, links, and brand elements
- **Secondary Pink**: `hsl(348, 92%, 63%)` - Used for secondary actions and accents
- **Primary Light**: `hsl(75, 31%, 92%)` - Light variant of primary green

### Usage in Code
```css
/* CSS Custom Properties */
background-color: hsl(var(--primary));
color: hsl(var(--primary-foreground));
```

```tsx
/* Tailwind Classes */
<div className="bg-primary text-primary-foreground">Content</div>
```

### Communicating Color References
When working with the development team, use these clear references:

**✅ Good References:**
- "Use our primary green color"
- "Make it the same green as the Add Company button"
- "Use the brand green"
- "Apply the primary color"
- "Use our project's green"

**✅ Specific References:**
- "Use the primary green (hsl(75, 31%, 48%))"
- "Use bg-primary class"
- "Use the green from our design system"

**❌ Avoid Vague References:**
- "Make it green" (too generic)
- "Use a green color" (not specific to brand)
- "Change to green" (could be any green)

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
