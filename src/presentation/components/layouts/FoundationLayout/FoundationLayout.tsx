"use client";

import { Box, Drawer } from "@mui/material";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { FoundationHeader } from "./FoundationHeader";
import { FoundationSidebar, SIDEBAR_WIDTH } from "./FoundationSidebar";

export interface FoundationLayoutProps {
  children: React.ReactNode;
}

export function FoundationLayout({ children }: FoundationLayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <Box className="flex h-screen w-full overflow-hidden bg-neutral-50">
      <Box className="hidden md:flex">
        <FoundationSidebar activePath={pathname ?? undefined} />
      </Box>
      <Drawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: SIDEBAR_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <FoundationSidebar activePath={pathname ?? undefined} onNavigate={() => setMobileOpen(false)} />
      </Drawer>
      <Box className="flex min-w-0 flex-1 flex-col">
        <FoundationHeader onOpenMenu={() => setMobileOpen(true)} />
        <Box className="flex-1 overflow-y-auto">
          <Box className="mx-auto w-full max-w-[1100px] px-4 py-6 md:px-8 md:py-8">
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
