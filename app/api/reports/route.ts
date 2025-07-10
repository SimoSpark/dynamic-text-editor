import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

//  Get all reports for a specific patient
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id);
    
    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
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
    
    // Get all reports for this patient
    const reports = await prisma.report.findMany({
      where: { patientId },
      orderBy: { updatedAt: 'desc' },
    });
    
    return NextResponse.json(reports);
  } catch (error) {
    console.error('Error fetching patient reports:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient reports' },
      { status: 500 }
    );
  }
}

// PUT - Update a patient's rapport (this is likely what you need)
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id);
    
    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { rapport } = body;
    
    // Validate required fields
    if (rapport === undefined) {
      return NextResponse.json(
        { error: 'Missing rapport content' },
        { status: 400 }
      );
    }
    
    // Check if patient exists and update rapport
    const updatedPatient = await prisma.patient.update({
      where: { id: patientId },
      data: { rapport },
    });
    
    return NextResponse.json(updatedPatient);
  } catch (error) {
    console.error('Error updating patient rapport:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update patient rapport' },
      { status: 500 }
    );
  }
}

// POST - Create a new report for a patient
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const patientId = parseInt(params.id);
    
    if (isNaN(patientId)) {
      return NextResponse.json(
        { error: 'Invalid patient ID' },
        { status: 400 }
      );
    }
    
    const body = await request.json();
    const { title, content } = body;
    
    // Validate required fields
    if (!title || !content) {
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
    console.error('Error creating patient report:', error);
    return NextResponse.json(
      { error: 'Failed to create patient report' },
      { status: 500 }
    );
  }
}