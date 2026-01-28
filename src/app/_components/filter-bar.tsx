"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FilterChip } from "./filter-chip";
import type { Filter, FilterGroup } from "@/types/filters";

interface FilterBarProps {
  isOpen: boolean;
  activeFilters: Filter[];
  filterGroups: FilterGroup[];
  onFilterToggle: (filter: Filter) => void;
  onFilterRemove: (filterId: string) => void;
  onClearAll: () => void;
}

export function FilterBar({
  isOpen,
  activeFilters,
  filterGroups,
  onFilterToggle,
  onFilterRemove,
  onClearAll,
}: FilterBarProps) {
  const isFilterActive = (type: string, value: string) => {
    return activeFilters.some((f) => f.type === type && f.value === value);
  };

  return (
    <motion.div
      initial={false}
      animate={{
        height: isOpen ? "auto" : 0,
        opacity: isOpen ? 1 : 0,
      }}
      transition={{
        duration: 0.3,
        ease: [0.19, 1, 0.22, 1],
      }}
      className="fixed left-0 right-0 top-[145px] z-20 overflow-hidden border-b border-black/10 bg-white"
    >
      <div className="px-4 py-4">
        {/* Active filters row */}
        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="mb-3 flex flex-wrap items-center gap-2"
            >
              <span className="text-xs uppercase tracking-wider text-black/50">
                ACTIVE:
              </span>
              {activeFilters.map((filter, i) => (
                <motion.div
                  key={filter.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{
                    duration: 0.2,
                    delay: i * 0.015,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  <FilterChip
                    label={filter.label}
                    active={true}
                    onRemove={() => onFilterRemove(filter.id)}
                  />
                </motion.div>
              ))}
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={onClearAll}
                className="text-xs uppercase tracking-wider text-black/40 underline transition-colors hover:text-black"
              >
                Clear All
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Filter groups */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {filterGroups.map((group, groupIdx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{
                    duration: 0.2,
                    delay: groupIdx * 0.04,
                    ease: [0.19, 1, 0.22, 1],
                  }}
                >
                  <h3 className="mb-2 text-xs uppercase tracking-wider text-black/50">
                    {group.label}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2">
                    {group.options.map((option, optIdx) => {
                      const filter: Filter = {
                        id: `${group.type}-${option.value}`,
                        label: option.label,
                        type: group.type,
                        value: option.value,
                      };
                      const active = isFilterActive(group.type, option.value);

                      return (
                        <motion.div
                          key={option.value}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{
                            duration: 0.15,
                            delay: groupIdx * 0.04 + optIdx * 0.015,
                            ease: [0.19, 1, 0.22, 1],
                          }}
                        >
                          <FilterChip
                            label={option.label}
                            active={active}
                            onClick={() => onFilterToggle(filter)}
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
