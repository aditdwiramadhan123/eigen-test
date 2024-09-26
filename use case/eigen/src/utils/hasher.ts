import * as bcrypt from 'bcrypt';

class Hasher {
  salt: 10;

  hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, +this.salt);
  }

  comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}

export default new Hasher();
