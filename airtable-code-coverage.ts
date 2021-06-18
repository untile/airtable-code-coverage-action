/**
 * Module dependencies.
 */

import * as core from '@actions/core';
import Airtable from 'airtable';
import BigNumber from 'bignumber.js';
import fs from 'fs';
import xml2js from 'xml2js';

/**
 * Run.
 */

export default async function run() {
  try {
    const airtableBaseId = core.getInput('airtable_base_id', { required: true });
    const airtableRecordId = core.getInput('airtable_record_id', { required: true });
    const airtableFieldName = core.getInput('airtable_field_name', { required: true });
    const airtableTableName = core.getInput('airtable_table_name', { required: true });
    const airtableToken = core.getInput('airtable_token', { required: true });

    Airtable.configure({ apiKey: airtableToken });

    const airtable = Airtable.base(airtableBaseId);
    const parser = new xml2js.Parser();
    const xml = await fs.promises.readFile(`./coverage/clover.xml`);
    const report = await parser.parseStringPromise(xml);
    const { statements, coveredstatements } = report.coverage.project[0].metrics[0].$;

    await airtable(airtableTableName).update(
      [
        {
          fields: {
            [airtableFieldName]: new BigNumber(coveredstatements).dividedBy(statements).multipliedBy(100).valueOf()
          },
          id: airtableRecordId
        }
      ],
      { typecast: true }
    );
  } catch (error) {
    core.setFailed(error.message);
  }
}
