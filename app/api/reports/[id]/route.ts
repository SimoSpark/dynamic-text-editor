import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

// GET ::: Get reports for a specific patient
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
    
    // Return the patient with rapport field
    return NextResponse.json(patient);
  } catch (error) {
    console.error('Error fetching patient:', error);
    return NextResponse.json(
      { error: 'Failed to fetch patient data' },
      { status: 500 }
    );
  }
}

// PUT ::Update a patient's rapport
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