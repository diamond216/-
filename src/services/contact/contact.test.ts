import { describe, expect, it } from "vitest";
import { NOW } from "@/test/fixtures";
import { MemoryStore } from "@/services/storage/KeyValueStore";
import { emptyDraft, LocalOutboxSender, MessageValidator } from ".";

const validator = new MessageValidator();

describe("MessageValidator", () => {
  it("flags a bad email and an empty message, in form order", () => {
    const result = validator.validate({ ...emptyDraft("pim"), contact: "pim@", body: "   " });
    expect(result.ok).toBe(false);
    expect(result.errors).toEqual({ contact: "badEmail", body: "emptyMessage" });
    expect(result.firstInvalidField()).toBe("contact");
  });

  it("accepts a real-looking message", () => {
    expect(validator.validate({ ...emptyDraft("pim"), contact: "a@b.co", body: "Hi" }).ok).toBe(true);
  });
});

describe("LocalOutboxSender", () => {
  it("keeps sent messages in the outbox, trimmed and timestamped", async () => {
    const sender = new LocalOutboxSender(new MemoryStore(), NOW);
    const sent = await sender.send({ ...emptyDraft("pim"), contact: " a@b.co ", body: " Hello " });
    expect(sent.body).toBe("Hello");
    expect(sent.sentAt).toBe(NOW.now().toISOString());
    expect(sender.outbox()).toHaveLength(1);
  });
});
