// app/api/verificationCodes.ts

// This file is used to store verification codes for 2FA
// It is shared between the /send-code and /verify-code routes

// We should switch this to use the database if we have time
// In some ways though, it's more secure to not write to db (/s)
export const verificationCodes = new Map<string, { code: string; expiresAt: number }>();
