define(['app/services/pubg'], function(pubgapi) {
    let settings_data = null;

    return {
        init
    };

    function init(events) {
        initUIEvents();
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
        } else {
            document.addEventListener('DOMContentLoaded', function(event) {
            });
        }
    }

    function initUI() {
        document.querySelector('body').classList.remove('loading');
    }

    function initUIEvents() {
        if (window.overwolf) {
            let eventBus = overwolf.windows.getMainWindow().eventBus;

            eventBus.on('installation', function() {
                let installation = document.querySelector('#installation');
                installation.style.display = 'block';

                let button = installation.querySelector('#step1-check');
                button.addEventListener('click', function() {
                    button.disabled = true;

                    let nickname = installation.querySelector('#step1-username').value.trim();
                    let status = installation.querySelector('div[data-role="status"]');
                    status.classList.remove('error');
                    status.classList.add('loading');

                    if (nickname) {
                        (async function() {
                            try {
                                let accountId = await pubgapi.getAccountId(nickname);
                                status.classList.remove('loading');
                                status.classList.add('success');
                                eventBus.trigger('obtaintUserData', {
                                    username: nickname,
                                    accountId: accountId
                                });
                            } catch(e) {
                                // user not found or other error
                                button.disabled = false;
                                status.classList.remove('loading');
                                status.classList.add('error');
                            }
                        }) ();
                    }
                });
                addHelp(eventBus);
                initUI();
            });

            eventBus.on('settings', function(event) {
                settings_data = JSON.parse(JSON.stringify(event));
                let settings = document.querySelector('#settings');
                settings.style.display = 'block';

                document.querySelector('#step2-username').value = settings_data.username;

                let clear = settings.querySelector('#clear');
                clear.addEventListener('click', function() {
                    let a = confirm('All saved data will be removed from this computer. Are you sure?');
                    if (a) {
                        clear.disabled = true;

                        eventBus.trigger('resetApp');
                    }
                });
                addHelp(eventBus);

                let save = document.querySelector('#save');
                save.addEventListener('click', function(event) {
                    eventBus.trigger('saveSettings', settings_data.settings);
                });

                let close = document.querySelector('#close');
                close.addEventListener('click', function(event) {
                    eventBus.trigger('closeWindow', { type: 'settings' });
                });

                let show_statistic = document.querySelector('#show-statictic');
                show_statistic.checked = !!settings_data.settings.show_statictic;
                show_statistic.addEventListener('change', function() {
                    settings_data.settings.show_statictic = this.checked;
                });

                let favorite_add = document.querySelector('#favorite-add');
                favorite_add.addEventListener('click', function() {
                    let icon_node = document.querySelector('#add-icon');
                    let name_node = document.querySelector('#add-name');

                    let icon = icon_node.value.trim(),
                        name = name_node.value.trim();

                    if (name && icon) {
                        icon_node.value = '';
                        name_node.value = '';
                        settings_data.settings.favorite.push({ icon: icon, name: name });
                        renderFavorite();
                    }
                });

                let ks = document.querySelector('#ks'),
                    ds = document.querySelector('#ds');

                ks.value = settings_data.settings.ks_amount;
                ds.value = settings_data.settings.ds_amount;

                ks.addEventListener('change', function() {
                    settings_data.settings.ks_amount = parseInt(this.value);
                });

                ds.addEventListener('change', function() {
                    settings_data.settings.ds_amount = parseInt(this.value);
                });

                renderFavorite();
                initUI();
            });
            eventBus.loaded.push('settings');
        }
    }

    function addHelp(eventBus) {
        let help_button = document.querySelector('#help');
        help_button.addEventListener('click', function(event) {
            eventBus.trigger('requestHelp');
        });
    }

    function renderFavorite() {
        let list = document.querySelector('.favorite-list');
        list.innerHTML = '';
        if (settings_data && settings_data.settings.favorite) {
            settings_data.settings.favorite.forEach(f => {
                let div = document.createElement('div');
                let image = document.createElement('img');
                image.src = f.icon;
                let span = document.createElement('span');
                span.innerHTML = f.name;
                let button = document.createElement('button');
                button.classList.add('reset');
                button.innerHTML = 'x';
                button.addEventListener('click', function(event) {
                    settings_data.settings.favorite.splice(settings_data.settings.favorite.indexOf(f), 1);
                    renderFavorite();
                });

                div.appendChild(image)
                div.appendChild(document.createTextNode(' '));
                div.appendChild(span);
                div.appendChild(document.createTextNode(' '));
                div.appendChild(button);
                list.appendChild(div);
            });
        }
    }
});