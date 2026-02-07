# Repository Guidelines

## Project Structure & Module Organization
- `ajax_jquery_json_Beispiel/` contains the AJAX/jQuery sample app with HTML, JS, and sample data.
- `ajax_jquery_json_Beispiel/js/` holds client-side modules like `main.js`, `m_data_get.js`, and `m_data_render.js`.
- `ajax_jquery_json_Beispiel/data/` stores JSON fixtures used by the sample.
- `Blueprints/` provides JS blueprints for auth and event flows (JWT, register, events).
- `Bilder/` contains diagrams and screenshots referenced in `README.md`.
- `CodexCLI/` has agent reference notes.

## Build, Test, and Development Commands
There is no build or package manager configuration in this repository. To preview the sample:
- Open `ajax_jquery_json_Beispiel/ajax_jquery_json.html` in a browser.

For API exploration and manual validation, use Postman as suggested in `README.md`.

## Coding Style & Naming Conventions
- JavaScript uses 2-space indentation and semicolons (see `ajax_jquery_json_Beispiel/js/main.js`).
- Prefer jQuery’s `$(document).ready(...)` pattern for initializing DOM behavior.
- Keep JS module filenames descriptive and lowercase with underscores, e.g. `m_data_get.js`, `m_data_render.js`.

## Testing Guidelines
No automated test framework is present. Verify changes manually:
- Use the sample page to validate AJAX flows and DOM updates.
- Use Postman to check REST endpoints and JWT behavior.
If you add tests, place them in a new `tests/` folder and name them by feature (e.g. `auth-login.manual.md`).

## Commit & Pull Request Guidelines
- No enforced commit convention. Use short, descriptive messages scoped to the change (e.g. “Update AJAX example data”).
- Pull requests should include a concise description, testing notes, and screenshots for UI changes.

## Security & Configuration Tips
- Do not commit real credentials. Use placeholders for DB/FTP values mentioned in documentation.
