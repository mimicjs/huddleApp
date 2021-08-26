export const URL = {
    login: "/login",
    auth: "/auth",
    logout: "/logout",
    register: "/register",
    dashboard: "/dashboard",
    profile: "/profile",
    home: "/home",
    index: "/",
    myLinkedIn: "https://linkedin.com/in/jacky-shew-05ba15135/",
    myGithub: "https://github.com/mimicjs/"
};

//Unable to place in App.js as the error encounters:
//  ReferenceError: can't access lexical declaration 'URL' before initialization
//Reason is the dependencies of App.js require importing of URL thus circular dependency => relies on each other