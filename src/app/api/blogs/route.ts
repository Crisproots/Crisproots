import { NextRequest, NextResponse } from 'next/server';

// In-memory blog storage (replace with DB in production)
let blogs: any[] = [];
let idCounter = 1;

export async function GET() {
  return NextResponse.json(blogs);
}

export async function POST(request: NextRequest) {
  const { title, content, author } = await request.json();
  const newBlog = { id: idCounter++, title, content, author, createdAt: new Date() };
  blogs.unshift(newBlog);
  return NextResponse.json(newBlog, { status: 201 });
}

export async function PUT(request: NextRequest) {
  const { id, title, content } = await request.json();
  const blog = blogs.find((b) => b.id === id);
  if (!blog) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  blog.title = title;
  blog.content = content;
  return NextResponse.json(blog);
}

export async function DELETE(request: NextRequest) {
  const { id } = await request.json();
  const index = blogs.findIndex((b) => b.id === id);
  if (index === -1) return NextResponse.json({ error: 'Blog not found' }, { status: 404 });
  const deleted = blogs.splice(index, 1)[0];
  return NextResponse.json(deleted);
} 