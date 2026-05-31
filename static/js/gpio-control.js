var gpioStates = new Array(28);

var isConfermation = false;
var isSecurityMode = true;
var isAutoUpdateStates = false;

var btRefresh = document.getElementById("btRefresh");

var switchComfermationWindow = document.getElementById("switchComfermationWindow");
var switchSecurityMode = document.getElementById("switchSecurityMode");
var switchAutoUpdateStates = document.getElementById("switchAutoUpdateStates");
var switchDarkMode = document.getElementById("switchDarkMode");

switchSecurityMode.checked = true;

setAllGPIOStates();

function setPinColor(gpio, state) {
    var btn = document.getElementById("b" + gpio);
    var pin = document.getElementById("p" + gpio);
    if (!btn || !pin) return;

    var row = btn.closest(".card-view-item");
    btn.classList.remove("gpio-high", "gpio-low", "h-green", "green");
    pin.classList.remove("gpio-high", "gpio-low", "green");
    if (row) row.classList.remove("gpio-high", "gpio-low");

    if (state == 1) {
        btn.classList.add("gpio-high");
        pin.classList.add("gpio-high");
        if (row) row.classList.add("gpio-high");
    } else {
        btn.classList.add("gpio-low");
        pin.classList.add("gpio-low");
        if (row) row.classList.add("gpio-low");
    }
}

function setAllGPIOStates() {
    $.ajax({
        type: "GET",
        dataType: "json",
        data: {
            gpiostateall: ""
        },
        success: function(data) {
            for (i = 0; i < 28; i++) {
                gpioStates[i] = data[i];
                setPinColor(i, data[i]);
            }
        }
    });
}

function updateGPIOState(gpio) {
    return $.ajax({
        type: "GET",
        dataType: "json",
        data: {
            gpiostate: gpio
        },
        success: function(data) {
            gpioStates[gpio] = data.state;
            setPinColor(data.gpio, data.state);
        }
    });
}

function gpio(gpio) {
    if (isSecurityMode) {
        var stateBefore = gpioStates[gpio];
        $.when(updateGPIOState(gpio)).done(function(data) {
            if (stateBefore != data.state) {
                alert("The GPIO was already in status: " + data.state)
            } else {
                changeGPIO(gpio);
            }
        });
    } else changeGPIO(gpio);
}

function changeGPIO(gpio) {
    if (isConfermation) {
        if (!confirm("changing the state of the GPIO " + gpio))
            return;
    }

    var state;
    if (gpioStates[gpio] == 0)
        state = 1;
    else state = 0;

    $.ajax({
        type: "GET",
        dataType: "json",
        data: {
            gpio: gpio,
            state: state
        },
        success: function(data) {
            gpioStates[data.gpio] = data.state;
            setPinColor(data.gpio, data.state);
        },
        error: function(data) {
            alert("Error when the GPIO state was changed.");
        }
    });
    if (isAutoUpdateStates)
        setAllGPIOStates();
}

function refresh() {
    btRefresh.innerHTML = "refreshing";
    setAllGPIOStates();
    btRefresh.innerHTML = "Refreshed";
    setTimeout(function() {
        btRefresh.innerHTML = "refresh";
    }, 1000);
}

switchComfermationWindow.addEventListener('change', () => {
    if (switchComfermationWindow.checked)
        isConfermation = true;
    else isConfermation = false;
});

switchSecurityMode.addEventListener('change', () => {
    if (switchSecurityMode.checked)
        isSecurityMode = true;
    else isSecurityMode = false;
});

switchAutoUpdateStates.addEventListener('change', () => {
    if (switchAutoUpdateStates.checked)
        isAutoUpdateStates = true;
    else isAutoUpdateStates = false;
});

switchDarkMode.addEventListener('change', () => {
    if (switchDarkMode.checked)
        document.documentElement.setAttribute('data-theme', 'dark');
    else document.documentElement.setAttribute('data-theme', 'light');
});

(function initViewTabs() {
    var tabs = document.querySelectorAll('.nav-tab');
    var panels = document.querySelectorAll('.view-panel');
    var validViews = ['gpiocontrol', 'settings', 'about'];

    function showView(viewId) {
        if (validViews.indexOf(viewId) === -1)
            viewId = 'gpiocontrol';

        panels.forEach(function(panel) {
            var active = panel.dataset.view === viewId;
            panel.classList.toggle('view-active', active);
            panel.hidden = !active;
        });

        tabs.forEach(function(tab) {
            tab.classList.toggle('active', tab.dataset.view === viewId);
        });

        document.body.classList.toggle('view-gpio', viewId === 'gpiocontrol');

        history.replaceState(null, '', '#' + viewId);
    }

    tabs.forEach(function(tab) {
        tab.addEventListener('click', function(event) {
            event.preventDefault();
            showView(tab.dataset.view);
        });
    });

    var hash = location.hash.replace('#', '');
    showView(hash || 'gpiocontrol');

    window.addEventListener('hashchange', function() {
        showView(location.hash.replace('#', ''));
    });
})();
