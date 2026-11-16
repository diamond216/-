"use client";

import type { MoneyLedger, NotedAmount } from "@/domain";
import type { Localizer } from "@/services/i18n";
import { Emphasis } from "../common/Emphasis";
import { useLocalizer } from "../providers/NestProvider";

/** "฿320,000, all of it…" when the note carries on the sentence; "฿0. It isn't…" when it starts a new one. */
function amountLine(localizer: Localizer, { amount, note }: NotedAmount): string {
  const text = localizer.text(note);
  const joiner = localizer.locale === "th" ? " " : /^\p{Ll}/u.test(text) ? ", " : ". ";
  return `**${amount.format()}**${joiner}${text}`;
}

/** "The money part": the ledger, as the maker wrote it and Hamster Hub checked it. */
export function MoneySection({ ledger }: { ledger: MoneyLedger }) {
  const localizer = useLocalizer();
  const owners = ledger.ownership
    .map((share) => `**${share.percent}%** ${localizer.text(share.holder)}`)
    .join(" · ");
  const rows: Array<[string, string]> = [
    [localizer.t("money.earns"), localizer.text(ledger.earns)],
    [localizer.t("money.owners"), owners],
    [
      localizer.t("money.raising"),
      ledger.raising
        ? localizer.t("money.raisingYes", {
            amount: ledger.raising.target.format(),
            purpose: localizer.text(ledger.raising.purpose),
          })
        : localizer.t("money.raisingNo"),
    ],
    [localizer.t("money.spent"), amountLine(localizer, ledger.spent)],
    [localizer.t("money.earned"), amountLine(localizer, ledger.earned)],
  ];

  return (
    <section className="block" aria-labelledby="money-title">
      <h2 className="sec" id="money-title">
        {localizer.t("money.title")}
      </h2>
      <p className="lead-in">{localizer.t("money.lead")}</p>
      <dl className="ledger">
        {rows.map(([term, value]) => (
          <div key={term}>
            <dt>{term}</dt>
            <dd>
              <Emphasis text={value} />
            </dd>
          </div>
        ))}
      </dl>
      <p className="checked">
        {localizer.t("money.checked", { date: localizer.date(ledger.checkedOn) })}{" "}
        <a href="#">{localizer.t("money.breakdown")}</a>
      </p>
    </section>
  );
}
