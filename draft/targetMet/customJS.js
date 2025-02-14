export default function checker(activator, checkingTimeOut) {
    return new Promise((resolve) => {
        let isCompleted = false;
        let timeoutId;

        const active = (value) => {
            if (!isCompleted) {
                isCompleted = true;
                clearTimeout(timeoutId);
                resolve(value === true);
            }
        };

        const result = activator(active);
        if (result === true) {
            active(true);
        }

        timeoutId = setTimeout(() => {
            active(false);
        }, checkingTimeOut);
    });
}