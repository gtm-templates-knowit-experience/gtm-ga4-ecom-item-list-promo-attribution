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
  "displayName": "GA4 Ecommerce - Item List \u0026 Promotion Attribution",
  "description": "GA4 doesn\u0027t Attribute Item List and Promotion to revenue or ecommerce Events. This Template makes this possible by using ex. Local Storag as a \"helper\". Last Click \u0026 First Click Attribution supported.",
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
    "displayName": "Extract GA4 Item List \u0026 Promotion data for Attribution, or merge Item List \u0026 Promotion from Second Data Source."
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
              }
            ],
            "simpleValueType": true,
            "valueValidators": [
              {
                "type": "NON_EMPTY"
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
            "help": "Tick this box, and data will be saved as a string using \u003cstrong\u003eJSON.stringify\u003c/strong\u003e, and read will be done using \u003cstrong\u003eJSON.parse\u003c/strong\u003e.  \u003cbr /\u003e\u003cbr /\u003e Choose this setting if you ex. are storing the data in a cookie."
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


let items2 = secondDataSource ? secondDataSource.items : [{item_id:"helper_id"}];
let promo2 = secondDataSource ? secondDataSource.promotion : undefined;
let items = ecom ? ecom.items : undefined;
const timestampDiff = secondDataSource ? getTimestampMillis()-secondDataSource.timestamp : 0;
const attributionTime = makeInteger(data.attributionTime)*60000;
const attributionType = data.attributionType;
const limitItemsNumber = data.limitItemsNumber;

if(timestampDiff > attributionTime) {
  items2 = [{item_id:"helper_id"}];
  promo2 = undefined;
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
        item_list_id: i.item_list_id ? i.item_list_id : item_list_id,
        item_list_name: i.item_list_name ? i.item_list_name : item_list_name,
        creative_name: i.creative_name ? i.creative_name : creative_name,
        creative_slot: i.creative_slot ? i.creative_slot : creative_slot,
        promotion_id: i.promotion_id ? i.promotion_id : promotion_id,
        promotion_name: i.promotion_name ? i.promotion_name : promotion_name,
        location_id: i.location_id ? i.location_id : location_id,
        index: i.index ? i.index: index
      };
      return itemObj;
    };
    
    let items1 = items ? items.map(mapItemsData) : {}; 
    const item_id = items1[0].item_id ? items1[0].item_id : undefined;
    item_list_id = items1[0].item_list_id ? items1[0].item_list_id : undefined;
    item_list_name = items1[0].item_list_name ? items1[0].item_list_name : undefined;

    if(items1 && item_id && (item_list_id||item_list_name||promotion_id||promotion_name)) {
      const itemAttribution = attributionType === 'firstClickAttribution' && items2 ? items2.concat(items1) : items1.concat(items2);
      let uniqueItems = [];
      itemAttribution.map(x => uniqueItems.filter(a => a.item_id == x.item_id).length > 0 ? null : uniqueItems.push(x));    
      uniqueItems = limitItemsNumber ? uniqueItems.splice(0, limitItemsNumber) : uniqueItems;
      
      let extract = {promotion:promo2,items:uniqueItems,timestamp:getTimestampMillis()}; 
        extract = jsonData && extract ? JSON.stringify(extract) : extract;
          return extract ;    
    } else {
      if (items1[0].creative_name) creative_name = items1[0].creative_name;
      if (items1[0].creative_slot) creative_slot = items1[0].creative_slot;
      if (items1[0].promotion_id) promotion_id = items1[0].promotion_id;
      if (items1[0].promotion_name) promotion_name = items1[0].promotion_name;
      if (items1[0].location_id) location_id = items1[0].location_id;
    }
  }
  
  if (promotion_id||promotion_name) {
    const promo = {creative_name:creative_name, creative_slot:creative_slot, promotion_id:promotion_id, promotion_name:promotion_name, location_id:location_id};
    
    const promoAttribution = attributionType === 'firstClickAttribution' && promo2 ? promo2 : promo;
    let extract = {items:items2,promotion:promoAttribution,timestamp:getTimestampMillis()};
      extract = jsonData && extract ? JSON.stringify(extract) : extract;
        return extract;
  }
}
else if (data.variableType === 'output') {
  let output;
  switch(data.outputDropDown) {
    case 'promotion_id':
      output = promo2 ? promo2.promotion_id : undefined;
      break;
    case 'promotion_name':
      output = promo2 ? promo2.promotion_name : undefined;
      break;
    case 'creative_name':
      output = promo2 ? promo2.creative_name : undefined;
      break;
    case 'creative_slot':
      output = promo2 ? promo2.creative_slot : undefined;
      break;
    case 'location_id':
      output = promo2 ? promo2.location_id : undefined;
      break;
    case 'items':
    for (let i = 0; i < items.length; i++) {
      for (let j = 0; j < items2.length; j++) {
        if (items[i].item_id == items2[j].item_id) {
        items[i].item_list_id = items[i].item_list_id ? items[i].item_list_id : items2[j].item_list_id || undefined;
        items[i].item_list_name = items[i].item_list_name ? items[i].item_list_name : items2[j].item_list_name || undefined;
        items[i].creative_name = items[i].creative_name ? items[i].creative_name : items2[j].creative_name || undefined;
        items[i].creative_slot = items[i].creative_slot ? items[i].creative_slot : items2[j].creative_slot || undefined;
        items[i].promotion_id = items[i].promotion_id ? items[i].promotion_id : items2[j].promotion_id || undefined;
        items[i].promotion_name = items[i].promotion_name ? items[i].promotion_name : items2[j].promotion_name || undefined;
        items[i].location_id = items[i].location_id ? items[i].location_id : items2[j].location_id || undefined;
        items[i].index = items[i].index ? items[i].index : items2[j].index || undefined;
        }
      }
    }
  output = items ? items : undefined;
  break;
  }
  return output;
}
return undefined;


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

Created on 10/30/2022, 8:37:16 PM


