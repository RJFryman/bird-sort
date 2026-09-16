# Boundary contract outline

Use the project's existing format when possible. Omit sections that add no value
for the chosen seam; label unknowns instead of inventing guarantees.

| Record | Capture |
| --- | --- |
| Boundary and purpose | What crosses the boundary and why |
| Participants | Provider, known consumers, responsible owners |
| Interaction | Request/response, event, file, or read/write operation |
| Meaning | Used fields, units, before/after semantics, nullability |
| Outcomes | Success and distinct errors the consumer handles |
| Side effects | Required state changes and relevant invariants |
| Operations | Relevant retry, ordering, idempotency, and capacity promises |
| Evidence | Which check establishes which obligation, with result and revision |
| Evolution | Supported versions, migration sequence, retirement condition |

## Example: an order report

An Orders API supplies a Revenue Report with `total_cents`, `discount_cents`,
and `currency`. The report interprets total as **before discount** and subtracts
the discount once. For a known $100 order and $10 discount, revenue is $90.

- Communication checks verify the actual client's handling and the provider's
  response fields, integer representation, and relevant supported currency.
- A provider functional test verifies what total means for the known cart.
- A representative reporting check verifies the discount is applied once.
- Returning `9000` as total while retaining integer types can pass a type matcher
  and cause the old report to produce $80. Record this as a changed promise.

## Useful validation cases

Choose cases that fit the actual implementation rather than reproducing this
example mechanically:

1. Removing a used field fails the relevant compatibility check.
2. Adding an ignored field passes when the real consumer tolerates it.
3. Changing meaning with the same type fails the appropriate behavioral check.
4. A supported old consumer prevents retirement of a field it still needs.
5. Missing compatibility evidence remains an unknown result.

These are candidate checks. Do not report them as executed until they have run
against the chosen project.
