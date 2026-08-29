const dataLayer = require('copyFromDataLayer');
const ecom = data.ecomVar && data.ecomInputCheckbox ? data.ecomVar : dataLayer('ecommerce', 1);
const getTimestampMillis = require('getTimestampMillis');
const makeInteger = require('makeInteger');
const makeString = require('makeString');
const JSON = require('JSON');
const Object = require('Object');
const readAnalyticsStorage = require('readAnalyticsStorage');
const analyticsStorageData = readAnalyticsStorage();

const jsonData = data.jsonData;
const secondDataSource = data.secondDataSource && typeof data.secondDataSource === 'string' ? JSON.parse(data.secondDataSource) : data.secondDataSource || undefined;

const event_name = dataLayer('event', 2);
const items = ecom ? ecom.items : undefined;
let items2 = secondDataSource ? secondDataSource.items : [{item_id:"helper_id"}];
let promo2 = secondDataSource ? secondDataSource.promotion : undefined;
let searchTerm2 = secondDataSource ? secondDataSource.search_term : undefined;
let customEvents2 = secondDataSource && secondDataSource.custom_events ? secondDataSource.custom_events : {};

const measurementId = data.measurementId;
let ga_session_id;

if (analyticsStorageData.sessions && analyticsStorageData.sessions.length) {
  for (let i = 0; i < analyticsStorageData.sessions.length; i++) {
    if (analyticsStorageData.sessions[i].measurement_id === measurementId) {
      ga_session_id = analyticsStorageData.sessions[i].session_id;
    }
  }
}

const timestamp = data.attributionTime ? getTimestampMillis() : ga_session_id;
const timestamp2 = secondDataSource ? secondDataSource.timestamp : timestamp;
const timestampDiff = secondDataSource && data.attributionTime ? timestamp-secondDataSource.timestamp : timestamp;
const attributionTime = data.attributionTime ? makeInteger(data.attributionTime)*60000 : timestamp2;
const attributionType = data.attributionType;
const limitItemsNumber = data.limitItemsNumber;

const customItemAttributeParameters = data.customItemAttributeParameters || [];
const customEventAttributeParameters = data.customEventAttributeParameters || [];

function hasValue(v) { return v !== undefined && v !== null && v !== ''; }
function isMissing(v) { return v === undefined || v === null || v === ''; }

if(timestampDiff > attributionTime) {
  items2 = [{item_id:"helper_id"}];
  promo2 = undefined;
  searchTerm2 = undefined;
  customEvents2 = {};
}

if(data.variableType === 'attribution') {

  if(data.deleteAttribution === true && event_name === 'purchase') {
    let extract = {search_term:undefined, custom_events: {}, items:[{item_id:"helper_id"}],promotion:undefined,timestamp:timestamp};
    extract = jsonData && extract ? JSON.stringify(extract) : extract;
    return extract;
  }

  let item_list_id = hasValue(ecom && ecom.item_list_id) ? ecom.item_list_id : undefined;
  let item_list_name = hasValue(ecom && ecom.item_list_name) ? ecom.item_list_name : undefined;
  let creative_name = hasValue(ecom && ecom.creative_name) ? ecom.creative_name : undefined;
  let creative_slot = hasValue(ecom && ecom.creative_slot) ? ecom.creative_slot : undefined;
  let promotion_id = hasValue(ecom && ecom.promotion_id) ? ecom.promotion_id : undefined;
  let promotion_name = hasValue(ecom && ecom.promotion_name) ? ecom.promotion_name : undefined;
  let location_id = hasValue(ecom && ecom.location_id) ? ecom.location_id : undefined;
  let index = hasValue(ecom && ecom.index) ? ecom.index : undefined;
  
  let currentCustomEvents = {};
  if (customEventAttributeParameters.length > 0) {
    customEventAttributeParameters.forEach(row => {
      const pName = row.parameterName;
      const pVal = row.parameterValue; // FIX: Reading from UI mapping variable
      if (hasValue(pVal)) {
        currentCustomEvents[pName] = pVal;
      }
    });
  }

  let mergedCustomEvents = {};
  const oldCeKeys = Object.keys(customEvents2 || {});
  oldCeKeys.forEach(k => { mergedCustomEvents[k] = customEvents2[k]; });
  
  const newCeKeys = Object.keys(currentCustomEvents || {});
  newCeKeys.forEach(k => {
    if (attributionType === 'firstClickAttribution') {
      if (isMissing(mergedCustomEvents[k])) {
        mergedCustomEvents[k] = currentCustomEvents[k];
      }
    } else {
      mergedCustomEvents[k] = currentCustomEvents[k];
    }
  });

 if (items) {
    const mapItemsData = i => {
      const itemObj = {
        item_id: i.item_id,
        item_list_id: hasValue(i.item_list_id) ? i.item_list_id : item_list_id,
        item_list_name: hasValue(i.item_list_name) ? i.item_list_name : item_list_name,
        creative_name: hasValue(i.creative_name) ? i.creative_name : creative_name,
        creative_slot: hasValue(i.creative_slot) ? i.creative_slot : creative_slot,
        promotion_id: hasValue(i.promotion_id) ? i.promotion_id : promotion_id,
        promotion_name: hasValue(i.promotion_name) ? i.promotion_name : promotion_name,
        location_id: hasValue(i.location_id) ? i.location_id : location_id,
        index: hasValue(i.index) ? i.index : index
      };
      
      if (customItemAttributeParameters.length > 0) {
        customItemAttributeParameters.forEach(row => {
          const p = row.parameterName;
          if (hasValue(i[p])) {
            itemObj[p] = i[p];
          }
        });
      }
      return itemObj;
    };
    
    const items1 = items.map(mapItemsData);
    const first = items1[0] || {};
   
    const item_id = first.item_id ? first.item_id : undefined;
    item_list_id = hasValue(first.item_list_id) ? first.item_list_id : undefined;
    item_list_name = hasValue(first.item_list_name) ? first.item_list_name : undefined;
    promotion_id = hasValue(first.promotion_id) ? first.promotion_id : promotion_id;
    promotion_name = hasValue(first.promotion_name) ? first.promotion_name : promotion_name;
    creative_name = hasValue(first.creative_name) ? first.creative_name : creative_name;
    creative_slot = hasValue(first.creative_slot) ? first.creative_slot : creative_slot;
    location_id = hasValue(first.location_id) ? first.location_id : location_id;

  if (items1 && item_id && (item_list_id || item_list_name || promotion_id || promotion_name)) {
    const firstClick = attributionType === 'firstClickAttribution';
    const combined = firstClick ? items2.concat(items1) : items1.concat(items2); 

    const mergedMap = {};
    for (let i = 0; i < items2.length; i++) {
      const oldRec = items2[i];
      const clone = {};
      const flds  = Object.keys(oldRec || {});
      for (let j = 0; j < flds.length; j++) {
        const k = flds[j];
        clone[k] = oldRec[k];
      }
      mergedMap[oldRec.item_id] = clone;
    }

    items1.forEach(rec1 => {
      const id = rec1.item_id;
      let tgt   = mergedMap[id];
      if (!tgt) {
        tgt = { item_id: id };
      }

      const isListEvent = hasValue(rec1.item_list_id) || hasValue(rec1.item_list_name);
      
      if (isListEvent) {
        if (attributionType === 'firstClickAttribution') {
          if (isMissing(tgt.item_list_id)) tgt.item_list_id = rec1.item_list_id;
          if (isMissing(tgt.item_list_name)) tgt.item_list_name = rec1.item_list_name;
        } else {
          tgt.item_list_id = rec1.item_list_id;
          tgt.item_list_name = rec1.item_list_name;
        }
      }

      const isPromoEvent = hasValue(rec1.promotion_id) || hasValue(rec1.promotion_name);
      
      if (isPromoEvent) {
        if (attributionType === 'firstClickAttribution') {
          if (isMissing(tgt.promotion_id)) tgt.promotion_id   = rec1.promotion_id;
          if (isMissing(tgt.promotion_name)) tgt.promotion_name = rec1.promotion_name;
          if (isMissing(tgt.creative_name)) tgt.creative_name  = rec1.creative_name;
          if (isMissing(tgt.creative_slot)) tgt.creative_slot  = rec1.creative_slot;
        } else {
          tgt.promotion_id   = rec1.promotion_id;
          tgt.promotion_name = rec1.promotion_name;
          tgt.creative_name  = rec1.creative_name;
          tgt.creative_slot  = rec1.creative_slot;
        }
      }
      
      if (hasValue(rec1.location_id)) {
        if (attributionType === 'firstClickAttribution' ? isMissing(tgt.location_id) : true) {
          tgt.location_id = rec1.location_id;
        }
      }
      if (hasValue(rec1.index)) {
        if (attributionType === 'firstClickAttribution' ? isMissing(tgt.index) : true) {
          tgt.index = rec1.index;
        }
      }
      
      if (customItemAttributeParameters.length > 0) {
        customItemAttributeParameters.forEach(row => {
          const p = row.parameterName;
          if (hasValue(rec1[p])) {
            if (attributionType === 'firstClickAttribution' ? isMissing(tgt[p]) : true) {
              tgt[p] = rec1[p];
            }
          }
        });
      }
      
      mergedMap[id] = tgt;
    });

    let uniqueItems = Object.keys(mergedMap || {}).map(function(k){ return mergedMap[k]; });
    if (limitItemsNumber) {
      uniqueItems = uniqueItems.slice(0, makeInteger(limitItemsNumber));
    }

    const extract = {
      items: uniqueItems,
      promotion: promo2,
      search_term: searchTerm2,
      custom_events: mergedCustomEvents,
      timestamp: timestamp
    };
    return jsonData ? JSON.stringify(extract) : extract;
  }
}
  
  if (promotion_id||promotion_name) {
    const promo = {creative_name: creative_name, creative_slot: creative_slot, promotion_id: promotion_id, promotion_name: promotion_name, location_id: location_id};
    
    const promoAttribution = attributionType === 'firstClickAttribution' && promo2 ? promo2 : promo;
    
    let extract = {items: items2, promotion: promoAttribution, search_term: searchTerm2, custom_events: mergedCustomEvents, timestamp: timestamp};
      extract = jsonData && extract ? JSON.stringify(extract) : extract;
        return extract;
  }
  
  const searchTerm = data.siteSearchChecbox && hasValue(data.searchTerm) ? data.searchTerm : undefined;
  if (searchTerm) {
    const siteSearchttribution = attributionType === 'firstClickAttribution' && searchTerm2 ? searchTerm2 : searchTerm;
    
    let extract = {search_term: siteSearchttribution, items: items2, promotion: promo2, custom_events: mergedCustomEvents, timestamp: timestamp};
      extract = jsonData && extract ? JSON.stringify(extract) : extract;
        return extract;
  }

  const hasNewCustomEvents = Object.keys(currentCustomEvents || {}).length > 0;
  if (hasNewCustomEvents) {
    let extract = {
      items: items2, 
      promotion: promo2, 
      search_term: searchTerm2, 
      custom_events: mergedCustomEvents, 
      timestamp: timestamp
    };
    return jsonData ? JSON.stringify(extract) : extract;
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
    
  } else if (param === 'custom_event') {
    const requestedKey = data.customEventOutputKey;
    output = (customEvents2 && requestedKey) ? customEvents2[requestedKey] : undefined;

  } else if (param === 'all_custom_events') {
    output = customEvents2 ? customEvents2 : undefined;
    
  } else if (param === 'items' && items) {
    items.forEach(item => {
      if(data.itemSearchTerm && searchTerm2 ) {
        item.search_term = searchTerm2;
      }
      
      if (data.itemCustomEvents) {
        const ceKeys = Object.keys(customEvents2 || {});
        if (ceKeys.length > 0) {
          ceKeys.forEach(k => {
            item[k] = item[k] || customEvents2[k] || undefined;
          });
        }
      }

      const standardKeys = ['item_id', 'item_list_id', 'item_list_name', 'creative_name', 'creative_slot', 'promotion_id', 'promotion_name', 'location_id', 'index'];
      
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
          
          const storedKeys = Object.keys(item2 || {});
          
          storedKeys.forEach(k => {
            if (standardKeys.indexOf(k) === -1) {
               item[k] = item[k] || item2[k] || undefined;
            }
          });
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