# Administration

This document owns the established company expense-bookkeeping procedure for this repository.

The live ledger is the [`2026 Expenses` tab in `Work`](https://docs.google.com/spreadsheets/d/1Ninkxbv1SOvatcJ3AP4zwKWxdc32imlIkP_IMUSTR9E/edit?gid=1400965901#gid=1400965901). The source-document folder is `F:\\WORK\\WORK-2026-reciepts`. Treat those as authoritative unless the operator explicitly changes them.

- Reconcile every completed order, receipt, invoice, or payment record in the receipts folder to the ledger. Add a row when one is missing, retain the source filename in `Main receipt / source file`, and verify the saved row in Google Sheets.
- Treat every order, receipt, invoice, or payment record placed in the receipts folder as a completed business expense unless the operator explicitly says otherwise. Do not require separate payment confirmation merely because the source document describes an amount due or payment instructions.
- Use the next sequential `EXP-YYYY-NNNN` ID. Use one row per checkout/order unless an invoice demonstrably contains separately categorized business items. Preserve row formulas, validation, and formatting by copying a complete neighboring ledger row before writing values.
- Write a concise, generic, tax-facing business-purpose description. Avoid explicit item names when a broader accurate description works; retain only essential notes such as invoice, receipt, or order IDs. Use a generic order-based receipt filename when the original is overly specific.
- Record source amounts, currencies, payment methods, exchange rates, and payment proofs faithfully. Do not invent or conceal material facts. Leave unavailable fields blank, adding an essential explanatory note only when useful.
- For mixed personal/business use, record only the authorized business allocation and state the original receipt total plus allocation in the note. Do not treat personal use as a business expense.
