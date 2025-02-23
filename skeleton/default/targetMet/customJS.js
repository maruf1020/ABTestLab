export default function checker(activator) {
    const checkingTimeout = 3000;
    return new Promise((resolve) => {
        const startTime = Date.now();
        const result = {
            status: false,
            messages: [],
            summary: '',
            time: 0,
            details: {
                activationMethod: null,
                checkingTimeout,
                receivedCallback: false,
                executionTime: 0,
                triggeredBy: 'timeout',
                wasImmediate: false
            }
        };

        let isCompleted = false;
        let timeoutId;

        const active = (value) => {
            if (!isCompleted) {
                isCompleted = true;
                clearTimeout(timeoutId);

                result.status = value === true;
                result.details.receivedCallback = true;
                result.details.triggeredBy = value ? 'manual_activation' : 'manual_deactivation';
                result.details.activationMethod = 'callback';

                result.messages.push(value ?
                    'Activated through manual callback' :
                    'Deactivated through manual callback'
                );

                finalizeResult();
                resolve(result);
            }
        };

        const finalizeResult = () => {
            result.time = Date.now() - startTime;
            result.details.executionTime = result.time;
            result.summary = result.status ?
                `Active (${result.details.triggeredBy.replace(/_/g, ' ')})` :
                `Inactive (${result.details.triggeredBy.replace(/_/g, ' ')})`;
        };

        try {
            const activatorResult = activator(active);

            // Only handle EXPLICIT boolean returns immediately
            if (typeof activatorResult === 'boolean') {
                result.status = activatorResult;
                result.details = {
                    ...result.details,
                    activationMethod: 'immediate',
                    triggeredBy: activatorResult ?
                        'immediate_activation' :
                        'immediate_deactivation',
                    wasImmediate: true
                };
                result.messages.push(`Immediate ${activatorResult ? 'activation' : 'deactivation'} from return value`);
                finalizeResult();
                resolve(result);
                return;
            }

            // For non-boolean returns, wait for callback/timeout
            timeoutId = setTimeout(() => {
                if (!isCompleted) {
                    result.messages.push(`Timed out after ${checkingTimeout}ms`);
                    result.details.triggeredBy = 'timeout';
                    finalizeResult();
                    resolve(result);
                }
            }, checkingTimeout);

        } catch (error) {
            result.messages.push(`Activator error: ${error.message}`);
            result.details.triggeredBy = 'error';
            finalizeResult();
            resolve(result);
        }
    });
}


// Output Format:
// {
//     status: boolean,      // Final activation state
//     messages: string[],   // Sequence of events
//     summary: string,      // One-line conclusion
//     time: number,         // Total execution time
//     details: {
//       activationMethod: null | 'immediate' | 'callback',
//       checkingTimeout: 3000,
//       receivedCallback: boolean,
//       executionTime: number,
//       triggeredBy: 'immediate_activation' | 'immediate_deactivation' |
//                   'manual_activation' | 'manual_deactivation' |
//                   'timeout' | 'error',
//       wasImmediate: boolean
//     }
//   }