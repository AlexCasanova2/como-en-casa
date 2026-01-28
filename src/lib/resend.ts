import { Resend } from 'resend';

let resendInstance: Resend | null = null;

export const getResend = () => {
    if (!resendInstance) {
        const apiKey = process.env.RESEND_API_KEY;
        if (!apiKey) {
            throw new Error('RESEND_API_KEY is not configured');
        }
        resendInstance = new Resend(apiKey);
    }
    return resendInstance;
};

// For backward compatibility
export const resend = new Proxy({} as Resend, {
    get(target, prop) {
        return (getResend() as any)[prop];
    }
});
