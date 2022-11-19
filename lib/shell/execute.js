import { exec } from 'child_process';
export const execute = (cmd, options) => new Promise((resolve, reject) => {
    exec(cmd, options, (err, stdout, stderr) => {
        if (err) {
            reject(stderr);
        }
        else {
            // Logger.debug(stdout);
            resolve();
        }
    });
});
