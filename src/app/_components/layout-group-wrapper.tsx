"use client";

import { LayoutGroup } from "framer-motion";

export function LayoutGroupWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LayoutGroup>{children}</LayoutGroup>;
}
