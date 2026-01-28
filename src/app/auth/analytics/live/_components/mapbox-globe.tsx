"use client"

import { useState } from "react"
import Map, { Marker } from "react-map-gl/mapbox"
import { type VisitorProfile } from "@/types/analytics"
import "mapbox-gl/dist/mapbox-gl.css"

interface MapboxGlobeProps {
  visitors: VisitorProfile[]
  onMarkerClick: (visitor: VisitorProfile) => void
}

export default function MapboxGlobe({
  visitors,
  onMarkerClick,
}: MapboxGlobeProps) {
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  return (
    <Map
      mapboxAccessToken={
        process.env.NEXT_PUBLIC_MAPBOX_TOKEN ||
        "pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw"
      }
      initialViewState={{
        longitude: 0,
        latitude: 20,
        zoom: 2.2,
        pitch: 0,
        bearing: 0,
      }}
      projection={{ name: "globe" } as any}
      mapStyle="mapbox://styles/mapbox/dark-v11"
      style={{ width: "100%", height: "100%" }}
      dragRotate={true}
      touchZoomRotate={true}
      onLoad={() => setIsMapLoaded(true)}
    >
      {/* Visitor Markers - Only render after map is loaded */}
      {isMapLoaded && visitors.map((visitor, index) => (
        <Marker
          key={index}
          longitude={visitor.location.lng}
          latitude={visitor.location.lat}
          anchor="bottom"
          onClick={(e: any) => {
            e.originalEvent.stopPropagation()
            onMarkerClick(visitor)
          }}
        >
          <div className="relative cursor-pointer transition-transform hover:scale-110">
            <div className="absolute -inset-0.5 animate-ping rounded-full bg-purple-500/20" />
            <img
              src={visitor.avatar}
              alt={visitor.location.city}
              className="relative size-6 rounded-full ring-1 ring-purple-500/50"
            />
          </div>
        </Marker>
      ))}
    </Map>
  )
}
