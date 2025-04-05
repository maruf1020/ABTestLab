(() => {
    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {
        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);
        if (timer <= 0) return;
        (!isVariable && elements.length >= minElements) || (isVariable && typeof window[waitFor] !== "undefined") ? callback(elements) : setTimeout(() => waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);
    }

    const testsDetailsData = {}
    window.testsDetailsData = testsDetailsData;

    const asset = {
        sortIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M9.99996 15.0833L11.9375 13.1458C12.1041 12.9792 12.3055 12.8958 12.5416 12.8958C12.7777 12.8958 12.9791 12.9792 13.1458 13.1458C13.3125 13.3125 13.3958 13.5139 13.3958 13.75C13.3958 13.9861 13.3125 14.1875 13.1458 14.3542L10.5833 16.9167C10.5 17 10.4097 17.059 10.3125 17.0938C10.2152 17.1285 10.1111 17.1458 9.99996 17.1458C9.88885 17.1458 9.78468 17.1285 9.68746 17.0938C9.59024 17.059 9.49996 17 9.41663 16.9167L6.85413 14.3542C6.68746 14.1875 6.60413 13.9861 6.60413 13.75C6.60413 13.5139 6.68746 13.3125 6.85413 13.1458C7.02079 12.9792 7.22218 12.8958 7.45829 12.8958C7.6944 12.8958 7.89579 12.9792 8.06246 13.1458L9.99996 15.0833ZM9.99996 5L8.06246 6.9375C7.89579 7.10417 7.6944 7.1875 7.45829 7.1875C7.22218 7.1875 7.02079 7.10417 6.85413 6.9375C6.68746 6.77083 6.60413 6.56944 6.60413 6.33333C6.60413 6.09722 6.68746 5.89583 6.85413 5.72917L9.41663 3.16667C9.49996 3.08333 9.59024 3.02431 9.68746 2.98958C9.78468 2.95486 9.88885 2.9375 9.99996 2.9375C10.1111 2.9375 10.2152 2.95486 10.3125 2.98958C10.4097 3.02431 10.5 3.08333 10.5833 3.16667L13.1458 5.72917C13.3125 5.89583 13.3958 6.09722 13.3958 6.33333C13.3958 6.56944 13.3125 6.77083 13.1458 6.9375C12.9791 7.10417 12.7777 7.1875 12.5416 7.1875C12.3055 7.1875 12.1041 7.10417 11.9375 6.9375L9.99996 5Z" fill="#555555"/>
        </svg>
        `,
        searchIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12.4765 13.8907C11.4957 14.5892 10.2958 15 9 15C5.68629 15 3 12.3137 3 9C3 5.68629 5.68629 3 9 3C12.3137 3 15 5.68629 15 9C15 10.2958 14.5892 11.4957 13.8907 12.4765L16.7071 15.2929C17.0976 15.6834 17.0976 16.3166 16.7071 16.7071C16.3166 17.0976 15.6834 17.0976 15.2929 16.7071L12.4765 13.8907ZM13 9C13 11.2091 11.2091 13 9 13C6.79086 13 5 11.2091 5 9C5 6.79086 6.79086 5 9 5C11.2091 5 13 6.79086 13 9Z" fill="#555555"/>
        </svg>
        `,
        minusIcon: `
        <svg class="ab--test-pilot-minus-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M6 13C5.71667 13 5.47917 12.9042 5.2875 12.7125C5.09583 12.5208 5 12.2833 5 12C5 11.7167 5.09583 11.4792 5.2875 11.2875C5.47917 11.0958 5.71667 11 6 11H18C18.2833 11 18.5208 11.0958 18.7125 11.2875C18.9042 11.4792 19 11.7167 19 12C19 12.2833 18.9042 12.5208 18.7125 12.7125C18.5208 12.9042 18.2833 13 18 13H6Z" fill="#121212"/>
        </svg> 
        `,
        plusIcon: `
        <svg class="ab--test-pilot-plus-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <path d="M9.16667 11.3333H5.00001C4.76389 11.3333 4.56598 11.2535 4.40626 11.0937C4.24653 10.934 4.16667 10.7361 4.16667 10.5C4.16667 10.2639 4.24653 10.066 4.40626 9.90624C4.56598 9.74652 4.76389 9.66666 5.00001 9.66666H9.16667V5.49999C9.16667 5.26388 9.24653 5.06596 9.40626 4.90624C9.56598 4.74652 9.76389 4.66666 10 4.66666C10.2361 4.66666 10.434 4.74652 10.5938 4.90624C10.7535 5.06596 10.8333 5.26388 10.8333 5.49999V9.66666H15C15.2361 9.66666 15.434 9.74652 15.5938 9.90624C15.7535 10.066 15.8333 10.2639 15.8333 10.5C15.8333 10.7361 15.7535 10.934 15.5938 11.0937C15.434 11.2535 15.2361 11.3333 15 11.3333H10.8333V15.5C10.8333 15.7361 10.7535 15.934 10.5938 16.0937C10.434 16.2535 10.2361 16.3333 10 16.3333C9.76389 16.3333 9.56598 16.2535 9.40626 16.0937C9.24653 15.934 9.16667 15.7361 9.16667 15.5V11.3333Z" fill="#525252"/>
        </svg>`,
        minimiseIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5.28696 19.2881L9.2548 15.3128V18.7556C9.2548 18.9545 9.33383 19.1453 9.47449 19.286C9.61516 19.4266 9.80594 19.5057 10.0049 19.5057C10.2038 19.5057 10.3946 19.4266 10.5352 19.286C10.6759 19.1453 10.7549 18.9545 10.7549 18.7556V13.5051C10.7549 13.3062 10.6759 13.1154 10.5352 12.9748C10.3946 12.8341 10.2038 12.7551 10.0049 12.7551H4.75441C4.55548 12.7551 4.3647 12.8341 4.22404 12.9748C4.08337 13.1154 4.00435 13.3062 4.00435 13.5051C4.00435 13.7041 4.08337 13.8948 4.22404 14.0355C4.3647 14.1762 4.55548 14.2552 4.75441 14.2552H8.19721L4.22187 18.223C4.15157 18.2928 4.09577 18.3757 4.05769 18.4671C4.01961 18.5585 4 18.6566 4 18.7556C4 18.8546 4.01961 18.9526 4.05769 19.044C4.09577 19.1354 4.15157 19.2184 4.22187 19.2881C4.2916 19.3584 4.37455 19.4142 4.46596 19.4523C4.55736 19.4904 4.6554 19.51 4.75441 19.51C4.85343 19.51 4.95147 19.4904 5.04287 19.4523C5.13427 19.4142 5.21723 19.3584 5.28696 19.2881ZM18.7881 4.72187C18.7184 4.65157 18.6354 4.59577 18.544 4.55769C18.4526 4.51961 18.3546 4.5 18.2556 4.5C18.1566 4.5 18.0585 4.51961 17.9671 4.55769C17.8757 4.59577 17.7928 4.65157 17.723 4.72187L13.7552 8.69721V5.25441C13.7552 5.05548 13.6762 4.8647 13.5355 4.72404C13.3948 4.58337 13.2041 4.50435 13.0051 4.50435C12.8062 4.50435 12.6154 4.58337 12.4748 4.72404C12.3341 4.8647 12.2551 5.05548 12.2551 5.25441V10.5049C12.2551 10.7038 12.3341 10.8946 12.4748 11.0352C12.6154 11.1759 12.8062 11.2549 13.0051 11.2549H18.2556C18.4545 11.2549 18.6453 11.1759 18.786 11.0352C18.9266 10.8946 19.0057 10.7038 19.0057 10.5049C19.0057 10.3059 18.9266 10.1152 18.786 9.97449C18.6453 9.83383 18.4545 9.7548 18.2556 9.7548H14.8128L18.7881 5.78696C18.8584 5.71723 18.9142 5.63427 18.9523 5.54287C18.9904 5.45147 19.01 5.35343 19.01 5.25441C19.01 5.1554 18.9904 5.05736 18.9523 4.96596C18.9142 4.87455 18.8584 4.7916 18.7881 4.72187Z" fill="black"/>
        </svg>
        `,
        maximizeIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M10.544 12.5577C10.6354 12.5958 10.7184 12.6516 10.7881 12.7219C10.8584 12.7916 10.9142 12.8746 10.9523 12.966C10.9904 13.0574 11.01 13.1554 11.01 13.2544C11.01 13.3534 10.9904 13.4515 10.9523 13.5429C10.9142 13.6343 10.8584 13.7172 10.7881 13.787L6.81279 17.7548H10.2556C10.4545 17.7548 10.6453 17.8338 10.786 17.9745C10.9266 18.1152 11.0057 18.3059 11.0057 18.5049C11.0057 18.7038 10.9266 18.8946 10.786 19.0352C10.6453 19.1759 10.4545 19.2549 10.2556 19.2549H5.00513C4.8062 19.2549 4.61542 19.1759 4.47476 19.0352C4.33409 18.8946 4.25507 18.7038 4.25507 18.5049V13.2544C4.25507 13.0555 4.33409 12.8647 4.47476 12.724C4.61542 12.5834 4.8062 12.5043 5.00513 12.5043C5.20406 12.5043 5.39484 12.5834 5.53551 12.724C5.67617 12.8647 5.7552 13.0555 5.7552 13.2544V16.6972L9.72304 12.7219C9.79277 12.6516 9.87573 12.5958 9.96713 12.5577C10.0585 12.5196 10.1566 12.5 10.2556 12.5C10.3546 12.5 10.4526 12.5196 10.544 12.5577Z" fill="black"/>
            <path d="M17.2548 7.31279L13.287 11.2881C13.2172 11.3584 13.1343 11.4142 13.0429 11.4523C12.9515 11.4904 12.8534 11.51 12.7544 11.51C12.6554 11.51 12.5574 11.4904 12.466 11.4523C12.3746 11.4142 12.2916 11.3584 12.2219 11.2881C12.1516 11.2184 12.0958 11.1354 12.0577 11.044C12.0196 10.9526 12 10.8546 12 10.7556C12 10.6566 12.0196 10.5585 12.0577 10.4671C12.0958 10.3757 12.1516 10.2928 12.2219 10.223L16.1972 6.2552H12.7544C12.5555 6.2552 12.3647 6.17617 12.224 6.03551C12.0834 5.89484 12.0043 5.70406 12.0043 5.50513C12.0043 5.3062 12.0834 5.11542 12.224 4.97476C12.3647 4.83409 12.5555 4.75507 12.7544 4.75507H18.0049C18.2038 4.75507 18.3946 4.83409 18.5352 4.97476C18.6759 5.11542 18.7549 5.3062 18.7549 5.50513V10.7556C18.7549 10.9545 18.6759 11.1453 18.5352 11.286C18.3946 11.4266 18.2038 11.5057 18.0049 11.5057C17.8059 11.5057 17.6152 11.4266 17.4745 11.286C17.3338 11.1453 17.2548 10.9545 17.2548 10.7556V7.31279Z" fill="black"/>
        </svg>
        `,
        closeIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 13.4L7.09999 18.3C6.91665 18.4833 6.68332 18.575 6.39999 18.575C6.11665 18.575 5.88332 18.4833 5.69999 18.3C5.51665 18.1167 5.42499 17.8833 5.42499 17.6C5.42499 17.3167 5.51665 17.0833 5.69999 16.9L10.6 12L5.69999 7.09999C5.51665 6.91665 5.42499 6.68332 5.42499 6.39999C5.42499 6.11665 5.51665 5.88332 5.69999 5.69999C5.88332 5.51665 6.11665 5.42499 6.39999 5.42499C6.68332 5.42499 6.91665 5.51665 7.09999 5.69999L12 10.6L16.9 5.69999C17.0833 5.51665 17.3167 5.42499 17.6 5.42499C17.8833 5.42499 18.1167 5.51665 18.3 5.69999C18.4833 5.88332 18.575 6.11665 18.575 6.39999C18.575 6.68332 18.4833 6.91665 18.3 7.09999L13.4 12L18.3 16.9C18.4833 17.0833 18.575 17.3167 18.575 17.6C18.575 17.8833 18.4833 18.1167 18.3 18.3C18.1167 18.4833 17.8833 18.575 17.6 18.575C17.3167 18.575 17.0833 18.4833 16.9 18.3L12 13.4Z" fill="#121212"/>
        </svg>          
        `,
        tapIcon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="21" viewBox="0 0 20 21" fill="none">
            <g clip-path="url(#clip0_35_73)">
                <path d="M6.32328 17.4546C7.40813 19.333 9.42965 20.5 11.5989 20.5C14.9581 20.5 17.691 17.7671 17.691 14.4078V9.63793C17.691 8.7823 16.9949 8.08621 16.1393 8.08621C15.8113 8.08582 15.4917 8.18993 15.227 8.38343C15.0527 7.71718 14.4456 7.22414 13.7255 7.22414C13.3788 7.22377 13.0421 7.34009 12.7695 7.55437C12.552 6.95992 11.9806 6.53449 11.3117 6.53449C11.0047 6.53412 10.7045 6.62537 10.4496 6.79656V3.77586C10.4496 2.92023 9.75352 2.22414 8.89785 2.22414C8.04223 2.22414 7.34614 2.92023 7.34614 3.77586V12.0025C7.34601 12.0545 7.3311 12.1054 7.30314 12.1492C7.27519 12.1931 7.23534 12.228 7.18824 12.2501C7.12642 12.2792 7.05589 12.2839 6.99073 12.2633C6.92557 12.2428 6.87056 12.1984 6.83668 12.139L5.80199 10.3469C5.18406 9.2766 3.81067 8.90859 2.74028 9.52652C2.64204 9.58289 2.55595 9.65819 2.487 9.74805C2.41806 9.83791 2.36761 9.94055 2.3386 10.05C2.309 10.1594 2.30138 10.2735 2.31618 10.3858C2.33098 10.4981 2.3679 10.6063 2.42481 10.7043L6.32328 17.4546ZM3.00488 10.2285C3.01071 10.2066 3.02081 10.1861 3.0346 10.1681C3.04839 10.1502 3.0656 10.1351 3.08524 10.1238C3.32434 9.98578 3.58965 9.91527 3.85852 9.91527C3.99328 9.91527 4.12899 9.933 4.26262 9.96882C4.66297 10.0761 4.99758 10.3328 5.20481 10.6918L6.23949 12.4839C6.49074 12.919 7.02371 13.0873 7.47922 12.8755C7.81738 12.7182 8.0359 12.3755 8.0359 12.0026V3.77586C8.0359 3.3005 8.42262 2.91378 8.89797 2.91378C9.37332 2.91378 9.76004 3.3005 9.76004 3.77586V10.1552C9.76004 10.2466 9.79637 10.3343 9.86104 10.399C9.92571 10.4637 10.0134 10.5 10.1049 10.5C10.1963 10.5 10.2841 10.4637 10.3487 10.399C10.4134 10.3343 10.4497 10.2466 10.4497 10.1552V8.08621C10.4497 7.61086 10.8364 7.22414 11.3118 7.22414C11.7872 7.22414 12.1739 7.61086 12.1739 8.08621V10.1552C12.1739 10.2466 12.2102 10.3343 12.2749 10.399C12.3395 10.4637 12.4273 10.5 12.5187 10.5C12.6102 10.5 12.6979 10.4637 12.7626 10.399C12.8272 10.3343 12.8636 10.2466 12.8636 10.1552V8.77586C12.8636 8.3005 13.2503 7.91378 13.7256 7.91378C14.201 7.91378 14.5877 8.3005 14.5877 8.77586V10.3276C14.5877 10.419 14.624 10.5067 14.6887 10.5714C14.7534 10.6361 14.8411 10.6724 14.9325 10.6724C15.024 10.6724 15.1117 10.6361 15.1764 10.5714C15.2411 10.5067 15.2774 10.419 15.2774 10.3276V9.63793C15.2774 9.16257 15.6641 8.77586 16.1395 8.77586C16.6148 8.77586 17.0015 9.16257 17.0015 9.63793V14.4078C17.0015 17.3868 14.578 19.8103 11.599 19.8103C9.67531 19.8103 7.8827 18.7755 6.92063 17.1096L3.02211 10.3593C3.01074 10.3397 3.00337 10.3181 3.00041 10.2956C2.99746 10.2732 2.99898 10.2504 3.00488 10.2285Z" fill="white"/>
                <path d="M6.54516 5.55777C6.58418 5.5348 6.6183 5.50437 6.64556 5.46822C6.67282 5.43206 6.69269 5.39089 6.70404 5.34705C6.71539 5.30322 6.718 5.25757 6.71171 5.21273C6.70542 5.16789 6.69035 5.12472 6.66738 5.0857C6.43473 4.69043 6.31172 4.2375 6.31172 3.77586C6.31172 2.3498 7.47187 1.18965 8.89793 1.18965C10.324 1.18965 11.4841 2.3498 11.4841 3.77586C11.4841 4.23922 11.3602 4.69371 11.1259 5.09012C11.0798 5.16882 11.0668 5.26255 11.0897 5.35081C11.1126 5.43906 11.1695 5.51466 11.248 5.56106C11.3265 5.60747 11.4202 5.6209 11.5085 5.59843C11.5969 5.57595 11.6728 5.5194 11.7195 5.44113C12.0168 4.93852 12.1738 4.36266 12.1738 3.77586C12.1738 1.96953 10.7043 0.5 8.89793 0.5C7.0916 0.5 5.62207 1.96953 5.62207 3.77586C5.62207 4.36043 5.77801 4.93434 6.07305 5.43555C6.16973 5.59969 6.38113 5.65438 6.54516 5.55777Z" fill="white"/>
            </g>
            <defs>
                <clipPath id="clip0_35_73">
                <rect width="20" height="20" fill="white" transform="translate(0 0.5)"/>
                </clipPath>
            </defs>
         </svg>
        `,
        leftArrow: `
        <svg style="padding: 4px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" viewBox="0 0 330 330" xml:space="preserve">
            <path id="XMLID_92_" d="M111.213,165.004L250.607,25.607c5.858-5.858,5.858-15.355,0-21.213c-5.858-5.858-15.355-5.858-21.213,0.001  l-150,150.004C76.58,157.211,75,161.026,75,165.004c0,3.979,1.581,7.794,4.394,10.607l150,149.996  C232.322,328.536,236.161,330,240,330s7.678-1.464,10.607-4.394c5.858-5.858,5.858-15.355,0-21.213L111.213,165.004z"/>
        </svg>
        `,
        rightArrow: `
        <svg style="padding: 4px;" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" fill="#000000" height="24px" width="24px" version="1.1" id="Layer_1" viewBox="0 0 330 330" xml:space="preserve">
            <path id="XMLID_222_" d="M250.606,154.389l-150-149.996c-5.857-5.858-15.355-5.858-21.213,0.001  c-5.857,5.858-5.857,15.355,0.001,21.213l139.393,139.39L79.393,304.394c-5.857,5.858-5.857,15.355,0.001,21.213  C82.322,328.536,86.161,330,90,330s7.678-1.464,10.607-4.394l149.999-150.004c2.814-2.813,4.394-6.628,4.394-10.606  C255,161.018,253.42,157.202,250.606,154.389z"/>
        </svg>
        `
    }

    function getBadgeHTML(type, text, variation) {
        const variations = {
            "success": {
                "class": "ab--test-pilot-success",
            },
            "warning": {
                "class": "ab--test-pilot-warning",
            },
            "danger": {
                "class": "ab--test-pilot-danger",
            },
            default: {
                "class": "ab--test-pilot-default",
            }
        }

        const types = {
            boxy: {
                "class": "ab--test-pilot-badge-boxy",
            },
            circle: {
                "class": "ab--test-pilot-badge-circle",
            },
            plain: {
                "class": "ab--test-pilot-badge-plain",
            },
            minimal: {
                "class": "ab--test-pilot-badge-minimal",
            },
            default: {
                "class": "ab--test-pilot-badge-default",
            }
        }

        return `
        <div class="ab--test-pilot-badge ${types[type] ? types[type].class : types.default.class} ${variations[variation] ? variations[variation].class : variations.default.class}">
            <div class="ab--test-pilot-badge-circle"></div>
            <span class="ab--test-pilot-badge-text">${text}</span>
        </div>`

    }

    function getPopUpOpenerElement(popUp, InitialTestInfo) {
        if (document.querySelector("#ab--pilot-test-details-ui-opener")) {
            document.querySelector("#ab--pilot-test-details-ui-opener").remove();
        }

        const opener = document.createElement("button");
        opener.id = "ab--pilot-test-details-ui-opener";
        opener.classList.add("ab--pilot-test-details-ui-opener");
        opener.innerHTML = `
        <div class="ab--pilot-test-details-ui-opener-content">
            <span>AB test Pilot</span>
            <span>0/${InitialTestInfo.length} test running</span>
        </div>
        <div class="ab--pilot-test-details-ui-opener-icon">
            ${asset.tapIcon}
        </div>
        <button class="ab--pilot-test-details-ui-opener-close">
            ${asset.closeIcon}
        </button>
        `;
        opener.onclick = function (e) {
            if (e.target.closest(".ab--pilot-test-details-ui-opener-close")) {
                opener.classList.add("ab--test-pilot-hide");
                setTimeout(() => {
                    opener.remove();
                }, 300);
                return;
            }
            popUp.classList.add("ab--test-pilot-open");
            opener.classList.add("ab--test-pilot-hide");
        }

        return opener;
    }

    function getPopUpElement(initialTestInfo) {
        if (document.querySelector("#ab--pilot-test-details-ui")) {
            document.querySelector("#ab--pilot-test-details-ui").remove();
        }

        const popUp = document.createElement("div");
        popUp.id = "ab--pilot-test-details-ui";
        popUp.classList.add("ab--pilot-test-details-ui", "ab--details-visible", "ab--test-pilot-open");
        popUp.innerHTML = `
            <div class="ab--pilot-test-details-ui-main">
                <div class="ab--pilot-test-details-ui-main-header">
                    <h2>AB Test Pilot</h2>
                    <div class="ab--pilot-test-details-ui-main-header-search">
                        <button>
                            ${asset.searchIcon}
                        </button>
                        <input type="text" placeholder="Search by name or status">
                    </div>
                    <ul class="ab--pilot-test-details-ui-main-header-icons">
                        <li class="ab--pilot-test-details-ui-main-header-icon ab--pilot-test-details-ui-main-header-minimise">
                            <button>
                                ${asset.minusIcon}
                            </button>
                        </li>
                        <li class="ab--pilot-test-details-ui-main-header-icon  ab--pilot-test-details-ui-main-header-short-screen">
                            <button>
                                ${asset.minimiseIcon}
                            </button>
                        </li>
                        <li class="ab--pilot-test-details-ui-main-header-icon ab--pilot-test-details-ui-main-header-full-screen">
                            <button>
                                ${asset.maximizeIcon}
                            </button>
                        </li>
                        <li class="ab--pilot-test-details-ui-main-header-icon ab--pilot-test-details-ui-main-header-close">
                            <button>
                                ${asset.closeIcon}
                            </button>
                        </li>
                    </ul>
                </div>
                <div class="ab--pilot-test-details-ui-main-body" data-type="ab--grid-table">
                    <div class="ab--pilot-test-details-ui-main-body-table-head" data-type="ab--grid-table-head">
                        <div class="ab--pilot-test-details-ui-main-body-table-head-title">
                            <button class="ab--pilot-test-details-ui-main-body-table-head-title-button">    
                                <h3>Name</h3>
                                ${asset.sortIcon}
                            </button>
                        </div>
                        <div class="ab--pilot-test-details-ui-main-body-table-head-type">
                            <button class="ab--pilot-test-details-ui-main-body-table-head-title-button">    
                                <h3>Type</h3>
                                ${asset.sortIcon}
                            </button>
                        </div>
                        <div class="ab--pilot-test-details-ui-main-body-table-head-status">
                            <button class="ab--pilot-test-details-ui-main-body-table-head-title-button">    
                                <h3>Status</h3>
                                ${asset.sortIcon}
                            </button>
                        </div>
                        <div class="ab--pilot-test-details-ui-main-body-table-head-variation">
                            <button class="ab--pilot-test-details-ui-main-body-table-head-title-button">    
                                <h3>variation</h3>
                                ${asset.sortIcon}
                            </button>
                        </div>
                    </div>    
                    <div class="ab--pilot-test-details-ui-main-body-table-container">
                        ${initialTestInfo.map((test) => `                   
                        <button class="ab--pilot-test-details-ui-main-body-table-row" data-type="ab--grid-table-row" data-id="${test.id}">
                            <div class="ab--pilot-test-details-ui-main-body-table-row-title">
                                <span>${test.testName}</span>
                            </div>
                            <div class="ab--pilot-test-details-ui-main-body-table-row-type">
                                <span>${test.testType}</span>
                            </div>
                            <div class="ab--pilot-test-details-ui-main-body-table-row-status">
                                <span>${getBadgeHTML("boxy", "Pending", "warning")}</span>
                            </div>
                            <div class="ab--pilot-test-details-ui-main-body-table-row-variation">
                                <span>${test.variationName}</span>
                            </div>
                        </button>`).join("")}                
                    </div>
                </div>
            </div>
            <div class="ab--pilot-test-details-ui-divider">
                <button class="ab--pilot-test-details-ui-divider-close-button">
                    ${asset.rightArrow}
                </button>
            </div>
            <div class="ab--pilot-test-details-ui-details">
                <div class="ab--pilot-test-details-ui-details-navigation-wrapper">
                    <button class="ab--pilot-test-details-ui-details-navigation-button ab--pilot-test-navigation-left">${asset.leftArrow}</button>
                    <ul class="ab--pilot-test-details-ui-details-navigation">
                        <li class="ab--pilot-test-details-ui-details-navigation-item">
                            <button class="ab--test-pilot-nav-button ab--test-pilot-nav-button-active">Parent</button>
                        </li>
                        <li class="ab--pilot-test-details-ui-details-navigation-item">
                            <button class="ab--test-pilot-nav-button">Header</button>
                        </li>
                        <li class="ab--pilot-test-details-ui-details-navigation-item">
                            <button class="ab--test-pilot-nav-button">Footer</button>
                        </li>
                        <li class="ab--pilot-test-details-ui-details-navigation-item">
                            <button class="ab--test-pilot-nav-button">Extra Item</button>
                        </li>
                    </ul>
                    <button class="ab--pilot-test-details-ui-details-navigation-button ab--pilot-test-navigation-right">${asset.rightArrow}</button>
                </div>
                <h2 class="ab--pilot-test-details-ui-details-title">Targeting</h2>
                <span class="ab--test-pilot-waiting-message ab--test-pilot-waiting-message-active">Tareting is being checked...</span>
                <div class="ab--test-pilot-accordion ab--test-pilot-accordion-active">
                    <button class="ab--test-pilot-accordion-header">
                        <span>Custom Java Script Condition</span>
                        ${getBadgeHTML("minimal", "Success", "success")}
                        ${asset.plusIcon}
                        ${asset.minusIcon}
                    </button>
                    <div class="ab--test-pilot-contents-wrapper">
                        <div class="ab--test-pilot-contents-status">
                            <span>Status</span>
                            ${getBadgeHTML("plain", "Success", "success")}
                        </div>
                        <ul class="ab--test-pilot-contents-details">
                            <li>immediate activation from return value</li>
                            <li>Call back function is geting true response</li>
                        </ul>
                    </div>                
                    <button class="ab--test-pilot-accordion-header">
                        <span>CSS Checker</span>
                        ${getBadgeHTML("minimal", "Success", "success")}
                        ${asset.plusIcon}
                        ${asset.minusIcon}
                    </button>
                    <div class="ab--test-pilot-contents-wrapper">
                        <div class="ab--test-pilot-contents-status">
                            <span>Status</span>
                            ${getBadgeHTML("plain", "Success", "success")}
                        </div>
                        <ul class="ab--test-pilot-contents-details">
                            <li>immediate activation from return value</li>
                            <li>Call back function is geting true response</li>
                        </ul>
                    </div>               
                    <button class="ab--test-pilot-accordion-header">
                        <span>URL Checker</span>
                        ${getBadgeHTML("minimal", "Faild", "danger")}
                        ${asset.plusIcon}
                        ${asset.minusIcon}
                    </button>
                    <div class="ab--test-pilot-contents-wrapper">
                        <div class="ab--test-pilot-contents-status">
                            <span>Status</span>
                            ${getBadgeHTML("plain", "Faild", "danger")}
                        </div>
                        <ul class="ab--test-pilot-contents-details">
                            <li>immediate activation from return value</li>
                            <li>Call back function is geting true response</li>
                        </ul>
                    </div> 
                </div>   
                <h2 class="ab--pilot-test-details-ui-details-message">Message</h2>  
                <span class="ab--pilot-test-details-ui-details-message-content">Targeting Met and Variation Applied</span>          
            </div>
        `;

        //Minimise Button listener
        popUp.querySelector(".ab--pilot-test-details-ui-main-header-minimise").addEventListener("click", function () {
            waitForElem(".ab--pilot-test-details-ui-opener", function ([opener]) {
                popUp.classList.remove("ab--test-pilot-open");
                opener.classList.remove("ab--test-pilot-hide");
            });
        });

        //Full Screen Button listener
        popUp.querySelector(".ab--pilot-test-details-ui-main-header-full-screen").addEventListener("click", function () {
            popUp.classList.add("ab--test-pilot-full-screen");
        });

        //Short Screen Button listener
        popUp.querySelector(".ab--pilot-test-details-ui-main-header-short-screen").addEventListener("click", function () {
            popUp.classList.remove("ab--test-pilot-full-screen");
        });

        //Close Button listener
        popUp.querySelector(".ab--pilot-test-details-ui-main-header-close").addEventListener("click", function () {
            waitForElem(".ab--pilot-test-details-ui-opener", function ([opener]) {
                popUp.classList.remove("ab--test-pilot-open");
                setTimeout(() => {
                    popUp.remove();
                    opener.remove();
                }, 300);
            })
        });

        //Accordion Listener
        popUp.querySelectorAll(".ab--test-pilot-accordion .ab--test-pilot-accordion-header").forEach(function (heading) {
            heading.addEventListener("click", function () {
                let content = this.nextElementSibling;
                if (content) {
                    if (content.style.display === "block") {
                        content.style.display = "none";
                        this.classList.remove("ab--test-pilot-accordion-active");
                    } else {
                        content.style.display = "block";
                        this.classList.add("ab--test-pilot-accordion-active");
                    }
                }
            });
        });


        const prevButton = popUp.querySelector(".ab--pilot-test-navigation-left");
        const nextButton = popUp.querySelector(".ab--pilot-test-navigation-right");

        function updateNavigationButtons() {
            const MAX_DISPLAYED_ITEMS = 3;
            const currentActive = popUp.querySelector(".ab--test-pilot-nav-button-active");
            const buttons = Array.from(popUp.querySelectorAll(".ab--test-pilot-nav-button"));
            const activeIndex = buttons.indexOf(currentActive);
            const total = buttons.length;
            const visibleItem = buttons.length < MAX_DISPLAYED_ITEMS ? buttons.length : MAX_DISPLAYED_ITEMS;
            const isNextAvailable = activeIndex < total - 1;
            const isPrevAvailable = activeIndex > 0;
            const isNextHidden = total - activeIndex < visibleItem;
            const isPrevHidden = activeIndex < visibleItem;

            if (!isPrevAvailable) {
                prevButton.classList.add("ab--test-pilot-navigation-hidden");
            } else {
                prevButton.classList.remove("ab--test-pilot-navigation-hidden");
            }

            if (!isNextAvailable) {
                nextButton.classList.add("ab--test-pilot-navigation-hidden");
            } else {
                nextButton.classList.remove("ab--test-pilot-navigation-hidden");
            }

            if (isNextHidden) {
                popUp.querySelector(".ab--pilot-test-details-ui-details-navigation").scrollLeft = popUp.querySelector(".ab--pilot-test-details-ui-details-navigation").scrollWidth;
            }

            if (isPrevHidden) {
                popUp.querySelector(".ab--pilot-test-details-ui-details-navigation").scrollLeft = 0;
            }
        }

        updateNavigationButtons();

        popUp.querySelectorAll(".ab--pilot-test-details-ui-details-navigation-button").forEach(function (button) {
            button.addEventListener("click", function () {
                const currentActive = popUp.querySelector(".ab--test-pilot-nav-button-active");
                const buttons = Array.from(popUp.querySelectorAll(".ab--test-pilot-nav-button"));
                const activeIndex = buttons.indexOf(currentActive);

                if (button.classList.contains("ab--pilot-test-navigation-left")) {
                    if (activeIndex > 0) {
                        currentActive.classList.remove("ab--test-pilot-nav-button-active");
                        buttons[activeIndex - 1].classList.add("ab--test-pilot-nav-button-active");
                    }
                } else {
                    if (activeIndex < buttons.length - 1) {
                        currentActive.classList.remove("ab--test-pilot-nav-button-active");
                        buttons[activeIndex + 1].classList.add("ab--test-pilot-nav-button-active");
                    }
                }

                updateNavigationButtons();
            });
        });

        popUp.querySelectorAll(".ab--test-pilot-nav-button").forEach(function (button) {
            button.addEventListener("click", function () {
                popUp.querySelectorAll(".ab--test-pilot-nav-button").forEach(function (button) {
                    button.classList.remove("ab--test-pilot-nav-button-active");
                });
                button.classList.add("ab--test-pilot-nav-button-active");
                updateNavigationButtons();
            });
        });

        popUp.querySelector(".ab--pilot-test-details-ui-divider-close-button").addEventListener("click", function () {
            popUp.classList.remove("ab--details-visible");
        });

        popUp.querySelectorAll(".ab--pilot-test-details-ui-main-body-table-row").forEach(function (row) {
            row.addEventListener("click", function () {
                popUp.classList.add("ab--details-visible");
            });
        });

        return popUp;
    }

    function updateTableUI(key, value) {
        const row = document.querySelector(`[data-id="${key}"]`);
        if (!row) return;
        const statusHTML = row.querySelector(".ab--pilot-test-details-ui-main-body-table-row-status");
        statusHTML.innerHTML = getBadgeHTML("boxy", value.status, value.status === "Active" ? "success" : "danger");
        row.setAttribute("data-status", value.status);
    }

    function mainJs(body, initialTestInfo) {
        if (initialTestInfo.length === 0) return;

        const popUp = getPopUpElement(initialTestInfo)
        body.insertAdjacentElement("beforeend", popUp);


        const opeenr = getPopUpOpenerElement(popUp, initialTestInfo);
        body.insertAdjacentElement("beforeend", opeenr);

        const observedTestsDetailsData = new Proxy(testsDetailsData, {
            set(target, key, value) {
                if (!target.hasOwnProperty(key)) {
                    updateTableUI(key, value);
                }
                target[key] = value;
                return true;
            }
        });

        const timer = setInterval(() => {
            waitForElem('abTestPilot', (abTestPilot) => {
                Object.entries(initialTestInfo).forEach(([key, value]) => {
                    if (abTestPilot[value.id]) {
                        observedTestsDetailsData[value.id] = abTestPilot[value.id];
                    }
                })
            }, 1, true, 60000, 100);
            if (Object.keys(testsDetailsData).length === Object.keys(initialTestInfo).length) {
                clearInterval(timer);
            }
        }, 1000);

        console.log('%cAB Test Pilot UI: v-01', 'background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px');
        console.log('AB Test Pilot UI: v-01');
    }

    waitForElem('abTestPilotAllTest', (initialTestInfo) => {
        waitForElem('body', ([body]) => {
            mainJs(body, initialTestInfo);
        });
    }, 1, true, 10000, 100);
})()



