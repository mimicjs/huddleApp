import React from 'react';
import { Redirect } from 'react-router-dom';

function NotFound({ component: Component, ...rest }) {
    return (
        <Redirect to={'/'} />
    )
};

export default NotFound;