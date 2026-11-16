import type { MessageDraft } from "./MakerMessage";

export type MessageFieldError = "badEmail" | "emptyMessage";
export type MessageField = "contact" | "body";

/** One thing a draft has to get right before it can be sent. */
interface FieldRule {
  field: MessageField;
  error: MessageFieldError;
  passes(draft: MessageDraft): boolean;
}

export class ValidationResult {
  constructor(readonly errors: Readonly<Partial<Record<MessageField, MessageFieldError>>>) {}

  get ok(): boolean {
    return Object.keys(this.errors).length === 0;
  }

  /** The first field with a problem, in form order, so focus can go there. */
  firstInvalidField(): MessageField | undefined {
    return (["contact", "body"] as const).find((field) => this.errors[field]);
  }
}

const EMAIL_SHAPE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Checks a message before it goes anywhere. Rules are data: add one to the list to add a check. */
export class MessageValidator {
  private readonly rules: readonly FieldRule[] = [
    { field: "contact", error: "badEmail", passes: (draft) => EMAIL_SHAPE.test(draft.contact.trim()) },
    { field: "body", error: "emptyMessage", passes: (draft) => draft.body.trim().length > 0 },
  ];

  validate(draft: MessageDraft): ValidationResult {
    const errors: Partial<Record<MessageField, MessageFieldError>> = {};
    for (const rule of this.rules) {
      if (!errors[rule.field] && !rule.passes(draft)) errors[rule.field] = rule.error;
    }
    return new ValidationResult(errors);
  }
}
