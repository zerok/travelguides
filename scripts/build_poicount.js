/**
 * This script generates the data/poicount.json file which contains the number
 * of POIs per region.
 */
const Glob = require('glob');
const YAML = require('yaml-front-matter');
const FS = require('fs');
const Path = require('path');

new Promise((resolve, reject) => {
    Glob.glob(Path.join('content', 'poi', '**', '*.md'), (err, files) => {
        if (err) {
            return reject(err);
        }
        return resolve(files);
    });
}).then(files => {
    return Promise.all(files.map(file => {
        return new Promise((resolve, reject) => {
            FS.readFile(file, {encoding: 'utf-8'}, (err, content) => {
                if (err) {
                    return reject(err);
                }
                return resolve({
                    path: file,
                    content: content
                });
            });
        });
    }));
}).then(contents => {
    const data = contents.map(content => {
        return {
            meta: YAML.loadFront(content.content),
            path: content.path
        };
    }).reduce((result, file) => {
        const reg = file.meta.region;
        const elems = reg.split('-');
        for (let i = 0; i < elems.length; i++) {
            let key = elems.slice(0, i + 1).join('-');
            result[key] = (result[key] || 0) + 1;
        }
        return result;
    }, Object.create(null));
    return data;
}).then(data => {
    return new Promise((resolve, reject) => {
        FS.writeFile(Path.join('data/poicount.json'), JSON.stringify(data), (err) => {
            if (err) {
                return reject(err);
            }
            return resolve();
        });
    });
}).catch(err => {
    console.error(err);
    process.exit(1);
});

