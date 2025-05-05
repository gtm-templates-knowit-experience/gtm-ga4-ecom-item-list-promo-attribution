const dataLayer = require('copyFromDataLayer');
const ecom = data.ecomVar && data.ecomInputCheckbox ? data.ecomVar : dataLayer('ecommerce', 1);
const getTimestampMillis = require('getTimestampMillis');
const makeInteger = require('makeInteger');
const makeString = require('makeString');
const JSON = require('JSON');
const getCookieValues = require('getCookieValues');
const Object = require('Object');
const getType = require('getType');

const jsonData = data.jsonData;
const secondDataSource = data.secondDataSource && typeof data.secondDataSource === 'string' ? JSON.parse(data.secondDataSource) : data.secondDataSource || undefined;

const event_name = dataLayer('event', 2);
const items = ecom ? ecom.items : undefined;
let items2 = secondDataSource ? secondDataSource.items : [{item_id:"helper_id"}];
let promo2 = secondDataSource ? secondDataSource.promotion : undefined;
let searchTerm2 = secondDataSource ? secondDataSource.search_term : undefined;

const measurementId = data.measurementId && data.customAttributionTime === false ? data.measurementId.split('-')[1] : undefined;
const gaCookie = measurementId && makeString(getCookieValues('_ga_' + measurementId));
let ga_session_id;

if (gaCookie) {
  // 1) new GS2 format (has $ delimiters)
  if (gaCookie.indexOf('$') > -1) {
    // turn all "$" into "." so we only need one split
    const normalized = gaCookie.split('$').join('.');
    const segments = normalized.split('.');
    // find the piece that starts with "s"
    let sPart;
    for (let i = 0; i < segments.length; i++) {
      if (segments[i].charAt(0) === 's') {
        sPart = segments[i];
        break;
      }
    }
    // strip off the "s" and convert to integer
    ga_session_id = sPart ? makeInteger(sPart.substring(1)) : undefined;
  }
  // 2) old GS1 format (only dots)
  else if (gaCookie.indexOf('.') > -1) {
    const parts = gaCookie.split('.');
    ga_session_id = parts.length > 2 ? makeInteger(parts[2]) : undefined;
  }
}

ga_session_id = ga_session_id && getType(ga_session_id) === 'number' ? ga_session_id : 1800000; // Fallback to 30 minutes "just in case".

const timestamp = data.attributionTime ? getTimestampMillis() : ga_session_id;
const timestamp2 = secondDataSource ? secondDataSource.timestamp : timestamp;
const timestampDiff = secondDataSource && data.attributionTime ? timestamp-secondDataSource.timestamp : timestamp;
const attributionTime = data.attributionTime ? makeInteger(data.attributionTime)*60000 : timestamp2;
const attributionType = data.attributionType;
const limitItemsNumber = data.limitItemsNumber;

if(timestampDiff > attributionTime) {
  items2 = [{item_id:"helper_id"}];
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

  if (items1 && item_id && (item_list_id || item_list_name || promotion_id || promotion_name)) {
    const firstClick = attributionType === 'firstClickAttribution';
    const combined = firstClick ? items2.concat(items1) : items1.concat(items2);  // first vs. last click attribution

    const mergedMap = {};
    for (let i = 0; i < items2.length; i++) {
      const oldRec = items2[i];
      // shallow‐clone oldRec into a brand‐new object
      const clone = {};
      const flds  = Object.keys(oldRec);
      for (let j = 0; j < flds.length; j++) {
        const k = flds[j];
        clone[k] = oldRec[k];
      }
      mergedMap[oldRec.item_id] = clone;
    }

    // ================
    // 2) MERGE ONLY the NEW `items1` records
    // ================
    items1.forEach(rec1 => {
      const id = rec1.item_id;
      let tgt   = mergedMap[id];
      if (!tgt) {
        // no seed existed, start fresh
        tgt = { item_id: id };
      }

      const isListEvent  = rec1.item_list_id !== undefined || rec1.item_list_name !== undefined;
      const isPromoEvent = rec1.promotion_id !== undefined || rec1.promotion_name  !== undefined;

      // Item‐List group
      if (isListEvent) {
        if (attributionType === 'firstClickAttribution') {
          if (tgt.item_list_id   === undefined) tgt.item_list_id   = rec1.item_list_id;
          if (tgt.item_list_name === undefined) tgt.item_list_name = rec1.item_list_name;
        } else {
          tgt.item_list_id   = rec1.item_list_id;
          tgt.item_list_name = rec1.item_list_name;
        }
      }

      // Promotion group
      if (isPromoEvent) {
        if (attributionType === 'firstClickAttribution') {
          if (tgt.promotion_id   === undefined) tgt.promotion_id   = rec1.promotion_id;
          if (tgt.promotion_name === undefined) tgt.promotion_name = rec1.promotion_name;
          if (tgt.creative_name  === undefined) tgt.creative_name  = rec1.creative_name;
          if (tgt.creative_slot  === undefined) tgt.creative_slot  = rec1.creative_slot;
        } else {
          tgt.promotion_id   = rec1.promotion_id;
          tgt.promotion_name = rec1.promotion_name;
          tgt.creative_name  = rec1.creative_name;
          tgt.creative_slot  = rec1.creative_slot;
        }
      }

      // Location & index
      if (rec1.location_id !== undefined) {
        if (attributionType === 'firstClickAttribution') {
          if (tgt.location_id === undefined) tgt.location_id = rec1.location_id;
        } else {
          tgt.location_id = rec1.location_id;
        }
      }
      
      if (rec1.index !== undefined) {
        if (attributionType === 'firstClickAttribution') {
          if (tgt.index === undefined) tgt.index = rec1.index;
          } else {
          tgt.index = rec1.index;
        }
      }
      
     mergedMap[id] = tgt;
    });

    // ================
    // 3) EXTRACT & LIMIT
    // ================
    let uniqueItems = Object.keys(mergedMap).map(function(k){ return mergedMap[k]; });
    if (limitItemsNumber) {
      uniqueItems = uniqueItems.slice(0, makeInteger(limitItemsNumber));
    }

    const extract = {
      items: uniqueItems,
      promotion: promo2,
      search_term: searchTerm2,
      timestamp: timestamp
    };
    return jsonData ? JSON.stringify(extract) : extract;
  }
}
  
  if (promotion_id||promotion_name) {
    const promo = {creative_name: creative_name, creative_slot: creative_slot, promotion_id: promotion_id, promotion_name: promotion_name, location_id: location_id};
    
    const promoAttribution = attributionType === 'firstClickAttribution' && promo2 ? promo2 : promo;
    let extract = {items: items2, promotion: promoAttribution, search_term: searchTerm2, timestamp: timestamp};
      extract = jsonData && extract ? JSON.stringify(extract) : extract;
        return extract;
  }
  const searchTerm = data.siteSearchChecbox && data.searchTerm ? data.searchTerm : undefined;
  if (searchTerm) {
    const siteSearchttribution = attributionType === 'firstClickAttribution' && searchTerm2 ? searchTerm2 : searchTerm;
    let extract = {search_term: siteSearchttribution, items: items2, promotion: promo2, timestamp: timestamp};
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
      if(data.itemSearchTerm && searchTerm2 ) {
        item.search_term = searchTerm2;
      }
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

if(data.deleteAttribution === true && event_name === 'purchase') {
  let extract = {search_term:undefined,items:[{item_id:"helper_id"}],promotion:undefined,timestamp:timestamp};
      extract = jsonData && extract ? JSON.stringify(extract) : extract;
        return extract;
}
