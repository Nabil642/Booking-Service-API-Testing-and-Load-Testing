# Restful-Booker API QA

API quality suite for the practice booking service [restful-booker.herokuapp.com](https://restful-booker.herokuapp.com/apidoc/index.html).

| Layer | Tool | What it covers |
|-------|------|----------------|
| API automation | Playwright `request` + TypeScript | CRUD lifecycle, negative and security checks, JSON schema contract, data-driven scenarios |
| API automation | Postman + Newman | Same lifecycle as a readable, shareable collection with tests and chained variables |
| Performance | Apache JMeter | Auth, create, read, update, delete and verify-deleted with random data per user |
| CI | GitHub Actions | Playwright, Newman and a tiny JMeter run |

This project is API-only, so Playwright is used as an API testing framework (no browser). The UI side of Playwright is shown in the other two projects.

## Highlights
- **`BookingClient`** wraps the endpoints, tracks created bookings and cleans them up after each test, so tests stay independent.
- **Contract tests** validate response shapes with JSON Schema (Ajv).
- **Data-driven tests** are generated from `data/bookings.json`.
- **Known defects are documented and tracked with `test.fail()`**: the suite stays green today and turns red when the bug is fixed. See `docs/BUG_REPORTS.md`.
- **JMeter** extracts the token and booking id, sends random data with `__RandomString` / `__Random`, and asserts each step, including that the deleted booking returns 404.

## Setup
Requirements: Node.js 18+, Java 8+, [Apache JMeter 5.6.x](https://jmeter.apache.org/download_jmeter.cgi) on your PATH.
```bash
npm install
```
No browser download is needed.

## Run
```bash
npm test               # Playwright API tests
npm run report         # HTML report

npm run postman        # Newman -> reports/postman/report.html

./jmeter/run-load-test.sh 3 6 2       # Linux / macOS (users, ramp-up s, loops)
jmeter\run-load-test.bat 3 6 2        # Windows
```
JMeter dashboard: `jmeter/results/report/index.html`.

## Notes
- The public service resets its data regularly and shares it with other testers. Tests create their own data and remove it.
- If a "known defect" test starts failing because it unexpectedly passes, the bug was fixed: remove the `test.fail()` line.
- Keep load tiny. This is a shared practice service.
