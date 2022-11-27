/* 
IMPORTANT: This class should only be used for random functions related to generating maps.

*/

export default class Random {
  static g = 48271.0;
  static n = 2147483647;

  static saved = -1;

  static seed = 1;

  static reset(seed = -1) {
    Random.seed = seed != -1 ? seed : parseInt(Date.now() % Random.n, 10);
  }

  static getSeed() {
    return Random.seed;
  }

  static next() {
    const f = (Random.seed * Random.g) % Random.n;
    Random.seed = f < 0 ? Math.ceil(f) : Math.floor(f);
    return Random.seed;
  }

  static float() {
    return Random.next() / Random.n;
  }

  static normal() {
    return (Random.float() + Random.float() + Random.float()) / 3;
  }

  static int(min, max) {
    const f = min + (Random.next() / Random.n) * (max - min);
    return f < 0 ? Math.ceil(f) : Math.floor(f);
  }

  static bool(chance = 0.5) {
    return Random.float() < chance;
  }

  static fuzzy(f = 1.0) {
    if (f == 0) return 0.5;
    else return (1 - f) / 2 + f * Random.normal();
  }

  static save() {
    return (Random.saved = Random.seed);
  }

  static restore(value) {
    if (value == null) {
      value = -1;
    }
    if (value != -1) {
      Random.seed = value;
    } else if (Random.saved != -1) {
      Random.seed = Random.saved;
      Random.saved = -1;
    }
  }
}
