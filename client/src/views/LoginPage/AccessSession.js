import { useContext } from 'react';

import { AuthContext } from '../../context/auth';

function AccessSession() {

    const context = useContext(AuthContext);
    context.Access_Session();

    return (
      null
  );
};

export default AccessSession;