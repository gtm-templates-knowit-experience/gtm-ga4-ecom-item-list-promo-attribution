const dataLayer = require('copyFromDataLayer');
const ecom = (data.ecomVar && data.ecomInputCheckbox) ? data.ecomVar : dataLayer('ecommerce', 1);
const getTimestampMillis = require('getTimestampMillis');
const makeInteger = require('makeInteger');
const makeString = require('makeString');
const JSON = require('JSON');
const Object = require('Object');
const readAnalyticsStorage = require('readAnalyticsStorage');
const analyticsStorageData = readAnalyticsStorage();

const jsonData = data.jsonData;
const rawStored = data.secondDataSource;

let parsedSource = rawStored;
if (typeof rawStored === 'string') {
  parsedSource = JSON.parse(rawStored);
}
if (parsedSource && parsedSource.length !== undefined && parsedSource.length > 0) {
  parsedSource = parsedSource[0];
}
const secondDataSource = (parsedSource && typeof parsedSource === 'object') ? parsedSource : undefined;

const event_name = dataLayer('event', 2);
const items = ecom ? ecom.items : undefined;
let items2 = (secondDataSource && secondDataSource.items && secondDataSource.items.length !== undefined) ? secondDataSource.items : [{item_id: "helper_id"}];
let promo2 = secondDataSource ? secondDataSource.promotion : undefined;
let searchTerm2 = secondDataSource ? secondDataSource.search_term : undefined;
let customEvents2 = (secondDataSource && secondDataSource.custom_events && typeof secondDataSource.custom_events === 'object') ? secondDataSource.custom_events : {};

const measurementId = data.measurementId;
let ga_session_id;

if (analyticsStorageData && analyticsStorageData.sessions && analyticsStorageData.sessions.length) {
  for (let i = 0; i < analyticsStorageData.sessions.length; i++) {
    if (analyticsStorageData.sessions[i].measurement_id === measurementId) {
      ga_session_id = analyticsStorageData.sessions[i].session_id;
    }
  }
}

const timestamp = data.attributionTime ? getTimestampMillis() : ga_session_id;
const timestamp2 = (secondDataSource && secondDataSource.timestamp) ? secondDataSource.timestamp : timestamp;
const timestampDiff = (secondDataSource && secondDataSource.timestamp && data.attributionTime) ? (timestamp - secondDataSource.timestamp) : timestamp;
const attributionTime = data.attributionTime ? (makeInteger(data.attributionTime) * 60000) : timestamp2;
const attributionType = data.attributionType;
const limitItemsNumber = data.limitItemsNumber;

const customItemAttributeParameters = data.customItemAttributeParameters || [];
const customEventAttributeParameters = data.customEventAttributeParameters || [];

function hasValue(v) { return v !== undefined && v !== null && v !== ''; }
function isMissing(v) { return v === undefined || v === null || v === ''; }

function currentOrStored(current, stored) {
  if (hasValue(current)) return current;
  if (hasValue(stored)) return stored;
  return undefined;
}

if (timestampDiff > attributionTime) {
  items2 = [{item_id: "helper_id"}];
  promo2 = undefined;
  searchTerm2 = undefined;
  customEvents2 = {};
}

// ==========================================
// ATTRIBUTION
// ==========================================
if (data.variableType === 'attribution') {

  // 1. Purchase Reset
  if (data.deleteAttribution === true && event_name === 'purchase') {
    let resetExtract = {
      search_term: undefined,
      custom_events: {},
      items: [{item_id: "helper_id"}],
      promotion: undefined,
      timestamp: timestamp
    };
    return jsonData ? JSON.stringify(resetExtract) : resetExtract;
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
      const pVal = row.parameterValue;
      if (hasValue(pName) && hasValue(pVal)) {
        currentCustomEvents[pName] = pVal;
      }
    });
  }

  let mergedCustomEvents = {};
  const oldCeKeys = Object.keys(customEvents2 || {});
  oldCeKeys.forEach(k => {
    mergedCustomEvents[k] = customEvents2[k];
  });

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

  let items1 = [];

  // Filter incoming items: only items carrying active attribution parameters are retained
  if (items && items.length > 0) {
    for (let idx = 0; idx < items.length; idx++) {
      let i = items[idx];
      let itemObj = {
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

      let itemHasAttribution = false;
      if (hasValue(itemObj.item_id) && (
          hasValue(itemObj.item_list_id) || hasValue(itemObj.item_list_name) ||
          hasValue(itemObj.promotion_id) || hasValue(itemObj.promotion_name) ||
          hasValue(itemObj.creative_name) || hasValue(itemObj.creative_slot) ||
          hasValue(itemObj.location_id) || hasValue(itemObj.index))) {
        itemHasAttribution = true;
      }

      if (customItemAttributeParameters.length > 0) {
        for (let j = 0; j < customItemAttributeParameters.length; j++) {
          let p = customItemAttributeParameters[j].parameterName;
          if (hasValue(p) && hasValue(i[p])) {
            itemObj[p] = i[p];
            if (hasValue(itemObj.item_id)) {
              itemHasAttribution = true;
            }
          }
        }
      }

      if (itemHasAttribution) {
        items1.push(itemObj);
      }
    }
  }

  // 2. Item-level attribution branch
  if (items1.length > 0) {
    const mergedMap = {};
    let orderedKeys = [];
    const seenKeys = {};

    for (let i = 0; i < items2.length; i++) {
      const oldRec = items2[i];
      if (!oldRec || oldRec.item_id === 'helper_id' || !hasValue(oldRec.item_id)) continue;

      const idKey = 'item_' + oldRec.item_id;
      if (!seenKeys[idKey]) {
        seenKeys[idKey] = true;
        orderedKeys.push(idKey);
      }

      const clone = {};
      const flds = Object.keys(oldRec);
      for (let j = 0; j < flds.length; j++) {
        const k = flds[j];
        clone[k] = oldRec[k];
      }
      mergedMap[idKey] = clone;
    }

    items1.forEach(rec1 => {
      const id = rec1.item_id;
      if (!hasValue(id) || id === 'helper_id') return;
      const idKey = 'item_' + id;

      let tgt = mergedMap[idKey];
      if (!tgt) {
        tgt = { item_id: id };
        orderedKeys.push(idKey);
      } else if (attributionType !== 'firstClickAttribution') {
        const filteredKeys = [];
        for (let k = 0; k < orderedKeys.length; k++) {
          if (orderedKeys[k] !== idKey) {
            filteredKeys.push(orderedKeys[k]);
          }
        }
        filteredKeys.push(idKey);
        orderedKeys = filteredKeys;
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

      // Decoupled promotion identity vs creative appearance
      const hasPromoIdentity = hasValue(rec1.promotion_id) || hasValue(rec1.promotion_name);
      const hasCreative = hasValue(rec1.creative_name) || hasValue(rec1.creative_slot);

      if (hasPromoIdentity || hasCreative) {
        if (attributionType === 'firstClickAttribution') {
          if (isMissing(tgt.promotion_id) && hasValue(rec1.promotion_id)) tgt.promotion_id = rec1.promotion_id;
          if (isMissing(tgt.promotion_name) && hasValue(rec1.promotion_name)) tgt.promotion_name = rec1.promotion_name;
          if (isMissing(tgt.creative_name) && hasValue(rec1.creative_name)) tgt.creative_name = rec1.creative_name;
          if (isMissing(tgt.creative_slot) && hasValue(rec1.creative_slot)) tgt.creative_slot = rec1.creative_slot;
        } else {
          if (hasPromoIdentity) {
            tgt.promotion_id = rec1.promotion_id;
            tgt.promotion_name = rec1.promotion_name;
          }
          if (hasValue(rec1.creative_name)) tgt.creative_name = rec1.creative_name;
          if (hasValue(rec1.creative_slot)) tgt.creative_slot = rec1.creative_slot;
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

      mergedMap[idKey] = tgt;
    });

    if (limitItemsNumber) {
      const limit = makeInteger(limitItemsNumber);
      if (limit > 0 && orderedKeys.length > limit) {
        if (attributionType === 'firstClickAttribution') {
          orderedKeys = orderedKeys.slice(0, limit);
        } else {
          orderedKeys = orderedKeys.slice(-limit);
        }
      }
    }

    let uniqueItems = orderedKeys.map(function(k) { return mergedMap[k]; });
    if (uniqueItems.length === 0) {
      uniqueItems = [{item_id: "helper_id"}];
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

  // 3. Event-level Promotion attribution branch
  if (promotion_id || promotion_name || creative_name || creative_slot) {
    const promo = {
      creative_name: creative_name,
      creative_slot: creative_slot,
      promotion_id: promotion_id,
      promotion_name: promotion_name,
      location_id: location_id
    };
    const promoAttribution = (attributionType === 'firstClickAttribution' && promo2) ? promo2 : promo;
    let extract = {
      items: items2,
      promotion: promoAttribution,
      search_term: searchTerm2,
      custom_events: mergedCustomEvents,
      timestamp: timestamp
    };
    return jsonData ? JSON.stringify(extract) : extract;
  }

  // 4. Site search attribution branch
  const searchTerm = data.siteSearchChecbox && hasValue(data.searchTerm) ? data.searchTerm : undefined;
  if (searchTerm) {
    const siteSearchttribution = (attributionType === 'firstClickAttribution' && searchTerm2) ? searchTerm2 : searchTerm;
    let extract = {
      search_term: siteSearchttribution,
      items: items2,
      promotion: promo2,
      custom_events: mergedCustomEvents,
      timestamp: timestamp
    };
    return jsonData ? JSON.stringify(extract) : extract;
  }

  // 5. Custom events attribution branch
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

  let fallbackExtract = {
    items: items2,
    promotion: promo2,
    search_term: searchTerm2,
    custom_events: mergedCustomEvents,
    timestamp: timestamp
  };
  return jsonData ? JSON.stringify(fallbackExtract) : fallbackExtract;
}

// ==========================================
// OUTPUT
// ==========================================
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
      if (data.itemSearchTerm && searchTerm2) {
        item.search_term = searchTerm2;
      }

      if (data.itemCustomEvents) {
        const ceKeys = Object.keys(customEvents2 || {});
        if (ceKeys.length > 0) {
          ceKeys.forEach(k => {
            item[k] = currentOrStored(item[k], customEvents2[k]);
          });
        }
      }

      const standardKeys = ['item_id', 'item_list_id', 'item_list_name', 'creative_name', 'creative_slot', 'promotion_id', 'promotion_name', 'location_id', 'index'];

      items2.forEach(item2 => {
        // String coercion protects against string vs number mismatch
        if (item2 && item2.item_id !== 'helper_id' && ('' + item.item_id === '' + item2.item_id)) {
          item.item_list_id = currentOrStored(item.item_list_id, item2.item_list_id);
          item.item_list_name = currentOrStored(item.item_list_name, item2.item_list_name);
          item.creative_name = currentOrStored(item.creative_name, item2.creative_name);
          item.creative_slot = currentOrStored(item.creative_slot, item2.creative_slot);
          item.promotion_id = currentOrStored(item.promotion_id, item2.promotion_id);
          item.promotion_name = currentOrStored(item.promotion_name, item2.promotion_name);
          item.location_id = currentOrStored(item.location_id, item2.location_id);
          item.index = currentOrStored(item.index, item2.index);

          const storedKeys = Object.keys(item2 || {});
          storedKeys.forEach(k => {
            if (standardKeys.indexOf(k) === -1) {
              item[k] = currentOrStored(item[k], item2[k]);
            }
          });
        }
      });
    });
    output = items ? items : undefined;

    // removeNullfromItems processing
    if (data.removeNullfromItems && output) {
      output.forEach(function(object) {
        for (let key in object) {
          if (object[key] === null || object[key] === '' || object[key] === 'null' || object[key] === 'undefined') {
            object[key] = undefined;
          }
        }
      });
    }
  }
  return output;
}
