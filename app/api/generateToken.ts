import { v4 as uuidv4 } from 'uuid';
import { insertToken } from '../db';

export async function generateToken() {
  const token = uuidv4();

  await insertToken(token);

  return { token };
}