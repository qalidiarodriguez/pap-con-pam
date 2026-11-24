<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

## What Lovable manages

Rules outside this block are the project's own. Change the pieces below in
Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
connected, `send_message` asks Lovable to do it; otherwise ask the user to
use the editor.

- **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
  Ask Lovable to change the schema.
- **Generated files.** Do not edit a file whose header says it is automatically
  generated.
- **AI gateway.** Keep model calls on Lovable's gateway, and keep
  `LOVABLE_API_KEY` out of browser code.
- **Connectors.** Lovable provides native connectors. `list_connectors` shows
  which are enabled; `add_connector` only returns the dashboard link. When a
  connector is enabled, calls go through the connector gateway and need
  `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
  own key and store it in Secrets.
- **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project rules

- Each main space and screen is its own route under `src/routes/` with a shared bottom tab bar and limit banner in `__root.tsx`; state stays local (React state/context), no accounts or backend — the app is an anonymous educational prototype.
- Help-line and center data live only in `src/lib/resources.ts` (`VERIFIED_RESOURCES`); never add a phone or address that isn't verified — unknown places show a "por verificar" note instead. Covered by `src/test/pap-rules.test.ts`.
- Red-flag keyword detection lives in `src/lib/triage.ts`; any red result must stop the scripted PAP flow and show `RedAlert`.
- The Lanita logo is the approved upload stored as the asset pointer `src/assets/lanita-logo-oficial.webp.asset.json`, rendered by `src/components/pap/lanita.tsx`; never redraw it. Favicon/app icons in `public/` are resizes of that same image.
