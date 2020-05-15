import { ClientAction } from './client';
import { SpaceAction } from './space';
import { UtilsAction } from './utils';

export * from './client';
export * from './space';

export type Action = (
    ClientAction |
    SpaceAction |
    UtilsAction
);
