___TERMS_OF_SERVICE___

By creating or modifying this file you agree to Google Tag Manager's Community
Template Gallery Developer Terms of Service available at
https://developers.google.com/tag-manager/gallery-tos (or such other URL as
Google may provide), as modified from time to time.


___INFO___

{
  "type": "MACRO",
  "id": "cvt_temp_public_id",
  "version": 1,
  "securityGroups": [],
  "displayName": "GA4 - Item List \u0026 Promotion Attribution",
  "description": "Attribute GA4 Item List, Promotion or Search Term to revenue \u0026 ecommerce Events. This Template makes this possible by using ex. Local Storag as a \"helper\". Last \u0026 First Click Attribution supported.",
  "categories": [
  "ANALYTICS",
  "UTILITY",
  "TAG_MANAGEMENT"
  ],
  "containerContexts": [
    "WEB"
  ]
}


___TEMPLATE_PARAMETERS___

[
  {
    "type": "LABEL",
    "name": "introLabel",
    "displayName": "Extract \u0026 Attribute GA4 Item List \u0026 Promotion data, or merge Item List \u0026 Promotion Data from Second Data Source."
  },
  {
    "type": "GROUP",
    "name": "variableTypeGroup",
    "displayName": "Variable Type",
    "groupStyle": "NO_ZIPPY",
    "subParams": [
      {
        "type": "RADIO",
        "name": "variableType",
        "displayName": "Create Attribution or Return Attributed Output",
        "radioItems": [
          {
            "value": "attribution",
            "displayValue": "Extract Item List \u0026 Promotion for Attribution"
          },
          {
            "value": "output",
            "displayValue": "Return Attributed Output"
          }
        ],
        "simpleValueType": true
      },
      {
        "type": "GROUP",
        "name": "outputGroup",
        "displayName": "Output",
        "groupStyle": "NO_ZIPPY",
        "subParams": [
          {
            "type": "SELECT",
            "name": "outputDropDown",
            "displayName": "Parameter Output",
            "selectItems": [
              {
                "value": "items",
                "displayValue": "Items"
              },
              {
                "value": "promotion_name",
                "displayValue": "Promotion Name"
              },
              {
                "value": "promotion_id",
                "displayValue": "Promotion ID"
              },
              {
                "value": "creative_name",
                "displayValue": "Creative Name"
              },
              {
                "value": "creative_slot",
                "displayValue": "Creative Slot"
              },
              {
                "value": "location_id",
                "displayValue": "Location ID"
              },
              {
                "value": "search_term",
                "displayValue": "Search Term"
              }
            ],
            "simpleValueType": true,
            "valueValidators": [
              {
                "type": "NON_EMPTY"
              }
            ]
          },
          {
            "type": "CHECKBOX",
            "name": "removeNullfromItems",
            "checkboxText": "Remove null or empty values from Items",
            "simpleValueType": true,
            "help": "If items has null values (ex. \u003cstrong\u003eitem_category2: null\u003c/strong\u003e), these values can be reported as a \"null\" string in GA4. \u003cbr /\u003e\u003cbr /\u003e By ticking this box, \u003cstrong\u003enull\u003c/strong\u003e \u0026 \u003cstrong\u003eempty\u003c/strong\u003e values will be replaced with \u003cstrong\u003eundefined\u003c/strong\u003e, and discarded from being sent from GTM to GA4.",
            "enablingConditions": [
              {
                "paramName": "outputDropDown",
                "paramValue": "items",
                "type": "EQUALS"
              }
            ]
          }
        ],
        "enablingConditions": [
          {
            "paramName": "variableType",
            "paramValue": "output",
            "type": "EQUALS"
          }
        ]
      },
      {
        "type": "GROUP",
        "name": "secondDataSourceGroup",
        "displayName": "Second Data Source",
        "groupStyle": "NO_ZIPPY",
        "subParams": [
          {
            "type": "TEXT",
            "name": "secondDataSource",
            "displayName": "Second Data Source",
            "simpleValueType": true,
            "valueValidators": [
              {
                "type": "NON_EMPTY"
              }
            ],
            "alwaysInSummary": true,
            "help": "Insert  variable with Second Data Source (ex. Firestore) in this field"
          }
        ]
      },
      {
        "type": "LABEL",
        "name": "attributionLabel"
      },
      {
        "type": "GROUP",
        "name": "attributionGroup",
        "displayName": "Attribution",
        "groupStyle": "NO_ZIPPY",
        "subParams": [
          {
            "type": "TEXT",
            "name": "attributionTime",
            "displayName": "Attribution Time in Minutes",
            "simpleValueType": true,
            "help": "How many minutes should \u003cstrong\u003eItem Lists\u003c/strong\u003e or \u003cstrong\u003ePromotion\u003c/strong\u003e being credited to a conversion? \u003cbr /\u003e\u003cbr /\u003e Note that each \u003cstrong\u003eselect_item\u003c/strong\u003e, \u003cstrong\u003eselect_promotion\u003c/strong\u003e or \u003cstrong\u003eadd_to_cart\u003c/strong\u003e Event will renew the attribution time (if these Events contains Item List or Promotion data).",
            "valueValidators": [
              {
                "type": "NON_EMPTY"
              },
              {
                "type": "POSITIVE_NUMBER"
              }
            ],
            "valueHint": "30",
            "valueUnit": "minutes",
            "alwaysInSummary": true
          },
          {
            "type": "RADIO",
            "name": "attributionType",
            "displayName": "Attribution Type",
            "radioItems": [
              {
                "value": "lastClickAttribution",
                "displayValue": "Last Click Attribution"
              },
              {
                "value": "firstClickAttribution",
                "displayValue": "First Click Attribution"
              }
            ],
            "simpleValueType": true,
            "enablingConditions": [
              {
                "paramName": "variableType",
                "paramValue": "attribution",
                "type": "EQUALS"
              }
            ],
            "help": "\u003cstrong\u003eLast Click Attribution\u003c/strong\u003e \u003cbr /\u003e With Last Click Attribution, the Last Click on an Item List or a Promotion will be attributed. \u003cbr /\u003e\u003cbr /\u003e See \u003ca href\u003d\"https://github.com/gtm-templates-knowit-experience/sgtm-ga4-item-list-promo-attribution\" target\u003d\"_blank\"\u003e\u003cstrong\u003ethe documentation\u003c/strong\u003e\u003c/a\u003e for detailed explanation of attribution. \u003cbr /\u003e\u003cbr /\u003e \u003cstrong\u003eFirst Click Attribution\u003c/strong\u003e \u003cbr /\u003e With First Click Attribution, the First Click on an Item List or a Promotion will be attributed."
          },
          {
            "type": "GROUP",
            "name": "siteSearchGroup",
            "groupStyle": "NO_ZIPPY",
            "subParams": [
              {
                "type": "CHECKBOX",
                "name": "siteSearchChecbox",
                "checkboxText": "Attribute Site Search",
                "simpleValueType": true,
                "alwaysInSummary": true,
                "enablingConditions": [],
                "help": "Attribute the \u003cstrong\u003esearch_term\u003c/strong\u003e parameter."
              },
              {
                "type": "TEXT",
                "name": "searchTerm",
                "displayName": "Search Term",
                "simpleValueType": true,
                "valueValidators": [
                  {
                    "type": "NON_EMPTY"
                  }
                ],
                "enablingConditions": [
                  {
                    "paramName": "siteSearchChecbox",
                    "paramValue": true,
                    "type": "EQUALS"
                  }
                ],
                "valueHint": "{{search_term - Query}}",
                "alwaysInSummary": true
              }
            ],
            "enablingConditions": [
              {
                "paramName": "variableType",
                "paramValue": "attribution",
                "type": "EQUALS"
              }
            ],
            "displayName": "Site Search"
          }
        ]
      },
      {
        "type": "GROUP",
        "name": "otherSettingsGroup",
        "displayName": "Other Settings",
        "groupStyle": "ZIPPY_OPEN_ON_PARAM",
        "subParams": [
          {
            "type": "CHECKBOX",
            "name": "jsonData",
            "checkboxText": "Handle data as string",
            "simpleValueType": true,
            "help": "Tick this box, and data will be saved as a string using \u003cstrong\u003eJSON.stringify\u003c/strong\u003e, and read will be done using \u003cstrong\u003eJSON.parse\u003c/strong\u003e.  \u003cbr /\u003e\u003cbr /\u003e Choose this setting if you ex. are storing the data in Local Storage."
          },
          {
            "type": "GROUP",
            "name": "limitItemsGroup",
            "groupStyle": "NO_ZIPPY",
            "subParams": [
              {
                "type": "CHECKBOX",
                "name": "limitItems",
                "checkboxText": "Limit Items",
                "simpleValueType": true,
                "help": "Some storages can be limited in size. If you choose to store data in ex. a cookie, you should limit number of items stored."
              },
              {
                "type": "TEXT",
                "name": "limitItemsNumber",
                "displayName": "Number of Items",
                "simpleValueType": true,
                "valueHint": "2",
                "valueValidators": [
                  {
                    "type": "NON_EMPTY"
                  },
                  {
                    "type": "POSITIVE_NUMBER"
                  }
                ],
                "valueUnit": "item(s)",
                "enablingConditions": [
                  {
                    "paramName": "limitItems",
                    "paramValue": true,
                    "type": "EQUALS"
                  }
                ]
              }
            ]
          }
        ],
        "enablingConditions": [
          {
            "paramName": "variableType",
            "paramValue": "attribution",
            "type": "EQUALS"
          }
        ]
      }
    ]
  }
]


___SANDBOXED_JS_FOR_WEB_TEMPLATE___

const dataLayer = require('copyFromDataLayer');
const ecom = dataLayer('ecommerce', 1);
const getTimestampMillis = require('getTimestampMillis');
const makeInteger = require('makeInteger');
const JSON = require('JSON');

const jsonData = data.jsonData;
const secondDataSource = data.secondDataSource && typeof data.secondDataSource === 'string' ? JSON.parse(data.secondDataSource) : data.secondDataSource || undefined;

let items = ecom ? ecom.items : undefined;
let items2 = secondDataSource ? secondDataSource.items : [{item_id:"helper_id"}];
let promo2 = secondDataSource ? secondDataSource.promotion : undefined;
let searchTerm2 = secondDataSource ? secondDataSource.search_term : undefined;
const timestampDiff = secondDataSource ? getTimestampMillis()-secondDataSource.timestamp : 0;
const attributionTime = makeInteger(data.attributionTime)*60000;
const attributionType = data.attributionType;
const limitItemsNumber = data.limitItemsNumber;

if(timestampDiff > attributionTime) {
  items2 = undefined;
  promo2 = undefined;
  searchTerm2 = undefined;
}

if(data.variableType === 'attribution') {
  let item_list_id = ecom ? ecom.item_list_id : undefined;
  let item_list_name = ecom ? ecom.item_list_name : undefined;
  let creative_name = ecom ? ecom.creative_name : undefined;
  let creative_slot = ecom ? ecom.creative_slot : undefined;
  let promotion_id = ecom ? ecom.promotion_id : undefined;
  let promotion_name = ecom ? ecom.promotion_name : undefined;
  let location_id = ecom ? ecom.location_id : undefined;
  let index = ecom ? ecom.index : undefined;
  
  if (items) {
    const mapItemsData = i => {
      const itemObj = {
        item_id: i.item_id,
        item_list_id: i.item_list_id || item_list_id,
        item_list_name: i.item_list_name || item_list_name,
        creative_name: i.creative_name || creative_name,
        creative_slot: i.creative_slot || creative_slot,
        promotion_id: i.promotion_id || promotion_id,
        promotion_name: i.promotion_name || promotion_name,
        location_id: i.location_id || location_id,
        index: i.index || index
      };
      return itemObj;
    };
    
    const items1 = items.map(mapItemsData); 
    const item_id = items1[0].item_id ? items1[0].item_id : undefined;
    item_list_id = items1[0].item_list_id ? items1[0].item_list_id : undefined;
    item_list_name = items1[0].item_list_name ? items1[0].item_list_name : undefined;
    promotion_id = items1[0].promotion_id ? items1[0].promotion_id : promotion_id;
    promotion_name = items1[0].promotion_name ? items1[0].promotion_name : promotion_name;
    creative_name = items1[0].creative_name ? items1[0].creative_name : creative_name;
    creative_slot = items1[0].creative_slot ? items1[0].creative_slot : creative_slot;
    location_id = items1[0].location_id ? items1[0].location_id : location_id;

    if(items1 && item_id && (item_list_id || item_list_name || promotion_id || promotion_name)) {
      const itemAttribution = attributionType === 'firstClickAttribution' && items2 ? items2.concat(items1) : items1.concat(items2);
    let uniqueItems = [];
    itemAttribution.forEach(x => {
    let exists = false;
    for (let i = 0; i < uniqueItems.length; i++) {
      if (uniqueItems[i].item_id === x.item_id) {
        exists = true;
        break;
      }
    }
    if (!exists) {
      uniqueItems.push(x);
    }
  });
      if (limitItemsNumber) {
        uniqueItems = uniqueItems.slice(0, limitItemsNumber);
      }      
      let extract = {items:uniqueItems,promotion:promo2,search_term:searchTerm2,timestamp:getTimestampMillis()}; 
        extract = jsonData && extract ? JSON.stringify(extract) : extract;
          return extract ;    
    }
  }
  
  if (promotion_id||promotion_name) {
    const promo = {creative_name:creative_name, creative_slot:creative_slot, promotion_id:promotion_id, promotion_name:promotion_name, location_id:location_id};
    
    const promoAttribution = attributionType === 'firstClickAttribution' && promo2 ? promo2 : promo;
    let extract = {promotion:promoAttribution,items:items2,search_term:searchTerm2,timestamp:getTimestampMillis()};
      extract = jsonData && extract ? JSON.stringify(extract) : extract;
        return extract;
  }
  
  const searchTerm = data.searchTerm ? data.searchTerm : undefined;
  if (searchTerm) {
    const siteSearchttribution = attributionType === 'firstClickAttribution' && searchTerm2 ? searchTerm2: searchTerm;
    let extract = {search_term:searchTerm,items:items2,promotion:promo2,timestamp:getTimestampMillis()};
      extract = jsonData && extract ? JSON.stringify(extract) : extract;
        return extract;
  }
}
else if (data.variableType === 'output') {
  let output;
  const param = data.outputDropDown;
  if (param === 'promotion_id') {
    output = promo2 ? promo2.promotion_id : undefined;
  } else if (param === 'promotion_name') {
    output = promo2 ? promo2.promotion_name : undefined;
  } else if (param === 'creative_name') {
    output = promo2 ? promo2.creative_name : undefined;
  } else if (param === 'creative_slot') {
    output = promo2 ? promo2.creative_slot : undefined;
  } else if (param === 'location_id') {
    output = promo2 ? promo2.location_id : undefined;
  } else if (param === 'search_term') {
    output = searchTerm2 ? searchTerm2 : undefined;
  } else if (param === 'items' && items) {
    items.forEach(item => {
      items2.forEach(item2 => {
        if (item.item_id === item2.item_id) {
          item.item_list_id = item.item_list_id || item2.item_list_id || undefined;
          item.item_list_name = item.item_list_name || item2.item_list_name || undefined;
          item.creative_name = item.creative_name || item2.creative_name || undefined;
          item.creative_slot = item.creative_slot || item2.creative_slot || undefined;
          item.promotion_id = item.promotion_id || item2.promotion_id || undefined;
          item.promotion_name = item.promotion_name || item2.promotion_name || undefined;
          item.location_id = item.location_id || item2.location_id || undefined;
          item.index = item.index || item2.index || undefined;
        }
    });
  });
    output = items ? items : undefined;
      
    if(data.removeNullfromItems && output) {
      output.forEach(function(object){
        for(let key in object) {
          if(object[key] === null || object[key] === '' || object[key] === 'null' || object[key] === 'undefined')
            object[key] = undefined;
          }
      });    
    }
  }
  return output;
}


___WEB_PERMISSIONS___

[
  {
    "instance": {
      "key": {
        "publicId": "read_data_layer",
        "versionId": "1"
      },
      "param": [
        {
          "key": "keyPatterns",
          "value": {
            "type": 2,
            "listItem": [
              {
                "type": 1,
                "string": "ecommerce.*"
              }
            ]
          }
        }
      ]
    },
    "clientAnnotations": {
      "isEditedByUser": true
    },
    "isRequired": true
  }
]


___TESTS___

scenarios: []


___NOTES___

Created on 1/14/2023, 8:08:42 PM

