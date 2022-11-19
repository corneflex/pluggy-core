import { exec } from 'child_process';

export const execute = (cmd: string, options?: object): Promise<void> =>
    new Promise((resolve, reject) => {
        exec(cmd, options, (err: any, stdout: any, stderr: any) => {
            if (err) {
                reject(stderr);
            } else {
                // Logger.debug(stdout);
                resolve();
            }
        });
    });
