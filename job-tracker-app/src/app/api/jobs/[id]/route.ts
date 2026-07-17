import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// PUT /api/jobs/:id -> update a job
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const body = await request.json();

  try {
    const job = await prisma.job.update({
      where: { id: params.id },
      data: {
        ...(body.company !== undefined && { company: body.company }),
        ...(body.role !== undefined && { role: body.role }),
        ...(body.status !== undefined && { status: body.status }),
        ...(body.date !== undefined && { date: new Date(body.date) }),
        ...(body.notes !== undefined && { notes: body.notes }),
      },
    });
    return NextResponse.json(job);
  } catch {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }
}

// DELETE /api/jobs/:id -> delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.job.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }
}