import { PageProvider } from '../PageProvider';

export class MockPageProvider extends PageProvider {
  public constructor(open: boolean = false) {
    super(open);
  }
}
