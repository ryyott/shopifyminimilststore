"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Circle, Clock, MapPin } from "lucide-react";

import { cn } from "@/lib/utils";
import { type OrderEvent } from "@/types/order";

interface OrderTimelineProps {
  events: OrderEvent[];
  className?: string;
}

const eventIcons = {
  pending: Circle,
  in_progress: Clock,
  completed: CheckCircle2,
  cancelled: Circle,
};

export function OrderTimeline({ events, className }: OrderTimelineProps) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {events.map((event, index) => {
        const Icon = eventIcons[event.status];
        const isCompleted = event.status === "completed";
        const isInProgress = event.status === "in_progress";
        const isCancelled = event.status === "cancelled";
        const isLast = index === events.length - 1;

        return (
          <div key={event.id} className="flex items-center">
            {/* Event Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <Icon
                className={cn(
                  "size-5",
                  isCompleted && "fill-green-500 text-green-500 dark:fill-green-400 dark:text-green-400",
                  isInProgress && "animate-pulse text-blue-500 dark:text-blue-400",
                  isCancelled && "text-red-500 dark:text-red-400",
                  !isCompleted && !isInProgress && !isCancelled && "text-muted-foreground/30",
                )}
              />
            </motion.div>

            {/* Connector Line */}
            {!isLast && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: index * 0.1 + 0.05, duration: 0.3 }}
                className={cn(
                  "h-[2px] w-8 origin-left",
                  isCompleted ? "bg-green-500 dark:bg-green-400" : "bg-muted-foreground/20",
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// Detailed timeline with labels for expanded view
interface DetailedTimelineProps {
  events: OrderEvent[];
  className?: string;
}

export function DetailedOrderTimeline({ events, className }: DetailedTimelineProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {events.map((event, index) => {
        const isCompleted = event.status === "completed";
        const isInProgress = event.status === "in_progress";
        const isCancelled = event.status === "cancelled";
        const isLast = index === events.length - 1;

        return (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative flex gap-3"
          >
            {/* Timeline Line */}
            {!isLast && <div className="absolute top-6 left-[9px] h-full w-[2px] bg-white/10" />}

            {/* Icon */}
            <div className="relative z-10">
              <div
                className={cn(
                  "flex size-5 items-center justify-center rounded-full",
                  isCompleted && "bg-green-500",
                  isInProgress && "bg-blue-500",
                  isCancelled && "bg-red-500",
                  !isCompleted && !isInProgress && !isCancelled && "border-2 border-white/20 bg-transparent",
                )}
              >
                {isCompleted && <div className="size-2 rounded-full bg-white" />}
                {isInProgress && <div className="size-2 rounded-full bg-white" />}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 pb-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <p className="text-sm font-medium text-white">
                    {event.label}
                  </p>
                  {event.location && (
                    <p className="mt-0.5 flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="size-3" />
                      {event.location}
                    </p>
                  )}
                </div>
                {event.timestamp && (
                  <p className="text-xs text-gray-400 whitespace-nowrap">
                    {new Date(event.timestamp).toLocaleString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
