/**
 * This script generates the data/contributors file which lists all the known
 * contributors to this site.
 */
const ChildProcess = require('child_process');
const ReLine = /(.*?) <(.*?)>/;
const FS = require('fs');
const Path = require('path');
const Crypto = require('crypto');

function hash(str) {
    const c = Crypto.createHash('md5');
    c.update(str.toLowerCase().trim());
    return c.digest('hex');
}


ChildProcess.exec('git log --pretty="%an <%ae>" | uniq', (err, stdout) => {
    if (err) {
            console.error(err);
            process.exit(1);
        }
    const names = stdout.toString('utf-8').split('\n').map(line => {
        const mo = ReLine.exec(line);
        if (mo) {
            return {
                name: mo[1],
                email: mo[2],
                hash: hash(mo[2])
            };
        }
        return null;
    }).filter(name => name);
    FS.writeFile(Path.join('data/contributors.json'), JSON.stringify(names), (err) => {
        if (err) {
            console.error(err);
            process.exit(1);
        }
    });
});
