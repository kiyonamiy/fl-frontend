import { ClientAction } from './client';
import { SpaceAction } from './space';
import { UtilsAction } from './utils';
import { GradientAction } from './gradient';

export * from './client';
export * from './space';
export * from './utils';
export * from './gradient';

export type Action = (
    ClientAction |
    SpaceAction |
    UtilsAction |
    GradientAction
);
