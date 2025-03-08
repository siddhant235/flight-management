'use client'

import { Suspense } from 'react'
import { Spinner } from '@/components/atoms/Spinner'
import { HomeContent } from '@/components/organisms/HomeContent'

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="flex justify-center items-center min-h-screen">
        <Spinner />
      </div>
    }>
      <HomeContent />
    </Suspense>
  )
}
