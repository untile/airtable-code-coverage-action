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

## Releases

Be sure to have configured `GITHUB_TOKEN` in your globals.

```bash
npm version [<new version> | major | minor | patch] -m "Release %s"
git push origin master && git push --tags
```
