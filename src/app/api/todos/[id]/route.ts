import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import connectDB from '@/lib/db';
import { Todo } from '@/models/Todo';
import { z } from 'zod';

const todoUpdateSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  date: z.string().datetime().optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const todo = await Todo.findOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json(todo);
  } catch (error) {
    console.error('Error in GET /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    try {
      const validatedData = todoUpdateSchema.parse(body);
      
      await connectDB();

      console.log('Updating todo:', params.id, 'for user:', session.user.id);
      
      const todo = await Todo.findOneAndUpdate(
        {
          _id: params.id,
          userId: session.user.id,
        },
        { $set: validatedData },
        { new: true, runValidators: true }
      );

      if (!todo) {
        console.error('Todo not found:', params.id, 'for user:', session.user.id);
        return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
      }

      return NextResponse.json(todo);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error('Validation error:', validationError.errors);
        return NextResponse.json(
          { 
            error: 'Validation failed', 
            details: validationError.errors.map(e => ({
              path: e.path.join('.'),
              message: e.message
            }))
          },
          { status: 400 }
        );
      }
      throw validationError;
    }
  } catch (error) {
    console.error('Error in PUT /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error', message: 'Failed to update todo' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const todo = await Todo.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    if (!todo) {
      return NextResponse.json({ error: 'Todo not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Todo deleted successfully' });
  } catch (error) {
    console.error('Error in DELETE /api/todos/[id]:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 