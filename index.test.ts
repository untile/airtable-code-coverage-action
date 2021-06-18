/**
 * Module dependencies.
 */

import * as core from '@actions/core';
import fsMock from 'mock-fs';
import nock from 'nock';
import run from './airtable-code-coverage';

/**
 * Test `run`.
 */

describe('run()', () => {
  nock.disableNetConnect();

  afterEach(() => {
    fsMock.restore();
  });

  it('should call `core.setFailed` with error if required `airtable_base_id` is not present', async () => {
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_base_id');
  });

  it('should call `core.setFailed` with error if required `airtable_record_id` is not present', async () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('');
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_record_id');
  });

  it('should call `core.setFailed` with error if required `airtable_field_name` is not present', async () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('').mockReturnValueOnce('');
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_field_name');
  });

  it('should call `core.setFailed` with error if required `airtable_table_name` is not present', async () => {
    jest.spyOn(core, 'getInput').mockReturnValueOnce('').mockReturnValueOnce('').mockReturnValueOnce('');
    jest.spyOn(core, 'getInput');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_table_name');
  });

  it('should call `core.setFailed` with error if required `airtable_token` is not present', async () => {
    jest
      .spyOn(core, 'getInput')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('');
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Input required and not supplied: airtable_token');
  });

  it('should call `core.setFailed` with error if it fails to read the coverage file', async () => {
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
    fsMock({ './coverage/foo.xml': 'foo' });
    jest
      .spyOn(core, 'getInput')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('foo');

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith("ENOENT, no such file or directory './coverage/clover.xml'");
  });

  it('should call `core.setFailed` with error if airtable call throws', async () => {
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
    nock('https://api.airtable.com/v0').patch('/foo/bar/?').reply(404);
    fsMock({
      './coverage/clover.xml':
        '<?xml version="1.0" encoding="UTF-8"?><coverage><project><metrics statements="22" coveredstatements="22"/></project></coverage>'
    });
    jest
      .spyOn(core, 'getInput')
      .mockReturnValueOnce('foo')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('')
      .mockReturnValueOnce('bar')
      .mockReturnValueOnce('boz');

    await run();

    expect(core.setFailed).toHaveBeenCalledTimes(1);
    expect(core.setFailed).toBeCalledWith('Could not find what you are looking for');
  });

  it('should call airtable API with given values and correct coverage values', async () => {
    jest.spyOn(core, 'setFailed').mockImplementation(jest.fn());
    fsMock({
      './coverage/clover.xml':
        '<?xml version="1.0" encoding="UTF-8"?><coverage><project><metrics statements="75" coveredstatements="30"/></project></coverage>'
    });
    nock('https://api.airtable.com/v0', {
      reqheaders: {
        authorization: 'Bearer qux'
      }
    })
      .patch('/foo/baz/?', {
        records: [
          {
            fields: {
              biz: '40'
            },
            id: 'bar'
          }
        ],
        typecast: true
      })
      .reply(200, {
        records: []
      });
    jest
      .spyOn(core, 'getInput')
      .mockReturnValueOnce('foo')
      .mockReturnValueOnce('bar')
      .mockReturnValueOnce('biz')
      .mockReturnValueOnce('baz')
      .mockReturnValueOnce('qux');

    await run();

    expect(core.setFailed).not.toHaveBeenCalled();
  });
});
