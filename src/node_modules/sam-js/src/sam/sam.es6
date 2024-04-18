import {PlayBuffer, Uint8ArrayToFloat32Array} from '../util/player.es6';

import {Parser} from '../parser/parser.es6';
import {Renderer} from '../renderer/renderer.es6';

/**
 * Process the input and play the audio buffer.
 *
 * @param {String} input
 *
 * @param {object}  [options]
 * @param {Boolean} [options.singmode] Default false.
 * @param {Number}  [options.pitch]    Default 64.
 * @param {Number}  [options.speed]    Default 72.
 * @param {Number}  [options.mouth]    Default 128.
 * @param {Number}  [options.throat]   Default 128.
 *
 * @return {Promise}
 */
export const SamSpeak = (input, options) => {
  const buffer = SamBuffer(input, options);
  if (false === buffer) {
    return Promise.reject();
  }

  // Now push buffer to wave player.
  return PlayBuffer(buffer);
}

/**
 * Process the input and return the audio buffer.
 *
 * @param {String} input
 *
 * @param {object}  [options]
 * @param {Boolean} [options.singmode] Default false.
 * @param {Number}  [options.pitch]    Default 64.
 * @param {Number}  [options.speed]    Default 72.
 * @param {Number}  [options.mouth]    Default 128.
 * @param {Number}  [options.throat]   Default 128.
 *
 * @return {Float32Array|Boolean}
 */
export const SamBuffer = (input, options) => {
  const buffer = SamProcess(input, options);
  if (false === buffer) {
    return false;
  }

  return Uint8ArrayToFloat32Array(buffer);
}

/**
 * Process the input and return the audiobuffer.
 *
 * @param {String} input
 *
 * @param {object}  [options]
 * @param {Boolean} [options.singmode] Default false.
 * @param {Number}  [options.pitch]    Default 64.
 * @param {Number}  [options.speed]    Default 72.
 * @param {Number}  [options.mouth]    Default 128.
 * @param {Number}  [options.throat]   Default 128.
 *
 * @return {Uint8Array|Boolean}
 */
export const SamProcess = (input, options = {}) => {
  const parsed = Parser(input);
  if (false === parsed) {
    return false;
  }

  return Renderer(parsed, options.pitch, options.mouth, options.throat, options.speed, options.singmode);
}
