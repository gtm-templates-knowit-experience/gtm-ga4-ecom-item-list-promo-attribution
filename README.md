# GA4 - Item List & Promotion Attribution - GTM Variable (Web)
**Google Analytics 4 (GA4)** has **Item List & Promotion reports**. But, unlike **Enhanced Ecommerce**, no revenue or conversions are attributed back to Promotion or Item Lists (at the time of creating this solution).

This Variable for **GTM (Web)** makes it possible to attribute **GA4 Item List, Promotion & Search Term** to revenue or ecommerce Events (ex. purchase):
* Last Click Attribution
* First Click Attribution
* Attribution Time (for how long should Item List, Promotion or Search Term be attributed)

![GA4 Item List Attribution example](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-item-list-promo-attribution/blob/main/images/ga4-item-list-attribution-animation.gif)

A similar Variable [do also exist for **Server-side GTM**](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution). Differences between doing the attribution with GTM (Web) vs. Server-side GTM are listed below.

| Functionality  | GTM (Web) | Server-side GTM |
| ------------- | ------------- | ------------- |
| Cross (sub)domain tracking | No | Yes |
| Server to Server-side (Measurement Protocol) | No | Yes |
| Attribution/processing | Users browser | Server-side |
| Attribution time | Custom Time | GA4 Session or Custom Time |
| Storage Limitation | Yes | No |
| Costs Money | No | Yes |

In the following documentation, **Local Storage** will be used to handle the attribution.

## GTM (Web) Setup
Install the following GTM (Web) Templates:
* GA4 - Item List & Promotion Attribution (this Variable Template)
*	[Local Storage Interact](https://tagmanager.google.com/gallery/#/owners/gtm-templates-anto-hed/templates/gtm-local-storage-interact) Tag
* [Local Storage Checker](https://tagmanager.google.com/gallery/#/owners/gtm-templates-anto-hed/templates/local-storage-checker) Variable

### Create Variables
We must create a decent number of Variables. Suggested Variable names are listed below, and are also used throughout the documentation.
*	ecom - attribution time - minutes – C
*	ecom - item_list & promotion - Local Storage
*	ecom - item_list & promotion - extract – CT
*	ecom - items - item_list & promotion - merge – CT
*	++

### ecom - attribution time - minutes – C
Since attribution time is referenced in several variables, it’s recommended to create a Constant Variable with the attribution time in minutes.
How long the attribution time should be is up to you. Time is counted from the last **select_promotion**, **select_item** or **add_to_cart** Event. 

![ecom - attribution time - minutes – C](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution/blob/main/images/ecom-attribution%20time-minutes-C.png)

* Name the Variable **ecom - attribution time - minutes - C**.

### ecom - item_list & promotion - Local Storage
We are using the **Local Storage Checker** to read data from Local Storage. 
For some unknown reason, this Variable doesn't allow any Key to be used without changing the Template, so for simplicity in this documentation we stick to one of the allowed Keys:

*	**Action:** get
*	**Key:** internal

![ecom - item_list & promotion - Local Storage](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-item-list-promo-attribution/blob/main/images/Variable-Local-Storage.png)

* Name the Variable **ecom - item_list & promotion - Local Storage**.

### ecom - item_list & promotion - extract – CT
Select the **GA4 Ecommerce – Item List & Promotion Attribution** Variable (this Template). This variable will **extract Item List & Promotion data** from GA4 Ecommerce and create the attribution. With other words, attribution happens at collection time.

*	**Variable Type:** Extract Item Lists & Promotion for Attribution
*	**Second Data Source:** {{ecom - item_list & promotion - Local Storage}}
* Attribution
  * **Attribution Time in Minutes:** {{ecom - attribution time - minutes – C}}
  * **Attribution Type:** Select Last or First Click Attribution
* Site Search
  * **Search Term:** Insert Variable that contains **search_term** value, ex. **{{search_term - Query}}**.
* Other Settings
  * **Handle data as string:** This will save attribution data as a string. Tick this box with this setup.
  * **Limit Items:** This will limit number of Items stored. You should probably limit number of items, but that is up to you. You can store up to 5MB in Local Storage.

![ecom - item_list & promotion - extract – CT](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-item-list-promo-attribution/blob/main/images/gtm-ga4-item_list-and-promotion-extract-CT.png)

* Name the Variable **ecom - item_list & promotion - extract – CT**.

### ecom - items - item_list & promotion - merge – CT

Select the **GA4 Ecommerce – Item List & Promotion Attribution Variable** (this Template). This Variable merges Implemented data & data from Second Data Source (ex. Local Storage).

* **Variable Type:** Return Attributed Output
* **Output:** Items
* **Remove null or empty values from Items:** Check this box if your implementation have Item Dimensions with null, "null", "undefined" or empty values.
* **Second Data Source:** {{ecom - item_list & promotion - Local Storage}}
* Attribution
  * **Attribution Time in Minutes:** {{ecom - attribution time - minutes – C}}

![ecom - items - item_list & promotion - merge – CT](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-item-list-promo-attribution/blob/main/images/gtm-ga4-items-item_list-and-promotion-merge-CT.png)

*	Name the Variable **ecom - items - item_list & promotion - merge – CT**.

In addition, you must create **Promotion & Search Term Variables** using the same Variable Type if you have implemented **Promotion without Items**, or if you want to attribute Search Term:

| Variable Name  | Output |
| ------------- | ------------- |
| ecom - location_id - merge - CT | Location ID |
| ecom - promo - creative_name - merge - CT | Creative Name |
| ecom - promo - creative_slot - merge - CT | Creative Slot |
| ecom - promo - promotion_id – merge - CT | Promotion ID |	
| ecom - promo - promotion_name – merge - CT | Promotion Name |	
| ecom - search_term - merge - CT | Search Term |	

## Trigger
### ecom - select_item, select_promotion & add_to_cart

Create a **Custom Event Trigger** with the following settings:

*	**Event Name:** ^(select_item|select_promotion|add_to_cart)$
*	**Use regex matching:** Tick the box
*	**This trigger fires on:* Some Custom Events
*	**ecom – item_list & promotion – extract – CT** _does not equal_ undefined

![ecom - select_item, select_promotion & add_to_cart](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-item-list-promo-attribution/blob/main/images/Trigger-Local-Storage-Tag.png)

*	Name the Trigger **ecom - select_item, select_promotion & add_to_cart**.

## Tags

### Ecom - Item List & Promotion Attribution – Local Storage
Select the **Local Storage Interact** Tag, and add the following settings:

* **Action:** set
* **Key:** internal
* **Value:** {{ecom - item_list & promotion - extract - CT}}

![Ecom - Item List & Promotion Attribution – Local Storage](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-item-list-promo-attribution/blob/main/images/Tag-Local-Storage.png)

* Add **ecom - select_item, select_promotion & add_to_cart** as a Trigger to the Tag.
* * If you want to track **search_term**, add the same Trigger as you are using for tracking your **view_search_results** Event.

### GA4 Tag – Parameters
All GA4 Ecommerce Tags that should use attributed data have to be changed. These are the recommended GA4 Events:

* purchase *
* add_payment_info
* add_shipping_info
* begin_checkout *
* view_cart
* remove_from_cart
* add_to_cart *
* add_to_wishlist
* view_item

These Events are necessary for a complete **GA4 Item lists: Item list name** report *

The following Parameters should be changed in the Tags with those Events:

| Parameter Name  | Value | Note |
| ------------- | ------------- | ------------- |
| items | {{ecom - items - item_list & promotion - merge - CT}} |  |
| promotion_name | {{ecom - promo - promotion_name - merge - CT}} | If Promotion without Items is implemented |
| promotion_id | {{ecom - promo - promotion_id - merge - CT}} | If Promotion without Items is implemented |
| creative_name | {{ecom - promo - creative_name - merge - CT}} |	 If Promotion without Items is implemented |
| creative_slot | {{ecom - promo - creative_slot - merge - CT}} | If Promotion without Items is implemented |
| location_id | {{ecom - location_id - merge - CT}} |	 If Promotion without Items is implemented |
| search_term | {{ecom - search_term - merge - CT}} |	 If you want to attribute search_term |

![GA4 Tag - Parameters](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-item-list-promo-attribution/blob/main/images/Tag-GA4-Tag.png)

Your GTM (Web) setup is now complete, but you can do even more to control attribution. If the case is that customers usually do several purchases within a session, then you maybe want to delete attribution data after each purchase.

## Web implementation
To make the attribution work, also the implementation on the website must be correct. It’s especially implementation of Item List that can be incorrect.

**All attribution in this solution is tied back to the following Events:**
*	select_item, add_to_cart (from a list) or select_promotion

When it comes to filling out the **location_id** parameter, if you don’t have **Place ID** as Google suggest using, fill this parameter with **Page Path** instead. Then you will get Page Path attributed as well.

The GA4 Event documentation allows for implementation of **Item List and Promotion** on both the **Event-level** and **Item-level**. This Template supports both implementations.

### Promotion implementation
It’s recommended to implement all promotion parameters, but as a minimum for this attribution to work you must implement either **promotion_id** or **promotion_name** with the **[select_promotion](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#select_promotion)** Event.

### Item List Implementation

The following Events should have Item List implemented. The rest of the ecommerce Events will read the Item List data from this Template.
*	[view_item_list](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_item_list)
* [select_item](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#select_item)
* [add_to_cart](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#add_to_cart)

Implementing Item List for the **add_to_cart** Event has though an exception. Item Lists should only be implemented if the Item is added to cart directly from an Item List. 

You should never implement a **Product Page Item List**. The reason for this is that this will overwrite the Item List the user arrived from (ex. a “Related Products” list), and you will not be able to tell how well the “Related Products” list is working in terms of sales.

## GTM (Web) Setup
To make the attribution work, the **GTM (Web)** setup must also be correct.

In the examples below, the setup handles implementation both on the Event-level and Item-level.

In the setup you will see that Data Layer is mostly Version 1. The **[GA4 Ecom Items - DLV Version 1](https://github.com/gtm-templates-knowit-experience/gtm-ga4-ecom-items-dlv-version-1-variable)** Variable Template is used for achieving that.

### select_promotion & view_promotion
This setup handles both **select_promotion** & **view_promotion**, where promotion also has **Event-level Item Lists**. **location_id** is set to **Page Path**.

![select_promotion & view_promotion](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution/blob/main/images/gtm-ga4-tag-select_promotion.png)

### select_item & view_item_list
This setup handles both **select_item** & **view_item_list**, with **Event-level Item Lists**. **location_id** is set to **Page Path**.

![select_promotion & view_promotion](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution/blob/main/images/gtm-ga4-tag-select_item.png)

### add_to_cart & view_item
This setup handles **add_to_cart** & **view_item**. **location_id** in this setups is also **Page Path**, but Page Path will only be returned if **item_list_name** or **item_list_id** exist. Otherwise **location_id** will be **undefined**.

![select_promotion & view_promotion](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution/blob/main/images/gtm-ga4-tag-add_to_cart-view_item.png)

## Attribution explained

This solution can do either **Last Click** or **First Click Attribution**.

Attribution happens on 2 levels: Promotion without Items (Event-level), and the Item-level. In addition, Item-level trumps the Event-level.

To get a better understanding of the attribution, it's recommended to run some test scenarios where you inspect your own data:
* Run **GTM (Web)** in **Preview Mode**
* Look at the **Local Storage** data being built or rewritten
* Inspect especially **Items** in **GA4 DebugView**

### Last Click Attribution
With a Last Click Attribution model, this user journey illustrates the attribution:
1. User clicks on “**Promotion 1 without Items**” (promotion without any Items attached to the promotion). This is an Event-level promotion, and “Promotion 1 without Items” is the attributed Event-level promotion.
    - On the “Promotion 1 without Items” page, there is a “**Promotion 2 without Items**” promotion, and the user clicks on the promotion. This promotion is also an Event-level promotion. “Promotion 2 without Items” is now attributed to the Event-level promotion.
2. The user clicks next on a promotion for a bundled phone with earbuds package (“**Promotion 3 with Items**”). This promotion has 2 items attached, the phone and the earbuds. This promotion is attached to the 2 different Item Id’s (**item_id = phone1** and **item_id = earbud2**) and is therefore an Item-level promotion. 
   -	User adds this bundle with 2 items to cart. The add_to_cart Event is attributed to the promotion.
      - User clicks after that on the “**Users Also Looked At**” Item List with other earbuds that it’s also possible to choose. The earbud (item_id = earbud3) the user clicked on is attributed to the “Users Also Looked At” item list. 
        - On this page, there is also an “Users Also Looked At” item list. User clicks on the first selected earbud (**item_id = earbud2**). The earbud is now attributed to the “Users Also Looked At” item list and is no longer attributed to the initial Item-level promotion.
3. User completes the purchase, and GA4 adds some logic to the result, namely that Item-level trumps the Event-level.
    - The phone (**item_id = phone1**) is attributed to the “**Promotion 3 with Items**” promotion. The promotion didn’t have any Item List, so no Item Lists are attributed. If the promotion also had an Item List, this list would have been attributed.
    - The earbud (**item_id = earbud2**) is attributed to the “**Users Also Looked At**” item list, but in addition, since this item doesn’t have any Item-level promotion, the Event-level promotion “**Promotion 2 without Items**” is also attributed to the earbud. 
      - Since Item-level trumps Event-level, “**Promotion 2 without Items**” is not attributed to the phone, since this has an Item-level promotion attributed.

### First Click Attribution
In the same scenario, but using First Click Attribution, this would be the result:

1.	Both the phone (**item_id = phone1**) and the earbud (**item_id = earbud2**) would both be attributed to the Item-level “**Promotion 3 with Items**” bundle promotion.
    - “**Users Also Looked At**” item list would not be attributed to the sale.
    - None of the Event-level promotions “**Promotion 1 without Items**” or “**Promotion 2 without Items**” would be attributed since Item-level trumps Event-level.
