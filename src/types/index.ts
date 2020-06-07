import {Client} from './client';
import {Space} from './space';
import {ModelInformation} from './model';
import { Utils } from './utils';
import { Gradient } from './gradient';

export * from './client';
export * from './space';
export * from './model';
export * from './utils';
export * from './gradient';
/**
 * Application state.
 */
export interface State {
    Client: Client,
    Space: Space,
    Model: ModelInformation,
    Utils: Utils,
    Gradient: Gradient
};
