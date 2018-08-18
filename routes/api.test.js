const getUserTitle = require('./api').getUserTitle;

it('get the right user title', () => {
    expect(getUserTitle(5)).toEqual('the rookie');
    expect(getUserTitle(66)).toEqual('the pro');
    expect(getUserTitle(150)).toEqual('the god');
});