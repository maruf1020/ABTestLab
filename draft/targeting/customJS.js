//either return true or call active function with true parameter to make the test active. and checkingTimeOut will wait until this waiting time
export default checker = {
    checkingTimeOut: 0,
    activator: function (active) {
        // document.body.addEventListener('click', (e) => {
        //   active(true);
        // });
        return true;
    }
}