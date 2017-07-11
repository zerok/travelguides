/**
 * This script generates the data/contributors file which lists all the known
 * contributors to this site.
 */
const ChildProcess = require('child_process');
const ReLine = /(.*?) <(.*?)>/;
const FS = require('fs');
const Path = require('path');


ChildProcess.exec('git log --pretty="%an <%ae>" | uniq', (err, stdout) => {
    if (err) {
            console.error(err);
            process.exit(1);
        }
    const names = stdout.toString('utf-8').split('\n').map(line => {
        const mo = ReLine.exec(line);
        if (mo) {
            return {name: mo[1]};
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
