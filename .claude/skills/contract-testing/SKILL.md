---
name: contract-testing
description: Design, review, or implement consumer-driven contract tests and explicit software boundary contracts. Use for consumer/provider compatibility, API or event contract changes, and safe interface migrations. Scale to the requested seam; ordinary internal refactors do not require a contract-testing rollout.
metadata:
  version: "0.1.0"
---

# Contract Testing

Make consumer obligations explicit and connect each promise to appropriate
evidence. Keep the scope the user requested: explain when asked to explain,
review when asked to review, and implement when implementation is requested.
This skill is usable without access to the Harmony dashboard.

## Find the real boundary

Inspect the relevant project instructions, caller, provider, and existing tests.
Identify the consumer, provider, interface, owners, and release relationship.
Include direct database readers, events, files, and background jobs when relevant;
a shared table is an observable interface even if called private.

Distinguish observed consumers from suspected or undiscovered ones. Do not claim
a complete dependency inventory from a narrow source search. If the project is
unavailable, give an explicitly proposed contract or test plan instead of
claiming to have inspected or changed it.

Use the smallest suitable approach. Internal modules often need types and tests
of public behavior. Independently released services with cooperative owners may
benefit from consumer-driven contracts and a broker. Unknown public consumers
also need a published specification and compatibility policy. A mock cannot prove
an uncooperative third-party provider meets your expectations.

## Capture obligations

State the meaning of used fields, units, relevant outcomes, side effects, and
operational promises. Use [the contract outline](references/contract-outline.md)
when creating a new record; preserve an existing project's equivalent format.
Do not copy incidental provider details into a consumer's requirements.

Keep three kinds of evidence separate:

- **Communication compatibility:** actual consumer requests and response handling,
  plus provider verification of the expected exchanges.
- **Functional correctness:** calculations, persistence, authorization, and other
  domain behavior tested by the responsible implementation.
- **Operational behavior:** performance, retries, ordering, delivery, and selected
  end-to-end journeys tested at appropriate integration or system boundaries.

An integer matcher cannot establish whether an amount is before or after a
discount. A matching success response cannot establish that data was saved.

## Implement or review the checks

For Pact-style testing, exercise the production consumer client or message
handler against the test double. Assert its interpretation and generate the
contract from passing consumer tests. Verify that contract against the real
local provider boundary. Stub dependencies below request parsing and validation;
do not replace the behavior whose interface you mean to verify.

Use deterministic examples and independent provider states. Assert only fields,
formats, exact values, and distinct outcomes the caller relies on. Use flexible
matchers where variation is harmless. Include error, empty, or missing outcomes
when they drive consumer behavior. Avoid whole-response snapshots that freeze
unrelated fields.

Preserve consumer intent when tests fail. Determine whether the cause is a
provider defect, a deliberate change of promise, stale evidence, or an
over-constrained assertion. Do not silently rewrite expectations to bless a new
implementation. Test semantic obligations separately where the communication
contract does not establish them.

Use the project's tools and libraries. Check current primary documentation for
language-specific APIs and compatibility before adding dependencies. Do not
introduce a broker, hosted service, or deployment just to demonstrate this skill.

## Connect evidence to versions

When independent deployment is in scope, publish contracts and verification
results with immutable application versions and branch metadata. Verify the
relevant deployed or supported consumer versions, not only the latest artifact.
Use the project's compatibility gate for the actual destination environment.
Missing verification is unknown, not a pass. Pending consumer expectations may
avoid failing a provider build while still blocking the unsupported consumer.

Record deployments/releases after success and keep supported versions accurate.
For a breaking migration, consider adding both representations, migrating
consumers, then retiring the old promise after its support obligation ends.
Check rollback compatibility. Follow the user's existing deployment authority;
this skill grants no additional permission.

## Deliver a bounded conclusion

Report the boundary, known consumer obligations, changes or recommendations,
checks actually run with their outcomes, and any migration or evidence gap.
Link evidence to the tested source revision where available. Keep proposed
checks, educational simulations, and observed results distinct. A local contract
pass supports the checked interactions, not a claim that the whole system is safe.

## References

Read only the source relevant to the present question:

- [Consumer tests](https://docs.pact.io/consumer)
- [Provider verification](https://docs.pact.io/provider)
- [Communication versus functional tests](https://docs.pact.io/consumer/contract_tests_not_functional_tests)
- [Deployment compatibility](https://docs.pact.io/pact_broker/can_i_deploy)
- [Optional human learning guide](https://harmony-contract-studio.rjfryman.chatgpt.site)
  — private Harmony Contract Studio; access is optional and never required.

References checked 15 September 2026. Recheck implementation-specific guidance
when applying the skill.
