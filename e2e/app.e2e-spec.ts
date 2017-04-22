import { Ng2chordPage } from './app.po';

describe('ng2chord App', () => {
  let page: Ng2chordPage;

  beforeEach(() => {
    page = new Ng2chordPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
