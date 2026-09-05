import { prisma } from '@/app/_libs/prisma';
import { NextRequest, NextResponse } from 'next/server';

export type PostShowResponse = {
  post: {
    id: number
    title: string
    content: string
    thumbnailImageKey: string
    createdAt: Date
    updatedAt: Date
    postCategories: {
      category: {
        id: number
        name: string
      }
    }[]
  }
}
