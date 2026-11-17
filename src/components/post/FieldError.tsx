/** The message under a field that needs fixing. Renders nothing when the field is fine. */
export function FieldError({ id, message }: { id: string; message: string | null }) {
  if (!message) return null;
  return (
    <p className="pw__error" id={id} role="alert">
      {message}
    </p>
  );
}
