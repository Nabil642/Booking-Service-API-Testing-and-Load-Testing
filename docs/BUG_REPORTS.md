# Defects and API quirks found while testing

Re-check each item against the live service before showing this in an interview, because the public service can change.

| ID | Title | Severity | Steps | Expected | Actual |
|----|-------|----------|-------|----------|--------|
| BUG-001 | Login with wrong credentials returns HTTP 200 | Medium | POST /auth with a wrong password | 401 Unauthorized | 200 with `{"reason":"Bad credentials"}` |
| BUG-002 | Missing required field crashes the server | High | POST /booking without `lastname` | 400 with a validation message | 5xx server error |
| BUG-003 | Successful DELETE returns 201 Created | Low | DELETE /booking/{id} with a valid token | 200 or 204 | 201 |
| BUG-004 | DELETE of a non-existent booking returns 405 | Low | DELETE /booking/99999999 | 404 | 405 Method Not Allowed |
| BUG-005 | Health check returns 201 Created | Low | GET /ping | 200 OK | 201 |

Automated coverage: BUG-001 and BUG-002 use `test.fail()` in Playwright; BUG-003 to BUG-005 are asserted as current behaviour with a comment.
