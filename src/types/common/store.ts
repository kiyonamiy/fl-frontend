import { StoreState as ExamplePageStoreState } from '../example-page/store';

// 和 store/reducer 键值命名要保持一致
export default interface CombinedStoreState {
  readonly examplePage: ExamplePageStoreState;
}
