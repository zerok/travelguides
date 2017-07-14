const Promise = require('bluebird');
const promisify = require('bluebird').promisify;
const glob = promisify(require('glob').glob);
const exec = promisify(require('child_process').exec);
const crypto = require('crypto');
const Path = require('path');
const writeFile = promisify(require('fs').writeFile);
const linePatterns = [{
    type: 'subject',
    pattern: /^Subject: \[PATCH\] (.*?)$/
}, {
    type: 'commit',
    pattern: /^From (.*?) Mon Sep 17 00:00:00 2001$/
}, {
    type: 'date',
    pattern: /^Date: (.*?)$/
}, {
    type: 'author',
    pattern: /^From: (.*?) <(.*?)>$/
}];

function hash(str) {
    const h = crypto.createHash('md5');
    h.update(str.toLowerCase().trim());
    return h.digest('hex');
}

function getCommits(data) {
    const result = [];
    let current = null;
    data.split('\n').forEach(line => {
        for (let i = 0, len = linePatterns.length; i < len; i++) {
            let type = linePatterns[i].type;
            let mo = linePatterns[i].pattern.exec(line);
            if (mo) {
                if (type === 'commit') {
                    if (current) result.push(current);
                    current = {
                        id: mo[1]
                    };
                } else if (type === 'author') {
                    current.author = {
                        name: mo[1],
                        email: mo[2],
                        hash: hash(mo[2])
                    }
                } else {
                    current[type] = mo[1];
                }
                return;
            }
        }
    });
    if (current) {
        result.push(current);
    }
    return result;
}

glob('content/poi/**/*.md').then(files => {
    return Promise.map(files, file => {
        return exec(`git log --follow --format=email "${file}"`).then(output => {
            return {
                path: file,
                log: getCommits(output)
            };
        });
    });
}).then(logs => {
    const result = logs.reduce((result, log) => {
        log.contributors = log.log.reduce((result, entry) => {
            if (entry.author && typeof result[entry.author.email] === 'undefined') {
                result[entry.author.email] = entry.author;
            }
            return result;
        }, Object.create(null));
        result[log.path] = {log: log.log, contributors: log.contributors};
        return result;
    }, Object.create(null));
    return writeFile(Path.join('data', 'history.json'), JSON.stringify(result));
}).catch(err => {
    console.error(err);
    process.exit(1);
})
