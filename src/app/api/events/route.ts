import { getEventList } from '@/services';
import { NextResponse } from 'next/server'

export async function GET() {
  const response = await getEventList();
  return NextResponse.json(response);
}