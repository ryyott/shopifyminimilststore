"use client"

import { useState, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import { motion, AnimatePresence } from "framer-motion"
import { type LiveAnalytics, type VisitorProfile } from "@/types/analytics"
import { visitorProfiles } from "@/lib/mock/analytics"
import { ChevronLeft, TrendingUp, Eye } from "lucide-react"

const MapboxGlobe = dynamic(() => import("./mapbox-globe"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-black">
      <span className="text-white">Loading map...</span>
    </div>
  ),
})

interface VisitorGlobeProps {
  analytics: LiveAnalytics
}

type CategoryType = "pages" | "referrers" | "countries" | null

export function VisitorGlobe({ analytics }: VisitorGlobeProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>(null)
  const [selectedVisitor, setSelectedVisitor] = useState<VisitorProfile | null>(null)
  const [showScrollBlur, setShowScrollBlur] = useState(false)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  const handleScroll = () => {
    if (!scrollContainerRef.current) return

    const { scrollTop, scrollHeight, clientHeight } = scrollContainerRef.current
    const isScrollable = scrollHeight > clientHeight
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10 // 10px threshold

    setShowScrollBlur(isScrollable && !isAtBottom)
  }

  useEffect(() => {
    handleScroll() // Check on mount and content changes
  }, [selectedCategory, selectedVisitor])

  return (
    <div className="relative h-full w-full overflow-hidden bg-black">
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
      {/* Mapbox Globe */}
      <div className="absolute inset-0">
        <MapboxGlobe
          visitors={visitorProfiles}
          onMarkerClick={setSelectedVisitor}
        />
      </div>

      {/* Overlay Panel - Bottom Center */}
      <div className="absolute bottom-12 left-1/2 z-10 -translate-x-1/2">
        <motion.div
          className="w-[480px] rounded-3xl border border-white/[0.08] bg-black/95 shadow-2xl backdrop-blur-xl overflow-hidden"
          layout
          initial={false}
          transition={{
            layout: { duration: 0.25, ease: [0.4, 0, 0.2, 1] }
          }}
        >
          {/* Top Content Area - Changes based on selection */}
          <div className="relative">
            <div
              ref={scrollContainerRef}
              onScroll={handleScroll}
              className="max-h-[400px] overflow-y-auto px-5 pt-4 pb-3 hide-scrollbar"
              style={{
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {/* Gradient overlay for scroll indication - only show when content is scrollable */}
              {showScrollBlur && (
                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/95 to-transparent z-10" />
              )}
            <AnimatePresence mode="wait" initial={false}>
              {/* Visitor Profile View */}
              {selectedVisitor && (
                <motion.div
                  key="visitor-profile"
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -20 }}
                  transition={{
                    duration: 0.2,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="space-y-3 pb-4"
                >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedVisitor(null)}
                  className="flex size-7 items-center justify-center rounded-lg bg-white/5 transition-all hover:bg-white/10"
                >
                  <ChevronLeft className="size-3.5 text-white" />
                </button>
                <img
                  src={selectedVisitor.avatar}
                  alt={selectedVisitor.location.city}
                  className="size-10 rounded-full ring-2 ring-purple-500/50"
                />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-white">
                    {selectedVisitor.location.flagEmoji} {selectedVisitor.location.city}
                  </h3>
                  <p className="text-xs text-gray-400">{selectedVisitor.location.country}</p>
                </div>
              </div>

              <div className="space-y-2 border-t border-white/10 pt-2.5">
                <div className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-2">
                  <span className="flex items-center gap-1.5 text-xs text-gray-400">
                    <Eye className="size-3" />
                    Page
                  </span>
                  <span className="font-mono text-xs text-white">{selectedVisitor.currentPage}</span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-2">
                  <span className="text-xs text-gray-400">Referrer</span>
                  <div className="flex items-center gap-1.5">
                    {selectedVisitor.referrer === "Google" && (
                      <svg className="size-3.5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    )}
                    {selectedVisitor.referrer === "Twitter" && (
                      <svg className="size-3.5" fill="#1DA1F2" viewBox="0 0 24 24">
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                      </svg>
                    )}
                    {selectedVisitor.referrer === "LinkedIn" && (
                      <svg className="size-3.5" fill="#0A66C2" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    )}
                    {selectedVisitor.referrer === "Direct" && (
                      <span className="text-xs text-gray-400">→</span>
                    )}
                    <span className="text-xs text-white">{selectedVisitor.referrer}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-white/5 px-2.5 py-2">
                  <span className="text-xs text-gray-400">Device</span>
                  <div className="flex items-center gap-1.5">
                    <svg className="size-3.5 text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                    <span className="text-xs text-white">Chrome · Desktop</span>
                  </div>
                </div>
              </div>
              </motion.div>
            )}

            {/* Category Selection - Collapsed State */}
            {!selectedCategory && !selectedVisitor && (
              <motion.div
                key="category-selection"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className="space-y-2"
              >
              {/* Pages Row */}
              <button
                onClick={() => setSelectedCategory("pages")}
                className="group flex w-full items-center justify-between transition-all hover:opacity-80"
              >
                <span className="text-xs font-medium text-[#9ca3af]">Pages</span>
                <div className="flex items-center gap-2">
                  <div className="rounded-lg bg-[#0f1117] px-2 py-1">
                    <span className="text-xs font-medium text-[#e5e7eb]">
                      {analytics.topPages[0].path}
                    </span>
                  </div>
                  <span className="min-w-[1.5rem] text-right text-sm font-bold tabular-nums text-[#f3f4f6]">
                    {analytics.topPages[0].visits}
                  </span>
                  <svg
                    className="size-3.5 text-[#6b7280] transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              {/* Referrers Row */}
              <button
                onClick={() => setSelectedCategory("referrers")}
                className="group flex w-full items-center justify-between transition-all hover:opacity-80"
              >
                <span className="text-xs font-medium text-[#9ca3af]">
                  Referrers
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-[#0f1117] px-2 py-1">
                    {analytics.topReferrers[0].source === "Direct" ? (
                      <span className="text-xs text-[#9ca3af]">→</span>
                    ) : analytics.topReferrers[0].source === "Google" ? (
                      <svg className="size-3" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                    ) : analytics.topReferrers[0].source === "Facebook" ? (
                      <svg className="size-3" viewBox="0 0 24 24" fill="#1877F2">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    ) : (
                      <span className="text-xs text-[#9ca3af]">→</span>
                    )}
                    <span className="text-xs font-medium text-[#e5e7eb]">
                      {analytics.topReferrers[0].source}
                    </span>
                  </div>
                  <span className="min-w-[1.5rem] text-right text-sm font-bold tabular-nums text-[#f3f4f6]">
                    {analytics.topReferrers[0].visits}
                  </span>
                  <svg
                    className="size-3.5 text-[#6b7280] transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>

              {/* Countries Row */}
              <button
                onClick={() => setSelectedCategory("countries")}
                className="group flex w-full items-center justify-between transition-all hover:opacity-80"
              >
                <span className="text-xs font-medium text-[#9ca3af]">
                  Countries
                </span>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg bg-[#0f1117] px-2 py-1">
                    <span className="text-sm">
                      {analytics.topCountries[0].flagEmoji}
                    </span>
                    <span className="text-xs font-medium text-[#e5e7eb]">
                      {analytics.topCountries[0].country}
                    </span>
                  </div>
                  <span className="min-w-[1.5rem] text-right text-sm font-bold tabular-nums text-[#f3f4f6]">
                    {analytics.topCountries[0].visits}
                  </span>
                  <svg
                    className="size-3.5 text-[#6b7280] transition-transform group-hover:translate-x-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </button>
              </motion.div>
            )}

            {/* Expanded Category Details */}
            {selectedCategory === "pages" && (
              <motion.div
                key="pages-detail"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className={`space-y-3 ${selectedVisitor ? 'border-t border-white/10 pt-4' : ''}`}
              >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex size-7 items-center justify-center rounded-lg bg-white/5 transition-all hover:bg-white/10"
                >
                  <ChevronLeft className="size-3.5 text-white" />
                </button>
                <h3 className="text-sm font-semibold text-white">
                  Pages
                </h3>
              </div>
              <div className="space-y-1.5">
                {analytics.topPages.map((page, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg px-2.5 py-2 transition-all hover:bg-white/5"
                  >
                    <span className="flex-1 font-mono text-xs text-white">
                      {page.path}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-gray-400">
                      <div className="flex w-10 items-center justify-end gap-1.5 tabular-nums">
                        <TrendingUp className="size-3" />
                        <span className="w-5 text-right">{page.visits}</span>
                      </div>
                      <div className="w-14 text-right tabular-nums">
                        {Math.floor(page.avgDuration / 60)}m{" "}
                        {page.avgDuration % 60}s
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              </motion.div>
            )}

            {selectedCategory === "referrers" && (
              <motion.div
                key="referrers-detail"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className={`space-y-3 ${selectedVisitor ? 'border-t border-white/10 pt-4' : ''}`}
              >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex size-7 items-center justify-center rounded-lg bg-white/5 transition-all hover:bg-white/10"
                >
                  <ChevronLeft className="size-3.5 text-[#f3f4f6]" />
                </button>
                <h3 className="text-sm font-semibold text-[#f3f4f6]">
                  Referrers
                </h3>
              </div>
              <div className="space-y-1.5">
                {analytics.topReferrers.map((referrer, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg px-2.5 py-2 transition-all hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-6 items-center justify-center rounded-lg bg-[#0f1117]">
                        {referrer.source === "Direct" ? (
                          <span className="text-xs text-[#9ca3af]">→</span>
                        ) : referrer.source === "Google" ? (
                          <svg className="size-3.5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                          </svg>
                        ) : referrer.source === "Facebook" ? (
                          <svg className="size-3.5" viewBox="0 0 24 24" fill="#1877F2">
                            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                          </svg>
                        ) : referrer.source === "Twitter" ? (
                          <svg className="size-3.5" viewBox="0 0 24 24" fill="#1DA1F2">
                            <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                          </svg>
                        ) : (
                          <span className="text-xs font-medium text-[#e5e7eb]">{referrer.source[0]}</span>
                        )}
                      </div>
                      <span className="text-xs text-[#e5e7eb]">{referrer.source}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs tabular-nums">
                      <span className="text-[#9ca3af]">
                        {referrer.visits}
                      </span>
                      <span className="min-w-[3rem] text-right text-[10px] text-[#9ca3af]">
                        {referrer.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              </motion.div>
            )}

            {selectedCategory === "countries" && (
              <motion.div
                key="countries-detail"
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{
                  duration: 0.2,
                  ease: [0.4, 0, 0.2, 1]
                }}
                className={`space-y-3 ${selectedVisitor ? 'border-t border-white/10 pt-4' : ''}`}
              >
              <div className="flex items-center gap-2.5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="flex size-7 items-center justify-center rounded-lg bg-white/5 transition-all hover:bg-white/10"
                >
                  <ChevronLeft className="size-3.5 text-white" />
                </button>
                <h3 className="text-sm font-semibold text-white">
                  Countries
                </h3>
              </div>
              <div className="space-y-1.5">
                {analytics.topCountries.map((country, index) => (
                  <div
                    key={index}
                    className="group flex items-center justify-between rounded-lg px-2.5 py-2 transition-all hover:bg-white/5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-base">{country.flagEmoji}</span>
                      <span className="text-xs text-white">{country.country}</span>
                    </div>
                    <div className="flex items-center gap-4 text-xs tabular-nums">
                      <span className="text-gray-400">
                        {country.visits}
                      </span>
                      <span className="min-w-[3rem] text-right text-[10px] text-gray-400">
                        {country.percentage.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              </motion.div>
            )}
            </AnimatePresence>
            </div>
          </div>

          {/* Persistent Bottom Bar - Always visible */}
          <div className="border-t border-white/[0.06] px-5 py-2.5">
            <div className="flex items-center justify-between">
              {/* Icon Row */}
              <div className="flex items-center gap-1.5">
                <button className="flex size-7 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-white/5 hover:text-[#9ca3af]">
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                </button>
                <button className="flex size-7 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-white/5 hover:text-[#9ca3af]">
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                <button className="flex size-7 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-white/5 hover:text-[#9ca3af]">
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </button>
                <button className="flex size-7 items-center justify-center rounded-lg text-[#6b7280] transition-colors hover:bg-white/5 hover:text-[#9ca3af]">
                  <svg
                    className="size-3.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </button>
              </div>

              {/* Globe Icon with Visitor Count */}
              <div className="flex items-center gap-2">
                <svg
                  className="size-4 text-[#60a5fa]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-base font-bold tabular-nums text-[#f3f4f6]">
                  {analytics.totalVisitors}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

    </div>
  )
}
