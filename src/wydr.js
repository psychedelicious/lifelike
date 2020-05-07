import React from 'react';

// WHY DID YOU RENDER?
// Commented even in dev mode because of potential performance impact.

if (process.env.NODE_ENV === 'development') {
  const whyDidYouRender = require('@welldone-software/why-did-you-render');
  const ReactRedux = require('react-redux');
  const options = {
    trackAllPureComponents: true,
    trackHooks: true,
    trackExtraHooks: [[ReactRedux, 'useSelector']],
  };
  whyDidYouRender(React, options);
}
