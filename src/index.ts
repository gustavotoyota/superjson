import is from '@sindresorhus/is';

import { JSONValue, SuperJSONValue } from './types';
import { flatten, unflatten } from './utils/flattenizer';
import { isJSONPrimitive } from './utils/isJSONPrimitive';
import { isSerializable } from './utils/isSerializable';
import { transformValue } from './utils/transformValue';

export const serialize = (input: SuperJSONValue) => {
  if (isJSONPrimitive(input)) {
    return { json: input, meta: null };
  }

  if (isSerializable(input)) {
    const { value, type } = transformValue(input);

    return { json: value, meta: type };
  }

  if (is.array(input) || is.plainObject(input)) {
    const flattened = flatten(input) as { [key: string]: any };
    let json: JSONValue = {};
    let meta: JSONValue = {};

    for (const [key, value] of Object.entries(flattened)) {
      if (isJSONPrimitive(value)) {
        json[key] = value;
      } else {
        const { value: transformedValue, type } = transformValue(value);
        json[key] = transformedValue;
        meta[key] = type;
      }
    }

    json = unflatten(json) as { [key: string]: any };
    if (is.array(input)) {
      json = Array.from(Object.values(json));
    }

    meta = is.nonEmptyObject(meta) ? meta : null;

    return { json, meta };
  }

  throw new Error('invalid input');
};

export const deserialize = ({
  json,
  meta,
}: {
  json: JSONValue;
  meta: JSONValue;
}) => {
  if (is.null_(meta)) {
    return json;
  }

  if (is.array(json) || is.plainObject(json)) {
    const flattened = flatten(json) as { [key: string]: any };

    // const output = Object.keys(json).map(key => {
    //   const;
    // });

    console.log(flattened);
  }

  throw new Error('invalid input');
};
