function getIfSet(object, targetPath) {
console.log(targetPath);
  if (object == null) { return undefined }

  let parts = targetPath.split('.')
console.log(parts);
  let value = object;

  for (let i = 0; i < parts.length; i++) {
    console.log(parts[i]);
    if (value[parts[i]]) {
      value = value[parts[i]]
    } else {
      return undefined
    }
  }
console.log(value);
  return value
}

export { getIfSet }