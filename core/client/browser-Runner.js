(()=>{
        const abTestPilotMainInformation = {
  "parentTargeting": [
    {
      "parentTargetingId": "1742245463459_2227_multi_touch",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
          "multiple_rules_check_by_condition": "OR",
          "rules": [],
          "_comments": {
            "EXAMPLE": [
              {
                "selector": "body",
                "is_matched": true,
                "waiting_time": 1000,
                "total_element_count": 1
              },
              {
                "selector": ".grid-plp",
                "is_matched": false,
                "waiting_time": 2000,
                "total_element_count": 1
              }
            ],
            "multiple_rules_check_by_condition": "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
            "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
            "selector": "Define the CSS selector for the element you want to check.",
            "is_matched": "Set to 'true' if the element should be present, 'false' if it should not be.",
            "waiting_time": "Time in milliseconds to wait for the element to appear.",
            "total_element_count": "Number of elements that should match the selector."
          }
        },
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
              "match_type": "REGEX_MATCHED"
            }
          ],
          "_comment": {
            "description": "Use 'targeting_rules' to define conditions for matching URLs.",
            "rules": [
              "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
              "Use 'EXACTLY_MATCHED' to match the exact URL.",
              "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
              "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
              "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
              "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
              "If multiple conditions are added, all will be checked against the target URLs.",
              "By default, your test will only run under the website's hostname unless specified otherwise."
            ],
            "example": {
              "multiple_rules_check_by_condition": "OR",
              "targeting_rules": [
                {
                  "value": "https:\u002F\u002Fwww.example.com",
                  "match_type": "EXACTLY_MATCHED"
                },
                {
                  "value": "example.com",
                  "match_type": "URL_CONTAINS"
                },
                {
                  "value": "blockedsite.com",
                  "match_type": "URL_DOES_NOT_CONTAIN"
                },
                {
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "variationIdList": [
        "1742245463878_5843_control"
      ]
    }
  ],
  "testInfo": [
    {
      "hostnames": [
        "www.bulgari.com"
      ],
      "id": "1742201474854_7002_v01",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
          "multiple_rules_check_by_condition": "OR",
          "rules": [],
          "_comments": {
            "EXAMPLE": [
              {
                "selector": "body",
                "is_matched": true,
                "waiting_time": 1000,
                "total_element_count": 1
              },
              {
                "selector": ".grid-plp",
                "is_matched": false,
                "waiting_time": 2000,
                "total_element_count": 1
              }
            ],
            "multiple_rules_check_by_condition": "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
            "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
            "selector": "Define the CSS selector for the element you want to check.",
            "is_matched": "Set to 'true' if the element should be present, 'false' if it should not be.",
            "waiting_time": "Time in milliseconds to wait for the element to appear.",
            "total_element_count": "Number of elements that should match the selector."
          }
        },
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
              "match_type": "REGEX_MATCHED"
            }
          ],
          "_comment": {
            "description": "Use 'targeting_rules' to define conditions for matching URLs.",
            "rules": [
              "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
              "Use 'EXACTLY_MATCHED' to match the exact URL.",
              "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
              "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
              "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
              "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
              "If multiple conditions are added, all will be checked against the target URLs.",
              "By default, your test will only run under the website's hostname unless specified otherwise."
            ],
            "example": {
              "multiple_rules_check_by_condition": "OR",
              "targeting_rules": [
                {
                  "value": "https:\u002F\u002Fwww.example.com",
                  "match_type": "EXACTLY_MATCHED"
                },
                {
                  "value": "example.com",
                  "match_type": "URL_CONTAINS"
                },
                {
                  "value": "blockedsite.com",
                  "match_type": "URL_DOES_NOT_CONTAIN"
                },
                {
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "A\u002FB",
      "variationFiles": {
        "css": ".ab--search-Panel {\n  position: fixed;\n  top: 0;\n  left: 0;\n  background: #F3F2F3 !important;\n  width: 100vw;\n  height: 100vh;\n  height: 100dvh;\n  z-index: 99999;\n  overflow-x: hidden;\n  overflow-y: scroll;\n  transform: translateX(200%);\n}\n.ab--search-Panel__inner {\n  width: 100%;\n  height: auto;\n}\n.ab--search-Panel__search {\n  margin-top: var(--chakra-space-20);\n  width: 100%;\n  padding-left: var(--chakra-space-10);\n  padding-right: var(--chakra-space-10);\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search {\n    padding-left: var(--chakra-space-4);\n    padding-right: var(--chakra-space-4);\n    margin-top: var(--chakra-space-8);\n  }\n}\n.ab--search-Panel__search-title {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 48px;\n  line-height: 58px;\n  letter-spacing: 0;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-title {\n    font-size: 20px;\n    line-height: 28px;\n  }\n}\n.ab--search-Panel__search-wrapper {\n  width: 100%;\n  margin-top: 40px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-wrapper {\n    margin-top: 20px;\n  }\n}\n.ab--search-Panel__search-input-wrapper {\n  width: 100%;\n  position: relative;\n}\n.ab--search-Panel__search-input-wrapper input {\n  width: 100%;\n  height: 56px;\n  box-sizing: border-box;\n  border-bottom: 1px solid #6E6E6E;\n  background: transparent;\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 36px;\n  line-height: 44px;\n  letter-spacing: 0;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-input-wrapper input {\n    font-size: 20px;\n    line-height: 44px;\n    height: 44px;\n  }\n}\n.ab--search-Panel__search-input-wrapper input::placeholder {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 36px;\n  line-height: 44px;\n  letter-spacing: 0;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-input-wrapper input::placeholder {\n    font-size: 20px;\n    line-height: 44px;\n  }\n}\n.ab--search-Panel__search-input-wrapper input:focus {\n  outline: none;\n}\n.ab--search-Panel__search-close {\n  position: absolute;\n  right: 0;\n  top: 16px;\n}\n.ab--search-Panel__search-close.hide {\n  display: none;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-close {\n    top: 16px;\n  }\n  .ab--search-Panel__search-close svg {\n    width: 16px;\n    height: 16px;\n  }\n}\n.ab--search-Panel__search-suggestion {\n  display: flex;\n  gap: 24px;\n  margin-top: 16px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-suggestion {\n    flex-direction: column;\n    gap: 0;\n    margin-top: 4px;\n  }\n  .ab--search-Panel__search-suggestion-item {\n    padding-bottom: 12px;\n    padding-top: 12px;\n    border-bottom: 0.5px solid #DEDAD7;\n  }\n}\n.ab--search-Panel__search-suggestion button {\n  border-bottom: unset;\n}\n.ab--search-Panel__search-suggestion button p {\n  height: 20px;\n}\n.ab--search-Panel__search-suggestion-text.first-line {\n  font-family: var(--chakra-fonts-heading);\n  font-size: var(--chakra-fontSizes-md);\n  line-height: var(--chakra-lineHeights-5);\n  color: var(--chakra-colors-black);\n  font-weight: var(--chakra-fontWeights-normal);\n  text-align: start;\n  text-wrap-style: initial;\n}\n.ab--search-Panel__search-suggestion-text.second-line {\n  font-size: var(--chakra-fontSizes-sm);\n  line-height: var(--chakra-lineHeights-4);\n  color: var(--chakra-colors-black);\n  font-weight: var(--chakra-fontWeights-light);\n  text-align: start;\n  text-wrap-style: initial;\n}\n.ab--search-Panel__search-by-category {\n  margin-top: 60px;\n  padding-left: var(--chakra-space-10);\n  padding-right: var(--chakra-space-10);\n}\n.ab--search-Panel__search-by-category-title {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 36px;\n  line-height: 44px;\n  letter-spacing: 0;\n  text-align: center;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-by-category-title {\n    font-size: 24px;\n    line-height: 32px;\n  }\n}\n.ab--search-Panel__search-by-category-list {\n  margin-top: 24px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 16px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-by-category-list {\n    flex-wrap: wrap;\n  }\n}\n.ab--search-Panel__search-by-category-item {\n  list-style: none;\n  width: 101px;\n  height: 114px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-by-category-item {\n    flex: 0.33;\n  }\n}\n.ab--search-Panel__search-by-category-item a {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.ab--search-Panel__search-by-category-icon {\n  width: 80px;\n  height: 80px;\n  border-radius: 85px;\n  background: #FFFFFF;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.ab--search-Panel__search-by-category-text {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 400;\n  font-size: 14px;\n  line-height: 18px;\n  letter-spacing: 0;\n  text-align: center;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__search-by-category-text {\n    font-size: 12px;\n  }\n}\n.ab--search-Panel__suggest-for-you {\n  display: flex;\n  margin-top: 60px;\n  flex-direction: column;\n  align-items: flex-start;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__suggest-for-you {\n    margin-top: 56px;\n  }\n}\n.ab--search-Panel__suggest-for-you .ab-grid__title {\n  padding-left: var(--chakra-space-10);\n  padding-right: var(--chakra-space-10);\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 36px;\n  line-height: 44px;\n  letter-spacing: 0;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__suggest-for-you .ab-grid__title {\n    font-size: 20px;\n    line-height: 28px;\n    padding-left: var(--chakra-space-4);\n    padding-right: var(--chakra-space-4);\n  }\n}\n.ab--search-Panel__suggest-for-you .ab-grid__content {\n  display: grid;\n  grid-template-columns: repeat(2, minmax(0, 1fr));\n  margin-top: 40px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__suggest-for-you .ab-grid__content {\n    margin-top: 20px;\n  }\n  .ab--search-Panel__suggest-for-you .ab-grid__content \u003E *:nth-child(n+5) {\n    display: none;\n  }\n}\n@media screen and (min-width: 30em) {\n  .ab--search-Panel__suggest-for-you .ab-grid__content {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media screen and (min-width: 48em) {\n  .ab--search-Panel__suggest-for-you .ab-grid__content {\n    grid-template-columns: repeat(2, minmax(0, 1fr));\n  }\n}\n@media screen and (min-width: 62em) {\n  .ab--search-Panel__suggest-for-you .ab-grid__content {\n    grid-template-columns: repeat(4, minmax(0, 1fr));\n  }\n}\n.ab--search-Panel__suggest-for-you .ab-grid__content .ab-grid__item {\n  background-image: linear-gradient(to bottom right, var(--chakra-colors-gray-100), var(--chakra-colors-gray-50));\n}\n.ab--search-Panel__suggest-for-you .ab-grid__content .ab-grid__item .ab-grid__item-details {\n  display: flex;\n  flex-direction: column;\n  gap: 4px;\n  padding: 30px 20px 20px;\n}\n.ab--search-Panel__suggest-for-you .ab-grid__content .ab-grid__item .ab-grid__item-title {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 20px;\n  letter-spacing: 0;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__suggest-for-you .ab-grid__content .ab-grid__item .ab-grid__item-title {\n    font-size: 14px;\n    line-height: 18px;\n  }\n}\n.ab--search-Panel__suggest-for-you .ab-grid__content .ab-grid__item .ab-grid__item-price {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 400;\n  font-size: 14px;\n  line-height: 16px;\n  letter-spacing: 0;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__suggest-for-you .ab-grid__content .ab-grid__item .ab-grid__item-price {\n    font-size: 14px;\n    line-height: 18px;\n  }\n}\n.ab--search-Panel__suggest-for-you .ab-grid__footer {\n  width: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 40px 16px;\n  background: #F3F2F3;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__suggest-for-you .ab-grid__footer {\n    padding: 40px 16.5px;\n  }\n}\n.ab--search-Panel__suggest-for-you .ab-grid__footer .ab-grid__button {\n  width: 300px;\n  height: 48px;\n  border-radius: 3px;\n  border: 1px solid #000000;\n  padding: 15px;\n  text-transform: uppercase;\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 20px;\n  letter-spacing: 0;\n  text-align: center;\n  color: #000000;\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 20px;\n  letter-spacing: 0;\n  text-align: center;\n  transition: background-color 0.2s;\n}\n.ab--search-Panel__suggest-for-you .ab-grid__footer .ab-grid__button:hover {\n  background-color: rgba(222, 218, 215, 0.443);\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__suggest-for-you .ab-grid__footer .ab-grid__button {\n    width: 100%;\n    font-size: 14px;\n    line-height: 18px;\n  }\n}\n.ab--search-Panel__ab--carousel {\n  display: flex;\n  justify-content: space-between;\n  margin-top: 60px;\n  width: 200vw;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__ab--carousel {\n    margin-top: 56px;\n  }\n}\n.ab--search-Panel__ab--carousel.slider-number-1 {\n  transform: translateX(0);\n}\n.ab--search-Panel__ab--carousel.slider-number-2 {\n  transform: translateX(-100vw);\n}\n.ab--search-Panel__ab--carousel .ab-carousel-single {\n  position: relative;\n  width: 100vw;\n  padding-right: 17px;\n}\n.ab--search-Panel__ab--carousel .slider-header button {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  color: var(--chakra-colors-black);\n  text-align: start;\n  font-size: var(--chakra-fontSizes-4xl);\n  line-height: 1.22;\n}\n.ab--search-Panel__ab--carousel .slider-header button:not(.active) {\n  color: #6E6E6E;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__ab--carousel .slider-header button {\n    font-size: 20px;\n    line-height: 28px;\n  }\n}\n.ab--search-Panel__ab--carousel .slider-header__title-group {\n  display: flex;\n  gap: 24px;\n}\n.ab--search-Panel__ab--carousel .swiper.custom {\n  position: relative;\n  padding-bottom: 50px;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper {\n  display: flex;\n  flex-direction: row;\n  flex-wrap: wrap;\n  margin: 0 40px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper {\n    margin: 0;\n  }\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card {\n  background-image: linear-gradient(to bottom right, var(--chakra-colors-gray-100), var(--chakra-colors-gray-50));\n  position: relative;\n  flex: 0 0 25%;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card::before {\n  height: 0px;\n  content: \"\";\n  display: block;\n  padding-bottom: 136.735%;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card .slider-card-details {\n  position: absolute;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column;\n  justify-content: space-between;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card .slider-card-details .product-tile__image-wrapper .product-tile__image {\n  position: relative;\n  display: block;\n  max-width: 100%;\n  padding-bottom: 100%;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card .slider-card-details .product-tile__image-wrapper .product-tile__image img {\n  width: 100%;\n  height: 100%;\n  position: absolute;\n  object-fit: contain;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card .slider-card-details .product-tile__details {\n  padding: 1.25rem;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card .slider-card-details .product-tile__details .product-tile__title {\n  font-family: var(--chakra-fonts-heading);\n  color: var(--chakra-colors-black);\n  line-height: 1.33;\n  text-align: start;\n  font-size: 0.875rem;\n  font-weight: var(--chakra-fontWeights-normal);\n  overflow: hidden;\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n}\n.ab--search-Panel__ab--carousel .swiper.custom .swiper-slide .product-wrapper .slider-card .slider-card-details .product-tile__details .product-tile__price {\n  color: var(--chakra-colors-black);\n  line-height: 1.125rem;\n  font-size: 0.875rem;\n  font-weight: var(--chakra-fontWeights-normal);\n}\n.ab--search-Panel__ab--carousel .slider-header {\n  display: flex;\n  justify-content: space-between;\n}\n.ab--search-Panel__ab--carousel .slider-header .custom_navigation {\n  display: flex;\n  gap: 1rem;\n}\n.ab--search-Panel__ab--carousel .slider-header .custom_navigation button {\n  display: flex;\n  height: 3.75rem;\n  width: 3.75rem;\n  min-width: 3.75rem;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  -ms-appearance: none;\n  appearance: none;\n  -webkit-align-items: center;\n  -webkit-box-align: center;\n  -ms-flex-align: center;\n  align-items: center;\n  -webkit-box-pack: center;\n  -ms-flex-pack: center;\n  -webkit-justify-content: center;\n  justify-content: center;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  position: relative;\n  white-space: nowrap;\n  vertical-align: middle;\n  outline: 2px solid transparent;\n  outline-offset: 2px;\n  line-height: inherit;\n  font-weight: var(--chakra-fontWeights-semibold);\n  transition-property: var(--chakra-transition-property-common);\n  transition-duration: var(--chakra-transition-duration-normal);\n  min-width: var(--chakra-sizes-10);\n  font-size: var(--chakra-fontSizes-md);\n  -webkit-padding-start: var(--chakra-space-4);\n  padding-inline-start: var(--chakra-space-4);\n  -webkit-padding-end: var(--chakra-space-4);\n  padding-inline-end: var(--chakra-space-4);\n  background: none;\n  margin: 0px;\n  padding: 0px;\n  -webkit-backdrop-filter: var(--chakra-backdrop-blur) var(--chakra-backdrop-brightness) var(--chakra-backdrop-contrast) var(--chakra-backdrop-grayscale) var(--chakra-backdrop-hue-rotate) var(--chakra-backdrop-invert) var(--chakra-backdrop-opacity) var(--chakra-backdrop-saturate) var(--chakra-backdrop-sepia);\n  backdrop-filter: var(--chakra-backdrop-blur) var(--chakra-backdrop-brightness) var(--chakra-backdrop-contrast) var(--chakra-backdrop-grayscale) var(--chakra-backdrop-hue-rotate) var(--chakra-backdrop-invert) var(--chakra-backdrop-opacity) var(--chakra-backdrop-saturate) var(--chakra-backdrop-sepia);\n  --chakra-backdrop-blur: blur(10px);\n  --chakra-backdrop-brightness: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  --chakra-backdrop-contrast: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  --chakra-backdrop-grayscale: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  --chakra-backdrop-hue-rotate: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  --chakra-backdrop-invert: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  --chakra-backdrop-opacity: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  --chakra-backdrop-saturate: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  --chakra-backdrop-sepia: var(--chakra-empty,\n          \u002F*!*\u002F\n          \u002F*!*\u002F\n      );\n  border-radius: 50%;\n  background-color: rgba(255, 255, 255, 0.7);\n  color: var(--chakra-colors-black);\n}\n.ab--search-Panel__ab--carousel .slider-header .custom_navigation button svg {\n  width: 1.5rem;\n  height: 1.5rem;\n  margin: auto;\n}\n.ab--search-Panel__ab--carousel .slider-header .custom_navigation button:disabled,\n.ab--search-Panel__ab--carousel .slider-header .custom_navigation button[disabled],\n.ab--search-Panel__ab--carousel .slider-header .custom_navigation button[aria-disabled=true],\n.ab--search-Panel__ab--carousel .slider-header .custom_navigation button[data-disabled] {\n  opacity: 0.8;\n  color: var(--chakra-colors-gray-600);\n}\n.ab--search-Panel__ab--carousel .swiper-pagination {\n  bottom: 20px !important;\n  display: flex;\n  justify-content: center;\n}\n.ab--search-Panel__ab--carousel .swiper-pagination span {\n  display: none;\n}\n.ab--search-Panel__ab--carousel .swiper-pagination button.pagination-button {\n  height: 16px;\n  width: 16px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background-color: unset;\n  opacity: 1;\n}\n.ab--search-Panel__ab--carousel .swiper-pagination button.pagination-button \u003E svg:nth-child(2) {\n  display: none;\n}\n.ab--search-Panel__ab--carousel .swiper-pagination button.pagination-button \u003E svg:nth-child(1) {\n  display: block;\n  color: black;\n}\n.ab--search-Panel__ab--carousel .swiper-pagination button.swiper-pagination-bullet-active \u003E svg:nth-child(1) {\n  display: none;\n}\n.ab--search-Panel__ab--carousel .swiper-pagination button.swiper-pagination-bullet-active \u003E svg:nth-child(2) {\n  display: block;\n  height: 16px;\n  width: 16px;\n}\n.ab--search-Panel__ab--carousel .swiper-pagination .dot-icon {\n  width: var(--chakra-sizes-4);\n  height: var(--chakra-sizes-4);\n  line-height: 1em;\n  flex-shrink: 0;\n  color: currentcolor;\n  vertical-align: bottom;\n  display: inline-block;\n  transition-behavior: normal;\n  z-index: 1;\n  transition: transform 0.3s ease-in-out;\n}\n@media screen and (min-width: 62em) {\n  .ab--search-Panel__ab--carousel .slider-header {\n    padding-right: var(--chakra-space-10);\n    padding-left: var(--chakra-space-10);\n    padding-bottom: 3.75rem;\n  }\n}\n@media screen and (max-width: 61em) {\n  .ab--search-Panel__ab--carousel .slider-header {\n    display: flex;\n    padding-right: var(--chakra-space-4);\n    padding-left: var(--chakra-space-4);\n    padding-bottom: 1.5rem;\n    -webkit-box-pack: justify;\n    justify-content: space-between;\n    -webkit-box-align: center;\n    align-items: center;\n    position: relative;\n  }\n  .ab--search-Panel__ab--carousel .slider-header .custom_navigation {\n    z-index: 9;\n    position: absolute;\n    bottom: 15px;\n    right: 12px;\n    top: 36px;\n  }\n  .ab--search-Panel__ab--carousel .slider-header .custom_navigation button {\n    width: 40px !important;\n    height: 40px !important;\n  }\n  .ab--search-Panel__ab--carousel .slider-header .custom_navigation button svg {\n    width: 1rem !important;\n    height: 1rem !important;\n    margin: auto;\n  }\n  .ab--search-Panel__ab--carousel .custom .slider-card {\n    flex: 0 0 50% !important;\n  }\n  .ab--search-Panel__ab--carousel .custom .slider-card .product-tile__details {\n    padding: 10px !important;\n  }\n}\n.ab--search-Panel__contact-us {\n  padding-left: var(--chakra-space-10);\n  padding-right: var(--chakra-space-10);\n  padding: 60px 0;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  background-color: #FFFFFF;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__contact-us {\n    margin-top: 66px;\n    padding-left: var(--chakra-space-4);\n    padding-right: var(--chakra-space-4);\n  }\n}\n.ab--search-Panel__contact-us-title {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 36px;\n  line-height: 44px;\n  letter-spacing: 0;\n  text-align: center;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__contact-us-title {\n    font-size: 24px;\n    line-height: 32px;\n  }\n}\n.ab--search-Panel__contact-us-subtitle {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 20px;\n  line-height: 24px;\n  letter-spacing: 0;\n  text-align: center;\n  margin-top: 8px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__contact-us-subtitle {\n    font-size: 16px;\n    line-height: 22px;\n  }\n}\n.ab--search-Panel__contact-us-button {\n  margin-top: 40px;\n  width: 300px;\n  height: 48px;\n  border-radius: 3px;\n  border: 1px solid #000000;\n  color: #000000;\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 20px;\n  letter-spacing: 0;\n  text-align: center;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: background-color 0.2s;\n}\n.ab--search-Panel__contact-us-button:hover {\n  background-color: rgba(222, 218, 215, 0.443);\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__contact-us-button {\n    width: 100%;\n    margin-top: 32px;\n  }\n}\n.ab--search-Panel__sign-up {\n  padding-left: var(--chakra-space-10);\n  padding-right: var(--chakra-space-10);\n  padding-top: 60px;\n  padding-bottom: 120px;\n  display: flex;\n  flex-direction: row;\n  align-items: flex-end;\n  justify-content: center;\n  gap: 40px;\n  background-color: #FFFFFF;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__sign-up {\n    padding-left: var(--chakra-space-4);\n    padding-right: var(--chakra-space-4);\n    padding-top: 40px;\n    padding-bottom: 40px;\n    flex-direction: column;\n    align-items: center;\n    gap: 16px;\n  }\n}\n.ab--search-Panel__sign-up-texts {\n  width: 409px;\n  display: flex;\n  flex-direction: column;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__sign-up-texts {\n    width: 100%;\n  }\n}\n.ab--search-Panel__sign-up-button {\n  width: 300px;\n  height: 48px;\n  border-radius: 3px;\n  background: #000000;\n  -webkit-backdrop-filter: blur(40px);\n  backdrop-filter: blur(40px);\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 400;\n  font-size: 16px;\n  line-height: 20px;\n  letter-spacing: 0;\n  text-align: center;\n  color: #FFFFFF;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  text-transform: uppercase;\n  transition: background-color 0.2s, color 0.2s;\n}\n.ab--search-Panel__sign-up-button:hover {\n  color: var(--chakra-colors-black);\n  background-color: var(--chakra-colors-corporateBeige-400);\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__sign-up-button {\n    width: 100%;\n  }\n}\n.ab--search-Panel__sign-up-title {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 36px;\n  line-height: 44px;\n  letter-spacing: 0;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__sign-up-title {\n    font-size: 24px;\n    line-height: 32px;\n    text-align: center;\n  }\n}\n.ab--search-Panel__sign-up-subtitle {\n  font-family: var(--chakra-fonts-heading);\n  font-weight: 300;\n  font-size: 16px;\n  line-height: 20px;\n  letter-spacing: 0;\n  margin-top: 16px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__sign-up-subtitle {\n    font-size: 14px;\n    line-height: 18px;\n    text-align: center;\n    margin-top: 16px;\n  }\n}\n.ab--search-Panel__close {\n  position: absolute;\n  right: 40px;\n  top: 88px;\n}\n@media screen and (max-width: 991px) {\n  .ab--search-Panel__close {\n    top: 32px;\n    right: 16px;\n  }\n  .ab--search-Panel__close svg {\n    width: 24px;\n    height: 24px;\n  }\n}\n\n[role=navigation] \u003E button:nth-child(1) {\n  padding: 0 8px;\n}\n\n[role=navigation] \u003E div:nth-child(1) {\n  pointer-events: none;\n}\n\n[role=navigation] \u003E div:nth-child(2) {\n  display: none !important;\n}\n\nhtml.ab-searchPanel-open {\n  overflow-y: hidden;\n}\nhtml.ab-searchPanel-open .ab--search-Panel {\n  transform: translateX(0);\n}",
        "js": "(() =\u003E {\r\n    function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {\r\n        let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);\r\n        if (timer \u003C= 0) return;\r\n        (!isVariable && elements.length \u003E= minElements) || (isVariable && typeof window[waitFor] !== \"undefined\") ? callback(elements) : setTimeout(() =\u003E waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);\r\n    }\r\n\r\n    \u002F\u002F Search Section\r\n    const TITLE = 'What are you looking for?';\r\n    const SEARCH_PLACEHOLDER = 'Search';\r\n\r\n    \u002F\u002F type\r\n    const RECOMMENDATION__DISPLAY_TYPE = \"both\"; \u002F\u002Fcan be grid, carousel, both\r\n\r\n    const STRATEGY_ID_FOR_GRID = 251792;\r\n    const STRATEGY_ID_CAROUSEL_1 = 251792;\r\n    const STRATEGY_ID_CAROUSEL_2 = 251792;\r\n\r\n    \u002F\u002F carousel Section\r\n    const YOU_MAY_ALSO_LIKE = 'You may also like';\r\n    const RECENTLY_VIEWED = 'Last Viewed';\r\n\r\n    \u002F\u002F Search by category Section\r\n    const SEARCH_BY_CATEGORY_TITLE = 'Search by category';\r\n\r\n    const JEWELRY = 'Jewelry';\r\n    const JEWELRY_LINK = 'https:\u002F\u002Fwww.bulgari.com\u002Fen-us\u002Fjewelry';\r\n    const RINGS = 'Rings';\r\n    const RINGS_LINK = 'https:\u002F\u002Fwww.bulgari.com\u002Fen-us\u002Fjewelry\u002Frings';\r\n    const NECKLACES = 'Necklaces';\r\n    const NECKLACES_LINK = 'https:\u002F\u002Fwww.bulgari.com\u002Fen-us\u002Fjewelry\u002Fnecklaces';\r\n    const WATCHES = 'Watches';\r\n    const WATCHES_LINK = 'https:\u002F\u002Fwww.bulgari.com\u002Fen-us\u002Fwatches';\r\n    const BAGS_AND_ACCESSORIES = 'Bag & Accessories';\r\n    const BAGS_AND_ACCESSORIES_LINK = 'https:\u002F\u002Fwww.bulgari.com\u002Fen-us\u002Fbags-and-accessories';\r\n    const FRAGRANCES = 'Fragrances';\r\n    const FRAGRANCES_LINK = 'https:\u002F\u002Fwww.bulgari.com\u002Fen-us\u002Ffragrances';\r\n\r\n    \u002F\u002F Recommendation section\r\n    const RECOMMENDATION_TITLE = 'Recommended for you';\r\n    const RECOMMENDATION_BUTTON_TEXT = 'Discover more products';\r\n    const RECOMMENDATION_BUTTON_LINK = 'https:\u002F\u002Fwww.bulgari.com\u002Fen-us\u002Fgifts\u002Ffor-her';\r\n\r\n    \u002F\u002FContact us Section\r\n    const CONTACT_US_TITLE = 'Have an unanswered question? ';\r\n    const CONTACT_US_SUBTITLE = 'Discover all our contact methods, we will be happy to help you with all your needs.';\r\n    const CONTACT_US_BUTTON = 'Contact us';\r\n\r\n    \u002F\u002F Sign up Section\r\n    const SIGN_UP_TITLE = 'Join the Bvlgari Universe';\r\n    const SIGN_UP_SUBTITLE = 'Discover its magnificent icons, personalised services and unique experiences';\r\n    const SIGN_UP_BUTTON = 'sign up';\r\n\r\n    const searchByCategoryData = [\r\n        {\r\n            title: `${JEWELRY}`,\r\n            link: `${JEWELRY_LINK}`,\r\n            icon: `\u003Csvg width=\"48\" height=\"48\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath d=\"M36.6744 27.5575C35.9761 27.1577 35.2302 27.0138 34.5637 26.9658C36.1983 24.8068 37.1822 22.1359 37.1822 19.2092C37.1822 14.6513 34.7383 10.3972 30.8184 8.11017C30.4375 7.88627 29.9614 8.01422 29.7392 8.39805C29.5171 8.78187 29.644 9.26166 30.0249 9.48556C33.4528 11.4847 35.5952 15.195 35.5952 19.1932C35.5952 25.3665 30.6121 30.3883 24.4863 30.3883C18.3605 30.3883 13.3773 25.3825 13.3773 19.2092C13.3773 15.259 15.377 11.6926 18.7255 9.6295C19.1064 9.4056 19.2175 8.90982 18.9953 8.52599C18.7731 8.15815 18.2811 8.03021 17.9003 8.25411C14.0756 10.6211 11.7903 14.6992 11.7903 19.2092C11.7903 22.1199 12.7743 24.8068 14.4089 26.9658C13.7423 26.9978 12.9965 27.1417 12.2982 27.5415C10.9016 28.3572 10.7429 29.7486 11.2984 30.7081C11.584 31.2199 12.0601 31.5877 12.6315 31.7317C12.7902 31.7797 12.9806 31.7956 13.1869 31.7956C13.5678 31.7956 14.028 31.6997 14.52 31.4118C15.5357 30.8201 16.1387 29.8605 16.4878 29.1248C17.0116 29.5566 17.5829 29.9405 18.1859 30.2923C17.3448 30.7721 16.3926 31.4918 15.7578 32.5793C15.1865 33.5709 15.2341 34.4025 15.3611 34.9303C15.5357 35.6179 15.98 36.1937 16.5831 36.5615C16.9957 36.8014 17.44 36.9134 17.9003 36.9134C18.1224 36.9134 18.3605 36.8814 18.5827 36.8174C19.1064 36.6735 19.8523 36.2896 20.4395 35.2981C21.1695 34.0187 21.2488 32.5793 21.1695 31.5398C21.7408 31.6997 22.3121 31.8116 22.9152 31.8916C22.1852 32.9471 21.3282 34.5464 21.3282 36.4176C21.3282 38.7685 22.931 40 24.5022 40C26.0733 40 27.6761 38.7685 27.6761 36.4176C27.6761 34.5464 26.8192 32.9471 26.0892 31.8916C26.6922 31.8116 27.2635 31.6997 27.8348 31.5398C27.7555 32.5793 27.8348 34.0187 28.5649 35.2981C29.1362 36.2896 29.8662 36.6735 30.3899 36.8174C30.628 36.8814 30.8501 36.9134 31.0882 36.9134C31.5484 36.9134 31.9928 36.7854 32.4054 36.5615C33.0243 36.2097 33.4528 35.6339 33.6274 34.9303C33.7543 34.4025 33.8019 33.5709 33.2306 32.5793C32.6117 31.4918 31.6595 30.7721 30.8025 30.2923C31.3897 29.9405 31.961 29.5566 32.5006 29.1248C32.8497 29.8605 33.4528 30.8361 34.4685 31.4118C34.9446 31.6837 35.3889 31.7956 35.8174 31.7956C36.6427 31.7956 37.3409 31.3319 37.7059 30.6921C38.2614 29.7326 38.0868 28.3252 36.6903 27.5255L36.6744 27.5575ZM19.0588 34.4984C18.8207 34.9143 18.5192 35.1861 18.1701 35.2821C17.9003 35.3461 17.6305 35.3141 17.3924 35.1701C17.1544 35.0262 16.9798 34.8023 16.9005 34.5304C16.8211 34.1946 16.9005 33.7948 17.1385 33.3789C17.7257 32.3394 18.8207 31.7157 19.5666 31.3958C19.6618 32.2115 19.6618 33.4589 19.0746 34.4984H19.0588ZM31.8499 33.3789C32.088 33.7948 32.1673 34.1946 32.088 34.5304C32.0245 34.8023 31.8499 35.0262 31.596 35.1701C31.358 35.3141 31.0723 35.3461 30.8025 35.2821C30.4693 35.1861 30.1677 34.9143 29.9297 34.4984C29.3425 33.4589 29.3425 32.2115 29.4377 31.3958C30.1836 31.7157 31.2628 32.3394 31.8658 33.3789H31.8499ZM13.7265 30.0524C13.4567 30.2124 13.2186 30.2603 13.0123 30.2124C12.806 30.1644 12.7108 30.0204 12.6632 29.9405C12.5045 29.6686 12.5362 29.2688 13.0917 28.9489C13.7106 28.5971 14.4406 28.5491 15.0119 28.5651C14.758 29.0769 14.3454 29.6846 13.7265 30.0524ZM22.8993 36.4336C22.8993 34.7383 23.8515 33.235 24.4863 32.4194C25.1211 33.235 26.0733 34.7223 26.0733 36.4336C26.0733 39.1684 22.8993 39.1684 22.8993 36.4336ZM36.3094 29.9405C36.1507 30.2124 35.8016 30.3723 35.2461 30.0684C34.6272 29.7006 34.2146 29.0928 33.9606 28.5811C34.5161 28.5491 35.262 28.5811 35.8809 28.9489C36.4364 29.2688 36.4681 29.6686 36.3094 29.9405Z\" fill=\"black\"\u002F\u003E\u003Cpath d=\"M36.6744 27.5575L36.5253 27.8179L36.8016 27.9761L36.9431 27.6909L36.6744 27.5575ZM34.5637 26.9658L34.3245 26.7847L33.9909 27.2253L34.5422 27.265L34.5637 26.9658ZM30.8184 8.11017L30.6664 8.3688L30.6672 8.3693L30.8184 8.11017ZM30.0249 9.48556L29.8729 9.74419L29.8738 9.74471L30.0249 9.48556ZM18.7255 9.6295L18.5734 9.37082L18.5681 9.37408L18.7255 9.6295ZM18.9953 8.52599L19.255 8.37567L19.2521 8.37088L18.9953 8.52599ZM17.9003 8.25411L17.7482 7.99542L17.7424 7.99901L17.9003 8.25411ZM14.4089 26.9658L14.4233 27.2655L14.9914 27.2382L14.6481 26.7847L14.4089 26.9658ZM12.2982 27.5415L12.1491 27.2812L12.1469 27.2825L12.2982 27.5415ZM11.2984 30.7081L11.5604 30.5619L11.558 30.5578L11.2984 30.7081ZM12.6315 31.7317L12.7184 31.4442L12.7047 31.4408L12.6315 31.7317ZM14.52 31.4118L14.369 31.1526L14.3685 31.1529L14.52 31.4118ZM16.4878 29.1248L16.6787 28.8934L16.3818 28.6486L16.2168 28.9962L16.4878 29.1248ZM18.1859 30.2923L18.3346 30.5529L18.7863 30.2952L18.3371 30.0332L18.1859 30.2923ZM15.7578 32.5793L15.4987 32.4281L15.4979 32.4295L15.7578 32.5793ZM15.3611 34.9303L15.0694 35.0004L15.0703 35.0041L15.3611 34.9303ZM16.5831 36.5615L16.4268 36.8177L16.4323 36.8209L16.5831 36.5615ZM18.5827 36.8174L18.5032 36.5281L18.4997 36.5291L18.5827 36.8174ZM20.4395 35.2981L20.6976 35.451L20.7 35.4468L20.4395 35.2981ZM21.1695 31.5398L21.2503 31.2509L20.8377 31.1354L20.8703 31.5626L21.1695 31.5398ZM22.9152 31.8916L23.1619 32.0623L23.441 31.6587L22.9546 31.5942L22.9152 31.8916ZM26.0892 31.8916L26.0497 31.5942L25.5633 31.6587L25.8424 32.0623L26.0892 31.8916ZM27.8348 31.5398L28.134 31.5626L28.1666 31.1354L27.754 31.2509L27.8348 31.5398ZM28.5649 35.2981L28.3043 35.4468L28.3049 35.4479L28.5649 35.2981ZM30.3899 36.8174L30.3104 37.1067L30.312 37.1071L30.3899 36.8174ZM32.4054 36.5615L32.5485 36.8253L32.5536 36.8223L32.4054 36.5615ZM33.6274 34.9303L33.9186 35.0025L33.9191 35.0004L33.6274 34.9303ZM33.2306 32.5793L32.9699 32.7277L32.9707 32.7291L33.2306 32.5793ZM30.8025 30.2923L30.6483 30.035L30.2042 30.3011L30.656 30.5541L30.8025 30.2923ZM32.5006 29.1248L32.7716 28.9962L32.6091 28.6538L32.3132 28.8906L32.5006 29.1248ZM34.4685 31.4118L34.6172 31.1513L34.6164 31.1508L34.4685 31.4118ZM37.7059 30.6921L37.4463 30.5418L37.4454 30.5435L37.7059 30.6921ZM36.6903 27.5255L36.8393 27.2652L36.563 27.107L36.4215 27.3922L36.6903 27.5255ZM19.0588 34.4984V34.1984H18.8848L18.7984 34.3494L19.0588 34.4984ZM18.1701 35.2821L18.2393 35.5742L18.2496 35.5714L18.1701 35.2821ZM16.9005 34.5304L16.6085 34.5994L16.6103 34.607L16.6125 34.6145L16.9005 34.5304ZM17.1385 33.3789L17.3989 33.528L17.3997 33.5265L17.1385 33.3789ZM19.5666 31.3958L19.8646 31.361L19.818 30.9616L19.4484 31.1201L19.5666 31.3958ZM19.0746 34.4984V34.7984H19.2497L19.3359 34.646L19.0746 34.4984ZM31.8499 33.3789V33.0789H31.3325L31.5896 33.528L31.8499 33.3789ZM32.088 34.5304L31.796 34.4615L31.7958 34.4622L32.088 34.5304ZM31.596 35.1701L31.448 34.9091L31.4408 34.9134L31.596 35.1701ZM30.8025 35.2821L30.7195 35.5704L30.7264 35.5724L30.7333 35.574L30.8025 35.2821ZM29.9297 34.4984L29.6685 34.646L29.6693 34.6475L29.9297 34.4984ZM29.4377 31.3958L29.5559 31.1201L29.1864 30.9616L29.1397 31.361L29.4377 31.3958ZM31.8658 33.3789V33.6789H32.3867L32.1253 33.2284L31.8658 33.3789ZM13.7265 30.0524L13.8795 30.3105L13.8797 30.3103L13.7265 30.0524ZM12.6632 29.9405L12.4041 30.0917L12.4054 30.0939L12.6632 29.9405ZM13.0917 28.9489L12.9434 28.6881L12.942 28.6889L13.0917 28.9489ZM15.0119 28.5651L15.2807 28.6984L15.4891 28.2783L15.0203 28.2652L15.0119 28.5651ZM24.4863 32.4194L24.723 32.2351L24.4863 31.9309L24.2495 32.2351L24.4863 32.4194ZM35.2461 30.0684L35.0927 30.3265L35.1021 30.3316L35.2461 30.0684ZM33.9606 28.5811L33.9434 28.2816L33.4901 28.3077L33.6919 28.7144L33.9606 28.5811ZM35.8809 28.9489L35.7276 29.2068L35.7312 29.2089L35.8809 28.9489ZM36.8235 27.2972C36.072 26.8669 35.277 26.7164 34.5852 26.6666L34.5422 27.265C35.1835 27.3112 35.8802 27.4485 36.5253 27.8179L36.8235 27.2972ZM34.8029 27.1469C36.4747 24.9387 37.4822 22.2049 37.4822 19.2092H36.8822C36.8822 22.067 35.9219 24.6749 34.3245 26.7847L34.8029 27.1469ZM37.4822 19.2092C37.4822 14.5448 34.9818 10.1919 30.9696 7.85105L30.6672 8.3693C34.4947 10.6024 36.8822 14.7577 36.8822 19.2092H37.4822ZM30.9704 7.85155C30.4441 7.54216 29.7841 7.72178 29.4796 8.24775L29.9989 8.54834C30.1388 8.30665 30.4309 8.23039 30.6664 8.3688L30.9704 7.85155ZM29.4796 8.24775C29.1748 8.77435 29.3499 9.43675 29.8729 9.74419L30.1769 9.22694C29.9382 9.08657 29.8593 8.7894 29.9989 8.54834L29.4796 8.24775ZM29.8738 9.74471C33.2096 11.6901 35.2952 15.3019 35.2952 19.1932H35.8952C35.8952 15.0882 33.696 11.2792 30.176 9.22641L29.8738 9.74471ZM35.2952 19.1932C35.2952 25.203 30.4442 30.0883 24.4863 30.0883V30.6883C30.78 30.6883 35.8952 25.53 35.8952 19.1932H35.2952ZM24.4863 30.0883C18.5278 30.0883 13.6773 25.2184 13.6773 19.2092H13.0773C13.0773 25.5466 18.1932 30.6883 24.4863 30.6883V30.0883ZM13.6773 19.2092C13.6773 15.3633 15.6228 11.8935 18.8829 9.88491L18.5681 9.37408C15.1311 11.4917 13.0773 15.1547 13.0773 19.2092H13.6773ZM18.8775 9.88812C19.4119 9.57402 19.553 8.89063 19.2549 8.3757L18.7357 8.67628C18.8819 8.92901 18.8009 9.23718 18.5735 9.37087L18.8775 9.88812ZM19.2521 8.37088C18.9446 7.86184 18.2702 7.68867 17.7482 7.99549L18.0523 8.51273C18.2921 8.37175 18.6016 8.45446 18.7385 8.68109L19.2521 8.37088ZM17.7424 7.99901C13.8298 10.4204 11.4903 14.5949 11.4903 19.2092H12.0903C12.0903 14.8036 14.3215 10.8217 18.0581 8.50921L17.7424 7.99901ZM11.4903 19.2092C11.4903 22.1887 12.4977 24.9385 14.1697 27.1469L14.6481 26.7847C13.0508 24.675 12.0903 22.0512 12.0903 19.2092H11.4903ZM14.3945 26.6661C13.6971 26.6996 12.9008 26.8508 12.1491 27.2812L12.4473 27.8019C13.0921 27.4326 13.7876 27.296 14.4233 27.2655L14.3945 26.6661ZM12.1469 27.2825C10.6029 28.1842 10.4033 29.7607 11.0387 30.8584L11.558 30.5578C11.0826 29.7364 11.2004 28.5301 12.4495 27.8006L12.1469 27.2825ZM11.0364 30.8543C11.3621 31.4378 11.9061 31.8583 12.5582 32.0226L12.7047 31.4408C12.2141 31.3172 11.806 31.002 11.5603 30.5619L11.0364 30.8543ZM12.5446 32.0188C12.7449 32.0794 12.9695 32.0956 13.1869 32.0956V31.4956C12.9917 31.4956 12.8354 31.4799 12.7183 31.4445L12.5446 32.0188ZM13.1869 32.0956C13.6197 32.0956 14.1324 31.9862 14.6715 31.6707L14.3685 31.1529C13.9236 31.4132 13.5159 31.4956 13.1869 31.4956V32.0956ZM14.671 31.671C15.7623 31.0352 16.3985 30.0127 16.7589 29.2535L16.2168 28.9962C15.8789 29.7083 15.309 30.6049 14.369 31.1526L14.671 31.671ZM16.297 29.3563C16.8359 29.8006 17.4211 30.1934 18.0347 30.5514L18.3371 30.0332C17.7446 29.6875 17.1873 29.3127 16.6787 28.8934L16.297 29.3563ZM18.0373 30.0317C17.1715 30.5256 16.1701 31.2778 15.4987 32.4281L16.0169 32.7305C16.6151 31.7057 17.5181 31.0186 18.3346 30.5529L18.0373 30.0317ZM15.4979 32.4295C14.8812 33.4998 14.9281 34.4128 15.0694 35.0004L15.6528 34.8601C15.5402 34.3921 15.4918 33.6419 16.0178 32.7291L15.4979 32.4295ZM15.0703 35.0041C15.2653 35.7723 15.7609 36.4114 16.4268 36.8176L16.7393 36.3054C16.1991 35.9759 15.806 35.4636 15.6519 34.8564L15.0703 35.0041ZM16.4323 36.8209C16.8928 37.0886 17.3895 37.2134 17.9003 37.2134V36.6134C17.4906 36.6134 17.0986 36.5142 16.7339 36.3022L16.4323 36.8209ZM17.9003 37.2134C18.1497 37.2134 18.4157 37.1777 18.6657 37.1057L18.4997 36.5291C18.3053 36.5851 18.0952 36.6134 17.9003 36.6134V37.2134ZM18.6622 37.1067C19.252 36.9446 20.0663 36.5169 20.6976 35.451L20.1813 35.1452C19.6382 36.0624 18.9608 36.4024 18.5032 36.5281L18.6622 37.1067ZM20.7 35.4468C21.472 34.0937 21.5502 32.5854 21.4686 31.5169L20.8703 31.5626C20.9475 32.5732 20.8669 33.9436 20.1789 35.1494L20.7 35.4468ZM21.0886 31.8287C21.6753 31.9929 22.2607 32.1074 22.8757 32.189L22.9546 31.5942C22.3636 31.5158 21.8063 31.4065 21.2503 31.2509L21.0886 31.8287ZM22.6684 31.721C21.9244 32.7968 21.0282 34.4572 21.0282 36.4176H21.6282C21.6282 34.6357 22.4459 33.0975 23.1619 32.0623L22.6684 31.721ZM21.0282 36.4176C21.0282 38.932 22.7632 40.3 24.5022 40.3V39.7C23.0989 39.7 21.6282 38.605 21.6282 36.4176H21.0282ZM24.5022 40.3C26.2411 40.3 27.9761 38.932 27.9761 36.4176H27.3762C27.3762 38.605 25.9054 39.7 24.5022 39.7V40.3ZM27.9761 36.4176C27.9761 34.4572 27.08 32.7968 26.3359 31.721L25.8424 32.0623C26.5584 33.0975 27.3762 34.6357 27.3762 36.4176H27.9761ZM26.1286 32.189C26.7437 32.1074 27.329 31.9929 27.9157 31.8287L27.754 31.2509C27.1981 31.4065 26.6408 31.5158 26.0497 31.5942L26.1286 32.189ZM27.5357 31.5169C27.4542 32.5854 27.5323 34.0937 28.3043 35.4468L28.8254 35.1494C28.1374 33.9436 28.0568 32.5732 28.134 31.5626L27.5357 31.5169ZM28.3049 35.4479C28.9195 36.5144 29.7182 36.9439 30.3104 37.1067L30.4694 36.5281C30.0142 36.403 29.3529 36.0649 28.8248 35.1483L28.3049 35.4479ZM30.312 37.1071C30.5728 37.1772 30.8212 37.2134 31.0882 37.2134V36.6134C30.8791 36.6134 30.6832 36.5856 30.4678 36.5277L30.312 37.1071ZM31.0882 37.2134C31.6053 37.2134 32.0984 37.0694 32.5485 36.8252L32.2623 36.2978C31.8871 36.5014 31.4915 36.6134 31.0882 36.6134V37.2134ZM32.5536 36.8223C33.2464 36.4285 33.7249 35.7832 33.9185 35.0025L33.3362 34.858C33.1807 35.4847 32.8022 35.9909 32.2571 36.3007L32.5536 36.8223ZM33.9191 35.0004C34.0604 34.4128 34.1072 33.4998 33.4906 32.4295L32.9707 32.7291C33.4967 33.6419 33.4483 34.3921 33.3357 34.8601L33.9191 35.0004ZM33.4914 32.4309C32.8352 31.2781 31.8319 30.5248 30.9491 30.0305L30.656 30.5541C31.4871 31.0194 32.3882 31.7055 32.9699 32.7277L33.4914 32.4309ZM30.9567 30.5497C31.5527 30.1926 32.1356 29.8011 32.6881 29.3591L32.3132 28.8906C31.7864 29.3121 31.2267 29.6884 30.6483 30.035L30.9567 30.5497ZM32.2296 29.2535C32.5886 30.0099 33.2253 31.0519 34.3205 31.6728L34.6164 31.1508C33.6803 30.6202 33.1109 29.7111 32.7716 28.9962L32.2296 29.2535ZM34.3197 31.6723C34.8374 31.9679 35.3326 32.0956 35.8174 32.0956V31.4956C35.4453 31.4956 35.0518 31.3995 34.6172 31.1513L34.3197 31.6723ZM35.8174 32.0956C36.7588 32.0956 37.5524 31.5665 37.9665 30.8408L37.4454 30.5435C37.1294 31.0972 36.5265 31.4956 35.8174 31.4956V32.0956ZM37.9656 30.8424C38.6019 29.7432 38.3843 28.1498 36.8393 27.2652L36.5412 27.7859C37.7894 28.5006 37.9209 29.722 37.4463 30.5418L37.9656 30.8424ZM36.4215 27.3922L36.4057 27.4242L36.9431 27.6909L36.959 27.6589L36.4215 27.3922ZM18.7984 34.3494C18.5845 34.7231 18.338 34.9248 18.0906 34.9928L18.2496 35.5714C18.7004 35.4475 19.057 35.1054 19.3191 34.6475L18.7984 34.3494ZM18.1008 34.9902C17.8994 35.0379 17.7116 35.0125 17.5477 34.9134L17.2372 35.4269C17.5494 35.6156 17.9011 35.6542 18.2393 35.574L18.1008 34.9902ZM17.5477 34.9134C17.3733 34.808 17.2465 34.6453 17.1885 34.4464L16.6125 34.6145C16.7131 34.9593 16.9355 35.2444 17.2372 35.4269L17.5477 34.9134ZM17.1924 34.4615C17.1359 34.2221 17.1854 33.9009 17.3989 33.528L16.8782 33.2299C16.6156 33.6886 16.5064 34.1671 16.6085 34.5994L17.1924 34.4615ZM17.3997 33.5265C17.9378 32.5738 18.958 31.9833 19.6848 31.6715L19.4484 31.1201C18.6835 31.4481 17.5136 32.105 16.8773 33.2314L17.3997 33.5265ZM19.2686 31.4306C19.3613 32.2239 19.3539 33.3941 18.8134 34.3509L19.3359 34.646C19.9698 33.5237 19.9624 32.199 19.8646 31.361L19.2686 31.4306ZM19.0746 34.1984H19.0588V34.7984H19.0746V34.1984ZM31.5896 33.528C31.8031 33.9009 31.8526 34.2221 31.796 34.4615L32.38 34.5994C32.4821 34.1671 32.3729 33.6886 32.1103 33.2299L31.5896 33.528ZM31.7958 34.4622C31.7529 34.6462 31.6349 34.8032 31.4481 34.9092L31.744 35.4311C32.0649 35.2492 32.2961 34.9584 32.3801 34.5986L31.7958 34.4622ZM31.4408 34.9134C31.2783 35.0117 31.0749 35.0384 30.8717 34.9902L30.7333 35.574C31.0697 35.6538 31.4377 35.6165 31.7512 35.4269L31.4408 34.9134ZM30.8855 34.9938C30.6526 34.9267 30.4048 34.7245 30.19 34.3494L29.6693 34.6475C29.9307 35.1041 30.286 35.4456 30.7195 35.5704L30.8855 34.9938ZM30.1909 34.3509C29.6504 33.3941 29.6431 32.2239 29.7357 31.4306L29.1397 31.361C29.0419 32.199 29.0345 33.5237 29.6685 34.646L30.1909 34.3509ZM29.3195 31.6715C30.0436 31.9821 31.0514 32.573 31.6063 33.5295L32.1253 33.2284C31.4741 32.1058 30.3236 31.4493 29.5559 31.1201L29.3195 31.6715ZM31.8658 33.0789H31.8499V33.6789H31.8658V33.0789ZM13.5735 29.7944C13.3456 29.9295 13.1874 29.9451 13.0803 29.9202L12.9444 30.5046C13.2499 30.5756 13.5678 30.4952 13.8795 30.3105L13.5735 29.7944ZM13.0803 29.9202C12.9974 29.9009 12.9575 29.8484 12.921 29.787L12.4054 30.0939C12.4641 30.1925 12.6147 30.4279 12.9444 30.5046L13.0803 29.9202ZM12.9223 29.7892C12.8802 29.7171 12.8676 29.6382 12.8945 29.5569C12.9223 29.4728 13.0067 29.344 13.2414 29.2089L12.942 28.6889C12.6212 28.8737 12.4121 29.1047 12.3248 29.3685C12.2367 29.635 12.2875 29.8919 12.4041 30.0917L12.9223 29.7892ZM13.2399 29.2097C13.7857 28.8995 14.4475 28.8494 15.0035 28.865L15.0203 28.2652C14.4337 28.2488 13.6355 28.2947 12.9434 28.6881L13.2399 29.2097ZM14.7432 28.4317C14.5013 28.9193 14.1213 29.4688 13.5732 29.7945L13.8797 30.3103C14.5695 29.9004 15.0148 29.2344 15.2807 28.6984L14.7432 28.4317ZM23.1993 36.4336C23.1993 34.8413 24.0993 33.405 24.723 32.6036L24.2495 32.2351C23.6037 33.065 22.5993 34.6353 22.5993 36.4336H23.1993ZM24.2495 32.6036C24.8736 33.4055 25.7733 34.8257 25.7733 36.4336H26.3733C26.3733 34.619 25.3685 33.0645 24.723 32.2351L24.2495 32.6036ZM25.7733 36.4336C25.7733 37.6757 25.0764 38.1847 24.4863 38.1847C23.8962 38.1847 23.1993 37.6757 23.1993 36.4336H22.5993C22.5993 37.9262 23.4894 38.7847 24.4863 38.7847C25.4832 38.7847 26.3733 37.9262 26.3733 36.4336H25.7733ZM36.0503 29.7892C36.0075 29.8626 35.9476 29.9099 35.8666 29.9264C35.7806 29.9439 35.6275 29.9351 35.3901 29.8052L35.1021 30.3316C35.4201 30.5056 35.7193 30.5687 35.9864 30.5143C36.2586 30.4588 36.4526 30.2902 36.5685 30.0917L36.0503 29.7892ZM35.3994 29.8105C34.8513 29.4848 34.4713 28.9353 34.2294 28.4477L33.6919 28.7144C33.9578 29.2504 34.4031 29.9164 35.0928 30.3263L35.3994 29.8105ZM33.9779 28.8806C34.5169 28.8495 35.1878 28.886 35.7276 29.2068L36.0342 28.691C35.3361 28.2762 34.5152 28.2486 33.9434 28.2816L33.9779 28.8806ZM35.7312 29.2089C35.9659 29.344 36.0503 29.4728 36.0781 29.5569C36.105 29.6382 36.0924 29.7171 36.0503 29.7892L36.5685 30.0917C36.6851 29.8919 36.7359 29.635 36.6478 29.3685C36.5605 29.1047 36.3514 28.8737 36.0306 28.6889L35.7312 29.2089Z\" fill=\"white\"\u002F\u003E\u003C\u002Fsvg\u003E`,\r\n        },\r\n        {\r\n            title: `${RINGS}`,\r\n            link: `${RINGS_LINK}`,\r\n            icon: `\u003Csvg width=\"49\" height=\"48\" viewBox=\"0 0 49 48\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.7011 11.162C18.425 11.162 18.2011 11.3858 18.2011 11.662C18.2011 11.9381 18.425 12.162 18.7011 12.162H31.1037C31.3798 12.162 31.6037 11.9381 31.6037 11.662C31.6037 11.3858 31.3798 11.162 31.1037 11.162H18.7011ZM32.1071 16.3933C31.8782 16.2389 31.5674 16.2992 31.4129 16.5281C31.2584 16.757 31.3188 17.0678 31.5477 17.2223C34.7235 19.3654 36.8052 22.9745 36.8052 27.0995C36.8052 33.6636 31.4686 38.999 24.9026 38.999C18.3365 38.999 13 33.6636 13 27.0995C13 23.0339 15.0427 19.4247 18.1772 17.2826C18.4052 17.1268 18.4637 16.8157 18.3079 16.5877C18.1521 16.3597 17.841 16.3012 17.613 16.457C14.2155 18.7788 12 22.692 12 27.0995C12 34.2161 17.7845 39.999 24.9026 39.999C32.0207 39.999 37.8052 34.2161 37.8052 27.0995C37.8052 22.6274 35.546 18.714 32.1071 16.3933Z\" fill=\"black\"\u002F\u003E\u003Cpath d=\"M18.7012 11.6619L21.037 8.5H28.7886L31.1038 11.6619L24.9025 17.7997L18.7012 11.6619Z\" stroke=\"#1F1F1F\" stroke-miterlimit=\"10\"\u002F\u003E\u003C\u002Fsvg\u003E`,\r\n        },\r\n        {\r\n            title: `${NECKLACES}`,\r\n            link: `${NECKLACES_LINK}`,\r\n            icon: `\u003Csvg width=\"48\" height=\"48\" viewBox=\"0 0 48 48\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath d=\"M36.6744 27.5575C35.9761 27.1577 35.2302 27.0138 34.5637 26.9658C36.1983 24.8068 37.1822 22.1359 37.1822 19.2092C37.1822 14.6513 34.7383 10.3972 30.8184 8.11017C30.4375 7.88627 29.9614 8.01422 29.7392 8.39805C29.5171 8.78187 29.644 9.26166 30.0249 9.48556C33.4528 11.4847 35.5952 15.195 35.5952 19.1932C35.5952 25.3665 30.6121 30.3883 24.4863 30.3883C18.3605 30.3883 13.3773 25.3825 13.3773 19.2092C13.3773 15.259 15.377 11.6926 18.7255 9.6295C19.1064 9.4056 19.2175 8.90982 18.9953 8.52599C18.7731 8.15815 18.2811 8.03021 17.9003 8.25411C14.0756 10.6211 11.7903 14.6992 11.7903 19.2092C11.7903 22.1199 12.7743 24.8068 14.4089 26.9658C13.7423 26.9978 12.9965 27.1417 12.2982 27.5415C10.9016 28.3572 10.7429 29.7486 11.2984 30.7081C11.584 31.2199 12.0601 31.5877 12.6315 31.7317C12.7902 31.7797 12.9806 31.7956 13.1869 31.7956C13.5678 31.7956 14.028 31.6997 14.52 31.4118C15.5357 30.8201 16.1387 29.8605 16.4878 29.1248C17.0116 29.5566 17.5829 29.9405 18.1859 30.2923C17.3448 30.7721 16.3926 31.4918 15.7578 32.5793C15.1865 33.5709 15.2341 34.4025 15.3611 34.9303C15.5357 35.6179 15.98 36.1937 16.5831 36.5615C16.9957 36.8014 17.44 36.9134 17.9003 36.9134C18.1224 36.9134 18.3605 36.8814 18.5827 36.8174C19.1064 36.6735 19.8523 36.2896 20.4395 35.2981C21.1695 34.0187 21.2488 32.5793 21.1695 31.5398C21.7408 31.6997 22.3121 31.8116 22.9152 31.8916C22.1852 32.9471 21.3282 34.5464 21.3282 36.4176C21.3282 38.7685 22.931 40 24.5022 40C26.0733 40 27.6761 38.7685 27.6761 36.4176C27.6761 34.5464 26.8192 32.9471 26.0892 31.8916C26.6922 31.8116 27.2635 31.6997 27.8348 31.5398C27.7555 32.5793 27.8348 34.0187 28.5649 35.2981C29.1362 36.2896 29.8662 36.6735 30.3899 36.8174C30.628 36.8814 30.8501 36.9134 31.0882 36.9134C31.5484 36.9134 31.9928 36.7854 32.4054 36.5615C33.0243 36.2097 33.4528 35.6339 33.6274 34.9303C33.7543 34.4025 33.8019 33.5709 33.2306 32.5793C32.6117 31.4918 31.6595 30.7721 30.8025 30.2923C31.3897 29.9405 31.961 29.5566 32.5006 29.1248C32.8497 29.8605 33.4528 30.8361 34.4685 31.4118C34.9446 31.6837 35.3889 31.7956 35.8174 31.7956C36.6427 31.7956 37.3409 31.3319 37.7059 30.6921C38.2614 29.7326 38.0868 28.3252 36.6903 27.5255L36.6744 27.5575ZM19.0588 34.4984C18.8207 34.9143 18.5192 35.1861 18.1701 35.2821C17.9003 35.3461 17.6305 35.3141 17.3924 35.1701C17.1544 35.0262 16.9798 34.8023 16.9005 34.5304C16.8211 34.1946 16.9005 33.7948 17.1385 33.3789C17.7257 32.3394 18.8207 31.7157 19.5666 31.3958C19.6618 32.2115 19.6618 33.4589 19.0746 34.4984H19.0588ZM31.8499 33.3789C32.088 33.7948 32.1673 34.1946 32.088 34.5304C32.0245 34.8023 31.8499 35.0262 31.596 35.1701C31.358 35.3141 31.0723 35.3461 30.8025 35.2821C30.4693 35.1861 30.1677 34.9143 29.9297 34.4984C29.3425 33.4589 29.3425 32.2115 29.4377 31.3958C30.1836 31.7157 31.2628 32.3394 31.8658 33.3789H31.8499ZM13.7265 30.0524C13.4567 30.2124 13.2186 30.2603 13.0123 30.2124C12.806 30.1644 12.7108 30.0204 12.6632 29.9405C12.5045 29.6686 12.5362 29.2688 13.0917 28.9489C13.7106 28.5971 14.4406 28.5491 15.0119 28.5651C14.758 29.0769 14.3454 29.6846 13.7265 30.0524ZM22.8993 36.4336C22.8993 34.7383 23.8515 33.235 24.4863 32.4194C25.1211 33.235 26.0733 34.7223 26.0733 36.4336C26.0733 39.1684 22.8993 39.1684 22.8993 36.4336ZM36.3094 29.9405C36.1507 30.2124 35.8016 30.3723 35.2461 30.0684C34.6272 29.7006 34.2146 29.0928 33.9606 28.5811C34.5161 28.5491 35.262 28.5811 35.8809 28.9489C36.4364 29.2688 36.4681 29.6686 36.3094 29.9405Z\" fill=\"black\"\u002F\u003E\u003Cpath d=\"M36.6744 27.5575L36.5253 27.8179L36.8016 27.9761L36.9431 27.6909L36.6744 27.5575ZM34.5637 26.9658L34.3245 26.7847L33.9909 27.2253L34.5422 27.265L34.5637 26.9658ZM30.8184 8.11017L30.6664 8.3688L30.6672 8.3693L30.8184 8.11017ZM30.0249 9.48556L29.8729 9.74419L29.8738 9.74471L30.0249 9.48556ZM18.7255 9.6295L18.5734 9.37082L18.5681 9.37408L18.7255 9.6295ZM18.9953 8.52599L19.255 8.37567L19.2521 8.37088L18.9953 8.52599ZM17.9003 8.25411L17.7482 7.99542L17.7424 7.99901L17.9003 8.25411ZM14.4089 26.9658L14.4233 27.2655L14.9914 27.2382L14.6481 26.7847L14.4089 26.9658ZM12.2982 27.5415L12.1491 27.2812L12.1469 27.2825L12.2982 27.5415ZM11.2984 30.7081L11.5604 30.5619L11.558 30.5578L11.2984 30.7081ZM12.6315 31.7317L12.7184 31.4442L12.7047 31.4408L12.6315 31.7317ZM14.52 31.4118L14.369 31.1526L14.3685 31.1529L14.52 31.4118ZM16.4878 29.1248L16.6787 28.8934L16.3818 28.6486L16.2168 28.9962L16.4878 29.1248ZM18.1859 30.2923L18.3346 30.5529L18.7863 30.2952L18.3371 30.0332L18.1859 30.2923ZM15.7578 32.5793L15.4987 32.4281L15.4979 32.4295L15.7578 32.5793ZM15.3611 34.9303L15.0694 35.0004L15.0703 35.0041L15.3611 34.9303ZM16.5831 36.5615L16.4268 36.8177L16.4323 36.8209L16.5831 36.5615ZM18.5827 36.8174L18.5032 36.5281L18.4997 36.5291L18.5827 36.8174ZM20.4395 35.2981L20.6976 35.451L20.7 35.4468L20.4395 35.2981ZM21.1695 31.5398L21.2503 31.2509L20.8377 31.1354L20.8703 31.5626L21.1695 31.5398ZM22.9152 31.8916L23.1619 32.0623L23.441 31.6587L22.9546 31.5942L22.9152 31.8916ZM26.0892 31.8916L26.0497 31.5942L25.5633 31.6587L25.8424 32.0623L26.0892 31.8916ZM27.8348 31.5398L28.134 31.5626L28.1666 31.1354L27.754 31.2509L27.8348 31.5398ZM28.5649 35.2981L28.3043 35.4468L28.3049 35.4479L28.5649 35.2981ZM30.3899 36.8174L30.3104 37.1067L30.312 37.1071L30.3899 36.8174ZM32.4054 36.5615L32.5485 36.8253L32.5536 36.8223L32.4054 36.5615ZM33.6274 34.9303L33.9186 35.0025L33.9191 35.0004L33.6274 34.9303ZM33.2306 32.5793L32.9699 32.7277L32.9707 32.7291L33.2306 32.5793ZM30.8025 30.2923L30.6483 30.035L30.2042 30.3011L30.656 30.5541L30.8025 30.2923ZM32.5006 29.1248L32.7716 28.9962L32.6091 28.6538L32.3132 28.8906L32.5006 29.1248ZM34.4685 31.4118L34.6172 31.1513L34.6164 31.1508L34.4685 31.4118ZM37.7059 30.6921L37.4463 30.5418L37.4454 30.5435L37.7059 30.6921ZM36.6903 27.5255L36.8393 27.2652L36.563 27.107L36.4215 27.3922L36.6903 27.5255ZM19.0588 34.4984V34.1984H18.8848L18.7984 34.3494L19.0588 34.4984ZM18.1701 35.2821L18.2393 35.5742L18.2496 35.5714L18.1701 35.2821ZM16.9005 34.5304L16.6085 34.5994L16.6103 34.607L16.6125 34.6145L16.9005 34.5304ZM17.1385 33.3789L17.3989 33.528L17.3997 33.5265L17.1385 33.3789ZM19.5666 31.3958L19.8646 31.361L19.818 30.9616L19.4484 31.1201L19.5666 31.3958ZM19.0746 34.4984V34.7984H19.2497L19.3359 34.646L19.0746 34.4984ZM31.8499 33.3789V33.0789H31.3325L31.5896 33.528L31.8499 33.3789ZM32.088 34.5304L31.796 34.4615L31.7958 34.4622L32.088 34.5304ZM31.596 35.1701L31.448 34.9091L31.4408 34.9134L31.596 35.1701ZM30.8025 35.2821L30.7195 35.5704L30.7264 35.5724L30.7333 35.574L30.8025 35.2821ZM29.9297 34.4984L29.6685 34.646L29.6693 34.6475L29.9297 34.4984ZM29.4377 31.3958L29.5559 31.1201L29.1864 30.9616L29.1397 31.361L29.4377 31.3958ZM31.8658 33.3789V33.6789H32.3867L32.1253 33.2284L31.8658 33.3789ZM13.7265 30.0524L13.8795 30.3105L13.8797 30.3103L13.7265 30.0524ZM12.6632 29.9405L12.4041 30.0917L12.4054 30.0939L12.6632 29.9405ZM13.0917 28.9489L12.9434 28.6881L12.942 28.6889L13.0917 28.9489ZM15.0119 28.5651L15.2807 28.6984L15.4891 28.2783L15.0203 28.2652L15.0119 28.5651ZM24.4863 32.4194L24.723 32.2351L24.4863 31.9309L24.2495 32.2351L24.4863 32.4194ZM35.2461 30.0684L35.0927 30.3265L35.1021 30.3316L35.2461 30.0684ZM33.9606 28.5811L33.9434 28.2816L33.4901 28.3077L33.6919 28.7144L33.9606 28.5811ZM35.8809 28.9489L35.7276 29.2068L35.7312 29.2089L35.8809 28.9489ZM36.8235 27.2972C36.072 26.8669 35.277 26.7164 34.5852 26.6666L34.5422 27.265C35.1835 27.3112 35.8802 27.4485 36.5253 27.8179L36.8235 27.2972ZM34.8029 27.1469C36.4747 24.9387 37.4822 22.2049 37.4822 19.2092H36.8822C36.8822 22.067 35.9219 24.6749 34.3245 26.7847L34.8029 27.1469ZM37.4822 19.2092C37.4822 14.5448 34.9818 10.1919 30.9696 7.85105L30.6672 8.3693C34.4947 10.6024 36.8822 14.7577 36.8822 19.2092H37.4822ZM30.9704 7.85155C30.4441 7.54216 29.7841 7.72178 29.4796 8.24775L29.9989 8.54834C30.1388 8.30665 30.4309 8.23039 30.6664 8.3688L30.9704 7.85155ZM29.4796 8.24775C29.1748 8.77435 29.3499 9.43675 29.8729 9.74419L30.1769 9.22694C29.9382 9.08657 29.8593 8.7894 29.9989 8.54834L29.4796 8.24775ZM29.8738 9.74471C33.2096 11.6901 35.2952 15.3019 35.2952 19.1932H35.8952C35.8952 15.0882 33.696 11.2792 30.176 9.22641L29.8738 9.74471ZM35.2952 19.1932C35.2952 25.203 30.4442 30.0883 24.4863 30.0883V30.6883C30.78 30.6883 35.8952 25.53 35.8952 19.1932H35.2952ZM24.4863 30.0883C18.5278 30.0883 13.6773 25.2184 13.6773 19.2092H13.0773C13.0773 25.5466 18.1932 30.6883 24.4863 30.6883V30.0883ZM13.6773 19.2092C13.6773 15.3633 15.6228 11.8935 18.8829 9.88491L18.5681 9.37408C15.1311 11.4917 13.0773 15.1547 13.0773 19.2092H13.6773ZM18.8775 9.88812C19.4119 9.57402 19.553 8.89063 19.2549 8.3757L18.7357 8.67628C18.8819 8.92901 18.8009 9.23718 18.5735 9.37087L18.8775 9.88812ZM19.2521 8.37088C18.9446 7.86184 18.2702 7.68867 17.7482 7.99549L18.0523 8.51273C18.2921 8.37175 18.6016 8.45446 18.7385 8.68109L19.2521 8.37088ZM17.7424 7.99901C13.8298 10.4204 11.4903 14.5949 11.4903 19.2092H12.0903C12.0903 14.8036 14.3215 10.8217 18.0581 8.50921L17.7424 7.99901ZM11.4903 19.2092C11.4903 22.1887 12.4977 24.9385 14.1697 27.1469L14.6481 26.7847C13.0508 24.675 12.0903 22.0512 12.0903 19.2092H11.4903ZM14.3945 26.6661C13.6971 26.6996 12.9008 26.8508 12.1491 27.2812L12.4473 27.8019C13.0921 27.4326 13.7876 27.296 14.4233 27.2655L14.3945 26.6661ZM12.1469 27.2825C10.6029 28.1842 10.4033 29.7607 11.0387 30.8584L11.558 30.5578C11.0826 29.7364 11.2004 28.5301 12.4495 27.8006L12.1469 27.2825ZM11.0364 30.8543C11.3621 31.4378 11.9061 31.8583 12.5582 32.0226L12.7047 31.4408C12.2141 31.3172 11.806 31.002 11.5603 30.5619L11.0364 30.8543ZM12.5446 32.0188C12.7449 32.0794 12.9695 32.0956 13.1869 32.0956V31.4956C12.9917 31.4956 12.8354 31.4799 12.7183 31.4445L12.5446 32.0188ZM13.1869 32.0956C13.6197 32.0956 14.1324 31.9862 14.6715 31.6707L14.3685 31.1529C13.9236 31.4132 13.5159 31.4956 13.1869 31.4956V32.0956ZM14.671 31.671C15.7623 31.0352 16.3985 30.0127 16.7589 29.2535L16.2168 28.9962C15.8789 29.7083 15.309 30.6049 14.369 31.1526L14.671 31.671ZM16.297 29.3563C16.8359 29.8006 17.4211 30.1934 18.0347 30.5514L18.3371 30.0332C17.7446 29.6875 17.1873 29.3127 16.6787 28.8934L16.297 29.3563ZM18.0373 30.0317C17.1715 30.5256 16.1701 31.2778 15.4987 32.4281L16.0169 32.7305C16.6151 31.7057 17.5181 31.0186 18.3346 30.5529L18.0373 30.0317ZM15.4979 32.4295C14.8812 33.4998 14.9281 34.4128 15.0694 35.0004L15.6528 34.8601C15.5402 34.3921 15.4918 33.6419 16.0178 32.7291L15.4979 32.4295ZM15.0703 35.0041C15.2653 35.7723 15.7609 36.4114 16.4268 36.8176L16.7393 36.3054C16.1991 35.9759 15.806 35.4636 15.6519 34.8564L15.0703 35.0041ZM16.4323 36.8209C16.8928 37.0886 17.3895 37.2134 17.9003 37.2134V36.6134C17.4906 36.6134 17.0986 36.5142 16.7339 36.3022L16.4323 36.8209ZM17.9003 37.2134C18.1497 37.2134 18.4157 37.1777 18.6657 37.1057L18.4997 36.5291C18.3053 36.5851 18.0952 36.6134 17.9003 36.6134V37.2134ZM18.6622 37.1067C19.252 36.9446 20.0663 36.5169 20.6976 35.451L20.1813 35.1452C19.6382 36.0624 18.9608 36.4024 18.5032 36.5281L18.6622 37.1067ZM20.7 35.4468C21.472 34.0937 21.5502 32.5854 21.4686 31.5169L20.8703 31.5626C20.9475 32.5732 20.8669 33.9436 20.1789 35.1494L20.7 35.4468ZM21.0886 31.8287C21.6753 31.9929 22.2607 32.1074 22.8757 32.189L22.9546 31.5942C22.3636 31.5158 21.8063 31.4065 21.2503 31.2509L21.0886 31.8287ZM22.6684 31.721C21.9244 32.7968 21.0282 34.4572 21.0282 36.4176H21.6282C21.6282 34.6357 22.4459 33.0975 23.1619 32.0623L22.6684 31.721ZM21.0282 36.4176C21.0282 38.932 22.7632 40.3 24.5022 40.3V39.7C23.0989 39.7 21.6282 38.605 21.6282 36.4176H21.0282ZM24.5022 40.3C26.2411 40.3 27.9761 38.932 27.9761 36.4176H27.3762C27.3762 38.605 25.9054 39.7 24.5022 39.7V40.3ZM27.9761 36.4176C27.9761 34.4572 27.08 32.7968 26.3359 31.721L25.8424 32.0623C26.5584 33.0975 27.3762 34.6357 27.3762 36.4176H27.9761ZM26.1286 32.189C26.7437 32.1074 27.329 31.9929 27.9157 31.8287L27.754 31.2509C27.1981 31.4065 26.6408 31.5158 26.0497 31.5942L26.1286 32.189ZM27.5357 31.5169C27.4542 32.5854 27.5323 34.0937 28.3043 35.4468L28.8254 35.1494C28.1374 33.9436 28.0568 32.5732 28.134 31.5626L27.5357 31.5169ZM28.3049 35.4479C28.9195 36.5144 29.7182 36.9439 30.3104 37.1067L30.4694 36.5281C30.0142 36.403 29.3529 36.0649 28.8248 35.1483L28.3049 35.4479ZM30.312 37.1071C30.5728 37.1772 30.8212 37.2134 31.0882 37.2134V36.6134C30.8791 36.6134 30.6832 36.5856 30.4678 36.5277L30.312 37.1071ZM31.0882 37.2134C31.6053 37.2134 32.0984 37.0694 32.5485 36.8252L32.2623 36.2978C31.8871 36.5014 31.4915 36.6134 31.0882 36.6134V37.2134ZM32.5536 36.8223C33.2464 36.4285 33.7249 35.7832 33.9185 35.0025L33.3362 34.858C33.1807 35.4847 32.8022 35.9909 32.2571 36.3007L32.5536 36.8223ZM33.9191 35.0004C34.0604 34.4128 34.1072 33.4998 33.4906 32.4295L32.9707 32.7291C33.4967 33.6419 33.4483 34.3921 33.3357 34.8601L33.9191 35.0004ZM33.4914 32.4309C32.8352 31.2781 31.8319 30.5248 30.9491 30.0305L30.656 30.5541C31.4871 31.0194 32.3882 31.7055 32.9699 32.7277L33.4914 32.4309ZM30.9567 30.5497C31.5527 30.1926 32.1356 29.8011 32.6881 29.3591L32.3132 28.8906C31.7864 29.3121 31.2267 29.6884 30.6483 30.035L30.9567 30.5497ZM32.2296 29.2535C32.5886 30.0099 33.2253 31.0519 34.3205 31.6728L34.6164 31.1508C33.6803 30.6202 33.1109 29.7111 32.7716 28.9962L32.2296 29.2535ZM34.3197 31.6723C34.8374 31.9679 35.3326 32.0956 35.8174 32.0956V31.4956C35.4453 31.4956 35.0518 31.3995 34.6172 31.1513L34.3197 31.6723ZM35.8174 32.0956C36.7588 32.0956 37.5524 31.5665 37.9665 30.8408L37.4454 30.5435C37.1294 31.0972 36.5265 31.4956 35.8174 31.4956V32.0956ZM37.9656 30.8424C38.6019 29.7432 38.3843 28.1498 36.8393 27.2652L36.5412 27.7859C37.7894 28.5006 37.9209 29.722 37.4463 30.5418L37.9656 30.8424ZM36.4215 27.3922L36.4057 27.4242L36.9431 27.6909L36.959 27.6589L36.4215 27.3922ZM18.7984 34.3494C18.5845 34.7231 18.338 34.9248 18.0906 34.9928L18.2496 35.5714C18.7004 35.4475 19.057 35.1054 19.3191 34.6475L18.7984 34.3494ZM18.1008 34.9902C17.8994 35.0379 17.7116 35.0125 17.5477 34.9134L17.2372 35.4269C17.5494 35.6156 17.9011 35.6542 18.2393 35.574L18.1008 34.9902ZM17.5477 34.9134C17.3733 34.808 17.2465 34.6453 17.1885 34.4464L16.6125 34.6145C16.7131 34.9593 16.9355 35.2444 17.2372 35.4269L17.5477 34.9134ZM17.1924 34.4615C17.1359 34.2221 17.1854 33.9009 17.3989 33.528L16.8782 33.2299C16.6156 33.6886 16.5064 34.1671 16.6085 34.5994L17.1924 34.4615ZM17.3997 33.5265C17.9378 32.5738 18.958 31.9833 19.6848 31.6715L19.4484 31.1201C18.6835 31.4481 17.5136 32.105 16.8773 33.2314L17.3997 33.5265ZM19.2686 31.4306C19.3613 32.2239 19.3539 33.3941 18.8134 34.3509L19.3359 34.646C19.9698 33.5237 19.9624 32.199 19.8646 31.361L19.2686 31.4306ZM19.0746 34.1984H19.0588V34.7984H19.0746V34.1984ZM31.5896 33.528C31.8031 33.9009 31.8526 34.2221 31.796 34.4615L32.38 34.5994C32.4821 34.1671 32.3729 33.6886 32.1103 33.2299L31.5896 33.528ZM31.7958 34.4622C31.7529 34.6462 31.6349 34.8032 31.4481 34.9092L31.744 35.4311C32.0649 35.2492 32.2961 34.9584 32.3801 34.5986L31.7958 34.4622ZM31.4408 34.9134C31.2783 35.0117 31.0749 35.0384 30.8717 34.9902L30.7333 35.574C31.0697 35.6538 31.4377 35.6165 31.7512 35.4269L31.4408 34.9134ZM30.8855 34.9938C30.6526 34.9267 30.4048 34.7245 30.19 34.3494L29.6693 34.6475C29.9307 35.1041 30.286 35.4456 30.7195 35.5704L30.8855 34.9938ZM30.1909 34.3509C29.6504 33.3941 29.6431 32.2239 29.7357 31.4306L29.1397 31.361C29.0419 32.199 29.0345 33.5237 29.6685 34.646L30.1909 34.3509ZM29.3195 31.6715C30.0436 31.9821 31.0514 32.573 31.6063 33.5295L32.1253 33.2284C31.4741 32.1058 30.3236 31.4493 29.5559 31.1201L29.3195 31.6715ZM31.8658 33.0789H31.8499V33.6789H31.8658V33.0789ZM13.5735 29.7944C13.3456 29.9295 13.1874 29.9451 13.0803 29.9202L12.9444 30.5046C13.2499 30.5756 13.5678 30.4952 13.8795 30.3105L13.5735 29.7944ZM13.0803 29.9202C12.9974 29.9009 12.9575 29.8484 12.921 29.787L12.4054 30.0939C12.4641 30.1925 12.6147 30.4279 12.9444 30.5046L13.0803 29.9202ZM12.9223 29.7892C12.8802 29.7171 12.8676 29.6382 12.8945 29.5569C12.9223 29.4728 13.0067 29.344 13.2414 29.2089L12.942 28.6889C12.6212 28.8737 12.4121 29.1047 12.3248 29.3685C12.2367 29.635 12.2875 29.8919 12.4041 30.0917L12.9223 29.7892ZM13.2399 29.2097C13.7857 28.8995 14.4475 28.8494 15.0035 28.865L15.0203 28.2652C14.4337 28.2488 13.6355 28.2947 12.9434 28.6881L13.2399 29.2097ZM14.7432 28.4317C14.5013 28.9193 14.1213 29.4688 13.5732 29.7945L13.8797 30.3103C14.5695 29.9004 15.0148 29.2344 15.2807 28.6984L14.7432 28.4317ZM23.1993 36.4336C23.1993 34.8413 24.0993 33.405 24.723 32.6036L24.2495 32.2351C23.6037 33.065 22.5993 34.6353 22.5993 36.4336H23.1993ZM24.2495 32.6036C24.8736 33.4055 25.7733 34.8257 25.7733 36.4336H26.3733C26.3733 34.619 25.3685 33.0645 24.723 32.2351L24.2495 32.6036ZM25.7733 36.4336C25.7733 37.6757 25.0764 38.1847 24.4863 38.1847C23.8962 38.1847 23.1993 37.6757 23.1993 36.4336H22.5993C22.5993 37.9262 23.4894 38.7847 24.4863 38.7847C25.4832 38.7847 26.3733 37.9262 26.3733 36.4336H25.7733ZM36.0503 29.7892C36.0075 29.8626 35.9476 29.9099 35.8666 29.9264C35.7806 29.9439 35.6275 29.9351 35.3901 29.8052L35.1021 30.3316C35.4201 30.5056 35.7193 30.5687 35.9864 30.5143C36.2586 30.4588 36.4526 30.2902 36.5685 30.0917L36.0503 29.7892ZM35.3994 29.8105C34.8513 29.4848 34.4713 28.9353 34.2294 28.4477L33.6919 28.7144C33.9578 29.2504 34.4031 29.9164 35.0928 30.3263L35.3994 29.8105ZM33.9779 28.8806C34.5169 28.8495 35.1878 28.886 35.7276 29.2068L36.0342 28.691C35.3361 28.2762 34.5152 28.2486 33.9434 28.2816L33.9779 28.8806ZM35.7312 29.2089C35.9659 29.344 36.0503 29.4728 36.0781 29.5569C36.105 29.6382 36.0924 29.7171 36.0503 29.7892L36.5685 30.0917C36.6851 29.8919 36.7359 29.635 36.6478 29.3685C36.5605 29.1047 36.3514 28.8737 36.0306 28.6889L35.7312 29.2089Z\" fill=\"white\"\u002F\u003E\u003C\u002Fsvg\u003E`\r\n        },\r\n        {\r\n            title: `${WATCHES}`,\r\n            link: `${WATCHES_LINK}`,\r\n            icon: `\u003Csvg width=\"49\" height=\"48\" viewBox=\"0 0 49 48\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath d=\"M30.7263 10.2002H24.7988H18.8713L14.6856 14.3858L10.5 18.5715V24.499V30.4265L14.6856 34.6122L18.8713 38.7978H24.7988H30.7263L34.912 34.6122L39.0976 30.4265V24.499V18.5715L34.912 14.3858L30.7263 10.2002Z\" stroke=\"black\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\u002F\u003E\u003Cpath d=\"M35.1987 24.4977C35.1987 27.3575 34.0287 29.9573 32.1569 31.8551C30.285 33.7529 27.6853 34.8968 24.7995 34.8968C21.9138 34.8968 19.34 33.7269 17.4422 31.8551C15.5443 29.9832 14.4004 27.3835 14.4004 24.4977C14.4004 21.6119 15.5703 19.0382 17.4422 17.1403C19.314 15.2425 21.9138 14.0986 24.7995 14.0986C27.6853 14.0986 30.259 15.2685 32.1569 17.1403C34.0547 19.0122 35.1987 21.6119 35.1987 24.4977Z\" stroke=\"black\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\u002F\u003E\u003Cpath d=\"M24.7988 19.2487V24.5002L29.4525 28.0359\" stroke=\"black\" stroke-linecap=\"round\" stroke-linejoin=\"round\"\u002F\u003E\u003Cpath d=\"M11.7988 17.271L14.5286 5\" stroke=\"black\" stroke-miterlimit=\"10\" stroke-linecap=\"round\"\u002F\u003E\u003Cpath d=\"M37.7981 17.271L35.0684 5\" stroke=\"black\" stroke-miterlimit=\"10\" stroke-linecap=\"round\"\u002F\u003E\u003Cpath d=\"M11.7988 31.7286L14.5286 43.9996\" stroke=\"black\" stroke-miterlimit=\"10\" stroke-linecap=\"round\"\u002F\u003E\u003Cpath d=\"M37.7981 31.7286L35.0684 43.9996\" stroke=\"black\" stroke-miterlimit=\"10\" stroke-linecap=\"round\"\u002F\u003E\u003C\u002Fsvg\u003E`,\r\n        },\r\n        {\r\n            title: `${BAGS_AND_ACCESSORIES}`,\r\n            link: `${BAGS_AND_ACCESSORIES_LINK}`,\r\n            icon: `\u003Csvg width=\"49\" height=\"48\" viewBox=\"0 0 49 48\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M24.3548 4.00067C21.6629 4.00067 19.7759 4.90078 18.494 6.29546C17.2271 7.67391 16.5961 9.48663 16.3035 11.2446C16.0103 13.0068 16.0497 14.7583 16.1598 16.0617C16.1647 16.1199 16.1697 16.1772 16.1749 16.2336H11.0849C9.54192 16.2336 8.28036 17.3473 8.03547 18.8467L8.03545 18.8467L8.03477 18.8511L4.52414 41.6355L4.52384 41.6373C4.34733 42.7381 5.17267 43.7119 6.28281 43.7119H42.4273C43.5085 43.7119 44.3639 42.7151 44.1861 41.6361L44.1856 41.6329L40.7641 19.4273H40.7953L40.7005 18.8467C40.4551 17.3442 39.1652 16.2336 37.6511 16.2336H32.5348C32.5399 16.1772 32.545 16.1199 32.5499 16.0617C32.66 14.7583 32.6994 13.0068 32.4061 11.2446C32.1136 9.48663 31.4825 7.67391 30.2156 6.29546C28.9338 4.90078 27.0468 4.00067 24.3548 4.00067ZM31.4116 17.2336C31.3985 17.3257 31.3857 17.411 31.3735 17.489C31.3516 17.6295 31.3317 17.7463 31.3156 17.8363C31.3035 17.8457 31.2909 17.8556 31.2777 17.8659C31.1632 17.9562 31.0084 18.0845 30.8516 18.2341C30.6971 18.3816 30.5282 18.5616 30.3945 18.7561C30.2693 18.9382 30.1291 19.198 30.1291 19.4926C30.1291 19.6314 30.1612 19.7795 30.1954 19.9053C30.2319 20.0397 30.2818 20.1875 30.338 20.3382C30.4506 20.6402 30.5982 20.9801 30.7423 21.2945C30.8871 21.6103 31.0314 21.9071 31.1393 22.1246C31.1933 22.2335 31.2384 22.3228 31.2701 22.3851L31.307 22.4575L31.3169 22.4767L31.3196 22.4818L31.3203 22.4832L31.3205 22.4836L31.3205 22.4837L31.7646 22.254L31.3206 22.4838C31.4065 22.6498 31.5777 22.754 31.7646 22.754C31.9515 22.754 32.1227 22.6498 32.2086 22.4838L31.7646 22.254L32.2087 22.4837L32.2087 22.4836L32.2089 22.4832L32.2097 22.4818L32.2123 22.4767L32.2222 22.4575L32.2591 22.3851C32.2908 22.3228 32.3359 22.2335 32.3899 22.1246C32.4978 21.9071 32.6421 21.6103 32.7869 21.2945C32.931 20.9801 33.0786 20.6402 33.1912 20.3382C33.2474 20.1875 33.2973 20.0397 33.3339 19.9053C33.368 19.7795 33.4001 19.6314 33.4001 19.4926C33.4001 19.198 33.2599 18.9382 33.1347 18.7561C33.001 18.5616 32.8321 18.3816 32.6776 18.2341C32.5489 18.1112 32.4214 18.0027 32.3165 17.9179C32.3301 17.8389 32.3454 17.747 32.3615 17.6433C32.3804 17.5223 32.4007 17.3852 32.4213 17.2336H37.6511C38.5636 17.2336 39.3654 17.8367 39.6408 18.7033L39.687 19.0034L43.1982 41.7913L43.1982 41.7913L43.1992 41.7973C43.2772 42.2655 42.8941 42.7119 42.4273 42.7119H6.28281C5.79289 42.7119 5.43093 42.2933 5.51137 41.7948L5.51192 41.7913L9.0224 19.0079L9.02274 19.0057C9.19176 17.9771 10.0468 17.2336 11.0849 17.2336H16.2884C16.309 17.3852 16.3293 17.5223 16.3481 17.6433C16.3643 17.7468 16.3795 17.8386 16.3931 17.9176C16.2881 18.0025 16.1605 18.1111 16.0317 18.2341C15.8771 18.3816 15.7082 18.5616 15.5745 18.7561C15.4493 18.9382 15.3091 19.198 15.3091 19.4926C15.3091 19.6314 15.3412 19.7795 15.3754 19.9053C15.4119 20.0397 15.4619 20.1875 15.5181 20.3382C15.6307 20.6402 15.7783 20.9801 15.9224 21.2945C16.0671 21.6103 16.2115 21.9071 16.3194 22.1246C16.3734 22.2335 16.4185 22.3228 16.4501 22.3851L16.4871 22.4575L16.497 22.4767L16.4996 22.4818L16.5003 22.4832L16.5005 22.4836L16.5006 22.4837L16.9447 22.254L16.5006 22.4838C16.5865 22.6498 16.7578 22.754 16.9447 22.754C17.1315 22.754 17.3028 22.6498 17.3887 22.4838L16.9447 22.254L17.3887 22.4837L17.3888 22.4836L17.389 22.4832L17.3897 22.4818L17.3923 22.4767L17.4023 22.4575L17.4392 22.3851C17.4709 22.3228 17.5159 22.2335 17.57 22.1246C17.6779 21.9071 17.8222 21.6103 17.967 21.2945C18.1111 20.9801 18.2587 20.6402 18.3713 20.3382C18.4275 20.1875 18.4774 20.0397 18.5139 19.9053C18.5481 19.7795 18.5802 19.6314 18.5802 19.4926C18.5802 19.198 18.44 18.9382 18.3148 18.7561C18.1811 18.5616 18.0122 18.3816 17.8577 18.2341C17.7009 18.0845 17.5461 17.9562 17.4315 17.8659L17.3942 17.8367C17.3781 17.7466 17.3581 17.6297 17.3362 17.489C17.324 17.411 17.3112 17.3257 17.2981 17.2336H31.4116ZM31.5304 16.2336C31.5383 16.1504 31.5461 16.065 31.5535 15.9775C31.6596 14.7211 31.6944 13.0597 31.4197 11.4088C31.1443 9.75377 30.5651 8.15347 29.4794 6.97215C28.4086 5.80707 26.8006 5.00067 24.3548 5.00067C21.9091 5.00067 20.3011 5.80707 19.2303 6.97215C18.1446 8.15347 17.5654 9.75377 17.29 11.4088C17.0152 13.0597 17.0501 14.7211 17.1562 15.9775C17.1636 16.065 17.1713 16.1504 17.1793 16.2336H31.5304ZM16.9447 21.1214C16.982 21.0422 17.0199 20.9606 17.0579 20.8778C17.1977 20.5729 17.3339 20.2579 17.4343 19.9889C17.4845 19.8541 17.5233 19.7374 17.5489 19.6432C17.5616 19.5963 17.57 19.5589 17.575 19.5305C17.5786 19.5098 17.5797 19.4981 17.5801 19.4939L17.5795 19.4918C17.5765 19.4808 17.562 19.4263 17.4907 19.3226C17.4115 19.2073 17.2965 19.0809 17.1672 18.9574C17.0914 18.8851 17.0149 18.8178 16.9447 18.7588C16.8744 18.8178 16.7979 18.8851 16.7221 18.9574C16.5928 19.0809 16.4778 19.2073 16.3986 19.3226C16.3273 19.4263 16.3128 19.4808 16.3099 19.4918L16.3093 19.4939C16.3096 19.4981 16.3107 19.5098 16.3143 19.5305C16.3193 19.5589 16.3277 19.5963 16.3405 19.6432C16.3661 19.7374 16.4048 19.8541 16.4551 19.9889C16.5554 20.2579 16.6917 20.5729 16.8314 20.8778C16.8694 20.9606 16.9074 21.0422 16.9447 21.1214ZM31.8778 20.8778C31.8399 20.9606 31.8019 21.0422 31.7646 21.1214C31.7273 21.0422 31.6893 20.9606 31.6514 20.8778C31.5116 20.5729 31.3753 20.2579 31.275 19.9889C31.2248 19.8541 31.186 19.7374 31.1604 19.6432C31.1477 19.5963 31.1393 19.5589 31.1343 19.5305C31.1306 19.5098 31.1295 19.4981 31.1292 19.4939L31.1298 19.4918C31.1328 19.4808 31.1473 19.4263 31.2185 19.3226C31.2978 19.2073 31.4127 19.0809 31.5421 18.9574C31.6179 18.8851 31.6944 18.8178 31.7646 18.7588C31.8349 18.8178 31.9113 18.8851 31.9871 18.9574C32.1165 19.0809 32.2314 19.2073 32.3107 19.3226C32.382 19.4263 32.3965 19.4808 32.3994 19.4918L32.4 19.4939C32.3997 19.4981 32.3986 19.5098 32.3949 19.5305C32.3899 19.5589 32.3815 19.5963 32.3688 19.6432C32.3432 19.7374 32.3045 19.8541 32.2542 19.9889C32.1539 20.2579 32.0176 20.5729 31.8778 20.8778Z\" fill=\"black\"\u002F\u003E\u003C\u002Fsvg\u003E`,\r\n        },\r\n        {\r\n            title: `${FRAGRANCES}`,\r\n            link: `${FRAGRANCES_LINK}`,\r\n            icon: `\u003Csvg width=\"49\" height=\"48\" viewBox=\"0 0 49 48\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.1951 8C17.919 8 17.6951 8.22386 17.6951 8.5V11.66C17.6951 11.9361 17.919 12.16 18.1951 12.16H30.8269C31.1031 12.16 31.3269 11.9361 31.3269 11.66V8.5C31.3269 8.22386 31.1031 8 30.8269 8H18.1951ZM18.6951 11.16V9H30.3269V11.16H18.6951ZM9.50977 19.0602C9.50652 19.0601 9.50326 19.0601 9.5 19.0601C9.22386 19.0601 9 19.2839 9 19.5601C9 19.8232 9.00656 20.0847 9.01953 20.3446V35.5C9.01953 37.4359 10.5822 39 12.5176 39H36.502C38.4374 39 40 37.4359 40 35.5V19.5601C40 19.2839 39.7762 19.0601 39.5 19.0601H39.4805H28.2474C27.9712 19.0601 27.7474 19.2839 27.7474 19.5601C27.7474 19.8362 27.9712 20.0601 28.2474 20.0601H38.9721C38.7084 27.833 32.3212 34.06 24.4903 34.06C16.7464 34.06 10.4144 27.9707 10.0195 20.3188V20.0601H20.7722C21.0484 20.0601 21.2722 19.8362 21.2722 19.5601C21.2722 19.2839 21.0484 19.0601 20.7722 19.0601H9.51953C9.51627 19.0601 9.51301 19.0601 9.50977 19.0602ZM10.0195 25.099V35.5C10.0195 36.8842 11.1351 38 12.5176 38H36.502C37.8845 38 39 36.8842 39 35.5V24.9958C36.7981 30.8731 31.1301 35.06 24.4903 35.06C17.8893 35.06 12.2489 30.922 10.0195 25.099ZM20.2341 16.6C20.2341 16.3238 20.458 16.1 20.7341 16.1H28.2892C28.5653 16.1 28.7892 16.3238 28.7892 16.6C28.7892 16.8761 28.5653 17.1 28.2892 17.1H20.7341C20.458 17.1 20.2341 16.8761 20.2341 16.6Z\" fill=\"black\"\u002F\u003E\u003C\u002Fsvg\u003E`,\r\n        }\r\n    ];\r\n\r\n    function getSiteInfo() {\r\n        try {\r\n            const siteID = window.__CONFIG__.app.commerceAPI.parameters.siteId;\r\n            const accessToken = localStorage.getItem(`access_token_` + siteID);\r\n            const getSiteInfo = window.__CONFIG__.app.sites.find(site =\u003E site.id === siteID)[\"l10n\"];\r\n            const defaultLocale = getSiteInfo.defaultLocale;\r\n            const defaultCurrency = getSiteInfo.defaultCurrency;\r\n            const referrer = window.location.href;\r\n\r\n            return {\r\n                siteID,\r\n                accessToken,\r\n                defaultLocale,\r\n                defaultCurrency,\r\n                referrer\r\n            }\r\n\r\n        } catch (e) {\r\n            return null;\r\n        }\r\n    }\r\n\r\n    function getDisplayPrice(price, currency) {\r\n        const local = window.__CONFIG__.app.sites.find(site =\u003E site.id === getSiteInfo().siteID)[\"l10n\"];\r\n        return new Intl.NumberFormat(local.defaultLocale, {\r\n            style: \"currency\",\r\n            currency: currency\r\n        }).format(price);\r\n    }\r\n\r\n    function chunkArray(array, chunkSize) {\r\n        let chunks = [];\r\n        for (let i = 0; i \u003C array.length; i += chunkSize) {\r\n            chunks.push(array.slice(i, i + chunkSize));\r\n        }\r\n        return chunks;\r\n    }\r\n\r\n    function injectSwiper() {\r\n        return new Promise((resolve, reject) =\u003E {\r\n            if (window.Swiper) {\r\n                resolve(true);\r\n                return;\r\n            }\r\n\r\n            const swiperCSS = document.createElement(\"link\");\r\n            swiperCSS.rel = \"stylesheet\";\r\n            swiperCSS.href = \"https:\u002F\u002Funpkg.com\u002Fswiper\u002Fswiper-bundle.min.css\";\r\n            swiperCSS.onload = () =\u003E {\r\n                const script = document.createElement(\"script\");\r\n                script.src = \"https:\u002F\u002Funpkg.com\u002Fswiper@8\u002Fswiper-bundle.min.js\";\r\n                script.onload = () =\u003E resolve(true);\r\n                script.onerror = (e) =\u003E reject(e);\r\n                document.head.appendChild(script);\r\n            };\r\n            swiperCSS.onerror = (e) =\u003E reject(e);\r\n            document.head.appendChild(swiperCSS);\r\n        });\r\n    }\r\n\r\n    function initSwiper(selector) {\r\n        new Swiper(selector + \" .swiper\", {\r\n            loop: false,\r\n            slidesPerView: 1,\r\n            pagination: {\r\n                el: selector + \" .swiper-pagination\",\r\n                clickable: true,\r\n                renderBullet: function (index, className) {\r\n                    return `\r\n                    \u003Cbutton type=\"button\" class=\"pagination-button `+ className + `\" data-index=\"` + index + `\"\u003E\r\n                        \u003Csvg viewBox=\"0 0 24 24\" focusable=\"false\" class=\"chakra-icon dot-icon\" role=\"img\" aria-label=\"dot\"\u003E\r\n                            \u003Cuse role=\"presentation\" xlink:href=\"#dot\"\u003E\u003C\u002Fuse\u003E\r\n                        \u003C\u002Fsvg\u003E\r\n                        \u003Csvg viewBox=\"0 0 24 24\" focusable=\"false\" class=\"chakra-icon star-icon\" role=\"img\" aria-label=\"star\"\u003E\r\n                            \u003Cuse role=\"presentation\" xlink:href=\"#star\"\u003E\u003C\u002Fuse\u003E\r\n                        \u003C\u002Fsvg\u003E\r\n                        \u003Cspan class=\"visually-hidden\"\u003EGo to slide `+ index + 1 + `\u003C\u002Fspan\u003E\r\n                    \u003C\u002Fbutton\u003E\r\n                `;\r\n                }\r\n            },\r\n            navigation: {\r\n                nextEl: selector + \" .swiper-arrow--next\",\r\n                prevEl: selector + \" .swiper-arrow--prev\",\r\n            },\r\n        });\r\n    }\r\n\r\n    function getSearchResults(searchText) {\r\n        const { siteID, accessToken, defaultLocale, defaultCurrency, referrer } = getSiteInfo();\r\n        return fetch(`https:\u002F\u002Fwww.bulgari.com\u002Fmobify\u002Fproxy\u002Fapi\u002Fsearch\u002Fshopper-search\u002Fv1\u002Forganizations\u002Ff_ecom_bcsg_prd\u002Fsearch-suggestions?siteId=` + siteID + `&q=` + searchText + `&currency=` + defaultCurrency + `&locale=` + defaultLocale, {\r\n            \"headers\": {\r\n                \"authorization\": \"Bearer \" + accessToken\r\n            },\r\n            \"referrer\": referrer,\r\n            \"referrerPolicy\": \"strict-origin-when-cross-origin\",\r\n            \"body\": null,\r\n            \"method\": \"GET\",\r\n            \"mode\": \"cors\",\r\n            \"credentials\": \"include\"\r\n        }).then(response =\u003E response.json())\r\n            .then(data =\u003E {\r\n                return data;\r\n            })\r\n    }\r\n\r\n    function getDYProductData(sttragyId, maxProducts) {\r\n        return new Promise((resolve) =\u003E {\r\n            DYO.recommendationWidgetData(sttragyId, { maxProducts: maxProducts }, function (error, data) {\r\n                if (error) {\r\n                    resolve([]);\r\n                }\r\n                const requiredData = data.slots.map((el) =\u003E {\r\n                    return {\r\n                        sku: el.item.sku,\r\n                        title: el.item.name,\r\n                        price: el.item.price,\r\n                        image: el.item.image_url,\r\n                        secondaryImage: el.item.secondary_image_url,\r\n                        url: el.item.url,\r\n                        currency: el.item.currency,\r\n                        displayPrice: getDisplayPrice(el.item.price, el.item.currency)\r\n                    };\r\n                });\r\n                resolve(requiredData);\r\n            });\r\n        });\r\n    }\r\n\r\n    function getCarouselHTML(data, title, title2, active) {\r\n        const carousel = document.createElement('div');\r\n        carousel.classList.add('ab-carousel-single', 'slider-number-' + active);\r\n        carousel.setAttribute('data-carousel-number', active);\r\n        carousel.innerHTML = `\r\n        \u003Cdiv class=\"slider-header\"\u003E\r\n            \u003Cdiv class=\"slider-header__title-group\"\u003E\r\n                \u003Cbutton class=\"chakra-heading button-1 `+ (active === 1 ? 'active' : '') + `\"\u003E` + title + `\u003C\u002Fbutton\u003E\r\n                \u003Cbutton class=\"chakra-heading button-2 `+ (active === 2 ? 'active' : '') + `\"\u003E` + title2 + `\u003C\u002Fbutton\u003E\r\n            \u003C\u002Fdiv\u003E\r\n            \u003Cdiv class=\"custom_navigation\"\u003E\r\n                \u003Cbutton type=\"button\" class=\"chakra-button swiper-arrow--prev \" tabindex=\"0\" aria-label=\"Previous Slide\" aria-controls=\"swiper-wrapper-8b7bb5ec8ef92bba\" aria-disabled=\"false\"\u003E\r\n                    \u003Csvg viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" id=\"chevron-left\"\u003E \r\n                        \u003Cpath d=\"M15.2535 21.9851C15.0634 21.9851 14.8633 21.9152 14.7233 21.7653L6.65025 13.5714C5.78992 12.7021 5.78992 11.2832 6.65025 10.4138L14.7233 2.21995C15.0134 1.92017 15.4935 1.92017 15.7837 2.21995C16.0738 2.51972 16.0838 2.98937 15.7837 3.27915L7.71064 11.473C7.43054 11.7628 7.43054 12.2424 7.71064 12.5222L15.7837 20.7161C16.0738 21.0059 16.0738 21.4855 15.7837 21.7753C15.6336 21.9152 15.4435 21.9951 15.2535 21.9951V21.9851Z\" fill=\"currentColor\"\u003E\u003C\u002Fpath\u003E \r\n                    \u003C\u002Fsvg\u003E\r\n                \u003C\u002Fbutton\u003E\r\n                \u003Cbutton type=\"button\" class=\"chakra-button swiper-arrow--next  swiper-button-disabled\" tabindex=\"-1\" aria-label=\"Next Slide\" aria-controls=\"swiper-wrapper-8b7bb5ec8ef92bba\" aria-disabled=\"true\" disabled=\"\"\u003E\r\n                    \u003Csvg viewBox=\"0 0 24 24\" focusable=\"false\" class=\"chakra-icon css-ux6szs\" role=\"img\" aria-label=\"chevron-right\" aria-hidden=\"true\"\u003E\u003Cuse role=\"presentation\" xlink:href=\"#chevron-right\"\u003E\u003C\u002Fuse\u003E\u003C\u002Fsvg\u003E\r\n                \u003C\u002Fbutton\u003E\r\n            \u003C\u002Fdiv\u003E\r\n        \u003C\u002Fdiv\u003E                \r\n        \u003Cdiv class=\"swiper custom\"\u003E\r\n            \u003C!-- Additional required wrapper --\u003E\r\n            \u003Cdiv class=\"swiper-wrapper\"\u003E\r\n                \u003C!-- Slides --\u003E\r\n                ` + chunkArray(data, 4).map(chunk =\u003E ` \u003Cdiv class=\"swiper-slide\"\u003E\r\n                    \u003Cdiv class=\"product-wrapper\"\u003E\r\n                        ` + chunk.map(el =\u003E ` \u003Cdiv class=\"product-tile__wrapper css-0 slider-card\" style=\"display: block;\" data-prefetch=\"productWithPrimaryCategory\" data-sku=\"` + el.sku + `\"\u003E\r\n                            \u003Cdiv class=\"slider-card-details\"\u003E\r\n                                \u003Ca class=\"product-tile__image-wrapper product-tile__image-wrapper--main\" href=\"` + el.url + `\"\u003E\r\n                                    \u003Cdiv class=\"\"\u003E\r\n                                        \u003Cspan class=\"lazy lazy--loaded product-tile__image\" style=\"padding-bottom: 100%;\"\u003E\r\n                                            \u003Cimg alt=\"` + el.title + `` + el.sku + `\" class=\"lazy__image lazy__image--loaded\" role=\"img\" data-src=\"` + el.image + `\" src=\"` + el.image + `\"\u003E\r\n                                        \u003C\u002Fspan\u003E\r\n                                    \u003C\u002Fdiv\u003E                                            \r\n                                \u003C\u002Fa\u003E\r\n                                \u003Ca class=\"chakra-stack product-tile__details\" href=\"` + el.url + `\"\u003E\r\n                                    \u003Ch2 class=\"chakra-heading product-tile__title\"\u003E` + el.title + `\u003C\u002Fh2\u003E\r\n                                    \u003Cdiv class=\"css-0\"\u003E\r\n                                        \u003Cspan class=\"chakra-text product-tile__price\" data-testid=\"product-tile-price\" aria-label=\"current price ` + el.displayPrice + `\"\u003E` + el.displayPrice + `\u003C\u002Fspan\u003E\r\n                                    \u003C\u002Fdiv\u003E\r\n                                \u003C\u002Fa\u003E\r\n                            \u003C\u002Fdiv\u003E\r\n                        \u003C\u002Fdiv\u003E`).join(\"\") + `     \r\n                    \u003C\u002Fdiv\u003E       \r\n                \u003C\u002Fdiv\u003E `).join(\"\") + `\r\n            \u003C\u002Fdiv\u003E      \r\n        \u003C\u002Fdiv\u003E\r\n        \u003Cdiv class=\"swiper-pagination\"\u003E\u003C\u002Fdiv\u003E\r\n        `;\r\n\r\n        return carousel;\r\n    }\r\n\r\n    function getMultiCarouselHTML(data, data2, title, title2, customClass = \"\") {\r\n        const carousel = document.createElement('div');\r\n        carousel.classList.add('ab-carousel-multi', customClass);\r\n        carousel.insertAdjacentElement('afterbegin', getCarouselHTML(data, title, title2, 1));\r\n        carousel.insertAdjacentElement('beforeend', getCarouselHTML(data2, title, title2, 2));\r\n        return carousel;\r\n    }\r\n\r\n    function getSearchPanelHTML() {\r\n        let searchPanel = document.createElement('div');\r\n        searchPanel.classList.add('ab--search-Panel');\r\n        searchPanel.innerHTML = `\r\n            \u003Cdiv class=\"ab--search-Panel__search\"\u003E\r\n                \u003Ch2 class=\"ab--search-Panel__search-title\"\u003E${TITLE}\u003C\u002Fh2\u003E\r\n                \u003Cdiv class=\"ab--search-Panel__search-wrapper\"\u003E                        \r\n                    \u003Cdiv class=\"ab--search-Panel__search-input-wrapper\"\u003E\r\n                        \u003Cinput type=\"text\" placeholder=\"${SEARCH_PLACEHOLDER}\" class=\"ab--search-Panel__search-input\"\u003E\r\n                        \u003Cbutton class=\"ab--search-Panel__search-close hide\"\u003E\r\n                            \u003Csvg width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M18.3137 4.06754C18.6087 3.77672 19.0852 3.77841 19.3781 4.0713C19.671 4.3642 19.6693 4.83738 19.3744 5.1282L12.7914 11.6187L19.3745 18.1093C19.6694 18.4001 19.6711 18.8733 19.3782 19.1662C19.0853 19.4591 18.6088 19.4608 18.3138 19.17L11.7232 12.6719L5.13259 19.17C4.83763 19.4608 4.36108 19.4591 4.06819 19.1662C3.7753 18.8733 3.77697 18.4001 4.07193 18.1093L10.655 11.6187L4.07202 5.1282C3.77706 4.83738 3.77539 4.3642 4.06828 4.0713C4.36118 3.77841 4.83773 3.77672 5.13268 4.06754L11.7232 10.5655L18.3137 4.06754Z\" fill=\"black\"\u003E\u003C\u002Fpath\u003E\u003C\u002Fsvg\u003E\r\n                        \u003C\u002Fbutton\u003E\r\n                    \u003C\u002Fdiv\u003E\r\n                    \u003Cdiv class=\"ab--search-Panel__search-suggestion\"\u003E\u003C\u002Fdiv\u003E\r\n                \u003C\u002Fdiv\u003E\r\n                \u003C\u002Fdiv\u003E\r\n            \u003C\u002Fdiv\u003E\r\n            \u003Cdiv class=\"ab--search-Panel__search-by-category\"\u003E\r\n                \u003Ch2 class=\"ab--search-Panel__search-by-category-title\"\u003E${SEARCH_BY_CATEGORY_TITLE}\u003C\u002Fh2\u003E\r\n                \u003Cul class=\"ab--search-Panel__search-by-category-list\"\u003E\r\n                    `+ (searchByCategoryData.map((item) =\u003E {\r\n            return `\u003Cli class=\"ab--search-Panel__search-by-category-item\"\u003E\r\n                            \u003Ca href=\"`+ item.link + `\" class=\"ab--search-Panel__search-by-category-link\"\u003E\r\n                                \u003Cdiv class=\"ab--search-Panel__search-by-category-icon\"\u003E` + item.icon + `\u003C\u002Fdiv\u003E\r\n                                \u003Cspan class=\"ab--search-Panel__search-by-category-text\"\u003E`+ item.title + `\u003C\u002Fspan\u003E\r\n                            \u003C\u002Fa\u003E\r\n                        \u003C\u002Fli\u003E\r\n                    `}).join('')) + `\r\n                \u003C\u002Ful\u003E\r\n            \u003C\u002Fdiv\u003E            \r\n            \u003Cdiv class=\"ab--search-Panel__contact-us\"\u003E\r\n                \u003Ch2 class=\"ab--search-Panel__contact-us-title\"\u003E${CONTACT_US_TITLE}\u003C\u002Fh2\u003E\r\n                \u003Cp class=\"ab--search-Panel__contact-us-subtitle\"\u003E${CONTACT_US_SUBTITLE}\u003C\u002Fp\u003E\r\n                \u003Ca href=\"` + window.location.origin + '\u002F' + window.location.pathname.split('\u002F')[1] + '\u002F' + \"contact-us--info.html\" + `\" class=\"ab--search-Panel__contact-us-button\"\u003E${CONTACT_US_BUTTON}\u003C\u002Fa\u003E\r\n            \u003C\u002Fdiv\u003E\r\n            \u003Cdiv class=\"ab--search-Panel__sign-up\"\u003E\r\n                \u003Cdiv class=\"ab--search-Panel__sign-up-texts\"\u003E\r\n                    \u003Ch2 class=\"ab--search-Panel__sign-up-title\"\u003E${SIGN_UP_TITLE}\u003C\u002Fh2\u003E\r\n                    \u003Cp class=\"ab--search-Panel__sign-up-subtitle\"\u003E${SIGN_UP_SUBTITLE}\u003C\u002Fp\u003E\r\n                \u003C\u002Fdiv\u003E\r\n                \u003Ca href=\"` + window.location.origin + '\u002F' + window.location.pathname.split('\u002F')[1] + '\u002F' + \"newsletter\" + `\" class=\"ab--search-Panel__sign-up-button\"\u003E${SIGN_UP_BUTTON}\u003C\u002Fa\u003E\r\n            \u003C\u002Fdiv\u003E\r\n            \u003Cbutton class=\"ab--search-Panel__close\"\u003E\r\n                \u003Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" fill=\"none\" xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\"\u003E\u003Cpath fill-rule=\"evenodd\" clip-rule=\"evenodd\" d=\"M30.8766 7.13278C31.1716 6.84197 31.6481 6.84366 31.941 7.13655C32.2339 7.42944 32.2322 7.90263 31.9373 8.19344L20.6071 19.3645L31.9374 30.5357C32.2324 30.8265 32.2341 31.2997 31.9412 31.5926C31.6483 31.8855 31.1717 31.8872 30.8768 31.5964L19.5389 20.4177L8.20095 31.5964C7.90599 31.8872 7.42944 31.8855 7.13655 31.5926C6.84365 31.2997 6.84533 30.8265 7.14029 30.5357L18.4706 19.3645L7.14044 8.19344C6.84549 7.90263 6.84381 7.42944 7.13671 7.13655C7.4296 6.84366 7.90615 6.84197 8.2011 7.13278L19.5389 18.3113L30.8766 7.13278Z\" fill=\"black\"\u002F\u003E\u003C\u002Fsvg\u003E\r\n            \u003C\u002Fbutton\u003E            \r\n        `;\r\n\r\n        return searchPanel;\r\n    }\r\n\r\n    function getGridlHTML(data, title, buttonText, buttonLink, customClass = \"\") {\r\n        const grid = document.createElement('div');\r\n        grid.classList.add('ab-grid', customClass);\r\n        grid.innerHTML = `\r\n        \u003Cdiv class=\"ab-grid__header\"\u003E\r\n            \u003Ch2 class=\"ab-grid__title\"\u003E` + title + `\u003C\u002Fh2\u003E\r\n        \u003C\u002Fdiv\u003E\r\n        \u003Cdiv class=\"ab-grid__content\"\u003E\r\n            ` + (data.map((el) =\u003E {\r\n            return `\u003Cdiv class=\"ab-grid__item\"\u003E\r\n                \u003Ca href=\"` + el.url + `\" class=\"ab-grid__item-link\"\u003E\r\n                    \u003Cdiv class=\"ab-grid__item-image\"\u003E\r\n                        \u003Cimg src=\"` + el.image + `\" alt=\"` + el.title + `\"\u003E\r\n                    \u003C\u002Fdiv\u003E\r\n                    \u003Cdiv class=\"ab-grid__item-details\"\u003E\r\n                        \u003Ch3 class=\"ab-grid__item-title\"\u003E` + el.title + `\u003C\u002Fh3\u003E\r\n                        \u003Cp class=\"ab-grid__item-price\"\u003E` + el.displayPrice + `\u003C\u002Fp\u003E\r\n                    \u003C\u002Fdiv\u003E\r\n                \u003C\u002Fa\u003E\r\n            \u003C\u002Fdiv\u003E\r\n        `}).join('')) + `\u003C\u002Fdiv\u003E\r\n        \u003Cdiv class=\"ab-grid__footer\"\u003E\r\n            \u003Ca href=\"` + buttonLink + `\" class=\"ab-grid__button\"\u003E` + buttonText + `\u003C\u002Fa\u003E\r\n        \u003C\u002Fdiv\u003E\r\n        `;\r\n\r\n        return grid;\r\n    }\r\n\r\n    async function mainJs([body]) {\r\n        try {\r\n            \u002F\u002F if (body.querySelector('.ab--search-Panel')) return;\r\n            if (body.querySelector('.ab--search-Panel')) {\r\n                body.querySelector('.ab--search-Panel').remove();\r\n            }\r\n\r\n            const searchPanel = getSearchPanelHTML();\r\n\r\n            body.insertAdjacentElement('afterbegin', searchPanel);\r\n\r\n            if (document.querySelector('[role=\"navigation\"] button.chakra-button:not(.ab-listener)')) {\r\n                document.querySelector('[role=\"navigation\"] button.chakra-button').classList.add('ab-listener');\r\n                document.querySelector('[role=\"navigation\"] button.chakra-button').addEventListener('click', e =\u003E {\r\n                    document.querySelector('html').classList.add('ab-searchPanel-open');\r\n                });\r\n            }\r\n\r\n            const PanelColoseBtn = searchPanel.querySelector('.ab--search-Panel__close');\r\n            PanelColoseBtn.addEventListener('click', e =\u003E {\r\n                document.querySelector('html').classList.remove('ab-searchPanel-open');\r\n            });\r\n\r\n            const searchCloseBtn = searchPanel.querySelector('.ab--search-Panel__search-close');\r\n            const input = searchPanel.querySelector('.ab--search-Panel__search-input');\r\n            const searchSuggestion = searchPanel.querySelector('.ab--search-Panel__search-suggestion');\r\n            searchCloseBtn.addEventListener('click', e =\u003E {\r\n                input.value = '';\r\n                searchSuggestion.innerHTML = '';\r\n                searchCloseBtn.classList.add('hide');\r\n            });\r\n\r\n            input.addEventListener('input', e =\u003E {\r\n                if (e.target.value.length === 0) {\r\n                    searchCloseBtn.classList.add('hide');\r\n                } else {\r\n                    searchCloseBtn.classList.remove('hide');\r\n                }\r\n                if (e.target.value.length \u003C 3 || e.target.value.length \u003E 50) {\r\n                    searchSuggestion.innerHTML = '';\r\n                    return;\r\n                }\r\n                getSearchResults(e.target.value).then(data =\u003E {\r\n                    if (data && data.categorySuggestions && data.categorySuggestions.categories) {\r\n                        searchSuggestion.innerHTML = data.categorySuggestions.categories.map(item =\u003E {\r\n                            const url = window.location.origin + '\u002F' + window.location.pathname.split('\u002F')[1] + '\u002F' + \"category\" + '\u002F' + item.id;\r\n                            return `\u003Ca href=\"` + url + `\" class=\"ab--search-Panel__search-suggestion-item\"\u003E\r\n                            `+ (item.name ? `\u003Cp class=\"ab--search-Panel__search-suggestion-text first-line\"\u003E` + item.name + `\u003C\u002Fp\u003E` : '') + `\r\n                            `+ (item.parentCategoryName ? ` \u003Cp class=\"ab--search-Panel__search-suggestion-text second-line\"\u003E` + item.parentCategoryName + `\u003C\u002Fp\u003E` : '') + `\r\n                        \u003C\u002Fa\u003E`\r\n                        }).join('');\r\n                    }\r\n                });\r\n            });\r\n\r\n            \u002F\u002F if user click enter on search input then rederect to \u002Fsearch?q= value\r\n            input.addEventListener('keypress', e =\u003E {\r\n                if (e.key === 'Enter') {\r\n                    const targetUrl = window.location.origin + '\u002F' + window.location.pathname.split('\u002F')[1] + '\u002F' + \"search?q=\" + e.target.value;\r\n                    window.history.pushState({}, \"\", targetUrl);\r\n                    window.dispatchEvent(new PopStateEvent(\"popstate\"));\r\n                    setTimeout(() =\u003E {\r\n                        document.querySelector('html').classList.remove('ab-searchPanel-open');\r\n                    }, 500);\r\n                }\r\n            });\r\n\r\n            if (`${RECOMMENDATION__DISPLAY_TYPE}` === 'carousel' || `${RECOMMENDATION__DISPLAY_TYPE}` === 'both') {\r\n                const carouselProductData = await getDYProductData(`${STRATEGY_ID_CAROUSEL_1}`, 8,);\r\n                if (!carouselProductData) {\r\n                    console.error(\"Error loading DY Product Data\");\r\n                    return;\r\n                }\r\n\r\n                const secondCarouselProductData = await getDYProductData(`${STRATEGY_ID_CAROUSEL_2}`, 8,);\r\n                if (!secondCarouselProductData) {\r\n                    console.error(\"Error loading DY Product Data\");\r\n                    return;\r\n                }\r\n\r\n                const carousel = getMultiCarouselHTML(carouselProductData, secondCarouselProductData, `${YOU_MAY_ALSO_LIKE}`, `${RECENTLY_VIEWED}`, \"ab--search-Panel__ab--carousel\");\r\n\r\n                const result = await injectSwiper();\r\n                if (!result) {\r\n                    console.error(\"Error loading Swiper\");\r\n                    return;\r\n                }\r\n\r\n                searchPanel.querySelector('.ab--search-Panel__search-by-category').insertAdjacentElement(\"afterend\", carousel);\r\n\r\n                initSwiper(\".ab--search-Panel__ab--carousel \u003E .ab-carousel-single:nth-child(1)\");\r\n                initSwiper(\".ab--search-Panel__ab--carousel \u003E .ab-carousel-single:nth-child(2)\");\r\n\r\n                const sliders = searchPanel.querySelectorAll('.ab-carousel-multi .ab-carousel-single .chakra-heading');\r\n                sliders.forEach((slider) =\u003E {\r\n                    slider.addEventListener('click', (e) =\u003E {\r\n                        const sliderNumber = e.target.classList.contains('button-1') ? 1 : 2;\r\n                        searchPanel.querySelector('.ab--search-Panel__ab--carousel').classList.remove('slider-number-1', 'slider-number-2');\r\n                        searchPanel.querySelector('.ab--search-Panel__ab--carousel').classList.add('slider-number-' + sliderNumber);\r\n                    });\r\n                });\r\n            }\r\n            \u002F\u002F Carousel Section End\r\n\r\n            if (`${RECOMMENDATION__DISPLAY_TYPE}` === 'grid' || `${RECOMMENDATION__DISPLAY_TYPE}` === 'both') {\r\n                \u002F\u002F Grid Product Section Start\r\n                const gridProductData = await getDYProductData(`${STRATEGY_ID_FOR_GRID}`, 8);\r\n                if (!gridProductData) {\r\n                    console.error(\"Error loading DY Product Data\");\r\n                    return;\r\n                }\r\n\r\n                const gridProduct = getGridlHTML(gridProductData, `${RECOMMENDATION_TITLE}`, `${RECOMMENDATION_BUTTON_TEXT}`, `${RECOMMENDATION_BUTTON_LINK}`, \"ab--search-Panel__suggest-for-you\");\r\n\r\n                searchPanel.querySelector('.ab--search-Panel__search-by-category').insertAdjacentElement(\"afterend\", gridProduct);\r\n                \u002F\u002F Grid Product Section End\r\n            }\r\n\r\n            \u002F\u002F Make all the URL redirection withouot refreshing the page\r\n            searchPanel.querySelectorAll('a').forEach((el) =\u003E {\r\n                el.addEventListener('click', (e) =\u003E {\r\n                    e.preventDefault();\r\n                    const targetUrl = e.target.closest('a').href;\r\n                    window.history.pushState({}, \"\", targetUrl);\r\n                    window.dispatchEvent(new PopStateEvent(\"popstate\"));\r\n                    setTimeout(() =\u003E {\r\n                        document.querySelector('html').classList.remove('ab-searchPanel-open');\r\n                    }, 500);\r\n                });\r\n            });\r\n\r\n            \u002F\u002F Add button to open search panel\r\n            if (!document.querySelector('[role=\"navigation\"] \u003E button:first-child')) {\r\n                const button = document.createElement('button');\r\n                button.classList.add('ab-searchPanel-button');\r\n                button.innerHTML = `\u003Csvg viewBox=\"0 0 24 24\" focusable=\"false\" class=\"chakra-icon css-1x8eu64\" role=\"img\" aria-label=\"search\" aria-hidden=\"true\"\u003E\u003Cuse role=\"presentation\" xlink:href=\"#search\"\u003E\u003C\u002Fuse\u003E\u003C\u002Fsvg\u003E`;\r\n                button.addEventListener('click', e =\u003E {\r\n                    waitForElem('.ab--search-Panel', ([searchPanel]) =\u003E {\r\n                        searchPanel.scrollTo({ top: 0, behavior: \"auto\" });\r\n                    });\r\n                    waitForElem('.ab--search-Panel__search-input', ([input]) =\u003E {\r\n                        input.value = '';\r\n                    });\r\n                    document.querySelector('html').classList.add('ab-searchPanel-open');\r\n                });\r\n                document.querySelector('[role=\"navigation\"]').insertAdjacentElement('afterbegin', button);\r\n            }\r\n        } catch (error) {\r\n            console.error(\"Error loading Swiper:\", error);\r\n        }\r\n\r\n\r\n        console.log('%cBVLGARI   SEARCH TEST RELAUNCH: v-01', 'background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px');\r\n        console.log('BVLGARI   SEARCH TEST RELAUNCH: v-01');\r\n    }\r\n\r\n    waitForElem('DYO', () =\u003E {\r\n        waitForElem('__CONFIG__', () =\u003E {\r\n            waitForElem('html[data-country]', () =\u003E {\r\n                waitForElem('body, [role=\"navigation\"]', mainJs, 2);\r\n            });\r\n        }, 1, true);\r\n    }, 1, true);\r\n\r\n    \u002F\u002Ftracking take label and cta_name\r\n    function trackEvent(label, area, cta_name) {\r\n        console.log(label, area, cta_name);\r\n        \u002F\u002F if (!cta_name) {\r\n        \u002F\u002F     track_event(label, `${dyExperienceId}`, { area })\r\n        \u002F\u002F } else {\r\n        \u002F\u002F     track_event(label, `${dyExperienceId}`, { area, cta_name })\r\n        \u002F\u002F }\r\n    }\r\n\r\n    if (!document.body.classList.contains('tracking-added')) {\r\n        document.body.classList.add('tracking-added');\r\n        document.body.addEventListener('click', (e) =\u003E {\r\n            if (e.target.closest('.ab--search-Panel__search-by-category-item')) {\r\n                const category_name = e.target.closest('.ab--search-Panel__search-by-category-item').querySelector('.ab--search-Panel__search-by-category-text').textContent.trim();\r\n                trackEvent(\"ab_click_category\", \"search\", category_name);\r\n            }\r\n\r\n            if (e.target.closest('.ab-searchPanel-button') || e.target.closest('[role=\"navigation\"] \u003E div:nth-child(1) button')) {\r\n                trackEvent(\"ab_display\", \"search\");\r\n            }\r\n\r\n            if (e.target.closest('.ab-grid__item a, .ab--search-Panel__ab--carousel .product-tile__image-wrapper, .ab--search-Panel__ab--carousel .product-tile__details')) {\r\n                let product_name = e.target.closest('.ab-grid__item') ? \"suggested_for_you\" : null;\r\n                product_name = product_name ? product_name : e.target.closest('[data-carousel-number=\"1\"]') ? \"YMAL\" : \"last_viewed\";\r\n                trackEvent(\"ab_click_product\", \"search\", product_name);\r\n            }\r\n        });\r\n\r\n        function trackPageView() {\r\n            if (window.location.href.includes('\u002Fsearch?q=')) {\r\n                trackEvent(\"ab_view_page\", \"search_results\");\r\n            }\r\n        }\r\n\r\n        window.addEventListener('popstate', trackPageView);\r\n        trackPageView();\r\n    }\r\n\r\n})();\n"
      },
      "websiteName": "bulgari",
      "testName": "BVLGARI   SEARCH TEST RELAUNCH",
      "touchPointName": null,
      "variationName": "v01"
    },
    {
      "hostnames": [
        "www.bulgari.com"
      ],
      "id": "1742245463878_5843_control",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
          "multiple_rules_check_by_condition": "OR",
          "rules": [],
          "_comments": {
            "EXAMPLE": [
              {
                "selector": "body",
                "is_matched": true,
                "waiting_time": 1000,
                "total_element_count": 1
              },
              {
                "selector": ".grid-plp",
                "is_matched": false,
                "waiting_time": 2000,
                "total_element_count": 1
              }
            ],
            "multiple_rules_check_by_condition": "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
            "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
            "selector": "Define the CSS selector for the element you want to check.",
            "is_matched": "Set to 'true' if the element should be present, 'false' if it should not be.",
            "waiting_time": "Time in milliseconds to wait for the element to appear.",
            "total_element_count": "Number of elements that should match the selector."
          }
        },
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
              "match_type": "REGEX_MATCHED"
            }
          ],
          "_comment": {
            "description": "Use 'targeting_rules' to define conditions for matching URLs.",
            "rules": [
              "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
              "Use 'EXACTLY_MATCHED' to match the exact URL.",
              "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
              "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
              "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
              "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
              "If multiple conditions are added, all will be checked against the target URLs.",
              "By default, your test will only run under the website's hostname unless specified otherwise."
            ],
            "example": {
              "multiple_rules_check_by_condition": "OR",
              "targeting_rules": [
                {
                  "value": "https:\u002F\u002Fwww.example.com",
                  "match_type": "EXACTLY_MATCHED"
                },
                {
                  "value": "example.com",
                  "match_type": "URL_CONTAINS"
                },
                {
                  "value": "blockedsite.com",
                  "match_type": "URL_DOES_NOT_CONTAIN"
                },
                {
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "Multi-touch",
      "variationFiles": {
        "css": "html {\n  position: relative;\n}\nhtml::before {\n  content: \"AB test pilot CSS\";\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 99999999999;\n  background: #ff0000;\n  color: #ffffff;\n  padding: 10px;\n  border: 7px solid #269b11;\n}",
        "js": "function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {\r\n    let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);\r\n    if (timer \u003C= 0) return;\r\n    (!isVariable && elements.length \u003E= minElements) || (isVariable && typeof window[waitFor] !== \"undefined\") ? callback(elements) : setTimeout(() =\u003E waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);\r\n}\r\n\r\n\r\nfunction mainJs([body]) {\r\n    console.log(\"selector body found and here is the element\", body);\r\n\r\n    console.log('%cname: v-01', 'background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px');\r\n    console.log('name: v-01');\r\n}\r\n\r\nwaitForElem('body', mainJs);\n"
      },
      "websiteName": "bulgari",
      "testName": "multi touch",
      "touchPointName": "t1",
      "variationName": "control"
    },
    {
      "hostnames": [
        "www.bulgari.com"
      ],
      "id": "1742245679829_372_patch",
      "targetingFiles": {
        "customJS": function activator(active) {
    // document.body.addEventListener('click', (e) => {
    //   active(true);
    // });
    return true;
},
        "elementChecker": {
          "multiple_rules_check_by_condition": "OR",
          "rules": [],
          "_comments": {
            "EXAMPLE": [
              {
                "selector": "body",
                "is_matched": true,
                "waiting_time": 1000,
                "total_element_count": 1
              },
              {
                "selector": ".grid-plp",
                "is_matched": false,
                "waiting_time": 2000,
                "total_element_count": 1
              }
            ],
            "multiple_rules_check_by_condition": "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
            "keep the array empty": "If you want to run the test on all pages, keep the array empty.",
            "selector": "Define the CSS selector for the element you want to check.",
            "is_matched": "Set to 'true' if the element should be present, 'false' if it should not be.",
            "waiting_time": "Time in milliseconds to wait for the element to appear.",
            "total_element_count": "Number of elements that should match the selector."
          }
        },
        "urlChecker": {
          "multiple_rules_check_by_condition": "OR",
          "targeting_rules": [
            {
              "value": "\u002Fhttps?:\\\u002F\\\u002F(www\\.)?[^\\s\u002F$.?#].[^\\s]*\u002Fgi",
              "match_type": "REGEX_MATCHED"
            }
          ],
          "_comment": {
            "description": "Use 'targeting_rules' to define conditions for matching URLs.",
            "rules": [
              "Use 'AND' to run the test only if all conditions are met. Use 'OR' to run the test if any condition is met.",
              "Use 'EXACTLY_MATCHED' to match the exact URL.",
              "Use 'URL_CONTAINS' to check if the URL contains a specific substring.",
              "Use 'URL_DOES_NOT_CONTAIN' to check if the URL does NOT contain a specific substring.",
              "Use 'REGEX_MATCHED' to apply a regex pattern for matching URLs.",
              "Use 'REGEX_DOES_NOT_MATCH' to apply a regex pattern that should NOT match URLs.",
              "If multiple conditions are added, all will be checked against the target URLs.",
              "By default, your test will only run under the website's hostname unless specified otherwise."
            ],
            "example": {
              "multiple_rules_check_by_condition": "OR",
              "targeting_rules": [
                {
                  "value": "https:\u002F\u002Fwww.example.com",
                  "match_type": "EXACTLY_MATCHED"
                },
                {
                  "value": "example.com",
                  "match_type": "URL_CONTAINS"
                },
                {
                  "value": "blockedsite.com",
                  "match_type": "URL_DOES_NOT_CONTAIN"
                },
                {
                  "value": "\u002Fexample\\.com\u002Fgi",
                  "match_type": "REGEX_MATCHED"
                },
                {
                  "value": "\u002Fforbidden\\.com\u002Fgi",
                  "match_type": "REGEX_DOES_NOT_MATCH"
                }
              ]
            }
          }
        }
      },
      "testType": "Patch",
      "variationFiles": {
        "css": "html {\n  position: relative;\n}\nhtml::before {\n  content: \"AB test pilot CSS\";\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 99999999999;\n  background: #ff0000;\n  color: #ffffff;\n  padding: 10px;\n  border: 7px solid #269b11;\n}",
        "js": "function waitForElem(waitFor, callback, minElements = 1, isVariable = false, timer = 10000, frequency = 25) {\r\n    let elements = isVariable ? window[waitFor] : document.querySelectorAll(waitFor);\r\n    if (timer \u003C= 0) return;\r\n    (!isVariable && elements.length \u003E= minElements) || (isVariable && typeof window[waitFor] !== \"undefined\") ? callback(elements) : setTimeout(() =\u003E waitForElem(waitFor, callback, minElements, isVariable, timer - frequency), frequency);\r\n}\r\n\r\n\r\nfunction mainJs([body]) {\r\n    console.log(\"selector body found and here is the element\", body);\r\n\r\n    console.log('%cname: v-01', 'background: black;border: 2px solid green;color: white;display: block;text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3);text-align: center;font-weight: bold;padding : 10px;margin : 10px');\r\n    console.log('name: v-01');\r\n}\r\n\r\nwaitForElem('body', mainJs);\n"
      },
      "websiteName": "bulgari",
      "testName": "patch test",
      "touchPointName": null,
      "variationName": "patch"
    }
  ],
  "targetMet": {
    "customJS": function checker(activator) {
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
},
    "elementChecker": function checker(rulesConfig) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const result = {
      status: true,
      messages: [],
      summary: '',
      time: 0,
      details: {
        conditionType: rulesConfig.multiple_rules_check_by_condition || 'OR',
        rulesEvaluated: [],
        totalTime: 0,
        totalChecks: 0
      }
    };

    if (!rulesConfig.rules || rulesConfig.rules.length === 0) {
      result.messages.push('No rules defined - running test on all pages');
      result.summary = 'No rules defined. Test will run on all pages.';
      result.time = Date.now() - startTime;
      resolve(result);
      return;
    }

    const ruleChecks = rulesConfig.rules.map((rule) => {
      return new Promise((ruleResolve) => {
        const ruleStartTime = Date.now();
        let intervalId;
        let timeoutId;
        let finalCheckDone = false;
        let checksPerformed = 0;

        const evaluateCondition = (finalCheck = false) => {
          checksPerformed++;
          const elements = document.querySelectorAll(rule.selector);
          const elementCount = elements.length;
          const countMatches = elementCount === rule.total_element_count;

          let pass = false;
          let message = '';

          if (rule.is_matched) {
            if (countMatches && !finalCheck) {
              // Immediate success for positive match
              pass = true;
              message = `Element found immediately: ${rule.selector} ` +
                `(Expected ${rule.total_element_count}, Found ${elementCount})`;
              clearTimeout(timeoutId);
              clearInterval(intervalId);
            } else if (finalCheck) {
              // Final check for positive match
              pass = countMatches;
              message = pass
                ? `Element found after full wait: ${rule.selector} ` +
                `(Expected ${rule.total_element_count}, Found ${elementCount})`
                : `Element not found after ${rule.waiting_time}ms: ${rule.selector} ` +
                `(Expected ${rule.total_element_count}, Found ${elementCount})`;
            }
          } else {
            if (countMatches && !finalCheck) {
              // Immediate failure for negative match
              pass = false;
              message = `Unwanted element found immediately: ${rule.selector} ` +
                `(Found ${elementCount} when expecting none)`;
              clearTimeout(timeoutId);
              clearInterval(intervalId);
            } else if (finalCheck) {
              // Final check for negative match
              pass = !countMatches;
              message = pass
                ? `No unwanted elements after ${rule.waiting_time}ms: ${rule.selector}`
                : `Unwanted elements persisted: ${rule.selector} ` +
                `(Found ${elementCount} when expecting none)`;
            }
          }

          if (message) {
            ruleResolve({
              ...rule,
              pass,
              time: Date.now() - ruleStartTime,
              checksPerformed,
              finalElementCount: elementCount,
              message
            });
            finalCheckDone = true;
          }
        };

        // Initial immediate check
        evaluateCondition();

        // Only set up interval if not already resolved
        if (!finalCheckDone) {
          intervalId = setInterval(evaluateCondition, 100);
          timeoutId = setTimeout(() => {
            clearInterval(intervalId);
            if (!finalCheckDone) evaluateCondition(true);
          }, rule.waiting_time);
        }
      });
    });

    Promise.allSettled(ruleChecks).then((results) => {
      const resolvedRules = results.map(r => r.value);

      result.details.rulesEvaluated = resolvedRules;
      result.details.totalTime = Date.now() - startTime;
      result.details.totalChecks = resolvedRules.reduce((sum, rule) => sum + rule.checksPerformed, 0);

      resolvedRules.forEach(rule => {
        result.messages.push(rule.message);
      });

      const passStatuses = resolvedRules.map(r => r.pass);
      result.status = result.details.conditionType === "AND"
        ? passStatuses.every(Boolean)
        : passStatuses.some(Boolean);

      const passedCount = passStatuses.filter(Boolean).length;
      result.summary = result.status
        ? `Passed - ${passedCount}/${resolvedRules.length} rules met`
        : `Failed - ${passedCount}/${resolvedRules.length} rules met`;

      result.time = result.details.totalTime;
      resolve(result);
    });
  });
},
    "urlChecker": function checker(rulesConfig) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const result = {
      status: true,
      messages: [],
      summary: "",
      time: 0,
      details: {
        currentURL: window.location.href,
        conditionType: null,
        rulesEvaluated: [],
      },
    };

    // Handle empty rules case
    if (
      !rulesConfig.targeting_rules ||
      rulesConfig.targeting_rules.length === 0
    ) {
      result.messages.push("No targeting rules defined. All URLs are allowed.");
      result.summary = "No targeting rules defined. All URLs are allowed.";
      result.time = Date.now() - startTime;
      resolve(result);
      return;
    }

    const currentURL = window.location.href;
    result.details.conditionType =
      rulesConfig.multiple_rules_check_by_condition || "OR";

    // Evaluate each rule
    result.details.rulesEvaluated = rulesConfig.targeting_rules.map((rule) => {
      const ruleResult = { rule, pass: false, message: "" };

      try {
        switch (rule.match_type) {
          case "EXACTLY_MATCHED":
            ruleResult.pass = currentURL === rule.value;
            ruleResult.message = ruleResult.pass
              ? `URL exactly matches '${rule.value}'`
              : `URL does not exactly match '${rule.value}' (current: ${currentURL})`;
            break;

          case "URL_CONTAINS":
            ruleResult.pass = currentURL.includes(rule.value);
            ruleResult.message = ruleResult.pass
              ? `URL contains '${rule.value}'`
              : `URL does not contain '${rule.value}'`;
            break;

          case "URL_DOES_NOT_CONTAIN":
            ruleResult.pass = !currentURL.includes(rule.value);
            ruleResult.message = ruleResult.pass
              ? `URL successfully excluded '${rule.value}'`
              : `URL contains excluded string '${rule.value}'`;
            break;

          case "REGEX_MATCHED": {
            const cleanedRegex = rule.value.replace(/^\/|\/[gimuy]*$/g, "");
            const regex = new RegExp(cleanedRegex, "gi");
            ruleResult.pass = regex.test(currentURL);
            ruleResult.message = ruleResult.pass
              ? `URL matched regex pattern ${rule.value}`
              : `URL failed to match regex pattern ${rule.value}`;
            break;
          }

          case "REGEX_DOES_NOT_MATCH": {
            const cleanedRegex = rule.value.replace(/^\/|\/[gimuy]*$/g, "");
            const regex = new RegExp(cleanedRegex, "gi");
            ruleResult.pass = !regex.test(currentURL);
            ruleResult.message = ruleResult.pass
              ? `URL correctly excluded by regex pattern ${rule.value}`
              : `URL matched excluded regex pattern ${rule.value}`;
            break;
          }

          default:
            ruleResult.message = `Unknown match type: ${rule.match_type}`;
        }
      } catch (error) {
        ruleResult.message = `Error evaluating rule: ${error.message}`;
      }

      result.messages.push(ruleResult.message);
      return ruleResult;
    });

    // Determine final status
    const passes = result.details.rulesEvaluated.map((r) => r.pass);
    result.status =
      result.details.conditionType === "AND"
        ? passes.every(Boolean)
        : passes.some(Boolean);

    // Generate summary
    const ruleCount = result.details.rulesEvaluated.length;
    const passedCount = passes.filter(Boolean).length;

    result.summary = result.status
      ? `Passed - ${passedCount}/${ruleCount} rules matched (${result.details.conditionType} condition)`
      : `Failed - Only ${passedCount}/${ruleCount} rules matched (required ${result.details.conditionType})`;

    // Add timing
    result.time = Date.now() - startTime;

    resolve(result);
  });
}
  }
}
        window.abTestPilotVariaTionInfo = {};
        window.abTestPilot = {};
        function abTestPilotFilterTestsByHostname(testInfo) {
            return testInfo.filter(item => {
                return item.hostnames.some(hostname => {
                    const hostnameWithoutSlash = hostname.endsWith("/") ? hostname.slice(0, -1) : hostname;
                    const originWithoutSlash = window.location.origin.endsWith("/") ? window.location.origin.slice(0, -1) : window.location.origin;
                    return hostnameWithoutSlash.includes(originWithoutSlash) || originWithoutSlash.includes(hostnameWithoutSlash);
                });
            });
        }

        function abTestPilotFilterTestsByParentTargeting(testInfo, parentTargeting) {
            const parentTargetingIDs = parentTargeting.map(item => item.variationIdList).flat();
            const testsWithParentTargeting = testInfo.filter(item => parentTargetingIDs.includes(item.id));
            const testsWithoutParentTargeting = testInfo.filter(item => !parentTargetingIDs.includes(item.id));
            return { testsWithParentTargeting, testsWithoutParentTargeting };
        }

        function abTestPilotGetApplicableParentTargeting(parentTargeting, testsWithParentTargeting) {
            return parentTargeting.filter(item => {
                return item.variationIdList.some(id => {
                    return testsWithParentTargeting.some(test => test.id === id);
                });
            });
        }

        async function abTestPilotTargetMet(targetMetFiles, targetingFiles) {
            const results = await Promise.all([
                targetMetFiles.customJS(targetingFiles.customJS),
                targetMetFiles.elementChecker(targetingFiles.elementChecker),
                targetMetFiles.urlChecker(targetingFiles.urlChecker)
            ]);
            return results;
        }

        function abTestPilotApplyTestVariation(test) {
            const style = document.createElement("style");
            style.innerHTML = test.variationFiles.css;
            style.type = "text/css";
            style.id = 'abTestPilot-' + test.id;
            document.head.appendChild(style);

            const script = document.createElement("script");
            script.innerHTML = test.variationFiles.js;
            script.type = "text/javascript";
            script.id = 'abTestPilot-' + test.id;
            document.head.appendChild(script);
        }

        async function abTestPilotProcessTests(tests, targetMet, parentTargetingData) {
            for (const test of tests) {
                const result = await abTestPilotTargetMet(targetMet, test.targetingFiles);
                const isParentTargeting = parentTargetingData.isParentTargeting;               

                abTestPilotVariaTionInfo[test.id] = {
                    status: result.every(item => item.status === true) ? "Active" : "Inactive",
                    message: result.every(item => item.status === true) ? "Targeting Met and Variation Applied" : "Targeting Not Met and Variation Not Applied",
                    targetingDetails: result,
                    id: test.id,
                    websiteName : test.websiteName,
                    testName : test.testName,
                    variationName : test.variationName,
                    testType : test.testType
                }
                if(test.touchPointName) {
                    abTestPilotVariaTionInfo[test.id].touchPointName = test.touchPointName;
                }
                if(isParentTargeting) {
                    const parentResult = parentTargetingData.result;
                    const parentResultData = parentTargetingData.resultData;
                    const parentTargetingInfo = parentTargetingData.info;
                    abTestPilotVariaTionInfo[test.id].status = parentResult ? result.every(item => item.status === true) ? "Active" : "Inactive" : "Inactive";
                    abTestPilotVariaTionInfo[test.id].parentTargetingDetails = parentResultData;
                    abTestPilotVariaTionInfo[test.id].result = {
                        touchPointTargeting: abTestPilotVariaTionInfo[test.id].status,
                        parentTargeting: parentResult ? "Active" : "Inactive"
                    }
                    abTestPilotVariaTionInfo[test.id].parentTargetingTestInfo = parentTargetingInfo;
                    abTestPilotVariaTionInfo[test.id].message = parentResult ? result.every(item => item.status === true) ? "Both of the Parent and touch point targeting met and Variation Applied" : "Parent Targeting Met but touch point targeting not met and Variation Not Applied" : result.every(item => item.status === true) ? "Touch point targeting met but Parent Targeting not met and Variation is not Applied" : "Both of the Parent and touch point targeting not met and Variation Not Applied";
                }
                // on abTestPilot pilot variation we have set the data in this way. if there is parent targeting then we will add a key on the object of that parent targeting id and inside that we will include the parent information and inside there we will keep the child test details and if there is no parent targeting then we will keep the test details directly on the object.
                
                abTestPilot = Object.entries(abTestPilotVariaTionInfo).reduce((acc, [key, value]) => {
                    if(value.parentTargetingTestInfo) {
                        if(!acc[value.parentTargetingTestInfo.parentTargetingId]) {
                            acc[value.parentTargetingTestInfo.parentTargetingId] = {
                                parentTargetingInfo: value.parentTargetingTestInfo,
                                tests: []
                            }
                        }
                        acc[value.parentTargetingTestInfo.parentTargetingId].tests.push(value);
                    }
                    else {
                        acc[key] = value;
                    }
                    return acc;
                }, {});
                if (abTestPilotVariaTionInfo[test.id].status === "Active") {
                    abTestPilotApplyTestVariation(test);
                }
            }
        }

        const abTestPilotApplicableTestsBasedOnTheWebsite = abTestPilotFilterTestsByHostname(abTestPilotMainInformation.testInfo);
        const { testsWithParentTargeting, testsWithoutParentTargeting } = abTestPilotFilterTestsByParentTargeting(abTestPilotApplicableTestsBasedOnTheWebsite, abTestPilotMainInformation.parentTargeting);
        const abTestPilotApplicableParentTargeting = abTestPilotGetApplicableParentTargeting(abTestPilotMainInformation.parentTargeting, testsWithParentTargeting);

        abTestPilotApplicableParentTargeting.forEach(item => {
            abTestPilotTargetMet(abTestPilotMainInformation.targetMet, item.targetingFiles).then(result => {                
                const applicableTests = abTestPilotMainInformation.testInfo.filter(test => item.variationIdList.includes(test.id));
                abTestPilotProcessTests(applicableTests, abTestPilotMainInformation.targetMet, {isParentTargeting: true, resultData: result, result: result.every(item => item.status === true), info: item});                
            });
        });

        abTestPilotProcessTests(testsWithoutParentTargeting, abTestPilotMainInformation.targetMet, {isParentTargeting: false});    

    })()