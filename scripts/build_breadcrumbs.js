const util = require('util');
const glob = util.promisify(require('glob').glob);
const readFile = util.promisify(require('fs').readFile);
const writeFile = util.promisify(require('fs').writeFile);
const yaml = require('yaml-front-matter');

function buildPath(fileMap, key, result) {
    const file = fileMap[key];
    result.unshift({
        title: file.meta.title,
        url: `/${key.substring(0, key.length - 3)}`
    });
    if (file.meta.parent) {
        return buildPath(fileMap, `region/${file.meta.parent}.md`, result);
    }
    if (file.meta.region) {
        return buildPath(fileMap, `region/${file.meta.region}.md`, result);
    }
    return result;
}

glob('content/**/*.md').then(files => {
    return Promise.all(files.map(file => {
        return readFile(file, {encoding: 'utf-8'}).then(content => {
            return {
                path: file,
                meta: yaml.loadFront(content)
            };
        });
    }));
}).then(files => {
    return files.reduce((result, file) => {
        result[file.path.substring(8, file.path.length)] = file;
        return result;
    }, Object.create(null));
}).then(fileMap => {
    const result = Object.create(null);
    Object.keys(fileMap).forEach(fileKey => {
        const path = buildPath(fileMap, fileKey, []);
        result[fileKey] = path;
    });
    return result;
}).then(data => {
    return writeFile('data/breadcrumbs.json', JSON.stringify(data));
}).catch(err => {
    console.error(err);
    process.exit(1);
})
