import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET all reports
export async function GET(request: NextRequest) {
  try {
    const reports = await prisma.report.findMany({
      include: {
        patient: true,
      },
    });
    
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

// POST a new report
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, content, patientId } = body;
    
    // Validate required fields
    if (!title || !content || !patientId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if patient exists
    const patient = await prisma.patient.findUnique({
      where: { id: patientId },
    });
    
    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }
    
    // Create the report
    const report = await prisma.report.create({
      data: {
        title,
        content,
        patientId,
      },
    });
    
    return NextResponse.json(report, { status: 201 });
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: 'Failed to create report' },
      { status: 500 }
    );
  }
}
