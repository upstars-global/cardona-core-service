# Root cause — finding the field when createmeta doesn't have it

Read this **only** when Step 3a (`getJiraIssueTypeMetaWithFields`) did not return a "Root cause" field.
It is a rare path and deliberately kept out of the main skill: it costs tokens and almost never runs.

`getJiraIssueTypeMetaWithFields` returns **create**-screen metadata. A field that lives only on the
**edit** screen (or only in the issue's "Details" panel) is missing there while still being perfectly
writable — observed on BAC / issue type "Баг", where "Root cause" is absent from createmeta yet users
set it in the UI every day. **Never conclude "the field doesn't exist" from 3a alone.** Also note that
`getJiraIssue` with `expand: "editmeta"` does not help: the MCP wrapper trims `editmeta` down to the
fields you requested, so the custom field never appears.

Fallback, in order:

1. **Find the id** — delegate one read to a subagent (Agent tool, `subagent_type: 'general-purpose'`)
   so the huge payload never enters this context. Instruct it to call `getJiraIssue` with
   `issueIdOrKey: <ticket>`, `fields: ["*all"]`, `expand: "names"`, locate in the `names` map the
   entry whose value is exactly `Root cause`, and return **only** its `customfield_XXXXX` key, the
   current value of that field, and whether that value is an array or an object. (`*all` is banned in
   the main context — inside a throwaway subagent it is fine.)
2. **Harvest the options** — `allowedValues` is unavailable outside createmeta, so collect the
   options actually in use across the project:
   `searchJiraIssuesUsingJql`, `jql: 'project = BAC AND "Root cause" is not EMPTY ORDER BY updated DESC'`,
   `fields: ["customfield_XXXXX"]`, `maxResults: 100`. JQL accepts the field **by name**, so this also
   proves the field exists. The response is oversized and the tool spills it to a file — do **not**
   read that file, extract with `jq`:

   ```bash
   jq -r '[.issues.nodes[].fields.customfield_XXXXX | select(.!=null) | if type=="array" then .[] else . end | {id, value}] | unique_by(.value) | .[] | "\(.id)\t\(.value)"' <spilled-file>
   ```

   Add `| type] | unique` on the same path to confirm single (`object`) vs multi (`array`) select.
3. Only if **both** the id lookup and the JQL sweep come back empty does the field truly not exist:
   one-line note, Step 9, stop.

The harvested list is "options observed in use" — it can miss an option nobody has picked yet. That is
acceptable for categorising, but say so if none of the harvested options fits well.
