/**************************************************************************
 * CREATOR: JACKY S
 * CREATED ON: May 2021
 * BACKLOG ITEM ID: <MVP_001>
 * DESCRIPTION: Helper functions
 * 
 * CHANGE HISTORY
 * =======================
 * DATE    BACKLOG ITEM   USER  DESCRIPTION 
 * 
**************************************************************************/

function hasOwnProperty<X extends {}, Y extends PropertyKey>(pObject: X, pProperty: Y): pObject is X & Record<Y, unknown> {
  return pObject.hasOwnProperty(pProperty) || (pProperty in pObject)
};

const isNullOrEmpty = (pObject:any) => {
  return pObject === null || undefined
    ? true
    : (() => {
      for (const prop in pObject) {
        if (Object.prototype.hasOwnProperty.call(pObject, prop)) {
          return false;
        }
      }
      return true;
    })();
};

function isObjectID(pString: any) {
  const vErrorMessage = 'Invalid ObjectID must be a single String of 12 bytes or a string of 24 hex characters';
  if(!pString){
    return vErrorMessage;
  };
  pString = pString.toString();
  if(!(pString.match(/^[0-9a-fA-F]{24}$/))){ //Invalid ObjectID must be a single String of 12 bytes or a string of 24 hex characters
    return vErrorMessage;
  };
  return null;
};

function isValidEmailAddress(pString: string){
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!pString.match(regEx)) {
      return 'Invalid email format';
  };
  return null;
};

function retrieveCookieValue(context: { [key: string]: any }, pCookieName : string){
  if (!context || !context.req || !hasOwnProperty(context.req.headers, 'cookie')) { //Headers Validation: includes cookie header
    return null;
  };
  let vCookie = context.req.headers.cookie.split(';').find( //Split cookie string into string array
      (cookie: string) => cookie.includes(pCookieName)
  );
  if (isNullOrEmpty(vCookie)) { //Cookie Validation: Does pCookieName exist
      return null;
  };
  vCookie = vCookie.substr(pCookieName.length + 1); //JWT Token: +1 to omit '=' from e.g. 'refresh='
  return vCookie;
}

export const objectHelper = {
  hasOwnProperty,
  isNullOrEmpty,
  isObjectID,
  isValidEmailAddress,
  retrieveCookieValue
};