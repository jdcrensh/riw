// @flow

import path from 'path';

import type { AbsolutePath, LocaleId } from '../../../../types';
import type { ConfigSparse, ConfigSparseWithSource } from '../../../config';
import { configResolve } from '../../../config';
import tof from '../';

const configBase: ConfigSparse = {
    // common for these tests:
    translationsOutputFile: 'dummy',
    outputMode: 'file-per-locale',
};

type Fixture = {
    name: string,
    configOverride: ConfigSparseWithSource,
    in: LocaleId,
    out: AbsolutePath,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        configOverride: {
            configFile: '/a/b/c/foo.js',
            translationsOutputFile: 'x/y/foo-[locale]-bar.json',
        },
        in: 'aa-aa',
        out: '/a/b/c/x/y/foo-aa-aa-bar.json',
    },

    {
        name: '02',
        configOverride: {
            configFile: '/aa/foo.js',
            translationsOutputFile: 'bb/[locale].json',
        },
        in: 'xx-yy',
        out: '/aa/bb/xx-yy.json',
    },

    {
        name: '03',
        configOverride: {
            translationsOutputFile: 'bb/[locale].json',
        },
        in: 'xx-yy',
        out: path.resolve('bb/xx-yy.json'),
    },
];

describe('lib/translationsOutputFile/fromLid', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            const cfg = configResolve({
                ...configBase,
                ...fixture.configOverride,
            });

            const received = tof(cfg).fromLid(fixture.in);

            expect(received).toBe(fixture.out);
        });
    });
});
