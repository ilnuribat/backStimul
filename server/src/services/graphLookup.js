function getFields(info, level = 1) {
  let next = Object.assign({}, info.fieldNodes[0].loc.startToken);
  let counter = 0;
  const fields = [];

  while (next) {
    if (next.kind === '{') {
      counter += 1;
    }
    if (next.kind === '}') {
      counter -= 1;
    }

    if (counter === level && next.kind === 'Name') {
      fields.push(next.value);
    }

    /* eslint-disable prefer-destructuring */
    next = next.next;
  }

  return fields;
}

function getPath(info) {
  let path = Object.assign({}, info.path);
  let pathStr = path.key;

  path = path.prev;
  let key;

  while (path) {
    if (!Number.isNaN(+path.key)) {
      key = 'n';
    } else {
      key = path.key;
    }
    pathStr = `${key}.${pathStr}`;

    path = path.prev;
  }

  return pathStr;
}

module.exports = {
  getFields,
  getPath,
};
