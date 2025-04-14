import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import { Todo } from '@/models/Todo';
import { z } from 'zod';

const todoSchema = z.object({
  title: z.string().default(''),
  description: z.string().default(''),
  date: z.string().datetime(),
});

export async function GET(req: NextRequest) {
  try {
    console.log('GET /api/todos: Starting request');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('GET /api/todos: Unauthorized - No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skip = (page - 1) * limit;
    const search = searchParams.get('search') || '';

    console.log('GET /api/todos: Connecting to database');
    await connectDB();

    console.log(`GET /api/todos: Fetching todos with search: "${search}"`);

    // Build query with search if provided
    const query: any = { userId: session.user.id };
    if (search) {
      // Use regex with case-insensitive option for better matching
      const searchRegex = new RegExp(search.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } }
      ];
      console.log('GET /api/todos: Using search query:', JSON.stringify(query.$or));
    }

    const [todos, total] = await Promise.all([
      Todo.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Todo.countDocuments(query),
    ]);

    console.log(`GET /api/todos: Found ${todos.length} todos out of ${total} total`);
    return NextResponse.json({
      todos,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error in GET /api/todos:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    console.log('POST /api/todos: Starting request');
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('POST /api/todos: Unauthorized - No session or user ID');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    console.log('POST /api/todos: Request body:', body);
    
    const validatedData = todoSchema.parse(body);
    console.log('POST /api/todos: Validated data:', validatedData);

    console.log('POST /api/todos: Connecting to database');
    await connectDB();

    console.log('POST /api/todos: Creating todo with userId:', session.user.id);
    const todo = await Todo.create({
      ...validatedData,
      userId: session.user.id,
    });

    console.log('POST /api/todos: Todo created:', todo);
    return NextResponse.json(todo, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('POST /api/todos: Validation error:', error.errors);
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error in POST /api/todos:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 