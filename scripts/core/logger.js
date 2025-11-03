

(function(){
    'use strict';

    
    function isDebugEnabled() {
        try {
            const search = (typeof location !== 'undefined' && location.search) ? location.search : '';
            if (search.indexOf('debug=1') !== -1) return true;
            if (typeof localStorage !== 'undefined' && localStorage.getItem('HUB_DEBUG') === '1') return true;
        } catch (e) {
            
        }
        return false;
    }

    const debugEnabled = isDebugEnabled();

    
    const orig = {
        log: console.log && console.log.bind(console),
        info: console.info && console.info.bind(console),
        debug: console.debug && console.debug.bind(console)
    };

    
    function noop() {}

    
    try {
        if (!debugEnabled) {
            console.log = noop;
            console.info = noop;
            console.debug = noop;
        }
    } catch (e) {
        
    }

    
    window.__HUB__LOGGER = {
        enabled: !!debugEnabled,
        enable() {
            try {
                if (this.enabled) return;
                if (orig.log) console.log = orig.log;
                if (orig.info) console.info = orig.info;
                if (orig.debug) console.debug = orig.debug;
                this.enabled = true;
                try { localStorage.setItem('HUB_DEBUG', '1'); } catch (e) {}
            } catch (e) {}
        },
        disable() {
            try {
                if (!this.enabled) return;
                console.log = noop;
                console.info = noop;
                console.debug = noop;
                this.enabled = false;
                try { localStorage.removeItem('HUB_DEBUG'); } catch (e) {}
            } catch (e) {}
        }
    };

})();
