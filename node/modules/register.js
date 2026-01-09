import { randomBytes, createHash } from "crypto";

// Function to generate a random saltHash
export function generateSalt() {
  return randomBytes(16).toString("hex"); // 16 bytes will generate a 32-character hex string
}

// Function to hash a password with salt using SHA-256
export function hashPassword(password, salt) {
  const hash = createHash("sha256");
  hash.update(salt + password); // Concatenating salt and password
  return hash.digest("hex");
}

//Function for check hash and salt to input password
export function isPassCorrect(password, hashValue, salt) {
  const hashedInputPassword = this.hashPassword(password, salt);
  return hashedInputPassword === hashValue;
}

// Function to generate a random identity token
export function generateIdentityToken() {
  // Generates a 32-character hex string
  return randomBytes(16).toString("hex");
}

/**
 * Function to generate random hex string for captcha authentication
 * @returns {string} 16-bit string
 */
export function generateCaptchaToken() {
  return randomBytes(8).toString("hex");
}
