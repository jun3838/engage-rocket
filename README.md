# EngageRocket Survey Dashboard

This is a React + TypeScript web application for capturing and analyzing employee survey responses. It includes:

- A **Survey form** with validation and submission
- An **Admin Dashboard** with charts and response summary
- ️A modular project structure with reusable components
- TailwindCSS styling

---

## Folder Structure
```
src/
├── apps/
│   └── dashboard/        # Main application views (Survey and Admin)
├── shared/
│   ├── components/       # Reusable UI components (Card, Button, etc.)
│   ├── services/         # Survey data storage logic
│   └── types/            # TypeScript interfaces
```

## Tech Stack

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/en-US)
- [react-hook-form](https://react-hook-form.com/)

---

## Setup Instructions

```bash
#Install dependencies

yarn

#Start the dev server

yarn dev
