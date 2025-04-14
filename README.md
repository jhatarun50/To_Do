# Todo App

A modern todo application built with Next.js, MongoDB, and TypeScript. Features include user authentication, rich text editing, and real-time updates.

## Features

- User authentication (register/login)
- Create, read, update, and delete todos
- Rich text editing for todo descriptions
- Pagination for todo lists
- Real-time updates
- Responsive design
- TypeScript support

## Tech Stack

- **Frontend**: Next.js 14, React, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Form Handling**: React Hook Form with Zod validation
- **Rich Text Editor**: TipTap
- **Styling**: TailwindCSS
- **Icons**: Heroicons

## Prerequisites

- Node.js 18+ and npm
- MongoDB (local installation or MongoDB Atlas account)

## Getting Started

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd todo-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/todo-app
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── login/            # Login page
│   ├── register/         # Registration page
│   └── page.tsx          # Home page
├── components/            # React components
├── lib/                   # Utility functions
├── models/               # Mongoose models
└── types/                # TypeScript type definitions
```

## API Routes

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Log in a user
- `GET /api/todos` - Get todos (with pagination)
- `POST /api/todos` - Create a new todo
- `GET /api/todos/[id]` - Get a specific todo
- `PUT /api/todos/[id]` - Update a todo
- `DELETE /api/todos/[id]` - Delete a todo

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
