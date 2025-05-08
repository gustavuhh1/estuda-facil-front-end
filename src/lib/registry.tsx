"use client";

import React from "react";
import { StyleSheetManager } from "styled-components";

export default function StyledComponentsRegistry({
  children,
}: {
  children: React.ReactNode;
}) {
  return <StyleSheetManager>{children}</StyleSheetManager>;
}
