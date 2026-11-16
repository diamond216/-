import { Fragment } from "react";

/** Renders text where amounts are marked **like this** as bold. Nothing else is interpreted. */
export function Emphasis({ text }: { text: string }) {
  const parts = text.split("**");
  return (
    <>
      {parts.map((part, index) => (index % 2 === 1 ? <b key={index}>{part}</b> : <Fragment key={index}>{part}</Fragment>))}
    </>
  );
}
