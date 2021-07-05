# airtable-code-coverage-action

## Development

Install the required dependencies:

```bash
yarn
```

And you may now run the tests with:

```bash
yarn test
```

## Inputs

- `airtable_token`: Airtable API token.
- `airtable_base_id`: Airtable base id.
- `airtable_table_name`: Airtable table name.
- `airtable_record_id`: Airtable record id.
- `airtable_field_name`: Airtable field name.

## Releases

Be sure to have configured `GITHUB_TOKEN` in your globals.

```bash
npm version [<new version> | major | minor | patch] -m "Release %s"
git push origin master && git push --tags
```
