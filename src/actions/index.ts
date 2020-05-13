import { ClientAction } from './client';
import { SpaceAction } from './space';

export * from './client';
export * from './space';

export type Action = (
    ClientAction |
    SpaceAction
);
