const makeDir = require('make-dir');
 
(async () => {
    const paths = await Promise.all([
        makeDir('unicorn/rainbow'),
        makeDir('foo/bar')
    ]);
 
    console.log(paths);
    /*
    [
        '/Users/sindresorhus/fun/unicorn/rainbow',
        '/Users/sindresorhus/fun/foo/bar'
    ]
    */
})();
