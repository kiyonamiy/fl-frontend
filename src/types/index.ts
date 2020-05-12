import {Client} from './client';
import {Space} from './space';
import {ModelInformation} from './model';

export * from './client';
export * from './space';
export * from './model';
/**
 * Application state.
 */
export interface State {
    Client: Client,
    Space: Space,
    Model: ModelInformation
};