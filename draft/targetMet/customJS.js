export default function checker(info) {
    const { activator, checkingTimeOut } = info;
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
            // resolve({
            //     finalResult: value === true,
            //     message: value === true ? "Condition met successfully." : "Condition not met.",
            //     details: {
            //         outcome: value === true ? "success" : "failure",
            //         reason: value === true ? null : "Unexpected value received",
            //         actualValue: value,
            //         expectedValue: true,
            //         error: null
            //     }
            // });
        }

        timeoutId = setTimeout(() => {
            active(false);
        }, checkingTimeOut);
    });
}