import {Client} from './client';
import {Space} from './space';
import {ModelInformation} from './model';
import { Utils } from './utils';

export * from './client';
export * from './space';
export * from './model';
export * from './utils';
/**
 * Application state.
 */
export interface State {
    Client: Client,
    Space: Space,
    Model: ModelInformation,
    Utils: Utils
};