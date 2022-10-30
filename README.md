# GA4 Ecommerce - Item List & Promotion Attribution - GTM (Web) Variable
**Google Analytics 4 (GA4)** has **Item List & Promotion reports**. But, unlike **Enhanced Ecommerce**, no revenue or conversions are attributed back to Promotion or Item Lists (at the time of creating this solution).

This Variable for **GTM (Web)** makes it possible to attribute GA4 Item List & Promotion to revenue or ecommerce Events (ex. purchase):
* Last Click Attribution
* First Click Attribution
* Attribution Time (for how long should Item List or Promotion be attributed)
* Can handle attributed data as both array & string

A similar Variable do also exist for [**Server-side GTM**](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution). That variable is recommended before this one, since everything is handled outside the users browser, and works across (sub)domains.

In the following documentation, **Local Storage** will be used to handle the attribution, but there are also other storage methods to consider:

* [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
* [Cookies](https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies)
* [Session Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage)
* [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

Make sure you understand pros & cons for the different storage methods before picking one.

## GTM (Web) Setup
Install the following GTM (Web) Templates:
* GA4 Ecommerce - Item List & Promotion Attribution (this Variable Template)
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

Image of Variable here.

* Name the Variable **ecom - item_list & promotion - Local Storage**.

### ecom - item_list & promotion - extract – CT
Select the **GA4 Ecommerce – Item List & Promotion Attribution** Variable (this Template). This variable will **extract Item List & Promotion dat**a from GA4 Ecommerce and create the attribution. With other words, attribution happens at collection time.

*	**Variable Type:** Extract Item Lists & Promotion for Attribution
*	**Second Data Source:** {{ecom - item_list & promotion - Local Storage}}
* Attribution
  * **Attribution Time in Minutes:** {{ecom - attribution time - minutes – C}}
  * **Attribution Type:** Select Last or First Click Attribution
* Other Settings
  * **Handle data as string:** This will save attribution data as a string. Tick this box with this setup.
  * **Limit Items:** This will limit number of Items stored. You should probably limit number of items, but that is up to you. You can store up to 5MB in Local Storage.

![ecom - item_list & promotion - extract – CT](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution/blob/main/images/ecom-item_list-and-promotion-extract-CT.png)

* Name the Variable **ecom - item_list & promotion - extract – CT**.

### ecom - items - item_list & promotion - merge – CT

Select the **GA4 Ecommerce – Item List & Promotion Attribution Variable** (this Template). This Variable merges Implemented data & data from Second Data Source (ex. Local Storage).

* **Variable Type:** Return Attributed Output
* **Output:** Items
* **Second Data Source:** {{ecom - item_list & promotion - Local Storage}}
* Attribution
  * **Attribution Time in Minutes:** {{ecom - attribution time - minutes – C}}

![ecom - items - item_list & promotion - merge – CT](https://github.com/gtm-templates-knowit-experience/sgtm-ga4-ecom-item-list-promo-attribution/blob/main/images/ecom-items-item_list-and-promotion-merge-CT.png)

*	Name the Variable **ecom - items - item_list & promotion - merge – CT**.

In addition, you should create **Promotion Variables** using the same Variable Type:

| Variable Name  | Output |
| ------------- | ------------- |
| ecom - location_id - merge - CT | Location ID |
| ecom - promo - creative_name - merge - CT | Creative Name |
| ecom - promo - creative_slot - merge - CT | Creative Slot |
| ecom - promo - promotion_id – merge - CT | Promotion ID |	
| ecom - promo - promotion_name – merge - CT | Promotion Name |	

## Trigger
### ecom - select_item, select_promotion & add_to_cart

Create a **Custom Event Trigger** with the following settings:

*	**Event Name:** ^(select_item|select_promotion|add_to_cart)$
*	**Use regex matching:** Tick the box
*	**This trigger fires on:* Some Custom Events
*	**ecom – item_list & promotion – extract – CT** _does not equal_ undefined

Image of Trigger here.

*	Name the Trigger **ecom - select_item, select_promotion & add_to_cart**.

## Tags

### Ecom - Item List & Promotion Attribution – Local Storage
Select the **Local Storage Interact** Tag, and add the following settings:

* **Action:** set
* **Key:** internal
* **Value:** {{ecom - item_list & promotion - extract - CT}}

Image of Tag setup here

* Add **ecom - select_item, select_promotion & add_to_cart** as a Trigger to the Tag.

### GA4 Tag – Parameters
All GA4 Ecommerce Tags that should use attributed data have to be changed. These are the GA4 Events that should use attributed data:

* purchase
* add_payment_info
* add_shipping_info
* begin_checkout
* remove_from_cart
* add_to_cart
* view_item

The following Parameters should be changed in the Tags with those Events:

| Parameter Name  | Value |
| ------------- | ------------- |
| items | {{ecom - items - item_list & promotion - merge - CT}} |
| promotion_name | {{ecom - promo - promotion_name - merge - CT}} |
| promotion_id | {{ecom - promo - promotion_id - merge - CT}} |
| creative_name | {{ecom - promo - creative_name - merge - CT}} |	
| creative_slot | {{ecom - promo - creative_slot - merge - CT}} |
| location_id | {{ecom - location_id - merge - CT}} |	

Image of example setup here.

* **Your GTM (Web) setup is now complete!**

## Web implementation
To make the attribution work, also the implementation on the website must be correct. It’s especially implementation of Item List that can be incorrect.

**All attribution in this solution is tied back to the following Events:**
*	select_item, add_to_cart (from a list) or select_promotion

When it comes to filling out the **location_id** parameter, if you don’t have **Place ID** as Google suggest using, fill this parameter with **Page Path** instead. Then you will get Page Path attributed as well.

The GA4 Event documentation allows for implementation of Item List and Promotion on both the Event-level and Item-level. This Template supports both implementations.

### Promotion implementation
It’s recommended to implement all promotion parameters, but as a minimum for this attribution to work you must implement either **promotion_id** or **promotion_name** with the **[select_promotion](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#select_promotion)** Event.

### Item List Implementation

The following Events should have Item List implemented. The rest of the ecommerce Events will read the Item List data from this Template.
*	[view_item_list](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#view_item_list)
* [select_item](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#select_item)
* [add_to_cart](https://developers.google.com/analytics/devguides/collection/ga4/reference/events#add_to_cart)

Implementing Item List for the **add_to_cart** Event has though an exception. Item Lists should only be implemented if the Item is added to cart directly from an Item List. 

You should never implement a **Product Page Item List**. The reason for this is that this will overwrite the Item List the user arrived from (ex. a “Related Products” list), and you will not be able to tell how well the “Related Products” list is working in terms of sales.

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