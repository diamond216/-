"use client";

import { useState } from "react";
import { ContactDialog } from "@/components/contact/ContactDialog";
import type { Maker } from "@/domain";

/**
 * One "write to a maker" dialog for a whole page, opened by any number of buttons.
 * Each opening starts a fresh form, prefilled when a topic was picked.
 */
export function useContactDialog(maker: Maker) {
  const [state, setState] = useState({ open: false, body: "", round: 0 });

  const open = (body = "") => setState((current) => ({ open: true, body, round: current.round + 1 }));

  const dialog = (
    <ContactDialog
      key={state.round}
      maker={maker}
      open={state.open}
      initialBody={state.body}
      onOpenChange={(next) => setState((current) => ({ ...current, open: next }))}
    />
  );

  return { open, dialog };
}
