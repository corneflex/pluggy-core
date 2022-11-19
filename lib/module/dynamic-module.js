import React from 'react';
function loadModule(url) {
    try {
        return import(/* webpackIgnore:true */ url);
    }
    catch (e) { }
    return null;
}
function loadComponent(remoteUrl, scope, module) {
    return async () => {
        // eslint-disable-next-line no-undef
        await __webpack_init_sharing__('default');
        const container = await loadModule(remoteUrl);
        console.log(container);
        // eslint-disable-next-line no-undef
        await container.init(__webpack_share_scopes__.default);
        const factory = await container.get(module);
        const Module = factory();
        return Module;
    };
}
const urlCache = new Set();
const useDynamicScript = (url) => {
    const [ready, setReady] = React.useState(false);
    const [errorLoading, setErrorLoading] = React.useState(false);
    React.useEffect(() => {
        if (!url)
            return;
        if (urlCache.has(url)) {
            setReady(true);
            setErrorLoading(false);
            return;
        }
        setReady(false);
        setErrorLoading(false);
        const element = document.createElement('script');
        element.src = url;
        element.type = 'text/javascript';
        element.async = true;
        element.onload = () => {
            urlCache.add(url);
            setReady(true);
        };
        element.onerror = () => {
            setReady(false);
            setErrorLoading(true);
        };
        document.head.appendChild(element);
        return () => {
            urlCache.delete(url);
            document.head.removeChild(element);
        };
    }, [url]);
    return {
        errorLoading,
        ready,
    };
};
const componentCache = new Map();
export const useFederatedComponent = (remoteUrl, scope, module) => {
    const key = `${remoteUrl}-${scope}-${module}`;
    const [Component, setComponent] = React.useState(null);
    //const { ready, errorLoading } = useDynamicScript(remoteUrl);
    React.useEffect(() => {
        if (Component)
            setComponent(null);
        // Only recalculate when key changes
    }, [key]);
    React.useEffect(() => {
        if (!Component) {
            const Comp = React.lazy(loadComponent(remoteUrl, scope, module));
            componentCache.set(key, Comp);
            setComponent(Comp);
        }
        // key includes all dependencies (scope/module)
    }, [Component, key]);
    return { Component };
};
