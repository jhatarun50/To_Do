# Todo Application

A modern Todo application built with Next.js, MongoDB, and TypeScript.

## Technologies Used

- Next.js 14
- React 18
- MongoDB
- TypeScript
- TailwindCSS
- NextAuth.js
- Tiptap Editor
- React Hook Form
- Zod Validation

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/jhatarun50/To_Do.git
cd To_Do
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following:
```env
MONGODB_URI=mongodb://localhost:27017/todo-app
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_key
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- User Authentication
- Create, Read, Update, and Delete Todos
- Rich Text Editor Support
- Responsive Design
- Type-safe Development
- Form Validation

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## License

MIT
