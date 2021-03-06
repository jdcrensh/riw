// @flow

import mock from 'mock-fs';
import outdent from 'outdent';

import type { ConfigSparse } from '../../../../config';
import { configResolve } from '../../../../config';

import { armdExtractSource } from '../extract';

const notify = () => x => x;

type Fixture = {
    name: string,
    in: { [key: string]: string },
    configOverride?: ConfigSparse,
};

const fixtures: Fixture[] = [
    {
        name: '01',
        in: {}, // empty dir
    },

    {
        name: '02',
        in: {
            'a.js': 'export default a => a;',
            'b.js': 'export default b => b + 1;',
        },
    },

    {
        name: '03',
        in: {
            'a.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1: {
                        id: 'a.1',
                        defaultMessage: 'a.1!',
                    },
                });
            `,
            'b.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b1: {
                        id: 'b.1',
                        defaultMessage: 'b.1!',
                    },
                    b2: {
                        id: 'b.2',
                        description: 'b.2 desc',
                        defaultMessage: 'b.2!',
                    },
                    b3: {
                        id: 'b.3',
                        description: {
                            foo: 'bar',
                            abc: 'def',
                        },
                        defaultMessage: 'b.3!',
                    },
                });
            `,
        },
    },

    {
        name: '04',
        in: {
            'a.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1: {
                        id: 'a.1',
                        defaultMessage: 'a.1!',
                    },
                });
            `,
            'aa.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    a1again: {
                        id: 'a.1',
                        defaultMessage: 'a.1 again!',
                    },
                });
            `,
            'b.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b1: {
                        id: 'b.1',
                        defaultMessage: 'b.1!',
                    },
                    b2: {
                        id: 'b.2',
                        description: 'b.2 desc',
                        defaultMessage: 'b.2!',
                    },
                });
            `,
            'bb.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    b2again: {
                        id: 'b.2',
                        description: 'b.2 again desc',
                        defaultMessage: 'b.2 again!',
                    },
                });
            `,
            'c.js': outdent`
                import { defineMessages } from 'react-intl';

                const msg = defineMessages({
                    c1: {
                        id: 'c.1',
                        defaultMessage: 'c.1!',
                    },
                });
            `,
        },
    },
];

describe('lib/riw/app/translate/extract.source', () => {
    fixtures.forEach((fixture) => {
        it(fixture.name, () => {
            mock({
                '/fixtures': {
                    [fixture.name]: fixture.in,
                },
            });

            const cfg = configResolve({
                sourceDirs: [`/fixtures/${fixture.name}/**/*.js`],
                ...fixture.configOverride,
            });

            const received = armdExtractSource(notify)(cfg);

            mock.restore();

            expect(received).toMatchSnapshot();
        });
    });
});
